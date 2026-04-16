'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { reanalyzeCreative } from '@/app/actions'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { RefreshCw, Zap, Target, TrendingUp, AlertTriangle } from 'lucide-react'

type Creative = {
  id: string
  ad_id: string
  ad_name: string | null
  campaign: string | null
  ad_set: string | null
  ad_type: string | null
  ad_status: string | null
  image_url: string | null
  video_url: string | null
  video_thumbnail_url: string | null
  spend: number
  impressions: number
  clicks: number
  ctr: number
  roas: number
  cpa: number
  cpm: number
  hook_rate: number
  hold_rate: number
  video_views_3s: number
  video_25: number
  video_50: number
  video_75: number
  video_100: number
  link_clicks: number
  ad_headline: string | null
  ad_description: string | null
  ad_cta: string | null
  asset_type: string | null
  visual_format: string | null
  messaging_angle: string | null
  hook_tactic: string | null
  offer_type: string | null
  funnel_stage: string | null
  ai_summary: string | null
  analysis_status: string | null
  strengths: string[] | null
  weaknesses: string[] | null
  iteration_recommendations: Array<{
    title: string
    description: string
    focus_area: string
    expected_impact: string
    effort: string
  }> | null
  iteration_priority: number | null
}

function fmt$(n: number) { return `$${n.toFixed(2)}` }
function fmtPct(n: number) { return `${(n * 100).toFixed(1)}%` }
function fmtNum(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString() }

const impactColor: Record<string, string> = {
  High: 'text-emerald-400',
  Medium: 'text-yellow-400',
  Low: 'text-[var(--dash-text-muted)]',
}

