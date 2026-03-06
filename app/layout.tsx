import './css/style.css'

import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { Syne, DM_Sans, DM_Mono } from 'next/font/google'
import localFont from 'next/font/local'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500'],
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
  weight: ['300', '400', '500'],
})

const hkgrotesk = localFont({
  src: [
    {
      path: '../public/fonts/HKGrotesk-Medium.woff2',
      weight: '500',
    },
    {
      path: '../public/fonts/HKGrotesk-Bold.woff2',
      weight: '700',
    },
    {
      path: '../public/fonts/HKGrotesk-ExtraBold.woff2',
      weight: '800',
    },
  ],
  variable: '--font-hkgrotesk',
  display: 'swap',
})

// Keep Bebas Neue for landing page branding
import { Bebas_Neue } from 'next/font/google'
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas-neue',
  display: 'swap'
})

export const metadata = {
  title: 'Creatiq — Know why your ads work',
  description: 'AI-powered creative analytics that connects what your ads look like to what they actually do.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="night" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='day'||t==='night'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})();`,
            }}
          />
        </head>
        <body className={`${inter.variable} ${hkgrotesk.variable} ${bebasNeue.variable} ${syne.variable} ${dmSans.variable} ${dmMono.variable} font-inter antialiased bg-slate-900 text-slate-200 tracking-tight`}>
          <div className="flex flex-col min-h-screen overflow-hidden">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
