'use client'

import { useState } from 'react'
import styles from './LeadCaptureForm.module.css'

interface Props { lang: string; projectSlug?: string }

const t = {
  ar: {
    heading: 'تواصل معنا',
    name: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    message: 'رسالتك',
    submit: 'إرسال',
    sending: 'جاري الإرسال...',
    success: '✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.',
    error: '❌ حدث خطأ. يرجى المحاولة مرة أخرى.',
  },
  fr: {
    heading: 'Nous contacter',
    name: 'Nom complet',
    email: 'Adresse e-mail',
    phone: 'Numéro de téléphone',
    message: 'Votre message',
    submit: 'Envoyer',
    sending: 'Envoi en cours...',
    success: '✅ Votre message a bien été envoyé! Nous vous contacterons bientôt.',
    error: '❌ Une erreur s\'est produite. Veuillez réessayer.',
  },
}

export default function LeadCaptureForm({ lang, projectSlug }: Props) {
  const c = t[lang as 'ar' | 'fr'] ?? t.ar
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/leads/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, projectContext: projectSlug ?? '' }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') return <div className={styles.success}>{c.success}</div>

  return (
    <form id={`lead-form-${projectSlug ?? 'contact'}`} onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.heading}>{c.heading}</h3>
      <div className={styles.row}>
        <label className={styles.fieldLabel}>
          {c.name}
          <input id="lead-name" type="text" required value={form.name} onChange={set('name')} placeholder="Ahmed Benali" className={styles.input} />
        </label>
        <label className={styles.fieldLabel}>
          {c.phone}
          <input id="lead-phone" type="tel" required value={form.phone} onChange={set('phone')} placeholder="+213 5XX XXX XXX" className={styles.input} />
        </label>
      </div>
      <label className={styles.fieldLabel}>
        {c.email}
        <input id="lead-email" type="email" required value={form.email} onChange={set('email')} placeholder="ahmed@example.com" className={styles.input} />
      </label>
      <label className={styles.fieldLabel}>
        {c.message}
        <textarea id="lead-message" rows={4} value={form.message} onChange={set('message')} className={styles.input} />
      </label>
      {status === 'error' && <p className={styles.error}>{c.error}</p>}
      <button id="lead-submit" type="submit" className="btn-primary" disabled={status === 'sending'} style={{ width: '100%', justifyContent: 'center' }}>
        {status === 'sending' ? c.sending : c.submit}
      </button>
    </form>
  )
}
