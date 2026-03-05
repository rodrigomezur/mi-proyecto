export default function Problem() {
  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h2 className="h2 font-hkgrotesk mb-4" data-aos="fade-up">
              You already know <span className="italic text-[var(--color-accent)]">what</span> happened. But not <span className="italic text-[var(--color-accent)]">why</span>.
            </h2>
            <p className="text-xl text-[var(--color-text-muted)]" data-aos="fade-up" data-aos-delay="100">
              Meta tells you an ad spent $2,000. It doesn't tell you what made it work.
            </p>
          </div>

          {/* Before / After */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Before */}
            <div
              className="bg-slate-800 border border-slate-700 rounded-xl p-8"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="font-hkgrotesk font-bold text-lg text-[var(--color-text-primary)]">Without Creatiq</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Hours in spreadsheets tagging ads manually',
                  '"I think the hook worked" — decisions based on gut feel',
                  'No system to compare creative patterns across accounts',
                  'Creative briefs based on opinion, not data',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div
              className="bg-slate-800 border border-[var(--color-accent-border)] rounded-xl p-8"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-bg)] border border-[var(--color-accent-border)] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-hkgrotesk font-bold text-lg text-[var(--color-text-primary)]">With Creatiq</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Every ad auto-classified by hook, angle, funnel stage',
                  '"Scale pain-angle hooks, kill offer statics" — data-driven signals',
                  'Cross-account pattern analysis in a single dashboard',
                  'AI iteration briefs your creative team can act on today',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)]">
                    <svg className="w-4 h-4 shrink-0 mt-0.5 fill-[var(--color-accent)]" viewBox="0 0 12 9" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" fillRule="nonzero" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
