import './css/style.css'

import { Inter, Bebas_Neue } from 'next/font/google'
import localFont from 'next/font/local'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas-neue',
  display: 'swap'
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
    <html lang="en" data-theme="night" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='day'||t==='night'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${hkgrotesk.variable} ${bebasNeue.variable} font-inter antialiased bg-slate-900 text-slate-200 tracking-tight`}>
        <div className="flex flex-col min-h-screen overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}
