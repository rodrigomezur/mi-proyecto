import WaitlistForm from '@/components/waitlist-form'

export default function Hero() {
  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 md:pt-40 pb-12 md:pb-16">
          {/* Hero content */}
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h1 font-hkgrotesk mb-6" data-aos="fade-up">
              Know why your ads work.
            </h1>
            <p className="text-xl text-[var(--color-text-muted)] mb-10 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
              Meta gives you the numbers. Creatiq gives you the reason. AI-powered creative analytics that connects what your ads look like to what they actually do.
            </p>

            {/* Single primary CTA: Waitlist */}
            <div className="max-w-md mx-auto" data-aos="fade-up" data-aos-delay="200">
              <WaitlistForm />
              <p className="text-xs text-[var(--color-text-muted)] mt-3">
                Join 200+ teams on the waitlist. No credit card. No spam.
              </p>
            </div>
          </div>

          {/* Mock Dashboard */}
          <div className="pt-16 md:pt-20" data-aos="fade-up" data-aos-delay="300">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 sm:p-6 max-w-4xl mx-auto shadow-2xl">
              {/* Top bar */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-[var(--color-text-muted)]">Creatiq Dashboard</span>
                </div>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-slate-900 rounded-lg p-3 sm:p-4 text-center border border-slate-700">
                  <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Avg ROAS</div>
                  <div className="text-xl sm:text-2xl font-bold text-[var(--color-accent)]">4.2x</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-3 sm:p-4 text-center border border-slate-700">
                  <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Hook Rate</div>
                  <div className="text-xl sm:text-2xl font-bold text-[var(--color-accent)]">31%</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-3 sm:p-4 text-center border border-slate-700">
                  <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Dead Ads</div>
                  <div className="text-xl sm:text-2xl font-bold text-red-400">7</div>
                </div>
              </div>

              {/* Ad rows */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center bg-slate-900 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-700 gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-indigo-600 shrink-0" />
                  <div className="flex gap-1.5 sm:gap-2 flex-1 overflow-x-auto no-scrollbar">
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded whitespace-nowrap">TOF</span>
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded whitespace-nowrap">Pain angle</span>
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded whitespace-nowrap">Video</span>
                  </div>
                  <span className="text-xs font-semibold bg-emerald-900/60 text-emerald-400 border border-emerald-700 px-2 py-1 rounded whitespace-nowrap">Scale</span>
                </div>
                <div className="flex items-center bg-slate-900 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-700 gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-amber-500 shrink-0" />
                  <div className="flex gap-1.5 sm:gap-2 flex-1 overflow-x-auto no-scrollbar">
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded whitespace-nowrap">MOF</span>
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded whitespace-nowrap">Social proof</span>
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded whitespace-nowrap">Static</span>
                  </div>
                  <span className="text-xs font-semibold bg-yellow-900/60 text-yellow-400 border border-yellow-700 px-2 py-1 rounded whitespace-nowrap">Iterate</span>
                </div>
                <div className="flex items-center bg-slate-900 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-700 gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-rose-600 shrink-0" />
                  <div className="flex gap-1.5 sm:gap-2 flex-1 overflow-x-auto no-scrollbar">
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded whitespace-nowrap">BOF</span>
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded whitespace-nowrap">Offer</span>
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded whitespace-nowrap">Video</span>
                  </div>
                  <span className="text-xs font-semibold bg-red-900/60 text-red-400 border border-red-700 px-2 py-1 rounded whitespace-nowrap">Kill</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
