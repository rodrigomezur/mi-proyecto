import { getMyCreatives, getMyAdAccounts, getMySettings } from '@/app/actions'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Users, Palette, BarChart3, Settings, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Overview — Creatiq' }

export default async function OverviewPage() {
  const [creatives, accounts, settings] = await Promise.all([
    getMyCreatives(),
    getMyAdAccounts(),
    getMySettings(),
  ])

  const totalSpend = creatives.reduce((s, c) => s + (c.spend ?? 0), 0)
  const totalCreatives = creatives.length
  const activeAccounts = accounts.filter(a => a.active).length
  const hasToken = !!settings?.meta_access_token

  return (
    <>
      <div className="sticky top-0 z-40 shrink-0 flex items-center gap-4 h-14 border-b border-[var(--dash-border)] px-7 bg-[var(--dash-bg)]">
        <h1 className="font-[family-name:var(--font-syne)] text-base font-bold text-[var(--dash-text)] flex-1">
          Overview
        </h1>
      </div>

      <div className="flex-1 dashboard-scroll p-7">
        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
            <CardContent className="pt-5 pb-5">
              <p className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wider mb-1">Accounts</p>
              <p className="text-2xl font-bold text-[var(--acid)] font-hkgrotesk">{activeAccounts}</p>
            </CardContent>
          </Card>
          <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
            <CardContent className="pt-5 pb-5">
              <p className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wider mb-1">Creatives</p>
              <p className="text-2xl font-bold text-[var(--dash-text)] font-hkgrotesk">{totalCreatives}</p>
            </CardContent>
          </Card>
          <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
            <CardContent className="pt-5 pb-5">
              <p className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wider mb-1">Total Spend</p>
              <p className="text-2xl font-bold text-[var(--dash-text)] font-hkgrotesk">${totalSpend.toFixed(0)}</p>
            </CardContent>
          </Card>
          <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
            <CardContent className="pt-5 pb-5">
              <p className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wider mb-1">API Status</p>
              <Badge className={hasToken ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'}>
                {hasToken ? 'Connected' : 'Not configured'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Quick links */}
        <h2 className="font-[family-name:var(--font-syne)] text-sm font-bold text-[var(--dash-text)] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Manage Accounts', desc: 'Add or sync Meta ad accounts', href: '/dashboard/accounts', icon: Users },
            { label: 'View Creatives', desc: 'Browse and filter your ads', href: '/dashboard/creatives', icon: Palette },
            { label: 'Analytics', desc: 'Win rates and recommendations', href: '/dashboard/analytics', icon: BarChart3 },
            { label: 'Settings', desc: 'API keys and thresholds', href: '/dashboard/settings', icon: Settings },
          ].map(item => (
            <Link key={item.href} href={item.href}>
              <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)] transition-all duration-200 hover:border-[var(--dash-border-bright)] hover:shadow-lg hover:shadow-black/20 cursor-pointer h-full">
                <CardContent className="pt-5 pb-5 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--dash-bg3)] border border-[var(--acid-dim)] flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-[var(--acid)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--dash-text)] flex items-center gap-1">
                      {item.label}
                      <ArrowRight className="w-3 h-3 text-[var(--dash-text-muted)]" />
                    </p>
                    <p className="text-xs text-[var(--dash-text-muted)] mt-0.5">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
