import Link from 'next/link'

export const metadata = { title: 'Payment Successful — Creatiq' }

export default function SuccessPage() {
  return (
    <section className="relative">
      <div className="max-w-lg mx-auto px-4 sm:px-6 pt-28 pb-20 text-center">
        <div className="text-5xl mb-6">&#10003;</div>
        <h1 className="h2 font-hkgrotesk mb-4">Payment successful!</h1>
        <p className="text-lg text-[var(--color-text-muted)] mb-8">
          Your subscription is now active. Welcome to Creatiq.
        </p>
        <Link
          href="/dashboard"
          className="btn bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-slate-900 font-semibold px-8"
        >
          Go to Dashboard
        </Link>
      </div>
    </section>
  )
}
