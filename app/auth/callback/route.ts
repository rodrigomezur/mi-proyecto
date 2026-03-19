import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServerClient as createAdminClient } from '@/lib/db/supabase'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Create/update profile for OAuth users
      const admin = createAdminClient()
      await admin.from('profiles').upsert({
        clerk_id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? null,
      }, { onConflict: 'clerk_id' })

      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could not authenticate`)
}
