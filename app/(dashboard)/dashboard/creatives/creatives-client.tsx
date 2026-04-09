'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import type { UserAdAccount } from '@/lib/db/types'

type Creative = {
  id: string
  ad_id: string
  ad_name: string | null
  campaign: string | null
  ad_set: string | null
  ad_account_id: string
  ad_status: string | null
  ad_type: string | null
  image_url: string | null
  video_url: string | null
  spend: number
  impressions: number
  clicks: number
  ctr: number
  roas: number
  cpa: number
  hook_rate: number
  hold_rate: number
  analysis_status: string | null
  asset_type: string | null
  funnel_stage: string | null
  ai_summary: string | null
  last_synced: string | null
}

function formatCurrency(n: number) {
  return `$${n.toFixed(2)}`
}

function formatPercent(n: number) {
  return `${(n * 100).toFixed(1)}%`
}

function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

export default function CreativesClient({
  initialCreatives,
  accounts,
}: {
  initialCreatives: Creative[]
  accounts: UserAdAccount[]
}) {
  const [search, setSearch] = useState('')
  const [filterAccount, setFilterAccount] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortBy, setSortBy] = useState('spend')

  const filtered = useMemo(() => {
    let result = initialCreatives

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        c =>
          c.ad_name?.toLowerCase().includes(q) ||
          c.campaign?.toLowerCase().includes(q) ||
          c.ad_set?.toLowerCase().includes(q)
      )
    }
    if (filterAccount) {
      result = result.filter(c => c.ad_account_id === filterAccount)
    }
    if (filterType) {
      result = result.filter(c => c.ad_type === filterType)
    }
    if (filterStatus) {
      result = result.filter(c => c.ad_status === filterStatus)
    }

    result.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortBy] as number ?? 0
      const bVal = (b as Record<string, unknown>)[sortBy] as number ?? 0
      return bVal - aVal
    })

    return result
  }, [initialCreatives, search, filterAccount, filterType, filterStatus, sortBy])

  // Stats
  const totalSpend = initialCreatives.reduce((sum, c) => sum + c.spend, 0)
  const totalImpressions = initialCreatives.reduce((sum, c) => sum + c.impressions, 0)
  const avgRoas = initialCreatives.length > 0
    ? initialCreatives.reduce((sum, c) => sum + c.roas, 0) / initialCreatives.filter(c => c.roas > 0).length || 0
    : 0
  const videoCount = initialCreatives.filter(c => c.ad_type === 'video').length
  const imageCount = initialCreatives.filter(c => c.ad_type === 'image').length

  return (
    <>
      {/* Header */}
      <div
        className="sticky top-0 z-40 shrink-0 flex items-center gap-4"
        style={{
          height: '56px',
          borderBottom: '1px solid var(--dash-border)',
          padding: '0 28px',
          background: 'var(--dash-bg)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--dash-text)',
            flex: 1,
          }}
        >
          Creatives
        </h1>
        <Badge variant="outline" className="border-[var(--dash-border)] text-[var(--dash-text-muted)]">
          {initialCreatives.length} ads
        </Badge>
      </div>

      <div className="flex-1 dashboard-scroll" style={{ padding: '28px' }}>
        {initialCreatives.length === 0 ? (
          <div className="text-center" style={{ padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>&#9634;</div>
            <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '20px', fontWeight: 700, color: 'var(--dash-text)', marginBottom: '8px' }}>
              No creatives yet
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--dash-text-muted)' }}>
              Sync an ad account to start seeing your creatives here.
            </p>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
                <CardContent className="pt-4 pb-4">
                  <p className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wider mb-1">Total Spend</p>
                  <p className="text-xl font-bold text-[var(--acid)] font-hkgrotesk">{formatCurrency(totalSpend)}</p>
                </CardContent>
              </Card>
              <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
                <CardContent className="pt-4 pb-4">
                  <p className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wider mb-1">Impressions</p>
                  <p className="text-xl font-bold text-[var(--dash-text)] font-hkgrotesk">{formatNumber(totalImpressions)}</p>
                </CardContent>
              </Card>
              <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
                <CardContent className="pt-4 pb-4">
                  <p className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wider mb-1">Avg ROAS</p>
                  <p className="text-xl font-bold text-[var(--dash-text)] font-hkgrotesk">{avgRoas.toFixed(2)}x</p>
                </CardContent>
              </Card>
              <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
                <CardContent className="pt-4 pb-4">
                  <p className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wider mb-1">Videos</p>
                  <p className="text-xl font-bold text-[var(--dash-text)] font-hkgrotesk">{videoCount}</p>
                </CardContent>
              </Card>
              <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
                <CardContent className="pt-4 pb-4">
                  <p className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wider mb-1">Images</p>
                  <p className="text-xl font-bold text-[var(--dash-text)] font-hkgrotesk">{imageCount}</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Input
                type="text"
                placeholder="Search ads..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-[var(--dash-bg2)] border-[var(--dash-border)] text-[var(--dash-text)] placeholder:text-[var(--dash-text-muted)] w-48"
              />
              {accounts.length > 1 && (
                <select
                  value={filterAccount}
                  onChange={e => setFilterAccount(e.target.value)}
                  className="px-3 py-2 rounded-md text-sm bg-[var(--dash-bg2)] border border-[var(--dash-border)] text-[var(--dash-text)] outline-none"
                >
                  <option value="">All accounts</option>
                  {accounts.map(a => (
                    <option key={a.id} value={a.ad_account_id}>{a.account_name}</option>
                  ))}
                </select>
              )}
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="px-3 py-2 rounded-md text-sm bg-[var(--dash-bg2)] border border-[var(--dash-border)] text-[var(--dash-text)] outline-none"
              >
                <option value="">All types</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
              </select>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-md text-sm bg-[var(--dash-bg2)] border border-[var(--dash-border)] text-[var(--dash-text)] outline-none"
              >
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
              </select>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-md text-sm bg-[var(--dash-bg2)] border border-[var(--dash-border)] text-[var(--dash-text)] outline-none"
              >
                <option value="spend">Sort: Spend</option>
                <option value="roas">Sort: ROAS</option>
                <option value="ctr">Sort: CTR</option>
                <option value="hook_rate">Sort: Hook Rate</option>
                <option value="hold_rate">Sort: Hold Rate</option>
                <option value="impressions">Sort: Impressions</option>
              </select>
              <Badge variant="outline" className="self-center border-[var(--dash-border)] text-[var(--dash-text-muted)] px-3 py-2">
                {filtered.length} results
              </Badge>
            </div>

            {/* Creatives grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(creative => (
                <Card key={creative.id} className="bg-[var(--dash-bg2)] border-[var(--dash-border)] overflow-hidden transition-all duration-200 hover:border-[var(--dash-border-bright)] hover:shadow-lg hover:shadow-black/20">
                  {/* Thumbnail */}
                  {creative.image_url && (
                    <div className="h-40 bg-[var(--dash-bg3)] overflow-hidden">
                      <img
                        src={creative.image_url}
                        alt={creative.ad_name || 'Ad creative'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {!creative.image_url && (
                    <div className="h-40 bg-[var(--dash-bg3)] flex items-center justify-center">
                      <span className="text-3xl opacity-20">{creative.ad_type === 'video' ? '\u25B6' : '\u25A3'}</span>
                    </div>
                  )}

                  <CardContent className="pt-4 pb-4">
                    {/* Name + badges */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3
                        className="text-sm font-medium text-[var(--dash-text)] line-clamp-2"
                        title={creative.ad_name || undefined}
                      >
                        {creative.ad_name || 'Unnamed Ad'}
                      </h3>
                      <div className="flex gap-1 shrink-0">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            creative.ad_type === 'video'
                              ? 'border-blue-400/30 text-blue-400'
                              : 'border-purple-400/30 text-purple-400'
                          }`}
                        >
                          {creative.ad_type || '?'}
                        </Badge>
                        {creative.ad_status === 'ACTIVE' && (
                          <Badge className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20 text-[10px]">Live</Badge>
                        )}
                      </div>
                    </div>

                    {/* Campaign */}
                    <p className="text-[11px] text-[var(--dash-text-muted)] mb-3 truncate">
                      {creative.campaign || 'No campaign'}
                    </p>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-[11px]">
                      <div>
                        <span className="text-[var(--dash-text-muted)]">Spend</span>
                        <p className="font-semibold text-[var(--dash-text)]">{formatCurrency(creative.spend)}</p>
                      </div>
                      <div>
                        <span className="text-[var(--dash-text-muted)]">ROAS</span>
                        <p className={`font-semibold ${creative.roas >= 1 ? 'text-emerald-400' : 'text-[var(--dash-text)]'}`}>
                          {creative.roas.toFixed(2)}x
                        </p>
                      </div>
                      <div>
                        <span className="text-[var(--dash-text-muted)]">CTR</span>
                        <p className="font-semibold text-[var(--dash-text)]">{formatPercent(creative.ctr / 100)}</p>
                      </div>
                      {creative.ad_type === 'video' && (
                        <>
                          <div>
                            <span className="text-[var(--dash-text-muted)]">Hook</span>
                            <p className="font-semibold text-[var(--dash-text)]">{formatPercent(creative.hook_rate)}</p>
                          </div>
                          <div>
                            <span className="text-[var(--dash-text-muted)]">Hold</span>
                            <p className="font-semibold text-[var(--dash-text)]">{formatPercent(creative.hold_rate)}</p>
                          </div>
                          <div>
                            <span className="text-[var(--dash-text-muted)]">CPA</span>
                            <p className="font-semibold text-[var(--dash-text)]">{formatCurrency(creative.cpa)}</p>
                          </div>
                        </>
                      )}
                      {creative.ad_type === 'image' && (
                        <>
                          <div>
                            <span className="text-[var(--dash-text-muted)]">CPA</span>
                            <p className="font-semibold text-[var(--dash-text)]">{formatCurrency(creative.cpa)}</p>
                          </div>
                          <div>
                            <span className="text-[var(--dash-text-muted)]">Clicks</span>
                            <p className="font-semibold text-[var(--dash-text)]">{formatNumber(creative.clicks)}</p>
                          </div>
                          <div>
                            <span className="text-[var(--dash-text-muted)]">Impr</span>
                            <p className="font-semibold text-[var(--dash-text)]">{formatNumber(creative.impressions)}</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* AI analysis badge */}
                    {creative.funnel_stage && (
                      <div className="mt-3 flex gap-1 flex-wrap">
                        <Badge variant="outline" className="border-[var(--dash-border)] text-[var(--dash-text-muted)] text-[10px]">
                          {creative.funnel_stage}
                        </Badge>
                        {creative.asset_type && (
                          <Badge variant="outline" className="border-[var(--dash-border)] text-[var(--dash-text-muted)] text-[10px]">
                            {creative.asset_type}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
