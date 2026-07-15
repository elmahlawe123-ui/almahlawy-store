import { brands } from '../data/mockData';

const BrandsSlider = () => {
  // Double for seamless scroll
  const doubled = [...brands, ...brands];

  return (
    <section style={styles.section}>
      <div style={styles.topLine} />
      <div className="container">
        <div className="section-header center">
          <span className="section-tag">شركاء النجاح</span>
          <h2 className="section-title">علامات تجارية <span>عالمية</span></h2>
          <div className="gold-divider" />
          <p className="section-subtitle">نتعاون مع أعرق وأفضل العلامات التجارية العالمية لنقدم لكم جودة لا مثيل لها</p>
        </div>
      </div>

      {/* Scrolling Brand Track */}
      <div style={styles.sliderOuter}>
        <div style={styles.fadeLeft} />
        <div style={styles.track}>
          <div style={styles.trackInner}>
            {doubled.map((brand, i) => (
              <div key={`${brand.id}-${i}`} style={styles.brandCard}>
                <div style={styles.brandIconWrap}>
                  <span style={styles.brandInitial}>{brand.name[0]}</span>
                </div>
                <div>
                  <p style={styles.brandName}>{brand.name}</p>
                  <p style={styles.brandLogo}>{brand.logo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={styles.fadeRight} />
      </div>

      <style>{`
        @keyframes scroll-rtl {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .brands-track { animation: scroll-rtl 20s linear infinite; }
        .brands-track:hover { animation-play-state: paused; }
      `}</style>
      <div style={styles.bottomLine} />
    </section>
  );
};

const styles = {
  section: {
    backgroundColor: 'var(--black-mid)',
    padding: '80px 0',
    overflow: 'hidden',
  },
  topLine: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
    opacity: 0.3,
    marginBottom: '60px',
  },
  sliderOuter: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    marginTop: '40px',
    padding: '10px 0',
  },
  track: {
    overflow: 'hidden',
    width: '100%',
  },
  trackInner: {
    display: 'flex',
    gap: '20px',
    width: 'max-content',
    animation: 'scroll-rtl 20s linear infinite',
  },
  brandCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '18px 28px',
    background: 'var(--grad-card)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 'var(--r-md)',
    minWidth: '200px',
    transition: 'var(--ease)',
    cursor: 'default',
    flexShrink: 0,
  },
  brandIconWrap: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    background: 'rgba(201,169,110,0.1)',
    border: '1px solid rgba(201,169,110,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  brandInitial: {
    fontSize: '1.4rem',
    fontWeight: '900',
    color: 'var(--gold)',
    fontFamily: 'var(--font-heading)',
  },
  brandName: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: 'var(--white)',
    fontFamily: 'var(--font-heading)',
    lineHeight: 1.3,
  },
  brandLogo: {
    fontSize: '0.72rem',
    color: 'var(--silver-dark)',
    marginTop: '2px',
    letterSpacing: '0.5px',
  },
  fadeLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '120px',
    height: '100%',
    background: 'linear-gradient(to right, var(--black-mid), transparent)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  fadeRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '120px',
    height: '100%',
    background: 'linear-gradient(to left, var(--black-mid), transparent)',
    zIndex: 2,
    pointerEvents: 'none',
  },
  bottomLine: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
    opacity: 0.3,
    marginTop: '60px',
  },
};

export default BrandsSlider;
