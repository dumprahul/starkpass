import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { GeistPixelGrid } from 'geist/font/pixel'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'StarkPass — Private event access on Starknet',
  description:
    'StarkPass is a privacy-preserving event access system on Starknet. Prove eligibility with zero-knowledge proofs, onboard with social login, and transact gaslessly via StarkZap—without exposing identity or wallet history.',
  keywords: [
    'StarkPass',
    'Starknet',
    'zero-knowledge proofs',
    'ZK',
    'privacy',
    'event access',
    'event ticketing',
    'eligibility verification',
    'age verification',
    'gasless transactions',
    'StarkZap',
    'social login wallet',
  ],
  authors: [{ name: 'StarkPass' }],
  creator: 'StarkPass',
  publisher: 'StarkPass',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'StarkPass — Private event access on Starknet',
    description:
      'Prove event eligibility with zero-knowledge proofs. Social login wallets and gasless transactions via StarkZap. Private, verifiable, accessible event participation.',
    siteName: 'StarkPass',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StarkPass — Private event access on Starknet',
    description:
      'Privacy-preserving event access on Starknet: ZK eligibility proofs, social login wallets, and gasless transactions via StarkZap.',
    creator: '@starkpass',
  },
  category: 'technology',
}

export const viewport: Viewport = {
  themeColor: '#F2F1EA',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${GeistPixelGrid.variable}`} suppressHydrationWarning>
      <body className="font-mono antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
