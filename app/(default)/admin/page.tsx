import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServerClient } from '@/lib/db/supabase'
import AdminWaitlist from '@/components/admin/admin-waitlist'

export const metadata = {
  title: 'Admin — Waitlist | Creatiq',
}

export const revalidate = 0

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const supabaseAdmin = createServerClient()
  const { data, error } = await supabaseAdmin
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <section className="relative min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 md:pt-32 pb-12">
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-red-400 text-sm mb-6" role="alert">
            Error loading data. Please try again later.
          </div>
        )}

        <AdminWaitlist entries={data ?? []} />
      </div>
    </section>
  )
}
