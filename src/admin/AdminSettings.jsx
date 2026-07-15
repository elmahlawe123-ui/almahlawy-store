import { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import { SettingsDB } from '../db/database';

const AdminSettings = () => {
  const [settings, setSettings] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => { setSettings(SettingsDB.get()); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(s => ({ ...s, [name]: name === 'minItemsForPrice' ? parseInt(value) || 1 : value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    SettingsDB.update(settings);
    // Also update localStorage for StoreContext compatibility
    localStorage.setItem('minItemsForPrice', settings.minItemsForPrice);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>إعدادات المتجر</h1>
        <p style={styles.sub}>التحكم في جميع إعدادات الموقع</p>
      </div>

      <form onSubmit={handleSave} style={styles.formWrap}>
        {/* Pricing Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🔒 إعدادات الأسعار والخصوصية</h2>
          <p style={styles.sectionDesc}>تحكم في متى يظهر السعر الإجمالي للعملاء</p>

          <div style={styles.settingRow}>
            <div>
              <p style={styles.settingLabel}>الحد الأدنى لتعدد الأصناف لكشف السعر</p>
              <p style={styles.settingHint}>العميل يجب أن يضيف هذا العدد من الأصناف المختلفة لظهور السعر الإجمالي</p>
            </div>
            <input
              type="number"
              name="minItemsForPrice"
              min="1"
              max="20"
              className="form-control"
              style={{ width: '100px', textAlign: 'center', fontSize: '1.3rem', fontWeight: '800' }}
              value={settings.minItemsForPrice || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Store Info Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🏪 معلومات المعرض</h2>
          <div style={styles.infoGrid}>
            <div className="form-group">
              <label className="form-label">اسم المعرض</label>
              <input name="storeName" className="form-control" value={settings.storeName || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">رقم الهاتف</label>
              <input name="phone" className="form-control" value={settings.phone || ''} onChange={handleChange} dir="ltr" />
            </div>
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني</label>
              <input name="email" className="form-control" value={settings.email || ''} onChange={handleChange} dir="ltr" />
            </div>
            <div className="form-group">
              <label className="form-label">العنوان</label>
              <input name="address" className="form-control" value={settings.address || ''} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* AI Settings Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🤖 الذكاء الاصطناعي (Gemini)</h2>
          <p style={styles.sectionDesc}>إعدادات المساعد الذكي وصندوق المحادثة</p>
          <div style={styles.infoGrid}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>مفتاح API الخاص بـ Google Gemini</label>
              <input
                type="password"
                name="geminiApiKey"
                className="form-control"
                placeholder="AIzaSy..."
                value={settings.geminiApiKey || ''}
                onChange={handleChange}
              />
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                عند إدخال هذا المفتاح، سيتحول صندوق الدردشة للردود الذكية بدلاً من الردود المبرمجة مسبقاً.
              </p>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          {saved && (
            <span style={styles.savedMsg}>
              <Check size={16} /> تم الحفظ بنجاح!
            </span>
          )}
          <button type="submit" className="btn btn-gold btn-lg">
            <Save size={18} />
            حفظ الإعدادات
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  page: { padding: '40px' },
  header: { marginBottom: '40px' },
  title: { fontSize: '1.8rem', fontWeight: '900', color: 'var(--white)', marginBottom: '4px' },
  sub: { color: 'var(--silver-dark)', fontSize: '0.9rem' },
  formWrap: { display: 'flex', flexDirection: 'column', gap: '24px' },
  section: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', padding: '28px' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '800', color: 'var(--white)', marginBottom: '6px' },
  sectionDesc: { color: 'var(--silver-dark)', fontSize: '0.88rem', marginBottom: '24px' },
  settingRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', padding: '20px', background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.15)', borderRadius: 'var(--r-md)' },
  settingLabel: { color: 'var(--white)', fontWeight: '700', fontSize: '1rem', marginBottom: '4px' },
  settingHint: { color: 'var(--silver-dark)', fontSize: '0.85rem' },
  infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  footer: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' },
  savedMsg: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', borderRadius: '50px', fontWeight: '700', fontSize: '0.9rem' },
};

export default AdminSettings;
