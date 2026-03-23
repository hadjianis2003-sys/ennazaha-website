'use client'

import { useState } from 'react'
import styles from './TestimonialsSlider.module.css'

interface Testimonial {
  nameAr: string; nameFr: string
  residenceAr: string; residenceFr: string
  rating: number
  textAr: string; textFr: string
}

// Demo data — replaced by CMS in production (T012)
const testimonials: Testimonial[] = [
  {
    nameAr: 'كريم بن عمر', nameFr: 'Karim Ben Omar',
    residenceAr: 'مقيم في الشراقة', residenceFr: 'Résident à Chéraga',
    rating: 5,
    textAr: 'شققهم راقية جداً والتشطيبات ممتازة. خدمة ما بعد البيع في القمة.',
    textFr: 'Des appartements haut de gamme avec des finitions excellentes. Service après-vente au top.',
  },
  {
    nameAr: 'فاطمة الزهراء', nameFr: 'Fatima Zahra',
    residenceAr: 'مقيمة في الدار البيضاء', residenceFr: 'Résidente à Dar El Beida',
    rating: 5,
    textAr: 'من أفضل القرارات في حياتي. فريق عمل محترم ومتعاون من البداية للنهاية.',
    textFr: 'L\'une des meilleures décisions de ma vie. Une équipe respectueuse et coopérative du début à la fin.',
  },
  {
    nameAr: 'عمر بلعيد', nameFr: 'Omar Belaid',
    residenceAr: 'مستثمر / بئر توتة', residenceFr: 'Investisseur / Bir Touta',
    rating: 5,
    textAr: 'استثمرت معهم وكانت النتائج أفضل مما توقعت. محترفون حقيقيون.',
    textFr: 'J\'ai investi avec eux et les résultats ont dépassé mes attentes. De vrais professionnels.',
  },
]

interface Props { lang: string }

export default function TestimonialsSlider({ lang }: Props) {
  const [idx, setIdx] = useState(0)
  const isAr = lang === 'ar'
  const current = testimonials[idx]
  const label = isAr ? 'آراء عملائنا' : 'Témoignages clients'
  const prev = isAr ? 'السابق' : 'Précédent'
  const next = isAr ? 'التالي' : 'Suivant'

  return (
    <section className={styles.section} aria-label={label}>
      <div className="container">
        <h2 className={`section-title ${styles.heading}`}>{label}</h2>
        <div className={`glass ${styles.card}`}>
          <div className={styles.stars} aria-label={`${current.rating} étoiles`}>
            {'★'.repeat(current.rating)}{'☆'.repeat(5 - current.rating)}
          </div>
          <blockquote className={styles.quote}>
            <p>{isAr ? current.textAr : current.textFr}</p>
          </blockquote>
          <div className={styles.meta}>
            <p className={styles.name}>{isAr ? current.nameAr : current.nameFr}</p>
            <p className={styles.residence}>{isAr ? current.residenceAr : current.residenceFr}</p>
          </div>
        </div>

        <div className={styles.controls}>
          <button
            id="testimonial-prev"
            onClick={() => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}
            className={styles.btn}
            aria-label={prev}
          >‹</button>
          <div className={styles.dots}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                id={`testimonial-dot-${i}`}
                onClick={() => setIdx(i)}
                className={`${styles.dot} ${i === idx ? styles.active : ''}`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
          <button
            id="testimonial-next"
            onClick={() => setIdx((i) => (i + 1) % testimonials.length)}
            className={styles.btn}
            aria-label={next}
          >›</button>
        </div>
      </div>
    </section>
  )
}
