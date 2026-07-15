// =============================================
// DATABASE ENGINE - Local Storage Simulation
// محاكاة قاعدة بيانات حقيقية باستخدام LocalStorage
// =============================================

const DB_KEYS = {
  products: 'db_products',
  categories: 'db_categories',
  bundles: 'db_bundles',
  settings: 'db_settings',
  orders: 'db_orders',
  coupons: 'db_coupons',
  customers: 'db_customers',
  sliders: 'db_sliders',
  messages: 'db_messages',
};

// ─── SEED DATA (Initial data loaded once) ────────────────────────────────────
const seedCategories = [
  { id: 1, name: 'خلاطات', icon: '🚿', color: '#C9A96E', createdAt: Date.now() },
  { id: 2, name: 'أطقم حمامات', icon: '🛁', color: '#888', createdAt: Date.now() },
  { id: 3, name: 'بانيوهات', icon: '🛀', color: '#C9A96E', createdAt: Date.now() },
  { id: 4, name: 'إكسسوارات', icon: '✨', color: '#888', createdAt: Date.now() },
  { id: 5, name: 'تأسيس وسباكة', icon: '🔧', color: '#C9A96E', createdAt: Date.now() },
  { id: 6, name: 'مراحيض', icon: '🚽', color: '#888', createdAt: Date.now() },
];

