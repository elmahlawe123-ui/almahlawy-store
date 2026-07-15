import { Link } from 'react-router-dom';
import { Home, Package } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={styles.page}>
      <div style={styles.bgGlow} />
      <div style={styles.content}>
        <h1 style={styles.title}>404</h1>
        <h2 style={styles.subtitle}>عذراً، الصفحة غير موجودة</h2>
        <p style={styles.text}>
          يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          يمكنك العودة للصفحة الرئيسية أو تصفح منتجاتنا.
        </p>
        <div style={styles.btnRow}>
          <Link to="/" className="btn btn-gold btn-lg">
            العودة للرئيسية <Home size={18} />
          </Link>
          <Link to="/shop" className="btn btn-outline-gold btn-lg">
            تصفح المتجر <Package size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--black)', position: 'relative', overflow: 'hidden', textAlign: 'center', padding: '40px' },
  bgGlow: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 60%)', pointerEvents: 'none' },
  content: { position: 'relative', zIndex: 1, maxWidth: '600px' },
  title: { fontSize: '6rem', fontWeight: '900', color: 'var(--gold)', fontFamily: 'var(--font-heading)', lineHeight: 1, marginBottom: '20px' },
  subtitle: { fontSize: '2rem', fontWeight: '800', color: 'var(--white)', marginBottom: '16px' },
  text: { color: 'var(--silver-dark)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '40px' },
  btnRow: { display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' },
};

export default NotFound;
