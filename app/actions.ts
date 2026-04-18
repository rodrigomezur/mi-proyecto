'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServerClient as createAdminClient } from '@/lib/db/supabase'
import {
  getProfileByClerkId,
  upsertProfile,
  getProjectsByUserId,
  createProject,
  deleteProject,
  getUserSettings,
  upsertUserSettings,
  getUserAdAccounts,
  addUserAdAccount,
  deleteUserAdAccount,
  toggleAdAccountActive,
  getUserCreatives,
} from '@/lib/db/queries'
import { syncAdsForAccount, fetchMetaAccounts } from '@/lib/meta/sync'
import { analyzeImageWithGemini, analyzeVideoWithGemini, getVideoSourceUrl, generateIterationRecommendations, calculateIterationPriority } from '@/lib/meta/gemini'
import { computeWinRateAnalysis, computeKillScale } from '@/lib/meta/analytics'
import { aggregateReportData, generateAIInsights, saveReport } from '@/lib/meta/reports'
import { getSubscription, getPlan, hasAccess, getAccountLimit, canUseFeature, type Plan } from '@/lib/subscription'

// ── Schemas ───────────────────────────────────────────────────

const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email format.')
    .max(254, 'Email is too long.'),
})

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email.'),
  password: z.string().min(1, 'Password is required.'),
})

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  full_name: z.string().trim().optional(),
})

const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Project name is required.')
    .max(100, 'Project name is too long.'),
  description: z.string().trim().max(500).optional(),
})

// ── Helpers ───────────────────────────────────────────────────

async function requirePlan(minPlan: Plan, feature: string) {
  const profile = await getOrCreateProfile()
  const sub = await getSubscription(profile.id)
  const plan = getPlan(sub)
  if (!hasAccess(plan, minPlan)) {
    return { error: `Upgrade to ${minPlan.charAt(0).toUpperCase() + minPlan.slice(1)} to use ${feature}. Go to /pricing.`, plan }
  }
  return { plan, profile }
}

export async function getMyPlan(): Promise<Plan> {
  const profile = await getOrCreateProfile()
  const sub = await getSubscription(profile.id)
  return getPlan(sub)
}

async function getOrCreateProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  let profile = await getProfileByClerkId(user.id)
  if (!profile) {
    profile = await upsertProfile({
      clerk_id: user.id,
      email: user.email ?? null,
      full_name: user.user_metadata?.full_name ?? null,
    })
  }
  return profile
}

// ── Waitlist ──────────────────────────────────────────────────

