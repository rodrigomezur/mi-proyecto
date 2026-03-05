import { supabase } from '@/lib/supabase'
import AdminWaitlist from '@/components/admin/admin-waitlist'

export const metadata = {
  title: 'Admin — Waitlist | Creatiq',
}

export const revalidate = 0

export default async function AdminPage() {
  const { data, error } = await supabase
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <section className="relative min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 md:pt-32 pb-12">
        {/* Admin header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-2">Admin Panel</p>
            <h1 className="h2 font-hkgrotesk">Waitlist</h1>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-red-400 text-sm mb-6" role="alert">
            Error loading data: {error.message}
          </div>
        )}

        <AdminWaitlist entries={data ?? []} />
      </div>
    </section>
  )
}
