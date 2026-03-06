import { createServerClient } from './supabase'
import type {
  AdAccount,
  Creative,
  CreativeWithAnalysis,
  CreativeAnalysis,
  OrgSettings,
} from './types'

// All query helpers use the service role client (bypasses RLS)
// and filter by org_id explicitly. This is for server-side use only.

function db() {
  return createServerClient()
}

// ── Ad Accounts ──────────────────────────────────────────────

export async function getAdAccounts(orgId: string): Promise<AdAccount[]> {
  const { data, error } = await db()
    .from('ad_accounts')
    .select('*')
    .eq('org_id', orgId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

// ── Creatives ────────────────────────────────────────────────

export type CreativeFilters = {
  ad_account_id?: string
  status?: string
  analysis_status?: string
  min_spend?: number
  sort_by?: keyof Creative
  sort_dir?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export async function getCreatives(
  orgId: string,
  filters: CreativeFilters = {}
): Promise<Creative[]> {
  let query = db()
    .from('creatives')
    .select('*')
    .eq('org_id', orgId)

  if (filters.ad_account_id) {
    query = query.eq('ad_account_id', filters.ad_account_id)
  }
  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.analysis_status) {
    query = query.eq('analysis_status', filters.analysis_status)
  }
  if (filters.min_spend !== undefined) {
    query = query.gte('spend', filters.min_spend)
  }

  query = query.order(filters.sort_by ?? 'created_at', {
    ascending: (filters.sort_dir ?? 'desc') === 'asc',
  })

  if (filters.limit) {
    query = query.limit(filters.limit)
  }
  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit ?? 50) - 1)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getCreativeWithAnalysis(
  creativeId: string
): Promise<CreativeWithAnalysis | null> {
  const { data, error } = await db()
    .from('creatives')
    .select('*, creative_analysis(*)')
    .eq('id', creativeId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // not found
    throw error
  }

  // Supabase returns the join as an array; take the first entry
  const analysis = Array.isArray(data.creative_analysis)
    ? data.creative_analysis[0] ?? null
    : data.creative_analysis

  return { ...data, creative_analysis: analysis }
}

export async function upsertCreative(
  creative: Omit<Creative, 'id' | 'created_at' | 'updated_at'>
): Promise<Creative> {
  const { data, error } = await db()
    .from('creatives')
    .upsert(creative, { onConflict: 'meta_ad_id' })
    .select()
    .single()

  if (error) throw error
  return data
}

// ── Creative Analysis ────────────────────────────────────────

export async function saveAnalysis(
  creativeId: string,
  orgId: string,
  analysis: Omit<CreativeAnalysis, 'id' | 'org_id' | 'creative_id' | 'created_at' | 'updated_at'>
): Promise<CreativeAnalysis> {
  const { data, error } = await db()
    .from('creative_analysis')
    .upsert(
      { ...analysis, creative_id: creativeId, org_id: orgId },
      { onConflict: 'creative_id' }
    )
    .select()
    .single()

  if (error) throw error

  // Mark creative as analyzed
  await db()
    .from('creatives')
    .update({ analysis_status: 'completed' })
    .eq('id', creativeId)

  return data
}

// ── Org Settings ─────────────────────────────────────────────

export async function getOrgSettings(orgId: string): Promise<OrgSettings | null> {
  const { data, error } = await db()
    .from('org_settings')
    .select('*')
    .eq('org_id', orgId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function upsertOrgSettings(
  orgId: string,
  settings: Partial<Omit<OrgSettings, 'id' | 'org_id' | 'created_at' | 'updated_at'>>
): Promise<OrgSettings> {
  const { data, error } = await db()
    .from('org_settings')
    .upsert({ ...settings, org_id: orgId }, { onConflict: 'org_id' })
    .select()
    .single()

  if (error) throw error
  return data
}
