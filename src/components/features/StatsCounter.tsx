'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './StatsCounter.module.css'

interface Stat { labelAr: string; labelFr: string; value: number; suffix?: string }

const stats: Stat[] = [
  { labelAr: 'سنة خبرة',          labelFr: 'ans d\'expérience', value: 15, suffix: '+' },
  { labelAr: 'شقة تم تسليمها',     labelFr: 'appartements livrés', value: 2400, suffix: '+' },
  { labelAr: 'مشروع منجز',         labelFr: 'projets réalisés', value: 18, suffix: '' },
  { labelAr: 'عائلة سعيدة',        labelFr: 'familles heureuses', value: 1800, suffix: '+' },
]

function useCounter(target: number, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    const dur = 1800
    const step = Math.ceil(target / (dur / 16))
    const timer = setInterval(() => {
      setCount((c) => {
        if (c + step >= target) { clearInterval(timer); return target }
        return c + step
      })
    }, 16)
    return () => clearInterval(timer)
  }, [active, target])
  return count
}

function StatCard({ stat, lang, active }: { stat: Stat; lang: string; active: boolean }) {
  const count = useCounter(stat.value, active)
  return (
    <div className={styles.card}>
      <span className={styles.number}>{count.toLocaleString()}{stat.suffix}</span>
      <span className={styles.label}>{lang === 'ar' ? stat.labelAr : stat.labelFr}</span>
    </div>
  )
}

interface Props { lang: string }

export default function StatsCounter({ lang }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setActive(true); observer.disconnect() }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className={styles.section} aria-label="Company statistics">
      <div className={`container ${styles.grid}`}>
        {stats.map((s) => <StatCard key={s.labelFr} stat={s} lang={lang} active={active} />)}
      </div>
    </section>
  )
}
