import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Bundles from './pages/Bundles';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Account from './pages/Account';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import OrderTracking from './pages/OrderTracking';
import NotFound from './pages/NotFound';
import Offers from './pages/Offers';
import Compare from './pages/Compare';
import FloatingButtons from './components/FloatingButtons';
import SearchModal from './components/SearchModal';
import QuickView from './components/QuickView';
import CartDrawer from './components/CartDrawer';
import ChatBox from './components/ChatBox';
import AdminApp from './admin/AdminApp';
import { initDB } from './db/database';
import ComingSoon from './pages/ComingSoon';
import { SettingsDB } from './db/database';

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const location = window.location;

  useEffect(() => { 
    initDB();
    const settings = SettingsDB.get();
    
    // Apply primary color if exists
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--gold', settings.primaryColor);
    }

    // Always unlock if we are on the admin path to prevent lockouts
    if (location.pathname.startsWith('/admin')) {
      setUnlocked(true);
      return;
    }

    if (settings.maintenanceMode) {
      setMaintenanceMode(true);
      if (localStorage.getItem('dev_unlocked') === 'true') {
        setUnlocked(true);
      }
    } else {
      setMaintenanceMode(false);
      setUnlocked(true);
    }
  }, [location.pathname]);

  if (maintenanceMode && !unlocked) {
    return <ComingSoon onUnlock={() => {
      localStorage.setItem('dev_unlocked', 'true');
      setUnlocked(true);
    }} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        {/* Admin routes (standalone, no Header/Footer) */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Public routes */}
        <Route path="/*" element={
          <>
            <Header />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/bundles" element={<Bundles />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/account" element={<Account />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/track" element={<OrderTracking />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <FloatingButtons />
            <ChatBox />
            <SearchModal />
            <QuickView />
            <CartDrawer />
            <Toast />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
