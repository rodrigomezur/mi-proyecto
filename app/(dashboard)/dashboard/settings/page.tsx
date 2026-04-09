import { getMySettings } from '@/app/actions'
import { getMySubscription } from '@/app/actions/stripe'
import SettingsClient from './settings-client'

export const metadata = { title: 'Settings — Creatiq' }

export default async function SettingsPage() {
  const [settings, subscription] = await Promise.all([
    getMySettings(),
    getMySubscription(),
  ])

  return <SettingsClient settings={settings} subscription={subscription} />
}
