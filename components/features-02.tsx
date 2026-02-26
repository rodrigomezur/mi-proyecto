import Image from 'next/image'
import Illustration from '@/public/images/features-illustration-02.svg'

const features = [
  {
    icon: '🔗',
    title: 'Multi-Account Sync',
    body: 'Connect every client account in minutes. Creatiq pulls all active ads, maintains a live creative library, and refreshes data automatically. No manual exports.',
  },
  {
    icon: '🤖',
    title: 'AI Creative Analysis',
    body: 'Every ad is classified by asset type, message angle, hook tactic, funnel stage, and core value proposition. Automatically. Without touching a spreadsheet.',
  },
  {
    icon: '📊',
    title: 'Creative Performance Dashboard',
    body: 'Filter your entire ad library by creative pattern and see which angles are winning across ROAS, CTR, hook rate, and CPA. One view instead of ten.',
  },
  {
    icon: '⚡',
    title: 'Kill / Scale Signals',
    body: 'Every ad with real spend gets a signal: scale it, kill it, or iterate. Segmented by funnel stage so you never compare a TOF prospecting ad to a BOF retargeting unit.',
  },
  {
    icon: '🔄',
    title: 'AI Iteration Briefs',
    body: 'For ads with potential but weak numbers, Creatiq generates a ready-to-use brief: what to change about the hook, which angle to test, what format might convert better.',
  },
  {
    icon: '📋',
    title: 'Automated Weekly Reports',
    body: 'Every week, a client-ready report: top performers, bottom performers, and AI insights explaining the why behind each result. Send it directly. No editing.',
  },
]

export default function Features02() {
  return (
    <section className="relative border-t border-slate-800">
      {/* Bg gradient: top */}
      <div
        className="absolute top-0 left-0 right-0 bg-linear-to-b from-slate-800 to-transparent opacity-25 h-[25rem] pointer-events-none -z-10"
        aria-hidden="true"
      />
      {/* Illustration */}
      <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 mt-40 pointer-events-none -z-10" aria-hidden="true">
        <Image src={Illustration} className="max-w-none" width="1440" height="453" alt="Features 02 Illustration" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h2 className="h2 font-hkgrotesk mb-4">Everything your team needs to move faster.</h2>
            <p className="text-xl text-[var(--color-text-muted)]">Six capabilities built specifically for performance marketing teams.</p>
          </div>
          {/* Feature grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-slate-800/60 border border-slate-700 rounded-lg p-6" data-aos="fade-up" data-aos-delay={`${i * 100}`}>
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-hkgrotesk font-bold text-lg text-[var(--color-text-primary)] mb-2">{feature.title}</h3>
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
