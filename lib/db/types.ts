export type AdAccount = {
  id: string
  org_id: string
  meta_account_id: string
  name: string | null
  currency: string | null
  timezone: string | null
  is_active: boolean
  last_synced_at: string | null
  created_at: string
  updated_at: string
}

export type Creative = {
  id: string
  org_id: string
  ad_account_id: string | null
  meta_ad_id: string
  meta_adset_id: string | null
  meta_campaign_id: string | null
  name: string | null
  status: string | null
  thumbnail_url: string | null
  video_url: string | null
  ad_copy: string | null
  call_to_action: string | null
  spend: number
  roas: number
  ctr: number
  cpa: number
  hook_rate: number
  hold_rate: number
  impressions: number
  clicks: number
  purchases: number
  analysis_status: string
  created_at: string
  updated_at: string
}

export type CreativeAnalysis = {
  id: string
  org_id: string
  creative_id: string
  asset_type: string | null
  visual_format: string | null
  messaging_angle: string | null
  hook_tactic: string | null
  offer_type: string | null
  funnel_stage: string | null
  summary: string | null
  iteration_brief: Record<string, unknown> | null
  analyzed_at: string | null
  model_used: string | null
  created_at: string
  updated_at: string
}

export type SyncJob = {
  id: string
  org_id: string
  ad_account_id: string | null
  status: string
  type: string
  creatives_synced: number
  creatives_analyzed: number
  error_message: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
}

export type Report = {
  id: string
  org_id: string
  ad_account_id: string | null
  title: string | null
  date_from: string | null
  date_to: string | null
  total_spend: number | null
  avg_roas: number | null
  win_rate: number | null
  total_creatives: number | null
  top_performers: Record<string, unknown>[] | null
  bottom_performers: Record<string, unknown>[] | null
  category_breakdown: Record<string, unknown> | null
  ai_summary: string | null
  created_at: string
}

export type OrgSettings = {
  id: string
  org_id: string
  meta_access_token: string | null
  gemini_api_key: string | null
  roas_winner_threshold: number
  min_spend_threshold: number
  sync_frequency_hours: number
  created_at: string
  updated_at: string
}

export type CreativeWithAnalysis = Creative & {
  creative_analysis: CreativeAnalysis | null
}
