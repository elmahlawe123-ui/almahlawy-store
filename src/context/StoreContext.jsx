import React, { createContext, useState, useEffect, useCallback } from 'react';
import { SettingsDB, CustomersDB } from '../db/database';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  });

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  });

  const [minItemsForPrice, setMinItemsForPriceState] = useState(() => {
    const s = SettingsDB.get();
    return s.minItemsForPrice || 3;
  });

  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
  });

  const [notification, setNotification] = useState(null);

  // Persist
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);
  useEffect(() => { localStorage.setItem('wishlist', JSON.stringify(wishlist)); }, [wishlist]);

  // Show toast notification
  const notify = useCallback((message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Refresh minItemsForPrice from DB
  const refreshSettings = useCallback(() => {
    const s = SettingsDB.get();
    setMinItemsForPriceState(s.minItemsForPrice || 3);
  }, []);

  const setMinItemsForPrice = (val) => {
    setMinItemsForPriceState(val);
    SettingsDB.update({ minItemsForPrice: val });
    localStorage.setItem('minItemsForPrice', val);
  };

  // Cart operations
  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        notify(`تمت زيادة كمية "${product.name}"`);
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      notify(`✓ أُضيف "${product.name}" إلى مجموعتك`);
      return [...prev, { ...product, qty: 1 }];
    });
  }, [notify]);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = i.qty + delta;
        return { ...i, qty: newQty > 0 ? newQty : 1 };
      }
      return i;
    }));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // Wishlist
  const toggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) {
        notify('تم الحذف من المفضلة');
        return prev.filter(i => i.id !== product.id);
      }
      notify('❤ تمت الإضافة للمفضلة');
      return [...prev, product];
    });
  }, [notify]);

  const isWishlisted = useCallback((id) => wishlist.some(i => i.id === id), [wishlist]);

  // Auth
  const login = useCallback((email, password) => {
    const customers = CustomersDB.getAll();
    const customer = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    
    if (customer) {
      if (!customer.active) throw new Error('هذا الحساب محظور، يرجى التواصل مع الإدارة.');
      // In a real app we would check password hash. Here we mock password check (any pass works for existing if we don't store it, or we check if we store it).
      // Since we didn't store passwords initially, any password logs them in for demo.
      setUser({ name: customer.name, email: customer.email, phone: customer.phone, city: customer.city });
      notify('تم تسجيل الدخول بنجاح');
      return true;
    } else {
      throw new Error('البريد الإلكتروني غير مسجل');
    }
  }, [notify]);

  const register = useCallback((name, email, password, phone, city) => {
    const customers = CustomersDB.getAll();
    if (customers.find(c => c.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('البريد الإلكتروني مستخدم بالفعل');
    }
    
    // We add them to DB by mocking an order or direct push to localStorage.
    // For now we'll do it via a quick direct insert (since CustomersDB only has getAll/toggleActive currently, we'll manually insert).
    const newCustomer = {
      id: Date.now().toString(),
      name, email, phone, city, password, // storing password plain text just for demo!
      totalOrders: 0,
      totalSpent: 0,
      createdAt: Date.now(),
      lastOrderAt: null,
      active: true,
    };
    customers.push(newCustomer);
    localStorage.setItem('db_customers', JSON.stringify(customers));
    
    setUser({ name, email, phone, city });
    notify('تم إنشاء الحساب بنجاح');
    return true;
  }, [notify]);

  const logout = useCallback(() => {
    setUser(null);
    notify('تم تسجيل الخروج بنجاح');
  }, [notify]);

  const cartCount = cart.reduce((a, i) => a + i.qty, 0);
  const cartTotal = cart.reduce((a, i) => a + (i.price * i.qty), 0);
  const uniqueTypesCount = cart.filter(i => !i.items).length;
  const isPriceRevealed = uniqueTypesCount === 0 || uniqueTypesCount >= minItemsForPrice;

  return (
    <StoreContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart,
      cartCount, cartTotal, uniqueTypesCount, isPriceRevealed,
      user, login, logout, register,
      wishlist, toggleWishlist, isWishlisted,
      minItemsForPrice, setMinItemsForPrice, refreshSettings,
      notification,
    }}>
      {children}
    </StoreContext.Provider>
  );
};
