// Analytics computations — all done in-memory from creatives data

type Creative = {
  id: string
  ad_name: string | null
  ad_type: string | null
  spend: number
  roas: number
  cpa: number
  ctr: number
  hook_rate: number
  hold_rate: number
  impressions: number
  clicks: number
  conversions: number
  asset_type: string | null
  funnel_stage: string | null
  hook_tactic: string | null
  messaging_angle: string | null
  visual_format: string | null
  image_url: string | null
}

type Benchmarks = {
  avgROAS: number
  avgCPA: number
  avgHookRate: number
  avgHoldRate: number
  avgCTR: number
}

type Recommendation = Creative & {
  recommendation: 'scale' | 'watch' | 'kill'
  reason: string
  funnelStage: string
}

type BreakdownItem = {
  name: string
  totalAds: number
  winners: number
  winRate: number
  spend: number
  avgROAS: number
}

// ── Helpers ─────────────────────────────────────────────────

function avg(arr: number[]): number {
  const filtered = arr.filter(n => n > 0)
  return filtered.length > 0 ? filtered.reduce((a, b) => a + b, 0) / filtered.length : 0
}

function normalizeFunnel(stage: string | null): string {
  if (!stage) return 'Unanalyzed'
  const upper = stage.toUpperCase()
  if (upper.includes('TOP') || upper === 'TOF' || upper.startsWith('TOF')) return 'TOF'
  if (upper.includes('MIDDLE') || upper === 'MOF' || upper.startsWith('MOF')) return 'MOF'
  if (upper.includes('BOTTOM') || upper === 'BOF' || upper.startsWith('BOF')) return 'BOF'
  return stage
}

function computeBenchmarks(creatives: Creative[]): Benchmarks {
  const withSpend = creatives.filter(c => c.spend > 0)
  return {
    avgROAS: avg(withSpend.map(c => c.roas)),
    avgCPA: avg(withSpend.map(c => c.cpa)),
    avgHookRate: avg(withSpend.map(c => c.hook_rate)),
    avgHoldRate: avg(withSpend.map(c => c.hold_rate)),
    avgCTR: avg(withSpend.map(c => c.ctr)),
  }
}

// ── Win Rate Analysis ───────────────────────────────────────

function computeBreakdown(creatives: Creative[], field: keyof Creative, threshold: number): BreakdownItem[] {
  const groups: Record<string, Creative[]> = {}
  creatives.forEach(c => {
    const key = (c[field] as string) || 'Unanalyzed'
    if (!groups[key]) groups[key] = []
    groups[key].push(c)
  })

  return Object.entries(groups)
    .map(([name, items]) => {
      const winners = items.filter(c => c.roas >= threshold).length
      return {
        name,
        totalAds: items.length,
        winners,
        winRate: items.length > 0 ? (winners / items.length) * 100 : 0,
        spend: items.reduce((s, c) => s + c.spend, 0),
        avgROAS: avg(items.map(c => c.roas)),
      }
    })
    .sort((a, b) => b.spend - a.spend)
}

export function computeWinRateAnalysis(creatives: Creative[], winnerThreshold: number) {
  const withSpend = creatives.filter(c => c.spend > 0)
  const totalAds = withSpend.length
  const totalWinners = withSpend.filter(c => c.roas >= winnerThreshold).length
  const totalSpend = withSpend.reduce((s, c) => s + c.spend, 0)
  const blendedROAS = avg(withSpend.map(c => c.roas))

  return {
    overview: {
      totalAds,
      totalWinners,
      winRate: totalAds > 0 ? (totalWinners / totalAds) * 100 : 0,
      totalSpend,
      blendedROAS,
    },
    winnerThreshold,
    breakdowns: {
      assetType: computeBreakdown(withSpend, 'asset_type', winnerThreshold),
      messagingAngle: computeBreakdown(withSpend, 'messaging_angle', winnerThreshold),
      hookTactic: computeBreakdown(withSpend, 'hook_tactic', winnerThreshold),
      visualFormat: computeBreakdown(withSpend, 'visual_format', winnerThreshold),
      funnelStage: computeBreakdown(withSpend, 'funnel_stage', winnerThreshold),
      adType: computeBreakdown(withSpend, 'ad_type', winnerThreshold),
    },
  }
}

// ── Kill / Scale / Watch ────────────────────────────────────

export function computeKillScale(creatives: Creative[], winnerThreshold: number) {
  const withSpend = creatives.filter(c => c.spend > 0)
  if (withSpend.length === 0) {
    return { scale: [], watch: [], kill: [], benchmarks: computeBenchmarks([]) }
  }

  const benchmarks = computeBenchmarks(withSpend)
  const scale: Recommendation[] = []
  const watch: Recommendation[] = []
  const kill: Recommendation[] = []

  withSpend.forEach(c => {
    const stage = normalizeFunnel(c.funnel_stage)
    let rec: 'scale' | 'watch' | 'kill' = 'watch'
    let reason = ''

    if (stage === 'TOF') {
      // TOF: Hook rate + CTR
      if (c.hook_rate > benchmarks.avgHookRate * 1.2 && c.ctr > benchmarks.avgCTR * 1.1) {
        rec = 'scale'
        reason = `Hook ${(c.hook_rate * 100).toFixed(1)}% + CTR ${c.ctr.toFixed(2)}% — above average`
      } else if (c.hook_rate < benchmarks.avgHookRate * 0.5 && c.spend > benchmarks.avgCPA * 2) {
        rec = 'kill'
        reason = `Hook ${(c.hook_rate * 100).toFixed(1)}% — low hook rate with $${c.spend.toFixed(0)} spend`
      } else {
        reason = `Hook ${(c.hook_rate * 100).toFixed(1)}% — monitoring`
      }
    } else if (stage === 'MOF') {
      // MOF: CTR + ROAS
      if (c.ctr > benchmarks.avgCTR * 1.2 && c.roas >= winnerThreshold) {
        rec = 'scale'
        reason = `CTR ${c.ctr.toFixed(2)}% + ROAS ${c.roas.toFixed(2)}x — strong mid-funnel`
      } else if (c.roas < winnerThreshold * 0.5 && c.spend > benchmarks.avgCPA * 2) {
        rec = 'kill'
        reason = `ROAS ${c.roas.toFixed(2)}x — below threshold with significant spend`
      } else {
        reason = `CTR ${c.ctr.toFixed(2)}% — monitoring`
      }
    } else {
      // BOF + Unanalyzed: ROAS + CPA
      if (c.roas >= winnerThreshold * 1.5) {
        rec = 'scale'
        reason = `ROAS ${c.roas.toFixed(2)}x — strong performer`
      } else if (c.roas < winnerThreshold * 0.3 && c.spend > benchmarks.avgCPA * 3) {
        rec = 'kill'
        reason = `ROAS ${c.roas.toFixed(2)}x — underperforming with $${c.spend.toFixed(0)} spend`
      } else {
        reason = c.roas > 0 ? `ROAS ${c.roas.toFixed(2)}x — near average` : `$${c.spend.toFixed(0)} spend — needs more data`
      }
    }

    const item: Recommendation = { ...c, recommendation: rec, reason, funnelStage: stage }
    if (rec === 'scale') scale.push(item)
    else if (rec === 'kill') kill.push(item)
    else watch.push(item)
  })

  return {
    scale: scale.sort((a, b) => b.roas - a.roas).slice(0, 10),
    watch: watch.sort((a, b) => b.spend - a.spend).slice(0, 10),
    kill: kill.sort((a, b) => b.spend - a.spend).slice(0, 10),
    benchmarks,
  }
}
