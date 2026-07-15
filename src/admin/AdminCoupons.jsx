import { useState, useEffect } from 'react';
import { CouponsDB } from '../db/database';
import { Ticket, Plus, Trash2, Edit2, X, Percent } from 'lucide-react';

const emptyForm = { code: '', type: 'percent', value: '', maxUsage: '', active: true };

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => setCoupons(CouponsDB.getAll());
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const openEdit = (c) => {
    setForm({ ...c, value: c.value.toString(), maxUsage: c.maxUsage?.toString() || '' });
    setEditing(c.id);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : name === 'code' ? value.toUpperCase().replace(/\s/g, '') : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      value: parseFloat(form.value),
      maxUsage: form.maxUsage ? parseInt(form.maxUsage) : null,
    };
    if (editing) CouponsDB.update(editing, data);
    else CouponsDB.create(data);
    load();
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل تريد حذف هذا الكوبون؟')) { CouponsDB.delete(id); load(); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>كوبونات الخصم</h1>
          <p style={styles.sub}>إدارة رموز الخصم والعروض الخاصة</p>
        </div>
        <button className="btn btn-gold" onClick={openAdd}><Plus size={18} /> إضافة كوبون</button>
      </div>

      <div style={styles.grid}>
        {coupons.map(c => {
          const isExpired = c.maxUsage && c.usedCount >= c.maxUsage;
          const status = !c.active ? 'معطل' : isExpired ? 'مستنفذ' : 'نشط';
          const statusColor = status === 'نشط' ? '#22c55e' : status === 'مستنفذ' ? '#f59e0b' : '#ef4444';

          return (
            <div key={c.id} style={{ ...styles.card, opacity: c.active && !isExpired ? 1 : 0.6 }}>
              <div style={styles.cardHeader}>
                <div style={styles.codeWrap}>
                  <Ticket size={18} style={{ color: 'var(--gold)' }} />
                  <span style={styles.code}>{c.code}</span>
                </div>
                <span style={{ ...styles.statusBadge, color: statusColor, background: `${statusColor}22` }}>
                  {status}
                </span>
              </div>

              <div style={styles.detailsBox}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>الخصم</span>
                  <span style={styles.detailVal}>
                    {c.value} {c.type === 'percent' ? '%' : 'ج.م'}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>الاستخدام</span>
                  <span style={styles.detailVal}>
                    {c.usedCount} {c.maxUsage ? `/ ${c.maxUsage}` : 'استخدام'}
                  </span>
                </div>
              </div>

              <div style={styles.actions}>
                <button style={styles.editBtn} onClick={() => openEdit(c)}><Edit2 size={14} /> تعديل</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(c.id)}><Trash2 size={14} /> حذف</button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div style={styles.overlay} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editing ? 'تعديل الكوبون' : 'إضافة كوبون'}</h2>
              <button style={styles.closeBtn} onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div className="form-group">
                <label className="form-label">كود الخصم *</label>
                <input name="code" className="form-control" value={form.code} onChange={handleChange} required placeholder="مثال: SALE20" dir="ltr" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">نوع الخصم</label>
                  <select name="type" className="form-control" value={form.type} onChange={handleChange}>
                    <option value="percent">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (ج.م)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">قيمة الخصم *</label>
                  <input name="value" type="number" min="1" className="form-control" value={form.value} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">الحد الأقصى للاستخدام (اختياري)</label>
                <input name="maxUsage" type="number" min="1" className="form-control" value={form.maxUsage} onChange={handleChange} placeholder="اتركه فارغاً لعدد غير محدود" />
              </div>
              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--silver)', cursor: 'pointer' }}>
                  <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
                  <span>تفعيل الكوبون حالياً</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button type="button" className="btn btn-dark" style={{ flex: 1 }} onClick={() => setShowForm(false)}>إلغاء</button>
                <button type="submit" className="btn btn-gold" style={{ flex: 1 }}>{editing ? 'حفظ التعديلات' : 'إنشاء الكوبون'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { fontSize: '1.8rem', fontWeight: '900', color: 'var(--white)', marginBottom: '4px' },
  sub: { color: 'var(--silver-dark)', fontSize: '0.9rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  card: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', padding: '24px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  codeWrap: { display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(201,169,110,0.1)', padding: '6px 12px', borderRadius: '8px', border: '1px dashed rgba(201,169,110,0.3)' },
  code: { fontSize: '1.2rem', fontWeight: '900', color: 'var(--gold)', letterSpacing: '2px', fontFamily: 'monospace' },
  statusBadge: { padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700' },
  detailsBox: { background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--r-md)', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { color: 'var(--silver-dark)', fontSize: '0.85rem' },
  detailVal: { color: 'var(--white)', fontWeight: '700', fontSize: '0.95rem' },
  actions: { display: 'flex', gap: '8px' },
  editBtn: { flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--silver)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  deleteBtn: { flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' },
  modal: { background: 'var(--black-mid)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 'var(--r-lg)', width: '100%', maxWidth: '440px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  modalTitle: { fontSize: '1.2rem', fontWeight: '800', color: 'var(--white)' },
  closeBtn: { background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--silver)', width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  form: { padding: '24px' },
};

export default AdminCoupons;
