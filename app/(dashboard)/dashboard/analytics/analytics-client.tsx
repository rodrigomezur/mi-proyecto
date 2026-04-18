'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type BreakdownItem = {
  name: string
  totalAds: number
  winners: number
  winRate: number
  spend: number
  avgROAS: number
}

type Recommendation = {
  id: string
  ad_name: string | null
  spend: number
  roas: number
  ctr: number
  hook_rate: number
  recommendation: 'scale' | 'watch' | 'kill'
  reason: string
  funnelStage: string
}

type Analytics = {
  winRate: {
    overview: {
      totalAds: number
      totalWinners: number
      winRate: number
      totalSpend: number
      blendedROAS: number
    }
    winnerThreshold: number
    breakdowns: Record<string, BreakdownItem[]>
  }
  killScale: {
    scale: Recommendation[]
    watch: Recommendation[]
    kill: Recommendation[]
    benchmarks: { avgROAS: number; avgCPA: number; avgHookRate: number; avgHoldRate: number; avgCTR: number }
  }
  iterationPriorities: Array<{
    id: string
    ad_name: string | null
    image_url: string | null
    video_thumbnail_url: string | null
    spend: number
    roas: number
    iteration_priority: number
    top_iteration: { title: string; focus_area: string; expected_impact: string } | null | undefined
  }>
}

function formatCurrency(n: number) { return `$${n.toFixed(2)}` }
function formatPercent(n: number) { return `${n.toFixed(1)}%` }

