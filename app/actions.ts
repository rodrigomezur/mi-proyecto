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
} from '@/lib/db/queries'

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
  if (!projectId || typeof projectId !== 'string') {
    return { error: 'Invalid project ID.' }
  }

  const profile = await getOrCreateProfile()
  await deleteProject(projectId, profile.id)

  revalidatePath('/dashboard/projects')
  return { success: true }
}
