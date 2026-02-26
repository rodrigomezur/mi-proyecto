'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Illustration from '@/public/images/features-illustration.svg'

// Import Swiper
import Swiper, { Autoplay, Navigation } from 'swiper'
import 'swiper/swiper.min.css'
Swiper.use([Autoplay, Navigation])

const steps = [
  {
    icon: '🔗',
    title: 'Connect Your Meta Accounts',
    body: 'Link one account or thirty. Creatiq syncs all active ads — creatives, spend, and performance data — and keeps everything updated automatically.',
  },
  {
    icon: '🤖',
    title: 'AI Reads Every Creative',
    body: 'Each video and image ad is analyzed and classified by hook tactic, message angle, funnel stage (TOF/MOF/BOF), and asset type. No manual tagging.',
  },
  {
    icon: '⚡',
    title: 'Get Clear Recommendations',
    body: 'Creatiq crosses AI labels with your real Meta metrics and tells you exactly what to scale, kill, and iterate — with briefs your creative team can act on today.',
  },
]

export default function Features() {

  useEffect(() => {
    const carousel = new Swiper('.carousel', {
      breakpoints: {
        320: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
      grabCursor: true,
      loop: false,
      centeredSlides: false,
      initialSlide: 0,
      spaceBetween: 24,
      autoplay: {
        delay: 7000,
      },
      navigation: {
        nextEl: '.carousel-next',
        prevEl: '.carousel-prev',
      },
    })
  }, [])

  return (
    <section className="relative">
      {/* Bg illustration */}
      <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none -mt-20 -z-10" aria-hidden="true">
        <Image src={Illustration} className="max-w-none" width="1440" height="440" alt="Illustration" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 font-hkgrotesk mb-4">From raw ads to clear decisions.</h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-xl text-[var(--color-text-muted)]">
                Three steps. Fully automatic.
              </p>
            </div>
          </div>
          {/* Carousel */}
          <div className="carousel swiper-container">
            <div className="swiper-wrapper">
              {steps.map((step, i) => (
                <div key={i} className="swiper-slide h-auto flex flex-col bg-slate-800 p-6 rounded-sm border border-slate-700">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <div className="grow">
                    <div className="font-hkgrotesk font-bold text-xl text-[var(--color-text-primary)] mb-2">{step.title}</div>
                    <div className="text-[var(--color-text-muted)]">
                      {step.body}
                    </div>
                  </div>
                  <div className="mt-4 text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider">
                    Step {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Arrows */}
          <div className="flex mt-12 space-x-4 justify-end">
            <button className="carousel-prev relative z-20 w-14 h-14 rounded-full flex items-center justify-center group border border-slate-700 bg-slate-800 hover:bg-slate-700 transition duration-150 ease-in-out">
              <span className="sr-only">Previous</span>
              <svg className="w-4 h-4 fill-[var(--color-text-muted)] transition duration-150 ease-in-out" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.7 14.7l1.4-1.4L3.8 9H16V7H3.8l4.3-4.3-1.4-1.4L0 8z" />
              </svg>
            </button>
            <button className="carousel-next relative z-20 w-14 h-14 rounded-full flex items-center justify-center group border border-slate-700 bg-slate-800 hover:bg-slate-700 transition duration-150 ease-in-out">
              <span className="sr-only">Next</span>
              <svg className="w-4 h-4 fill-[var(--color-text-muted)] transition duration-150 ease-in-out" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.3 14.7l-1.4-1.4L12.2 9H0V7h12.2L7.9 2.7l1.4-1.4L16 8z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
