import { createServerClient } from '@/lib/db/supabase'
import {
  analyzeImageWithGemini,
  analyzeVideoWithGemini,
  getVideoSourceUrl,
  generateIterationRecommendations,
  calculateIterationPriority,
} from '@/lib/meta/gemini'

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
  _videoId?: string | null
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

  const videoId = videoData?.video_id || creative?.video_id || assetFeed?.videos?.[0]?.video_id
  const adType = videoId ? 'video' : 'image'

  let imageUrl = linkData?.image_url || linkData?.picture || creative?.image_url || creative?.thumbnail_url || null
  const videoUrl = videoId ? `https://www.facebook.com/ads/videos/${videoId}` : null

  const spend = parseFloat(insights?.spend || '0')
  const impressions = parseInt(insights?.impressions || '0', 10)
  const clicks = parseInt(insights?.clicks || '0', 10)
  const ctr = parseFloat(insights?.ctr || '0')
  const cpm = parseFloat(insights?.cpm || '0')

  const video25 = parseInt(insights?.video_p25_watched_actions?.[0]?.value || '0', 10)
  const video50 = parseInt(insights?.video_p50_watched_actions?.[0]?.value || '0', 10)
  const video75 = parseInt(insights?.video_p75_watched_actions?.[0]?.value || '0', 10)
  const video100 = parseInt(insights?.video_p100_watched_actions?.[0]?.value || '0', 10)

  const videoViews3s = getActionValue(insights?.actions, 'video_view')

  const hookRate = impressions > 0 && videoViews3s > 0 ? videoViews3s / impressions : 0
  const holdRate = impressions > 0 && video25 > 0 ? video25 / impressions : 0
  const costPerVideoView = videoViews3s > 0 ? spend / videoViews3s : 0

  const conversions =
    getActionValue(insights?.actions, 'purchase') ||
    getActionValue(insights?.actions, 'lead') ||
    getActionValue(insights?.actions, 'complete_registration')

  const cpa =
    getCostPerAction(insights?.cost_per_action_type, 'purchase') ||
    getCostPerAction(insights?.cost_per_action_type, 'lead')

  const roas = parseFloat(insights?.purchase_roas?.[0]?.value || '0')
  const linkClicks = getActionValue(insights?.actions, 'link_click')

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
    spend, impressions, clicks, ctr, conversions, cpa, roas, cpm,
    link_clicks: linkClicks,
    video_views_3s: videoViews3s,
    hook_rate: hookRate, hold_rate: holdRate,
    video_25: video25, video_50: video50, video_75: video75, video_100: video100,
    cost_per_video_view: costPerVideoView,
    ad_headline: adHeadline, ad_description: adDescription, ad_cta: adCta,
    _videoId: videoId || null,
  }
}

// ── Compute Benchmarks ──────────────────────────────────────

function computeBenchmarks(creatives: Array<{ spend: number; roas: number; cpa: number; hook_rate: number; hold_rate: number; ctr: number }>) {
  const withSpend = creatives.filter(c => c.spend > 0)
  if (withSpend.length === 0) return { avgSpend: 0, avgROAS: 0, avgCPA: 0, avgHookRate: 0, avgHoldRate: 0, avgCTR: 0 }

  const avg = (arr: number[]) => { const f = arr.filter(n => n > 0); return f.length > 0 ? f.reduce((a, b) => a + b, 0) / f.length : 0 }

  return {
    avgSpend: avg(withSpend.map(c => c.spend)),
    avgROAS: avg(withSpend.map(c => c.roas)),
    avgCPA: avg(withSpend.map(c => c.cpa)),
    avgHookRate: avg(withSpend.map(c => c.hook_rate)),
    avgHoldRate: avg(withSpend.map(c => c.hold_rate)),
    avgCTR: avg(withSpend.map(c => c.ctr)),
  }
}

// ── Main Sync Function ──────────────────────────────────────

