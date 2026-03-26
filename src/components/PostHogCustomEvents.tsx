'use client'

import { useEffect, useRef } from 'react'
import { usePostHog } from 'posthog-js/react'
import { usePathname } from 'next/navigation'

export default function PostHogCustomEvents() {
  const posthog = usePostHog()
  const pathname = usePathname()
  
  // Track unique scrolls per pageview to avoid sending duplicate events
  const trackedDepths = useRef(new Set<number>())

  // Reset scroll milestones when path changes
  useEffect(() => {
    trackedDepths.current.clear()
  }, [pathname])

  useEffect(() => {
    if (typeof window === 'undefined' || !posthog) return

    // 1. Scroll Depth tracking (25%, 50%, 75%, 100%)
    let isScrolling = false
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const scrollY = window.scrollY
      const maxScroll = docHeight - winHeight

      if (maxScroll <= 0) return

      const scrollPercent = (scrollY / maxScroll) * 100
      const depths = [25, 50, 75, 100]

      depths.forEach((depth) => {
        // give a small 1% margin for 100% since mobile browsers can act weird at the absolute bottom
        const threshold = depth === 100 ? 99 : depth 
        if (scrollPercent >= threshold && !trackedDepths.current.has(depth)) {
          trackedDepths.current.add(depth)
          posthog.capture('scroll_depth_reached', {
            percent: depth,
            path: pathname
          })
        }
      })
    }

    const scrollListener = () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          handleScroll()
          isScrolling = false
        })
        isScrolling = true
      }
    }

    window.addEventListener('scroll', scrollListener, { passive: true })

    // 2. Click tracking for buttons and outbound links
    const clickListener = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      // Outbound Link check
      const aTag = target.closest('a')
      if (aTag && aTag.href) {
        try {
          const url = new URL(aTag.href)
          if (url.hostname !== window.location.hostname) {
            posthog.capture('outbound_link_clicked', {
              link_url: aTag.href,
              link_text: aTag.innerText?.trim() || '',
              path: pathname
            })
          }
        } catch (err) {
          // ignore invalid urls completely
        }
      }

      // Button check
      const buttonTag = target.closest('button')
      if (buttonTag) {
        posthog.capture('button_clicked', {
          button_text: buttonTag.innerText?.trim() || buttonTag.value || '',
          button_id: buttonTag.id || '',
          path: pathname
        })
      }
    }

    window.addEventListener('click', clickListener)

    // 3. Form Submission tracking
    const submitListener = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement
      posthog.capture('form_submitted', {
        form_id: form.id || '',
        form_name: form.name || '',
        form_action: form.action || '',
        path: pathname
      })
    }

    window.addEventListener('submit', submitListener)

    return () => {
      window.removeEventListener('scroll', scrollListener)
      window.removeEventListener('click', clickListener)
      window.removeEventListener('submit', submitListener)
    }
  }, [posthog, pathname])

  return null
}
