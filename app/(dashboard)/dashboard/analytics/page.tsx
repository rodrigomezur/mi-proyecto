import { getMyAnalytics } from '@/app/actions'
import AnalyticsClient from './analytics-client'

export const metadata = { title: 'Analytics — Creatiq' }

export default async function AnalyticsPage() {
  const analytics = await getMyAnalytics()
  return <AnalyticsClient analytics={analytics} />
}
