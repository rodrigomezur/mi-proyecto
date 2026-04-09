import { getMyReports, getMyAdAccounts } from '@/app/actions'
import ReportsClient from './reports-client'

export const metadata = { title: 'Reports — Creatiq' }

export default async function ReportsPage() {
  const [reports, accounts] = await Promise.all([
    getMyReports(),
    getMyAdAccounts(),
  ])

  return <ReportsClient initialReports={reports} accounts={accounts} />
}
