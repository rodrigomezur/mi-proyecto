export const PLANS = {
  solo: {
    name: 'Creatiq Solo',
    description: '2 Meta ad accounts, AI creative analysis, Scale/Watch/Kill signals, weekly reports, manual sync',
    features: [
      '2 Meta ad accounts',
      'AI creative analysis (Gemini)',
      'Scale / Watch / Kill signals',
      'Weekly performance reports',
      'Manual sync',
    ],
    prices: {
      monthly: {
        amount: 39,
        priceId: process.env.STRIPE_PRICE_SOLO_MONTHLY || '',
      },
      yearly: {
        amount: 29,
        priceId: process.env.STRIPE_PRICE_SOLO_YEARLY || '',
      },
    },
  },
  pro: {
    name: 'Creatiq Pro',
    popular: true,
    description: '10 Meta ad accounts, everything in Solo, daily auto-sync, AI-powered weekly reports, win rate breakdowns',
    features: [
      '10 Meta ad accounts',
      'Everything in Solo',
      'Daily auto-sync',
      'AI-powered weekly reports',
      'Win rate breakdowns by category',
    ],
    prices: {
      monthly: {
        amount: 79,
        priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
      },
      yearly: {
        amount: 59,
        priceId: process.env.STRIPE_PRICE_PRO_YEARLY || '',
      },
    },
  },
  agency: {
    name: 'Creatiq Agency',
    description: 'Unlimited Meta ad accounts, everything in Pro, 5 team members, cross-account benchmarks, priority support',
    features: [
      'Unlimited Meta ad accounts',
      'Everything in Pro',
      '5 team members included',
      'Cross-account benchmarks',
      'Priority support',
    ],
    prices: {
      monthly: {
        amount: 149,
        priceId: process.env.STRIPE_PRICE_AGENCY_MONTHLY || '',
      },
      yearly: {
        amount: 119,
        priceId: process.env.STRIPE_PRICE_AGENCY_YEARLY || '',
      },
    },
  },
} as const

export type PlanKey = keyof typeof PLANS
export type BillingInterval = 'monthly' | 'yearly'
