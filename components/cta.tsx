import Image from 'next/image'
import Illustration from '@/public/images/cta-illustration.svg'
import WaitlistForm from '@/components/waitlist-form'

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
        <Image src={Illustration} className="max-w-none" alt="" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-8 md:pb-12" data-aos="fade-up">
            <h2 className="h2 font-hkgrotesk mb-4">Stop guessing. Start knowing.</h2>
            <p className="text-xl text-[var(--color-text-muted)] mb-8">
              Connect your first Meta account in under 3 minutes. First insight in 48 hours.
            </p>
            <div className="max-w-md mx-auto">
              <WaitlistForm />
              <p className="text-xs text-[var(--color-text-muted)] mt-3">
                Free for early adopters. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
