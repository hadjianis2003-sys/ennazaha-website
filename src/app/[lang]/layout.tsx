import type { Metadata } from 'next'
import LangLayoutClient from './LangLayoutClient'

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

const locales = ['ar', 'fr'] as const
type Locale = typeof locales[number]

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

// This nested layout MUST NOT render <html> or <body> — those live only in
// the root layout.tsx. Here we delegate lang/dir to a client component that
// updates the root <html> element after hydration.
export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = (locales.includes(lang as Locale) ? lang : 'ar') as Locale
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <LangLayoutClient locale={locale} dir={dir}>
      {children}
    </LangLayoutClient>
  )
}
