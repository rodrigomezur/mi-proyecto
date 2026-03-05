export const metadata = {
  title: 'Creatiq — Know why your ads work',
  description: 'AI-powered creative analytics that connects what your ads look like to what they actually do.',
}

import Hero from '@/components/hero'
import LogoBar from '@/components/logo-bar'
import Problem from '@/components/problem'
import Features from '@/components/features'
import Features02 from '@/components/features-02'
import Stats from '@/components/stats'
import Testimonials from '@/components/testimonials'
import Icp from '@/components/icp'
import Pricing from '@/components/pricing'
import Faqs from '@/components/faqs'
import Cta from '@/components/cta'

export default function Home() {
  return (
    <>
      <Hero />
      <LogoBar />
      <Problem />
      <Features />
      <Features02 />
      <Stats />
      <Testimonials />
      <Icp />
      <Pricing />
      <Faqs />
      <Cta />
    </>
  )
}
