import Link from 'next/link'
import Image from 'next/image'
import styles from './ProjectCard.module.css'

export interface ProjectData {
  slug: string
  name_ar: string
  name_fr: string
  city_ar: string
  city_fr: string
  status: 'coming_soon' | 'ongoing' | 'ready'
  price_from: number
  cover_image_url: string
}

const STATUS_LABELS = {
  ar: { ready: 'جاهز للاستلام', ongoing: 'قيد الإنشاء', coming_soon: 'قريبا' },
  fr: { ready: 'Livré', ongoing: 'En construction', coming_soon: 'Bientôt' },
}
const STATUS_COLORS: Record<string, string> = {
  ready: '#16A34A',
  ongoing: '#D97706',
  coming_soon: '#2563EB',
}

interface Props { project: ProjectData; lang: string }

export default function ProjectCard({ project, lang }: Props) {
  const isAr = lang === 'ar'
  const name = isAr ? project.name_ar : project.name_fr
  const city = isAr ? project.city_ar : project.city_fr
  const statusLabel = STATUS_LABELS[isAr ? 'ar' : 'fr'][project.status]
  const detailsLabel = isAr ? 'عرض التفاصيل' : 'Voir les détails'
  const fromLabel = isAr ? 'ابتداءً من' : 'À partir de'
  const priceStr = project.price_from.toLocaleString() + ' DZD'
  const hasImage = !!project.cover_image_url

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        {hasImage ? (
          <Image
            src={project.cover_image_url}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={styles.image}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div
            className={styles.image}
            style={{ background: 'linear-gradient(135deg, #1a2d4a, #2a1a0e)', width: '100%', height: '100%' }}
            role="img"
            aria-label={name}
          />
        )}
        <span
          className={styles.badge}
          style={{ background: STATUS_COLORS[project.status] }}
        >
          {statusLabel}
        </span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.city}>📍 {city}</p>
        <p className={styles.price}>
          <span className={styles.priceLabel}>{fromLabel}</span>
          <strong className={styles.priceValue}>{priceStr}</strong>
        </p>
        <Link
          id={`project-card-${project.slug}`}
          href={`/${lang}/projects/${project.slug}`}
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {detailsLabel}
        </Link>
      </div>
    </article>
  )
}
