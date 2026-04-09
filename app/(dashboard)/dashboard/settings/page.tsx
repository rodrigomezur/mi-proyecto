import { getMySettings } from '@/app/actions'
import SettingsClient from './settings-client'

export const metadata = { title: 'Settings — Creatiq' }

export default async function SettingsPage() {
  const settings = await getMySettings()
  return <SettingsClient settings={settings} />
}
