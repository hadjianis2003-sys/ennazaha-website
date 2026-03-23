'use client'

import { Suspense, lazy, useState } from 'react'
import styles from './SplineScene.module.css'

// Lazy-load the heavy runtime (~500KB) — critical for performance
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  /** Full Spline scene URL from the export panel */
  scene: string
  /** Optional callback once the scene is ready */
  onLoad?: (app: any) => void
  className?: string
}

/**
 * SplineScene — Production-ready lazy-loaded Spline wrapper.
 *
 * RULES (per skill guide):
 *  ✓ Must be 'use client' — Spline uses browser APIs
 *  ✓ Parent container MUST have explicit width + height
 *  ✓ Lazy-loaded to avoid blocking initial render
 *  ✓ Shows spinner while loading, fades in on load
 */
export default function SplineScene({ scene, onLoad, className }: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false)

  const handleLoad = (app: any) => {
    setLoaded(true)
    onLoad?.(app)
  }

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`}>
      {/* Loading spinner — visible until scene is ready */}
      {!loaded && (
        <div className={styles.spinner} aria-label="Loading 3D scene" aria-live="polite">
          <span className={styles.ring} />
        </div>
      )}

      <Suspense fallback={null}>
        <Spline
          scene={scene}
          onLoad={handleLoad}
          style={{
            width: '100%',
            height: '100%',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.7s ease',
          }}
        />
      </Suspense>
    </div>
  )
}