export default function CreativeDetail({
  creative,
  open,
  onClose,
}: {
  creative: Creative | null
  open: boolean
  onClose: () => void
}) {
  const [analyzing, setAnalyzing] = useState(false)

  if (!creative) return null

  async function handleReanalyze() {
    setAnalyzing(true)
    const result = await reanalyzeCreative(creative!.id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Analysis complete! Refresh to see results.')
    }
    setAnalyzing(false)
  }

  const hasAnalysis = creative.analysis_status === 'complete'
  const hasIterations = creative.iteration_recommendations && creative.iteration_recommendations.length > 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[var(--dash-bg)] border-[var(--dash-border)] max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-xl p-0 [&>button:last-child]:hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[var(--dash-bg)] border-b border-[var(--dash-border)] px-6 py-4 flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-4">
            <DialogTitle className="text-base font-semibold text-[var(--dash-text)] truncate">
              {creative.ad_name || 'Unnamed Ad'}
            </DialogTitle>
            <p className="text-xs text-[var(--dash-text-muted)] mt-0.5">{creative.campaign} / {creative.ad_set}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handleReanalyze}
              disabled={analyzing}
              variant="outline"
              size="sm"
              className="border-[var(--dash-border)] text-[var(--dash-text-dim)] hover:bg-[var(--dash-bg3)] cursor-pointer text-xs"
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${analyzing ? 'animate-spin' : ''}`} />
              {analyzing ? 'Analyzing...' : 'Re-analyze'}
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Thumbnail + Metrics */}
          <div className="flex gap-6 flex-col sm:flex-row">
            {/* Image */}
            <div className="w-full sm:w-48 h-48 rounded-lg bg-[var(--dash-bg3)] overflow-hidden shrink-0">
              {(creative.image_url || creative.video_thumbnail_url) ? (
                <img
                  src={creative.image_url || creative.video_thumbnail_url || ''}
                  alt={creative.ad_name || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
                  {creative.ad_type === 'video' ? '\u25B6' : '\u25A3'}
                </div>
              )}
            </div>

            {/* Key Metrics */}
            <div className="flex-1 grid grid-cols-3 gap-3">
              {[
                { label: 'Spend', value: fmt$(creative.spend) },
                { label: 'ROAS', value: `${creative.roas.toFixed(2)}x`, highlight: creative.roas >= 1 },
                { label: 'CPA', value: fmt$(creative.cpa) },
                { label: 'CTR', value: `${creative.ctr.toFixed(2)}%` },
                { label: 'Hook Rate', value: fmtPct(creative.hook_rate) },
                { label: 'Hold Rate', value: fmtPct(creative.hold_rate) },
                { label: 'Impressions', value: fmtNum(creative.impressions) },
                { label: 'Clicks', value: fmtNum(creative.clicks) },
                { label: 'CPM', value: fmt$(creative.cpm) },
              ].map(m => (
                <div key={m.label}>
                  <p className="text-[10px] text-[var(--dash-text-muted)] uppercase">{m.label}</p>
                  <p className={`text-sm font-semibold ${m.highlight ? 'text-emerald-400' : 'text-[var(--dash-text)]'}`}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Classification */}
          {hasAnalysis && (
            <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
              <CardContent className="pt-5 pb-5">
                <h3 className="text-xs font-semibold text-[var(--acid)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> AI Classification
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Asset Type', value: creative.asset_type },
                    { label: 'Visual Format', value: creative.visual_format },
                    { label: 'Messaging', value: creative.messaging_angle },
                    { label: 'Hook Tactic', value: creative.hook_tactic },
                    { label: 'Offer', value: creative.offer_type },
                    { label: 'Funnel Stage', value: creative.funnel_stage },
                  ].map(f => (
                    <div key={f.label}>
                      <p className="text-[10px] text-[var(--dash-text-muted)] uppercase">{f.label}</p>
                      <Badge variant="outline" className="border-[var(--dash-border)] text-[var(--dash-text)] text-xs mt-1">
                        {f.value || '—'}
                      </Badge>
                    </div>
                  ))}
                </div>
                {creative.ai_summary && (
                  <p className="text-sm text-[var(--dash-text-dim)] mt-4 leading-relaxed">{creative.ai_summary}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Strengths & Weaknesses */}
          {hasAnalysis && (creative.strengths || creative.weaknesses) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {creative.strengths && creative.strengths.length > 0 && (
                <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
                  <CardContent className="pt-5 pb-5">
                    <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" /> Strengths
                    </h3>
                    <ul className="space-y-2">
                      {creative.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-[var(--dash-text-dim)] flex items-start gap-2">
                          <span className="text-emerald-400 mt-0.5 shrink-0">+</span> {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {creative.weaknesses && creative.weaknesses.length > 0 && (
                <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
                  <CardContent className="pt-5 pb-5">
                    <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Weaknesses
                    </h3>
                    <ul className="space-y-2">
                      {creative.weaknesses.map((w, i) => (
                        <li key={i} className="text-sm text-[var(--dash-text-dim)] flex items-start gap-2">
                          <span className="text-red-400 mt-0.5 shrink-0">-</span> {w}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Iteration Recommendations */}
          {hasIterations && (
            <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
              <CardContent className="pt-5 pb-5">
                <h3 className="text-xs font-semibold text-[var(--acid)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" /> Iteration Recommendations
                </h3>
                <div className="space-y-3">
                  {creative.iteration_recommendations!.map((rec, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[var(--dash-bg3)] border border-[var(--dash-border)]">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-sm font-medium text-[var(--dash-text)]">{rec.title}</h4>
                        <div className="flex gap-1.5">
                          <Badge variant="outline" className={`border-[var(--dash-border)] text-[10px] ${impactColor[rec.expected_impact] || ''}`}>
                            {rec.expected_impact} impact
                          </Badge>
                          <Badge variant="outline" className="border-[var(--dash-border)] text-[var(--dash-text-muted)] text-[10px]">
                            {rec.effort} effort
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--dash-text-dim)] leading-relaxed">{rec.description}</p>
                      <Badge variant="outline" className="border-[var(--dash-border)] text-[var(--dash-text-muted)] text-[10px] mt-2">
                        {rec.focus_area}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Not analyzed state */}
          {!hasAnalysis && (
            <div className="text-center py-8">
              <Zap className="w-8 h-8 mx-auto mb-3 text-[var(--dash-text-muted)] opacity-40" />
              <p className="text-sm text-[var(--dash-text-muted)] mb-4">
                {creative.analysis_status === 'pending' ? 'Analysis pending...' :
                 creative.analysis_status === 'failed' ? 'Analysis failed. Try again.' :
                 'Not yet analyzed by AI.'}
              </p>
              <Button
                onClick={handleReanalyze}
                disabled={analyzing}
                className="bg-[var(--acid)] hover:bg-[var(--acid)] text-black font-semibold cursor-pointer"
              >
                {analyzing ? 'Analyzing...' : 'Analyze with AI'}
              </Button>
            </div>
          )}

          {/* Ad Copy */}
          {(creative.ad_headline || creative.ad_description) && (
            <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
              <CardContent className="pt-5 pb-5">
                <h3 className="text-xs font-semibold text-[var(--dash-text-muted)] uppercase tracking-wider mb-3">Ad Copy</h3>
                {creative.ad_headline && (
                  <p className="text-sm font-medium text-[var(--dash-text)] mb-1">{creative.ad_headline}</p>
                )}
                {creative.ad_description && (
                  <p className="text-xs text-[var(--dash-text-dim)] leading-relaxed">{creative.ad_description}</p>
                )}
                {creative.ad_cta && (
                  <Badge variant="outline" className="border-[var(--dash-border)] text-[var(--dash-text-muted)] text-[10px] mt-2">
                    CTA: {creative.ad_cta}
                  </Badge>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
