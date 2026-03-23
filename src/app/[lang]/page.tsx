import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingWhatsApp from '@/components/shared/FloatingWhatsApp'
import CookieBanner from '@/components/shared/CookieBanner'
import Hero from '@/components/features/Hero'
import StatsCounter from '@/components/features/StatsCounter'
import TestimonialsSlider from '@/components/features/TestimonialsSlider'
import BuyVsInvest from '@/components/features/BuyVsInvest'
import ProjectCard, { type ProjectData } from '@/components/features/ProjectCard'
import { getProjects, type Project } from '@/lib/projects'
import styles from './page.module.css'

function toCardData(p: Project): ProjectData {
  return {
    slug: p.slug,
    name_ar: p.name_ar,
    name_fr: p.name_fr,
    city_ar: p.city_ar,
    city_fr: p.city_fr,
    status: p.status,
    price_from: p.price_from,
    cover_image_url: p.cover_image_url,
  }
}

const locales = ['ar', 'fr'] as const
type Locale = typeof locales[number]

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'ar' ? 'الرئيسية — النزاهة للترقية العقارية' : 'Accueil — ENNAZAHA Promotion Immobilière',
    description: lang === 'ar'
      ? 'اكتشف مشاريعنا السكنية الراقية في منطقة العاصمة الجزائر'
      : 'Découvrez nos résidences haut de gamme dans la région d\'Alger',
  }
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = (locales.includes(lang as Locale) ? lang : 'ar') as Locale
  const isAr = locale === 'ar'
  const featuredTitle = isAr ? 'مشاريعنا المميزة' : 'Nos projets en vedette'
  const allProjectsLabel = isAr ? 'عرض جميع المشاريع' : 'Voir tous les projets'

  // Fetch latest projects from Supabase (show up to 3 on homepage)
  const allProjects = await getProjects()
  const featured = allProjects.slice(0, 3).map(toCardData)

  return (
    <>
      <Navbar lang={locale} />
      <main id="main-content">
        {/* Hero */}
        <Hero lang={locale} />

        {/* Stats counter */}
        <StatsCounter lang={locale} />

        {/* Featured projects */}
        {featured.length > 0 && (
          <section className={styles.featured}>
            <div className="container">
              <h2 className="section-title" style={{ textAlign: 'center' }}>{featuredTitle}</h2>
              <div className={styles.projectGrid}>
                {featured.map((p) => <ProjectCard key={p.slug} project={p} lang={locale} />)}
              </div>
              <div className={styles.allProjects}>
                <a href={`/${locale}/projects`} className="btn-outline">{allProjectsLabel}</a>
              </div>
            </div>
          </section>
        )}

        {/* Buy vs Invest */}
        <BuyVsInvest lang={locale} />

        {/* Testimonials */}
        <TestimonialsSlider lang={locale} />
      </main>
      <Footer lang={locale} />
      <FloatingWhatsApp lang={locale} />
      <CookieBanner lang={locale} />
    </>
  )
}
