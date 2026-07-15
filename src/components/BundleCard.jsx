import { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { ShoppingBag, CheckCircle } from 'lucide-react';

const BundleCard = ({ bundle }) => {
  const { addToCart } = useContext(StoreContext);

  const discount = Math.round(((bundle.oldPrice - bundle.price) / bundle.oldPrice) * 100);

  return (
    <div style={styles.card}>
      {/* Image */}
      <div style={styles.imageWrap}>
        <img src={bundle.image} alt={bundle.name} style={styles.image} />
        <div style={styles.imageGrad} />
        <span style={styles.discountBadge}>خصم {discount}%</span>
        <div style={styles.imageTitle}>
          <span style={styles.tag}>عرض مجمع حصري</span>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h3 style={styles.title}>{bundle.name}</h3>
        <p style={styles.desc}>{bundle.description}</p>

        {/* Items list */}
        <div style={styles.itemsBox}>
          <p style={styles.itemsLabel}>محتويات العرض:</p>
          <ul style={styles.itemsList}>
            {bundle.items.map((item, i) => (
              <li key={i} style={styles.item}>
                <CheckCircle size={14} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price row */}
        <div style={styles.priceRow}>
          <div>
            <p style={styles.price}>{bundle.price.toLocaleString()} <span style={styles.currency}>ج.م</span></p>
            <p style={styles.oldPrice}>بدلاً من {bundle.oldPrice.toLocaleString()} ج.م</p>
          </div>
          <button
            style={styles.addBtn}
            onClick={() => addToCart(bundle)}
            id={`add-bundle-${bundle.id}`}
          >
            <ShoppingBag size={18} />
            <span>أضف للسلة</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'var(--grad-card)',
    border: '1px solid rgba(201,169,110,0.2)',
    borderRadius: 'var(--r-lg)',
    overflow: 'hidden',
    transition: 'var(--ease)',
    display: 'flex',
    flexDirection: 'column',
  },
  imageWrap: {
    position: 'relative',
    height: '280px',
    overflow: 'hidden',
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease',
  },
  imageGrad: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
  },
  discountBadge: {
    position: 'absolute',
    top: '14px',
    right: '14px',
    padding: '6px 14px',
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: 'var(--white)',
    borderRadius: '50px',
    fontSize: '0.8rem',
    fontWeight: '700',
    fontFamily: 'var(--font-heading)',
    boxShadow: '0 4px 12px rgba(220,38,38,0.4)',
  },
  imageTitle: {
    position: 'absolute',
    bottom: '14px',
    right: '14px',
  },
  tag: {
    padding: '5px 14px',
    background: 'var(--grad-gold)',
    color: 'var(--black)',
    borderRadius: '50px',
    fontSize: '0.75rem',
    fontWeight: '700',
    fontFamily: 'var(--font-heading)',
  },
  content: {
    padding: '24px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  title: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: 'var(--white)',
    fontFamily: 'var(--font-heading)',
  },
  desc: {
    fontSize: '0.9rem',
    color: 'var(--silver-dark)',
    lineHeight: 1.7,
  },
  itemsBox: {
    background: 'rgba(201,169,110,0.05)',
    border: '1px solid rgba(201,169,110,0.15)',
    borderRadius: 'var(--r-md)',
    padding: '16px',
  },
  itemsLabel: {
    fontSize: '0.82rem',
    color: 'var(--gold)',
    fontWeight: '700',
    fontFamily: 'var(--font-heading)',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '0.88rem',
    color: 'var(--silver)',
    lineHeight: 1.5,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    marginTop: 'auto',
  },
  price: {
    fontSize: '1.7rem',
    fontWeight: '900',
    color: 'var(--gold)',
    fontFamily: 'var(--font-heading)',
    lineHeight: 1.2,
  },
  currency: {
    fontSize: '1rem',
    fontWeight: '600',
  },
  oldPrice: {
    fontSize: '0.82rem',
    color: 'var(--silver-dark)',
    textDecoration: 'line-through',
    marginTop: '2px',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'var(--grad-gold)',
    color: 'var(--black)',
    borderRadius: 'var(--r-md)',
    fontWeight: '700',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.9rem',
    cursor: 'pointer',
    border: 'none',
    boxShadow: 'var(--shadow-gold)',
    flexShrink: 0,
  },
};

export default BundleCard;
