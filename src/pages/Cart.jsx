import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { Trash2, Plus, Minus, ShoppingBag, Lock, Unlock } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQty, minItemsForPrice } = useContext(StoreContext);

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const bundlesTotal = cart.filter(i => !!i.items).reduce((acc, i) => acc + (i.price * i.qty), 0);

  const individualItems = cart.filter(item => !item.items);
  const uniqueTypesCount = individualItems.length;
  const isPriceRevealed = uniqueTypesCount === 0 || uniqueTypesCount >= minItemsForPrice;
  const remaining = minItemsForPrice - uniqueTypesCount;

  if (cart.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}><ShoppingBag size={64} style={{ opacity: 0.3 }} /></div>
        <h2 style={styles.emptyTitle}>سلة التسوق فارغة</h2>
        <p style={styles.emptyText}>لم تقم بإضافة أي منتجات بعد. ابدأ باختيار مجموعتك الآن!</p>
        <Link to="/shop" className="btn btn-gold btn-lg" style={{ marginTop: '24px' }}>
          <ShoppingBag size={18} />
          ابدأ التسوق
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div className="container">
        <h1 style={styles.pageTitle}>سلة التسوق</h1>
        <p style={styles.pageSubtitle}>{cart.length} منتج في سلتك</p>

        <div style={styles.layout}>
          {/* ─── ITEMS LIST ─── */}
          <div style={styles.itemsCol}>
            {cart.map(item => {
              const isBundle = !!item.items;
              return (
                <div key={item.id} style={styles.cartItem}>
                  <img src={item.image} alt={item.name} style={styles.itemImg} />
                  <div style={styles.itemInfo}>
                    <p style={styles.itemBrand}>{item.brand || 'عرض مجمع'}</p>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    {isBundle ? (
                      <p style={styles.itemPriceBundle}>{item.price.toLocaleString()} ج.م</p>
                    ) : (
                      <div style={styles.itemPriceHidden}>
                        <Lock size={12} />
                        <span>السعر مخفي</span>
                      </div>
                    )}
                  </div>
                  <div style={styles.qtyRow}>
                    <button style={styles.qtyBtn} onClick={() => updateQty(item.id, -1)}>
                      <Minus size={14} />
                    </button>
                    <span style={styles.qty}>{item.qty}</span>
                    <button style={styles.qtyBtn} onClick={() => updateQty(item.id, 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  {isBundle && (
                    <p style={styles.lineTotal}>{(item.price * item.qty).toLocaleString()} ج.م</p>
                  )}
                  <button style={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={17} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* ─── SUMMARY ─── */}
          <div style={styles.summaryCol}>
            <div style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>ملخص طلبك</h3>

              {/* Progress */}
              {uniqueTypesCount > 0 && (
                <div style={styles.progressSection}>
                  <div style={styles.progressHeader}>
                    {isPriceRevealed
                      ? <><Unlock size={14} style={{ color: 'var(--gold)' }} /> <span style={{ color: 'var(--gold)', fontWeight: '700' }}>تم كشف السعر!</span></>
                      : <><Lock size={14} style={{ color: 'var(--silver-dark)' }} /> <span style={{ color: 'var(--silver-dark)' }}>متبقي {remaining} صنف مختلف لكشف السعر</span></>
                    }
                  </div>
                  <div style={styles.progressBar}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${Math.min((uniqueTypesCount / minItemsForPrice) * 100, 100)}%`,
                    }} />
                  </div>
                  <p style={styles.progressText}>{uniqueTypesCount} من {minItemsForPrice} أصناف مختلفة</p>
                </div>
              )}

              {!isPriceRevealed && uniqueTypesCount > 0 && (
                <div style={styles.alertBox}>
                  <p>أضف <strong style={{ color: 'var(--gold)' }}>{remaining}</strong> صنف مختلف إضافي لمعرفة سعر مجموعتك الخاصة</p>
                  <Link to="/shop" className="btn btn-dark" style={{ marginTop: '12px', width: '100%', textAlign: 'center' }}>
                    أضف المزيد من المتجر
                  </Link>
                </div>
              )}

              {/* Price rows */}
              <div style={styles.rows}>
                {bundlesTotal > 0 && (
                  <div style={styles.row}>
                    <span style={styles.rowLabel}>العروض المجمعة</span>
                    <span style={styles.rowVal}>{bundlesTotal.toLocaleString()} ج.م</span>
                  </div>
                )}
                {isPriceRevealed && uniqueTypesCount > 0 && (
                  <div style={styles.row}>
                    <span style={styles.rowLabel}>القطع الفردية</span>
                    <span style={styles.rowVal}>{(total - bundlesTotal).toLocaleString()} ج.م</span>
                  </div>
                )}
                <div style={styles.row}>
                  <span style={styles.rowLabel}>التوصيل</span>
                  <span style={{ color: 'var(--gold)', fontWeight: '700' }}>مجاناً</span>
                </div>
              </div>

              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>الإجمالي</span>
                <span style={styles.totalVal}>
                  {isPriceRevealed ? `${total.toLocaleString()} ج.م` : '---'}
                </span>
              </div>

              {isPriceRevealed ? (
                <Link to="/checkout" className="btn btn-gold" style={{ width: '100%', marginTop: '20px' }}>
                  إتمام الطلب
                </Link>
              ) : (
                <button
                  className="btn btn-dark"
                  style={{ width: '100%', marginTop: '20px', opacity: 0.6, cursor: 'not-allowed' }}
                  disabled
                >
                  استكمل المجموعة أولاً
                </button>
              )}

              <p style={styles.secureNote}>🔒 بياناتك آمنة ومحمية تماماً</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    background: 'var(--black)',
    minHeight: '100vh',
    padding: '60px 0 80px',
  },
  pageTitle: {
    fontSize: '2.2rem',
    fontWeight: '900',
    color: 'var(--white)',
    marginBottom: '4px',
    fontFamily: 'var(--font-heading)',
  },
  pageSubtitle: {
    color: 'var(--silver-dark)',
    marginBottom: '40px',
    fontSize: '0.9rem',
  },
  layout: {
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  itemsCol: {
    flex: '1',
    minWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: 'var(--grad-card)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 'var(--r-lg)',
    flexWrap: 'wrap',
  },
  itemImg: {
    width: '90px',
    height: '90px',
    objectFit: 'cover',
    borderRadius: 'var(--r-md)',
    flexShrink: 0,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  itemInfo: { flex: 1, minWidth: '120px' },
  itemBrand: {
    fontSize: '0.72rem',
    color: 'var(--gold)',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  itemName: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--white)',
    lineHeight: 1.4,
    marginBottom: '6px',
  },
  itemPriceBundle: {
    color: 'var(--gold)',
    fontWeight: '700',
    fontSize: '1rem',
  },
  itemPriceHidden: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: 'var(--silver-dark)',
    fontSize: '0.8rem',
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '50px',
    padding: '4px 12px',
  },
  qtyBtn: {
    background: 'none',
    color: 'var(--silver)',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    cursor: 'pointer',
  },
  qty: {
    fontWeight: '700',
    color: 'var(--white)',
    minWidth: '20px',
    textAlign: 'center',
  },
  lineTotal: {
    fontWeight: '700',
    color: 'var(--gold)',
    minWidth: '90px',
    textAlign: 'center',
  },
  removeBtn: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.2)',
    color: '#ef4444',
    padding: '8px',
    borderRadius: 'var(--r-sm)',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'var(--ease)',
  },
  summaryCol: {
    width: '360px',
    flexShrink: 0,
  },
  summaryCard: {
    background: 'var(--grad-card)',
    border: '1px solid rgba(201,169,110,0.2)',
    borderRadius: 'var(--r-lg)',
    padding: '28px',
    position: 'sticky',
    top: '110px',
  },
  summaryTitle: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: 'var(--white)',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    fontFamily: 'var(--font-heading)',
  },
  progressSection: {
    marginBottom: '20px',
  },
  progressHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    marginBottom: '10px',
  },
  progressBar: {
    height: '6px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '6px',
  },
  progressFill: {
    height: '100%',
    background: 'var(--grad-gold)',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  },
  progressText: {
    fontSize: '0.75rem',
    color: 'var(--silver-dark)',
    textAlign: 'right',
  },
  alertBox: {
    background: 'rgba(201,169,110,0.07)',
    border: '1px solid rgba(201,169,110,0.25)',
    borderRadius: 'var(--r-md)',
    padding: '16px',
    color: 'var(--silver)',
    fontSize: '0.88rem',
    lineHeight: 1.6,
    marginBottom: '20px',
  },
  rows: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
  },
  rowLabel: { color: 'var(--silver-dark)' },
  rowVal: { color: 'var(--silver)', fontWeight: '600' },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  totalLabel: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: 'var(--white)',
    fontFamily: 'var(--font-heading)',
  },
  totalVal: {
    fontSize: '1.5rem',
    fontWeight: '900',
    color: 'var(--gold)',
    fontFamily: 'var(--font-heading)',
  },
  secureNote: {
    textAlign: 'center',
    fontSize: '0.75rem',
    color: 'var(--silver-dark)',
    marginTop: '14px',
  },
  empty: {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '40px 20px',
    background: 'var(--black)',
  },
  emptyIcon: {
    color: 'var(--silver-dark)',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '1.8rem',
    color: 'var(--white)',
    marginBottom: '10px',
  },
  emptyText: {
    color: 'var(--silver-dark)',
    fontSize: '1rem',
  },
};

export default Cart;
