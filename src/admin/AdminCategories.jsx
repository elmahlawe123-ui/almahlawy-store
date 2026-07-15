import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { CategoriesDB } from '../db/database';

const ICONS = ['🚿', '🛁', '🛀', '✨', '🔧', '🚽', '🪴', '🪥', '💧', '🔩', '🪣', '🏠'];

const emptyForm = { name: '', icon: '🚿', color: '#C9A96E' };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => setCategories(CategoriesDB.getAll());
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditing(null); setShowForm(true); };
  const openEdit = (cat) => { setForm({ ...cat }); setEditing(cat.id); setShowForm(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) { CategoriesDB.update(editing, form); }
    else { CategoriesDB.create(form); }
    load();
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل تريد حذف هذا التصنيف؟')) {
      CategoriesDB.delete(id);
      load();
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>إدارة التصنيفات</h1>
          <p style={styles.sub}>{categories.length} تصنيف</p>
        </div>
        <button className="btn btn-gold" onClick={openAdd}><Plus size={18} /> إضافة تصنيف</button>
      </div>

      <div style={styles.grid}>
        {categories.map(cat => (
          <div key={cat.id} style={styles.catCard}>
            <div style={{ ...styles.catIcon, background: `${cat.color}20`, border: `1px solid ${cat.color}40` }}>
              <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
            </div>
            <div style={styles.catInfo}>
              <p style={styles.catName}>{cat.name}</p>
              <p style={styles.catId}>ID: {cat.id}</p>
            </div>
            <div style={styles.catActions}>
              <button style={styles.editBtn} onClick={() => openEdit(cat)}><Pencil size={14} /></button>
              <button style={styles.deleteBtn} onClick={() => handleDelete(cat.id)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}

        <button style={styles.addCard} onClick={openAdd}>
          <Plus size={28} style={{ color: 'var(--gold)', opacity: 0.7 }} />
          <span>تصنيف جديد</span>
        </button>
      </div>

      {showForm && (
        <div style={styles.overlay} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editing ? 'تعديل التصنيف' : 'تصنيف جديد'}</h2>
              <button style={styles.closeBtn} onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div className="form-group">
                <label className="form-label">اسم التصنيف *</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="مثال: خلاطات"
                />
              </div>
              <div className="form-group">
                <label className="form-label">الأيقونة</label>
                <div style={styles.iconPicker}>
                  {ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, icon }))}
                      style={{
                        ...styles.iconBtn,
                        ...(form.icon === icon ? styles.iconBtnActive : {}),
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-dark" onClick={() => setShowForm(false)}>إلغاء</button>
                <button type="submit" className="btn btn-gold">{editing ? 'حفظ' : 'إضافة'}</button>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
  catCard: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-md)', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' },
  catIcon: { width: '52px', height: '52px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  catInfo: { flex: 1 },
  catName: { color: 'var(--white)', fontWeight: '700', fontSize: '1rem' },
  catId: { color: 'var(--silver-dark)', fontSize: '0.72rem', marginTop: '2px' },
  catActions: { display: 'flex', gap: '6px' },
  editBtn: { width: '30px', height: '30px', borderRadius: '7px', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  deleteBtn: { width: '30px', height: '30px', borderRadius: '7px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  addCard: { background: 'rgba(201,169,110,0.04)', border: '1px dashed rgba(201,169,110,0.25)', borderRadius: 'var(--r-md)', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', color: 'var(--silver-dark)', fontSize: '0.9rem', minHeight: '100px' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' },
  modal: { background: 'var(--black-mid)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 'var(--r-lg)', width: '100%', maxWidth: '480px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  modalTitle: { fontSize: '1.2rem', fontWeight: '800', color: 'var(--white)' },
  closeBtn: { background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--silver)', width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  iconPicker: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' },
  iconBtn: { width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  iconBtnActive: { background: 'rgba(201,169,110,0.15)', borderColor: 'rgba(201,169,110,0.5)' },
};

export default AdminCategories;
