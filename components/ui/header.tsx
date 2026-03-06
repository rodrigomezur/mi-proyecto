'use client'

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ui/theme-toggle'

export default function Header({ nav = true }: { nav?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            <Link className="block" href="/" aria-label="Creatiq">
              <span className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-widest text-[var(--color-accent)]">
                CREATIQ
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          {nav && (
            <nav className="hidden md:flex grow">
              <ul className="flex grow justify-end flex-wrap items-center">
                <li>
                  <Link
                    className="font-medium text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] px-4 lg:px-6 py-2 flex items-center transition duration-150 ease-in-out uppercase tracking-wider"
                    href="/dashboard"
                  >
                    Go to Dashboard <span className="ml-1 tracking-normal">&rarr;</span>
                  </Link>
                </li>
                <li className="ml-3">
                  <ThemeToggle />
                </li>
                <li className="ml-3">
                  <Link
                    className="btn-sm text-sm text-slate-900 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] w-full shadow-xs font-semibold uppercase tracking-wider"
                    href="/signup"
                  >
                    Get Started Free
                  </Link>
                </li>
              </ul>
            </nav>
          )}

          {/* Mobile menu button */}
          {nav && (
            <div className="flex items-center gap-3 md:hidden">
              <ThemeToggle />
              <button
                type="button"
                className="w-11 h-11 flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? (
                  <svg className="w-5 h-5 text-[var(--color-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[var(--color-text-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile navigation */}
        {nav && mobileOpen && (
          <nav className="md:hidden pb-4">
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  className="block font-medium text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] px-4 py-3 rounded-lg hover:bg-slate-800 transition uppercase tracking-wider"
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                >
                  Go to Dashboard &rarr;
                </Link>
              </li>
              <li>
                <Link
                  className="block text-center btn-sm text-sm text-slate-900 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] shadow-xs font-semibold uppercase tracking-wider"
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started Free
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
