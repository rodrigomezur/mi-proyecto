const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash']
const MAX_VIDEO_BYTES = 50 * 1024 * 1024 // 50MB

async function callGemini(apiKey: string, body: Record<string, unknown>): Promise<string> {
  let lastError = ''
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      )
      const data = await res.json()
      if (data.error) {
        lastError = data.error.message || 'Unknown error'
        if (data.error.code === 503 || data.error.status === 'UNAVAILABLE') continue
        throw new Error(lastError)
      }
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      if (text) return text
    } catch (e: unknown) {
      lastError = e instanceof Error ? e.message : 'Unknown error'
      continue
    }
  }
  throw new Error(`All Gemini models failed. Last error: ${lastError}`)
}

type AnalysisResult = {
  asset_type: string
  visual_format: string
  messaging_angle: string
  hook_tactic: string
  offer_type: string
  funnel_stage: string
  summary: string
}

type IterationResult = {
  strengths: string[]
  weaknesses: string[]
  iterations: Array<{
    title: string
    description: string
    focus_area: string
    expected_impact: string
    effort: string
  }>
}

type Benchmarks = {
  avgSpend: number
  avgROAS: number
  avgCPA: number
  avgHookRate: number
  avgHoldRate: number
  avgCTR: number
}

const ANALYSIS_PROMPT = `Analyze this DTC ad creative. Return a JSON object with these 7 fields:

{
  "asset_type": "Choose ONE from: UGC, High Production, Static Image, Animation, Screen Recording, Stock Footage",
  "visual_format": "Choose ONE: Talking Head, Product Demo, Unboxing, Before/After, Split Screen, Text Overlay, Lifestyle, Testimonial Compilation, Tutorial, Behind the Scenes, Product on White, User Review, Skit, ASMR, Green Screen",
  "messaging_angle": "Choose ONE: Problem/Solution, Social Proof, FOMO, Aspiration, Value Proposition, Fear/Pain Point, Curiosity, Authority/Expert, Comparison, Transformation, Humor, Urgency, Exclusivity, Community",
  "hook_tactic": "Choose ONE: Pattern Interrupt, Question, Bold Claim, Curiosity Gap, Controversy, Relatable Scenario, Shocking Stat, Direct Address, Visual Surprise, Sound Effect, Text Hook, Celebrity/Influencer, Unboxing Reveal",
  "offer_type": "Choose ONE: Percentage Off, Dollar Amount Off, Free Shipping, BOGO, Free Trial, Free Gift, Bundle Deal, Subscribe & Save, Limited Time, No Offer",
  "funnel_stage": "Choose ONE: TOF (Top of Funnel - awareness, cold audiences), MOF (Middle of Funnel - consideration, warm audiences), BOF (Bottom of Funnel - conversion, hot audiences)",
  "summary": "Write 2-3 sentences describing what this ad is about and what makes it compelling."
}

Return ONLY valid JSON with these 7 keys, no other text.`

function buildAdContext(adCopy: string, headline: string, cta: string): string {
  return `\n\nAdditional context:\n- Ad copy: ${adCopy || 'Not available'}\n- Headline: ${headline || 'Not available'}\n- CTA: ${cta || 'Not available'}`
}

function parseJsonResponse(text: string): Record<string, unknown> {
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned)
}

// ── Analyze Image ───────────────────────────────────────────

export async function analyzeImageWithGemini(
  imageUrl: string,
  apiKey: string,
  adCopy = '',
  headline = '',
  cta = ''
): Promise<AnalysisResult> {
  const imageResponse = await fetch(imageUrl)
  if (!imageResponse.ok) throw new Error('Failed to download image')

  const imageBuffer = await imageResponse.arrayBuffer()
  const base64Image = Buffer.from(imageBuffer).toString('base64')
  const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg'

  const prompt = ANALYSIS_PROMPT + buildAdContext(adCopy, headline, cta)

  const text = await callGemini(apiKey, {
    contents: [{
      parts: [
        { inline_data: { mime_type: mimeType, data: base64Image } },
        { text: prompt },
      ],
    }],
  })

  return parseJsonResponse(text) as unknown as AnalysisResult
}

// ── Analyze Video ───────────────────────────────────────────

