'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { saveSettings, testMetaConnection, testGeminiConnection } from '@/app/actions'
import { createBillingPortalSession } from '@/app/actions/stripe'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SubmitButton from '@/components/ui/submit-button'
import type { UserSettings } from '@/lib/db/types'

type Subscription = {
  plan: string
  status: string
  current_period_end: string | null
} | null

export default function SettingsClient({ settings, subscription }: { settings: UserSettings | null; subscription: Subscription }) {
  const [testingMeta, setTestingMeta] = useState(false)
  const [testingGemini, setTestingGemini] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleManageBilling() {
    const result = await createBillingPortalSession()
    if (result?.error) {
      toast.error(result.error)
    }
  }

  async function handleTestMeta() {
    setTestingMeta(true)
    const input = document.getElementById('meta_access_token') as HTMLInputElement
    const result = await testMetaConnection(input?.value || undefined)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Connected to Meta! (${result.name})`)
    }
    setTestingMeta(false)
  }

  async function handleTestGemini() {
    setTestingGemini(true)
    const input = document.getElementById('gemini_api_key') as HTMLInputElement
    const result = await testGeminiConnection(input?.value || undefined)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Connected to Gemini!')
    }
    setTestingGemini(false)
  }

  return (
    <>
      {/* Header */}
      <div
        className="sticky top-0 z-40 shrink-0 flex items-center gap-4"
        style={{
          height: '56px',
          borderBottom: '1px solid var(--dash-border)',
          padding: '0 28px',
          background: 'var(--dash-bg)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--dash-text)',
            flex: 1,
          }}
        >
          Settings
        </h1>
      </div>

      <div className="flex-1 dashboard-scroll" style={{ padding: '28px', maxWidth: '640px' }}>
        {/* Subscription */}
        <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)] mb-6">
          <CardContent className="pt-6">
            <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '14px', fontWeight: 700, color: 'var(--dash-text)' }}>
              Subscription
            </h2>
            {subscription ? (
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--dash-text)] capitalize">{subscription.plan}</span>
                    <Badge className={subscription.status === 'active'
                      ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20 text-[10px]'
                      : 'bg-red-400/10 text-red-400 border-red-400/20 text-[10px]'
                    }>
                      {subscription.status}
                    </Badge>
                  </div>
                  {subscription.current_period_end && (
                    <p className="text-xs text-[var(--dash-text-muted)] mt-1">
                      Renews {new Date(subscription.current_period_end).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleManageBilling}
                  variant="outline"
                  className="border-[var(--dash-border)] text-[var(--dash-text-dim)] hover:bg-[var(--dash-bg3)] cursor-pointer text-xs"
                >
                  Manage Billing
                </Button>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <span className="text-sm text-[var(--dash-text-muted)]">No active plan</span>
                </div>
                <Button
                  onClick={() => window.location.href = '/pricing'}
                  variant="outline"
                  className="border-[var(--acid-dim)] text-[var(--acid)] hover:bg-[var(--acid)]/10 cursor-pointer text-xs"
                >
                  View Plans
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <form
          action={async (formData) => {
            startTransition(async () => {
              const result = await saveSettings(formData)
              if (result.error) {
                toast.error(result.error)
              } else {
                toast.success('Settings saved!')
              }
            })
          }}
          className="space-y-6"
        >
          {/* API Keys */}
          <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
            <CardContent className="pt-6 space-y-4">
              <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '14px', fontWeight: 700, color: 'var(--dash-text)' }}>
                API Connections
              </h2>

              {/* Meta Token */}
              <div className="space-y-2">
                <Label htmlFor="meta_access_token" className="text-[var(--dash-text-dim)] text-xs uppercase tracking-wider">
                  Meta Access Token
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="meta_access_token"
                    name="meta_access_token"
                    type="password"
                    placeholder={settings?.meta_access_token ? '••••••••••••••••' : 'Paste your Meta access token'}
                    className="bg-[var(--dash-bg)] border-[var(--dash-border)] text-[var(--dash-text)] placeholder:text-[var(--dash-text-muted)] flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleTestMeta}
                    disabled={testingMeta}
                    variant="outline"
                    className="border-[var(--dash-border)] text-[var(--dash-text-dim)] hover:bg-[var(--dash-bg3)] cursor-pointer shrink-0"
                  >
                    {testingMeta ? 'Testing...' : 'Test'}
                  </Button>
                </div>
                {settings?.meta_token_created_at && (
                  <p className="text-xs text-[var(--dash-text-muted)]">
                    Token set on {new Date(settings.meta_token_created_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Gemini Key */}
              <div className="space-y-2">
                <Label htmlFor="gemini_api_key" className="text-[var(--dash-text-dim)] text-xs uppercase tracking-wider">
                  Gemini API Key
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="gemini_api_key"
                    name="gemini_api_key"
                    type="password"
                    placeholder={settings?.gemini_api_key ? '••••••••••••••••' : 'Paste your Gemini API key'}
                    className="bg-[var(--dash-bg)] border-[var(--dash-border)] text-[var(--dash-text)] placeholder:text-[var(--dash-text-muted)] flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleTestGemini}
                    disabled={testingGemini}
                    variant="outline"
                    className="border-[var(--dash-border)] text-[var(--dash-text-dim)] hover:bg-[var(--dash-bg3)] cursor-pointer shrink-0"
                  >
                    {testingGemini ? 'Testing...' : 'Test'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thresholds */}
          <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
            <CardContent className="pt-6 space-y-4">
              <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '14px', fontWeight: 700, color: 'var(--dash-text)' }}>
                Performance Thresholds
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roas_winner_threshold" className="text-[var(--dash-text-dim)] text-xs uppercase tracking-wider">
                    Winner ROAS Threshold
                  </Label>
                  <Input
                    id="roas_winner_threshold"
                    name="roas_winner_threshold"
                    type="number"
                    step="0.1"
                    min="0"
                    defaultValue={settings?.roas_winner_threshold ?? 1.0}
                    className="bg-[var(--dash-bg)] border-[var(--dash-border)] text-[var(--dash-text)]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min_spend_threshold" className="text-[var(--dash-text-dim)] text-xs uppercase tracking-wider">
                    Min Spend ($) for Analysis
                  </Label>
                  <Input
                    id="min_spend_threshold"
                    name="min_spend_threshold"
                    type="number"
                    step="1"
                    min="0"
                    defaultValue={settings?.min_spend_threshold ?? 0}
                    className="bg-[var(--dash-bg)] border-[var(--dash-border)] text-[var(--dash-text)]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sync Config */}
          <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
            <CardContent className="pt-6 space-y-4">
              <h2 style={{ fontFamily: 'var(--font-syne), sans-serif', fontSize: '14px', fontWeight: 700, color: 'var(--dash-text)' }}>
                Sync Configuration
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sync_frequency" className="text-[var(--dash-text-dim)] text-xs uppercase tracking-wider">
                    Sync Frequency
                  </Label>
                  <select
                    id="sync_frequency"
                    name="sync_frequency"
                    defaultValue={settings?.sync_frequency ?? 'manual'}
                    className="w-full px-3 py-2 rounded-md text-sm bg-[var(--dash-bg)] border border-[var(--dash-border)] text-[var(--dash-text)] outline-none"
                  >
                    <option value="manual">Manual</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_range_days" className="text-[var(--dash-text-dim)] text-xs uppercase tracking-wider">
                    Date Range (days)
                  </Label>
                  <Input
                    id="date_range_days"
                    name="date_range_days"
                    type="number"
                    min="1"
                    max="365"
                    defaultValue={settings?.date_range_days ?? 30}
                    className="bg-[var(--dash-bg)] border-[var(--dash-border)] text-[var(--dash-text)]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save */}
          <SubmitButton
            label="Save Settings"
            pendingLabel="Saving..."
            className="bg-[var(--acid)] hover:bg-[var(--acid)] text-black font-semibold"
          />
        </form>
      </div>
    </>
  )
}
