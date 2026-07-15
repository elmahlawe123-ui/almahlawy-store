import { Phone, MapPin, Mail, Clock, MessageSquare } from 'lucide-react';
import { SettingsDB } from '../db/database';

const Contact = () => {
  const settings = SettingsDB.get();
  const contactInfo = [
    { icon: <Phone size={22} />, title: 'اتصل بنا', value: settings.phone, sub: 'متاح 9 صباحاً - 9 مساءً', href: `tel:${settings.phone}` },
    { icon: <MessageSquare size={22} />, title: 'واتساب', value: settings.phone, sub: 'رد فوري على استفساراتك', href: `https://wa.me/${settings.phone.replace(/[^0-9]/g, '')}` },
    { icon: <Mail size={22} />, title: 'البريد الإلكتروني', value: settings.email, sub: 'نرد خلال 24 ساعة', href: `mailto:${settings.email}` },
    { icon: <MapPin size={22} />, title: 'الموقع', value: 'القاهرة، مصر', sub: 'نرحب بزيارتكم للمعرض', href: '#' },
  ];

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      <div className="page-hero">
        <div className="container">
          <span className="section-tag">نحن هنا لمساعدتك</span>
          <h1 style={{ color: 'var(--white)', marginTop: '12px' }}>
            تواصل <span style={{ background: 'var(--grad-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>معنا</span>
          </h1>
          <p>فريقنا جاهز للإجابة على جميع استفساراتك حول منتجاتنا وأسعارنا</p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px 80px' }}>
        <div style={styles.contactGrid}>
          {contactInfo.map((item, i) => (
            <a key={i} href={item.href} style={styles.contactCard} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              <div style={styles.contactIcon}>{item.icon}</div>
              <div>
                <p style={styles.contactTitle}>{item.title}</p>
                <p style={styles.contactValue}>{item.value}</p>
                <p style={styles.contactSub}>{item.sub}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Map Placeholder */}
        <div style={styles.mapCard}>
          <div style={styles.mapOverlay}>
            <MapPin size={40} style={{ color: 'var(--gold)' }} />
            <p style={{ color: 'var(--white)', fontWeight: '700', marginTop: '12px', fontFamily: 'var(--font-heading)' }}>القاهرة، مصر</p>
            <p style={{ color: 'var(--silver-dark)', fontSize: '0.9rem', marginTop: '4px' }}>معرض المحلاوى للأدوات الصحية</p>
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="btn btn-gold" style={{ marginTop: '16px' }}>عرض على الخريطة</a>
          </div>
        </div>

        {/* Working Hours */}
        <div style={styles.hoursCard}>
          <Clock size={22} style={{ color: 'var(--gold)' }} />
          <h3 style={styles.hoursTitle}>ساعات العمل</h3>
          <div style={styles.hoursGrid}>
            {[
              { day: 'السبت – الأربعاء', hours: '9:00 ص – 9:00 م' },
              { day: 'الخميس', hours: '9:00 ص – 5:00 م' },
              { day: 'الجمعة', hours: '12:00 م – 6:00 م' },
            ].map(h => (
              <div key={h.day} style={styles.hoursRow}>
                <span style={{ color: 'var(--silver)' }}>{h.day}</span>
                <span style={{ color: 'var(--gold)', fontWeight: '700' }}>{h.hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  contactGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' },
  contactCard: { display: 'flex', gap: '18px', padding: '24px', background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', transition: 'var(--ease)', textDecoration: 'none' },
  contactIcon: { width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0 },
  contactTitle: { fontSize: '0.8rem', color: 'var(--silver-dark)', marginBottom: '4px', fontWeight: '600' },
  contactValue: { fontSize: '1rem', color: 'var(--white)', fontWeight: '700', marginBottom: '3px' },
  contactSub: { fontSize: '0.78rem', color: 'var(--silver-dark)' },
  mapCard: { height: '300px', background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200")', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' },
  mapOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  hoursCard: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '28px', background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)' },
  hoursTitle: { fontSize: '1.1rem', fontWeight: '800', color: 'var(--white)', fontFamily: 'var(--font-heading)' },
  hoursGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
  hoursRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
};

export default Contact;
