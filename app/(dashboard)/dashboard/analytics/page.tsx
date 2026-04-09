import { getMyAnalytics, getMyPlan } from '@/app/actions'
import { canUseFeature } from '@/lib/subscription'
import AnalyticsClient from './analytics-client'
import UpgradeGate from '@/components/upgrade-gate'

export const metadata = { title: 'Analytics — Creatiq' }

export default async function AnalyticsPage() {
  const plan = await getMyPlan()
  if (!canUseFeature(plan, 'analytics')) {
    return <UpgradeGate feature="Analytics" requiredPlan="Solo" />
  }

  const analytics = await getMyAnalytics()
  return <AnalyticsClient analytics={analytics} />
}