export async function analyzeVideoWithGemini(
  videoSourceUrl: string,
  apiKey: string,
  adCopy = '',
  headline = '',
  cta = ''
): Promise<AnalysisResult> {
  // Download video
  const videoResponse = await fetch(videoSourceUrl)
  if (!videoResponse.ok) throw new Error('Failed to download video')

  const contentLength = videoResponse.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > MAX_VIDEO_BYTES) {
    throw new Error('VIDEO_TOO_LARGE')
  }

  const videoBuffer = Buffer.from(await videoResponse.arrayBuffer())
  if (videoBuffer.length > MAX_VIDEO_BYTES) {
    throw new Error('VIDEO_TOO_LARGE')
  }

  // Upload to Gemini File API
  const uploadRes = await fetch(
    `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'X-Goog-Upload-Protocol': 'raw',
        'X-Goog-Upload-Header-Content-Type': 'video/mp4',
        'Content-Type': 'video/mp4',
      },
      body: videoBuffer,
    }
  )

  if (!uploadRes.ok) throw new Error(`Video upload failed: ${await uploadRes.text()}`)

  const uploadData = await uploadRes.json()
  const fileUri = uploadData.file?.uri
  if (!fileUri) throw new Error('No file URI from upload')

  // Wait for processing
  await new Promise(resolve => setTimeout(resolve, 5000))

  const prompt = ANALYSIS_PROMPT + buildAdContext(adCopy, headline, cta)

  const text = await callGemini(apiKey, {
    contents: [{
      parts: [
        { file_data: { mime_type: 'video/mp4', file_uri: fileUri } },
        { text: prompt },
      ],
    }],
  })

  return parseJsonResponse(text) as unknown as AnalysisResult
}

// ── Get Video Source URL ────────────────────────────────────

export async function getVideoSourceUrl(videoId: string, accessToken: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${videoId}?fields=source&access_token=${accessToken}`
    )
    const data = await res.json()
    return data.source || null
  } catch {
    return null
  }
}

// ── Generate Iteration Recommendations ──────────────────────

export async function generateIterationRecommendations(
  creative: {
    spend: number; roas: number; cpa: number; hook_rate: number; hold_rate: number; ctr: number
    ad_headline: string | null; ad_description: string | null; ad_cta: string | null
    asset_type: string | null; visual_format: string | null; messaging_angle: string | null
    hook_tactic: string | null; offer_type: string | null; ai_summary: string | null
  },
  benchmarks: Benchmarks,
  apiKey: string
): Promise<IterationResult | null> {
  const prompt = `You are a senior performance creative strategist analyzing a Meta ad. Based on the performance data and creative analysis below, provide actionable iteration recommendations.

PERFORMANCE DATA:
- Spend: $${(creative.spend || 0).toFixed(2)}
- ROAS: ${(creative.roas || 0).toFixed(2)} (Avg: ${(benchmarks.avgROAS || 0).toFixed(2)})
- CPA: $${(creative.cpa || 0).toFixed(2)} (Avg: $${(benchmarks.avgCPA || 0).toFixed(2)})
- Hook Rate: ${((creative.hook_rate || 0) * 100).toFixed(1)}% (Avg: ${((benchmarks.avgHookRate || 0) * 100).toFixed(1)}%)
- Hold Rate: ${((creative.hold_rate || 0) * 100).toFixed(1)}% (Avg: ${((benchmarks.avgHoldRate || 0) * 100).toFixed(1)}%)
- CTR: ${(creative.ctr || 0).toFixed(2)}% (Avg: ${(benchmarks.avgCTR || 0).toFixed(2)}%)

CREATIVE ANALYSIS:
- Asset Type: ${creative.asset_type || 'Unknown'}
- Visual Format: ${creative.visual_format || 'Unknown'}
- Messaging: ${creative.messaging_angle || 'Unknown'}
- Hook: ${creative.hook_tactic || 'Unknown'}
- Offer: ${creative.offer_type || 'Unknown'}
- Summary: ${creative.ai_summary || 'N/A'}

AD COPY:
- Headline: ${creative.ad_headline || 'N/A'}
- Description: ${(creative.ad_description || '').substring(0, 500) || 'N/A'}
- CTA: ${creative.ad_cta || 'N/A'}

Return a JSON object:
{
  "strengths": ["2-3 specific things working well"],
  "weaknesses": ["2-3 areas needing improvement"],
  "iterations": [
    {
      "title": "Short title (5-7 words)",
      "description": "Specific actionable description referencing performance data",
      "focus_area": "One of: Hook, First 3 Seconds, Social Proof, CTA, Offer, Visual Format, Messaging Angle, Audio/Music, Pacing, Product Demo",
      "expected_impact": "High, Medium, or Low",
      "effort": "Low, Medium, or High"
    }
  ]
}

Provide 3-5 iterations. Return ONLY valid JSON.`

  try {
    const text = await callGemini(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
    })
    return parseJsonResponse(text) as unknown as IterationResult
  } catch {
    return null
  }
}

// ── Iteration Priority ──────────────────────────────────────

export function calculateIterationPriority(
  creative: { spend: number; roas: number; hook_rate: number; hold_rate: number },
  benchmarks: Benchmarks
): number {
  const spend = creative.spend || 0
  const avgSpend = benchmarks.avgSpend || 1

  const spendOpportunity = Math.min(spend / (avgSpend * 3), 1)

  const roasGap = benchmarks.avgROAS > 0
    ? ((creative.roas || 0) - benchmarks.avgROAS) / benchmarks.avgROAS : 0
  const hookGap = benchmarks.avgHookRate > 0
    ? ((creative.hook_rate || 0) - benchmarks.avgHookRate) / benchmarks.avgHookRate : 0
  const holdGap = benchmarks.avgHoldRate > 0
    ? ((creative.hold_rate || 0) - benchmarks.avgHoldRate) / benchmarks.avgHoldRate : 0

  const avgGap = (roasGap + hookGap + holdGap) / 3
  const performanceNeed = Math.max(0, Math.min(1, 0.5 - avgGap))

  return Math.round((spendOpportunity * 40 + performanceNeed * 60) * 100) / 100
}
