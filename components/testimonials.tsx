export default function Testimonials() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20 border-b border-slate-800">
          {/* Section label */}
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">What teams are saying</span>
          </div>
          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-8 md:grid-cols-3 lg:gap-16 items-start md:max-w-none">

            {/* 1st Testimonial */}
            <article className="h-full flex flex-col items-center text-center" data-aos="fade-up">
              <header className="mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-[var(--color-accent)] mx-auto">M</div>
                <div className="mt-4">
                  <div className="flex space-x-1 justify-center">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} className="w-4 h-4 fill-amber-400" viewBox="0 0 16 16">
                        <path d="M10 5.934L8 0 6 5.934H0l4.89 3.954L2.968 16 8 12.223 13.032 16 11.11 9.888 16 5.934z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </header>
              <div className="grow mb-3">
                <p className="text-[var(--color-text-muted)] italic">"Before Creatiq, every client review started with 'I think the hook worked because...' Now we just show them the data. Decision quality went up immediately."</p>
              </div>
              <footer className="text-sm font-medium">
                <div className="text-[var(--color-text-primary)]">Martina L.</div>
                <div className="text-[var(--color-text-muted)]">Head of Paid Social · Momentum Agency</div>
              </footer>
            </article>

            {/* 2nd Testimonial */}
            <article className="h-full flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="200">
              <header className="mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-[var(--color-accent)] mx-auto">J</div>
                <div className="mt-4">
                  <div className="flex space-x-1 justify-center">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} className="w-4 h-4 fill-amber-400" viewBox="0 0 16 16">
                        <path d="M10 5.934L8 0 6 5.934H0l4.89 3.954L2.968 16 8 12.223 13.032 16 11.11 9.888 16 5.934z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </header>
              <div className="grow mb-3">
                <p className="text-[var(--color-text-muted)] italic">"We were managing 12 accounts with two people. Creatiq didn't just save time — it changed how we think about creative. We brief based on what the data says now."</p>
              </div>
              <footer className="text-sm font-medium">
                <div className="text-[var(--color-text-primary)]">Jake R.</div>
                <div className="text-[var(--color-text-muted)]">Founder · Scale Digital</div>
              </footer>
            </article>

            {/* 3rd Testimonial */}
            <article className="h-full flex flex-col items-center text-center" data-aos="fade-up" data-aos-delay="400">
              <header className="mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-[var(--color-accent)] mx-auto">S</div>
                <div className="mt-4">
                  <div className="flex space-x-1 justify-center">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} className="w-4 h-4 fill-amber-400" viewBox="0 0 16 16">
                        <path d="M10 5.934L8 0 6 5.934H0l4.89 3.954L2.968 16 8 12.223 13.032 16 11.11 9.888 16 5.934z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </header>
              <div className="grow mb-3">
                <p className="text-[var(--color-text-muted)] italic">"The iteration briefs are the killer feature. My creative team stops asking 'what should we change?' and starts asking 'which direction do you want to pursue?'"</p>
              </div>
              <footer className="text-sm font-medium">
                <div className="text-[var(--color-text-primary)]">Sofia C.</div>
                <div className="text-[var(--color-text-muted)]">Growth Lead · Nomad Goods</div>
              </footer>
            </article>

          </div>
        </div>
      </div>
    </section>
  )
}
