import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { ShoppingBag, Heart, X, CheckCircle } from 'lucide-react';

const QuickView = () => {
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const { addToCart, toggleWishlist, isWishlisted } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = (e) => setProduct(e.detail.product);
    document.addEventListener('quick-view', handleOpen);
    return () => document.removeEventListener('quick-view', handleOpen);
  }, []);

  if (!product) return null;
  const wishlisted = isWishlisted(product.id);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    document.dispatchEvent(new CustomEvent('open-cart-drawer'));
    setTimeout(() => {
      setAdded(false);
      setProduct(null);
    }, 1500);
  };

  const close = () => setProduct(null);

  return (
    <div style={styles.overlay} onClick={close}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={close}><X size={20} /></button>
        
        <div style={styles.grid}>
          <div style={styles.imgCol}>
            <img src={product.image} alt={product.name} style={styles.img} />
            <span style={styles.badge}>{product.brand}</span>
          </div>
          <div style={styles.infoCol}>
            <span style={styles.category}>{product.category}</span>
            <h2 style={styles.title}>{product.name}</h2>
            
            <div style={styles.priceBox}>
              <div style={styles.priceIcon}>🔒</div>
              <div>
                <p style={styles.priceTitle}>السعر خاص لكل عميل</p>
                <p style={styles.priceHint}>أضف هذا المنتج لسلتك لمعرفة عرض السعر الخاص بك</p>
              </div>
            </div>

            <p style={styles.desc}>{product.description}</p>
            
            <div style={styles.stock}>
              <span style={{ color: product.stock > 0 ? '#22c55e' : '#ef4444', fontWeight: '700' }}>
                {product.stock > 0 ? `✓ متوفر (${product.stock} قطعة)` : '✗ غير متوفر'}
              </span>
            </div>

            <div style={styles.actions}>
              <button style={{ ...styles.addBtn, ...(added ? styles.addBtnDone : {}) }} onClick={handleAdd} disabled={product.stock === 0}>
                {added ? <><CheckCircle size={18} /> تمت الإضافة!</> : <><ShoppingBag size={18} /> أضف للسلة</>}
              </button>
              <button style={{ ...styles.wishBtn, color: wishlisted ? '#ef4444' : 'var(--silver)' }} onClick={() => toggleWishlist(product)}>
                <Heart size={20} fill={wishlisted ? '#ef4444' : 'none'} />
              </button>
            </div>

            <button style={styles.viewFullBtn} onClick={() => { close(); navigate(`/product/${product.id}`); }}>
              عرض التفاصيل كاملة ←
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  modal: { width: '100%', maxWidth: '900px', background: 'var(--black)', borderRadius: 'var(--r-xl)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden', animation: 'fadeInUp 0.3s ease' },
  closeBtn: { position: 'absolute', top: '16px', left: '16px', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'var(--white)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 },
  grid: { display: 'flex', flexWrap: 'wrap' },
  imgCol: { flex: '1 1 300px', position: 'relative' },
  img: { width: '100%', height: '100%', minHeight: '400px', objectFit: 'cover' },
  badge: { position: 'absolute', top: '20px', right: '20px', padding: '6px 16px', background: 'rgba(0,0,0,0.7)', borderRadius: '50px', color: 'var(--gold)', fontWeight: '700', backdropFilter: 'blur(4px)' },
  infoCol: { flex: '1 1 400px', padding: '40px', display: 'flex', flexDirection: 'column' },
  category: { color: 'var(--silver-dark)', fontSize: '0.85rem', marginBottom: '8px' },
  title: { fontSize: '1.8rem', color: 'var(--white)', fontWeight: '900', marginBottom: '20px' },
  priceBox: { display: 'flex', gap: '12px', padding: '16px', background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 'var(--r-md)', marginBottom: '20px' },
  priceIcon: { fontSize: '1.4rem' },
  priceTitle: { color: 'var(--gold)', fontWeight: '700', marginBottom: '4px' },
  priceHint: { color: 'var(--silver-dark)', fontSize: '0.85rem', lineHeight: 1.5 },
  desc: { color: 'var(--silver)', lineHeight: 1.6, marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  stock: { marginBottom: '24px', fontSize: '0.9rem' },
  actions: { display: 'flex', gap: '12px', marginBottom: '24px' },
  addBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', background: 'var(--grad-gold)', color: 'var(--black)', borderRadius: 'var(--r-md)', fontWeight: '700', border: 'none', cursor: 'pointer', transition: 'var(--ease)' },
  addBtnDone: { background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff' },
  wishBtn: { width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--r-md)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' },
  viewFullBtn: { marginTop: 'auto', background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', textAlign: 'right' }
};

export default QuickView;
