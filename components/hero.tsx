import Link from 'next/link'
import WaitlistForm from '@/components/waitlist-form'

export default function Hero() {
  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 md:pt-40">
          {/* Hero content */}
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="h1 font-hkgrotesk mb-6" data-aos="fade-up">
              KNOW WHY YOUR ADS WORK.
            </h1>
            <p className="text-xl text-[var(--color-text-muted)] mb-10" data-aos="fade-up" data-aos-delay="100">
              Meta gives you the numbers. Creatiq gives you the reason. AI-powered creative analytics that connects what your ads look like to what they actually do — automatically.
            </p>
            <div
              className="max-w-xs mx-auto sm:max-w-none sm:inline-flex sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div>
                <Link className="btn text-slate-900 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] w-full shadow-xs font-semibold" href="/signup">
                  Start Free Trial — 14 Days
                </Link>
              </div>
              <div>
                <a className="btn text-[var(--color-text-primary)] bg-slate-700 hover:bg-slate-600 border-slate-600 w-full shadow-xs group" href="#0">
                  See how it works{' '}
                  <span className="tracking-normal group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">→</span>
                </a>
              </div>
            </div>

            {/* Waitlist form */}
            <div className="mt-8" data-aos="fade-up" data-aos-delay="300">
              <p className="text-sm text-[var(--color-text-muted)] mb-3">
                Acceso anticipado — únete a la lista de espera
              </p>
              <WaitlistForm />
              <p className="text-xs text-[var(--color-text-muted)] mt-3">
                Sin tarjeta de crédito. Sin spam.
              </p>
            </div>
          </div>

          {/* Mock Dashboard */}
          <div className="pt-16 md:pt-20" data-aos="fade-up" data-aos-delay="400">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-4xl mx-auto shadow-2xl">
              {/* Metric cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-900 rounded-lg p-4 text-center border border-slate-700">
                  <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Avg ROAS</div>
                  <div className="text-2xl font-bold text-[var(--color-accent)]">4.2x</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 text-center border border-slate-700">
                  <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Hook Rate</div>
                  <div className="text-2xl font-bold text-[var(--color-accent)]">31%</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 text-center border border-slate-700">
                  <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Dead Ads</div>
                  <div className="text-2xl font-bold text-red-400">7</div>
                </div>
              </div>

              {/* Ad rows */}
              <div className="space-y-3">
                {/* Row 1 */}
                <div className="flex items-center bg-slate-900 rounded-lg px-4 py-3 border border-slate-700 gap-4">
                  <div className="w-10 h-10 rounded bg-indigo-600 shrink-0" />
                  <div className="flex gap-2 flex-1">
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded">TOF</span>
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded">Pain angle</span>
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded">Video</span>
                  </div>
                  <span className="text-xs font-semibold bg-emerald-900/60 text-emerald-400 border border-emerald-700 px-2 py-1 rounded">↑ Scale</span>
                </div>
                {/* Row 2 */}
                <div className="flex items-center bg-slate-900 rounded-lg px-4 py-3 border border-slate-700 gap-4">
                  <div className="w-10 h-10 rounded bg-amber-500 shrink-0" />
                  <div className="flex gap-2 flex-1">
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded">MOF</span>
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded">Social proof</span>
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded">Static</span>
                  </div>
                  <span className="text-xs font-semibold bg-yellow-900/60 text-yellow-400 border border-yellow-700 px-2 py-1 rounded">⟳ Iterate</span>
                </div>
                {/* Row 3 */}
                <div className="flex items-center bg-slate-900 rounded-lg px-4 py-3 border border-slate-700 gap-4">
                  <div className="w-10 h-10 rounded bg-rose-600 shrink-0" />
                  <div className="flex gap-2 flex-1">
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded">BOF</span>
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded">Offer</span>
                    <span className="text-xs bg-slate-700 text-[var(--color-text-primary)] px-2 py-0.5 rounded">Video</span>
                  </div>
                  <span className="text-xs font-semibold bg-red-900/60 text-red-400 border border-red-700 px-2 py-1 rounded">✕ Kill</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
