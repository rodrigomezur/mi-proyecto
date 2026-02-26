const cards = [
  {
    tag: 'PERFORMANCE AGENCIES',
    headline: 'Scale creative analysis across every client account.',
    body: 'Manage 10, 20, or 30 client accounts without adding headcount. Creatiq gives your team the same creative depth on every account — automatically. Show up to every client review with data, not opinions.',
    bullets: [
      'Unified dashboard across all client accounts',
      'White-label weekly reports ready to send',
      'Kill/scale signals segmented by funnel stage',
      'Iteration briefs your creative team can act on immediately',
    ],
    callout: 'Teams manage 3× more accounts with the same headcount.',
  },
  {
    tag: 'IN-HOUSE DTC TEAMS',
    headline: 'Cut the time between launching an ad and knowing what to do next.',
    body: 'Stop making creative decisions based on gut feel. Creatiq gives your media buyer or growth marketer full creative context in hours — not days of manual analysis.',
    bullets: [
      "AI analysis of every ad you're running on Meta",
      'Know which hook, angle, and format is actually driving ROAS',
      'Iteration briefs ready for your creative team same day',
      'No spreadsheets, no manual tagging, no guesswork',
    ],
    callout: 'First creative insight delivered within 48 hours of connecting.',
  },
]

export default function Icp() {
  return (
    <section className="relative border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h2 className="h2 font-hkgrotesk mb-4">Built for the teams who move fastest.</h2>
            <p className="text-xl text-[var(--color-text-muted)]">
              Whether you run an agency or an in-house growth team, Creatiq adapts to how you work.
            </p>
          </div>
          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {cards.map((card, i) => (
              <div
                key={i}
                className="flex flex-col bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={`${i * 150}`}
              >
                {/* Card body */}
                <div className="p-8 flex-1">
                  {/* Tag */}
                  <div className="mb-4">
                    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] bg-[var(--color-accent-bg)] border border-[var(--color-accent-border)] px-3 py-1 rounded-full">
                      {card.tag}
                    </span>
                  </div>
                  <h3 className="h3 font-hkgrotesk text-[var(--color-text-primary)] mb-4">{card.headline}</h3>
                  <p className="text-[var(--color-text-muted)] mb-6 leading-relaxed">{card.body}</p>
                  {/* Bullets */}
                  <ul className="space-y-3">
                    {card.bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)]">
                        <svg className="w-4 h-4 shrink-0 mt-0.5 fill-[var(--color-accent)]" viewBox="0 0 12 9" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.28.28 3.989 6.575 1.695 4.28A1 1 0 0 0 .28 5.695l3 3a1 1 0 0 0 1.414 0l7-7A1 1 0 0 0 10.28.28Z" fillRule="nonzero" />
                        </svg>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Card footer callout */}
                <div className="border-t border-slate-700 bg-slate-800/80 px-8 py-4">
                  <p className="text-sm text-[var(--color-text-muted)] font-medium italic">"{card.callout}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