const seedProducts = [
  {
    id: 101, name: 'خلاط حوض جروهى يورو سمارت', brand: 'جروهى', brandId: 4, price: 3450, categoryId: 1, category: 'خلاطات',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'خلاط حوض عالي الجودة بتصميم عصري ولمعان يدوم طويلاً.', stock: 25, active: true, featured: true, createdAt: Date.now(),
  },
  {
    id: 102, name: 'طقم حمام ايديال ستاندرد سبيس', brand: 'ايديال ستاندرد', brandId: 3, price: 5200, categoryId: 2, category: 'أطقم حمامات',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=400',
    description: 'طقم حمام كامل يشمل الحوض والمرحاض بتصميم انسيابي مريح.', stock: 10, active: true, featured: true, createdAt: Date.now(),
  },
  {
    id: 103, name: 'بانيو الطيب أكريليك 170x70', brand: 'بانيوهات الطيب', brandId: 5, price: 4800, categoryId: 3, category: 'بانيوهات',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174296fb?auto=format&fit=crop&q=80&w=400',
    description: 'بانيو أكريليك عالي المتانة ومقاوم للخدش والانزلاق.', stock: 8, active: true, featured: false, createdAt: Date.now(),
  },
  {
    id: 104, name: 'مجموعة إكسسوارات بليزا فضي', brand: 'بليزا', brandId: 6, price: 1200, categoryId: 4, category: 'إكسسوارات',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=400',
    description: 'مكونة من 6 قطع متينة بتشطيب فضي لامع.', stock: 40, active: true, featured: false, createdAt: Date.now(),
  },
  {
    id: 105, name: 'مواسير بولو بلاست ضغط عالي', brand: 'بولو بلاست', brandId: 1, price: 150, categoryId: 5, category: 'تأسيس وسباكة',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=400',
    description: 'مواسير بولى بروبيلين مقاومة للحرارة والضغط.', stock: 200, active: true, featured: false, createdAt: Date.now(),
  },
  {
    id: 106, name: 'مرحاض معلق استاندورف', brand: 'استاندورف', brandId: 2, price: 6500, categoryId: 6, category: 'مراحيض',
    image: 'https://images.unsplash.com/photo-1552550186-b4d6df1ea7f7?auto=format&fit=crop&q=80&w=400',
    description: 'مرحاض معلق عصري يوفر المساحة ويتميز بتدفق ماء قوي.', stock: 12, active: true, featured: true, createdAt: Date.now(),
  },
  {
    id: 107, name: 'خلاط مطبخ جروهى بسماعة شداد', brand: 'جروهى', brandId: 4, price: 6200, categoryId: 1, category: 'خلاطات',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
    description: 'خلاط مطبخ احترافي مع سماعة قابلة للسحب لتسهيل غسيل الأطباق والأحواض الكبيرة.', stock: 15, active: true, featured: true, createdAt: Date.now(),
  },
  {
    id: 108, name: 'كابينة استحمام الطيب زجاج سيكوريت', brand: 'بانيوهات الطيب', brandId: 5, price: 9500, categoryId: 3, category: 'بانيوهات',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=400',
    description: 'كابينة استحمام فاخرة من الزجاج السيكوريت الآمن بمقاس 90×90 سم.', stock: 5, active: true, featured: true, createdAt: Date.now(),
  },
  {
    id: 109, name: 'طقم ديورافيت دى كود', brand: 'ديورافيت', brandId: 7, price: 5800, categoryId: 2, category: 'أطقم حمامات',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=400',
    description: 'تصميم ألماني عصري يناسب كافة المساحات، يشمل الحوض والمرحاض.', stock: 18, active: true, featured: false, createdAt: Date.now(),
  },
  {
    id: 110, name: 'حوض ديورافيت ستايل مع عامود', brand: 'ديورافيت', brandId: 7, price: 2100, categoryId: 2, category: 'أطقم حمامات',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
    description: 'حوض حمام أنيق مقاس 60 سم مع عامود كامل يخفي الوصلات بشكل مثالي.', stock: 22, active: true, featured: false, createdAt: Date.now(),
  },
  {
    id: 111, name: 'سخان أريستون كهرباء 50 لتر', brand: 'أريستون', brandId: 8, price: 4300, categoryId: 4, category: 'إكسسوارات',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=400',
    description: 'سخان مياه كهربائي إيطالي الصنع، موفر للطاقة ويحتوي على خزان مطلي بالمينا.', stock: 30, active: true, featured: true, createdAt: Date.now(),
  },
  {
    id: 112, name: 'محبس زاوية جروهى 1/2 بوصة', brand: 'جروهى', brandId: 4, price: 350, categoryId: 5, category: 'تأسيس وسباكة',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=400',
    description: 'محبس زاوية أصلي مطلي بالكروم لضمان عمر أطول وعدم تسريب المياه.', stock: 150, active: true, featured: false, createdAt: Date.now(),
  },
  {
    id: 113, name: 'طقم إكسسوار حمام ذهبي 4 قطع', brand: 'بليزا', brandId: 6, price: 1850, categoryId: 4, category: 'إكسسوارات',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=400',
    description: 'إضافة فاخرة لحمامك بلون ذهبي لامع، يشمل حامل فوط، وراقة، وصبانة، وحامل فرشاة.', stock: 20, active: true, featured: true, createdAt: Date.now(),
  },
  {
    id: 114, name: 'خلاط بانيو جروهى ايسينس', brand: 'جروهى', brandId: 4, price: 5400, categoryId: 1, category: 'خلاطات',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400',
    description: 'خلاط بانيو دش بتصميم أسطواني أنيق وتقنية سيلك موف للتحكم الدقيق بالمياه.', stock: 10, active: true, featured: false, createdAt: Date.now(),
  },
  {
    id: 115, name: 'شطاف خارجي روكا كروم', brand: 'روكا', brandId: 9, price: 850, categoryId: 4, category: 'إكسسوارات',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=400',
    description: 'شطاف خارجي كامل مع خرطوم مرن وحامل حائطي، جودة إسبانية ممتازة.', stock: 60, active: true, featured: false, createdAt: Date.now(),
  },
  {
    id: 116, name: 'صندوق طرد مدفون جيبريت', brand: 'جيبريت', brandId: 10, price: 3900, categoryId: 5, category: 'تأسيس وسباكة',
    image: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=400',
    description: 'صندوق طرد ألماني مدفون داخل الحائط لتوفير المساحة وإعطاء مظهر عصري أنيق للحمام.', stock: 25, active: true, featured: true, createdAt: Date.now(),
  }
];

