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
import { syncAdsForAccount } from '@/lib/meta/sync'
import { computeWinRateAnalysis, computeKillScale } from '@/lib/meta/analytics'

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

  await upsertUserSettings(profile.id, {
    ...parsed.data,
    meta_access_token: parsed.data.meta_access_token || current?.meta_access_token || null,
    gemini_api_key: parsed.data.gemini_api_key || current?.gemini_api_key || null,
    ...(metaTokenChanged ? { meta_token_created_at: new Date().toISOString() } : {}),
  })

  revalidatePath('/dashboard/settings')
  return { success: true }
}

export async function testMetaConnection() {
  const profile = await getOrCreateProfile()
  const settings = await getUserSettings(profile.id)

  if (!settings?.meta_access_token) {
    return { error: 'No Meta access token configured.' }
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/me?access_token=${settings.meta_access_token}`
    )
    const data = await res.json()

    if (data.error) {
      return { error: `Meta API error: ${data.error.message}` }
    }

    return { success: true, name: data.name || data.id }
  } catch {
    return { error: 'Failed to connect to Meta API.' }
  }
}

export async function testGeminiConnection() {
  const profile = await getOrCreateProfile()
  const settings = await getUserSettings(profile.id)

  if (!settings?.gemini_api_key) {
    return { error: 'No Gemini API key configured.' }
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${settings.gemini_api_key}`
    )
    const data = await res.json()

    if (data.error) {
      return { error: `Gemini API error: ${data.error.message}` }
    }

    return { success: true }
  } catch {
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
  const parsed = adAccountSchema.safeParse({
    ad_account_id: formData.get('ad_account_id'),
    account_name: formData.get('account_name'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const profile = await getOrCreateProfile()

  try {
    await addUserAdAccount({
      user_id: profile.id,
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

  revalidatePath('/dashboard/accounts')
  return { success: true }
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
  const idSchema = z.string().uuid('Invalid account ID.')
  const parsed = idSchema.safeParse(accountId)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const profile = await getOrCreateProfile()
  const settings = await getUserSettings(profile.id)

  if (!settings?.meta_access_token) {
    return { error: 'No Meta access token configured. Go to Settings first.' }
  }

  const accounts = await getUserAdAccounts(profile.id)
  const account = accounts.find(a => a.id === accountId)
  if (!account) {
    return { error: 'Account not found.' }
  }

  try {
    const result = await syncAdsForAccount(
      profile.id,
      account.ad_account_id,
      settings.meta_access_token,
      settings.date_range_days ?? 30
    )

    revalidatePath('/dashboard/accounts')
    revalidatePath('/dashboard/creatives')
    return { success: true, totalAds: result.totalAds, synced: result.synced }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sync failed.'
    return { error: message }
  }
}

export async function syncAllAccounts() {
  const profile = await getOrCreateProfile()
  const settings = await getUserSettings(profile.id)

  if (!settings?.meta_access_token) {
    return { error: 'No Meta access token configured. Go to Settings first.' }
  }

  const accounts = await getUserAdAccounts(profile.id)
  const activeAccounts = accounts.filter(a => a.active)

  if (activeAccounts.length === 0) {
    return { error: 'No active accounts to sync.' }
  }

  let totalSynced = 0
  let totalAds = 0
  const errors: string[] = []

  for (const account of activeAccounts) {
    try {
      const result = await syncAdsForAccount(
        profile.id,
        account.ad_account_id,
        settings.meta_access_token,
        settings.date_range_days ?? 30
      )
      totalAds += result.totalAds
      totalSynced += result.synced
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      errors.push(`${account.account_name}: ${message}`)
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

export async function getMyCreatives(filters?: {
  ad_account_id?: string
  ad_type?: string
  analysis_status?: string
  sort_by?: string
  sort_dir?: 'asc' | 'desc'
}) {
  const profile = await getOrCreateProfile()
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

  return { winRate, killScale }
}
