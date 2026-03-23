'use client'

import { useState } from 'react'
import styles from './WaitlistForm.module.css'

const t = {
  ar: {
    heading: 'كن أول من يعلم',
    subtitle: 'لا يوجد مشروع في منطقتك حالياً؟ سجّل بريدك وسنُخطرك بأول إطلاق!',
    name: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    city: 'المدينة المفضلة',
    cityDefault: 'اختر منطقة',
    submit: 'انضم إلى قائمة الانتظار',
    sending: 'جاري التسجيل...',
    success: '🎉 تم تسجيلك بنجاح! ستكون أول من نُخطره.',
    error: '❌ حدث خطأ. يرجى المحاولة مرة أخرى.',
  },
  fr: {
    heading: 'Soyez le premier informé',
    subtitle: 'Pas de projet dans votre quartier ? Inscrivez-vous et on vous préviendra dès le lancement !',
    name: 'Nom complet',
    email: 'Adresse e-mail',
    phone: 'Numéro de téléphone',
    city: 'Ville souhaitée',
    cityDefault: 'Choisir un quartier',
    submit: 'Rejoindre la liste d\'attente',
    sending: 'Inscription en cours...',
    success: '🎉 Inscription réussie ! Vous serez le premier averti.',
    error: '❌ Une erreur s\'est produite. Veuillez réessayer.',
  },
}

const CITIES = ['Chéraga', 'Draria', 'Hydra', 'Bir Mourad Raïs', 'Bab Ezzouar', 'Ben Aknoun', 'Kouba']

interface Props { lang: string }

export default function WaitlistForm({ lang }: Props) {
  const c = t[lang as 'ar' | 'fr'] ?? t.ar
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/leads/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch { setStatus('error') }
  }

  if (status === 'success') return <div className={styles.success}>{c.success}</div>

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={`glass ${styles.card}`}>
          <div className={styles.info}>
            <h2>{c.heading}</h2>
            <p>{c.subtitle}</p>
          </div>
          <form id="waitlist-form" onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <label className={styles.label}>
                {c.name}
                <input id="waitlist-name" type="text" required value={form.name} onChange={set('name')} className={styles.input} />
              </label>
              <label className={styles.label}>
                {c.phone}
                <input id="waitlist-phone" type="tel" required value={form.phone} onChange={set('phone')} className={styles.input} />
              </label>
            </div>
            <label className={styles.label}>
              {c.email}
              <input id="waitlist-email" type="email" required value={form.email} onChange={set('email')} className={styles.input} />
            </label>
            <label className={styles.label}>
              {c.city}
              <select id="waitlist-city" required value={form.city} onChange={set('city')} className={styles.input}>
                <option value="">{c.cityDefault}</option>
                {CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
            </label>
            {status === 'error' && <p className={styles.error}>{c.error}</p>}
            <button id="waitlist-submit" type="submit" className="btn-primary" disabled={status === 'sending'} style={{ width: '100%', justifyContent: 'center' }}>
              {status === 'sending' ? c.sending : c.submit}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
