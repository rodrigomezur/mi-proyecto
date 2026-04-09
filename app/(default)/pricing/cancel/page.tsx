import Link from 'next/link'

export const metadata = { title: 'Payment Cancelled — Creatiq' }

export default function CancelPage() {
  return (
    <section className="relative">
      <div className="max-w-lg mx-auto px-4 sm:px-6 pt-28 pb-20 text-center">
        <div className="text-5xl mb-6">&#10007;</div>
        <h1 className="h2 font-hkgrotesk mb-4">Payment cancelled</h1>
        <p className="text-lg text-[var(--color-text-muted)] mb-8">
          No worries — you haven&apos;t been charged. You can try again anytime.
        </p>
        <Link
          href="/pricing"
          className="btn bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-slate-900 font-semibold px-8"
        >
          Back to Pricing
        </Link>
      </div>
    </section>
  )
}
