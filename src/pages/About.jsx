import { Link } from 'react-router-dom';
import { Award, Users, Star, Shield, Package, Clock, MapPin, ChevronLeft } from 'lucide-react';

const milestones = [
  { year: '2010', title: 'تأسيس المعرض', desc: 'بدأت رحلتنا بمحل صغير في القاهرة وحلم كبير' },
  { year: '2014', title: 'أول وكالة دولية', desc: 'حصلنا على وكالة ماركة GROHE الألمانية الشهيرة في مصر' },
  { year: '2018', title: 'التوسع والنمو', desc: 'وصلنا إلى أكثر من 5000 عميل راضٍ في 15 محافظة' },
  { year: '2024', title: 'التحول الرقمي', desc: 'أطلقنا متجرنا الإلكتروني ليصل إلى عملائنا في كل مكان' },
];

const values = [
  { icon: <Shield size={28} />, title: 'الجودة أولاً', desc: 'لا نتنازل عن الجودة. كل منتج يمر بمعايير صارمة قبل وصوله إليك' },
  { icon: <Users size={28} />, title: 'خدمة استثنائية', desc: 'فريقنا المتخصص جاهز دائماً لمساعدتك قبل وبعد الشراء' },
  { icon: <Award size={28} />, title: 'خبرة 15+ سنة', desc: 'عقد ونصف من الخبرة في سوق الأدوات الصحية المصري والعربي' },
  { icon: <Star size={28} />, title: 'أسعار تنافسية', desc: 'نحرص على تقديم أفضل الأسعار مع الحفاظ على أعلى مستوى جودة' },
];

const brands = [
  { name: 'جروهى GROHE', country: 'ألمانيا 🇩🇪', desc: 'الرائدة عالمياً في خلاطات المياه الفاخرة' },
  { name: 'ايديال ستاندرد', country: 'بلجيكا 🇧🇪', desc: 'أطقم حمامات عصرية تجمع الجمال بالوظيفة' },
  { name: 'بولو بلاست', country: 'مصر 🇪🇬', desc: 'الرائدة في مواسير الـ PPR ذات الجودة الألمانية' },
  { name: 'استاندورف', country: 'أوروبا 🌍', desc: 'خلاطات ومقاطير بتصميم أنيق وعصري' },
  { name: 'بانيوهات الطيب', country: 'مصر 🇪🇬', desc: 'صناعة مصرية بمواصفات عالمية للبانيوهات' },
  { name: 'بليزا', country: 'مصر 🇪🇬', desc: 'إكسسوارات حمام بجودة وتنوع لا مثيل لهما' },
];

