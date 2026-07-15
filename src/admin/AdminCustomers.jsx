import { useState, useEffect } from 'react';
import { CustomersDB } from '../db/database';
import { Users, Ban, CheckCircle, Search, Mail, Phone, MapPin } from 'lucide-react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => setCustomers(CustomersDB.getAll());
  useEffect(() => { load(); }, []);

  const filtered = customers.filter(c =>
    c.name.includes(search) || c.email.includes(search) || c.phone.includes(search)
  );

  const toggleStatus = (id) => {
    CustomersDB.toggleActive(id);
    load();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>العملاء</h1>
          <p style={styles.sub}>{customers.length} عميل مسجل</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--silver-dark)' }} />
          <input
            type="text"
            placeholder="بحث بالاسم، الإيميل، رقم الهاتف..."
            className="form-control"
            style={{ width: '300px', paddingRight: '36px' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={styles.grid}>
        {filtered.map(c => (
          <div key={c.id} style={{ ...styles.card, opacity: c.active ? 1 : 0.6 }}>
            <div style={styles.cardHeader}>
              <div style={styles.avatar}>{c.name.charAt(0)}</div>
              <div>
                <h3 style={styles.name}>{c.name}</h3>
                <span style={{ ...styles.statusBadge, ...(c.active ? styles.statusActive : styles.statusBlocked) }}>
                  {c.active ? 'نشط' : 'محظور'}
                </span>
              </div>
            </div>

            <div style={styles.details}>
              <div style={styles.detailRow}>
                <Mail size={14} /> <span>{c.email}</span>
              </div>
              <div style={styles.detailRow}>
                <Phone size={14} /> <span dir="ltr">{c.phone}</span>
              </div>
              <div style={styles.detailRow}>
                <MapPin size={14} /> <span>{c.city}</span>
              </div>
            </div>

            <div style={styles.stats}>
              <div style={styles.statBox}>
                <p style={styles.statLabel}>إجمالي الطلبات</p>
                <p style={styles.statVal}>{c.totalOrders}</p>
              </div>
              <div style={styles.statBox}>
                <p style={styles.statLabel}>إجمالي المشتريات</p>
                <p style={{ ...styles.statVal, color: 'var(--gold)' }}>{c.totalSpent?.toLocaleString()} ج.م</p>
              </div>
            </div>

            <button
              style={{ ...styles.actionBtn, ...(c.active ? styles.btnBlock : styles.btnUnblock) }}
              onClick={() => toggleStatus(c.id)}
            >
              {c.active ? <><Ban size={16} /> حظر العميل</> : <><CheckCircle size={16} /> رفع الحظر</>}
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={styles.empty}>
          <Users size={48} style={{ color: 'var(--silver-dark)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--silver-dark)' }}>لا يوجد عملاء مطابقين للبحث</p>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  card: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', padding: '24px', display: 'flex', flexDirection: 'column' },
  cardHeader: { display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' },
  avatar: { width: '56px', height: '56px', borderRadius: '14px', background: 'var(--grad-gold)', color: 'var(--black)', fontSize: '1.6rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-heading)' },
  name: { fontSize: '1.1rem', fontWeight: '800', color: 'var(--white)', marginBottom: '4px' },
  statusBadge: { padding: '3px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: '700' },
  statusActive: { background: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  statusBlocked: { background: 'rgba(239,68,68,0.15)', color: '#ef4444' },
  details: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  detailRow: { display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--silver)', fontSize: '0.9rem' },
  stats: { display: 'flex', gap: '12px', marginBottom: '24px' },
  statBox: { flex: 1, background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: 'var(--r-md)', textAlign: 'center' },
  statLabel: { color: 'var(--silver-dark)', fontSize: '0.75rem', marginBottom: '4px' },
  statVal: { color: 'var(--white)', fontSize: '1.2rem', fontWeight: '900', fontFamily: 'var(--font-heading)' },
  actionBtn: { width: '100%', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', border: 'none', transition: 'var(--ease)' },
  btnBlock: { background: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  btnUnblock: { background: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px', background: 'var(--grad-card)', borderRadius: 'var(--r-lg)' },
};

export default AdminCustomers;
