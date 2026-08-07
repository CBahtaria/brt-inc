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
  title: {
    default: 'BRT Inc. — AI & Software Engineering Company in Eswatini',
    template: '%s | BRT Inc.',
  },
  description: 'BRT Inc. is an AI and software engineering company based in Manzini, Eswatini. We build autonomous systems, privacy tools, institutional platforms, and AI products for SADC governments, defence forces, and businesses.',
  keywords: [
    'software company Eswatini',
    'tech company Eswatini',
    'AI company Africa',
    'software development southern Africa',
    'SADC technology company',
    'government software Africa',
    'drone autopilot Africa',
    'command and control software Africa',
    'privacy browser extension',
    'B2B marketplace Africa',
    'Layered privacy extension',
    'Sentinel C2 system',
    'AI engineering Africa',
    'security audit Africa',
    'UE5 game Eswatini',
    'Swazi RPG game',
    'institutional software procurement SADC',
    'BRT Inc Eswatini',
    'brtinc.dev',
    'Manzini tech company',
  ],
  authors: [{ name: 'BRT Inc.', url: 'https://brtinc.dev' }],
  creator: 'BRT Inc.',
  publisher: 'BRT Inc.',
  metadataBase: new URL('https://brtinc.dev'),
  alternates: {
    canonical: 'https://brtinc.dev',
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://brtinc.dev',
    siteName: 'BRT Inc.',
    title: 'BRT Inc. — AI & Software Engineering Company in Eswatini',
    description: 'BRT Inc. builds autonomous systems, privacy tools, institutional platforms, and AI products for SADC governments, defence forces, and businesses.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BRT Inc. — AI & Software Engineering Company in Eswatini, southern Africa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BRT Inc. — AI & Software Engineering Company in Eswatini',
    description: 'Autonomous systems, privacy tools, institutional platforms, and AI products for SADC governments and businesses.',
    images: ['/og-image.png'],
    creator: '@brtinc',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'GOOGLE_SEARCH_CONSOLE_TOKEN',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://brtinc.dev/#organization',
      name: 'BRT Inc.',
      url: 'https://brtinc.dev',
      logo: 'https://brtinc.dev/logo.svg',
      description: 'AI and software engineering company based in Manzini, Eswatini, serving SADC governments, defence forces, and businesses.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Manzini',
        addressRegion: 'Manzini',
        addressCountry: 'SZ',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'hello@brtinc.dev',
        areaServed: ['SZ', 'ZA', 'BW', 'ZW', 'MZ', 'NA', 'ZM', 'MW'],
      },
      sameAs: ['https://github.com/CBahtaria'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://brtinc.dev/#website',
      url: 'https://brtinc.dev',
      name: 'BRT Inc.',
      publisher: { '@id': 'https://brtinc.dev/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://brtinc.dev/marketplace?q={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${barlowCondensed.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-background text-text antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
