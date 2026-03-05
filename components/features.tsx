import Image from 'next/image'
import Illustration from '@/public/images/features-illustration.svg'

const steps = [
  {
    icon: (
      <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.06a4.5 4.5 0 00-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" />
      </svg>
    ),
    title: 'Connect Your Meta Accounts',
    body: 'Link one account or thirty. Creatiq syncs all active ads, creatives, spend, and performance data automatically.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    title: 'AI Reads Every Creative',
    body: 'Each ad is classified by hook tactic, message angle, funnel stage, and asset type. No manual tagging ever.',
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    title: 'Get Clear Recommendations',
    body: 'Creatiq crosses AI labels with your real Meta metrics and tells you exactly what to scale, kill, and iterate.',
  },
]

export default function Features() {
  return (
    <section className="relative border-t border-slate-800">
      {/* Bg illustration */}
      <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none -mt-20 -z-10" aria-hidden="true">
        <Image src={Illustration} className="max-w-none" width="1440" height="440" alt="" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h2 className="h2 font-hkgrotesk mb-4">From raw ads to clear decisions.</h2>
            <p className="text-xl text-[var(--color-text-muted)]">
              Three steps. Fully automatic.
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative flex flex-col bg-slate-800 p-6 md:p-8 rounded-xl border border-slate-700"
                data-aos="fade-up"
                data-aos-delay={`${i * 150}`}
              >
                {/* Step number */}
                <div className="absolute -top-3 -left-1 md:-left-2">
                  <span className="font-[family-name:var(--font-bebas-neue)] text-5xl md:text-6xl text-[var(--color-accent)] opacity-20 select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-lg bg-[var(--color-accent-bg)] border border-[var(--color-accent-border)] flex items-center justify-center mb-4">
                  {step.icon}
                </div>

                <h3 className="font-hkgrotesk font-bold text-lg text-[var(--color-text-primary)] mb-2">
                  {step.title}
                </h3>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed flex-1">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