const seedBundles = [
  {
    id: 201,
    name: 'العرض الماسي - تشطيب كامل',
    price: 14500,
    oldPrice: 16200,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=600',
    description: 'احصل على طقم حمام ايديال، خلاطات جروهي، وبانيو الطيب بسعر لا يقبل المنافسة.',
    items: ['طقم حمام ايديال ستاندرد', 'طقم خلاطات جروهي 3 قطع', 'بانيو الطيب 170 سم'],
    active: true,
    featured: true,
    createdAt: Date.now(),
  },
  {
    id: 202,
    name: 'عرض التأسيس من بولو بلاست',
    price: 4500,
    oldPrice: 5100,
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=600',
    description: 'مجموعة التأسيس الكاملة لحمامك بمواسير ووصلات بولو بلاست الألمانية الأصلية.',
    items: ['مواسير بولو بلاست', 'وصلات وملحقات كاملة لحمام ومطبخ'],
    active: true,
    featured: true,
    createdAt: Date.now(),
  },
];

const seedSettings = {
  minItemsForPrice: 2,
  storeName: 'معرض المحلاوى للأدوات الصحية',
  phone: '+201015553120',
  address: 'القاهرة، مصر',
  email: 'info@almahlawy.com',
  geminiApiKey: '',
  maintenanceMode: false,
  primaryColor: '#C9A96E',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  tiktokUrl: 'https://tiktok.com',
};

const seedSliders = [
  {
    id: 1,
    title: 'تأسيس بيتك يبدأ من هنا',
    subtitle: 'أفضل الخصومات على كافة أدوات السباكة',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1200',
    link: '/shop',
    active: true,
    createdAt: Date.now(),
  },
  {
    id: 2,
    title: 'الرفاهية في حمامك',
    subtitle: 'تشكيلة بانيوهات وكبائن استحمام فاخرة',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1200',
    link: '/bundles',
    active: true,
    createdAt: Date.now(),
  },
];

const seedCoupons = [
  {
    id: 1,
    code: 'WELCOME10',
    type: 'percent', // 'percent' or 'fixed'
    value: 10, // 10%
    maxUsage: 100,
    usedCount: 0,
    active: true,
    createdAt: Date.now(),
  }
];

// ─── INITIALIZE ────────────────────────────────────────────────────────────
function initDB() {
  // Temporary forced refresh for new products & settings
  localStorage.removeItem(DB_KEYS.products);
  localStorage.removeItem(DB_KEYS.settings);

  if (!localStorage.getItem(DB_KEYS.categories)) {
    localStorage.setItem(DB_KEYS.categories, JSON.stringify(seedCategories));
  }
  if (!localStorage.getItem(DB_KEYS.products)) {
    localStorage.setItem(DB_KEYS.products, JSON.stringify(seedProducts));
  }
  if (!localStorage.getItem(DB_KEYS.bundles)) {
    localStorage.setItem(DB_KEYS.bundles, JSON.stringify(seedBundles));
  }
  if (!localStorage.getItem(DB_KEYS.settings)) {
    localStorage.setItem(DB_KEYS.settings, JSON.stringify(seedSettings));
  }
  if (!localStorage.getItem(DB_KEYS.messages)) {
    localStorage.setItem(DB_KEYS.messages, JSON.stringify([]));
  }
  if (!localStorage.getItem(DB_KEYS.orders)) {
    localStorage.setItem(DB_KEYS.orders, JSON.stringify([]));
  }
  if (!localStorage.getItem(DB_KEYS.sliders)) {
    localStorage.setItem(DB_KEYS.sliders, JSON.stringify(seedSliders));
  }
  if (!localStorage.getItem(DB_KEYS.coupons)) {
    localStorage.setItem(DB_KEYS.coupons, JSON.stringify(seedCoupons));
  }
  if (!localStorage.getItem(DB_KEYS.customers)) {
    localStorage.setItem(DB_KEYS.customers, JSON.stringify([]));
  }
}

