'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  getProfileByClerkId,
  upsertProfile,
  getProjectsByUserId,
  createProject,
  deleteProject,
} from '@/lib/db/queries'

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

export async function getMyProjects() {
  const profile = await getOrCreateProfile()
  return getProjectsByUserId(profile.id)
}

export async function addProject(formData: FormData) {
  const profile = await getOrCreateProfile()

  const name = formData.get('name') as string
  const description = formData.get('description') as string | null

  if (!name || name.trim().length === 0) {
    throw new Error('Project name is required')
  }
  if (name.length > 100) {
    throw new Error('Project name is too long')
  }

  await createProject({
    user_id: profile.id,
    name: name.trim(),
    description: description?.trim() || undefined,
  })

  revalidatePath('/dashboard/projects')
}

export async function removeProject(projectId: string) {
  const profile = await getOrCreateProfile()
  await deleteProject(projectId, profile.id)
  revalidatePath('/dashboard/projects')
}
