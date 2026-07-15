import { useState, useEffect, useContext } from 'react';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tag, Gift, Settings, ShoppingCart, User,
  Menu, X, ChevronLeft, LogOut, ShieldAlert, Bell, Mail
} from 'lucide-react';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminBundles from './AdminBundles';
import AdminDashboard from './AdminDashboard';
import AdminOrders from './AdminOrders';
import AdminCustomers from './AdminCustomers';
import AdminCoupons from './AdminCoupons';
import AdminSliders from './AdminSliders';
import AdminSettings from './AdminSettings';
import AdminMessages from './AdminMessages';

// ─── ADMIN AUTH GATE ─────────────────────────────────────────────────────────
const ADMIN_PASS = 'admin123'; // In real app, this would be a backend auth

const AdminApp = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_authed') === '1');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newOrders, setNewOrders] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (!authed) return;
    const { OrdersDB } = require('../db/database');
    const checkNewOrders = () => {
      const all = OrdersDB.getAll();
      const lastSeen = parseInt(sessionStorage.getItem('admin_last_seen_orders') || '0');
      const pending = all.filter(o => o.status === 'pending').length;
      const newCount = Math.max(0, all.length - lastSeen);
      setNewOrders(newCount);
      
      const { MessagesDB } = require('../db/database');
      setUnreadMessages(MessagesDB.getUnreadCount());
    };
    checkNewOrders();
    const iv = setInterval(checkNewOrders, 10000);
    return () => clearInterval(iv);
  }, [authed]);

  if (!authed) {
    return (
      <div style={loginStyles.page}>
        <div style={loginStyles.card}>
          <div style={loginStyles.icon}><ShieldAlert size={32} color="#0D0D0D" /></div>
          <h2 style={loginStyles.title}>لوحة التحكم</h2>
          <p style={loginStyles.sub}>أدخل كلمة مرور الإدارة للمتابعة</p>
          <form onSubmit={e => {
            e.preventDefault();
            if (pass === ADMIN_PASS) {
              sessionStorage.setItem('admin_authed', '1');
              setAuthed(true);
            } else {
              setError('كلمة المرور غير صحيحة');
            }
          }}>
            <input
              type="password"
              className="form-control"
              placeholder="كلمة المرور"
              value={pass}
              onChange={e => { setPass(e.target.value); setError(''); }}
              style={{ marginBottom: '8px' }}
            />
            {error && <p style={loginStyles.error}>{error}</p>}
            <button className="btn btn-gold" style={{ width: '100%', marginTop: '12px' }}>دخول</button>
          </form>
          <Link to="/" style={loginStyles.back}>← العودة للموقع</Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { to: '/admin', label: 'الرئيسية', icon: <LayoutDashboard size={18} />, exact: true },
    { to: '/admin/orders', label: 'الطلبات', icon: <ShoppingCart size={18} />, badge: newOrders > 0 ? newOrders : null },
    { to: '/admin/customers', label: 'العملاء', icon: <User size={18} /> },
    { to: '/admin/products', label: 'المنتجات', icon: <Package size={18} /> },
    { to: '/admin/categories', label: 'التصنيفات', icon: <Tag size={18} /> },
    { to: '/admin/bundles', label: 'العروض المجمعة', icon: <Gift size={18} /> },
    { to: '/admin/coupons', label: 'كوبونات الخصم', icon: <Tag size={18} /> },
    { to: '/admin/sliders', label: 'بنرات الرئيسية', icon: <LayoutDashboard size={18} /> },
    { to: '/admin/messages', label: 'الرسائل', icon: <Mail size={18} />, badge: unreadMessages > 0 ? unreadMessages : 0 },
    { to: '/admin/settings', label: 'الإعدادات', icon: <Settings size={18} /> },
  ];

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: sidebarOpen ? '260px' : '68px' }}>
        <div style={styles.sidebarTop}>
          {sidebarOpen && (
            <div style={styles.sidebarLogo}>
              <div style={styles.logoIcon}>م</div>
              <div>
                <p style={styles.logoName}>المحلاوى</p>
                <p style={styles.logoSub}>لوحة الإدارة</p>
              </div>
            </div>
          )}
          <button style={styles.toggleBtn} onClick={() => setSidebarOpen(o => !o)}>
            {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav style={styles.nav}>
          {navItems.map(item => (
            <NavLink key={item.to} item={item} open={sidebarOpen} />
          ))}
        </nav>

        <div style={styles.sidebarBottom}>
          <Link to="/" style={styles.exitBtn}>
            <LogOut size={16} />
            {sidebarOpen && <span>العودة للموقع</span>}
          </Link>
          <button
            style={styles.logoutBtn}
            onClick={() => { sessionStorage.removeItem('admin_authed'); setAuthed(false); }}
          >
            <X size={16} />
            {sidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/customers" element={<AdminCustomers />} />
          <Route path="/products/*" element={<AdminProducts />} />
          <Route path="/categories" element={<AdminCategories />} />
          <Route path="/bundles/*" element={<AdminBundles />} />
          <Route path="/coupons" element={<AdminCoupons />} />
          <Route path="/sliders" element={<AdminSliders />} />
          <Route path="/messages" element={<AdminMessages />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
};

// Nav Link component
const NavLink = ({ item, open }) => {
  const location = useLocation();
  const isActive = item.exact
    ? location.pathname === item.to
    : location.pathname.startsWith(item.to) && item.to !== '/admin';

  return (
    <Link
      to={item.to}
      style={{
        ...styles.navItem,
        ...(isActive ? styles.navItemActive : {}),
        justifyContent: open ? 'flex-start' : 'center',
        position: 'relative',
      }}
      title={!open ? item.label : undefined}
    >
      <span style={{ flexShrink: 0, position: 'relative' }}>
        {item.icon}
        {item.badge && (
          <span style={{
            position: 'absolute', top: '-6px', right: '-8px',
            background: '#ef4444', color: '#fff',
            fontSize: '0.6rem', fontWeight: '900',
            width: '16px', height: '16px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'waPulse 1.5s infinite',
          }}>{item.badge}</span>
        )}
      </span>
      {open && <span style={styles.navLabel}>{item.label}</span>}
      {open && item.badge && (
        <span style={{
          marginRight: 'auto',
          background: '#ef4444', color: '#fff',
          fontSize: '0.7rem', fontWeight: '900',
          padding: '2px 8px', borderRadius: '50px',
        }}>{item.badge} جديد</span>
      )}
    </Link>
  );
};


// ─── STYLES ─────────────────────────────────────────────────────────────────
const loginStyles = {
  page: {
    minHeight: '100vh',
    background: 'var(--black)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: 'var(--grad-card)',
    border: '1px solid rgba(201,169,110,0.2)',
    borderRadius: 'var(--r-lg)',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  icon: {
    width: '64px', height: '64px',
    background: 'var(--grad-gold)',
    borderRadius: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 24px',
    boxShadow: 'var(--shadow-gold)',
  },
  title: { fontSize: '1.8rem', fontWeight: '900', color: 'var(--white)', marginBottom: '8px' },
  sub: { color: 'var(--silver-dark)', marginBottom: '28px', fontSize: '0.9rem' },
  error: { color: '#ef4444', fontSize: '0.85rem', marginTop: '4px' },
  back: { display: 'block', marginTop: '20px', color: 'var(--silver-dark)', fontSize: '0.85rem' },
};

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0A0A0A',
    direction: 'rtl',
  },
  sidebar: {
    background: 'var(--black-mid)',
    borderLeft: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease',
    flexShrink: 0,
    overflow: 'hidden',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },
  sidebarTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    gap: '12px',
    minHeight: '80px',
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    overflow: 'hidden',
  },
  logoIcon: {
    width: '36px', height: '36px',
    background: 'var(--grad-gold)',
    borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.1rem', fontWeight: '900', color: 'var(--black)',
    fontFamily: 'var(--font-heading)',
    flexShrink: 0,
  },
  logoName: {
    fontSize: '1rem', fontWeight: '800', color: 'var(--gold)',
    fontFamily: 'var(--font-heading)', lineHeight: 1.2,
  },
  logoSub: { fontSize: '0.65rem', color: 'var(--silver-dark)', marginTop: '1px' },
  toggleBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: 'var(--silver)',
    width: '34px', height: '34px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
  },
  nav: {
    flex: 1,
    padding: '12px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflowY: 'auto',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '11px 12px',
    borderRadius: '10px',
    color: 'var(--silver-dark)',
    fontWeight: '600',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-heading)',
    transition: 'var(--ease)',
    whiteSpace: 'nowrap',
  },
  navItemActive: {
    background: 'rgba(201,169,110,0.12)',
    color: 'var(--gold)',
    borderRight: '3px solid var(--gold)',
  },
  navLabel: { overflow: 'hidden' },
  sidebarBottom: {
    padding: '12px 10px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  exitBtn: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', borderRadius: '10px',
    color: 'var(--silver-dark)', fontSize: '0.88rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 12px', borderRadius: '10px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.15)',
    color: '#ef4444', fontSize: '0.88rem',
    fontFamily: 'var(--font-heading)',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
    background: '#0A0A0A',
  },
};

export default AdminApp;
