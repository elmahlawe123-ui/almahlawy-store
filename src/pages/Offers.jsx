import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { ProductsDB } from '../db/database';
import { Sparkles } from 'lucide-react';
import Countdown from '../components/Countdown';

const Offers = () => {
  const [products, setProducts] = useState([]);
  
  // Set end date to 2 days from now for demo
  const [endDate] = useState(() => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString());

  useEffect(() => {
    // Fake load delay
    setTimeout(() => {
      // For demo, just get first 4 items as "featured"
      const all = ProductsDB.getActive();
      setProducts(all.slice(0, 4));
    }, 500);
  }, []);

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroBg} />
        <div className="container" style={styles.heroContent}>
          <div style={styles.sparkIcon}><Sparkles size={32} /></div>
          <h1 style={styles.title}>عروض <span style={{ color: 'var(--gold)' }}>حصرية</span></h1>
          <p style={styles.subtitle}>تشكيلة من أفضل المنتجات بأسعار خاصة لفترة محدودة</p>
          
          <div style={styles.countdownBox}>
            <p style={{ color: 'var(--silver)', marginBottom: '12px', fontSize: '0.9rem' }}>تنتهي هذه العروض خلال:</p>
            <Countdown endDate={endDate} size="lg" />
          </div>
        </div>
      </div>

      <div className="container">
        <div style={styles.resultsBar}>
          <span style={{ color: 'var(--silver-dark)', fontSize: '1.1rem' }}>
            عدد العروض الحالية: <strong style={{ color: 'var(--white)' }}>{products.length} منتجات</strong>
          </span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-4">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="grid grid-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--grad-card)' }}>
                <div className="skeleton" style={{ height: '240px' }} />
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="skeleton" style={{ height: '20px', width: '75%' }} />
                  <div className="skeleton" style={{ height: '14px', width: '55%' }} />
                  <div className="skeleton" style={{ height: '42px', marginTop: '8px' }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  hero: { position: 'relative', padding: '80px 0', borderBottom: '1px solid rgba(201,169,110,0.15)', overflow: 'hidden', marginBottom: '60px' },
  heroBg: { position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(201,169,110,0.15) 0%, transparent 60%)' },
  heroContent: { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
  sparkIcon: { color: 'var(--gold)', marginBottom: '16px', filter: 'drop-shadow(0 0 10px rgba(201,169,110,0.5))' },
  title: { fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', color: 'var(--white)', marginBottom: '16px', fontFamily: 'var(--font-heading)' },
  subtitle: { fontSize: '1.2rem', color: 'var(--silver-dark)', marginBottom: '40px' },
  countdownBox: { background: 'rgba(13,13,13,0.6)', border: '1px solid rgba(201,169,110,0.3)', padding: '30px', borderRadius: 'var(--r-xl)', backdropFilter: 'blur(10px)' },
  resultsBar: { marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
};

export default Offers;
