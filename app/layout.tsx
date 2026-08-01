import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Barlow_Condensed } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-barlow-condensed',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BRT Inc. — Safety-Critical Software for SADC Institutions',
  description: 'Defence-grade engineering for government, defence forces, and civic institutions across southern Africa.',
  metadataBase: new URL('https://brtinc.dev'),
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    siteName: 'BRT Inc.',
    images: [{ url: '/logo.svg', width: 400, height: 400, alt: 'BRT Inc.' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${barlowCondensed.variable}`}>
      <body className="font-sans bg-background text-text antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
