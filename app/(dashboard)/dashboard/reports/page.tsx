import { getMyReports, getMyAdAccounts, getMyPlan } from '@/app/actions'
import { canUseFeature } from '@/lib/subscription'
import ReportsClient from './reports-client'
import UpgradeGate from '@/components/upgrade-gate'

export const metadata = { title: 'Reports — Creatiq' }

export default async function ReportsPage() {
  const plan = await getMyPlan()
  if (!canUseFeature(plan, 'reports')) {
    return <UpgradeGate feature="Reports" requiredPlan="Solo" />
  }

  const [reports, accounts] = await Promise.all([
    getMyReports(),
    getMyAdAccounts(),
  ])

  return <ReportsClient initialReports={reports} accounts={accounts} />
}
