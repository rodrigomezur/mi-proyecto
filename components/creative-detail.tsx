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
function fmtNum(n: number) { return n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString() }

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
      toast.success('Analysis complete! Close and reopen to see results.')
    }
    setAnalyzing(false)
  }

  const hasAnalysis = creative.analysis_status === 'complete'
  const hasIterations = creative.iteration_recommendations && creative.iteration_recommendations.length > 0

  const metrics = [
    { label: 'Spend', value: fmt$(creative.spend) },
    { label: 'ROAS', value: `${creative.roas.toFixed(2)}x`, highlight: creative.roas >= 1 },
    { label: 'CPA', value: fmt$(creative.cpa) },
    { label: 'CTR', value: `${creative.ctr.toFixed(2)}%` },
    { label: 'CPM', value: fmt$(creative.cpm) },
    { label: 'Impressions', value: fmtNum(creative.impressions) },
    { label: 'Clicks', value: fmtNum(creative.clicks) },
    ...(creative.ad_type === 'video' ? [
      { label: 'Hook Rate', value: fmtPct(creative.hook_rate) },
      { label: 'Hold Rate', value: fmtPct(creative.hold_rate) },
      { label: '3s Views', value: fmtNum(creative.video_views_3s) },
    ] : []),
  ]

  const classificationFields = [
    { label: 'Asset Type', value: creative.asset_type },
    { label: 'Visual Format', value: creative.visual_format },
    { label: 'Messaging', value: creative.messaging_angle },
    { label: 'Hook Tactic', value: creative.hook_tactic },
    { label: 'Offer', value: creative.offer_type },
    { label: 'Funnel Stage', value: creative.funnel_stage },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        showCloseButton
        className="bg-[var(--dash-bg)] border-[var(--dash-border)] w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl p-0"
      >
        {/* Header bar */}
        <div className="sticky top-0 z-10 bg-[var(--dash-bg)] border-b border-[var(--dash-border)] px-6 py-3 flex items-center justify-between">
          <div className="min-w-0 mr-4">
            <DialogTitle className="text-sm font-semibold text-[var(--dash-text)] truncate">
              {creative.ad_name || 'Unnamed Ad'}
            </DialogTitle>
            <p className="text-[11px] text-[var(--dash-text-muted)]">{creative.campaign} / {creative.ad_set}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={`text-[10px] ${creative.ad_type === 'video' ? 'border-blue-400/30 text-blue-400' : 'border-purple-400/30 text-purple-400'}`}>
              {creative.ad_type}
            </Badge>
            {creative.ad_status === 'ACTIVE' && (
              <Badge className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20 text-[10px]">Live</Badge>
            )}
            <Button
              onClick={handleReanalyze}
              disabled={analyzing}
              variant="outline"
              size="sm"
              className="border-[var(--dash-border)] text-[var(--dash-text-dim)] hover:bg-[var(--dash-bg3)] cursor-pointer text-xs"
            >
              <RefreshCw className={`w-3 h-3 mr-1.5 ${analyzing ? 'animate-spin' : ''}`} />
              {analyzing ? 'Analyzing...' : 'Re-analyze'}
            </Button>
          </div>
        </div>

        {/* Content: 2-col on desktop */}
        <div className="flex flex-col lg:flex-row">
          {/* Left column: Image + Ad Copy */}
          <div className="lg:w-[340px] shrink-0 border-b lg:border-b-0 lg:border-r border-[var(--dash-border)] p-5 space-y-4">
            {/* Thumbnail */}
            <div className="w-full aspect-square rounded-lg bg-[var(--dash-bg3)] overflow-hidden">
              {(creative.image_url || creative.video_thumbnail_url) ? (
                <img
                  src={creative.image_url || creative.video_thumbnail_url || ''}
                  alt={creative.ad_name || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
                  {creative.ad_type === 'video' ? '\u25B6' : '\u25A3'}
                </div>
              )}
            </div>

            {/* Ad Copy */}
            {(creative.ad_headline || creative.ad_description) && (
              <div>
                <h4 className="text-[10px] font-semibold text-[var(--dash-text-muted)] uppercase tracking-wider mb-2">Ad Copy</h4>
                {creative.ad_headline && (
                  <p className="text-sm font-medium text-[var(--dash-text)] mb-1">{creative.ad_headline}</p>
                )}
                {creative.ad_description && (
                  <p className="text-xs text-[var(--dash-text-dim)] leading-relaxed line-clamp-6">{creative.ad_description}</p>
                )}
                {creative.ad_cta && (
                  <Badge variant="outline" className="border-[var(--dash-border)] text-[var(--dash-text-muted)] text-[10px] mt-2">
                    CTA: {creative.ad_cta}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Right column: Metrics + AI Analysis + Iterations */}
          <div className="flex-1 p-5 space-y-5 min-w-0">
            {/* Metrics grid */}
            <div>
              <h4 className="text-[10px] font-semibold text-[var(--dash-text-muted)] uppercase tracking-wider mb-3">Performance</h4>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-x-4 gap-y-3">
                {metrics.map(m => (
                  <div key={m.label}>
                    <p className="text-[10px] text-[var(--dash-text-muted)] uppercase">{m.label}</p>
                    <p className={`text-sm font-bold ${m.highlight ? 'text-emerald-400' : 'text-[var(--dash-text)]'}`}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Classification */}
            {hasAnalysis && (
              <div>
                <h4 className="text-[10px] font-semibold text-[var(--acid)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> AI Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {classificationFields.map(f => f.value && (
                    <Badge key={f.label} variant="outline" className="border-[var(--dash-border)] text-[var(--dash-text)] text-xs py-1">
                      <span className="text-[var(--dash-text-muted)] mr-1">{f.label}:</span> {f.value}
                    </Badge>
                  ))}
                </div>
                {creative.ai_summary && (
                  <p className="text-xs text-[var(--dash-text-dim)] mt-3 leading-relaxed">{creative.ai_summary}</p>
                )}
              </div>
            )}

            {/* Strengths & Weaknesses side by side */}
            {hasAnalysis && (creative.strengths?.length || creative.weaknesses?.length) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {creative.strengths && creative.strengths.length > 0 && (
                  <div className="p-3 rounded-lg bg-emerald-400/5 border border-emerald-400/10">
                    <h4 className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Strengths
                    </h4>
                    <ul className="space-y-1.5">
                      {creative.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-[var(--dash-text-dim)] flex items-start gap-1.5">
                          <span className="text-emerald-400 shrink-0">+</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {creative.weaknesses && creative.weaknesses.length > 0 && (
                  <div className="p-3 rounded-lg bg-red-400/5 border border-red-400/10">
                    <h4 className="text-[10px] font-semibold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Weaknesses
                    </h4>
                    <ul className="space-y-1.5">
                      {creative.weaknesses.map((w, i) => (
                        <li key={i} className="text-xs text-[var(--dash-text-dim)] flex items-start gap-1.5">
                          <span className="text-red-400 shrink-0">-</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            {/* Iteration Recommendations */}
            {hasIterations && (
              <div>
                <h4 className="text-[10px] font-semibold text-[var(--acid)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Target className="w-3 h-3" /> Iterations
                </h4>
                <div className="space-y-2">
                  {creative.iteration_recommendations!.map((rec, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[var(--dash-bg3)] border border-[var(--dash-border)]">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h5 className="text-xs font-medium text-[var(--dash-text)]">{rec.title}</h5>
                        <div className="flex gap-1 shrink-0">
                          <Badge variant="outline" className={`border-[var(--dash-border)] text-[9px] ${impactColor[rec.expected_impact] || ''}`}>
                            {rec.expected_impact}
                          </Badge>
                          <Badge variant="outline" className="border-[var(--dash-border)] text-[var(--dash-text-muted)] text-[9px]">
                            {rec.effort}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-[11px] text-[var(--dash-text-dim)] leading-relaxed">{rec.description}</p>
                      <Badge variant="outline" className="border-[var(--dash-border)] text-[var(--dash-text-muted)] text-[9px] mt-1.5">
                        {rec.focus_area}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Not analyzed */}
            {!hasAnalysis && (
              <div className="text-center py-10">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
