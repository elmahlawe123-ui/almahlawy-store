import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { BundlesDB } from '../db/database';

const emptyForm = { name: '', price: '', oldPrice: '', image: '', description: '', items: '', active: true, featured: false };

const AdminBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => setBundles(BundlesDB.getAll());
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const openEdit = (b) => {
    setForm({ ...b, price: b.price.toString(), oldPrice: b.oldPrice.toString(), items: Array.isArray(b.items) ? b.items.join('\n') : b.items });
    setEditing(b.id);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      price: parseFloat(form.price),
      oldPrice: parseFloat(form.oldPrice),
      items: form.items.split('\n').map(s => s.trim()).filter(Boolean),
    };
    if (editing) BundlesDB.update(editing, data);
    else BundlesDB.create(data);
    load();
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل تريد حذف هذا العرض؟')) { BundlesDB.delete(id); load(); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>العروض المجمعة</h1>
          <p style={styles.sub}>{bundles.length} عرض</p>
        </div>
        <button className="btn btn-gold" onClick={openAdd}><Plus size={18} /> إضافة عرض</button>
      </div>

      <div style={styles.grid}>
        {bundles.map(b => {
          const discount = Math.round(((b.oldPrice - b.price) / b.oldPrice) * 100);
          return (
            <div key={b.id} style={{ ...styles.card, opacity: b.active ? 1 : 0.5 }}>
              <div style={styles.imgWrap}>
                <img src={b.image} alt={b.name} style={styles.img} />
                <span style={styles.discountBadge}>خصم {discount}%</span>
              </div>
              <div style={styles.info}>
                <p style={styles.bundleName}>{b.name}</p>
                <p style={styles.bundlePrice}>{b.price?.toLocaleString()} ج.م <span style={styles.oldPrice}>{b.oldPrice?.toLocaleString()}</span></p>
                <p style={styles.itemCount}>{Array.isArray(b.items) ? b.items.length : 0} عناصر في العرض</p>
              </div>
              <div style={styles.cardActions}>
                <button style={styles.editBtn} onClick={() => openEdit(b)}><Pencil size={14} /></button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(b.id)}><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div style={styles.overlay} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editing ? 'تعديل العرض' : 'عرض مجمع جديد'}</h2>
              <button style={styles.closeBtn} onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={styles.formGrid}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">اسم العرض *</label>
                  <input name="name" className="form-control" value={form.name} onChange={handleChange} required placeholder="مثال: العرض الماسي - تشطيب كامل" />
                </div>
                <div className="form-group">
                  <label className="form-label">السعر الجديد *</label>
                  <input name="price" type="number" min="0" className="form-control" value={form.price} onChange={handleChange} required placeholder="14500" />
                </div>
                <div className="form-group">
                  <label className="form-label">السعر القديم *</label>
                  <input name="oldPrice" type="number" min="0" className="form-control" value={form.oldPrice} onChange={handleChange} required placeholder="16200" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">رابط صورة العرض</label>
                  <input name="image" className="form-control" value={form.image} onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">وصف العرض</label>
                  <textarea name="description" className="form-control" value={form.description} onChange={handleChange} rows={2} style={{ resize: 'vertical' }} />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">محتويات العرض (سطر لكل عنصر)</label>
                  <textarea
                    name="items"
                    className="form-control"
                    value={form.items}
                    onChange={handleChange}
                    rows={4}
                    placeholder={"طقم حمام ايديال ستاندرد\nطقم خلاطات جروهي\nبانيو الطيب 170 سم"}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div style={{ gridColumn: '1/-1', display: 'flex', gap: '20px' }}>
                  <label style={styles.checkLabel}>
                    <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
                    <span>عرض نشط</span>
                  </label>
                  <label style={styles.checkLabel}>
                    <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                    <span>عرضه في الرئيسية</span>
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-dark" onClick={() => setShowForm(false)}>إلغاء</button>
                <button type="submit" className="btn btn-gold">{editing ? 'حفظ التعديلات' : 'إضافة العرض'}</button>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: { background: 'var(--grad-card)', border: '1px solid rgba(201,169,110,0.15)', borderRadius: 'var(--r-lg)', overflow: 'hidden' },
  imgWrap: { position: 'relative', height: '180px', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  discountBadge: { position: 'absolute', top: '12px', right: '12px', padding: '4px 12px', background: '#ef4444', color: 'white', borderRadius: '50px', fontSize: '0.78rem', fontWeight: '700' },
  info: { padding: '16px' },
  bundleName: { color: 'var(--white)', fontWeight: '700', fontSize: '1rem', marginBottom: '8px' },
  bundlePrice: { color: 'var(--gold)', fontWeight: '700', fontSize: '1.1rem', marginBottom: '4px' },
  oldPrice: { color: 'var(--silver-dark)', fontSize: '0.85rem', textDecoration: 'line-through', marginRight: '8px' },
  itemCount: { color: 'var(--silver-dark)', fontSize: '0.8rem' },
  cardActions: { display: 'flex', gap: '8px', padding: '0 16px 16px' },
  editBtn: { flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '6px', fontSize: '0.85rem' },
  deleteBtn: { flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '6px', fontSize: '0.85rem' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' },
  modal: { background: 'var(--black-mid)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 'var(--r-lg)', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  modalTitle: { fontSize: '1.2rem', fontWeight: '800', color: 'var(--white)' },
  closeBtn: { background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--silver)', width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--silver)', fontSize: '0.9rem', cursor: 'pointer' },
};

export default AdminBundles;
