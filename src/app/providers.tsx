'use client'

import React, { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
      const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
      if (posthogKey && posthogHost) {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users
          capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        })
      }
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
