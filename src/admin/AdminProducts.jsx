import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check, Star } from 'lucide-react';
import { ProductsDB, CategoriesDB } from '../db/database';

const BRANDS = ['بولو بلاست', 'استاندورف', 'ايديال ستاندرد', 'جروهى', 'بانيوهات الطيب', 'بليزا'];

const emptyForm = {
  name: '', brand: '', price: '', categoryId: '', category: '',
  description: '', image: '', stock: '', active: true, featured: false,
};
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', brand: '', price: '', categoryId: '', stock: 10, image: '', description: '', active: true, featured: false, imagesList: [''] });
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);

  const load = () => {
    setProducts(ProductsDB.getAll());
    setCategories(CategoriesDB.getAll());
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(p =>
    p.name.includes(search) || p.brand.includes(search) || p.category.includes(search)
  );

  const openAdd = () => {
    setForm({ name: '', brand: '', price: '', categoryId: '', stock: 10, image: '', description: '', active: true, featured: false, imagesList: [''] });
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (product) => {
    setForm({ 
      ...product, 
      price: product.price.toString(), 
      stock: product.stock.toString(),
      imagesList: product.images && product.images.length > 0 ? product.images : [product.image || '']
    });
    setEditing(product.id);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Parse images
    let imgs = form.imagesList.map(l => l.trim()).filter(Boolean);
    const mainImg = imgs.length > 0 ? imgs[0] : '';

    const pData = {
      ...form,
      id: editing,
      price: Number(form.price),
      categoryId: Number(form.categoryId),
      category: categories.find(c => c.id === Number(form.categoryId))?.name || '',
      stock: Number(form.stock),
      image: mainImg,
      images: imgs
    };
    
    delete pData.imagesList;

    if (editing) {
      ProductsDB.update(editing, pData);
    } else {
      ProductsDB.create(pData);
    }
    load();
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      ProductsDB.delete(id);
      load();
    }
  };

  const toggleActive = (id) => {
    ProductsDB.toggleActive(id);
    load();
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>إدارة المنتجات</h1>
          <p style={styles.sub}>{products.length} منتج في قاعدة البيانات</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {saved && <span style={styles.savedBadge}><Check size={14} /> تم الحفظ!</span>}
          <input
            type="text"
            placeholder="بحث..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="form-control"
            style={{ width: '200px' }}
          />
          <button className="btn btn-gold" onClick={openAdd}>
            <Plus size={18} /> إضافة منتج
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>الصورة</th>
              <th style={styles.th}>اسم المنتج</th>
              <th style={styles.th}>الماركة</th>
              <th style={styles.th}>التصنيف</th>
              <th style={styles.th}>السعر</th>
              <th style={styles.th}>المخزون</th>
              <th style={styles.th}>الحالة</th>
              <th style={styles.th}>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} style={{ ...styles.tr, opacity: p.active ? 1 : 0.5 }}>
                <td style={styles.td}>
                  <img src={p.image} alt={p.name} style={styles.thumb} />
                </td>
                <td style={styles.td}>
                  <div style={styles.productName}>{p.name}</div>
                  {p.featured && <span style={styles.featuredTag}><Star size={10} /> مميز</span>}
                </td>
                <td style={styles.td}><span style={styles.brandTag}>{p.brand}</span></td>
                <td style={styles.td}><span style={styles.catTag}>{p.category}</span></td>
                <td style={styles.td}><span style={styles.price}>{p.price?.toLocaleString()} ج.م</span></td>
                <td style={styles.td}><span style={{ color: p.stock < 5 ? '#ef4444' : 'var(--silver)' }}>{p.stock}</span></td>
                <td style={styles.td}>
                  <button
                    style={{ ...styles.statusBtn, background: p.active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: p.active ? '#22c55e' : '#ef4444' }}
                    onClick={() => toggleActive(p.id)}
                  >
                    {p.active ? <><Eye size={13} /> نشط</> : <><EyeOff size={13} /> مخفي</>}
                  </button>
                </td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button style={styles.editBtn} onClick={() => openEdit(p)}><Pencil size={15} /></button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(p.id)}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={styles.empty}>لا توجد منتجات مطابقة للبحث</div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={styles.modalOverlay} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editing ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
              <button style={styles.closeBtn} onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">اسم المنتج *</label>
                  <input name="name" className="form-control" value={form.name} onChange={handleChange} required placeholder="مثال: خلاط حوض جروهى" />
                </div>
                <div className="form-group">
                  <label className="form-label">الماركة *</label>
                  <select name="brand" className="form-control" value={form.brand} onChange={handleChange} required>
                    <option value="">اختر الماركة</option>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">السعر (ج.م) *</label>
                  <input name="price" type="number" min="0" className="form-control" value={form.price} onChange={handleChange} required placeholder="مثال: 1500" />
                </div>
                <div className="form-group">
                  <label className="form-label">التصنيف *</label>
                  <select name="categoryId" className="form-control" value={form.categoryId} onChange={handleChange} required>
                    <option value="">اختر التصنيف</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">المخزون</label>
                  <input name="stock" type="number" min="0" className="form-control" value={form.stock} onChange={handleChange} placeholder="الكمية المتاحة" />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">صور المنتج</label>
                  {form.imagesList.map((img, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input 
                        className="form-control" 
                        value={img} 
                        onChange={(e) => {
                          const newList = [...form.imagesList];
                          newList[idx] = e.target.value;
                          setForm(f => ({ ...f, imagesList: newList }));
                        }} 
                        placeholder="رابط الصورة (https://...)" 
                        style={{ flex: 1, direction: 'ltr' }} 
                      />
                      {form.imagesList.length > 1 && (
                        <button type="button" className="btn" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }} onClick={() => {
                          const newList = form.imagesList.filter((_, i) => i !== idx);
                          setForm(f => ({ ...f, imagesList: newList }));
                        }}>حذف</button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline" style={{ marginTop: '8px', fontSize: '0.9rem' }} onClick={() => {
                    setForm(f => ({ ...f, imagesList: [...f.imagesList, ''] }));
                  }}>+ إضافة رابط صورة أخرى</button>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">وصف المنتج</label>
                  <textarea name="description" className="form-control" value={form.description} onChange={handleChange} rows={3} placeholder="وصف تفصيلي للمنتج..." style={{ resize: 'vertical' }} />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '24px' }}>
                  <label style={styles.checkLabel}>
                    <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
                    <span>منتج نشط (ظاهر للعملاء)</span>
                  </label>
                  <label style={styles.checkLabel}>
                    <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                    <span>عرضه في الصفحة الرئيسية</span>
                  </label>
                </div>
              </div>
              {form.imagesList.some(img => img.trim() !== '') && (
                <div style={{ marginTop: '16px' }}>
                  <p style={{ color: 'var(--silver-dark)', fontSize: '0.8rem', marginBottom: '8px' }}>معاينة الصور:</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {form.imagesList.filter(img => img.trim() !== '').map((img, idx) => (
                      <img key={idx} src={img} alt="preview" style={{ height: '80px', width: '80px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                    ))}
                  </div>
                </div>
              )}
              <div style={styles.formFooter}>
                <button type="button" className="btn btn-dark" onClick={() => setShowForm(false)}>إلغاء</button>
                <button type="submit" className="btn btn-gold">{editing ? 'حفظ التعديلات' : 'إضافة المنتج'}</button>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '1.8rem', fontWeight: '900', color: 'var(--white)', marginBottom: '4px' },
  sub: { color: 'var(--silver-dark)', fontSize: '0.9rem' },
  savedBadge: { display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '700' },
  tableWrap: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '800px' },
  thead: { background: 'rgba(255,255,255,0.03)' },
  th: { padding: '14px 16px', textAlign: 'right', color: 'var(--silver-dark)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' },
  td: { padding: '14px 16px', verticalAlign: 'middle' },
  thumb: { width: '52px', height: '52px', borderRadius: '8px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' },
  productName: { color: 'var(--white)', fontWeight: '600', fontSize: '0.92rem', marginBottom: '4px' },
  featuredTag: { display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', background: 'rgba(201,169,110,0.15)', color: 'var(--gold)', borderRadius: '50px', fontSize: '0.7rem', fontWeight: '700' },
  brandTag: { padding: '3px 10px', background: 'rgba(201,169,110,0.1)', color: 'var(--gold)', borderRadius: '50px', fontSize: '0.78rem', fontWeight: '700', whiteSpace: 'nowrap' },
  catTag: { padding: '3px 10px', background: 'rgba(255,255,255,0.06)', color: 'var(--silver)', borderRadius: '50px', fontSize: '0.78rem', whiteSpace: 'nowrap' },
  price: { color: 'var(--gold)', fontWeight: '700', fontSize: '0.95rem' },
  statusBtn: { display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' },
  actions: { display: 'flex', gap: '8px' },
  editBtn: { width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  deleteBtn: { width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  empty: { padding: '40px', textAlign: 'center', color: 'var(--silver-dark)' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' },
  modal: { background: 'var(--black-mid)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 'var(--r-lg)', width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  modalTitle: { fontSize: '1.3rem', fontWeight: '800', color: 'var(--white)' },
  closeBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--silver)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  form: { padding: '28px' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--silver)', fontSize: '0.9rem', cursor: 'pointer' },
  formFooter: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' },
};

export default AdminProducts;
