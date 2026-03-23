'use client'

import styles from './FloatingWhatsApp.module.css'
import { WHATSAPP_NUMBER } from '@/lib/config'

interface Props { lang: string }

export default function FloatingWhatsApp({ lang }: Props) {
  const label = lang === 'ar' ? 'تواصل واتساب' : 'WhatsApp'

  return (
    <a
      id="whatsapp-float-btn"
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.btn}
      aria-label={label}
      title={label}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.52 3.48A11.9 11.9 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.97L0 24l6.19-1.6A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.25-6.21-3.48-8.52zM12 22c-1.84 0-3.64-.49-5.22-1.42l-.37-.22-3.83.99 1.01-3.71-.24-.39A9.94 9.94 0 0 1 2 12C2 6.48 6.48 2 12 2c2.66 0 5.16 1.04 7.04 2.93A9.94 9.94 0 0 1 22 12c0 5.52-4.48 10-10 10zm5.47-7.49c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.38-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.19 5.07 4.47.71.31 1.26.49 1.69.62.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35z"/>
      </svg>
    </a>
  )
}
