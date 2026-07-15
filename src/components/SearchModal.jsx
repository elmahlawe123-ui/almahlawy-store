import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductsDB } from '../db/database';
import { Search, X } from 'lucide-react';

const SearchModal = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
      setTimeout(() => document.getElementById('search-input-modal')?.focus(), 100);
    };
    document.addEventListener('open-search', handleOpen);
    return () => document.removeEventListener('open-search', handleOpen);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const res = ProductsDB.getActive().filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    setResults(res.slice(0, 8));
  }, [query]);

  if (!open) return null;

  return (
    <div style={styles.overlay} onClick={() => setOpen(false)}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.inputWrap}>
            <Search size={20} style={styles.searchIcon} />
            <input
              id="search-input-modal"
              type="text"
              placeholder="ابحث عن المنتجات..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={styles.input}
            />
          </div>
          <button style={styles.closeBtn} onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div style={styles.body}>
          {!query.trim() ? (
            <div style={styles.emptyState}>
              <Search size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p>ابحث عن منتجاتك المفضلة</p>
            </div>
          ) : results.length > 0 ? (
            <div style={styles.resultsGrid}>
              {results.map(p => (
                <div key={p.id} style={styles.resultCard} onClick={() => {
                  setOpen(false);
                  navigate(`/product/${p.id}`);
                }}>
                  <img src={p.image} alt={p.name} style={styles.resultImg} />
                  <div style={styles.resultInfo}>
                    <p style={styles.resultBrand}>{p.brand}</p>
                    <p style={styles.resultName}>{p.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p>لا توجد نتائج مطابقة لـ "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 10000, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' },
  modal: { width: '100%', maxWidth: '800px', background: 'var(--black)', borderRadius: 'var(--r-lg)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', marginTop: '60px', animation: 'fadeInUp 0.3s ease' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  inputWrap: { flex: 1, position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', right: '16px', color: 'var(--silver-dark)' },
  input: { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', padding: '16px 48px 16px 20px', color: 'var(--white)', fontSize: '1.1rem', outline: 'none' },
  closeBtn: { background: 'none', border: 'none', color: 'var(--silver)', cursor: 'pointer', padding: '8px' },
  body: { minHeight: '300px', maxHeight: '60vh', overflowY: 'auto', padding: '20px' },
  emptyState: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--silver-dark)', padding: '60px 0' },
  resultsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' },
  resultCard: { background: 'var(--black-mid)', borderRadius: 'var(--r-md)', overflow: 'hidden', cursor: 'pointer', transition: 'var(--ease)', border: '1px solid rgba(255,255,255,0.05)' },
  resultImg: { width: '100%', height: '140px', objectFit: 'cover' },
  resultInfo: { padding: '12px' },
  resultBrand: { color: 'var(--gold)', fontSize: '0.75rem', fontWeight: '700', marginBottom: '4px' },
  resultName: { color: 'var(--white)', fontSize: '0.9rem', fontWeight: '600' }
};

export default SearchModal;
