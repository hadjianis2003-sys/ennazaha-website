import type { Metadata } from 'next'
import '../styles/globals.css'
import { PostHogProvider } from './providers'
import PostHogPageView from '../components/PostHogPageView'
import PostHogCustomEvents from '../components/PostHogCustomEvents'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: {
    template: '%s | النزاهة للترقية العقارية',
    default: 'النزاهة للترقية العقارية',
  },
  description: 'مطور عقاري رائد في الجزائر — مشاريع سكنية راقية في منطقة العاصمة',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

// Root layout: the ONLY place <html> and <body> can live.
// suppressHydrationWarning prevents mismatches when dir/lang
// are updated client-side by the nested [lang] layout.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body suppressHydrationWarning>
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
            <PostHogCustomEvents />
          </Suspense>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
