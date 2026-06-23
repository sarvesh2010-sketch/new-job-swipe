import type { Metadata, Viewport } from 'next';
import './globals.css';
import ClientProviders from '@/components/shared/ClientProviders';

export const viewport: Viewport = {
  themeColor: '#050814',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'JobSwipe — Hyperlocal Micro-Jobs for Students',
    template: '%s | JobSwipe',
  },
  description:
    'Find paid micro-gigs within walking distance of your campus. Swipe right to apply in seconds, work with a friend using Buddy Apply, and earn instantly. No scams. No long-term commitments.',
  keywords: [
    'student jobs', 'part time jobs Delhi University', 'campus gigs', 'micro jobs India',
    'hyperlocal jobs', 'college students earn money', 'DU gigs', 'swipe jobs',
  ],
  authors: [{ name: 'JobSwipe Team' }],
  creator: 'JobSwipe',
  publisher: 'JobSwipe',
  metadataBase: new URL('https://jobswipe.app'),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://jobswipe.app',
    title: 'JobSwipe — Hyperlocal Micro-Jobs for Students',
    description: 'Swipe on 2-4 hour paid gigs within walking distance of your campus. Work with friends, build your Trust Score, earn immediately.',
    siteName: 'JobSwipe',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'JobSwipe — Gigs Near You' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JobSwipe — Hyperlocal Micro-Jobs for Students',
    description: 'Swipe right. Get hired. Earn today. Micro-gigs near your campus.',
    images: ['/og-image.png'],
    creator: '@jobswipe',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'JobSwipe',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col bg-void text-gray-100 font-body selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
