'use client'

import { useState, useMemo } from 'react'

type WaitlistEntry = {
  id: string
  email: string
  created_at: string
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function formatDateShort(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(iso))
}

function getSignupsToday(entries: WaitlistEntry[]) {
  const today = new Date().toDateString()
  return entries.filter((e) => new Date(e.created_at).toDateString() === today).length
}

function getSignupsThisWeek(entries: WaitlistEntry[]) {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return entries.filter((e) => new Date(e.created_at) >= weekAgo).length
}

export default function AdminWaitlist({ entries }: { entries: WaitlistEntry[] }) {
  const [search, setSearch] = useState('')
  const total = entries.length

  const filtered = useMemo(() => {
    if (!search.trim()) return entries
    const q = search.toLowerCase()
    return entries.filter((e) => e.email.toLowerCase().includes(q))
  }, [entries, search])

  function exportCSV() {
    const header = 'email,signed_up_at'
    const rows = entries.map((e) => `${e.email},${e.created_at}`)
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `creatiq-waitlist-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Total signups</p>
          <p className="text-3xl font-bold text-[var(--color-accent)] font-hkgrotesk">{total}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Today</p>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] font-hkgrotesk">{getSignupsToday(entries)}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">This week</p>
          <p className="text-3xl font-bold text-[var(--color-text-primary)] font-hkgrotesk">{getSignupsThisWeek(entries)}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Latest</p>
          <p className="text-sm font-medium text-[var(--color-text-primary)] truncate mt-1">
            {entries[0]?.email ?? '—'}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            {entries[0] ? formatDateShort(entries[0].created_at) : ''}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <label htmlFor="admin-search" className="sr-only">Search emails</label>
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            id="admin-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-colors text-sm"
          />
        </div>
        <button
          onClick={exportCSV}
          disabled={total === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-slate-900 font-semibold text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
            {search ? `Results for "${search}"` : 'All signups'}
          </h2>
          <span className="text-xs bg-slate-700 text-[var(--color-text-muted)] px-2.5 py-1 rounded-full">
            {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <svg className="w-10 h-10 mx-auto mb-3 text-[var(--color-text-muted)] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
            </svg>
            <p className="text-[var(--color-text-muted)] text-sm">
              {search ? 'No emails match your search.' : 'No signups yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider w-16">#</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Signed up</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-[var(--color-text-muted)] tabular-nums">{total - entries.indexOf(entry)}</td>
                    <td className="px-6 py-4 text-[var(--color-text-primary)] font-medium">{entry.email}</td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)]">{formatDate(entry.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
