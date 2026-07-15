import { useState } from 'react';
import { OrdersDB } from '../db/database';
import { Search, Package, Clock, CheckCircle, Truck, XCircle, ArrowRight } from 'lucide-react';

const statusConfig = {
  pending:   { label: 'قيد الانتظار', desc: 'تم استلام طلبك وسيتم مراجعته قريباً', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', icon: <Clock size={32} /> },
  confirmed: { label: 'مؤكد', desc: 'تم تأكيد طلبك وجاري التجهيز', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', icon: <CheckCircle size={32} /> },
  delivered: { label: 'تم التوصيل', desc: 'تم توصيل طلبك بنجاح. نتمنى لك تجربة رائعة!', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: <Truck size={32} /> },
  cancelled: { label: 'ملغي', desc: 'تم إلغاء هذا الطلب. تواصل معنا للاستفسار', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: <XCircle size={32} /> },
};

const steps = ['قيد الانتظار', 'مؤكد', 'جاري التوصيل', 'تم التوصيل'];
const stepKeys = ['pending', 'confirmed', 'shipping', 'delivered'];

const OrderTracking = () => {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setSearched(true);
    if (!query.trim()) { setError('يرجى إدخال رقم الطلب'); return; }

    const allOrders = OrdersDB.getAll();
    // search by partial ID match (last digits) or full ID
    const found = allOrders.find(o =>
      o.id === query.trim() ||
      o.id.toLowerCase().endsWith(query.trim().toLowerCase()) ||
      o.id.toLowerCase().includes(query.trim().toLowerCase())
    );

    if (found) setOrder(found);
    else setError('لم يتم العثور على طلب بهذا الرقم. تأكد من الرقم وحاول مرة أخرى');
  };

  const getStepIndex = (status) => {
    const map = { pending: 0, confirmed: 1, shipping: 2, delivered: 3, cancelled: -1 };
    return map[status] ?? 0;
  };

  const cfg = order ? (statusConfig[order.status] || statusConfig.pending) : null;
  const stepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      {/* Hero */}
      <div className="page-hero">
        <div className="container">
          <span className="section-tag">متابعة الطلبات</span>
          <h1 style={{ color: 'var(--white)', marginTop: '12px' }}>
            تتبع <span style={{ background: 'var(--grad-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>طلبك</span>
          </h1>
          <p>أدخل رقم طلبك لمعرفة حالته الحالية دون الحاجة لتسجيل الدخول</p>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px 80px', maxWidth: '720px' }}>

        {/* Search Box */}
        <form onSubmit={handleSearch} style={styles.searchBox}>
          <div style={styles.searchInner}>
            <Search size={20} style={styles.searchIcon} />
            <input
              type="text"
              className="form-control"
              style={{ paddingRight: '48px', paddingLeft: '16px', height: '56px', fontSize: '1rem' }}
              placeholder="أدخل رقم الطلب (مثال: 12345678)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              dir="ltr"
            />
          </div>
          <button type="submit" className="btn btn-gold btn-lg" style={{ flexShrink: 0 }}>
            بحث <ArrowRight size={18} />
          </button>
        </form>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <XCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Result */}
        {order && cfg && (
          <div style={styles.resultCard}>
            {/* Status Header */}
            <div style={{ ...styles.statusHeader, background: cfg.bg, borderColor: `${cfg.color}40` }}>
              <div style={{ color: cfg.color }}>{cfg.icon}</div>
              <div>
                <p style={{ color: 'var(--silver-dark)', fontSize: '0.8rem', marginBottom: '4px' }}>حالة طلبك</p>
                <h2 style={{ color: cfg.color, fontSize: '1.6rem', fontWeight: '900', fontFamily: 'var(--font-heading)' }}>{cfg.label}</h2>
                <p style={{ color: 'var(--silver)', marginTop: '4px', fontSize: '0.9rem' }}>{cfg.desc}</p>
              </div>
            </div>

            {/* Progress Steps (only if not cancelled) */}
            {order.status !== 'cancelled' && (
              <div style={styles.stepsWrap}>
                {steps.map((step, i) => (
                  <div key={i} style={styles.stepItem}>
                    <div style={{
                      ...styles.stepDot,
                      background: i <= stepIdx ? 'var(--grad-gold)' : 'rgba(255,255,255,0.08)',
                      color: i <= stepIdx ? 'var(--black)' : 'var(--silver-dark)',
                    }}>
                      {i <= stepIdx ? <CheckCircle size={16} /> : <span style={{ fontWeight: '700', fontSize: '0.8rem' }}>{i + 1}</span>}
                    </div>
                    <span style={{ color: i <= stepIdx ? 'var(--gold)' : 'var(--silver-dark)', fontSize: '0.8rem', fontWeight: i <= stepIdx ? '700' : '400', marginTop: '8px', textAlign: 'center' }}>{step}</span>
                    {i < steps.length - 1 && (
                      <div style={{ ...styles.stepLine, background: i < stepIdx ? 'var(--gold)' : 'rgba(255,255,255,0.08)' }} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Order Details */}
            <div style={styles.detailsGrid}>
              <div style={styles.detailBox}>
                <p style={styles.detailLabel}>رقم الطلب</p>
                <p style={{ ...styles.detailVal, fontFamily: 'monospace', color: 'var(--gold)', fontSize: '0.9rem' }}>{order.id}</p>
              </div>
              <div style={styles.detailBox}>
                <p style={styles.detailLabel}>تاريخ الطلب</p>
                <p style={styles.detailVal}>{new Date(order.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div style={styles.detailBox}>
                <p style={styles.detailLabel}>الاسم</p>
                <p style={styles.detailVal}>{order.customer?.name}</p>
              </div>
              <div style={styles.detailBox}>
                <p style={styles.detailLabel}>المدينة</p>
                <p style={styles.detailVal}>{order.customer?.city}</p>
              </div>
              <div style={{ ...styles.detailBox, gridColumn: '1/-1', background: 'rgba(201,169,110,0.06)', borderColor: 'rgba(201,169,110,0.2)' }}>
                <p style={styles.detailLabel}>إجمالي الطلب</p>
                <p style={{ ...styles.detailVal, fontSize: '1.4rem', color: 'var(--gold)' }}>{order.total?.toLocaleString()} ج.م</p>
              </div>
            </div>

            {/* Items */}
            <div style={styles.itemsSection}>
              <p style={styles.itemsTitle}><Package size={16} /> المنتجات ({order.items?.length || 0})</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {order.items?.map((item, i) => (
                  <div key={i} style={styles.itemRow}>
                    <img src={item.image} alt={item.name} style={styles.itemImg} />
                    <span style={{ flex: 1, color: 'var(--silver)', fontSize: '0.9rem' }}>{item.name}</span>
                    <span style={{ color: 'var(--silver-dark)', fontSize: '0.85rem' }}>x{item.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty / Guide */}
        {!searched && (
          <div style={styles.guide}>
            <Package size={48} style={{ color: 'var(--silver-dark)', marginBottom: '16px', opacity: 0.4 }} />
            <p style={{ color: 'var(--silver-dark)' }}>أدخل رقم الطلب الذي حصلت عليه بعد إتمام الطلب</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  searchBox: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  searchInner: { position: 'relative', flex: 1, minWidth: '240px' },
  searchIcon: { position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--silver-dark)', zIndex: 1 },
  errorBox: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--r-md)', color: '#ef4444', marginBottom: '24px' },
  resultCard: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-xl)', overflow: 'hidden' },
  statusHeader: { display: 'flex', alignItems: 'flex-start', gap: '20px', padding: '28px', border: '1px solid', borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderTop: 'none' },
  stepsWrap: { display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 24px', position: 'relative', gap: '0' },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' },
  stepDot: { width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  stepLine: { position: 'absolute', top: '19px', left: '50%', width: '100%', height: '2px', zIndex: 0 },
  detailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '0 24px 24px' },
  detailBox: { padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-md)' },
  detailLabel: { color: 'var(--silver-dark)', fontSize: '0.75rem', marginBottom: '6px' },
  detailVal: { color: 'var(--white)', fontWeight: '700' },
  itemsSection: { padding: '0 24px 28px' },
  itemsTitle: { display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--silver)', fontWeight: '700', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  itemRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--r-md)' },
  itemImg: { width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 },
  guide: { textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
};

export default OrderTracking;
