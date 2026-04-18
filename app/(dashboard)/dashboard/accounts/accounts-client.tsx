'use client'

import { useState, useTransition, useEffect } from 'react'
import { toast } from 'sonner'
import { addAdAccount, removeAdAccount, toggleAccount, syncAccount, syncAllAccounts, listAvailableMetaAccounts } from '@/app/actions'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SubmitButton from '@/components/ui/submit-button'
import type { UserAdAccount } from '@/lib/db/types'

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export default function AccountsClient({ initialAccounts }: { initialAccounts: UserAdAccount[] }) {
  const [showForm, setShowForm] = useState(false)
  const [syncingId, setSyncingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [availableAccounts, setAvailableAccounts] = useState<Array<{ id: string; name: string }>>([])
  const [loadingAvailable, setLoadingAvailable] = useState(false)

  async function handleLoadAvailable() {
    setLoadingAvailable(true)
    const result = await listAvailableMetaAccounts()
    if (result.error) {
      toast.error(result.error)
    } else if (result.accounts) {
      setAvailableAccounts(result.accounts)
    }
    setLoadingAvailable(false)
  }

  // Load available accounts when form opens
  useEffect(() => {
    if (showForm && availableAccounts.length === 0) {
      handleLoadAvailable()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm])

  function handleDelete(accountId: string) {
    if (!confirm('Delete this account and all its data?')) return
    startTransition(async () => {
      const result = await removeAdAccount(accountId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Account removed.')
      }
    })
  }

  async function handleSync(accountId: string) {
    setSyncingId(accountId)
    const result = await syncAccount(accountId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Synced ${result.synced}/${result.totalAds} ads.`)
    }
    setSyncingId(null)
  }

  async function handleSyncAll() {
    setSyncingId('all')
    const result = await syncAllAccounts()
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Synced ${result.synced}/${result.totalAds} ads across all accounts.`)
    }
    setSyncingId(null)
  }

  function handleToggle(accountId: string, currentActive: boolean) {
    startTransition(async () => {
      const result = await toggleAccount(accountId, !currentActive)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(currentActive ? 'Account paused.' : 'Account activated.')
      }
    })
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
          Ad Accounts
        </h1>
        <div className="flex items-center gap-2">
          {initialAccounts.length > 0 && (
            <Button
              variant="outline"
              onClick={handleSyncAll}
              disabled={syncingId !== null}
              className="border-[var(--dash-border)] text-[var(--dash-text-dim)] hover:bg-[var(--dash-bg3)] text-xs cursor-pointer"
            >
              {syncingId === 'all' ? 'Syncing...' : 'Sync All'}
            </Button>
          )}
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[var(--acid)] hover:bg-[var(--acid)] text-black font-semibold text-xs cursor-pointer"
          >
            {showForm ? 'Cancel' : '+ Add Account'}
          </Button>
        </div>
      </div>

      <div className="flex-1 dashboard-scroll" style={{ padding: '28px' }}>
        {/* Add account form */}
        {showForm && (
          <Card className="bg-[var(--dash-bg2)] border-[var(--dash-border)] mb-6">
            <CardContent className="pt-6">
              <form
                action={async (formData) => {
                  startTransition(async () => {
                    const result = await addAdAccount(formData)
                    if (result.error) {
                      toast.error(result.error)
                    } else if (result.autoSyncStarted) {
                      toast.success('Account connected! Initial sync started in background (90-day baseline).')
                      setShowForm(false)
                    } else {
                      toast.success('Account connected! Configure your Meta token in Settings to sync.')
                      setShowForm(false)
                    }
                  })
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ad_account_id" className="text-[var(--dash-text-dim)] text-xs uppercase tracking-wider">
                      Account ID
                    </Label>
                    {loadingAvailable ? (
                      <div className="text-xs text-[var(--dash-text-muted)] py-2">Loading your Meta accounts...</div>
                    ) : availableAccounts.length > 0 ? (
                      <select
                        id="ad_account_id"
                        name="ad_account_id"
                        required
                        onChange={(e) => {
                          const selected = availableAccounts.find(a => a.id === e.target.value)
                          const nameInput = document.getElementById('account_name') as HTMLInputElement
                          if (selected && nameInput && !nameInput.value) nameInput.value = selected.name
                        }}
                        className="w-full px-3 py-2 rounded-md text-sm bg-[var(--dash-bg)] border border-[var(--dash-border)] text-[var(--dash-text)] outline-none"
                      >
                        <option value="">Select an account...</option>
                        {availableAccounts.map(a => (
                          <option key={a.id} value={a.id}>{a.name} ({a.id})</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id="ad_account_id"
                        name="ad_account_id"
                        type="text"
                        required
                        placeholder="act_123456789"
                        className="bg-[var(--dash-bg)] border-[var(--dash-border)] text-[var(--dash-text)] placeholder:text-[var(--dash-text-muted)]"
                      />
                    )}
                    <p className="text-xs text-[var(--dash-text-muted)]">
                      {availableAccounts.length > 0
                        ? `${availableAccounts.length} accounts detected from your Meta token`
                        : 'Found in Ads Manager URL: act_XXXXXXXXXX'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account_name" className="text-[var(--dash-text-dim)] text-xs uppercase tracking-wider">
                      Account Name
                    </Label>
                    <Input
                      id="account_name"
                      name="account_name"
                      type="text"
                      required
                      maxLength={100}
                      placeholder="My Client - Brand"
                      className="bg-[var(--dash-bg)] border-[var(--dash-border)] text-[var(--dash-text)] placeholder:text-[var(--dash-text-muted)]"
                    />
                  </div>
                </div>
                <SubmitButton
                  label="Connect Account"
                  pendingLabel="Connecting..."
                  className="bg-[var(--acid)] hover:bg-[var(--acid)] text-black font-semibold text-xs"
                />
              </form>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {initialAccounts.length === 0 && !showForm ? (
          <div className="text-center" style={{ padding: '80px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>&#9788;</div>
            <h2
              style={{
                fontFamily: 'var(--font-syne), sans-serif',
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--dash-text)',
                marginBottom: '8px',
              }}
            >
              No accounts connected
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--dash-text-muted)', marginBottom: '20px' }}>
              Connect your Meta ad accounts to start analyzing creatives.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[var(--acid)] hover:bg-[var(--acid)] text-black font-semibold cursor-pointer"
            >
              + Add Account
            </Button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {initialAccounts.map((account) => (
              <Card key={account.id} className="bg-[var(--dash-bg2)] border-[var(--dash-border)]">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: account.active
                          ? 'linear-gradient(135deg, var(--dash-bg3), var(--dash-bg4))'
                          : 'var(--dash-bg3)',
                        border: `1px solid ${account.active ? 'var(--acid-dim)' : 'var(--dash-border)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-dm-mono), monospace',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: account.active ? 'var(--acid)' : 'var(--dash-text-muted)',
                        flexShrink: 0,
                      }}
                    >
                      META
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--dash-text)' }}>
                          {account.account_name}
                        </span>
                        {account.active ? (
                          <Badge className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20 text-[10px]">Active</Badge>
                        ) : (
                          <Badge variant="outline" className="border-[var(--dash-border)] text-[var(--dash-text-muted)] text-[10px]">Paused</Badge>
                        )}
                      </div>
                      <div style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: '11px', color: 'var(--dash-text-muted)', marginTop: '2px' }}>
                        {account.ad_account_id}
                      </div>
                      {account.last_synced && (
                        <div style={{ fontSize: '11px', color: 'var(--dash-text-muted)', marginTop: '2px' }}>
                          Last synced: {formatDate(account.last_synced)}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(account.id)}
                        disabled={syncingId !== null || !account.active}
                        className="border-[var(--acid-dim)] text-[var(--acid)] hover:bg-[var(--acid)]/10 text-xs cursor-pointer"
                      >
                        {syncingId === account.id ? 'Syncing...' : 'Sync'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggle(account.id, account.active)}
                        disabled={isPending}
                        className="border-[var(--dash-border)] text-[var(--dash-text-muted)] hover:bg-[var(--dash-bg3)] text-xs cursor-pointer"
                      >
                        {account.active ? 'Pause' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(account.id)}
                        disabled={isPending}
                        className="border-[var(--dash-border)] text-red-400 hover:bg-red-400/10 hover:border-red-400/30 text-xs cursor-pointer"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