export async function syncAdsForAccount(
  userId: string,
  adAccountId: string,
  accessToken: string,
  dateRangeDays: number = 30,
  geminiApiKey?: string | null,
  jobId?: string,
): Promise<{ totalAds: number; synced: number; analyzed: number }> {
  const formattedId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`
  const db = createServerClient()

  const updateJob = async (patch: Record<string, unknown>) => {
    if (jobId) await db.from('sync_jobs').update(patch).eq('id', jobId)
  }

  await updateJob({ status: 'fetching' })

  const ads = await fetchMetaAds(formattedId, accessToken, dateRangeDays)

  if (ads.length === 0) {
    await updateJob({ status: 'complete', total_ads: 0, completed_at: new Date().toISOString() })
    return { totalAds: 0, synced: 0, analyzed: 0 }
  }

  await updateJob({ status: 'processing', total_ads: ads.length })

  let synced = 0
  let analyzed = 0

  // Phase 1: Fetch + upsert all ads
  const transformedAds: (TransformedAd & { upsertId?: string })[] = []

  for (const ad of ads) {
    const transformed = transformAdData(ad, formattedId)

    const { data, error } = await db.from('creatives').upsert(
      {
        user_id: userId,
        ad_account_id: formattedId,
        ...transformed,
        _videoId: undefined, // don't store internal field
        last_synced: new Date().toISOString(),
      },
      { onConflict: 'user_id,ad_id' }
    ).select('id, analysis_status').single()

    if (!error) {
      synced++
      transformedAds.push({ ...transformed, upsertId: data?.id })
      if (synced % 5 === 0) await updateJob({ processed_ads: synced })
    }
  }
  await updateJob({ processed_ads: synced })

  // Phase 2: AI analysis (if Gemini key available)
  if (geminiApiKey) {
    // Get all creatives for benchmarks
    const { data: allCreatives } = await db
      .from('creatives')
      .select('spend, roas, cpa, hook_rate, hold_rate, ctr')
      .eq('user_id', userId)
      .eq('ad_account_id', formattedId)
      .gt('spend', 0)

    const benchmarks = computeBenchmarks(allCreatives || [])

    for (const ad of transformedAds) {
      if (!ad.upsertId) continue

      // Check if already analyzed
      const { data: existing } = await db
        .from('creatives')
        .select('analysis_status')
        .eq('id', ad.upsertId)
        .single()

      if (existing?.analysis_status === 'complete') continue

      try {
        let analysisResult

        if (ad.ad_type === 'video' && ad._videoId) {
          // Try video analysis first
          const videoSource = await getVideoSourceUrl(ad._videoId, accessToken)
          if (videoSource) {
            try {
              analysisResult = await analyzeVideoWithGemini(
                videoSource, geminiApiKey, ad.ad_description || '', ad.ad_headline || '', ad.ad_cta || ''
              )
            } catch (e: unknown) {
              const msg = e instanceof Error ? e.message : ''
              if (msg === 'VIDEO_TOO_LARGE' && ad.image_url) {
                // Fallback to thumbnail
                analysisResult = await analyzeImageWithGemini(
                  ad.image_url, geminiApiKey, ad.ad_description || '', ad.ad_headline || '', ad.ad_cta || ''
                )
              } else {
                throw e
              }
            }
          } else if (ad.image_url || ad.video_thumbnail_url) {
            // No video source, use thumbnail
            analysisResult = await analyzeImageWithGemini(
              (ad.video_thumbnail_url || ad.image_url)!, geminiApiKey, ad.ad_description || '', ad.ad_headline || '', ad.ad_cta || ''
            )
          }
        } else if (ad.image_url) {
          analysisResult = await analyzeImageWithGemini(
            ad.image_url, geminiApiKey, ad.ad_description || '', ad.ad_headline || '', ad.ad_cta || ''
          )
        }

        if (analysisResult) {
          // Generate iteration recs if has spend
          let iterations = null
          let priority = 0
          if (ad.spend > 0) {
            iterations = await generateIterationRecommendations(
              { ...ad, asset_type: analysisResult.asset_type, visual_format: analysisResult.visual_format,
                messaging_angle: analysisResult.messaging_angle, hook_tactic: analysisResult.hook_tactic,
                offer_type: analysisResult.offer_type, ai_summary: analysisResult.summary },
              benchmarks, geminiApiKey
            )
            priority = calculateIterationPriority(ad, benchmarks)
          }

          await db.from('creatives').update({
            asset_type: analysisResult.asset_type,
            visual_format: analysisResult.visual_format,
            messaging_angle: analysisResult.messaging_angle,
            hook_tactic: analysisResult.hook_tactic,
            offer_type: analysisResult.offer_type,
            funnel_stage: analysisResult.funnel_stage,
            ai_summary: analysisResult.summary,
            analysis_status: 'complete',
            analyzed_at: new Date().toISOString(),
            ...(iterations ? {
              strengths: iterations.strengths,
              weaknesses: iterations.weaknesses,
              iteration_recommendations: iterations.iterations,
              iteration_priority: priority,
            } : {}),
          }).eq('id', ad.upsertId)

          analyzed++
          if (analyzed % 3 === 0) await updateJob({ analyzed_ads: analyzed })
        }
      } catch {
        // Mark as failed but don't stop sync
        await db.from('creatives').update({
          analysis_status: 'failed',
        }).eq('id', ad.upsertId)
      }
    }
  }

  // Update account last_synced
  await db
    .from('ad_accounts')
    .update({ last_synced: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('ad_account_id', formattedId)

  await updateJob({
    status: 'complete',
    processed_ads: synced,
    analyzed_ads: analyzed,
    completed_at: new Date().toISOString(),
  })

  return { totalAds: ads.length, synced, analyzed }
}

// ── Fetch Available Accounts from Meta ──────────────────────

export async function fetchMetaAccounts(accessToken: string): Promise<Array<{ id: string; name: string }>> {
  const res = await fetch(
    `https://graph.facebook.com/v21.0/me/adaccounts?fields=account_id,name&limit=100&access_token=${accessToken}`
  )
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)

  return (data.data || []).map((a: { account_id: string; name: string }) => ({
    id: `act_${a.account_id}`,
    name: a.name,
  }))
}
