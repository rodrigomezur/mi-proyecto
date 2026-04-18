import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/db/supabase'
import { syncAdsForAccount } from '@/lib/meta/sync'

export const maxDuration = 300 // 5 min

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createServerClient()
  const today = new Date().getDay() // 0 = Sunday

  // Get all users with active subscriptions and Meta token
  const { data: users } = await db
    .from('user_settings')
    .select('user_id, meta_access_token, gemini_api_key, sync_frequency, date_range_days')
    .not('meta_access_token', 'is', null)
    .in('sync_frequency', ['daily', 'weekly'])

  if (!users || users.length === 0) {
    return NextResponse.json({ processed: 0, message: 'No users to sync' })
  }

  let totalAccountsSynced = 0

  for (const user of users) {
    // Weekly users only sync on Mondays
    if (user.sync_frequency === 'weekly' && today !== 1) continue

    // Check subscription is active
    const { data: sub } = await db
      .from('subscriptions')
      .select('plan, status, current_period_end')
      .eq('user_id', user.user_id)
      .single()

    if (!sub || sub.status !== 'active') continue
    if (sub.current_period_end && new Date(sub.current_period_end) < new Date()) continue

    // Only Pro and Agency have auto-sync
    if (sub.plan !== 'pro' && sub.plan !== 'agency') continue

    // Get active accounts
    const { data: accounts } = await db
      .from('ad_accounts')
      .select('ad_account_id')
      .eq('user_id', user.user_id)
      .eq('active', true)

    if (!accounts) continue

    for (const account of accounts) {
      const { data: job } = await db.from('sync_jobs').insert({
        user_id: user.user_id,
        ad_account_id: account.ad_account_id,
        status: 'pending',
      }).select('id').single()

      try {
        await syncAdsForAccount(
          user.user_id,
          account.ad_account_id,
          user.meta_access_token,
          user.date_range_days ?? 30,
          user.gemini_api_key,
          job?.id,
        )
        totalAccountsSynced++
      } catch (err: unknown) {
        if (job?.id) {
          await db.from('sync_jobs').update({
            status: 'error',
            error_message: err instanceof Error ? err.message : 'Sync failed',
            completed_at: new Date().toISOString(),
          }).eq('id', job.id)
        }
      }
    }
  }

  return NextResponse.json({ success: true, accountsSynced: totalAccountsSynced })
}
