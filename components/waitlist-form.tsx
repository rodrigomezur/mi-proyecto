'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { joinWaitlist } from '@/app/actions'

export default function WaitlistForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

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
      <form
        action={async (formData) => {
          setStatus('loading')
          setErrorMsg('')
          const result = await joinWaitlist(formData)
          if (result.error) {
            setErrorMsg(result.error)
            setStatus('error')
          } else {
            setStatus('success')
          }
        }}
        className="flex flex-col sm:flex-row gap-3 w-full"
      >
        <div className="flex-1">
          <label htmlFor="waitlist-email" className="sr-only">Email address</label>
          <Input
            id="waitlist-email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            maxLength={254}
            autoComplete="email"
            disabled={status === 'loading'}
            className="bg-slate-800 border-slate-700 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)] h-12"
          />
        </div>
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-slate-900 font-semibold cursor-pointer disabled:opacity-70 h-12 px-6"
        >
          {status === 'loading' ? 'Joining...' : 'Get early access'}
        </Button>
      </form>
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-2 text-center" role="alert">{errorMsg}</p>
      )}
    </div>
  )
}
