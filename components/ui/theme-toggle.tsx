'use client'

import { useEffect, useState } from 'react'

type Theme = 'night' | 'day'

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('night')

  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme') as Theme
    if (t === 'day' || t === 'night') setTheme(t)
  }, [])

  function toggle() {
    const next: Theme = theme === 'night' ? 'day' : 'night'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try { localStorage.setItem('theme', next) } catch (_) {}
  }

  const isDay = theme === 'day'

  return (
    <button
      onClick={toggle}
      aria-label={isDay ? 'Switch to night mode' : 'Switch to day mode'}
      className="relative flex items-center w-14 h-7 rounded-full cursor-pointer shrink-0"
      style={{
        backgroundColor: 'var(--color-surface-3)',
        border: '1px solid var(--color-border-subtle)',
        transition: 'background-color 300ms ease, border-color 300ms ease',
      }}
    >
      <span
        className="absolute top-0.5 left-0.5 flex items-center justify-center w-6 h-6 rounded-full"
        style={{
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-on-accent)',
          transform: isDay ? 'translateX(28px)' : 'translateX(0px)',
          transition: 'transform 300ms ease, background-color 300ms ease',
        }}
      >
        {isDay ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  )
}
