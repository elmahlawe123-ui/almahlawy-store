import { useContext, useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { ProductsDB } from '../db/database';
import { ShoppingBag, Heart, ArrowRight, CheckCircle, Package, Shield, Star, Share2, Eye, ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────────────
const getRecentlyViewed = () => {
  try { return JSON.parse(localStorage.getItem('recently_viewed') || '[]'); } catch { return []; }
};
const addToRecentlyViewed = (product) => {
  const list = getRecentlyViewed().filter(p => p.id !== product.id);
  list.unshift({ id: product.id, name: product.name, image: product.image, brand: product.brand, category: product.category });
  localStorage.setItem('recently_viewed', JSON.stringify(list.slice(0, 6)));
};

// ── Gallery Helper ──────────────────────────────────────────────────
const buildGallery = (product) => {
  if (product.images && product.images.length > 0) return product.images;
  return [product.image].filter(Boolean);
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useContext(StoreContext);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [added, setAdded] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });
  const [socialViews] = useState(() => Math.floor(Math.random() * 20) + 8);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const p = ProductsDB.getById(parseInt(id));
    if (!p) { navigate('/shop'); return; }
    setProduct(p);
    addToRecentlyViewed(p);
    const rel = ProductsDB.getActive().filter(x => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 3);
    setRelated(rel);
    setRecentlyViewed(getRecentlyViewed().filter(r => r.id !== p.id).slice(0, 5));
    setGalleryIdx(0);
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (!product) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--black)' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--silver-dark)' }}>جاري التحميل...</p>
      </div>
    </div>
  );

  const gallery = buildGallery(product);
  const wishlisted = isWishlisted(product.id);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    // Open cart drawer
    document.dispatchEvent(new CustomEvent('open-cart-drawer'));
    setTimeout(() => setAdded(false), 2500);
  };

  const handleShare = () => {
    const text = `✦ ${product.name} — معرض المحلاوى للأدوات الصحية\n${window.location.href}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const features = [
    { icon: <Package size={18} />, text: 'تشكيلة واسعة من الأنواع' },
    { icon: <Shield size={18} />, text: 'ضمان جودة 100% أصلي' },
    { icon: <CheckCircle size={18} />, text: 'توصيل لجميع أنحاء مصر' },
    { icon: <Star size={18} />, text: 'أفضل الأسعار مضمونة' },
  ];

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>
        <div className="container" style={styles.breadcrumbInner}>
          <Link to="/" style={styles.crumb}>الرئيسية</Link>
          <span style={styles.crumbSep}>›</span>
          <Link to="/shop" style={styles.crumb}>المتجر</Link>
          <span style={styles.crumbSep}>›</span>
          <span style={{ color: 'var(--gold)' }}>{product.name}</span>
        </div>
      </div>

      <div className="container product-main-layout" style={styles.main}>
        {/* ─── LEFT: Gallery ─── */}
        <div className="product-image-col" style={styles.imageCol}>
          {/* Main Image */}
          <div style={{ ...styles.imageWrap, cursor: 'zoom-in' }} onClick={() => setLightboxOpen(true)}>
            <img src={gallery[galleryIdx]} alt={product.name} style={styles.mainImage} />
            <div style={styles.zoomHint}>
              <ZoomIn size={16} /> تكبير الصورة
            </div>
            <div style={styles.imageOverlayBtns}>
              <button
                style={{ ...styles.wishBtn, color: wishlisted ? '#ef4444' : 'var(--silver)' }}
                onClick={() => toggleWishlist(product)}
              >
                <Heart size={20} fill={wishlisted ? '#ef4444' : 'none'} />
              </button>
              <button style={styles.wishBtn} onClick={handleShare} title="شارك عبر واتساب">
                <Share2 size={18} />
              </button>
            </div>
            <span style={styles.brandBadge}>{product.brand}</span>
            {gallery.length > 1 && (
              <>
                <button style={{ ...styles.galleryArrow, right: '12px' }} onClick={() => setGalleryIdx(i => Math.max(0, i - 1))}>
                  <ChevronRight size={18} />
                </button>
                <button style={{ ...styles.galleryArrow, left: '12px' }} onClick={() => setGalleryIdx(i => Math.min(gallery.length - 1, i + 1))}>
                  <ChevronLeft size={18} />
                </button>
              </>
            )}
          </div>
          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div style={styles.thumbsRow}>
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIdx(i)}
                  style={{ ...styles.thumb, ...(galleryIdx === i ? styles.thumbActive : {}) }}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── RIGHT: Details ─── */}
        <div className="product-details-col" style={styles.detailsCol}>
          {/* Social Proof */}
          <div style={styles.socialProof}>
            <Eye size={14} style={{ color: '#22c55e' }} />
            <span style={{ color: '#22c55e', fontWeight: '700', fontSize: '0.82rem' }}>{socialViews} شخص</span>
            <span style={{ color: 'var(--silver-dark)', fontSize: '0.82rem' }}>يشاهدون هذا المنتج الآن</span>
            <span style={styles.socialDot} />
          </div>

          <span style={styles.categoryTag}>{product.category}</span>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.desc}>{product.description}</p>

          {/* Price reveal info */}
          <div style={styles.priceBox}>
            <div style={styles.priceIcon}>🔒</div>
            <div>
              <p style={styles.priceTitle}>السعر خاص لكل عميل</p>
              <p style={styles.priceHint}>أضف هذا المنتج لسلتك مع أصناف أخرى وستحصل على عرض سعر خاص بك</p>
            </div>
          </div>

          {/* Stock */}
          <div style={styles.stockRow}>
            <span style={{ color: product.stock > 0 ? '#22c55e' : '#ef4444', fontWeight: '700' }}>
              {product.stock > 0 ? `✓ متوفر في المخزون (${product.stock} قطعة)` : '✗ غير متوفر حالياً'}
            </span>
          </div>

          {/* Quantity selector */}
          <div style={styles.qtyRow}>
            <span style={{ color: 'var(--silver-dark)', fontSize: '0.85rem' }}>الكمية:</span>
            <div style={styles.qtyControls}>
              <button style={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span style={styles.qtyNum}>{qty}</span>
              <button style={styles.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          {/* Buttons */}
          <div style={styles.btnRow}>
            <button
              style={{ ...styles.addBtn, ...(added ? styles.addBtnDone : {}) }}
              onClick={handleAdd}
              disabled={product.stock === 0}
            >
              {added ? <><CheckCircle size={18} /> أُضيف للمجموعة!</> : <><ShoppingBag size={18} /> أضف إلى السلة لمعرفة السعر</>}
            </button>
            <button
              style={{ ...styles.wishBtnLg, color: wishlisted ? '#ef4444' : 'var(--silver)' }}
              onClick={() => toggleWishlist(product)}
            >
              <Heart size={20} fill={wishlisted ? '#ef4444' : 'none'} />
            </button>
            {/* WhatsApp Share */}
            <button style={styles.wishBtnLg} onClick={handleShare} title="شارك عبر واتساب">
              <Share2 size={20} style={{ color: '#25D366' }} />
            </button>
          </div>

          {/* Features */}
          <div style={styles.featuresGrid}>
            {features.map((f, i) => (
              <div key={i} style={styles.feature}>
                <span style={styles.featureIcon}>{f.icon}</span>
                <span style={styles.featureText}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section style={{ background: 'var(--black-mid)', padding: '60px 0' }}>
          <div className="container">
            <h2 style={styles.relatedTitle}>منتجات من نفس الفئة</h2>
            <div style={styles.relatedGrid}>
              {related.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} style={styles.relatedCard}>
                  <img src={p.image} alt={p.name} style={styles.relatedImg} />
                  <div style={styles.relatedInfo}>
                    <p style={styles.relatedBrand}>{p.brand}</p>
                    <p style={styles.relatedName}>{p.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section style={{ background: 'var(--black)', padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="container">
            <h2 style={styles.relatedTitle}>شاهدتها مؤخراً</h2>
            <div style={styles.relatedGrid}>
              {recentlyViewed.map(p => (
                <Link key={p.id} to={`/product/${p.id}`} style={styles.relatedCard}>
                  <img src={p.image} alt={p.name} style={styles.relatedImg} />
                  <div style={styles.relatedInfo}>
                    <p style={styles.relatedBrand}>{p.brand}</p>
                    <p style={styles.relatedName}>{p.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div style={styles.lightboxOverlay} onClick={() => setLightboxOpen(false)}>
          <button style={styles.lightboxClose} onClick={() => setLightboxOpen(false)}><X size={32} /></button>
          
          <div 
            style={styles.lightboxImgWrap} 
            onClick={e => e.stopPropagation()}
            onMouseMove={(e) => {
              const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - left) / width) * 100;
              const y = ((e.clientY - top) / height) * 100;
              setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(2.5)' });
            }}
            onMouseLeave={() => setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' })}
          >
            <img 
              src={gallery[galleryIdx]} 
              alt={product.name} 
              style={{ ...styles.lightboxImg, ...zoomStyle }} 
            />
          </div>

          {gallery.length > 1 && (
            <div style={styles.lightboxNav} onClick={e => e.stopPropagation()}>
              <button style={styles.lightboxArrow} onClick={() => setGalleryIdx(i => Math.max(0, i - 1))} disabled={galleryIdx === 0}>
                <ChevronRight size={24} />
              </button>
              <div style={styles.lightboxThumbs}>
                {gallery.map((img, i) => (
                  <button key={i} onClick={() => setGalleryIdx(i)} style={{ ...styles.lightboxThumb, borderColor: galleryIdx === i ? 'var(--gold)' : 'transparent' }}>
                    <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
              <button style={styles.lightboxArrow} onClick={() => setGalleryIdx(i => Math.min(gallery.length - 1, i + 1))} disabled={galleryIdx === gallery.length - 1}>
                <ChevronLeft size={24} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  breadcrumb: { background: 'var(--black-mid)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '14px 0' },
  breadcrumbInner: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' },
  crumb: { color: 'var(--silver-dark)', transition: 'var(--ease)' },
  crumbSep: { color: 'var(--silver-dark)', opacity: 0.4 },
  main: { display: 'flex', gap: '60px', padding: '60px 24px', flexWrap: 'wrap', alignItems: 'flex-start' },
  imageCol: { flex: '1', minWidth: '300px', maxWidth: '520px' },
  imageWrap: { position: 'relative', borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', background: 'var(--black-card)', cursor: 'zoom-in' },
  mainImage: { width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block', transition: 'opacity 0.3s ease' },
  zoomHint: { position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.6)', color: 'var(--white)', padding: '6px 12px', borderRadius: '50px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(4px)', pointerEvents: 'none' },
  imageOverlayBtns: { position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px', flexDirection: 'column' },
  wishBtn: { width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--silver)' },
  brandBadge: { position: 'absolute', top: '16px', right: '16px', padding: '5px 14px', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(201,169,110,0.4)', borderRadius: '50px', color: 'var(--gold)', fontSize: '0.8rem', fontWeight: '700', backdropFilter: 'blur(8px)' },
  galleryArrow: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)' },
  thumbsRow: { display: 'flex', gap: '10px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px' },
  thumb: { width: '72px', height: '72px', borderRadius: '10px', overflow: 'hidden', border: '2px solid transparent', cursor: 'pointer', flexShrink: 0, background: 'none', padding: 0 },
  thumbActive: { borderColor: 'var(--gold)', boxShadow: '0 0 0 2px rgba(201,169,110,0.3)' },
  // Social proof
  socialProof: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', padding: '8px 14px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '50px', width: 'fit-content' },
  socialDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', animation: 'waPulse 2s infinite', marginRight: '2px' },
  // Details
  detailsCol: { flex: '1', minWidth: '300px' },
  categoryTag: { display: 'inline-block', padding: '4px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '50px', color: 'var(--silver-dark)', fontSize: '0.8rem', marginBottom: '14px' },
  title: { fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: '900', color: 'var(--white)', lineHeight: 1.3, marginBottom: '16px' },
  desc: { fontSize: '1rem', color: 'var(--silver-dark)', lineHeight: 1.8, marginBottom: '28px' },
  priceBox: { display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '20px', background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 'var(--r-md)', marginBottom: '20px' },
  priceIcon: { fontSize: '1.8rem', flexShrink: 0 },
  priceTitle: { fontWeight: '800', color: 'var(--gold)', marginBottom: '4px', fontFamily: 'var(--font-heading)' },
  priceHint: { fontSize: '0.88rem', color: 'var(--silver-dark)', lineHeight: 1.6 },
  stockRow: { marginBottom: '20px', fontSize: '0.9rem' },
  // Quantity
  qtyRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
  qtyControls: { display: 'flex', alignItems: 'center', gap: '0', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--r-md)', overflow: 'hidden' },
  qtyBtn: { width: '40px', height: '40px', background: 'none', border: 'none', color: 'var(--gold)', fontSize: '1.2rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyNum: { width: '44px', textAlign: 'center', color: 'var(--white)', fontWeight: '800', fontFamily: 'var(--font-heading)' },
  btnRow: { display: 'flex', gap: '12px', marginBottom: '28px' },
  addBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '15px 24px', background: 'var(--grad-gold)', color: 'var(--black)', borderRadius: 'var(--r-md)', fontWeight: '800', fontSize: '1rem', fontFamily: 'var(--font-heading)', cursor: 'pointer', border: 'none', boxShadow: 'var(--shadow-gold)', transition: 'var(--ease-bounce)' },
  addBtnDone: { background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' },
  wishBtnLg: { width: '52px', height: '52px', borderRadius: 'var(--r-md)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: 'var(--silver)' },
  featuresGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  feature: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--r-md)' },
  featureIcon: { color: 'var(--gold)', flexShrink: 0 },
  featureText: { fontSize: '0.82rem', color: 'var(--silver-dark)', lineHeight: 1.4 },
  // Related
  relatedTitle: { fontSize: '1.5rem', fontWeight: '800', color: 'var(--white)', marginBottom: '24px' },
  relatedGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' },
  relatedCard: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-md)', overflow: 'hidden', transition: 'var(--ease)' },
  relatedImg: { width: '100%', height: '160px', objectFit: 'cover' },
  relatedInfo: { padding: '14px' },
  relatedBrand: { fontSize: '0.72rem', color: 'var(--gold)', fontWeight: '700', marginBottom: '4px' },
  relatedName: { fontSize: '0.88rem', color: 'var(--white)', fontWeight: '600' },
  // Lightbox
  lightboxOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  lightboxClose: { position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--white)', cursor: 'pointer', zIndex: 10000 },
  lightboxImgWrap: { width: '80%', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '8px', cursor: 'crosshair', border: '1px solid rgba(255,255,255,0.1)' },
  lightboxImg: { width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.1s ease-out' },
  lightboxNav: { display: 'flex', alignItems: 'center', gap: '24px', marginTop: '32px' },
  lightboxArrow: { background: 'rgba(255,255,255,0.1)', border: 'none', width: '48px', height: '48px', borderRadius: '50%', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' },
  lightboxThumbs: { display: 'flex', gap: '12px' },
  lightboxThumb: { width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '2px solid transparent', padding: 0, background: 'var(--black-light)', transition: 'border-color 0.2s' }
};

export default ProductDetail;
