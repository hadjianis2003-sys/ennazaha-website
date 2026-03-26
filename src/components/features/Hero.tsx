'use client'

import dynamic from 'next/dynamic'
import styles from './Hero.module.css'
import { useFeatureFlagVariantKey, usePostHog } from 'posthog-js/react'

const SCENE_URL = 'https://prod.spline.design/LwWMFEGfksM2eE09/scene.splinecode'

// Lazy + no-SSR: Spline uses browser APIs
const SplineScene = dynamic(() => import('@/components/shared/SplineScene'), {
  ssr: false,
  loading: () => null,
})

interface HeroProps { lang: string }

const t = {
  ar: {
    tag: '🏆 أفضل مطور عقاري بالعاصمة',
    title: 'عيش في المكان\nالذي تستحقه',
    subtitle: 'مشاريع سكنية راقية تجمع بين الأناقة والموقع المتميز\n— من قلب المدينة إلى ضواحيها الهادئة.',
    cta: 'استكشف مشاريعنا',
    ctaSub: 'تواصل معنا',
  },
  fr: {
    tag: '🏆 Meilleur Promoteur de la Capitale',
    title: 'Vivez là où\nvous le méritez',
    subtitle: 'Des résidences haut de gamme alliant élégance\nDu cœur de la ville à sa banlieue.',
    cta: 'Découvrir nos projets',
    ctaSub: 'Nous contacter',
  },
}

export default function Hero({ lang }: HeroProps) {
  const c = t[lang as 'ar' | 'fr'] ?? t.ar
  const isAr = lang === 'ar'
  const posthog = usePostHog()
  
  // A/B test logic
  const variant = useFeatureFlagVariantKey('hero-copy-test')
  
  // Define variants
  const cTest = {
    ...c,
    title: isAr ? 'منزل أحلامك\nأصبح حقيقة الآن' : 'La maison de vos\nrêves est réalité',
    cta: isAr ? 'احجز شقتك اليوم' : 'Réservez aujourd\'hui',
  }
  
  const displayContent = variant === 'test' ? cTest : c
  
  const handleCtaClick = () => {
    posthog?.capture('hero_cta_clicked', {
      variant: variant || 'control',
      $feature_hero_copy_test: variant || 'control'
    })
  }

  return (
    <section
      className={styles.hero}
      aria-label={displayContent.title.replace(/\n/g, ' ')}
    >
      {/* ── Full-screen 3D background ── hidden on mobile */}
      <div className={styles.sceneBackground} aria-hidden="true">
        <SplineScene scene={SCENE_URL} />
        {/* Covers the 'Built with Spline' badge + acts as a bilingual CTA pill */}
        <div className={styles.badgeCover}>
          {isAr ? 'ابدأ الآن' : 'Commencez maintenant'}
        </div>
      </div>

      {/* ── Fallback gradient for mobile (when 3D is hidden) ── */}
      <div className={styles.mobileBg} aria-hidden="true" />

      {/* ── Text content ─ aligned to logical start (left LTR / right RTL) ── */}
      <div className="container" style={{ display: 'flex' }}>
        <div
          className={`${styles.content} ${isAr ? styles.contentRtl : ''}`}
          style={isAr ? { marginLeft: 'auto', marginRight: 0 } : { marginLeft: 0 }}
        >
          {/* <span className={styles.tag}>{c.tag}</span> */}
          <h1 className={styles.title}>{displayContent.title}</h1>
          <p className={styles.subtitle}>{displayContent.subtitle}</p>
          <div className={styles.ctas}>
            <a href={`/${lang}/projects`} className="btn-primary" onClick={handleCtaClick}>{displayContent.cta}</a>
            <a href={`/${lang}/contact`} className="btn-outline">{displayContent.ctaSub}</a>
          </div>
        </div>
      </div>
    </section>
  )
}
