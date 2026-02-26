'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'What does Creatiq actually analyze in each ad?',
    a: 'For video ads, Creatiq analyzes the hook (first 3 seconds), message angle, call to action, and overall funnel positioning using Gemini AI. For static ads, it analyzes visual structure, headline angle, and offer type. Every classification is then crossed with your real Meta performance data.',
  },
  {
    q: 'How long does the first analysis take?',
    a: 'After connecting your Meta account, Creatiq typically delivers your first full creative analysis within 48 hours. Ongoing syncs happen every 7–15 days automatically, or you can trigger a manual sync anytime.',
  },
  {
    q: 'Does Creatiq replace Meta Ads Manager?',
    a: 'No — Creatiq is a creative intelligence layer on top of what already exists. You still manage and launch campaigns in Meta Ads Manager. Creatiq tells you why things are working so you make better decisions about what to create and scale next.',
  },
  {
    q: 'Is my ad data secure?',
    a: 'Yes. Creatiq connects via the official Meta Marketing API using read-only permissions. We never have access to your ad account controls, billing, or ability to make changes. Your data is encrypted at rest and never shared with third parties.',
  },
  {
    q: "What's the difference between the plans?",
    a: 'The main differentiators are the number of Meta accounts (3, 10, or unlimited) and access to advanced features like iteration briefs, white-label reports, and cross-account pattern analysis. All plans include AI classification and kill/scale signals.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. All plans are month-to-month with no long-term commitment. You can cancel, upgrade, or downgrade from your account settings at any time.',
  },
]

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState<number>(0)

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 md:pb-20">
            <h2 className="h2 font-hkgrotesk">FAQs</h2>
          </div>

          {/* Accordion */}
          <div className="space-y-6">
            {faqs.map((item, i) => {
              const isOpen = openIndex === i
              return (
                <div
                  key={i}
                  style={{
                    borderRadius: '0.75rem',
                    border: '1px solid var(--color-border-subtle)',
                    borderLeftWidth: '4px',
                    borderLeftColor: isOpen ? 'var(--color-accent)' : 'transparent',
                    backgroundColor: isOpen ? 'var(--color-surface-3)' : 'var(--color-surface-1)',
                    transition: 'border-color 300ms ease, background-color 300ms ease',
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <h4 className="text-xl font-hkgrotesk font-medium text-[var(--color-text-primary)] pr-4">
                      {item.q}
                    </h4>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        flexShrink: 0,
                        color: 'var(--color-accent)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 300ms ease',
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      transition: 'grid-template-rows 300ms ease',
                    }}
                  >
                    <div style={{ overflow: 'hidden' }}>
                      <p className="px-6 pb-5 text-[var(--color-text-muted)]">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
