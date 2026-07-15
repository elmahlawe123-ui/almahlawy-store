import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { ProductsDB, CategoriesDB } from '../db/database';
import { SlidersHorizontal, Search } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeBrand, setActiveBrand] = useState('الكل');
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);

  const BRANDS = ['بولو بلاست', 'استاندورف', 'ايديال ستاندرد', 'جروهى', 'بانيوهات الطيب', 'بليزا'];

  useEffect(() => {
    setLoading(true);
    // Simulate realistic async load
    setTimeout(() => {
      setProducts(ProductsDB.getActive());
      setCategories(CategoriesDB.getAll());
      setLoading(false);
    }, 700);
  }, []);

  const base = products.filter(p => {
    const brandMatch = activeBrand === 'الكل' || p.brand === activeBrand;
    const catMatch = activeCategory === 'الكل' || p.category === activeCategory;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return brandMatch && catMatch && searchMatch;
  });
  const filtered = sortBy === 'name'
    ? [...base].sort((a, b) => a.name.localeCompare(b.name, 'ar'))
    : sortBy === 'stock'
    ? [...base].sort((a, b) => b.stock - a.stock)
    : base;

  return (
    <div style={styles.page}>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <span className="section-tag">القطع المنفصلة</span>
          <h1 style={{ color: 'var(--white)', marginTop: '12px' }}>
            تسوق <span style={{ background: 'var(--grad-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>مجموعتك</span>
          </h1>
          <p>اختر الأصناف المختلفة وكوّن مجموعتك لمعرفة سعرها</p>
        </div>
      </div>

      <div className="container shop-layout" style={{ paddingTop: '48px' }}>
        {/* ─── SIDEBAR ─── */}
        <aside className="shop-sidebar" style={styles.sidebar}>
          <div style={styles.filterCard}>
            <div style={styles.filterHeader}>
              <SlidersHorizontal size={16} />
              <span>تصفية المنتجات</span>
            </div>
            
            {/* Search */}
            <div style={{ ...styles.filterSection, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--silver-dark)' }} />
                <input 
                  type="text"
                  placeholder="ابحث عن منتج..."
                  className="form-control"
                  style={{ paddingRight: '36px', height: '40px' }}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Brands */}
            <div style={styles.filterSection}>
              <p style={styles.filterLabel}>حسب الماركة</p>
              <div style={styles.filterChips}>
                {['الكل', ...BRANDS].map(brand => (
                  <button
                    key={brand}
                    onClick={() => setActiveBrand(brand)}
                    style={{
                      ...styles.chip,
                      ...(activeBrand === brand ? styles.chipActive : {}),
                    }}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div style={styles.filterSection}>
              <p style={styles.filterLabel}>حسب النوع</p>
              <div style={styles.filterChips}>
                {['الكل', ...categories.map(c => c.name)].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      ...styles.chip,
                      ...(activeCategory === cat ? styles.chipActive : {}),
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ─── PRODUCTS ─── */}
        <div style={styles.main}>
          <div style={styles.resultsBar}>
            <span style={styles.resultsCount}>{loading ? '...' : `${filtered.length} منتج`}</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={styles.sortSelect}
            >
              <option value="default">ترتيب: الافتراضي</option>
              <option value="name">ترتيب: الاسم</option>
              <option value="stock">ترتيب: الأكثر توفراً</option>
            </select>
            {(activeBrand !== 'الكل' || activeCategory !== 'الكل' || searchQuery !== '') && (
              <button
                style={styles.clearBtn}
                onClick={() => { setActiveBrand('الكل'); setActiveCategory('الكل'); setSearchQuery(''); }}
              >
                مسح التصفية
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-3">
              {[...Array(6)].map((_, i) => (
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
          ) : filtered.length > 0 ? (
            <div className="grid grid-3">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div style={styles.empty}>
              <p style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</p>
              <p style={{ color: 'var(--silver-dark)', fontSize: '1.1rem' }}>لا توجد منتجات لهذا التصنيف</p>
              <button className="btn btn-dark" style={{ marginTop: '20px' }} onClick={() => { setActiveBrand('الكل'); setActiveCategory('الكل'); setSearchQuery(''); }}>
                عرض الكل
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    background: 'var(--black)',
    minHeight: '100vh',
    paddingBottom: '80px',
  },
  layout: {
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
    paddingTop: '48px',
  },
  sidebar: { width: '280px', flexShrink: 0 },
  filterCard: {
    background: 'var(--grad-card)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 'var(--r-lg)',
    overflow: 'hidden',
    position: 'sticky',
    top: '100px',
  },
  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '18px 20px',
    background: 'rgba(201,169,110,0.06)',
    borderBottom: '1px solid rgba(201,169,110,0.15)',
    color: 'var(--gold)',
    fontWeight: '700',
    fontFamily: 'var(--font-heading)',
    fontSize: '0.95rem',
  },
  filterSection: {
    padding: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  filterLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--silver-dark)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  filterChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  chip: {
    padding: '6px 14px',
    borderRadius: '50px',
    fontSize: '0.82rem',
    fontWeight: '600',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'var(--silver-dark)',
    cursor: 'pointer',
    transition: 'var(--ease)',
    fontFamily: 'var(--font-body)',
  },
  chipActive: {
    background: 'rgba(201,169,110,0.15)',
    borderColor: 'rgba(201,169,110,0.5)',
    color: 'var(--gold)',
  },
  main: { flex: 1 },
  resultsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  resultsCount: {
    color: 'var(--silver-dark)',
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  clearBtn: {
    background: 'rgba(201,169,110,0.1)',
    border: '1px solid rgba(201,169,110,0.25)',
    color: 'var(--gold)',
    padding: '6px 16px',
    borderRadius: '50px',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'var(--grad-card)',
    borderRadius: 'var(--r-lg)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  sortSelect: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--silver)',
    padding: '6px 12px',
    borderRadius: 'var(--r-md)',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
  },
};

export default Shop;