export async function joinWaitlist(formData: FormData) {
  const parsed = waitlistSchema.safeParse({
    email: formData.get('email'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const admin = createAdminClient()
  const { error } = await admin.from('waitlist').insert([{ email: parsed.data.email }])

  if (error) {
    if (error.code === '23505') {
      return { error: "You're already on the list! We'll reach out soon." }
    }
    return { error: 'Something went wrong. Please try again.' }
  }

  revalidatePath('/admin')
  return { success: true }
}

// ── Auth ──────────────────────────────────────────────────────

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    redirect(`/login?error=${encodeURIComponent(parsed.error.issues[0].message)}`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  redirect('/dashboard')
}

export async function register(formData: FormData) {
  const parsed = registerSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    full_name: formData.get('full_name') || undefined,
  })

  if (!parsed.success) {
    redirect(`/register?error=${encodeURIComponent(parsed.error.issues[0].message)}`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name || null },
    },
  })

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`)
  }

  if (data.user && !data.session) {
    redirect('/register?success=Check your email to confirm your account')
  }

  if (data.user) {
    const admin = createAdminClient()
    await admin.from('profiles').upsert({
      clerk_id: data.user.id,
      email: data.user.email,
      full_name: parsed.data.full_name || null,
    }, { onConflict: 'clerk_id' })
  }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

// ── Projects ──────────────────────────────────────────────────

export async function getMyProjects() {
  const profile = await getOrCreateProfile()
  return getProjectsByUserId(profile.id)
}

export async function addProject(formData: FormData) {
  const parsed = projectSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description') || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const profile = await getOrCreateProfile()

  await createProject({
    user_id: profile.id,
    name: parsed.data.name,
    description: parsed.data.description,
  })

  revalidatePath('/dashboard/projects')
  return { success: true }
}

export async function removeProject(projectId: string) {
  const idSchema = z.string().uuid('Invalid project ID.')
  const parsed = idSchema.safeParse(projectId)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const profile = await getOrCreateProfile()
  await deleteProject(projectId, profile.id)

  revalidatePath('/dashboard/projects')
  return { success: true }
}

// ── Settings ──────────────────────────────────────────────────

const settingsSchema = z.object({
  meta_access_token: z.string().trim().optional(),
  gemini_api_key: z.string().trim().optional(),
  roas_winner_threshold: z.coerce.number().min(0, 'Must be 0 or greater.').default(1.0),
  min_spend_threshold: z.coerce.number().min(0, 'Must be 0 or greater.').default(0),
  sync_frequency: z.enum(['manual', 'daily', 'weekly']).default('manual'),
  date_range_days: z.coerce.number().int().min(1).max(365).default(30),
})

export async function getMySettings() {
  const profile = await getOrCreateProfile()
  return getUserSettings(profile.id)
}

export async function saveSettings(formData: FormData) {
  const parsed = settingsSchema.safeParse({
    meta_access_token: formData.get('meta_access_token') || undefined,
    gemini_api_key: formData.get('gemini_api_key') || undefined,
    roas_winner_threshold: formData.get('roas_winner_threshold'),
    min_spend_threshold: formData.get('min_spend_threshold'),
    sync_frequency: formData.get('sync_frequency'),
    date_range_days: formData.get('date_range_days'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const profile = await getOrCreateProfile()

  const current = await getUserSettings(profile.id)
  const metaTokenChanged = parsed.data.meta_access_token && parsed.data.meta_access_token !== current?.meta_access_token

  const { meta_access_token, gemini_api_key, ...rest } = parsed.data

  await upsertUserSettings(profile.id, {
    ...rest,
    meta_access_token: meta_access_token || current?.meta_access_token || null,
    gemini_api_key: gemini_api_key || current?.gemini_api_key || null,
    ...(metaTokenChanged ? { meta_token_created_at: new Date().toISOString() } : {}),
  })

  revalidatePath('/dashboard/settings')
  return { success: true }
}

export async function testMetaConnection(tokenFromForm?: string) {
  const profile = await getOrCreateProfile()
  const settings = await getUserSettings(profile.id)
  const token = tokenFromForm?.trim() || settings?.meta_access_token

  if (!token) {
    return { error: 'Enter your Meta access token and try again.' }
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const res = await fetch(
      `https://graph.facebook.com/v21.0/me?access_token=${token}`,
      { signal: controller.signal }
    )
    clearTimeout(timeout)

    const data = await res.json()

    if (data.error) {
      return { error: `Meta API: ${data.error.message}` }
    }

    // Auto-save token on successful test
    if (token !== settings?.meta_access_token) {
      await upsertUserSettings(profile.id, {
        meta_access_token: token,
        meta_token_created_at: new Date().toISOString(),
      })
      revalidatePath('/dashboard/settings')
    }

    return { success: true, name: data.name || data.id }
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { error: 'Connection timed out. Check your token and try again.' }
    }
    return { error: 'Failed to connect to Meta API.' }
  }
}

export async function testGeminiConnection(keyFromForm?: string) {
  const profile = await getOrCreateProfile()
  const settings = await getUserSettings(profile.id)
  const key = keyFromForm?.trim() || settings?.gemini_api_key

  if (!key) {
    return { error: 'Enter your Gemini API key and try again.' }
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
      { signal: controller.signal }
    )
    clearTimeout(timeout)

    const data = await res.json()

    if (data.error) {
      return { error: `Gemini API: ${data.error.message}` }
    }

    // Auto-save key on successful test
    if (key !== settings?.gemini_api_key) {
      await upsertUserSettings(profile.id, {
        gemini_api_key: key,
      })
      revalidatePath('/dashboard/settings')
    }

    return { success: true }
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { error: 'Connection timed out. Check your key and try again.' }
    }
    return { error: 'Failed to connect to Gemini API.' }
  }
}

// ── Ad Accounts ───────────────────────────────────────────────

const adAccountSchema = z.object({
  ad_account_id: z.string().trim().min(1, 'Account ID is required.'),
  account_name: z.string().trim().min(1, 'Account name is required.').max(100),
})

export async function getMyAdAccounts() {
  const profile = await getOrCreateProfile()
  return getUserAdAccounts(profile.id)
}

