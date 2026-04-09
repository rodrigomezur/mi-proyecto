import Link from 'next/link'

const plans = [
  {
    name: 'SOLO',
    price: 39,
    popular: false,
    features: [
      '2 Meta ad accounts',
      'AI creative analysis (Gemini)',
      'Scale / Watch / Kill signals',
      'Weekly performance reports',
      'Manual sync',
    ],
    cta: 'Start Free Trial',
    ctaHref: '/register',
    ctaClass: 'btn text-slate-900 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] w-full font-semibold',
  },
  {
    name: 'PRO',
    price: 79,
    popular: true,
    features: [
      '10 Meta ad accounts',
      'Everything in Solo',
      'Daily auto-sync',
      'AI-powered weekly reports',
      'Win rate breakdowns by category',
    ],
    cta: 'Start Free Trial',
    ctaHref: '/register',
    ctaClass: 'btn text-slate-900 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] w-full font-semibold',
  },
  {
    name: 'AGENCY',
    price: 149,
    popular: false,
    features: [
      'Unlimited Meta ad accounts',
      'Everything in Pro',
      '5 team members included',
      'Cross-account benchmarks',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    ctaHref: '/register',
    ctaClass: 'btn text-[var(--color-text-primary)] bg-slate-700 hover:bg-slate-600 border-slate-600 w-full',
  },
]

export default function Pricing() {
  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-10 pb-12 md:pb-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h2 className="h2 font-hkgrotesk mb-4">Simple, transparent pricing.</h2>
            <p className="text-xl text-[var(--color-text-muted)]">
              Start with a 14-day free trial. No credit card required.
            </p>
          </div>
          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative flex flex-col bg-slate-800 rounded-xl p-6 md:p-8 border ${plan.popular ? 'border-[var(--color-accent)] shadow-lg shadow-[var(--color-accent)]/5' : 'border-slate-700'}`}
                data-aos="fade-up"
                data-aos-delay={`${i * 100}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[var(--color-accent)] text-slate-900 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <div className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-widest text-[var(--color-accent)] mb-2">{plan.name}</div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-[var(--color-text-primary)]">${plan.price}</span>
                    <span className="text-[var(--color-text-muted)] mb-1">/mo</span>
                  </div>
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
                <Link className={plan.ctaClass} href={plan.ctaHref}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