const About = () => {
  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>

      {/* ─── HERO ─── */}
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroGlow} />
        <div className="container" style={styles.heroContent}>
          <span className="section-tag">قصتنا</span>
          <h1 style={styles.heroTitle}>
            نحن <span style={{ background: 'var(--grad-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>المحلاوى</span>
          </h1>
          <p style={styles.heroSub}>
            أكثر من 15 عاماً من الشغف بالجودة والخدمة المتميزة في عالم الأدوات الصحية.
            نحن لسنا مجرد متجر — نحن شريكك في بناء بيتك.
          </p>
          <div style={styles.heroStats}>
            {[
              { num: '+15', label: 'سنة خبرة' },
              { num: '+6000', label: 'عميل سعيد' },
              { num: '6', label: 'ماركات عالمية' },
              { num: '100%', label: 'ضمان الجودة' },
            ].map((s, i) => (
              <div key={i} style={styles.heroStat}>
                <span style={styles.heroStatNum}>{s.num}</span>
                <span style={styles.heroStatLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STORY / TIMELINE ─── */}
      <section style={styles.section}>
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">المسيرة</span>
            <h2 className="section-title">رحلتنا عبر السنين</h2>
          </div>
          <div style={styles.timeline}>
            {milestones.map((m, i) => (
              <div key={i} style={{ ...styles.timelineItem, ...(i % 2 === 1 ? styles.timelineRight : {}) }}>
                <div style={styles.timelineDot}>
                  <span style={styles.timelineYear}>{m.year}</span>
                </div>
                <div style={styles.timelineCard}>
                  <h3 style={styles.timelineTitle}>{m.title}</h3>
                  <p style={styles.timelineDesc}>{m.desc}</p>
                </div>
              </div>
            ))}
            <div style={styles.timelineLine} />
          </div>
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section style={{ ...styles.section, background: 'var(--black-mid)' }}>
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">قيمنا</span>
            <h2 className="section-title">ما يميزنا</h2>
            <p className="section-subtitle">التزامنا بهذه القيم هو ما جعلنا الخيار الأول لآلاف العملاء</p>
          </div>
          <div className="grid grid-4">
            {values.map((v, i) => (
              <div key={i} style={styles.valueCard}>
                <div style={styles.valueIcon}>{v.icon}</div>
                <h3 style={styles.valueTitle}>{v.title}</h3>
                <p style={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BRANDS ─── */}
      <section style={styles.section}>
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">شركاؤنا</span>
            <h2 className="section-title">العلامات التجارية التي نفخر بتمثيلها</h2>
          </div>
          <div className="grid grid-3">
            {brands.map((b, i) => (
              <div key={i} style={styles.brandCard}>
                <div style={styles.brandTop}>
                  <h3 style={styles.brandName}>{b.name}</h3>
                  <span style={styles.brandCountry}>{b.country}</span>
                </div>
                <p style={styles.brandDesc}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOCATION ─── */}
      <section style={{ ...styles.section, background: 'var(--black-mid)', paddingBottom: '0' }}>
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">تجدنا هنا</span>
            <h2 className="section-title">موقع المعرض</h2>
          </div>
          <div style={styles.locationGrid}>
            <div style={styles.locationInfo}>
              {[
                { icon: <MapPin size={20} />, label: 'العنوان', val: 'القاهرة، مصر' },
                { icon: <Clock size={20} />, label: 'ساعات العمل', val: 'السبت – الأربعاء: 9ص – 9م' },
                { icon: <Package size={20} />, label: 'التوصيل', val: 'جميع أنحاء مصر' },
              ].map((item, i) => (
                <div key={i} style={styles.locationRow}>
                  <div style={styles.locationIcon}>{item.icon}</div>
                  <div>
                    <p style={{ color: 'var(--silver-dark)', fontSize: '0.8rem' }}>{item.label}</p>
                    <p style={{ color: 'var(--white)', fontWeight: '700' }}>{item.val}</p>
                  </div>
                </div>
              ))}
              <Link to="/contact" className="btn btn-gold" style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }}>
                تواصل معنا <ChevronLeft size={18} />
              </Link>
            </div>
            <div style={styles.mapBox}>
              <div style={styles.mapOverlay}>
                <MapPin size={40} style={{ color: 'var(--gold)' }} />
                <p style={{ color: 'var(--white)', fontWeight: '700', marginTop: '12px' }}>معرض المحلاوى</p>
                <p style={{ color: 'var(--silver-dark)', fontSize: '0.85rem' }}>القاهرة، مصر</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={styles.ctaSection}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--white)', marginBottom: '16px' }}>
            مستعد لتجهيز <span style={{ background: 'var(--grad-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>حمامك بالكامل؟</span>
          </h2>
          <p style={{ color: 'var(--silver-dark)', marginBottom: '32px', fontSize: '1.1rem' }}>اكتشف تشكيلتنا الواسعة من المنتجات الفاخرة</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn-gold btn-lg">تسوق الآن</Link>
            <Link to="/bundles" className="btn btn-dark btn-lg">العروض المجمعة</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  // Hero
  hero: { position: 'relative', padding: '120px 0 80px', overflow: 'hidden' },
  heroBg: { position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1600)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 },
  heroGlow: { position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(13,13,13,0.3) 0%, rgba(13,13,13,0.8) 60%, #0D0D0D 100%)' },
  heroContent: { position: 'relative', zIndex: 1, textAlign: 'center' },
  heroTitle: { fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: '900', color: 'var(--white)', margin: '16px 0 20px', fontFamily: 'var(--font-heading)', lineHeight: 1.1 },
  heroSub: { fontSize: '1.2rem', color: 'var(--silver)', maxWidth: '640px', margin: '0 auto 48px', lineHeight: 1.8 },
  heroStats: { display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' },
  heroStat: { textAlign: 'center' },
  heroStatNum: { display: 'block', fontSize: '2.4rem', fontWeight: '900', color: 'var(--gold)', fontFamily: 'var(--font-heading)' },
  heroStatLabel: { display: 'block', color: 'var(--silver-dark)', fontSize: '0.85rem', marginTop: '4px' },
  // Section
  section: { padding: '100px 0' },
  // Timeline
  timeline: { position: 'relative', maxWidth: '800px', margin: '0 auto', padding: '20px 0' },
  timelineLine: { position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', background: 'linear-gradient(180deg, transparent, rgba(201,169,110,0.5), transparent)', transform: 'translateX(-50%)' },
  timelineItem: { display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '48px', justifyContent: 'flex-end' },
  timelineRight: { flexDirection: 'row-reverse' },
  timelineDot: { width: '80px', height: '80px', borderRadius: '50%', background: 'var(--grad-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 0 6px rgba(201,169,110,0.15)', zIndex: 1 },
  timelineYear: { fontSize: '1.1rem', fontWeight: '900', color: 'var(--black)', fontFamily: 'var(--font-heading)' },
  timelineCard: { flex: 1, background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', padding: '24px' },
  timelineTitle: { fontSize: '1.2rem', fontWeight: '800', color: 'var(--white)', marginBottom: '8px' },
  timelineDesc: { color: 'var(--silver-dark)', lineHeight: 1.7 },
  // Values
  valueCard: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', padding: '32px 24px', textAlign: 'center', transition: 'var(--ease)' },
  valueIcon: { width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--gold)' },
  valueTitle: { fontSize: '1.1rem', fontWeight: '800', color: 'var(--white)', marginBottom: '10px' },
  valueDesc: { color: 'var(--silver-dark)', lineHeight: 1.7, fontSize: '0.9rem' },
  // Brands
  brandCard: { background: 'var(--grad-card)', border: '1px solid rgba(201,169,110,0.12)', borderRadius: 'var(--r-lg)', padding: '28px', transition: 'var(--ease)' },
  brandTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  brandName: { fontSize: '1.1rem', fontWeight: '800', color: 'var(--gold)' },
  brandCountry: { fontSize: '0.8rem', color: 'var(--silver-dark)', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: '50px' },
  brandDesc: { color: 'var(--silver)', fontSize: '0.9rem', lineHeight: 1.6 },
  // Location
  locationGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', alignItems: 'start', paddingBottom: '80px' },
  locationInfo: { display: 'flex', flexDirection: 'column', gap: '20px' },
  locationRow: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-md)' },
  locationIcon: { width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(201,169,110,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0 },
  mapBox: { height: '320px', borderRadius: 'var(--r-lg)', overflow: 'hidden', backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
  mapOverlay: { position: 'absolute', inset: 0, background: 'rgba(13,13,13,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' },
  // CTA
  ctaSection: { padding: '100px 0', background: 'linear-gradient(180deg, #0D0D0D 0%, #161616 50%, #0D0D0D 100%)', borderTop: '1px solid rgba(201,169,110,0.1)', borderBottom: '1px solid rgba(201,169,110,0.1)' },
};

export default About;
