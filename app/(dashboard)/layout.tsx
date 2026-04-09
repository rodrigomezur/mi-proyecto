'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Palette, BarChart3, FileText, Settings, Menu } from 'lucide-react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import LogoutButton from '@/components/auth/logout-button'
import ThemeToggle from '@/components/ui/theme-toggle'

const navItems = [
  { label: 'Overview', href: '/dashboard/overview', icon: LayoutDashboard },
  { label: 'Accounts', href: '/dashboard/accounts', icon: Users },
  { label: 'Creatives', href: '/dashboard/creatives', icon: Palette },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Reports', href: '/dashboard/reports', icon: FileText },
]

const accountItems = [
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  function isActive(href: string) {
    if (href === '/dashboard/overview') return pathname === '/dashboard' || pathname === '/dashboard/overview'
    return pathname.startsWith(href)
  }

  return (
    <div className="flex flex-col h-full bg-[var(--dash-bg2)] text-[var(--dash-text)]">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-[var(--dash-border)]">
        <span className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-[var(--acid)]">
          CREATIQ
        </span>
        <div className="font-[family-name:var(--font-dm-mono)] text-[9px] text-[var(--dash-text-muted)] tracking-[0.15em] uppercase mt-0.5">
          Creative Analytics
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3">
        <div className="font-[family-name:var(--font-dm-mono)] text-[9px] tracking-[0.15em] uppercase text-[var(--dash-text-muted)] px-5 pt-2 pb-1">
          Analytics
        </div>
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`relative flex items-center gap-2.5 px-5 py-2.5 text-[13px] transition-all duration-200
                ${active
                  ? 'text-[var(--acid)] bg-[var(--acid)]/[0.06]'
                  : 'text-[var(--dash-text-dim)] hover:text-[var(--dash-text)] hover:bg-[var(--dash-bg3)]'
                }`}
            >
              {active && (
                <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-[var(--acid)] rounded-r" />
              )}
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}

        <div className="font-[family-name:var(--font-dm-mono)] text-[9px] tracking-[0.15em] uppercase text-[var(--dash-text-muted)] px-5 pt-4 pb-1">
          Account
        </div>
        {accountItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`relative flex items-center gap-2.5 px-5 py-2.5 text-[13px] transition-all duration-200
                ${active
                  ? 'text-[var(--acid)] bg-[var(--acid)]/[0.06]'
                  : 'text-[var(--dash-text-dim)] hover:text-[var(--dash-text)] hover:bg-[var(--dash-bg3)]'
                }`}
            >
              {active && (
                <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-[var(--acid)] rounded-r" />
              )}
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t border-[var(--dash-border)] flex items-center gap-2.5">
        <LogoutButton />
        <span className="flex-1" />
        <ThemeToggle />
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[var(--dash-bg)] text-[var(--dash-text)] font-[family-name:var(--font-dm-sans)]">
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed top-0 left-0 bottom-0 z-50 w-[var(--sidebar-w)] flex-col border-r border-[var(--dash-border)]">
        <SidebarContent pathname={pathname} />
      </nav>

      {/* Mobile header + sheet */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[var(--dash-bg2)] border-b border-[var(--dash-border)] flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-[var(--dash-text)] hover:bg-[var(--dash-bg3)] -ml-2 p-2 rounded-md transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="p-0 w-[260px] bg-[var(--dash-bg2)] border-[var(--dash-border)]">
            <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-widest text-[var(--acid)]">
          CREATIQ
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-[var(--sidebar-w)] mt-14 md:mt-0">
        {children}
      </div>
    </div>
  )
}
