import styles from './BuyVsInvest.module.css'

interface Props { lang: string }

const t = {
  ar: {
    title: 'هل تشتري أم تستثمر؟',
    subtitle: 'مهما كان هدفك، لدينا المشروع المثالي لك.',
    buyTitle: 'اشترِ لتسكن',
    buyPoints: [
      'قسط شهري يناسب ميزانيتك',
      'تسليم في الوقت المحدد',
      'شقق مفتاح في اليد',
      'خبرة أكثر من 15 سنة',
    ],
    buyCta: 'دليل الشراء',
    investTitle: 'استثمر بذكاء',
    investPoints: [
      'عائد إيجاري مضمون',
      'قيمة عقارية متصاعدة',
      'إدارة كاملة للعقار',
      'شفافية تامة في التعامل',
    ],
    investCta: 'صفحة الاستثمار',
  },
  fr: {
    title: 'Acheter ou Investir ?',
    subtitle: 'Quel que soit votre objectif, nous avons le projet idéal pour vous.',
    buyTitle: 'Acheter pour habiter',
    buyPoints: [
      'Mensualités adaptées à votre budget',
      'Livraison dans les délais',
      'Appartements clés en main',
      'Plus de 15 ans d\'expérience',
    ],
    buyCta: 'Guide d\'achat',
    investTitle: 'Investir intelligemment',
    investPoints: [
      'Rendement locatif garanti',
      'Valorisation immobilière croissante',
      'Gestion complète du bien',
      'Totale transparence',
    ],
    investCta: 'Page investissement',
  },
}

export default function BuyVsInvest({ lang }: Props) {
  const c = t[lang as 'ar' | 'fr'] ?? t.ar
  const base = `/${lang}`

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className="section-title" style={{ textAlign: 'center' }}>{c.title}</h2>
        <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto var(--space-12)' }}>{c.subtitle}</p>

        <div className={styles.grid}>
          {/* Buy card */}
          <div className={`${styles.card} ${styles.buy}`}>
            <div className={styles.icon}>🏠</div>
            <h3 className={styles.cardTitle}>{c.buyTitle}</h3>
            <ul className={styles.list}>
              {c.buyPoints.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
            <a href={`${base}/buy`} className="btn-outline">{c.buyCta}</a>
          </div>

          {/* Invest card */}
          <div className={`${styles.card} ${styles.invest}`}>
            <div className={styles.badge}>⭐ Recommandé</div>
            <div className={styles.icon}>📈</div>
            <h3 className={styles.cardTitle}>{c.investTitle}</h3>
            <ul className={styles.list}>
              {c.investPoints.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
            <a href={`${base}/invest`} className="btn-primary">{c.investCta}</a>
          </div>
        </div>
      </div>
    </section>
  )
}
