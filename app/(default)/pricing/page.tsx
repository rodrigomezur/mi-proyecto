'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createCheckoutSession } from '@/app/actions/stripe'
import { PLANS, type PlanKey } from '@/lib/stripe/config'
import { Button } from '@/components/ui/button'

const planKeys: PlanKey[] = ['solo', 'pro', 'agency']

export default function PricingPage() {
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSubscribe(plan: PlanKey) {
    setLoading(plan)
    try {
      await createCheckoutSession(plan, interval)
    } catch {
      setLoading(null)
    }
  }

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-28 pb-12 md:pb-20">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center pb-12">
            <h1 className="h2 font-hkgrotesk mb-4">Simple, transparent pricing.</h1>
            <p className="text-xl text-[var(--color-text-muted)] mb-8">
              Start with a 14-day free trial. No credit card required.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center bg-slate-800 rounded-full p-1">
              <button
                onClick={() => setInterval('monthly')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  interval === 'monthly'
                    ? 'bg-[var(--color-accent)] text-slate-900'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setInterval('yearly')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  interval === 'yearly'
                    ? 'bg-[var(--color-accent)] text-slate-900'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                Yearly
                <span className="ml-1.5 text-xs font-bold text-emerald-400">Save 25%</span>
              </button>
            </div>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {planKeys.map((key) => {
              const plan = PLANS[key]
              const popular = 'popular' in plan && plan.popular
              const price = plan.prices[interval]

              return (
                <div
                  key={key}
                  className={`relative flex flex-col bg-slate-800 rounded-xl p-6 md:p-8 border transition-all duration-200 hover:shadow-lg hover:shadow-black/20 ${
                    popular
                      ? 'border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/5'
                      : 'border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-[var(--color-accent)] text-slate-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-widest text-[var(--color-accent)] mb-2">
                      {plan.name.replace('Creatiq ', '')}
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-bold text-[var(--color-text-primary)]">
                        ${price.amount}
                      </span>
                      <span className="text-[var(--color-text-muted)] mb-1">/mo</span>
                    </div>
                    {interval === 'yearly' && (
                      <p className="text-xs text-emerald-400 mt-1">
                        Billed ${price.amount * 12}/year
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                        <svg className="w-4 h-4 shrink-0 mt-0.5 fill-[var(--color-accent)]" viewBox="0 0 12 9" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" fillRule="nonzero" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSubscribe(key)}
                    disabled={loading !== null}
                    className={`w-full font-semibold cursor-pointer ${
                      popular
                        ? 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-slate-900'
                        : 'bg-slate-700 hover:bg-slate-600 text-[var(--color-text-primary)]'
                    }`}
                  >
                    {loading === key ? 'Redirecting...' : 'Start Free Trial'}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
