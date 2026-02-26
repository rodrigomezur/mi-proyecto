import Image from 'next/image'
import Link from 'next/link'
import Illustration from '@/public/images/cta-illustration.svg'

export default function Cta() {
  return (
    <section className="relative border-t border-slate-800">
      {/* Bg gradient: top */}
      <div
        className="absolute top-0 left-0 right-0 bg-linear-to-b from-slate-800 to-transparent opacity-25 h-[25rem] pointer-events-none -z-10"
        aria-hidden="true"
      />
      {/* Illustration */}
      <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 -mt-8 pointer-events-none -z-10" aria-hidden="true">
        <Image src={Illustration} className="max-w-none" alt="CTA Illustration" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-8 md:pb-12" data-aos="fade-up">
            <h2 className="h2 font-hkgrotesk mb-4">Stop guessing. Start knowing.</h2>
            <p className="text-xl text-[var(--color-text-muted)]">
              Connect your first Meta account in under 3 minutes. First insight in 48 hours.
            </p>
          </div>
          {/* Buttons */}
          <div className="text-center">
            <div className="max-w-xs mx-auto sm:max-w-none sm:inline-flex sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div data-aos="fade-up" data-aos-delay="100">
                <Link className="btn text-slate-900 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] w-full shadow-xs font-semibold" href="/signup">
                  Start Free — No Card Needed
                </Link>
              </div>
              <div data-aos="fade-up" data-aos-delay="200">
                <a className="btn text-[var(--color-text-primary)] bg-slate-700 hover:bg-slate-600 border-slate-600 w-full shadow-xs group" href="#0">
                  Read the docs{' '}
                  <span className="tracking-normal group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
