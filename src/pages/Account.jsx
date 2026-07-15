import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { Heart, Package, User, Clock, ShoppingBag, CheckCircle, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { OrdersDB } from '../db/database';

const Account = () => {
  const { user, logout, wishlist, toggleWishlist } = useContext(StoreContext);
  const [activeTab, setActiveTab] = useState('wishlist');
  const [userOrders, setUserOrders] = useState([]);

  // Must be before any early return (React rules of hooks)
  useEffect(() => {
    if (user?.email) {
      const allOrders = OrdersDB.getAll();
      const mine = allOrders.filter(o => o.customer?.email?.toLowerCase() === user.email.toLowerCase());
      setUserOrders(mine);
    }
  }, [user]);

  if (!user) {
    return (
      <div style={styles.guestPage}>
        <div style={styles.guestCard}>
          <div style={styles.guestIcon}><User size={40} style={{ color: 'var(--black)' }} /></div>
          <h2 style={styles.guestTitle}>يجب تسجيل الدخول أولاً</h2>
          <p style={styles.guestText}>سجّل دخولك للوصول إلى حسابك، مفضلتك وتتبع طلباتك</p>
          <Link to="/login" className="btn btn-gold btn-lg" style={{ marginTop: '8px' }}>تسجيل الدخول</Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'wishlist', label: 'المفضلة', icon: <Heart size={16} /> },
    { id: 'orders', label: 'طلباتي', icon: <Package size={16} /> },
  ];

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh' }}>
      {/* Profile Header */}
      <div style={styles.profileHero}>
        <div style={styles.profileGlow} />
        <div className="container" style={styles.profileContent}>
          <div style={styles.avatar}>{user.name[0]}</div>
          <div>
            <h1 style={styles.userName}>{user.name}</h1>
            <p style={styles.userEmail}>{user.email}</p>
          </div>
          <button className="btn btn-dark" style={{ marginRight: 'auto' }} onClick={logout}>
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsBar}>
        <div className="container" style={{ display: 'flex', gap: '4px' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{ ...styles.tab, ...(activeTab === t.id ? styles.tabActive : {}) }}
            >
              {t.icon} {t.label}
              {t.id === 'orders' && userOrders.length > 0 && (
                <span style={{ background: 'var(--grad-gold)', color: 'var(--black)', fontSize: '0.7rem', padding: '1px 7px', borderRadius: '50px', fontWeight: '800', marginRight: '4px' }}>{userOrders.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '48px 24px' }}>
        {activeTab === 'wishlist' && (
          <>
            {wishlist.length === 0 ? (
              <div style={styles.emptyState}>
                <Heart size={56} style={{ color: 'var(--silver-dark)', marginBottom: '16px' }} />
                <h3 style={{ color: 'var(--white)', marginBottom: '8px' }}>المفضلة فارغة</h3>
                <p style={{ color: 'var(--silver-dark)', marginBottom: '20px' }}>أضف منتجاتك المفضلة لتجدها هنا لاحقاً</p>
                <Link to="/shop" className="btn btn-gold">تصفح المتجر</Link>
              </div>
            ) : (
              <div className="grid grid-4">
                {wishlist.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </>
        )}

        {activeTab === 'orders' && (
          <>
            {userOrders.length === 0 ? (
              <div style={styles.emptyState}>
                <Clock size={56} style={{ color: 'var(--silver-dark)', marginBottom: '16px' }} />
                <h3 style={{ color: 'var(--white)', marginBottom: '8px' }}>لا توجد طلبات بعد</h3>
                <p style={{ color: 'var(--silver-dark)', marginBottom: '20px' }}>لم تقم بتقديم أي طلب حتى الآن</p>
                <Link to="/shop" className="btn btn-gold">ابدأ التسوق</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {userOrders.map(order => {
                  const statusMap = {
                    pending:   { label: 'قيد الانتظار', color: '#fbbf24', icon: <Clock size={15} /> },
                    confirmed: { label: 'مؤكد',         color: '#22c55e', icon: <CheckCircle size={15} /> },
                    delivered: { label: 'تم التوصيل',   color: '#3b82f6', icon: <Truck size={15} /> },
                    cancelled: { label: 'ملغي',         color: '#ef4444', icon: <Package size={15} /> },
                  };
                  const st = statusMap[order.status] || statusMap.pending;
                  return (
                    <div key={order.id} style={styles.orderCard}>
                      <div style={styles.orderHeader}>
                        <div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--silver-dark)', marginBottom: '4px' }}>رقم الطلب</p>
                          <p style={{ fontFamily: 'monospace', color: 'var(--gold)', fontWeight: '700', fontSize: '0.9rem' }}>{order.id.slice(-10)}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: `${st.color}20`, color: st.color, padding: '6px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '700', border: `1px solid ${st.color}40` }}>
                          {st.icon} {st.label}
                        </div>
                      </div>
                      <div style={styles.orderItems}>
                        {order.items?.slice(0, 3).map((item, i) => (
                          <div key={i} style={styles.orderItemRow}>
                            <img src={item.image} alt={item.name} style={styles.orderItemImg} />
                            <span style={{ flex: 1, color: 'var(--silver)', fontSize: '0.88rem' }}>{item.name}</span>
                            <span style={{ color: 'var(--silver-dark)', fontSize: '0.8rem' }}>x{item.qty}</span>
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <p style={{ color: 'var(--silver-dark)', fontSize: '0.8rem', marginTop: '8px' }}>+{order.items.length - 3} منتجات أخرى</p>
                        )}
                      </div>
                      <div style={styles.orderFooter}>
                        <span style={{ color: 'var(--silver-dark)', fontSize: '0.8rem' }}>{new Date(order.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span style={{ color: 'var(--gold)', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>{order.total?.toLocaleString()} ج.م</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  guestPage: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--black)', padding: '40px' },
  guestCard: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-xl)', padding: '60px 48px', textAlign: 'center', maxWidth: '420px', width: '100%' },
  guestIcon: { width: '72px', height: '72px', borderRadius: '18px', background: 'var(--grad-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: 'var(--shadow-gold)' },
  guestTitle: { fontSize: '1.6rem', fontWeight: '900', color: 'var(--white)', marginBottom: '10px' },
  guestText: { color: 'var(--silver-dark)', lineHeight: 1.7, marginBottom: '24px' },
  profileHero: { position: 'relative', background: 'var(--black-mid)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '48px 0', overflow: 'hidden' },
  profileGlow: { position: 'absolute', top: '50%', right: '10%', transform: 'translateY(-50%)', width: '300px', height: '150px', background: 'radial-gradient(ellipse, rgba(201,169,110,0.12), transparent)', pointerEvents: 'none' },
  profileContent: { display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' },
  avatar: { width: '72px', height: '72px', borderRadius: '18px', background: 'var(--grad-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '900', color: 'var(--black)', fontFamily: 'var(--font-heading)', flexShrink: 0 },
  userName: { fontSize: '1.6rem', fontWeight: '900', color: 'var(--white)', marginBottom: '4px' },
  userEmail: { color: 'var(--silver-dark)', fontSize: '0.9rem' },
  tabsBar: { background: 'var(--black)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0', paddingTop: '8px' },
  tab: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: 'var(--r-md) var(--r-md) 0 0', color: 'var(--silver-dark)', fontWeight: '600', fontSize: '0.9rem', fontFamily: 'var(--font-heading)', cursor: 'pointer', background: 'none', border: 'none', borderBottom: '2px solid transparent', transition: 'var(--ease)' },
  tabActive: { color: 'var(--gold)', borderBottomColor: 'var(--gold)', background: 'rgba(201,169,110,0.05)' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 20px', background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)' },
  orderCard: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', overflow: 'hidden' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  orderItems: { padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' },
  orderItemRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  orderItemImg: { width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 },
  orderFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' },
};

export default Account;
