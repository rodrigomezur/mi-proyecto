'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { generateReport } from '@/app/actions'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { UserAdAccount } from '@/lib/db/types'

type Report = {
  id: string
  ad_account_id: string
  account_name: string
  report_date: string
  total_spend: number
  avg_roas: number
  avg_cpa: number
  avg_hook_rate: number
  avg_hold_rate: number
  total_creatives: number
  top_performers: Array<{ name: string; roas: number; spend: number }> | null
  bottom_performers: Array<{ name: string; roas: number; spend: number }> | null
  best_categories: {
    assetType: { name: string; avgRoas: number } | null
    hookTactic: { name: string; avgRoas: number } | null
    visualFormat: { name: string; avgRoas: number } | null
  } | null
  ai_insights: string | null
  created_at: string
}

function formatCurrency(n: number) { return `$${n.toFixed(2)}` }
function formatPercent(n: number) { return `${(n * 100).toFixed(1)}%` }

export default function ReportsClient({
  initialReports,
  accounts,
}: {
  initialReports: Report[]
  accounts: UserAdAccount[]
}) {
  const [generating, setGenerating] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  async function handleGenerate(adAccountId: string) {
    setGenerating(adAccountId)
    const result = await generateReport(adAccountId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Report generated!')
    }
    setGenerating(null)
  }

  const activeAccounts = accounts.filter(a => a.active)

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
          Reports
        </h1>
      </div>

      <div className="flex-1 dashboard-scroll" style={{ padding: '28px' }}>
        {/* Generate section */}
        {activeAccounts.length > 0 && (
          <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)] mb-6">
            <CardContent className="pt-5 pb-5">
              <h2 className="text-xs font-semibold text-[var(--dash-text-muted)] uppercase tracking-wider mb-3">
                Generate Report
              </h2>
              <div className="flex flex-wrap gap-2">
                {activeAccounts.map(account => (
                  <Button
                    key={account.id}
                    onClick={() => handleGenerate(account.ad_account_id)}
                    disabled={generating !== null}
                    variant="outline"
                    className="border-[var(--dash-border)] text-[var(--dash-text)] hover:bg-[var(--dash-bg3)] cursor-pointer"
                  >
                    {generating === account.ad_account_id ? 'Generating...' : account.account_name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reports list */}
        {initialReports.length === 0 ? (
          <div className="text-center" style={{ padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>&#9993;</div>
            <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '20px', fontWeight: 700, color: 'var(--dash-text)', marginBottom: '8px' }}>
              No reports yet
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--dash-text-muted)' }}>
              Sync your accounts and generate your first report above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {initialReports.map(report => (
              <Card key={report.id} className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
                <CardContent className="pt-5 pb-5">
                  {/* Report header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--dash-text)]">{report.account_name}</h3>
                      <p className="text-xs text-[var(--dash-text-muted)]">{report.report_date}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpanded(expanded === report.id ? null : report.id)}
                      className="border-[var(--dash-border)] text-[var(--dash-text-muted)] hover:bg-[var(--dash-bg3)] cursor-pointer text-xs"
                    >
                      {expanded === report.id ? 'Collapse' : 'View Details'}
                    </Button>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                    <div>
                      <p className="text-[10px] text-[var(--dash-text-muted)] uppercase">Spend</p>
                      <p className="text-lg font-bold text-[var(--acid)]">{formatCurrency(report.total_spend)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--dash-text-muted)] uppercase">ROAS</p>
                      <p className="text-lg font-bold text-[var(--dash-text)]">{report.avg_roas.toFixed(2)}x</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--dash-text-muted)] uppercase">CPA</p>
                      <p className="text-lg font-bold text-[var(--dash-text)]">{formatCurrency(report.avg_cpa)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--dash-text-muted)] uppercase">Hook Rate</p>
                      <p className="text-lg font-bold text-[var(--dash-text)]">{formatPercent(report.avg_hook_rate)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--dash-text-muted)] uppercase">Creatives</p>
                      <p className="text-lg font-bold text-[var(--dash-text)]">{report.total_creatives}</p>
                    </div>
                  </div>

                  {/* Best categories */}
                  {report.best_categories && (
                    <div className="flex gap-2 flex-wrap mb-4">
                      {report.best_categories.assetType && (
                        <Badge variant="outline" className="border-[var(--dash-border)] text-[var(--dash-text-muted)] text-[10px]">
                          Best asset: {report.best_categories.assetType.name} ({report.best_categories.assetType.avgRoas.toFixed(2)}x)
                        </Badge>
                      )}
                      {report.best_categories.hookTactic && (
                        <Badge variant="outline" className="border-[var(--dash-border)] text-[var(--dash-text-muted)] text-[10px]">
                          Best hook: {report.best_categories.hookTactic.name} ({report.best_categories.hookTactic.avgRoas.toFixed(2)}x)
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Expanded details */}
                  {expanded === report.id && (
                    <div className="mt-4 pt-4 border-t border-[var(--dash-border)] space-y-4">
                      {/* Top/Bottom performers */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {report.top_performers && report.top_performers.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Top Performers</h4>
                            <div className="space-y-1">
                              {report.top_performers.map((ad, i) => (
                                <div key={i} className="flex justify-between text-xs">
                                  <span className="text-[var(--dash-text)] truncate flex-1 mr-2">{ad.name}</span>
                                  <span className="text-emerald-400 shrink-0">{ad.roas.toFixed(2)}x</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {report.bottom_performers && report.bottom_performers.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Bottom Performers</h4>
                            <div className="space-y-1">
                              {report.bottom_performers.map((ad, i) => (
                                <div key={i} className="flex justify-between text-xs">
                                  <span className="text-[var(--dash-text)] truncate flex-1 mr-2">{ad.name}</span>
                                  <span className="text-red-400 shrink-0">{ad.roas.toFixed(2)}x</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* AI Insights */}
                      {report.ai_insights && (
                        <div>
                          <h4 className="text-xs font-semibold text-[var(--acid)] uppercase tracking-wider mb-2">AI Insights</h4>
                          <div className="text-sm text-[var(--dash-text-dim)] leading-relaxed whitespace-pre-wrap">
                            {report.ai_insights}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