export async function addAdAccount(formData: FormData) {
  const check = await requirePlan('solo', 'ad accounts')
  if ('error' in check) return { error: check.error }

  const parsed = adAccountSchema.safeParse({
    ad_account_id: formData.get('ad_account_id'),
    account_name: formData.get('account_name'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // Check account limit
  const accounts = await getUserAdAccounts(check.profile.id)
  const limit = getAccountLimit(check.plan)
  if (accounts.length >= limit) {
    return { error: `Your ${check.plan} plan allows ${limit} accounts. Upgrade for more.` }
  }

  try {
    await addUserAdAccount({
      user_id: check.profile.id,
      ad_account_id: parsed.data.ad_account_id,
      account_name: parsed.data.account_name,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to add account.'
    if (message.includes('duplicate') || message.includes('unique')) {
      return { error: 'This account is already connected.' }
    }
    return { error: message }
  }

  // Auto-sync if Meta token is configured (fire and forget)
  const settings = await getUserSettings(check.profile.id)
  if (settings?.meta_access_token) {
    const formattedId = parsed.data.ad_account_id.startsWith('act_')
      ? parsed.data.ad_account_id
      : `act_${parsed.data.ad_account_id}`
    const admin = createAdminClient()
    const { data: job } = await admin.from('sync_jobs').insert({
      user_id: check.profile.id,
      ad_account_id: formattedId,
      status: 'pending',
    }).select('id').single()

    // Fire and forget — sync runs in background
    syncAdsForAccount(
      check.profile.id,
      formattedId,
      settings.meta_access_token,
      90, // initial baseline
      settings.gemini_api_key,
      job?.id,
    ).catch(() => {
      if (job?.id) admin.from('sync_jobs').update({
        status: 'error',
        error_message: 'Initial sync failed',
        completed_at: new Date().toISOString(),
      }).eq('id', job.id)
    })
  }

  revalidatePath('/dashboard/accounts')
  return { success: true, autoSyncStarted: !!settings?.meta_access_token }
}

export async function listAvailableMetaAccounts() {
  const check = await requirePlan('solo', 'Meta accounts')
  if ('error' in check) return { error: check.error }

  const settings = await getUserSettings(check.profile.id)
  if (!settings?.meta_access_token) {
    return { error: 'No Meta access token configured. Go to Settings first.' }
  }

  try {
    const accounts = await fetchMetaAccounts(settings.meta_access_token)
    return { accounts }
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to fetch accounts.' }
  }
}

export async function getSyncJobStatus(accountId: string) {
  const profile = await getOrCreateProfile()
  const admin = createAdminClient()

  const accounts = await getUserAdAccounts(profile.id)
  const account = accounts.find(a => a.id === accountId)
  if (!account) return null

  const { data } = await admin
    .from('sync_jobs')
    .select('*')
    .eq('user_id', profile.id)
    .eq('ad_account_id', account.ad_account_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return data
}

export async function removeAdAccount(accountId: string) {
  const idSchema = z.string().uuid('Invalid account ID.')
  const parsed = idSchema.safeParse(accountId)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const profile = await getOrCreateProfile()
  await deleteUserAdAccount(accountId, profile.id)

  revalidatePath('/dashboard/accounts')
  return { success: true }
}

export async function toggleAccount(accountId: string, active: boolean) {
  const idSchema = z.string().uuid('Invalid account ID.')
  const parsed = idSchema.safeParse(accountId)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const profile = await getOrCreateProfile()
  await toggleAdAccountActive(accountId, profile.id, active)

  revalidatePath('/dashboard/accounts')
  return { success: true }
}

// ── Sync ──────────────────────────────────────────────────────

export async function syncAccount(accountId: string) {
  const check = await requirePlan('solo', 'sync')
  if ('error' in check) return { error: check.error }

  const idSchema = z.string().uuid('Invalid account ID.')
  const parsed = idSchema.safeParse(accountId)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const settings = await getUserSettings(check.profile.id)

  if (!settings?.meta_access_token) {
    return { error: 'No Meta access token configured. Go to Settings first.' }
  }

  const accounts = await getUserAdAccounts(check.profile.id)
  const account = accounts.find(a => a.id === accountId)
  if (!account) {
    return { error: 'Account not found.' }
  }

  const admin = createAdminClient()
  const { data: job } = await admin.from('sync_jobs').insert({
    user_id: check.profile.id,
    ad_account_id: account.ad_account_id,
    status: 'pending',
  }).select('id').single()

  try {
    const result = await syncAdsForAccount(
      check.profile.id,
      account.ad_account_id,
      settings.meta_access_token,
      settings.date_range_days ?? 30,
      settings.gemini_api_key,
      job?.id,
    )

    revalidatePath('/dashboard/accounts')
    revalidatePath('/dashboard/creatives')
    return { success: true, totalAds: result.totalAds, synced: result.synced, analyzed: result.analyzed }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sync failed.'
    if (job?.id) {
      await admin.from('sync_jobs').update({
        status: 'error',
        error_message: message,
        completed_at: new Date().toISOString(),
      }).eq('id', job.id)
    }
    return { error: message }
  }
}

export async function syncAllAccounts() {
  const check = await requirePlan('solo', 'sync')
  if ('error' in check) return { error: check.error }

  const settings = await getUserSettings(check.profile.id)

  if (!settings?.meta_access_token) {
    return { error: 'No Meta access token configured. Go to Settings first.' }
  }

  const accounts = await getUserAdAccounts(check.profile.id)
  const activeAccounts = accounts.filter(a => a.active)

  if (activeAccounts.length === 0) {
    return { error: 'No active accounts to sync.' }
  }

  let totalSynced = 0
  let totalAds = 0
  const errors: string[] = []

  const admin = createAdminClient()

  for (const account of activeAccounts) {
    const { data: job } = await admin.from('sync_jobs').insert({
      user_id: check.profile.id,
      ad_account_id: account.ad_account_id,
      status: 'pending',
    }).select('id').single()

    try {
      const result = await syncAdsForAccount(
        check.profile.id,
        account.ad_account_id,
        settings.meta_access_token,
        settings.date_range_days ?? 30,
        settings.gemini_api_key,
        job?.id,
      )
      totalAds += result.totalAds
      totalSynced += result.synced
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      errors.push(`${account.account_name}: ${message}`)
      if (job?.id) {
        await admin.from('sync_jobs').update({
          status: 'error',
          error_message: message,
          completed_at: new Date().toISOString(),
        }).eq('id', job.id)
      }
    }
  }

  revalidatePath('/dashboard/accounts')
  revalidatePath('/dashboard/creatives')

  if (errors.length > 0) {
    return { error: `Synced ${totalSynced}/${totalAds} ads. Errors: ${errors.join('; ')}` }
  }

  return { success: true, totalAds, synced: totalSynced }
}

// ── Creatives ─────────────────────────────────────────────────

export async function reanalyzeCreative(creativeId: string) {
  const check = await requirePlan('solo', 'AI analysis')
  if ('error' in check) return { error: check.error }

  const settings = await getUserSettings(check.profile.id)
  if (!settings?.gemini_api_key) return { error: 'No Gemini API key configured.' }
  if (!settings?.meta_access_token) return { error: 'No Meta access token configured.' }

  const db = createAdminClient()
  const { data: creative } = await db
    .from('creatives')
    .select('*')
    .eq('id', creativeId)
    .eq('user_id', check.profile.id)
    .single()

  if (!creative) return { error: 'Creative not found.' }

  try {
    // Reset status
    await db.from('creatives').update({ analysis_status: 'pending' }).eq('id', creativeId)

    // Run analysis
    let analysisResult
    const imageUrl = creative.image_url || creative.video_thumbnail_url

    if (creative.ad_type === 'video' && creative.video_url) {
      const videoId = creative.video_url.split('/').pop()
      if (videoId) {
        const videoSource = await getVideoSourceUrl(videoId, settings.meta_access_token)
        if (videoSource) {
          try {
            analysisResult = await analyzeVideoWithGemini(
              videoSource, settings.gemini_api_key, creative.ad_description || '', creative.ad_headline || '', creative.ad_cta || ''
            )
          } catch {
            if (imageUrl) {
              analysisResult = await analyzeImageWithGemini(
                imageUrl, settings.gemini_api_key, creative.ad_description || '', creative.ad_headline || '', creative.ad_cta || ''
              )
            }
          }
        } else if (imageUrl) {
          analysisResult = await analyzeImageWithGemini(
            imageUrl, settings.gemini_api_key, creative.ad_description || '', creative.ad_headline || '', creative.ad_cta || ''
          )
        }
      }
    } else if (imageUrl) {
      analysisResult = await analyzeImageWithGemini(
        imageUrl, settings.gemini_api_key, creative.ad_description || '', creative.ad_headline || '', creative.ad_cta || ''
      )
    }

    if (!analysisResult) return { error: 'No image or video URL available for analysis.' }

    // Generate iterations
    const { data: allCreatives } = await db
      .from('creatives')
      .select('spend, roas, cpa, hook_rate, hold_rate, ctr')
      .eq('user_id', check.profile.id)
      .eq('ad_account_id', creative.ad_account_id)
      .gt('spend', 0)

    const withSpend = (allCreatives || []).filter((c: { spend: number }) => c.spend > 0)
    const avgFn = (arr: number[]) => { const f = arr.filter(n => n > 0); return f.length ? f.reduce((a, b) => a + b, 0) / f.length : 0 }
    const benchmarks = {
      avgSpend: avgFn(withSpend.map((c: { spend: number }) => c.spend)),
      avgROAS: avgFn(withSpend.map((c: { roas: number }) => c.roas)),
      avgCPA: avgFn(withSpend.map((c: { cpa: number }) => c.cpa)),
      avgHookRate: avgFn(withSpend.map((c: { hook_rate: number }) => c.hook_rate)),
      avgHoldRate: avgFn(withSpend.map((c: { hold_rate: number }) => c.hold_rate)),
      avgCTR: avgFn(withSpend.map((c: { ctr: number }) => c.ctr)),
    }

    let iterations = null
    let priority = 0
    if (creative.spend > 0) {
      iterations = await generateIterationRecommendations(
        { ...creative, ...analysisResult, ai_summary: analysisResult.summary },
        benchmarks, settings.gemini_api_key
      )
      priority = calculateIterationPriority(creative, benchmarks)
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
    }).eq('id', creativeId)

    revalidatePath('/dashboard/creatives')
    return { success: true }
  } catch (err: unknown) {
    await db.from('creatives').update({ analysis_status: 'failed' }).eq('id', creativeId)
    return { error: err instanceof Error ? err.message : 'Analysis failed.' }
  }
}

export async function getMyCreatives(filters?: {
  ad_account_id?: string
  ad_type?: string
  analysis_status?: string
  sort_by?: string
  sort_dir?: 'asc' | 'desc'
}) {
  const profile = await getOrCreateProfile()
  const sub = await getSubscription(profile.id)
  const plan = getPlan(sub)
  if (!canUseFeature(plan, 'creatives')) return []
  return getUserCreatives(profile.id, filters)
}

// ── Analytics ─────────────────────────────────────────────────

export async function getMyAnalytics() {
  const profile = await getOrCreateProfile()

  const [creatives, settings] = await Promise.all([
    getUserCreatives(profile.id),
    getUserSettings(profile.id),
  ])

  const threshold = settings?.roas_winner_threshold ?? 1.0
  const winRate = computeWinRateAnalysis(creatives, threshold)
  const killScale = computeKillScale(creatives, threshold)

  // Iteration priorities: top 10 ads with highest priority score + iterations
  const iterationPriorities = creatives
    .filter(c => (c.iteration_priority ?? 0) > 0 && c.iteration_recommendations && Array.isArray(c.iteration_recommendations) && c.iteration_recommendations.length > 0)
    .sort((a, b) => (b.iteration_priority ?? 0) - (a.iteration_priority ?? 0))
    .slice(0, 10)
    .map(c => ({
      id: c.id,
      ad_name: c.ad_name,
      image_url: c.image_url,
      video_thumbnail_url: c.video_thumbnail_url,
      spend: c.spend,
      roas: c.roas,
      iteration_priority: c.iteration_priority ?? 0,
      top_iteration: (c.iteration_recommendations as Array<{ title: string; focus_area: string; expected_impact: string }>)?.[0],
    }))

  return { winRate, killScale, iterationPriorities }
}

// ── Reports ───────────────────────────────────────────────────

export async function getMyReports() {
  const profile = await getOrCreateProfile()
  const sub = await getSubscription(profile.id)
  const plan = getPlan(sub)
  if (!canUseFeature(plan, 'reports')) return []

  const db = createAdminClient()
  const { data, error } = await db
    .from('reports')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function generateReport(adAccountId: string) {
  const check = await requirePlan('solo', 'reports')
  if ('error' in check) return { error: check.error }

  const [creatives, settings, accounts] = await Promise.all([
    getUserCreatives(check.profile.id),
    getUserSettings(check.profile.id),
    getUserAdAccounts(check.profile.id),
  ])

  const account = accounts.find(a => a.ad_account_id === adAccountId)
  if (!account) {
    return { error: 'Account not found.' }
  }

  const reportData = aggregateReportData(creatives, adAccountId, account.account_name)

  if (reportData.totalCreatives === 0) {
    return { error: 'No creatives with spend data for this account.' }
  }

  let aiInsights = 'AI insights not available (no Gemini API key configured).'
  if (settings?.gemini_api_key) {
    aiInsights = await generateAIInsights(reportData, settings.gemini_api_key)
  }

  try {
    await saveReport(check.profile.id, reportData, aiInsights)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save report.'
    return { error: message }
  }

  revalidatePath('/dashboard/reports')
  return { success: true }
}
