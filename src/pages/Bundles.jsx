import { useState, useEffect } from 'react';
import BundleCard from '../components/BundleCard';
import { BundlesDB } from '../db/database';
import { Percent } from 'lucide-react';

const Bundles = () => {
  const [bundles, setBundles] = useState([]);

  useEffect(() => {
    setBundles(BundlesDB.getAll().filter(b => b.active));
  }, []);

  return (
    <div style={styles.page}>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <span className="section-tag">توفير وجودة</span>
          <h1 style={{ color: 'var(--white)', marginTop: '12px' }}>
            العروض <span style={{ background: 'var(--grad-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>المجمعة</span>
          </h1>
          <p>وفّر أكثر مع باقاتنا المتكاملة لتجهيز حمامك بالكامل</p>
        </div>
      </div>

      {/* Saving strip */}
      <div style={styles.savingStrip}>
        <div className="container" style={styles.savingInner}>
          <Percent size={18} style={{ color: 'var(--black)' }} />
          <span>تتراوح نسبة التوفير في عروضنا المجمعة بين 10% و20% مقارنة بالشراء المنفرد</span>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        {bundles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--silver-dark)' }}>
            <Percent size={56} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ fontSize: '1.1rem' }}>لا توجد عروض مجمعة متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {bundles.map(b => <BundleCard key={b.id} bundle={b} />)}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    background: 'var(--black)',
    minHeight: '100vh',
  },
  savingStrip: {
    background: 'var(--grad-gold)',
    padding: '14px 0',
  },
  savingInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    color: 'var(--black)',
    fontWeight: '700',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-heading)',
  },
};

export default Bundles;
