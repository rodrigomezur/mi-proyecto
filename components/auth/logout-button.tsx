'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: '6px 12px',
        fontSize: '11px',
        fontWeight: 500,
        borderRadius: '5px',
        background: 'transparent',
        border: '1px solid var(--dash-border)',
        color: 'var(--dash-text-muted)',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#ef4444'
        e.currentTarget.style.color = '#ef4444'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--dash-border)'
        e.currentTarget.style.color = 'var(--dash-text-muted)'
      }}
    >
      Logout
    </button>
  )
}
