'use client'

import { useState, useEffect } from 'react'
import styles from './CookieBanner.module.css'

const STORAGE_KEY = 'ennazaha_cookie_consent'

interface Props { lang: string }

export default function CookieBanner({ lang }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
    // Fire GA4 and Pixel consent update here when integrated
  }

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  const isAr = lang === 'ar'

  return (
    <div id="cookie-banner" className={styles.banner} role="dialog" aria-live="polite" aria-label={isAr ? 'إشعار الكوكيز' : 'Cookie Notice'}>
      <p className={styles.text}>
        {isAr
          ? 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك. هل توافق؟'
          : 'Nous utilisons des cookies pour améliorer votre expérience. Acceptez-vous ?'}
      </p>
      <div className={styles.actions}>
        <button id="cookie-accept" className={styles.accept} onClick={accept}>
          {isAr ? 'موافق' : 'Accepter'}
        </button>
        <button id="cookie-reject" className={styles.reject} onClick={reject}>
          {isAr ? 'رفض' : 'Refuser'}
        </button>
      </div>
    </div>
  )
}
