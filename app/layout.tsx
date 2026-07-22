import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'BRT Inc. — Safety-Critical Software for SADC Institutions',
  description: 'Defence-grade engineering for government, defence forces, and civic institutions across southern Africa.',
  metadataBase: new URL('https://brt-inc.vercel.app'),
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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans bg-background text-text antialiased">
        {children}
      </body>
    </html>
  )
}
