import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BrandsSlider from '../components/BrandsSlider';
import ProductCard from '../components/ProductCard';
import BundleCard from '../components/BundleCard';
import { ProductsDB, BundlesDB, SlidersDB } from '../db/database';
import { ArrowLeft, Award, Clock, Shield, Star } from 'lucide-react';

// Removed static slides

const stats = [
  { icon: <Award size={28} />, value: '+15', label: 'سنة خبرة' },
  { icon: <Star size={28} />, value: '+6', label: 'علامة عالمية' },
  { icon: <Shield size={28} />, value: '100%', label: 'ضمان الجودة' },
  { icon: <Clock size={28} />, value: '7/7', label: 'خدمة العملاء' },
];

const Home = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [slides, setSlides] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredBundles, setFeaturedBundles] = useState([]);

  useEffect(() => {
    setSlides(SlidersDB.getActive());
    setFeaturedProducts(ProductsDB.getActive().slice(0, 4));
    setFeaturedBundles(BundlesDB.getAll().slice(0, 2));
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(p => (p + 1) % slides.length);
        setAnimating(false);
      }, 400);
    }, 5500);
    return () => clearInterval(t);
  }, [slides.length]);

  const goTo = (i) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(i);
      setAnimating(false);
    }, 300);
  };

  return (
    <div style={{ background: 'var(--black)' }}>

      {/* ─── HERO SLIDER ─── */}
      <section style={styles.heroSection}>
        {slides.map((slide, i) => {
          // Parse title logic (split first word from rest or use simple styling)
          const words = slide.title.split(' ');
          const titleGold = words.length > 1 ? words.pop() : '';
          const titleText = words.join(' ');

          return (
          <div
            key={slide.id}
            style={{
              ...styles.slide,
              backgroundImage: `url("${slide.image}")`,
              opacity: i === current ? 1 : 0,
              visibility: i === current ? 'visible' : 'hidden',
            }}
          >
            <div style={styles.slideOverlay} />

            <div className="container" style={styles.slideContent}>
              <div style={{
                ...styles.contentInner,
                opacity: !animating && i === current ? 1 : 0,
                transform: !animating && i === current ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)',
              }}>
                <h1 style={styles.heroTitle}>
                  {titleText}{' '}
                  <span style={styles.heroTitleGold}>{titleGold || slide.title}</span>
                </h1>
                <p style={styles.heroSub}>{slide.subtitle}</p>
                <div style={styles.heroBtns}>
                  <Link to={slide.link || '/shop'} className="btn btn-gold btn-lg">
                    تسوق الآن
                    <ArrowLeft size={18} />
                  </Link>
                  <Link to="/bundles" className="btn btn-outline-gold btn-lg">
                    العروض المجمعة
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )})}

        {/* Slide indicators */}
        <div style={styles.indicators}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                ...styles.dot,
                ...(i === current ? styles.dotActive : {}),
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div style={styles.scrollHint}>
          <div style={styles.scrollLine} />
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section style={styles.statsBar}>
        <div className="container">
          <div style={styles.statsGrid}>
            {stats.map((stat, i) => (
              <div key={i} style={styles.statItem}>
                <div style={styles.statIcon}>{stat.icon}</div>
                <div>
                  <p style={styles.statValue}>{stat.value}</p>
                  <p style={styles.statLabel}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="section" style={{ background: 'var(--black)' }}>
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">وصل حديثاً</span>
            <h2 className="section-title">أحدث <span>المنتجات</span></h2>
            <div className="gold-divider" />
            <p className="section-subtitle">اختر من تشكيلة واسعة من القطع الفردية من أفضل الماركات العالمية وكوّن مجموعتك الخاصة</p>
          </div>
          <div className="grid grid-4">
            {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/shop" className="btn btn-dark btn-lg">
              عرض كل المنتجات
              <ArrowLeft size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section style={styles.ctaBanner}>
        <div style={styles.ctaGlow} />
        <div className="container" style={styles.ctaContent}>
          <div>
            <h2 style={styles.ctaTitle}>كوّن مجموعتك الخاصة</h2>
            <p style={styles.ctaText}>اختر الأصناف المختلفة التي تريدها واحصل على سعرك الخاص مباشرة دون الحاجة للمجيء للمحل</p>
          </div>
          <Link to="/shop" className="btn btn-gold btn-lg" style={{ flexShrink: 0 }}>
            ابدأ الاختيار الآن
          </Link>
        </div>
      </section>

      {/* ─── BUNDLES ─── */}
      <section className="section" style={{ background: 'var(--black-mid)' }}>
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">توفير أكثر</span>
            <h2 className="section-title">العروض <span>المجمعة</span></h2>
            <div className="gold-divider" />
            <p className="section-subtitle">باقات متكاملة بأسعار خاصة لتجهيز حمامك بالكامل من الصفر بكل يسر وسهولة</p>
          </div>
          <div className="grid grid-2">
            {featuredBundles.map(b => <BundleCard key={b.id} bundle={b} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/bundles" className="btn btn-gold btn-lg">
              عرض كل الباقات
              <ArrowLeft size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BRANDS ─── */}
      <BrandsSlider />
    </div>
  );
};

const styles = {
  heroSection: {
    position: 'relative',
    height: '92vh',
    minHeight: '600px',
    overflow: 'hidden',
  },
  slide: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    transition: 'opacity 0.8s ease',
  },
  slideOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.2) 100%)',
  },
  slideContent: {
    position: 'relative',
    zIndex: 1,
  },
  contentInner: {
    maxWidth: '620px',
  },
  heroTag: {
    display: 'inline-block',
    padding: '6px 18px',
    background: 'rgba(201,169,110,0.15)',
    border: '1px solid rgba(201,169,110,0.4)',
    borderRadius: '50px',
    color: 'var(--gold)',
    fontSize: '0.8rem',
    fontWeight: '700',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '20px',
    fontFamily: 'var(--font-body)',
    backdropFilter: 'blur(8px)',
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    fontWeight: '900',
    color: 'var(--white)',
    lineHeight: 1.15,
    marginBottom: '20px',
    fontFamily: 'var(--font-heading)',
  },
  heroTitleGold: {
    background: 'var(--grad-gold)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heroSub: {
    fontSize: '1.1rem',
    color: 'var(--silver)',
    lineHeight: 1.8,
    marginBottom: '36px',
    maxWidth: '520px',
  },
  heroBtns: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  indicators: {
    position: 'absolute',
    bottom: '36px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '10px',
    zIndex: 3,
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.35)',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--ease)',
    padding: 0,
  },
  dotActive: {
    background: 'var(--gold)',
    width: '28px',
    borderRadius: '4px',
    boxShadow: 'var(--shadow-gold)',
  },
  scrollHint: {
    position: 'absolute',
    bottom: '30px',
    right: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    zIndex: 3,
  },
  scrollLine: {
    width: '1px',
    height: '50px',
    background: 'linear-gradient(to bottom, var(--gold), transparent)',
    animation: 'float 2s ease-in-out infinite',
  },
  statsBar: {
    background: 'linear-gradient(135deg, var(--black-mid), var(--black-card))',
    borderTop: '1px solid rgba(201,169,110,0.15)',
    borderBottom: '1px solid rgba(201,169,110,0.15)',
    padding: '32px 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 24px',
    borderRight: '1px solid rgba(255,255,255,0.06)',
  },
  statIcon: {
    color: 'var(--gold)',
    flexShrink: 0,
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: '900',
    color: 'var(--white)',
    fontFamily: 'var(--font-heading)',
    lineHeight: 1.1,
    background: 'var(--grad-gold)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  statLabel: {
    fontSize: '0.82rem',
    color: 'var(--silver-dark)',
    marginTop: '2px',
    fontWeight: '600',
  },
  ctaBanner: {
    position: 'relative',
    background: 'linear-gradient(135deg, var(--black-card) 0%, var(--black-soft) 100%)',
    border: '1px solid rgba(201,169,110,0.2)',
    borderRadius: 0,
    padding: '60px 0',
    overflow: 'hidden',
  },
  ctaGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '600px',
    height: '200px',
    background: 'radial-gradient(ellipse, rgba(201,169,110,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  ctaContent: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '40px',
    flexWrap: 'wrap',
  },
  ctaTitle: {
    fontSize: '2rem',
    fontWeight: '900',
    color: 'var(--white)',
    marginBottom: '10px',
    fontFamily: 'var(--font-heading)',
  },
  ctaText: {
    color: 'var(--silver-dark)',
    fontSize: '1rem',
    maxWidth: '500px',
    lineHeight: 1.7,
  },
};

export default Home;