// ─── HELPERS ────────────────────────────────────────────────────────────────
function getAll(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function saveAll(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// ─── PRODUCTS API ───────────────────────────────────────────────────────────
export const ProductsDB = {
  getAll: () => getAll(DB_KEYS.products),
  getActive: () => getAll(DB_KEYS.products).filter(p => p.active),
  getFeatured: () => getAll(DB_KEYS.products).filter(p => p.active && p.featured),
  getById: (id) => getAll(DB_KEYS.products).find(p => p.id === id),

  create: (data) => {
    const products = getAll(DB_KEYS.products);
    const newProduct = { ...data, id: generateId(), createdAt: Date.now() };
    products.unshift(newProduct);
    saveAll(DB_KEYS.products, products);
    return newProduct;
  },

  update: (id, data) => {
    const products = getAll(DB_KEYS.products);
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...data, updatedAt: Date.now() };
    saveAll(DB_KEYS.products, products);
    return products[idx];
  },

  delete: (id) => {
    const products = getAll(DB_KEYS.products).filter(p => p.id !== id);
    saveAll(DB_KEYS.products, products);
  },

  toggleActive: (id) => {
    const products = getAll(DB_KEYS.products);
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx].active = !products[idx].active;
      saveAll(DB_KEYS.products, products);
    }
  },
};

// ─── CATEGORIES API ─────────────────────────────────────────────────────────
export const CategoriesDB = {
  getAll: () => getAll(DB_KEYS.categories),

  create: (data) => {
    const cats = getAll(DB_KEYS.categories);
    const newCat = { ...data, id: generateId(), createdAt: Date.now() };
    cats.push(newCat);
    saveAll(DB_KEYS.categories, cats);
    return newCat;
  },

  update: (id, data) => {
    const cats = getAll(DB_KEYS.categories);
    const idx = cats.findIndex(c => c.id === id);
    if (idx === -1) return null;
    cats[idx] = { ...cats[idx], ...data };
    saveAll(DB_KEYS.categories, cats);
    return cats[idx];
  },

  delete: (id) => {
    const cats = getAll(DB_KEYS.categories).filter(c => c.id !== id);
    saveAll(DB_KEYS.categories, cats);
  },
};

// ─── BUNDLES API ─────────────────────────────────────────────────────────────
export const BundlesDB = {
  getAll: () => getAll(DB_KEYS.bundles),
  getActive: () => getAll(DB_KEYS.bundles).filter(b => b.active),

  create: (data) => {
    const bundles = getAll(DB_KEYS.bundles);
    const newBundle = { ...data, id: generateId(), createdAt: Date.now() };
    bundles.unshift(newBundle);
    saveAll(DB_KEYS.bundles, bundles);
    return newBundle;
  },

  update: (id, data) => {
    const bundles = getAll(DB_KEYS.bundles);
    const idx = bundles.findIndex(b => b.id === id);
    if (idx === -1) return null;
    bundles[idx] = { ...bundles[idx], ...data };
    saveAll(DB_KEYS.bundles, bundles);
    return bundles[idx];
  },

  delete: (id) => {
    const bundles = getAll(DB_KEYS.bundles).filter(b => b.id !== id);
    saveAll(DB_KEYS.bundles, bundles);
  },
};

// ─── SETTINGS API ────────────────────────────────────────────────────────────
export const SettingsDB = {
  get: () => JSON.parse(localStorage.getItem(DB_KEYS.settings) || '{}'),
  update: (data) => {
    const current = JSON.parse(localStorage.getItem(DB_KEYS.settings) || '{}');
    const updated = { ...current, ...data };
    localStorage.setItem(DB_KEYS.settings, JSON.stringify(updated));
    return updated;
  },
};

// ─── ORDERS API ──────────────────────────────────────────────────────────────
export const OrdersDB = {
  getAll: () => getAll(DB_KEYS.orders),

  create: (data) => {
    const orders = getAll(DB_KEYS.orders);
    const newOrder = {
      ...data,
      id: `ORD-${generateId()}`,
      status: 'pending',
      createdAt: Date.now(),
    };
    orders.unshift(newOrder);
    saveAll(DB_KEYS.orders, orders);
    
    // Also add to customer records if logged in
    if (data.customer?.email) {
      const customers = getAll(DB_KEYS.customers);
      const idx = customers.findIndex(c => c.email === data.customer.email);
      if (idx !== -1) {
        customers[idx].totalOrders = (customers[idx].totalOrders || 0) + 1;
        customers[idx].totalSpent = (customers[idx].totalSpent || 0) + data.total;
        customers[idx].lastOrderAt = Date.now();
      } else {
        customers.push({
          id: generateId(),
          name: data.customer.name,
          email: data.customer.email,
          phone: data.customer.phone,
          city: data.customer.city,
          totalOrders: 1,
          totalSpent: data.total,
          createdAt: Date.now(),
          lastOrderAt: Date.now(),
          active: true,
        });
      }
      saveAll(DB_KEYS.customers, customers);
    }
    
    return newOrder;
  },
};

