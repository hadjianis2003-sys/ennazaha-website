import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingWhatsApp from '@/components/shared/FloatingWhatsApp'
import LeadCaptureForm from '@/components/features/LeadCaptureForm'
import MortgageCalculator from '@/components/features/MortgageCalculator'
import { getProjectBySlug, getProjectSlugs } from '@/lib/projects'
import styles from './page.module.css'

type Locale = 'ar' | 'fr'
const locales = ['ar', 'fr'] as const

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Project not found' }
  return {
    title: lang === 'ar' ? `${project.name_ar} | النزاهة` : `${project.name_fr} | ENNAZAHA`,
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const locale = (locales.includes(lang as Locale) ? lang : 'ar') as Locale
  const isAr = locale === 'ar'

  const project = await getProjectBySlug(slug)
  if (!project) return notFound()

  const statusLabels = {
    ar: { ready: 'جاهز', ongoing: 'قيد الإنشاء', coming_soon: 'قريبا' },
    fr: { ready: 'Livré', ongoing: 'En cours', coming_soon: 'Bientôt' },
  }
  const statusLabel = statusLabels[isAr ? 'ar' : 'fr'][project.status]
  const apartmentStatusLabels = {
    ar: { available: 'متاح', reserved: 'محجوز', sold: 'مباع' },
    fr: { available: 'Disponible', reserved: 'Réservé', sold: 'Vendu' },
  }

  const images = project.project_images?.sort((a, b) => a.sort_order - b.sort_order) ?? []

  return (
    <>
      <Navbar lang={locale} theme="dark" />
      <main id="main-content">
        {/* Hero / Gallery */}
        <section className={styles.hero} aria-label={isAr ? project.name_ar : project.name_fr}>
          {project.cover_image_url ? (
            <>
              <Image
                src={project.cover_image_url}
                alt={isAr ? project.name_ar : project.name_fr}
                fill
                priority
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.heroOverlay} aria-hidden="true" />
            </>
          ) : (
            <div className={styles.galleryPlaceholder} aria-hidden="true" />
          )}
          <div className={`container ${styles.heroContent}`}>
            <span className={styles.statusBadge}>{statusLabel}</span>
            <h1 className={styles.projectName}>{isAr ? project.name_ar : project.name_fr}</h1>
            <p className={styles.projectCity}>📍 {isAr ? project.city_ar : project.city_fr}</p>
          </div>
        </section>

        <div className={`container ${styles.body}`}>
          {/* Description */}
          <section aria-label={isAr ? 'وصف المشروع' : 'Description du projet'}>
            <h2 className="section-title">{isAr ? 'عن المشروع' : 'À propos du projet'}</h2>
            <p className={styles.desc}>{isAr ? project.about_ar : project.about_fr}</p>
          </section>

          {/* Image gallery */}
          {images.length > 0 && (
            <section aria-label={isAr ? 'صور المشروع' : 'Photos du projet'}>
              <h2 className="section-title">{isAr ? 'صور المشروع' : 'Galerie photos'}</h2>
              <div className={styles.gallery}>
                {images.map((img) => (
                  <div key={img.id} className={styles.galleryItem}>
                    <Image
                      src={img.image_url}
                      alt={isAr ? project.name_ar : project.name_fr}
                      width={600}
                      height={400}
                      style={{ objectFit: 'cover', borderRadius: '0.75rem', width: '100%', height: 'auto' }}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Apartment types table */}
          {project.apartment_types && project.apartment_types.length > 0 && (
            <section aria-label={isAr ? 'أنواع الشقق' : "Types d'appartements"}>
              <h2 className="section-title">{isAr ? 'أنواع الشقق المتاحة' : "Types d'appartements disponibles"}</h2>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{isAr ? 'النوع' : 'Type'}</th>
                      <th>{isAr ? 'المساحة (م²)' : 'Surface (m²)'}</th>
                      <th>{isAr ? 'الحالة' : 'Statut'}</th>
                      <th>{isAr ? 'السعر' : 'Prix'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.apartment_types.map((apt) => (
                      <tr key={apt.id} className={apt.status === 'reserved' ? styles.reserved : ''}>
                        <td><strong>{isAr ? apt.type_ar : apt.type_fr}</strong></td>
                        <td>{apt.area_sqm} m²</td>
                        <td>{apartmentStatusLabels[isAr ? 'ar' : 'fr'][apt.status]}</td>
                        <td>{apt.price_dzd.toLocaleString()} DZD</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Map */}
          {project.map_embed_url && (
            <section aria-label={isAr ? 'الموقع' : 'Localisation'}>
              <h2 className="section-title">{isAr ? 'الموقع' : 'Localisation'}</h2>
              <div className={styles.mapWrapper}>
                <iframe
                  src={project.map_embed_url}
                  width="100%"
                  height="400"
                  style={{ border: 0, borderRadius: '0.75rem' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={isAr ? 'خريطة الموقع' : 'Carte du projet'}
                />
              </div>
            </section>
          )}

          {/* Brochure download */}
          {project.brochure_url && (
            <div className={styles.brochureRow}>
              <p>{isAr ? 'تحميل الكتيب التعريفي' : 'Télécharger la brochure'}</p>
              <a
                href={project.brochure_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                id={`brochure-${slug}`}
              >
                {isAr ? '📄 تحميل الكتيب (PDF)' : '📄 Télécharger la brochure (PDF)'}
              </a>
            </div>
          )}

          {/* Lead capture form */}
          <LeadCaptureForm lang={locale} projectSlug={slug} />
        </div>

        {/* Mortgage Calculator */}
        <MortgageCalculator lang={locale} />
      </main>
      <Footer lang={locale} />
      <FloatingWhatsApp lang={locale} />
    </>
  )
}
