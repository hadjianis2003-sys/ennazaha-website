'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

const navLinks: { key: string; ar: string; fr: string; href: string }[] = [
  { key: 'home',     ar: 'الرئيسية',    fr: 'Accueil',    href: '/' },
  { key: 'projects', ar: 'المشاريع',   fr: 'Projets',    href: '/projects' },
  { key: 'offers',   ar: 'العروض',     fr: 'Offres',     href: '/#offers' },
  { key: 'buy',      ar: 'كيف تشتري',  fr: 'Acheter',    href: '/#buy' },
  { key: 'invest',   ar: 'استثمر',     fr: 'Investir',   href: '/#invest' },
  { key: 'about',    ar: 'عنا',        fr: 'À propos',   href: '/#about' },
  { key: 'contact',  ar: 'اتصل بنا',   fr: 'Contact',    href: '/#contact' },
]

interface NavbarProps {
  lang: string
  theme?: 'light' | 'dark' // dark = white text on transparent (for dark hero images)
}

export default function Navbar({ lang, theme = 'light' }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const isAr = lang === 'ar'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleLang = () => {
    const next = isAr ? 'fr' : 'ar'
    // Replace current lang prefix in path
    const rest = pathname.replace(/^\/(ar|fr)/, '') || '/'
    router.push(`/${next}${rest}`)
  }

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${theme === 'dark' && !scrolled ? styles.themeDark : ''}`}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href={`/${lang}`} className={styles.logo} aria-label="ENNAZAHA Home">
          <Image
            src="/logo.png"
            alt="ENNAZAHA Real Estate Investment"
            width={200}
            height={52}
            priority
            style={{ objectFit: 'contain', height: 'auto' }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav} aria-label="Main navigation">
          {navLinks.map((link) => {
            const href = `/${lang}${link.href}`
            const isActive = pathname === href || (link.href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={link.key}
                href={href}
                className={`${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                {isAr ? link.ar : link.fr}
              </Link>
            )
          })}
        </nav>

        <div className={styles.actions}>
          {/* Language toggle */}
          <button
            id="lang-toggle"
            onClick={toggleLang}
            className={styles.langToggle}
            aria-label={`Switch to ${isAr ? 'French' : 'Arabic'}`}
          >
            {isAr ? 'FR' : 'عربي'}
          </button>

          {/* Hamburger */}
          <button
            id="mobile-menu-toggle"
            className={styles.hamburger}
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          {navLinks.map((link) => {
            const href = `/${lang}${link.href}`
            return (
              <Link
                key={link.key}
                href={href}
                className={styles.mobileLink}
                onClick={() => setOpen(false)}
              >
                {isAr ? link.ar : link.fr}
              </Link>
            )
          })}
          <button onClick={toggleLang} className={styles.mobileLang}>
            {isAr ? 'Français' : 'العربية'}
          </button>
        </nav>
      )}
    </nav>
  )
}
