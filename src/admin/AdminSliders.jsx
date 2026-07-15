import { useState, useEffect } from 'react';
import { SlidersDB } from '../db/database';
import { Image as ImageIcon, Plus, Trash2, Edit2, X, Link as LinkIcon, Type } from 'lucide-react';

const emptyForm = { title: '', subtitle: '', image: '', link: '', active: true };

const AdminSliders = () => {
  const [sliders, setSliders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => setSliders(SlidersDB.getAll());
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const openEdit = (s) => { setForm(s); setEditing(s.id); setShowForm(true); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) SlidersDB.update(editing, form);
    else SlidersDB.create(form);
    load();
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الشريحة؟')) { SlidersDB.delete(id); load(); }
  };

  const toggleActive = (id, active) => {
    SlidersDB.update(id, { active: !active });
    load();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>الصفحة الرئيسية (Sliders)</h1>
          <p style={styles.sub}>إدارة اللافتات والعروض في الصفحة الرئيسية</p>
        </div>
        <button className="btn btn-gold" onClick={openAdd}><Plus size={18} /> إضافة شريحة</button>
      </div>

      <div style={styles.grid}>
        {sliders.map(s => (
          <div key={s.id} style={{ ...styles.card, opacity: s.active ? 1 : 0.5 }}>
            <div style={styles.imageWrap}>
              <img src={s.image} alt={s.title} style={styles.image} />
              <div style={styles.badgeWrap}>
                <span style={{ ...styles.badge, background: s.active ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.9)' }}>
                  {s.active ? 'نشط' : 'معطل'}
                </span>
              </div>
            </div>
            
            <div style={styles.content}>
              <h3 style={styles.sliderTitle}>{s.title}</h3>
              <p style={styles.sliderSub}>{s.subtitle}</p>
              {s.link && (
                <div style={styles.linkWrap}>
                  <LinkIcon size={14} style={{ color: 'var(--gold)' }} />
                  <span style={styles.linkText}>{s.link}</span>
                </div>
              )}
            </div>

            <div style={styles.actions}>
              <button style={{ ...styles.actionBtn, color: 'var(--silver)' }} onClick={() => toggleActive(s.id, s.active)}>
                {s.active ? 'إيقاف' : 'تفعيل'}
              </button>
              <button style={{ ...styles.actionBtn, color: 'var(--gold)' }} onClick={() => openEdit(s)}>تعديل</button>
              <button style={{ ...styles.actionBtn, color: '#ef4444' }} onClick={() => handleDelete(s.id)}>حذف</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={styles.overlay} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editing ? 'تعديل الشريحة' : 'إضافة شريحة جديدة'}</h2>
              <button style={styles.closeBtn} onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div className="form-group">
                <label className="form-label">العنوان الرئيسي *</label>
                <div style={{ position: 'relative' }}>
                  <Type size={16} style={{ position: 'absolute', right: '12px', top: '14px', color: 'var(--silver-dark)' }} />
                  <input name="title" className="form-control" style={{ paddingRight: '40px' }} value={form.title} onChange={handleChange} required placeholder="مثال: خصومات حصرية" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">النص الفرعي</label>
                <input name="subtitle" className="form-control" value={form.subtitle} onChange={handleChange} placeholder="اكتب وصفاً قصيراً" />
              </div>
              <div className="form-group">
                <label className="form-label">رابط الصورة (URL) *</label>
                <div style={{ position: 'relative' }}>
                  <ImageIcon size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--silver-dark)' }} />
                  <input name="image" type="url" className="form-control" style={{ paddingLeft: '40px' }} value={form.image} onChange={handleChange} required placeholder="https://..." dir="ltr" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">رابط التوجيه (الزر)</label>
                <div style={{ position: 'relative' }}>
                  <LinkIcon size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--silver-dark)' }} />
                  <input name="link" className="form-control" style={{ paddingLeft: '40px' }} value={form.link} onChange={handleChange} placeholder="/shop" dir="ltr" />
                </div>
              </div>
              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--silver)', cursor: 'pointer' }}>
                  <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
                  <span>عرض هذه الشريحة في الرئيسية</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                <button type="button" className="btn btn-dark" style={{ flex: 1 }} onClick={() => setShowForm(false)}>إلغاء</button>
                <button type="submit" className="btn btn-gold" style={{ flex: 1 }}>{editing ? 'حفظ التعديلات' : 'إضافة'}</button>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' },
  card: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  imageWrap: { position: 'relative', width: '100%', height: '180px' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  badgeWrap: { position: 'absolute', top: '12px', right: '12px' },
  badge: { padding: '4px 12px', borderRadius: '50px', color: 'white', fontSize: '0.75rem', fontWeight: '700', backdropFilter: 'blur(4px)' },
  content: { padding: '20px', flex: 1 },
  sliderTitle: { fontSize: '1.2rem', fontWeight: '800', color: 'var(--white)', marginBottom: '6px' },
  sliderSub: { color: 'var(--silver)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.5 },
  linkWrap: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '6px', border: '1px dashed rgba(255,255,255,0.1)' },
  linkText: { color: 'var(--silver-dark)', fontSize: '0.8rem', fontFamily: 'monospace' },
  actions: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.05)' },
  actionBtn: { padding: '14px', background: 'none', border: 'none', borderLeft: '1px solid rgba(255,255,255,0.05)', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', transition: 'var(--ease)' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' },
  modal: { background: 'var(--black-mid)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 'var(--r-lg)', width: '100%', maxWidth: '500px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  modalTitle: { fontSize: '1.2rem', fontWeight: '800', color: 'var(--white)' },
  closeBtn: { background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--silver)', width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  form: { padding: '24px' },
};

export default AdminSliders;