// ─── COUPONS API ─────────────────────────────────────────────────────────────
export const CouponsDB = {
  getAll: () => getAll(DB_KEYS.coupons),
  getByCode: (code) => getAll(DB_KEYS.coupons).find(c => c.code.toUpperCase() === code.toUpperCase() && c.active),
  
  create: (data) => {
    const coupons = getAll(DB_KEYS.coupons);
    const newCoupon = { ...data, id: generateId(), code: data.code.toUpperCase(), usedCount: 0, createdAt: Date.now() };
    coupons.unshift(newCoupon);
    saveAll(DB_KEYS.coupons, coupons);
    return newCoupon;
  },

  update: (id, data) => {
    const coupons = getAll(DB_KEYS.coupons);
    const idx = coupons.findIndex(c => c.id === id);
    if (idx === -1) return null;
    coupons[idx] = { ...coupons[idx], ...data, code: data.code?.toUpperCase() || coupons[idx].code };
    saveAll(DB_KEYS.coupons, coupons);
    return coupons[idx];
  },

  delete: (id) => {
    const coupons = getAll(DB_KEYS.coupons).filter(c => c.id !== id);
    saveAll(DB_KEYS.coupons, coupons);
  },
};

// ─── CUSTOMERS API ───────────────────────────────────────────────────────────
export const CustomersDB = {
  getAll: () => getAll(DB_KEYS.customers),
  toggleActive: (id) => {
    const customers = getAll(DB_KEYS.customers);
    const idx = customers.findIndex(c => c.id === id);
    if (idx !== -1) {
      customers[idx].active = !customers[idx].active;
      saveAll(DB_KEYS.customers, customers);
    }
  },
};

// ─── SLIDERS API ─────────────────────────────────────────────────────────────
export const SlidersDB = {
  getAll: () => getAll(DB_KEYS.sliders),
  getActive: () => getAll(DB_KEYS.sliders).filter(s => s.active),

  create: (data) => {
    const sliders = getAll(DB_KEYS.sliders);
    const newSlider = { ...data, id: generateId(), createdAt: Date.now() };
    sliders.push(newSlider);
    saveAll(DB_KEYS.sliders, sliders);
    return newSlider;
  },

  update: (id, data) => {
    const sliders = getAll(DB_KEYS.sliders);
    const idx = sliders.findIndex(s => s.id === id);
    if (idx === -1) return null;
    sliders[idx] = { ...sliders[idx], ...data };
    saveAll(DB_KEYS.sliders, sliders);
    return sliders[idx];
  },

  delete: (id) => {
    const sliders = getAll(DB_KEYS.sliders).filter(s => s.id !== id);
    saveAll(DB_KEYS.sliders, sliders);
  },
};

// ─── MESSAGES API ─────────────────────────────────────────────────────────────
export const MessagesDB = {
  getAll: () => getAll(DB_KEYS.messages),
  getUnreadCount: () => getAll(DB_KEYS.messages).filter(m => !m.read).length,
  
  add: (data) => {
    const messages = getAll(DB_KEYS.messages);
    const newMsg = { ...data, id: generateId(), read: false, createdAt: Date.now() };
    messages.unshift(newMsg);
    saveAll(DB_KEYS.messages, messages);
    return newMsg;
  },

  markRead: (id) => {
    const messages = getAll(DB_KEYS.messages);
    const idx = messages.findIndex(m => m.id === id);
    if (idx !== -1) {
      messages[idx].read = true;
      saveAll(DB_KEYS.messages, messages);
    }
  },

  delete: (id) => {
    const messages = getAll(DB_KEYS.messages).filter(m => m.id !== id);
    saveAll(DB_KEYS.messages, messages);
  },
};

export { initDB };
export default { ProductsDB, CategoriesDB, BundlesDB, SettingsDB, OrdersDB, CouponsDB, CustomersDB, SlidersDB, MessagesDB, initDB };
