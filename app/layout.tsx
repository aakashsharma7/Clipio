import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { StructuredData } from '@/components/ui/structured-data'
import { PerformanceOptimizer, FontOptimizer } from '@/components/ui/performance-optimizer'

const manrope = Manrope({ subsets: ['latin'], weight: ['200','300','400','500','600','700','800'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://clipio.app'),
  title: {
    default: 'Clipio - AI-Powered Design Asset Management Platform',
    template: '%s | Clipio'
  },
  description: 'Transform your design workflow with Clipio. AI-powered asset management, smart tagging, team collaboration, and seamless integrations with Figma, Adobe, and more. Organize, discover, and share design assets effortlessly.',
  keywords: [
    'design asset management',
    'AI tagging',
    'design collaboration',
    'Figma integration',
    'Adobe integration',
    'design workflow',
    'asset organization',
    'team collaboration',
    'design tools',
    'creative asset management',
    'AI design tools',
    'design productivity'
  ],
  authors: [{ name: 'Clipio Team', url: 'https://clipio.app' }],
  creator: 'Clipio',
  publisher: 'Clipio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://clipio.app',
    languages: {
      'en-US': 'https://clipio.app',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://clipio.app',
    siteName: 'Clipio',
    title: 'Clipio - AI-Powered Design Asset Management Platform',
    description: 'Transform your design workflow with AI-powered asset management, smart tagging, and team collaboration. Integrate seamlessly with Figma, Adobe, and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Clipio - AI-Powered Design Asset Management',
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 600,
        height: 600,
        alt: 'Clipio Logo and Brand',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@clipio_app',
    creator: '@clipio_app',
    title: 'Clipio - AI-Powered Design Asset Management Platform',
    description: 'Transform your design workflow with AI-powered asset management, smart tagging, and team collaboration.',
    images: ['/og-image.png'],
  },
  other: {
    'theme-color': '#0f1114',
    'color-scheme': 'dark',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Clipio',
    'application-name': 'Clipio',
    'msapplication-TileColor': '#0f1114',
    'msapplication-config': '/browserconfig.xml',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0f1114" />
        <meta name="msapplication-TileColor" content="#0f1114" />
        <meta name="theme-color" content="#0f1114" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* Structured Data for SEO */}
        <StructuredData />
      </head>
      <body className={manrope.className}>
        {/* Performance Optimizers */}
        <PerformanceOptimizer />
        <FontOptimizer />
        
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(0, 0, 0, 0.9)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        />
      </body>
    </html>
  )
}
