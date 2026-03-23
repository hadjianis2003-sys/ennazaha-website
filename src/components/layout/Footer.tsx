import Link from 'next/link'
import styles from './Footer.module.css'
import { WHATSAPP_NUMBER } from '@/lib/config'

const t = {
  ar: {
    desc: 'مطور عقاري رائد في منطقة العاصمة. نبني الأحلام بجودة استثنائية.',
    links: 'روابط مفيدة',
    projects: 'المشاريع',
    offers: 'العروض',
    buy: 'كيف تشتري',
    invest: 'استثمر معنا',
    blog: 'المدونة',
    faq: 'الأسئلة الشائعة',
    contact: 'تواصل معنا',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    rights: '© 2026 النزاهة للترقية العقارية. جميع الحقوق محفوظة.',
  },
  fr: {
    desc: 'Promoteur immobilier de référence dans la région d\'Alger. Nous construisons vos rêves.',
    links: 'Liens utiles',
    projects: 'Projets',
    offers: 'Offres',
    buy: 'Acheter',
    invest: 'Investir',
    blog: 'Blog',
    faq: 'FAQ',
    contact: 'Contact',
    phone: 'Téléphone',
    email: 'E-mail',
    rights: '© 2026 ENNAZAHA Promotion Immobilière. Tous droits réservés.',
  },
}

interface FooterProps { lang: string }

export default function Footer({ lang }: FooterProps) {
  const c = lang === 'ar' ? t.ar : t.fr
  const base = `/${lang}`

  return (
    <footer id="contact" className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        {/* Brand */}
        <div>
          <p className={styles.brand}>النزاهة | ENNAZAHA</p>
          <p className={styles.desc}>{c.desc}</p>
          <div className={styles.socials}>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp">WA</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">FB</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">IG</a>
          </div>
        </div>

        {/* Nav links */}
        <div>
          <p className={styles.colTitle}>{c.links}</p>
          <ul className={styles.navList}>
            <li><Link href={`${base}/projects`} className={styles.navLink}>{c.projects}</Link></li>
            <li><Link href={`${base}/#offers`} className={styles.navLink}>{c.offers}</Link></li>
            <li><Link href={`${base}/#buy`} className={styles.navLink}>{c.buy}</Link></li>
            <li><Link href={`${base}/#invest`} className={styles.navLink}>{c.invest}</Link></li>
            <li><Link href={`${base}/#blog`} className={styles.navLink}>{c.blog}</Link></li>
            <li><Link href={`${base}/faq`} className={styles.navLink}>{c.faq}</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className={styles.colTitle}>{c.contact}</p>
          <p className={styles.infoText}><span className={styles.label}>{c.phone}:</span> +213 XXX XXX XXX</p>
          <p className={styles.infoText}><span className={styles.label}>{c.email}:</span> contact@ennazaha.dz</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>{c.rights}</p>
      </div>
    </footer>
  )
}
