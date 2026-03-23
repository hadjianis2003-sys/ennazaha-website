import { Suspense } from 'react'
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingWhatsApp from '@/components/shared/FloatingWhatsApp'
import FilterBar from '@/components/features/FilterBar'
import ProjectCard, { type ProjectData } from '@/components/features/ProjectCard'
import { getProjects, type Project } from '@/lib/projects'
import styles from './page.module.css'

type Locale = 'ar' | 'fr'

/** Map Supabase project → ProjectCard props */
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

function filterProjects(projects: ProjectData[], city?: string, status?: string): ProjectData[] {
  return projects.filter((p) => {
    if (city && p.city_fr !== city && p.city_ar !== city) return false
    if (status && p.status !== status) return false
    return true
  })
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'ar' ? 'المشاريع | النزاهة' : 'Projets | ENNAZAHA',
    description: lang === 'ar' ? 'استكشف جميع مشاريع النزاهة العقارية' : 'Explorez tous les projets immobiliers ENNAZAHA',
  }
}

export default async function ProjectsPage({ params, searchParams }: {
  params: Promise<{ lang: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const { lang } = await params
  const sp = await searchParams
  const locale = (lang === 'fr' ? 'fr' : 'ar') as Locale
  const isAr = locale === 'ar'

  // Fetch from Supabase
  const allProjects = await getProjects()
  const cards = allProjects.map(toCardData)
  const filtered = filterProjects(cards, sp.city, sp.status)

  const emptyAr = '🔍 لا توجد نتائج مطابقة. جرّب تعديل الفلاتر أو تواصل مع فريقنا.'
  const emptyFr = '🔍 Aucun résultat. Essayez de modifier vos filtres ou contactez notre équipe.'

  return (
    <>
      <Navbar lang={locale} />
      <main id="main-content" style={{ paddingBlock: 'calc(var(--space-24) + 60px) var(--space-24)' }}>
        <div className="container">
          <h1 className="section-title">{isAr ? 'مشاريعنا العقارية' : 'Nos projets immobiliers'}</h1>

          {/* Filter bar */}
          <Suspense fallback={<div style={{height:'60px'}} />}>
            <FilterBar lang={locale} />
          </Suspense>

          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>{isAr ? emptyAr : emptyFr}</p>
              <a href={`/${locale}/contact`} className="btn-primary" style={{ marginTop: 'var(--space-4)' }}>
                {isAr ? 'تواصل معنا' : 'Nous contacter'}
              </a>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((p) => <ProjectCard key={p.slug} project={p} lang={locale} />)}
            </div>
          )}
        </div>
      </main>
      <Footer lang={locale} />
      <FloatingWhatsApp lang={locale} />
    </>
  )
}
