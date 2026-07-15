import { useState, useEffect, useContext } from 'react';
import { ProductsDB } from '../db/database';
import { Scale, Search, X, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

const Compare = () => {
  const [product1, setProduct1] = useState(null);
  const [product2, setProduct2] = useState(null);
  
  const [searchOpen1, setSearchOpen1] = useState(false);
  const [searchOpen2, setSearchOpen2] = useState(false);
  const [query1, setQuery1] = useState('');
  const [query2, setQuery2] = useState('');
  
  const [allProducts, setAllProducts] = useState([]);
  const { addToCart } = useContext(StoreContext);

  useEffect(() => {
    setAllProducts(ProductsDB.getActive());
  }, []);

  const handleSelect1 = (p) => { setProduct1(p); setSearchOpen1(false); setQuery1(''); };
  const handleSelect2 = (p) => { setProduct2(p); setSearchOpen2(false); setQuery2(''); };

  const renderSearch = (query, setQuery, onSelect, isOpen, setOpen) => {
    if (!isOpen) return (
      <button style={styles.addBtn} onClick={() => setOpen(true)}>
        <Search size={24} style={{ marginBottom: '12px' }} />
        <span>اختر منتج للمقارنة</span>
      </button>
    );
    
    const results = allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    
    return (
      <div style={styles.searchBox}>
        <div style={styles.searchInputWrap}>
          <Search size={18} style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="ابحث عن منتج..." 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            style={styles.searchInput}
            autoFocus
          />
          <button style={styles.closeSearch} onClick={() => setOpen(false)}><X size={16} /></button>
        </div>
        <div style={styles.resultsList}>
          {results.map(p => (
            <div key={p.id} style={styles.resultItem} onClick={() => onSelect(p)}>
              <img src={p.image} alt={p.name} style={styles.resultImg} />
              <div>
                <p style={styles.resultName}>{p.name}</p>
                <p style={styles.resultBrand}>{p.brand}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProductColumn = (product, removeProduct) => {
    if (!product) return null;
    return (
      <div style={styles.productCol}>
        <button style={styles.removeProductBtn} onClick={removeProduct}><X size={16} /></button>
        <img src={product.image} alt={product.name} style={styles.mainImg} />
        <p style={styles.brand}>{product.brand}</p>
        <Link to={`/product/${product.id}`} style={styles.nameLink}>
          <h2 style={styles.name}>{product.name}</h2>
        </Link>
        <p style={styles.category}>{product.category}</p>
        
        <div style={styles.specs}>
          <div style={styles.specRow}>
            <span style={styles.specLabel}>التوفر:</span>
            <span style={{ color: product.stock > 0 ? '#22c55e' : '#ef4444', fontWeight: '700' }}>
              {product.stock > 0 ? '✓ متوفر' : '✗ غير متوفر'}
            </span>
          </div>
          <div style={styles.specRow}>
            <span style={styles.specLabel}>الماركة:</span>
            <span style={styles.specValue}>{product.brand}</span>
          </div>
          <div style={styles.specRow}>
            <span style={styles.specLabel}>النوع:</span>
            <span style={styles.specValue}>{product.category}</span>
          </div>
          <div style={{ ...styles.specRow, flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={styles.specLabel}>الوصف:</span>
            <span style={{ ...styles.specValue, marginTop: '8px', lineHeight: 1.6, fontSize: '0.85rem' }}>
              {product.description}
            </span>
          </div>
        </div>

        <button 
          className="btn btn-gold" 
          style={{ width: '100%', marginTop: 'auto', display: 'flex', gap: '8px', justifyContent: 'center' }}
          onClick={() => {
            addToCart(product);
            document.dispatchEvent(new CustomEvent('open-cart-drawer'));
          }}
        >
          <ShoppingBag size={18} /> أضف للسلة
        </button>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <div className="page-hero">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag"><Scale size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}/> المقارنة</span>
          <h1 style={{ color: 'var(--white)', marginTop: '12px' }}>
            قارن <span style={{ background: 'var(--grad-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>المنتجات</span>
          </h1>
        </div>
      </div>

      <div className="container" style={styles.container}>
        <div className="compare-grid" style={styles.grid}>
          {/* Column 1 */}
          <div style={styles.colWrap}>
            {!product1 ? renderSearch(query1, setQuery1, handleSelect1, searchOpen1, setSearchOpen1) : renderProductColumn(product1, () => setProduct1(null))}
          </div>
          
          {/* VS Badge */}
          <div style={styles.vsBadge}>VS</div>

          {/* Column 2 */}
          <div style={styles.colWrap}>
            {!product2 ? renderSearch(query2, setQuery2, handleSelect2, searchOpen2, setSearchOpen2) : renderProductColumn(product2, () => setProduct2(null))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: 'var(--black)', paddingBottom: '80px' },
  container: { marginTop: '40px' },
  grid: { display: 'flex', gap: '30px', position: 'relative', minHeight: '500px', flexWrap: 'wrap' },
  colWrap: { flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column' },
  vsBadge: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '48px', height: '48px', borderRadius: '50%', background: 'var(--grad-gold)', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.1rem', zIndex: 10, boxShadow: 'var(--shadow-gold)' },
  addBtn: { flex: 1, background: 'rgba(255,255,255,0.02)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--silver-dark)', cursor: 'pointer', transition: 'var(--ease)', minHeight: '400px' },
  searchBox: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r-lg)', padding: '20px', flex: 1, minHeight: '400px' },
  searchInputWrap: { position: 'relative', marginBottom: '20px' },
  searchIcon: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--silver-dark)' },
  searchInput: { width: '100%', padding: '12px 36px 12px 12px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--r-md)', color: 'var(--white)', outline: 'none' },
  closeSearch: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--silver)', cursor: 'pointer' },
  resultsList: { display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' },
  resultItem: { display: 'flex', gap: '12px', padding: '8px', borderRadius: '8px', cursor: 'pointer', background: 'rgba(255,255,255,0.03)', transition: 'var(--ease)' },
  resultImg: { width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' },
  resultName: { color: 'var(--white)', fontSize: '0.85rem', fontWeight: '600' },
  resultBrand: { color: 'var(--gold)', fontSize: '0.7rem' },
  productCol: { flex: 1, background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', padding: '24px', position: 'relative', display: 'flex', flexDirection: 'column', animation: 'fadeInUp 0.4s ease' },
  removeProductBtn: { position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 5 },
  mainImg: { width: '100%', height: '240px', objectFit: 'cover', borderRadius: 'var(--r-md)', marginBottom: '20px' },
  brand: { color: 'var(--gold)', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' },
  nameLink: { textDecoration: 'none', color: 'inherit' },
  name: { fontSize: '1.4rem', color: 'var(--white)', fontWeight: '800', marginBottom: '8px', lineHeight: 1.3 },
  category: { color: 'var(--silver-dark)', fontSize: '0.9rem', marginBottom: '24px' },
  specs: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' },
  specRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  specLabel: { color: 'var(--silver)', fontSize: '0.9rem', fontWeight: '600' },
  specValue: { color: 'var(--white)', fontSize: '0.9rem', fontWeight: '700' }
};

export default Compare;
