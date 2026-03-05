'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setErrorMsg('')

    const { error } = await supabase
      .from('waitlist')
      .insert([{ email }])

    if (error) {
      if (error.code === '23505') {
        setErrorMsg('You\'re already on the list! We\'ll reach out soon.')
      } else {
        setErrorMsg('Something went wrong. Please try again.')
      }
      setStatus('error')
      return
    }

    setStatus('success')
    setEmail('')
  }

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center gap-2 text-[var(--color-accent)] font-medium py-3">
        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        <span>You&apos;re on the list! We&apos;ll be in touch.</span>
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="flex-1">
          <label htmlFor="waitlist-email" className="sr-only">Email address</label>
          <input
            id="waitlist-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            autoComplete="email"
            disabled={status === 'loading'}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors text-sm disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-slate-900 font-semibold text-sm transition-colors whitespace-nowrap shadow-sm cursor-pointer disabled:opacity-70"
        >
          {status === 'loading' ? 'Joining...' : 'Get early access'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-2 text-center" role="alert">{errorMsg}</p>
      )}
    </div>
  )
}
