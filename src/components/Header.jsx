import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { ShoppingCart, User, LogOut, Menu, X, Heart, Search } from 'lucide-react';

const Header = () => {
  const { cart, user, logout, wishlist } = useContext(StoreContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const wishlistCount = wishlist.length;
  const isHome = location.pathname === '/';

  const announcements = [
    '✦ مرحباً بكم في معرض المحلاوى — الريادة في عالم الأدوات الصحية ✦',
    '🚚 توصيل مجاني لجميع أنحاء مصر على جميع الطلبات',
    '💳 ندعم الدفع كاش عند الاستلام والتحويل البنكي',
    '🏆 جميع منتجاتنا أصلية 100% بضمان الجودة',
    '⭐ أكثر من 6000 عميل سعيد — انضم إلينا اليوم',
  ];
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [announceFade, setAnnounceFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnounceFade(false);
      setTimeout(() => {
        setAnnouncementIdx(i => (i + 1) % announcements.length);
        setAnnounceFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openSearch = () => document.dispatchEvent(new CustomEvent('open-search'));

  const navLinks = [
    { to: '/', label: 'الرئيسية' },
    { to: '/shop', label: 'المتجر' },
    { to: '/bundles', label: 'العروض المجمعة' },
    { to: '/offers', label: 'عروض خاصة', badge: 'جديد' },
    { to: '/compare', label: 'المقارنة' },
    { to: '/about', label: 'من نحن' },
    { to: '/contact', label: 'اتصل بنا' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header style={{
        ...styles.header,
        backgroundColor: isHome && !scrolled ? 'transparent' : 'rgba(13,13,13,0.97)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.4)' : 'none',
      }}>
        {/* Top bar — rotating announcements */}
        <div style={styles.topBar}>
          <div className="container" style={styles.topBarInner}>
            <span style={{ ...styles.topBarText, opacity: announceFade ? 1 : 0, transition: 'opacity 0.3s ease' }}>
              {announcements[announcementIdx]}
            </span>
          </div>
        </div>

        {/* Main header */}
        <div style={styles.mainBar}>
          <div className="container" style={styles.container}>

            {/* Logo */}
            <Link to="/" style={styles.logo}>
              <div style={styles.logoIcon}>م</div>
              <div style={styles.logoText}>
                <span style={styles.logoMain}>المحلاوى</span>
                <span style={styles.logoSub}>للأدوات الصحية</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav style={styles.nav}>
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    ...styles.navLink,
                    ...(isActive(link.to) ? styles.navLinkActive : {}),
                  }}
                >
                  {link.label}
                  {link.badge && <span style={styles.navBadge}>{link.badge}</span>}
                  {isActive(link.to) && <span style={styles.navUnderline} />}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div style={styles.actions}>
              {/* Search */}
              <button onClick={openSearch} style={styles.searchTrigger} title="بحث" id="search-trigger">
                <Search size={19} />
              </button>

              {user ? (
                <div style={styles.userPill}>
                  <Link to="/account" style={styles.userNameLink}>
                    <User size={15} />
                    <span style={styles.userName}>{user.name}</span>
                  </Link>
                  <button onClick={logout} style={styles.logoutBtn} title="خروج">
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <Link to="/login" style={styles.loginBtn}>
                  <User size={16} />
                  <span>دخول</span>
                </Link>
              )}

              <Link to="/cart" style={styles.cartBtn} id="cart-button">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span style={styles.cartBadge}>{cartCount}</span>
                )}
              </Link>

              {/* Wishlist */}
              <Link to="/account" style={styles.wishlistBtn} id="wishlist-button" title="المفضلة">
                <Heart size={20} fill={wishlistCount > 0 ? '#ef4444' : 'none'} style={{ color: wishlistCount > 0 ? '#ef4444' : 'var(--silver)' }} />
                {wishlistCount > 0 && (
                  <span style={{ ...styles.cartBadge, background: '#ef4444' }}>{wishlistCount}</span>
                )}
              </Link>

              {/* Hamburger */}
              <button
                style={styles.hamburger}
                onClick={() => setMenuOpen(!menuOpen)}
                id="mobile-menu-toggle"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>
        </div>

        {/* Gold accent line */}
        <div style={styles.goldLine} />
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu} id="mobile-menu">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                ...styles.mobileLink,
                ...(isActive(link.to) ? styles.mobileLinkActive : {}),
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
              تسجيل الدخول
            </Link>
          )}
        </div>
      )}
    </>
  );
};

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    transition: 'background-color 0.4s ease, box-shadow 0.4s ease',
  },
  topBar: {
    background: 'var(--grad-gold)',
    padding: '6px 0',
  },
  topBarInner: {
    textAlign: 'center',
  },
  userNameLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--white)',
    textDecoration: 'none',
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: '700',
    display: 'block',
  },
  topBarText: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: 'var(--black)',
    fontFamily: 'var(--font-heading)',
    letterSpacing: '1px',
  },
  searchTrigger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'var(--silver)',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'var(--ease)',
  },
  navBadge: {
    display: 'inline-block',
    background: 'var(--grad-gold)',
    color: 'var(--black)',
    fontSize: '0.6rem',
    fontWeight: '900',
    padding: '1px 6px',
    borderRadius: '50px',
    marginRight: '4px',
    verticalAlign: 'middle',
  },
  mainBar: {
    backgroundColor: 'rgba(13,13,13,0.97)',
    backdropFilter: 'blur(20px)',
    padding: '16px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0,
  },
  logoIcon: {
    width: '44px',
    height: '44px',
    background: 'var(--grad-gold)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    fontWeight: '900',
    color: 'var(--black)',
    fontFamily: 'var(--font-heading)',
    boxShadow: 'var(--shadow-gold)',
    flexShrink: 0,
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.2,
  },
  logoMain: {
    fontSize: '1.4rem',
    fontWeight: '900',
    color: 'var(--gold)',
    fontFamily: 'var(--font-heading)',
  },
  logoSub: {
    fontSize: '0.7rem',
    color: 'var(--silver-dark)',
    letterSpacing: '1px',
  },
  nav: {
    display: 'flex',
    gap: '8px',
    flex: 1,
    justifyContent: 'center',
  },
  navLink: {
    position: 'relative',
    padding: '8px 18px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: 'var(--silver)',
    fontFamily: 'var(--font-heading)',
    transition: 'var(--ease)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  navLinkActive: {
    color: 'var(--gold)',
    background: 'rgba(201,169,110,0.08)',
  },
  navUnderline: {
    position: 'absolute',
    bottom: '4px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '2px',
    background: 'var(--grad-gold)',
    borderRadius: '1px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0,
  },
  userPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(201,169,110,0.1)',
    border: '1px solid rgba(201,169,110,0.25)',
    padding: '7px 14px',
    borderRadius: '50px',
    color: 'var(--gold)',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  userName: {
    maxWidth: '100px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    background: 'none',
    color: 'var(--silver-dark)',
    display: 'flex',
    alignItems: 'center',
    padding: '2px',
    borderRadius: '4px',
    transition: 'var(--ease)',
  },
  loginBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--silver)',
    fontSize: '0.9rem',
    fontWeight: '600',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    transition: 'var(--ease)',
  },
  cartBtn: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    background: 'var(--grad-gold)',
    color: 'var(--black)',
    flexShrink: 0,
    transition: 'var(--ease-bounce)',
    boxShadow: 'var(--shadow-gold)',
  },
  wishlistBtn: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'var(--silver)',
    flexShrink: 0,
    transition: 'var(--ease-bounce)',
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'var(--white)',
    color: 'var(--black)',
    fontSize: '0.7rem',
    fontWeight: '900',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--black-mid)',
  },
  hamburger: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.06)',
    color: 'var(--silver)',
    '@media(max-width: 768px)': { display: 'flex' },
  },
  goldLine: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent 0%, var(--gold) 30%, var(--gold-light) 50%, var(--gold) 70%, transparent 100%)',
    opacity: 0.6,
  },
  mobileMenu: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'rgba(13,13,13,0.98)',
    backdropFilter: 'blur(20px)',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '40px',
  },
  mobileLink: {
    width: '100%',
    maxWidth: '300px',
    textAlign: 'center',
    padding: '18px 24px',
    borderRadius: '12px',
    fontSize: '1.2rem',
    fontWeight: '700',
    fontFamily: 'var(--font-heading)',
    color: 'var(--silver)',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.03)',
    transition: 'var(--ease)',
  },
  mobileLinkActive: {
    color: 'var(--gold)',
    borderColor: 'rgba(201,169,110,0.3)',
    background: 'rgba(201,169,110,0.08)',
  },
};

export default Header;
