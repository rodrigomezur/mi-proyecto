const testimonials = [
  {
    initial: 'M',
    quote: 'Before Creatiq, every client review started with "I think the hook worked because..." Now we just show them the data. Decision quality went up immediately.',
    name: 'Martina L.',
    role: 'Head of Paid Social',
    company: 'Momentum Agency',
  },
  {
    initial: 'J',
    quote: 'We were managing 12 accounts with two people. Creatiq didn\'t just save time — it changed how we think about creative. We brief based on what the data says now.',
    name: 'Jake R.',
    role: 'Founder',
    company: 'Scale Digital',
  },
  {
    initial: 'S',
    quote: 'The iteration briefs are the killer feature. My creative team stops asking "what should we change?" and starts asking "which direction do you want to pursue?"',
    name: 'Sofia C.',
    role: 'Growth Lead',
    company: 'Nomad Goods',
  },
]

export default function Testimonials() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20 border-t border-slate-800">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] block mb-4">What teams are saying</span>
            <h2 className="h2 font-hkgrotesk">Real results from real teams.</h2>
          </div>

          {/* Testimonial cards */}
          <div className="max-w-sm mx-auto grid gap-6 md:grid-cols-3 md:gap-8 items-stretch md:max-w-none">
            {testimonials.map((t, i) => (
              <article
                key={i}
                className="flex flex-col bg-slate-800 border border-slate-700 rounded-xl p-6 md:p-8"
                data-aos="fade-up"
                data-aos-delay={`${i * 150}`}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-4 h-4 fill-amber-400" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M10 5.934L8 0 6 5.934H0l4.89 3.954L2.968 16 8 12.223 13.032 16 11.11 9.888 16 5.934z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="flex-1 mb-6">
                  <p className="text-[var(--color-text-muted)] leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </blockquote>

                {/* Author */}
                <footer className="flex items-center gap-3 pt-4 border-t border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-accent-bg)] border border-[var(--color-accent-border)] flex items-center justify-center text-sm font-bold text-[var(--color-accent)]">
                    {t.initial}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--color-text-primary)]">{t.name}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">{t.role} · {t.company}</div>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
