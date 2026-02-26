'use client'

import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 4.7, suffix: 'h', label: 'Saved per week, per account' },
  { value: 3, suffix: '×', label: 'More accounts per analyst' },
  { value: 48, suffix: 'h', label: 'Average time to first insight' },
  { value: 92, suffix: '%', label: 'AI classification accuracy' },
]

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1500
          const steps = 40
          const increment = target / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(parseFloat(current.toFixed(1)))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.4 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <span ref={ref}>
      {Number.isInteger(target) ? Math.round(count) : count.toFixed(1)}{suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="border-t border-b border-slate-800 bg-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center"
                data-aos="fade-up"
                data-aos-delay={`${i * 100}`}
              >
                <div className="text-4xl md:text-5xl font-bold font-hkgrotesk text-[var(--color-accent)] mb-2">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-[var(--color-text-muted)] leading-snug max-w-[10rem]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
