'use client'

import { useState } from 'react'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    // TODO: conectar con tu proveedor de email (Mailchimp, ConvertKit, etc.)
    console.log('Waitlist email:', email)
    setStatus('success')
    setEmail('')
  }

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center gap-2 text-[var(--color-accent)] font-medium">
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        <span>¡Apuntado! Te avisamos cuando abramos.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto w-full">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        required
        className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors text-sm"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-slate-900 font-semibold text-sm transition-colors whitespace-nowrap shadow-sm cursor-pointer"
      >
        Join Waitlist →
      </button>
    </form>
  )
}
