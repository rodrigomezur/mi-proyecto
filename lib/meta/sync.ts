import { createServerClient } from '@/lib/db/supabase'

const META_API_VERSION = 'v21.0'
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`

// ── Types ────────────────────────────────────────────────────

type MetaInsight = {
  spend?: string
  impressions?: string
  clicks?: string
  ctr?: string
  cpm?: string
  actions?: Array<{ action_type: string; value: string }>
  cost_per_action_type?: Array<{ action_type: string; value: string }>
  purchase_roas?: Array<{ value: string }>
  video_p25_watched_actions?: Array<{ value: string }>
  video_p50_watched_actions?: Array<{ value: string }>
  video_p75_watched_actions?: Array<{ value: string }>
  video_p100_watched_actions?: Array<{ value: string }>
}

type MetaAd = {
  id: string
  name?: string
  status?: string
  campaign?: { name?: string }
  adset?: { name?: string }
  creative?: {
    id?: string
    video_id?: string
    image_url?: string
    thumbnail_url?: string
    object_story_spec?: {
      video_data?: { video_id?: string; title?: string; message?: string; call_to_action?: { type?: string } }
      link_data?: { image_url?: string; picture?: string; title?: string; message?: string; description?: string; call_to_action?: { type?: string } }
      photo_data?: { url?: string }
    }
    asset_feed_spec?: { videos?: Array<{ video_id?: string }> }
  }
  insights?: { data?: MetaInsight[] }
}

type TransformedAd = {
  ad_id: string
  ad_name: string | null
  campaign: string | null
  ad_set: string | null
  ad_status: string | null
  ad_type: string | null
  video_url: string | null
  image_url: string | null
  video_thumbnail_url: string | null
  spend: number
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  cpa: number
  roas: number
  cpm: number
  link_clicks: number
  video_views_3s: number
  hook_rate: number
  hold_rate: number
  video_25: number
  video_50: number
  video_75: number
  video_100: number
  cost_per_video_view: number
  ad_headline: string | null
  ad_description: string | null
  ad_cta: string | null
}

// ── Fetch Ads from Meta ─────────────────────────────────────

async function fetchMetaAds(adAccountId: string, accessToken: string, dateRangeDays: number): Promise<MetaAd[]> {
  const fields = [
    'id', 'name', 'status',
    'campaign{name}',
    'adset{name}',
    'creative{id,video_id,object_story_spec,asset_feed_spec,image_url,thumbnail_url}',
    `insights.date_preset(last_${dateRangeDays}d){spend,impressions,clicks,ctr,actions,cost_per_action_type,purchase_roas,cpm,video_p25_watched_actions,video_p50_watched_actions,video_p75_watched_actions,video_p100_watched_actions}`,
  ].join(',')

  const allAds: MetaAd[] = []
  let nextUrl: string | null = `${META_BASE_URL}/${adAccountId}/ads?fields=${fields}&limit=100&access_token=${accessToken}`

  while (nextUrl) {
    const res: Response = await fetch(nextUrl)
    const data = await res.json()

    if (data.error) {
      throw new Error(`Meta API: ${data.error.message}`)
    }

    if (data.data) {
      allAds.push(...data.data)
    }

    nextUrl = data.paging?.next || null
  }

  return allAds
}

// ── Transform Ad Data ───────────────────────────────────────

function getActionValue(actions: MetaInsight['actions'], type: string): number {
  if (!actions) return 0
  const action = actions.find(a => a.action_type === type)
  return action ? parseFloat(action.value) || 0 : 0
}

function getCostPerAction(costs: MetaInsight['cost_per_action_type'], type: string): number {
  if (!costs) return 0
  const cost = costs.find(c => c.action_type === type)
  return cost ? parseFloat(cost.value) || 0 : 0
}

function transformAdData(ad: MetaAd, adAccountId: string): TransformedAd {
  const insights = ad.insights?.data?.[0]
  const creative = ad.creative
  const storySpec = creative?.object_story_spec
  const videoData = storySpec?.video_data
  const linkData = storySpec?.link_data
  const assetFeed = creative?.asset_feed_spec

  // Detect ad type
  const videoId = videoData?.video_id || creative?.video_id || assetFeed?.videos?.[0]?.video_id
  const adType = videoId ? 'video' : 'image'

  // Image URL (priority chain)
  let imageUrl = linkData?.image_url || linkData?.picture || creative?.image_url || creative?.thumbnail_url || null

  // Video URL
  const videoUrl = videoId ? `https://www.facebook.com/ads/videos/${videoId}` : null

  // Metrics
  const spend = parseFloat(insights?.spend || '0')
  const impressions = parseInt(insights?.impressions || '0', 10)
  const clicks = parseInt(insights?.clicks || '0', 10)
  const ctr = parseFloat(insights?.ctr || '0')
  const cpm = parseFloat(insights?.cpm || '0')

  // Video completion metrics
  const video25 = parseInt(insights?.video_p25_watched_actions?.[0]?.value || '0', 10)
  const video50 = parseInt(insights?.video_p50_watched_actions?.[0]?.value || '0', 10)
  const video75 = parseInt(insights?.video_p75_watched_actions?.[0]?.value || '0', 10)
  const video100 = parseInt(insights?.video_p100_watched_actions?.[0]?.value || '0', 10)

  // 3s views from actions array
  const videoViews3s = getActionValue(insights?.actions, 'video_view')

  // Calculated metrics
  const hookRate = impressions > 0 && videoViews3s > 0 ? videoViews3s / impressions : 0
  const holdRate = impressions > 0 && video25 > 0 ? video25 / impressions : 0
  const costPerVideoView = videoViews3s > 0 ? spend / videoViews3s : 0

  // Conversions (priority: purchase > lead > registration)
  const conversions =
    getActionValue(insights?.actions, 'purchase') ||
    getActionValue(insights?.actions, 'lead') ||
    getActionValue(insights?.actions, 'complete_registration')

  const cpa =
    getCostPerAction(insights?.cost_per_action_type, 'purchase') ||
    getCostPerAction(insights?.cost_per_action_type, 'lead')

  const roas = parseFloat(insights?.purchase_roas?.[0]?.value || '0')

  const linkClicks = getActionValue(insights?.actions, 'link_click')

  // Ad copy
  const adHeadline = linkData?.title || videoData?.title || null
  const adDescription = linkData?.message || linkData?.description || videoData?.message || null
  const adCta = linkData?.call_to_action?.type || videoData?.call_to_action?.type || null

  return {
    ad_id: ad.id,
    ad_name: ad.name || null,
    campaign: ad.campaign?.name || null,
    ad_set: ad.adset?.name || null,
    ad_status: ad.status || null,
    ad_type: adType,
    video_url: videoUrl,
    image_url: imageUrl,
    video_thumbnail_url: videoId ? creative?.thumbnail_url || null : null,
    spend,
    impressions,
    clicks,
    ctr,
    conversions,
    cpa,
    roas,
    cpm,
    link_clicks: linkClicks,
    video_views_3s: videoViews3s,
    hook_rate: hookRate,
    hold_rate: holdRate,
    video_25: video25,
    video_50: video50,
    video_75: video75,
    video_100: video100,
    cost_per_video_view: costPerVideoView,
    ad_headline: adHeadline,
    ad_description: adDescription,
    ad_cta: adCta,
  }
}

// ── Main Sync Function ──────────────────────────────────────

export async function syncAdsForAccount(
  userId: string,
  adAccountId: string,
  accessToken: string,
  dateRangeDays: number = 30
): Promise<{ totalAds: number; synced: number }> {
  // Fetch ads from Meta
  const formattedId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`
  const ads = await fetchMetaAds(formattedId, accessToken, dateRangeDays)

  if (ads.length === 0) {
    return { totalAds: 0, synced: 0 }
  }

  const db = createServerClient()
  let synced = 0

  // Transform and upsert each ad
  for (const ad of ads) {
    const transformed = transformAdData(ad, formattedId)

    const { error } = await db.from('creatives').upsert(
      {
        user_id: userId,
        ad_account_id: formattedId,
        ...transformed,
        last_synced: new Date().toISOString(),
      },
      { onConflict: 'user_id,ad_id' }
    )

    if (!error) synced++
  }

  // Update account last_synced
  await db
    .from('ad_accounts')
    .update({ last_synced: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('ad_account_id', formattedId)

  return { totalAds: ads.length, synced }
}
