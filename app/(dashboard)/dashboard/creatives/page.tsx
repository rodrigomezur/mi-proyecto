import { getMyCreatives, getMyAdAccounts, getMyPlan } from '@/app/actions'
import { canUseFeature } from '@/lib/subscription'
import CreativesClient from './creatives-client'
import UpgradeGate from '@/components/upgrade-gate'

export const metadata = { title: 'Creatives — Creatiq' }

export default async function CreativesPage() {
  const plan = await getMyPlan()
  if (!canUseFeature(plan, 'creatives')) {
    return <UpgradeGate feature="Creatives" requiredPlan="Solo" />
  }

  const [creatives, accounts] = await Promise.all([
    getMyCreatives(),
    getMyAdAccounts(),
  ])

  return <CreativesClient initialCreatives={creatives} accounts={accounts} />
}
