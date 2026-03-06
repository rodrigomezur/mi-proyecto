'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import ThemeToggle from '@/components/ui/theme-toggle'

const navItems = [
  { label: 'Overview', href: '/dashboard/overview', icon: '\u25C8' },
  { label: 'Creatives', href: '/dashboard/creatives', icon: '\u25A6' },
  { label: 'Analytics', href: '/dashboard/analytics', icon: '\u25D0' },
  { label: 'Reports', href: '/dashboard/reports', icon: '\u2261' },
]

const accountItems = [
  { label: 'Settings', href: '/dashboard/settings', icon: '\u2299' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/dashboard/overview') return pathname === '/dashboard' || pathname === '/dashboard/overview'
    return pathname.startsWith(href)
  }

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: 'var(--dash-bg)',
        color: 'var(--dash-text)',
        fontFamily: 'var(--font-dm-sans), sans-serif',
      }}
    >
      {/* Sidebar */}
      <nav
        className="fixed top-0 left-0 bottom-0 z-50 flex flex-col shrink-0"
        style={{
          width: 'var(--sidebar-w)',
          background: 'var(--dash-bg2)',
          borderRight: '1px solid var(--dash-border)',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--dash-border)' }}>
          <span className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-[var(--acid)]">
            CREATIQ
          </span>
          <div
            style={{
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '9px',
              color: 'var(--dash-text-muted)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              marginTop: '2px',
            }}
          >
            Creative Analytics
          </div>
        </div>

        {/* Account pill */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--dash-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, var(--dash-bg3), var(--dash-bg4))',
              border: '1px solid var(--acid-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-syne), sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--acid)',
              flexShrink: 0,
            }}
          >
            AC
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--dash-text)',
                whiteSpace: 'nowrap' as const,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Acme Creative Co.
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: '9px',
                color: 'var(--acid)',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
              }}
            >
              Growth Plan
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto dashboard-scroll" style={{ padding: '12px 0' }}>
          <div
            style={{
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '9px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              color: 'var(--dash-text-muted)',
              padding: '8px 20px 4px',
              marginTop: '8px',
            }}
          >
            Analytics
          </div>
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="block relative"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 20px',
                  fontSize: '13px',
                  color: active ? 'var(--acid)' : 'var(--dash-text-dim)',
                  fontWeight: 400,
                  textDecoration: 'none',
                  background: active ? 'rgba(200,255,0,0.06)' : 'transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = 'var(--dash-text)'
                    e.currentTarget.style.background = 'var(--dash-bg3)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = 'var(--dash-text-dim)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '4px',
                      bottom: '4px',
                      width: '2px',
                      background: 'var(--acid)',
                      borderRadius: '0 2px 2px 0',
                    }}
                  />
                )}
                <span style={{ fontSize: '14px', width: '18px', textAlign: 'center' as const }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}

          <div
            style={{
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '9px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              color: 'var(--dash-text-muted)',
              padding: '8px 20px 4px',
              marginTop: '8px',
            }}
          >
            Account
          </div>
          {accountItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="block relative"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 20px',
                  fontSize: '13px',
                  color: active ? 'var(--acid)' : 'var(--dash-text-dim)',
                  fontWeight: 400,
                  textDecoration: 'none',
                  background: active ? 'rgba(200,255,0,0.06)' : 'transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = 'var(--dash-text)'
                    e.currentTarget.style.background = 'var(--dash-bg3)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = 'var(--dash-text-dim)'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '4px',
                      bottom: '4px',
                      width: '2px',
                      background: 'var(--acid)',
                      borderRadius: '0 2px 2px 0',
                    }}
                  />
                )}
                <span style={{ fontSize: '14px', width: '18px', textAlign: 'center' as const }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* User / Clerk */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--dash-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <UserButton
            appearance={{
              elements: {
                avatarBox: { width: '26px', height: '26px' },
              },
            }}
          />
          <span style={{ fontSize: '12px', color: 'var(--dash-text-dim)', flex: 1 }}>Account</span>
          <ThemeToggle />
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft: 'var(--sidebar-w)' }}>
        {children}
      </div>
    </div>
  )
}
