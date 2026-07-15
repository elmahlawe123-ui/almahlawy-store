import { useState, useEffect } from 'react';
import { Package, Tag, Gift, ShoppingCart, Users, DollarSign, Activity, Ticket } from 'lucide-react';
import { ProductsDB, CategoriesDB, BundlesDB, OrdersDB, CustomersDB, CouponsDB } from '../db/database';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0, categories: 0, bundles: 0, orders: 0,
    customers: 0, coupons: 0, totalRevenue: 0, todayOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const allOrders = OrdersDB.getAll();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const revenue = allOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.total || 0), 0);
    const todayCount = allOrders.filter(o => new Date(o.createdAt) >= today).length;

    setStats({
      products: ProductsDB.getAll().length,
      categories: CategoriesDB.getAll().length,
      bundles: BundlesDB.getAll().length,
      orders: allOrders.length,
      customers: CustomersDB.getAll().length,
      coupons: CouponsDB.getAll().length,
      totalRevenue: revenue,
      todayOrders: todayCount,
    });

    setRecentOrders(allOrders.slice(0, 5));
  }, []);

  const kpis = [
    { label: 'إجمالي المبيعات', value: `${stats.totalRevenue.toLocaleString()} ج.م`, icon: <DollarSign size={24} />, color: '#22c55e' },
    { label: 'طلبات اليوم', value: stats.todayOrders, icon: <Activity size={24} />, color: '#3b82f6' },
    { label: 'العملاء المسجلين', value: stats.customers, icon: <Users size={24} />, color: '#C9A96E' },
    { label: 'إجمالي الطلبات', value: stats.orders, icon: <ShoppingCart size={24} />, color: '#f59e0b' },
  ];

  const secondaryStats = [
    { label: 'المنتجات', value: stats.products, icon: <Package size={20} />, color: '#888' },
    { label: 'التصنيفات', value: stats.categories, icon: <Tag size={20} />, color: '#888' },
    { label: 'العروض', value: stats.bundles, icon: <Gift size={20} />, color: '#888' },
    { label: 'الكوبونات', value: stats.coupons, icon: <Ticket size={20} />, color: '#888' },
  ];

  // Mock chart data (last 7 days)
  const chartDays = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  const chartValues = [40, 60, 45, 80, 55, 90, 75]; // % heights

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>لوحة التحكم</h1>
        <p style={styles.sub}>ملخص أداء المتجر والإحصائيات</p>
      </div>

      {/* Primary KPIs */}
      <div style={styles.kpiGrid}>
        {kpis.map(c => (
          <div key={c.label} style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: `${c.color}15`, color: c.color }}>
              {c.icon}
            </div>
            <div>
              <p style={{ ...styles.statValue, color: c.label === 'إجمالي المبيعات' ? 'var(--gold)' : 'var(--white)' }}>{c.value}</p>
              <p style={styles.statLabel}>{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {/* Sales Chart (CSS Based) */}
        <div style={styles.chartCard}>
          <h2 style={styles.sectionTitle}>مبيعات آخر 7 أيام (تقريبي)</h2>
          <div style={styles.chartWrap}>
            {chartValues.map((val, i) => (
              <div key={i} style={styles.chartBarCol}>
                <div style={{ ...styles.chartBar, height: `${val}%` }} />
                <span style={styles.chartLabel}>{chartDays[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Stats */}
        <div style={styles.chartCard}>
          <h2 style={styles.sectionTitle}>نظرة عامة على الكتالوج</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
            {secondaryStats.map(s => (
              <div key={s.label} style={styles.secStatRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', color: 'var(--silver-dark)' }}>{s.icon}</div>
                  <span style={{ color: 'var(--silver)' }}>{s.label}</span>
                </div>
                <span style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--white)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={styles.chartCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ ...styles.sectionTitle, margin: 0 }}>أحدث الطلبات</h2>
          <a href="/admin/orders" style={{ color: 'var(--gold)', fontSize: '0.85rem', textDecoration: 'none' }}>عرض الكل ←</a>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th style={styles.th}>رقم الطلب</th>
                <th style={styles.th}>العميل</th>
                <th style={styles.th}>الإجمالي</th>
                <th style={styles.th}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--silver-dark)' }}>لا توجد طلبات بعد</td></tr>
              ) : (
                recentOrders.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={styles.td}><span style={{ fontFamily: 'monospace', color: 'var(--silver)' }}>{o.id.slice(-8)}</span></td>
                    <td style={styles.td}><span style={{ color: 'var(--white)' }}>{o.customer?.name}</span></td>
                    <td style={styles.td}><span style={{ color: 'var(--gold)', fontWeight: '700' }}>{o.total?.toLocaleString()} ج.م</span></td>
                    <td style={styles.td}>
                      <span style={{ padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}>
                        {o.status === 'pending' ? 'قيد الانتظار' : o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '40px' },
  header: { marginBottom: '32px' },
  title: { fontSize: '1.8rem', fontWeight: '900', color: 'var(--white)', marginBottom: '4px' },
  sub: { color: 'var(--silver-dark)', fontSize: '0.9rem' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' },
  statCard: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' },
  statIcon: { width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: '1.5rem', fontWeight: '900', fontFamily: 'var(--font-heading)', lineHeight: 1.2 },
  statLabel: { color: 'var(--silver-dark)', fontSize: '0.85rem', marginTop: '4px' },
  chartCard: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', padding: '24px', minWidth: '300px' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: '800', color: 'var(--white)', marginBottom: '20px' },
  chartWrap: { height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  chartBarCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '30px', height: '100%', justifyContent: 'flex-end' },
  chartBar: { width: '100%', background: 'linear-gradient(to top, rgba(201,169,110,0.2), rgba(201,169,110,0.8))', borderRadius: '6px 6px 0 0', transition: 'height 1s ease' },
  chartLabel: { fontSize: '0.7rem', color: 'var(--silver-dark)', whiteSpace: 'nowrap', marginTop: '8px' },
  secStatRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  th: { padding: '14px 10px', color: 'var(--silver-dark)', fontSize: '0.8rem', fontWeight: '600' },
  td: { padding: '14px 10px', fontSize: '0.9rem' },
};

export default AdminDashboard;
