import { getMyAdAccounts, getMyPlan } from '@/app/actions'
import { canUseFeature } from '@/lib/subscription'
import AccountsClient from './accounts-client'
import UpgradeGate from '@/components/upgrade-gate'

export const metadata = { title: 'Accounts — Creatiq' }

export default async function AccountsPage() {
  const plan = await getMyPlan()
  if (!canUseFeature(plan, 'accounts')) {
    return <UpgradeGate feature="Ad Accounts" requiredPlan="Solo" />
  }

  const accounts = await getMyAdAccounts()
  return <AccountsClient initialAccounts={accounts} />
}
