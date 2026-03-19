'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import {
  getProfileByClerkId,
  upsertProfile,
  getProjectsByUserId,
  createProject,
  deleteProject,
} from '@/lib/db/queries'

async function getOrCreateProfile() {
  const { userId } = await auth()
  if (!userId) throw new Error('Not authenticated')

  let profile = await getProfileByClerkId(userId)
  if (!profile) {
    const user = await currentUser()
    profile = await upsertProfile({
      clerk_id: userId,
      email: user?.emailAddresses[0]?.emailAddress ?? null,
      full_name: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || null,
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
