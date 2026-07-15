import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { OrdersDB, CouponsDB } from '../db/database';
import { CheckCircle, Package, Phone, MapPin, MessageSquare, Lock, ArrowLeft, Tag, X } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, isPriceRevealed, clearCart, user } = useContext(StoreContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=details, 2=confirm, 3=success
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: user?.city || '',
    notes: '',
    paymentMethod: 'cash',
  });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = () => {
    setCouponError('');
    if (!couponCode) return;
    const coupon = CouponsDB.getByCode(couponCode);
    if (!coupon) {
      setCouponError('كود الخصم غير صالح أو منتهي');
      return;
    }
    if (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage) {
      setCouponError('تم استنفاد الحد الأقصى لاستخدام هذا الكود');
      return;
    }
    setAppliedCoupon(coupon);
    setCouponCode('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const discountAmount = appliedCoupon ? (appliedCoupon.type === 'percent' ? cartTotal * (appliedCoupon.value / 100) : appliedCoupon.value) : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setStep(2);
  };

  const confirmOrder = () => {
    const order = OrdersDB.create({
      customer: form,
      items: cart,
      subTotal: cartTotal,
      discount: discountAmount,
      coupon: appliedCoupon ? appliedCoupon.code : null,
      total: finalTotal,
      status: 'pending',
    });
    if (appliedCoupon) {
      CouponsDB.update(appliedCoupon.id, { usedCount: appliedCoupon.usedCount + 1 });
    }
    setOrderId(order.id);
    clearCart();
    setStep(3);
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div style={styles.empty}>
        <Package size={64} style={{ color: 'var(--silver-dark)', marginBottom: '20px' }} />
        <h2 style={{ color: 'var(--white)', marginBottom: '10px' }}>لا يوجد منتجات في السلة</h2>
        <Link to="/shop" className="btn btn-gold" style={{ marginTop: '16px' }}>تسوق الآن</Link>
      </div>
    );
  }

  if (!isPriceRevealed && step !== 3) {
    return (
      <div style={styles.empty}>
        <Lock size={64} style={{ color: 'var(--gold)', marginBottom: '20px' }} />
        <h2 style={{ color: 'var(--white)', marginBottom: '10px' }}>يجب اكتمال المجموعة أولاً</h2>
        <p style={{ color: 'var(--silver-dark)', marginBottom: '20px' }}>أضف المزيد من الأصناف المختلفة للحصول على سعرك</p>
        <Link to="/shop" className="btn btn-gold">العودة للمتجر</Link>
      </div>
    );
  }

  // Success screen
  if (step === 3) {
    return (
      <div style={styles.successPage}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}><CheckCircle size={48} style={{ color: '#22c55e' }} /></div>
          <h1 style={styles.successTitle}>تم استلام طلبك!</h1>
          <p style={styles.successSub}>سيتواصل معك فريقنا قريباً لتأكيد طلبك وتحديد موعد التوصيل</p>
          <div style={styles.orderIdBox}>
            <p style={{ color: 'var(--silver-dark)', fontSize: '0.82rem', marginBottom: '4px' }}>رقم الطلب</p>
            <p style={{ color: 'var(--gold)', fontWeight: '900', fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>{orderId}</p>
          </div>
          <div style={styles.successBtns}>
            <Link to="/" className="btn btn-gold">العودة للرئيسية</Link>
            <Link to="/shop" className="btn btn-dark">مواصلة التسوق</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Steps indicator */}
      <div style={styles.stepsBar}>
        <div className="container" style={styles.stepsInner}>
          {['تفاصيل الطلب', 'المراجعة والتأكيد'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ ...styles.stepDot, ...(step > i + 1 ? styles.stepDone : step === i + 1 ? styles.stepActive : {}) }}>
                {step > i + 1 ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span style={{ color: step === i + 1 ? 'var(--gold)' : 'var(--silver-dark)', fontSize: '0.88rem', fontWeight: '600' }}>{label}</span>
              {i < 1 && <div style={styles.stepLine} />}
            </div>
          ))}
        </div>
      </div>

      <div className="container" style={styles.layout}>
        {/* Form */}
        <div style={styles.formCol}>
          {step === 1 && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}><Phone size={20} style={{ color: 'var(--gold)' }} /> بيانات التواصل والتوصيل</h2>
              <form onSubmit={handleSubmit}>
                <div style={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label">الاسم الكامل *</label>
                    <input name="name" className="form-control" value={form.name} onChange={handleChange} required placeholder="محمد أحمد" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">رقم الهاتف *</label>
                    <input name="phone" className="form-control" value={form.phone} onChange={handleChange} required placeholder="01xxxxxxxxx" dir="ltr" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">العنوان بالتفصيل *</label>
                    <input name="address" className="form-control" value={form.address} onChange={handleChange} required placeholder="الشارع، المبنى، الشقة..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">المدينة *</label>
                    <select name="city" className="form-control" value={form.city} onChange={handleChange} required>
                      <option value="">اختر المدينة</option>
                      {['القاهرة', 'الجيزة', 'الإسكندرية', 'المنصورة', 'طنطا', 'الإسماعيلية', 'السويس', 'أسيوط', 'أسوان', 'الأقصر'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">طريقة الدفع</label>
                    <select name="paymentMethod" className="form-control" value={form.paymentMethod} onChange={handleChange}>
                      <option value="cash">كاش عند الاستلام</option>
                      <option value="transfer">تحويل بنكي</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">ملاحظات إضافية</label>
                    <textarea name="notes" className="form-control" value={form.notes} onChange={handleChange} rows={3} placeholder="أي تفاصيل إضافية تريد إبلاغنا بها..." style={{ resize: 'vertical' }} />
                  </div>
                </div>
                <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '8px' }}>
                  مراجعة الطلب ←
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}><CheckCircle size={20} style={{ color: 'var(--gold)' }} /> مراجعة الطلب</h2>
              <div style={styles.reviewGrid}>
                <div style={styles.reviewItem}><span style={styles.reviewLabel}>الاسم</span><span>{form.name}</span></div>
                <div style={styles.reviewItem}><span style={styles.reviewLabel}>الهاتف</span><span dir="ltr">{form.phone}</span></div>
                <div style={styles.reviewItem}><span style={styles.reviewLabel}>العنوان</span><span>{form.address}</span></div>
                <div style={styles.reviewItem}><span style={styles.reviewLabel}>المدينة</span><span>{form.city}</span></div>
                <div style={styles.reviewItem}><span style={styles.reviewLabel}>الدفع</span><span>{form.paymentMethod === 'cash' ? 'كاش عند الاستلام' : 'تحويل بنكي'}</span></div>
              </div>
              
              {appliedCoupon && (
                <div style={{ padding: '12px', background: 'rgba(34,197,94,0.1)', borderRadius: 'var(--r-md)', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontSize: '0.9rem' }}>
                  <Tag size={16} /> <span>تم تطبيق كود الخصم: {appliedCoupon.code}</span>
                </div>
              )}
              {form.notes && <p style={{ color: 'var(--silver-dark)', fontSize: '0.88rem', margin: '16px 0', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--r-md)' }}><strong style={{ color: 'var(--silver)' }}>ملاحظات:</strong> {form.notes}</p>}
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button className="btn btn-dark" style={{ flex: 1 }} onClick={() => setStep(1)}>← تعديل البيانات</button>
                <button className="btn btn-gold" style={{ flex: 1 }} onClick={confirmOrder}>تأكيد الطلب ✓</button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div style={styles.summaryCol}>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>ملخص الطلب</h3>
            <div style={styles.itemsList}>
              {cart.map(item => (
                <div key={item.id} style={styles.cartItem}>
                  <img src={item.image} alt={item.name} style={styles.itemImg} />
                  <div style={{ flex: 1 }}>
                    <p style={styles.itemName}>{item.name}</p>
                    <p style={styles.itemQty}>الكمية: {item.qty}</p>
                  </div>
                  {item.items && <p style={styles.itemPrice}>{(item.price * item.qty).toLocaleString()} ج.م</p>}
                </div>
              ))}
            </div>
            
            {/* Coupon Box */}
            <div style={styles.couponBox}>
              {!appliedCoupon ? (
                <>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="كود الخصم" 
                      className="form-control" 
                      style={{ flex: 1, padding: '10px' }} 
                      value={couponCode} 
                      onChange={e => setCouponCode(e.target.value)} 
                    />
                    <button className="btn btn-dark" style={{ padding: '10px 16px' }} onClick={handleApplyCoupon}>تطبيق</button>
                  </div>
                  {couponError && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px' }}>{couponError}</p>}
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(201,169,110,0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px dashed rgba(201,169,110,0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)' }}>
                    <Tag size={16} /> <span style={{ fontWeight: '700' }}>{appliedCoupon.code}</span>
                  </div>
                  <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
                </div>
              )}
            </div>

            <div style={styles.totalRow}>
              <span style={{ fontSize: '0.9rem', color: 'var(--silver-dark)' }}>المجموع</span>
              <span style={{ color: 'var(--white)', fontSize: '0.9rem' }}>{cartTotal.toLocaleString()} ج.م</span>
            </div>
            {discountAmount > 0 && (
              <div style={styles.totalRow}>
                <span style={{ fontSize: '0.9rem', color: '#22c55e' }}>الخصم</span>
                <span style={{ color: '#22c55e', fontSize: '0.9rem' }}>- {discountAmount.toLocaleString()} ج.م</span>
              </div>
            )}
            <div style={{ ...styles.totalRow, borderTop: 'none', paddingTop: '8px' }}>
              <span>إجمالي الطلب</span>
              <span style={styles.totalVal}>{finalTotal.toLocaleString()} ج.م</span>
            </div>
            <div style={styles.deliveryRow}>
              <span>التوصيل</span>
              <span style={{ color: '#22c55e', fontWeight: '700' }}>مجاناً</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { background: 'var(--black)', minHeight: '100vh', paddingBottom: '80px' },
  empty: { minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--black)', textAlign: 'center', padding: '40px' },
  stepsBar: { background: 'var(--black-mid)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '20px 0' },
  stepsInner: { display: 'flex', alignItems: 'center', gap: '8px' },
  stepDot: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', background: 'rgba(255,255,255,0.08)', color: 'var(--silver-dark)', flexShrink: 0 },
  stepActive: { background: 'var(--grad-gold)', color: 'var(--black)' },
  stepDone: { background: 'rgba(34,197,94,0.2)', color: '#22c55e' },
  stepLine: { width: '40px', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' },
  layout: { display: 'flex', gap: '32px', paddingTop: '40px', flexWrap: 'wrap', alignItems: 'flex-start' },
  formCol: { flex: '1', minWidth: '320px' },
  card: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-lg)', padding: '28px' },
  cardTitle: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: '800', color: 'var(--white)', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  reviewGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
  reviewItem: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'var(--white)' },
  reviewLabel: { color: 'var(--silver-dark)', fontSize: '0.88rem' },
  summaryCol: { width: '340px', flexShrink: 0 },
  summaryCard: { background: 'var(--grad-card)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 'var(--r-lg)', padding: '24px', position: 'sticky', top: '100px' },
  summaryTitle: { fontSize: '1.1rem', fontWeight: '800', color: 'var(--white)', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' },
  cartItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--r-md)' },
  itemImg: { width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' },
  itemName: { color: 'var(--white)', fontSize: '0.85rem', fontWeight: '600', lineHeight: 1.3 },
  itemQty: { color: 'var(--silver-dark)', fontSize: '0.75rem', marginTop: '3px' },
  itemPrice: { color: 'var(--gold)', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0 },
  couponBox: { marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: '800', color: 'var(--white)', fontSize: '1.1rem', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' },
  deliveryRow: { display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.9rem', color: 'var(--silver-dark)' },
  totalVal: { color: 'var(--gold)', fontFamily: 'var(--font-heading)' },
  successPage: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--black)', padding: '40px' },
  successCard: { background: 'var(--grad-card)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--r-xl)', padding: '60px 48px', textAlign: 'center', maxWidth: '480px', width: '100%' },
  successIcon: { width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' },
  successTitle: { fontSize: '2rem', fontWeight: '900', color: 'var(--white)', marginBottom: '12px' },
  successSub: { color: 'var(--silver-dark)', lineHeight: 1.7, marginBottom: '28px' },
  orderIdBox: { padding: '16px', background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 'var(--r-md)', marginBottom: '28px' },
  successBtns: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
};

export default Checkout;
