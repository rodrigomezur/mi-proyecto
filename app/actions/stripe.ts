'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/client'
import { PLANS, type PlanKey, type BillingInterval } from '@/lib/stripe/config'
import { createServerClient as createAdminClient } from '@/lib/db/supabase'

export async function createCheckoutSession(plan: PlanKey, interval: BillingInterval) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const planConfig = PLANS[plan]
  if (!planConfig) {
    throw new Error('Invalid plan')
  }

  const priceId = planConfig.prices[interval].priceId
  if (!priceId) {
    throw new Error('Price not configured')
  }

  // Check if user already has a Stripe customer ID
  const admin = createAdminClient()
  const { data: subscription } = await admin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  const sessionParams: Record<string, unknown> = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/pricing/cancel`,
    metadata: {
      user_id: user.id,
      plan,
    },
  }

  if (subscription?.stripe_customer_id) {
    sessionParams.customer = subscription.stripe_customer_id
  } else {
    sessionParams.customer_email = user.email
  }

  const session = await stripe.checkout.sessions.create(sessionParams as Parameters<typeof stripe.checkout.sessions.create>[0])

  if (session.url) {
    redirect(session.url)
  }
}

export async function getMySubscription() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const admin = createAdminClient()
  const { data } = await admin
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return data
}

export async function createBillingPortalSession() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const admin = createAdminClient()
  const { data: subscription } = await admin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  if (!subscription?.stripe_customer_id) {
    return { error: 'No active subscription found.' }
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/settings`,
  })

  if (session.url) {
    redirect(session.url)
  }
}
