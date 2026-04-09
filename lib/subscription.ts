import { createServerClient } from '@/lib/db/supabase'

export type Plan = 'free' | 'solo' | 'pro' | 'agency'

type Subscription = {
  plan: string
  status: string
  current_period_end: string | null
}

const PLAN_HIERARCHY: Record<string, number> = {
  free: 0,
  solo: 1,
  pro: 2,
  agency: 3,
}

const ACCOUNT_LIMITS: Record<string, number> = {
  free: 0,
  solo: 2,
  pro: 10,
  agency: Infinity,
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
  const db = createServerClient()
  const { data } = await db
    .from('subscriptions')
    .select('plan, status, current_period_end')
    .eq('user_id', userId)
    .single()

  return data
}

export function getPlan(subscription: Subscription | null): Plan {
  if (!subscription) return 'free'
  if (subscription.status !== 'active') return 'free'
  if (subscription.current_period_end && new Date(subscription.current_period_end) < new Date()) return 'free'
  return (subscription.plan as Plan) || 'free'
}

export function hasAccess(plan: Plan, requiredPlan: Plan): boolean {
  return PLAN_HIERARCHY[plan] >= PLAN_HIERARCHY[requiredPlan]
}

export function getAccountLimit(plan: Plan): number {
  return ACCOUNT_LIMITS[plan] ?? 0
}

export function canUseFeature(plan: Plan, feature: string): boolean {
  switch (feature) {
    case 'accounts':
    case 'sync':
    case 'creatives':
    case 'analytics':
    case 'reports':
    case 'ai_analysis':
      return hasAccess(plan, 'solo')
    case 'daily_sync':
    case 'ai_reports':
    case 'win_rate_breakdowns':
      return hasAccess(plan, 'pro')
    case 'unlimited_accounts':
    case 'team_members':
    case 'cross_account_benchmarks':
      return hasAccess(plan, 'agency')
    default:
      return true
  }
}

export function isExpired(subscription: Subscription | null): boolean {
  if (!subscription) return false
  if (subscription.status !== 'active') return false
  if (!subscription.current_period_end) return false
  return new Date(subscription.current_period_end) < new Date()
}
