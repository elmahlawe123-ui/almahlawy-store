import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { SettingsDB } from '../db/database';

// WhatsApp SVG Icon
const WhatsAppIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FloatingButtons = () => {
  const [showTop, setShowTop] = useState(false);
  const settings = SettingsDB.get();
  // Clean phone for WhatsApp — remove spaces and leading +
  const waPhone = (settings.phone || '').replace(/[^0-9]/g, '');

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div style={styles.container}>
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${waPhone}?text=${encodeURIComponent('مرحباً، أريد الاستفسار عن منتجاتكم 🙏')}`}
        target="_blank"
        rel="noreferrer"
        style={styles.waBtn}
        title="تواصل عبر واتساب"
        aria-label="تواصل عبر واتساب"
        id="whatsapp-float"
      >
        <WhatsAppIcon />
        <span style={styles.waLabel}>واتساب</span>
        <span style={styles.waPulse} />
      </a>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        style={{
          ...styles.topBtn,
          opacity: showTop ? 1 : 0,
          transform: showTop ? 'translateY(0)' : 'translateY(20px)',
          pointerEvents: showTop ? 'all' : 'none',
        }}
        title="العودة للأعلى"
        aria-label="العودة للأعلى"
        id="back-to-top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '28px',
    left: '28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    zIndex: 9000,
  },
  waBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#25D366',
    color: '#fff',
    padding: '12px 18px',
    borderRadius: '50px',
    boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-heading)',
    transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
    position: 'relative',
    overflow: 'visible',
  },
  waLabel: {
    whiteSpace: 'nowrap',
  },
  waPulse: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50px',
    border: '2px solid #25D366',
    animation: 'waPulse 2s ease-out infinite',
    pointerEvents: 'none',
  },
  topBtn: {
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    background: 'var(--grad-gold)',
    color: 'var(--black)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(201,169,110,0.4)',
    transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
  },
};

export default FloatingButtons;
