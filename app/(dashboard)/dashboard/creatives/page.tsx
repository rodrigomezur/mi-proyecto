import { getMyCreatives, getMyAdAccounts } from '@/app/actions'
import CreativesClient from './creatives-client'

export const metadata = { title: 'Creatives — Creatiq' }

export default async function CreativesPage() {
  const [creatives, accounts] = await Promise.all([
    getMyCreatives(),
    getMyAdAccounts(),
  ])

  return <CreativesClient initialCreatives={creatives} accounts={accounts} />
}
