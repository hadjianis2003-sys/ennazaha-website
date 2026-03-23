'use client'

import { useState, useMemo } from 'react'
import styles from './MortgageCalculator.module.css'

const t = {
  ar: {
    title: 'حاسبة القرض العقاري',
    subtitle: 'احسب قسطك الشهري التقريبي',
    price: 'سعر العقار (دج)',
    down: 'الأبور الأولي (دج)',
    years: 'مدة القرض (سنة)',
    rate: 'نسبة الفائدة (%)',
    monthly: 'القسط الشهري التقريبي',
    disclaimer: '⚠️ هذه نتيجة تقريبية للاسترشاد فقط وهي خاضعة لموافقة البنك وشروطه.',
    cta: 'احصل على تمويل دقيق',
  },
  fr: {
    title: 'Calculateur de crédit immobilier',
    subtitle: 'Estimez votre mensualité approximative',
    price: 'Prix du bien (DZD)',
    down: 'Apport initial (DZD)',
    years: 'Durée du crédit (ans)',
    rate: 'Taux d\'intérêt (%)',
    monthly: 'Mensualité estimée',
    disclaimer: '⚠️ Ce résultat est estimatif et soumis à l\'approbation de la banque.',
    cta: 'Obtenir un financement précis',
  },
}

interface Props { lang: string }

export default function MortgageCalculator({ lang }: Props) {
  const c = t[lang as 'ar' | 'fr'] ?? t.ar
  const [price, setPrice] = useState(15_000_000)
  const [down, setDown] = useState(3_000_000)
  const [years, setYears] = useState(20)
  const [rate, setRate] = useState(5.5)

  const monthly = useMemo(() => {
    const principal = price - down
    if (principal <= 0) return 0
    const r = rate / 100 / 12
    const n = years * 12
    if (r === 0) return principal / n
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  }, [price, down, years, rate])

  const fmt = (n: number) => Math.round(n).toLocaleString() + ' DZD'

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className="section-title" style={{ textAlign: 'center' }}>{c.title}</h2>
        <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-8)' }}>{c.subtitle}</p>

        <div className={`glass ${styles.card}`}>
          <div className={styles.inputs}>
            {/* Price */}
            <label className={styles.fieldLabel}>
              {c.price}: <strong>{fmt(price)}</strong>
              <input id="calc-price" type="range" min={5_000_000} max={80_000_000} step={500_000}
                value={price} onChange={(e) => setPrice(+e.target.value)} className={styles.slider} />
            </label>

            {/* Down */}
            <label className={styles.fieldLabel}>
              {c.down}: <strong>{fmt(down)}</strong>
              <input id="calc-down" type="range" min={0} max={price * 0.5} step={500_000}
                value={down} onChange={(e) => setDown(Math.min(+e.target.value, price - 1))} className={styles.slider} />
            </label>

            {/* Years */}
            <label className={styles.fieldLabel}>
              {c.years}: <strong>{years}</strong>
              <input id="calc-years" type="range" min={5} max={30} step={1}
                value={years} onChange={(e) => setYears(+e.target.value)} className={styles.slider} />
            </label>

            {/* Rate */}
            <label className={styles.fieldLabel}>
              {c.rate}: <strong>{rate.toFixed(1)}%</strong>
              <input id="calc-rate" type="range" min={3} max={10} step={0.1}
                value={rate} onChange={(e) => setRate(+e.target.value)} className={styles.slider} />
            </label>
          </div>

          <div className={styles.result}>
            <span className={styles.resultLabel}>{c.monthly}</span>
            <span className={styles.resultValue}>{fmt(monthly)}</span>
            <p className={styles.disclaimer}>{c.disclaimer}</p>
            <a href={`/${lang}/contact`} className="btn-primary" style={{ marginTop: 'var(--space-4)' }}>{c.cta}</a>
          </div>
        </div>
      </div>
    </section>
  )
}
