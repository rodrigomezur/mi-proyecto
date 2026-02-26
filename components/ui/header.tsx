import Link from 'next/link'
import ThemeToggle from '@/components/ui/theme-toggle'

export default function Header({ nav = true }: {
  nav?: boolean
}) {
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
          {nav &&
            <nav className="flex grow">
              <ul className="flex grow justify-end flex-wrap items-center">
                <li>
                  <Link className="font-medium text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] px-4 lg:px-6 py-2 flex items-center transition duration-150 ease-in-out uppercase tracking-wider" href="/signin">Sign in</Link>
                </li>
                <li className="ml-3">
                  <ThemeToggle />
                </li>
                <li className="ml-3">
                  <Link className="btn-sm text-sm text-slate-900 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] w-full shadow-xs font-semibold uppercase tracking-wider" href="/signup">
                    Get Started Free
                  </Link>
                </li>
              </ul>
            </nav>
          }
        </div>
      </div>
    </header>
  )
}
