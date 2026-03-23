'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import styles from './FilterBar.module.css'

const t = {
  ar: {
    title: 'تصفية المشاريع',
    city: 'المدينة / المنطقة',
    cityPlaceholder: 'الكل',
    status: 'الحالة',
    statusAll: 'الكل',
    statusReady: 'جاهز للاستلام',
    statusOngoing: 'قيد الإنشاء',
    statusNew: 'جديد',
    type: 'النوع',
    typeAll: 'الكل',
    typeApartment: 'شقة',
    typeCommercial: 'تجاري',
    reset: 'إعادة تعيين',
    apply: 'تطبيق',
  },
  fr: {
    title: 'Filtrer les projets',
    city: 'Ville / Quartier',
    cityPlaceholder: 'Toutes',
    status: 'Statut',
    statusAll: 'Tous',
    statusReady: 'Livré',
    statusOngoing: 'En construction',
    statusNew: 'Nouveau',
    type: 'Type',
    typeAll: 'Tous',
    typeApartment: 'Appartement',
    typeCommercial: 'Commercial',
    reset: 'Réinitialiser',
    apply: 'Appliquer',
  },
}

export default function FilterBar({ lang }: { lang: string }) {
  const c = t[lang as 'ar' | 'fr'] ?? t.ar
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const update = (key: string, val: string) => {
    const params = new URLSearchParams(sp.toString())
    if (val) { params.set(key, val) } else { params.delete(key) }
    router.push(`${pathname}?${params.toString()}`)
  }

  const reset = () => router.push(pathname)

  return (
    <div className={`glass ${styles.bar}`} role="search" aria-label={c.title}>
      <span className={styles.label}>{c.title}</span>

      <select
        id="filter-city"
        className={styles.select}
        value={sp.get('city') ?? ''}
        onChange={(e) => update('city', e.target.value)}
        aria-label={c.city}
      >
        <option value="">{c.city}: {c.cityPlaceholder}</option>
        <option value="Chéraga">Chéraga</option>
        <option value="Draria">Draria</option>
        <option value="Bir Mourad Raïs">Bir Mourad Raïs</option>
        <option value="Hydra">Hydra</option>
        <option value="Bab Ezzouar">Bab Ezzouar</option>
      </select>

      <select
        id="filter-status"
        className={styles.select}
        value={sp.get('status') ?? ''}
        onChange={(e) => update('status', e.target.value)}
        aria-label={c.status}
      >
        <option value="">{c.status}: {c.statusAll}</option>
        <option value="ready">{c.statusReady}</option>
        <option value="ongoing">{c.statusOngoing}</option>
        <option value="new">{c.statusNew}</option>
      </select>

      <select
        id="filter-type"
        className={styles.select}
        value={sp.get('type') ?? ''}
        onChange={(e) => update('type', e.target.value)}
        aria-label={c.type}
      >
        <option value="">{c.type}: {c.typeAll}</option>
        <option value="apartment">{c.typeApartment}</option>
        <option value="commercial">{c.typeCommercial}</option>
      </select>

      <button id="filter-reset" onClick={reset} className={styles.resetBtn}>{c.reset}</button>
    </div>
  )
}
