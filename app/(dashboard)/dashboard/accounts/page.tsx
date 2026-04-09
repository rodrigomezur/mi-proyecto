import { getMyAdAccounts } from '@/app/actions'
import AccountsClient from './accounts-client'

export const metadata = { title: 'Accounts — Creatiq' }

export default async function AccountsPage() {
  const accounts = await getMyAdAccounts()
  return <AccountsClient initialAccounts={accounts} />
}