function BreakdownTable({ title, items }: { title: string; items: BreakdownItem[] }) {
  if (items.length === 0) return null
  return (
    <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
      <CardContent className="pt-5 pb-5">
        <h3 className="text-xs font-semibold text-[var(--dash-text-muted)] uppercase tracking-wider mb-3">{title}</h3>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.name} className="flex items-center gap-3">
              <span className="text-sm text-[var(--dash-text)] flex-1 truncate">{item.name}</span>
              <div className="w-24 h-2 rounded-full bg-[var(--dash-bg3)] overflow-hidden shrink-0">
                <div
                  className="h-full rounded-full bg-[var(--acid)]"
                  style={{ width: `${Math.min(item.winRate, 100)}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-[var(--dash-text)] w-12 text-right">{formatPercent(item.winRate)}</span>
              <span className="text-[10px] text-[var(--dash-text-muted)] w-16 text-right">{item.totalAds} ads</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RecommendationList({ title, items, color }: { title: string; items: Recommendation[]; color: string }) {
  if (items.length === 0) return null
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color }}>{title}</h3>
      <div className="space-y-2">
        {items.map(item => (
          <Card key={item.id} className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
            <CardContent className="pt-3 pb-3">
              <div className="flex items-center gap-3">
                <Badge
                  className={`text-[10px] shrink-0 ${
                    item.recommendation === 'scale' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                    item.recommendation === 'kill' ? 'bg-red-400/10 text-red-400 border-red-400/20' :
                    'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
                  }`}
                >
                  {item.recommendation.toUpperCase()}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--dash-text)] truncate">{item.ad_name || 'Unnamed'}</p>
                  <p className="text-[11px] text-[var(--dash-text-muted)]">{item.reason}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-[var(--dash-text)]">{formatCurrency(item.spend)}</p>
                  <p className={`text-[11px] ${item.roas >= 1 ? 'text-emerald-400' : 'text-[var(--dash-text-muted)]'}`}>
                    {item.roas.toFixed(2)}x ROAS
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsClient({ analytics }: { analytics: Analytics }) {
  const { winRate, killScale } = analytics
  const { overview, breakdowns } = winRate
  const hasData = overview.totalAds > 0

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
        <h1 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '16px', fontWeight: 700, color: 'var(--dash-text)', flex: 1 }}>
          Analytics
        </h1>
        <Badge variant="outline" className="border-[var(--dash-border)] text-[var(--dash-text-muted)]">
          Threshold: {winRate.winnerThreshold}x ROAS
        </Badge>
      </div>

      <div className="flex-1 dashboard-scroll" style={{ padding: '28px' }}>
        {!hasData ? (
          <div className="text-center" style={{ padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>&#9776;</div>
            <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '20px', fontWeight: 700, color: 'var(--dash-text)', marginBottom: '8px' }}>
              No data yet
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--dash-text-muted)' }}>
              Sync your ad accounts to see performance analytics.
            </p>
          </div>
        ) : (
          <>
            {/* Overview stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
              <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
                <CardContent className="pt-4 pb-4">
                  <p className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wider mb-1">Win Rate</p>
                  <p className="text-2xl font-bold text-[var(--acid)] font-hkgrotesk">{formatPercent(overview.winRate)}</p>
                </CardContent>
              </Card>
              <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
                <CardContent className="pt-4 pb-4">
                  <p className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wider mb-1">Winners</p>
                  <p className="text-2xl font-bold text-[var(--dash-text)] font-hkgrotesk">{overview.totalWinners}/{overview.totalAds}</p>
                </CardContent>
              </Card>
              <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
                <CardContent className="pt-4 pb-4">
                  <p className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wider mb-1">Blended ROAS</p>
                  <p className="text-2xl font-bold text-[var(--dash-text)] font-hkgrotesk">{overview.blendedROAS.toFixed(2)}x</p>
                </CardContent>
              </Card>
              <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
                <CardContent className="pt-4 pb-4">
                  <p className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wider mb-1">Total Spend</p>
                  <p className="text-2xl font-bold text-[var(--dash-text)] font-hkgrotesk">{formatCurrency(overview.totalSpend)}</p>
                </CardContent>
              </Card>
              <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
                <CardContent className="pt-4 pb-4">
                  <p className="text-[10px] text-[var(--dash-text-muted)] uppercase tracking-wider mb-1">Scale / Kill</p>
                  <p className="text-2xl font-bold font-hkgrotesk">
                    <span className="text-emerald-400">{killScale.scale.length}</span>
                    <span className="text-[var(--dash-text-muted)]"> / </span>
                    <span className="text-red-400">{killScale.kill.length}</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Win Rate Breakdowns */}
            <h2 className="text-sm font-semibold text-[var(--dash-text)] mb-4" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
              Win Rate by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <BreakdownTable title="By Asset Type" items={breakdowns.assetType} />
              <BreakdownTable title="By Ad Type" items={breakdowns.adType} />
              <BreakdownTable title="By Funnel Stage" items={breakdowns.funnelStage} />
              <BreakdownTable title="By Hook Tactic" items={breakdowns.hookTactic} />
              <BreakdownTable title="By Messaging Angle" items={breakdowns.messagingAngle} />
              <BreakdownTable title="By Visual Format" items={breakdowns.visualFormat} />
            </div>

            {/* Kill / Scale Recommendations */}
            <h2 className="text-sm font-semibold text-[var(--dash-text)] mb-4" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
              Recommendations
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RecommendationList title="Scale" items={killScale.scale} color="var(--color-emerald, #34d399)" />
              <RecommendationList title="Watch" items={killScale.watch} color="var(--color-yellow, #fbbf24)" />
              <RecommendationList title="Kill" items={killScale.kill} color="var(--color-red, #f87171)" />
            </div>

            {/* Iteration Priority */}
            {analytics.iterationPriorities && analytics.iterationPriorities.length > 0 && (
              <>
                <h2 className="text-sm font-semibold text-[var(--dash-text)] mt-8 mb-4" style={{ fontFamily: 'var(--font-syne), sans-serif' }}>
                  Iteration Priority
                </h2>
                <p className="text-xs text-[var(--dash-text-muted)] mb-4">
                  Top ads with highest iteration priority score (high spend + underperforming).
                </p>
                <div className="space-y-2">
                  {analytics.iterationPriorities.map(ad => (
                    <Card key={ad.id} className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
                      <CardContent className="pt-3 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-[var(--dash-bg3)] overflow-hidden shrink-0">
                            {(ad.image_url || ad.video_thumbnail_url) && (
                              <img src={(ad.image_url || ad.video_thumbnail_url)!} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[var(--dash-text)] truncate">{ad.ad_name || 'Unnamed'}</p>
                            {ad.top_iteration && (
                              <p className="text-[11px] text-[var(--dash-text-muted)] truncate">
                                <span className="text-[var(--acid)]">{ad.top_iteration.focus_area}:</span> {ad.top_iteration.title}
                              </p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-[var(--acid)]">{ad.iteration_priority.toFixed(0)}</p>
                            <p className="text-[10px] text-[var(--dash-text-muted)]">priority</p>
                          </div>
                          <div className="text-right shrink-0 hidden sm:block">
                            <p className="text-xs text-[var(--dash-text)]">{formatCurrency(ad.spend)}</p>
                            <p className="text-[10px] text-[var(--dash-text-muted)]">{ad.roas.toFixed(2)}x ROAS</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  )
}
