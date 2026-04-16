import { createServerClient } from '@/lib/db/supabase'

type Creative = {
  ad_name: string | null
  ad_account_id: string
  spend: number
  roas: number
  cpa: number
  hook_rate: number
  hold_rate: number
  asset_type: string | null
  hook_tactic: string | null
  visual_format: string | null
}

type ReportData = {
  accountId: string
  accountName: string
  reportDate: string
  totalSpend: number
  avgROAS: number
  avgCPA: number
  avgHookRate: number
  avgHoldRate: number
  totalCreatives: number
  topPerformers: Array<{ name: string; roas: number; spend: number }>
  bottomPerformers: Array<{ name: string; roas: number; spend: number }>
  bestCategories: {
    assetType: { name: string; avgRoas: number } | null
    hookTactic: { name: string; avgRoas: number } | null
    visualFormat: { name: string; avgRoas: number } | null
  }
}

function avg(arr: number[]): number {
  const f = arr.filter(n => n > 0)
  return f.length > 0 ? f.reduce((a, b) => a + b, 0) / f.length : 0
}

function findBestCategory(creatives: Creative[], field: keyof Creative): { name: string; avgRoas: number } | null {
  const groups: Record<string, number[]> = {}
  creatives.forEach(c => {
    const key = (c[field] as string) || 'Unknown'
    if (key === 'Unknown') return
    if (!groups[key]) groups[key] = []
    groups[key].push(c.roas)
  })

  let best: { name: string; avgRoas: number } | null = null
  Object.entries(groups).forEach(([name, roasValues]) => {
    const avgRoas = avg(roasValues)
    if (!best || avgRoas > best.avgRoas) {
      best = { name, avgRoas }
    }
  })
  return best
}

export function aggregateReportData(
  creatives: Creative[],
  accountId: string,
  accountName: string
): ReportData {
  const today = new Date().toISOString().slice(0, 10)
  const withSpend = creatives.filter(c => c.ad_account_id === accountId && c.spend > 0)

  const totalSpend = withSpend.reduce((s, c) => s + c.spend, 0)
  const avgROAS = avg(withSpend.map(c => c.roas))
  const avgCPA = avg(withSpend.map(c => c.cpa))
  const avgHookRate = avg(withSpend.map(c => c.hook_rate))
  const avgHoldRate = avg(withSpend.map(c => c.hold_rate))

  const sorted = [...withSpend].filter(c => c.spend >= 5).sort((a, b) => b.roas - a.roas)
  const topPerformers = sorted.slice(0, 5).map(c => ({ name: c.ad_name || 'Unnamed', roas: c.roas, spend: c.spend }))
  const bottomPerformers = sorted.slice(-5).reverse().map(c => ({ name: c.ad_name || 'Unnamed', roas: c.roas, spend: c.spend }))

  return {
    accountId,
    accountName,
    reportDate: today,
    totalSpend,
    avgROAS,
    avgCPA,
    avgHookRate,
    avgHoldRate,
    totalCreatives: withSpend.length,
    topPerformers,
    bottomPerformers,
    bestCategories: {
      assetType: findBestCategory(withSpend, 'asset_type'),
      hookTactic: findBestCategory(withSpend, 'hook_tactic'),
      visualFormat: findBestCategory(withSpend, 'visual_format'),
    },
  }
}

export async function generateAIInsights(reportData: ReportData, geminiApiKey: string): Promise<string> {
  const topList = reportData.topPerformers.map(a => `- ${a.name}: ROAS ${a.roas.toFixed(2)}, Spend $${a.spend.toFixed(2)}`).join('\n')
  const bottomList = reportData.bottomPerformers.map(a => `- ${a.name}: ROAS ${a.roas.toFixed(2)}, Spend $${a.spend.toFixed(2)}`).join('\n')

  const prompt = `You are a performance marketing analyst reviewing weekly Meta ad performance data.
Generate a 2-3 paragraph insight report with actionable recommendations.

Account: ${reportData.accountName}
Report Date: ${reportData.reportDate}

CURRENT PERFORMANCE:
- Total Spend: $${reportData.totalSpend.toFixed(2)}
- Average ROAS: ${reportData.avgROAS.toFixed(2)}
- Average CPA: $${reportData.avgCPA.toFixed(2)}
- Average Hook Rate: ${(reportData.avgHookRate * 100).toFixed(1)}%
- Average Hold Rate: ${(reportData.avgHoldRate * 100).toFixed(1)}%
- Total Creatives: ${reportData.totalCreatives}

BEST PERFORMING CATEGORIES:
- Asset Type: ${reportData.bestCategories.assetType?.name || 'N/A'} (ROAS: ${reportData.bestCategories.assetType?.avgRoas.toFixed(2) || 'N/A'})
- Hook Tactic: ${reportData.bestCategories.hookTactic?.name || 'N/A'} (ROAS: ${reportData.bestCategories.hookTactic?.avgRoas.toFixed(2) || 'N/A'})
- Visual Format: ${reportData.bestCategories.visualFormat?.name || 'N/A'} (ROAS: ${reportData.bestCategories.visualFormat?.avgRoas.toFixed(2) || 'N/A'})

TOP PERFORMERS:
${topList || 'No qualifying ads'}

BOTTOM PERFORMERS:
${bottomList || 'No qualifying ads'}

Provide insights on:
1. Overall performance assessment
2. What's working well and why
3. Specific recommendations to improve underperforming ads
4. Suggested tests or optimizations for next week`

  const MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash']

  try {
    for (const model of MODELS) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      )
      const data = await res.json()
      if (data.error?.code === 503) continue
      if (data.error) return 'AI insights unavailable — Gemini API error.'
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) return text
    }
    return 'AI insights unavailable — all models busy.'
  } catch {
    return 'AI insights unavailable — connection error.'
  }
}

export async function saveReport(
  userId: string,
  reportData: ReportData,
  aiInsights: string
) {
  const db = createServerClient()
  const { error } = await db.from('reports').upsert(
    {
      user_id: userId,
      ad_account_id: reportData.accountId,
      account_name: reportData.accountName,
      report_date: reportData.reportDate,
      total_spend: reportData.totalSpend,
      avg_roas: reportData.avgROAS,
      avg_cpa: reportData.avgCPA,
      avg_hook_rate: reportData.avgHookRate,
      avg_hold_rate: reportData.avgHoldRate,
      total_creatives: reportData.totalCreatives,
      top_performers: reportData.topPerformers,
      bottom_performers: reportData.bottomPerformers,
      best_categories: reportData.bestCategories,
      ai_insights: aiInsights,
    },
    { onConflict: 'user_id,ad_account_id,report_date' }
  )

  if (error) throw error
}
