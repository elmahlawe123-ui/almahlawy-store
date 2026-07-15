import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Share2, Heart, ArrowLeft } from 'lucide-react';
import { SettingsDB } from '../db/database';

const Footer = () => {
  const quickLinks = [
    { to: '/', label: 'الرئيسية' },
    { to: '/shop', label: 'المتجر' },
    { to: '/bundles', label: 'العروض المجمعة' },
    { to: '/about', label: 'من نحن' },
    { to: '/track', label: 'تتبع طلبك' },
    { to: '/contact', label: 'اتصل بنا' },
  ];

  const brands = ['جروهى (Grohe)', 'ايديال ستاندرد', 'بولو بلاست', 'استاندورف', 'بانيوهات الطيب', 'بليزا'];

  const settings = SettingsDB.get();

  return (
    <footer style={styles.footer}>
      {/* Glow line */}
      <div style={styles.topGlow} />

      <div className="container">
        <div style={styles.grid}>

          {/* Brand Column */}
          <div style={styles.column}>
            <div style={styles.logoBlock}>
              <div style={styles.logoIcon}>م</div>
              <div>
                <div style={styles.logoMain}>المحلاوى</div>
                <div style={styles.logoSub}>للأدوات الصحية</div>
              </div>
            </div>
            <p style={styles.desc}>
              رواد بيع وتوزيع الأدوات الصحية الفاخرة في مصر. نقدم أفضل الماركات العالمية بجودة عالية وأسعار تنافسية لعملائنا الكرام.
            </p>
            <div style={styles.socialRow}>
              <a href="#" style={styles.socialBtn} aria-label="Facebook">
                <Share2 size={18} />
              </a>
              <a href="#" style={styles.socialBtn} aria-label="Instagram">
                <Heart size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div style={styles.column}>
            <h4 style={styles.colTitle}>روابط سريعة</h4>
            <ul style={styles.linkList}>
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} style={styles.footerLink}>
                    <ArrowLeft size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands */}
          <div style={styles.column}>
            <h4 style={styles.colTitle}>العلامات التجارية</h4>
            <ul style={styles.linkList}>
              {brands.map(brand => (
                <li key={brand} style={{ ...styles.footerLink, cursor: 'default' }}>
                  <span style={styles.brandDot}>◆</span>
                  {brand}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div style={styles.column}>
            <h4 style={styles.colTitle}>تواصل معنا</h4>
            <ul style={styles.contactList}>
              <li style={styles.contactItem}>
                <div style={styles.contactIcon}><MapPin size={16} /></div>
                <span>القاهرة، مصر</span>
              </li>
              <li style={styles.contactItem}>
                <div style={styles.contactIcon}><Phone size={16} /></div>
                <span style={{ direction: 'ltr' }}>{settings.phone}</span>
              </li>
              <li style={styles.contactItem}>
                <div style={styles.contactIcon}><Mail size={16} /></div>
                <span>{settings.email}</span>
              </li>
            </ul>

            <div style={styles.hoursBox}>
              <p style={styles.hoursTitle}>ساعات العمل</p>
              <p style={styles.hoursText}>السبت – الخميس: 9ص – 9م</p>
              <p style={styles.hoursText}>الجمعة: 12م – 6م</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={styles.bottomGlow} />
      <div style={styles.bottomBar}>
        <div className="container" style={styles.bottomContent}>
          <p style={styles.copyright}>
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} — معرض المحلاوى للأدوات الصحية
          </p>
          <div style={styles.bottomLinks}>
            <Link to="/about" style={styles.bottomLink}>سياسة الخصوصية</Link>
            <span style={{ color: 'var(--gold)', opacity: 0.5 }}>|</span>
            <Link to="/about" style={styles.bottomLink}>الشروط والأحكام</Link>
            <span style={{ color: 'var(--gold)', opacity: 0.5 }}>|</span>
            <Link to="/track" style={styles.bottomLink}>تتبع طلبك</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'var(--black-mid)',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '80px',
    marginTop: 'auto',
  },
  topGlow: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, var(--gold) 30%, var(--gold-light) 50%, var(--gold) 70%, transparent 100%)',
    opacity: 0.4,
    marginBottom: '60px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '48px',
    paddingBottom: '60px',
  },
  column: {},
  logoBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  logoIcon: {
    width: '44px',
    height: '44px',
    background: 'var(--grad-gold)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    fontWeight: '900',
    color: 'var(--black)',
    fontFamily: 'var(--font-heading)',
    flexShrink: 0,
  },
  logoMain: {
    fontSize: '1.3rem',
    fontWeight: '900',
    color: 'var(--gold)',
    fontFamily: 'var(--font-heading)',
    lineHeight: 1.2,
  },
  logoSub: {
    fontSize: '0.7rem',
    color: 'var(--silver-dark)',
    letterSpacing: '1px',
  },
  desc: {
    color: 'var(--silver-dark)',
    lineHeight: 1.8,
    marginBottom: '24px',
    fontSize: '0.92rem',
  },
  socialRow: {
    display: 'flex',
    gap: '10px',
  },
  socialBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    background: 'rgba(201,169,110,0.1)',
    border: '1px solid rgba(201,169,110,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--gold)',
    transition: 'var(--ease)',
  },
  colTitle: {
    fontSize: '1.05rem',
    fontWeight: '800',
    color: 'var(--white)',
    marginBottom: '22px',
    fontFamily: 'var(--font-heading)',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(201,169,110,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  linkList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  footerLink: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    color: 'var(--silver-dark)',
    fontSize: '0.92rem',
    transition: 'var(--ease)',
    lineHeight: 1.5,
  },
  brandDot: {
    color: 'var(--gold)',
    fontSize: '0.6rem',
    marginTop: '4px',
    flexShrink: 0,
  },
  contactList: { display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    color: 'var(--silver-dark)',
    fontSize: '0.92rem',
  },
  contactIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '7px',
    background: 'rgba(201,169,110,0.1)',
    border: '1px solid rgba(201,169,110,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--gold)',
    flexShrink: 0,
  },
  hoursBox: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    padding: '14px 18px',
  },
  hoursTitle: {
    color: 'var(--gold)',
    fontWeight: '700',
    marginBottom: '8px',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-heading)',
  },
  hoursText: {
    color: 'var(--silver-dark)',
    fontSize: '0.85rem',
    lineHeight: 1.8,
  },
  bottomGlow: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.3) 50%, transparent 100%)',
  },
  bottomBar: {
    padding: '20px 0',
    background: 'rgba(0,0,0,0.4)',
  },
  bottomContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  copyright: {
    color: 'var(--silver-dark)',
    fontSize: '0.83rem',
  },
  bottomLinks: {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
  },
  bottomLink: {
    color: 'var(--silver-dark)',
    fontSize: '0.83rem',
    transition: 'var(--ease)',
  },
};

export default Footer;
