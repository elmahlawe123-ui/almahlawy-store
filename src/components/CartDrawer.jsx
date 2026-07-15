import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { X, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';

const CartDrawer = () => {
  const [open, setOpen] = useState(false);
  const { cart, removeFromCart, updateQty, isPriceRevealed, minItemsForPrice } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    document.addEventListener('open-cart-drawer', handleOpen);
    return () => document.removeEventListener('open-cart-drawer', handleOpen);
  }, []);

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      <div 
        style={{ ...styles.backdrop, opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none' }} 
        onClick={() => setOpen(false)} 
      />
      
      <div style={{ ...styles.drawer, transform: open ? 'translateX(0)' : 'translateX(100%)' }}>
        <div style={styles.header}>
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>سلة التسوق ({totalItems})</h2>
          <button style={styles.closeBtn} onClick={() => setOpen(false)}><X size={20} /></button>
        </div>

        <div style={styles.body}>
          {cart.length === 0 ? (
            <div style={styles.empty}>
              <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p>السلة فارغة</p>
              <button className="btn btn-gold" style={{ marginTop: '20px' }} onClick={() => { setOpen(false); navigate('/shop'); }}>
                تسوق الآن
              </button>
            </div>
          ) : (
            <div style={styles.itemsList}>
              {cart.map(item => (
                <div key={item.id} style={styles.itemCard}>
                  <img src={item.image} alt={item.name} style={styles.itemImg} />
                  <div style={styles.itemInfo}>
                    <p style={styles.itemName}>{item.name}</p>
                    <div style={styles.itemControls}>
                      <div style={styles.qtyBox}>
                        <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                        <span>{item.qty}</span>
                        <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                      </div>
                      <button style={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={styles.footer}>
            {!isPriceRevealed && (
              <div style={styles.progressBox}>
                <p style={{ fontSize: '0.8rem', color: 'var(--silver)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>أضف {Math.max(0, minItemsForPrice - totalItems)} عناصر إضافية</span>
                  <span>لمعرفة السعر</span>
                </p>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (totalItems / minItemsForPrice) * 100)}%`, height: '100%', background: 'var(--gold)', transition: 'width 0.3s ease' }} />
                </div>
              </div>
            )}
            <Link to="/checkout" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }} onClick={() => setOpen(false)}>
              متابعة الدفع
            </Link>
            <Link to="/cart" style={styles.viewCartLink} onClick={() => setOpen(false)}>
              عرض السلة كاملة <ArrowLeft size={16} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9000, transition: 'opacity 0.3s ease' },
  drawer: { position: 'fixed', top: 0, bottom: 0, right: 0, width: '400px', maxWidth: '100vw', background: 'var(--black-mid)', zIndex: 9001, transition: 'transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)', display: 'flex', flexDirection: 'column', borderLeft: '1px solid rgba(255,255,255,0.1)' },
  header: { padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  closeBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--white)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  body: { flex: 1, overflowY: 'auto', padding: '24px' },
  empty: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--silver-dark)' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  itemCard: { display: 'flex', gap: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--r-md)', border: '1px solid rgba(255,255,255,0.05)' },
  itemImg: { width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' },
  itemInfo: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  itemName: { fontSize: '0.9rem', fontWeight: '600', color: 'var(--white)', marginBottom: '8px', lineHeight: 1.4 },
  itemControls: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  qtyBox: { display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '50px', padding: '4px 12px', border: '1px solid rgba(255,255,255,0.1)' },
  qtyBtn: { background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontWeight: '700', fontSize: '1.2rem', padding: '0 4px' },
  removeBtn: { color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
  footer: { padding: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'var(--black)' },
  progressBox: { marginBottom: '20px', padding: '16px', background: 'rgba(201,169,110,0.06)', borderRadius: 'var(--r-sm)', border: '1px solid rgba(201,169,110,0.2)' },
  viewCartLink: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--silver)', textDecoration: 'none', fontSize: '0.9rem', transition: 'var(--ease)' }
};

export default CartDrawer;
