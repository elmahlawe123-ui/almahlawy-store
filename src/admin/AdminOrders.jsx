import { useState, useEffect } from 'react';
import { OrdersDB } from '../db/database';
import { Eye, CheckCircle, Clock, X, Package, Download } from 'lucide-react';

const statusColors = {
  pending:   { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: 'rgba(251,191,36,0.3)', label: 'قيد الانتظار' },
  confirmed: { bg: 'rgba(34,197,94,0.12)',  color: '#22c55e', border: 'rgba(34,197,94,0.3)',  label: 'مؤكد' },
  delivered: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: 'rgba(59,130,246,0.3)', label: 'تم التوصيل' },
  cancelled: { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', border: 'rgba(239,68,68,0.3)',  label: 'ملغي' },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => setOrders(OrdersDB.getAll());
  useEffect(() => { load(); }, []);

  const updateStatus = (id, status) => {
    const all = OrdersDB.getAll();
    const idx = all.findIndex(o => o.id === id);
    if (idx !== -1) {
      all[idx].status = status;
      localStorage.setItem('db_orders', JSON.stringify(all));
      load();
      if (selected?.id === id) setSelected({ ...selected, status });
    }
  };

  const exportToCSV = () => {
    const headers = ['رقم الطلب', 'العميل', 'الهاتف', 'المدينة', 'الإجمالي', 'الخصم', 'كود الخصم', 'الحالة', 'التاريخ'];
    const rows = orders.map(o => [
      o.id,
      o.customer?.name || '',
      o.customer?.phone || '',
      o.customer?.city || '',
      o.total || 0,
      o.discount || 0,
      o.coupon || 'بدون',
      statusColors[o.status]?.label || o.status,
      new Date(o.createdAt).toLocaleDateString('ar-EG')
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>إدارة الطلبات</h1>
          <p style={styles.sub}>{orders.length} طلب إجمالي</p>
        </div>
        <button className="btn btn-outline-gold" onClick={exportToCSV}>
          <Download size={18} /> تصدير CSV
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        {[
          { label: 'إجمالي', value: stats.total, color: 'var(--gold)' },
          { label: 'قيد الانتظار', value: stats.pending, color: '#fbbf24' },
          { label: 'مؤكدة', value: stats.confirmed, color: '#22c55e' },
          { label: 'مُوصّلة', value: stats.delivered, color: '#3b82f6' },
        ].map(s => (
          <div key={s.label} style={styles.statCard}>
            <p style={{ ...styles.statVal, color: s.color }}>{s.value}</p>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <Package size={48} style={{ color: 'var(--silver-dark)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--silver-dark)' }}>لا توجد طلبات بعد</p>
        </div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                {['رقم الطلب', 'العميل', 'الهاتف', 'المدينة', 'إجمالي', 'الحالة', 'التاريخ', 'إجراءات'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const sc = statusColors[order.status] || statusColors.pending;
                return (
                  <tr key={order.id} style={styles.tr}>
                    <td style={styles.td}><span style={styles.orderId}>{order.id.slice(-10)}</span></td>
                    <td style={styles.td}><span style={{ color: 'var(--white)', fontWeight: '600' }}>{order.customer?.name}</span></td>
                    <td style={styles.td}><span dir="ltr" style={{ color: 'var(--silver-dark)' }}>{order.customer?.phone}</span></td>
                    <td style={styles.td}><span style={{ color: 'var(--silver)' }}>{order.customer?.city}</span></td>
                    <td style={styles.td}><span style={{ color: 'var(--gold)', fontWeight: '700' }}>{order.total?.toLocaleString()} ج.م</span></td>
                    <td style={styles.td}>
                      <span style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: '700', background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                        {sc.label}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: 'var(--silver-dark)', fontSize: '0.8rem' }}>
                        {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.viewBtn} onClick={() => setSelected(order)}>
                        <Eye size={14} /> عرض
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selected && (
        <div style={styles.overlay} onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>تفاصيل الطلب</h2>
                <p style={{ color: 'var(--silver-dark)', fontSize: '0.82rem', marginTop: '2px' }}>{selected.id}</p>
              </div>
              <button style={styles.closeBtn} onClick={() => setSelected(null)}><X size={20} /></button>
            </div>

            <div style={styles.modalBody}>
              {/* Customer info */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>بيانات العميل</h3>
                <div style={styles.infoGrid}>
                  {[
                    ['الاسم', selected.customer?.name],
                    ['الهاتف', selected.customer?.phone],
                    ['المدينة', selected.customer?.city],
                    ['العنوان', selected.customer?.address],
                    ['طريقة الدفع', selected.customer?.paymentMethod === 'cash' ? 'كاش عند الاستلام' : 'تحويل بنكي'],
                  ].map(([label, val]) => val ? (
                    <div key={label} style={styles.infoRow}>
                      <span style={styles.infoLabel}>{label}</span>
                      <span style={styles.infoVal}>{val}</span>
                    </div>
                  ) : null)}
                </div>
                {selected.customer?.notes && (
                  <div style={styles.notesBox}>
                    <strong style={{ color: 'var(--gold)' }}>ملاحظات:</strong> {selected.customer.notes}
                  </div>
                )}
              </div>

              {/* Items */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>المنتجات</h3>
                {selected.items?.map(item => (
                  <div key={item.id} style={styles.itemRow}>
                    <img src={item.image} alt={item.name} style={styles.itemImg} />
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'var(--white)', fontWeight: '600', fontSize: '0.9rem' }}>{item.name}</p>
                      <p style={{ color: 'var(--silver-dark)', fontSize: '0.78rem' }}>الكمية: {item.qty}</p>
                    </div>
                    {item.items && <p style={{ color: 'var(--gold)', fontWeight: '700' }}>{(item.price * item.qty).toLocaleString()} ج.م</p>}
                  </div>
                ))}
                <div style={styles.totalRow}>
                  <span style={{ color: 'var(--silver)' }}>إجمالي الطلب</span>
                  <span style={{ color: 'var(--gold)', fontWeight: '900', fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>{selected.total?.toLocaleString()} ج.م</span>
                </div>
              </div>

              {/* Status Actions */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>تغيير حالة الطلب</h3>
                <div style={styles.statusBtns}>
                  {Object.entries(statusColors).map(([key, sc]) => (
                    <button
                      key={key}
                      onClick={() => updateStatus(selected.id, key)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: 'var(--r-md)',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        background: selected.status === key ? sc.bg : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${selected.status === key ? sc.border : 'rgba(255,255,255,0.06)'}`,
                        color: selected.status === key ? sc.color : 'var(--silver-dark)',
                        fontFamily: 'var(--font-heading)',
                      }}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  title: { fontSize: '1.8rem', fontWeight: '900', color: 'var(--white)', marginBottom: '4px' },
  sub: { color: 'var(--silver-dark)', fontSize: '0.9rem' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' },
  statCard: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-md)', padding: '20px', textAlign: 'center' },
  statVal: { fontSize: '2rem', fontWeight: '900', lineHeight: 1.1, fontFamily: 'var(--font-heading)' },
  statLabel: { color: 'var(--silver-dark)', fontSize: '0.82rem', marginTop: '4px' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px', background: 'var(--grad-card)', borderRadius: 'var(--r-lg)', border: '1px solid rgba(255,255,255,0.06)' },
  tableWrap: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '800px' },
  thead: { background: 'rgba(255,255,255,0.03)' },
  th: { padding: '14px 16px', textAlign: 'right', color: 'var(--silver-dark)', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)' },
  td: { padding: '14px 16px', verticalAlign: 'middle' },
  orderId: { fontFamily: 'monospace', color: 'var(--silver-dark)', fontSize: '0.8rem' },
  viewBtn: { display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 'var(--r-sm)', color: 'var(--gold)', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' },
  modal: { background: 'var(--black-mid)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 'var(--r-lg)', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  modalTitle: { fontSize: '1.3rem', fontWeight: '800', color: 'var(--white)' },
  closeBtn: { background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--silver)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
  modalBody: { padding: '0' },
  section: { padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  sectionTitle: { fontSize: '0.85rem', color: 'var(--gold)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' },
  infoGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  infoRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' },
  infoLabel: { color: 'var(--silver-dark)' },
  infoVal: { color: 'var(--white)', fontWeight: '600' },
  notesBox: { marginTop: '12px', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--r-md)', color: 'var(--silver)', fontSize: '0.88rem' },
  itemRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  itemImg: { width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' },
  totalRow: { display: 'flex', justifyContent: 'space-between', paddingTop: '14px', alignItems: 'center' },
  statusBtns: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
};

export default AdminOrders;
