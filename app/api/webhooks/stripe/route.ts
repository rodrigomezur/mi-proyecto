import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createServerClient } from '@/lib/db/supabase'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = Record<string, any>

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const db = createServerClient()
  const obj = event.data.object as AnyObject

  switch (event.type) {
    case 'checkout.session.completed': {
      const userId = obj.metadata?.user_id
      const plan = obj.metadata?.plan || 'pro'

      if (userId && obj.subscription) {
        const sub = await stripe.subscriptions.retrieve(obj.subscription as string) as unknown as AnyObject

        await db.from('subscriptions').upsert({
          user_id: userId,
          stripe_customer_id: obj.customer as string,
          stripe_subscription_id: sub.id,
          plan,
          status: 'active',
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
      }
      break
    }

    case 'invoice.payment_succeeded': {
      if (obj.subscription) {
        const sub = await stripe.subscriptions.retrieve(obj.subscription as string) as unknown as AnyObject

        await db.from('subscriptions')
          .update({
            status: 'active',
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', sub.id)
      }
      break
    }

    case 'customer.subscription.deleted': {
      await db.from('subscriptions')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', obj.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
