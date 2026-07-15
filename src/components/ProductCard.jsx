import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { ShoppingBag, Eye, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useContext(StoreContext);
  const wishlisted = isWishlisted(product.id);

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.dispatchEvent(new CustomEvent('quick-view', { detail: { product } }));
  };

  const handleAddCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    document.dispatchEvent(new CustomEvent('open-cart-drawer'));
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div style={styles.card} className="product-card">
      {/* Image */}
      <div style={styles.imageWrap}>
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} style={styles.image} loading="lazy" />
        </Link>
        <div style={styles.imageOverlay}>
          <button style={styles.overlayBtn} onClick={handleAddCart}>
            <ShoppingBag size={16} />
            <span>أضف للسلة</span>
          </button>
          <button style={styles.quickViewBtn} onClick={handleQuickView}>
            <Eye size={16} />
            <span>معاينة سريعة</span>
          </button>
        </div>
        <span style={styles.brandBadge}>{product.brand}</span>
        <span style={styles.categoryTag}>{product.category}</span>
        {/* Wishlist heart */}
        <button
          style={{ ...styles.heartBtn, color: wishlisted ? '#ef4444' : 'var(--silver-dark)' }}
          onClick={handleWishlist}
          title="أضف للمفضلة"
        >
          <Heart size={16} fill={wishlisted ? '#ef4444' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={styles.title}>{product.name}</h3>
        </Link>
        <p style={styles.desc}>{product.description}</p>
        {product.stock <= 5 && product.stock > 0 && (
          <p style={styles.lowStock}>⚠ باقي {product.stock} قطع فقط!</p>
        )}
        <div style={styles.footer}>
          <button
            className="btn-add-cart"
            style={styles.addCartBtn}
            onClick={handleAddCart}
            id={`add-product-${product.id}`}
          >
            <ShoppingBag size={16} />
            <span>أضف إلى السلة لمعرفة السعر</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'var(--grad-card)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 'var(--r-lg)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  imageWrap: {
    position: 'relative',
    height: '240px',
    overflow: 'hidden',
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease',
    display: 'block',
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.65)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    opacity: 0,
    transition: 'var(--ease)',
    backdropFilter: 'blur(4px)',
  },
  overlayBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 22px',
    background: 'var(--grad-gold)',
    color: 'var(--black)',
    borderRadius: '50px',
    fontWeight: '700',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-heading)',
    cursor: 'pointer',
    border: 'none',
    transform: 'translateY(8px)',
    transition: 'var(--ease)',
  },
  quickViewBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 20px',
    background: 'rgba(255,255,255,0.12)',
    color: 'var(--white)',
    borderRadius: '50px',
    fontWeight: '600',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-heading)',
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.2)',
    transform: 'translateY(8px)',
    transition: 'var(--ease)',
    backdropFilter: 'blur(4px)',
  },
  heartBtn: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.6)',
    border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    transition: 'var(--ease)',
  },
  brandBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '4px 12px',
    background: 'rgba(13,13,13,0.85)',
    border: '1px solid rgba(201,169,110,0.4)',
    borderRadius: '50px',
    color: 'var(--gold)',
    fontSize: '0.72rem',
    fontWeight: '700',
    backdropFilter: 'blur(4px)',
  },
  categoryTag: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    padding: '3px 10px',
    background: 'rgba(0,0,0,0.7)',
    borderRadius: '50px',
    color: 'var(--silver-dark)',
    fontSize: '0.68rem',
    fontWeight: '600',
  },
  content: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontSize: '1rem',
    fontWeight: '800',
    color: 'var(--white)',
    marginBottom: '8px',
    lineHeight: 1.4,
    fontFamily: 'var(--font-heading)',
  },
  desc: {
    fontSize: '0.82rem',
    color: 'var(--silver-dark)',
    lineHeight: 1.6,
    flex: 1,
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  lowStock: {
    fontSize: '0.75rem',
    color: '#fbbf24',
    fontWeight: '700',
    marginBottom: '8px',
  },
  footer: {
    marginTop: 'auto',
  },
  addCartBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 16px',
    background: 'rgba(201,169,110,0.1)',
    border: '1px solid rgba(201,169,110,0.25)',
    borderRadius: 'var(--r-md)',
    color: 'var(--gold)',
    fontWeight: '700',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-heading)',
    cursor: 'pointer',
    transition: 'var(--ease)',
  },
};

export default ProductCard;
