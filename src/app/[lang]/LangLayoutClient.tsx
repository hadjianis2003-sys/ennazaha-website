'use client'

import { useEffect } from 'react'

// LangLayout: updates the root <html> lang & dir attributes from the URL segment.
// This is the correct Next.js App Router pattern — <html>/<body> live ONLY in
// the root layout. This client component mutates those attributes after hydration.
export default function LangLayoutClient({
  locale,
  dir,
  children,
}: {
  locale: string
  dir: string
  children: React.ReactNode
}) {
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale, dir])

  return <>{children}</>
}
