import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { User, Lock, Eye, EyeOff, ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin && form.email && form.password) {
      setLoading(true);
      setTimeout(() => {
        try {
          login(form.email, form.password);
          navigate('/');
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }, 600);
    } else if (!isLogin && form.name && form.email && form.password && form.phone && form.city) {
      setLoading(true);
      setTimeout(() => {
        try {
          register(form.name, form.email, form.password, form.phone, form.city);
          navigate('/');
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }, 600);
    } else {
      setError('يرجى ملء جميع الحقول المطلوبة');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.bgGlow} />
      
      <div style={styles.card}>
        <div style={styles.header}>
          <Link to="/" style={styles.backBtn}><ArrowLeft size={20} /></Link>
          <h1 style={styles.title}>{isLogin ? 'تسجيل الدخول' : 'حساب جديد'}</h1>
          <p style={styles.sub}>{isLogin ? 'مرحباً بعودتك! أدخل بياناتك للمتابعة.' : 'انضم إلينا الآن للتمتع بتجربة تسوق فريدة.'}</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">الاسم الكامل *</label>
              <div style={styles.inputWrap}>
                <User size={18} style={styles.inputIcon} />
                <input name="name" className="form-control" style={{ paddingRight: '40px' }} value={form.name} onChange={handleChange} placeholder="محمد أحمد" required />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">البريد الإلكتروني *</label>
            <div style={styles.inputWrap}>
              <Mail size={18} style={styles.inputIcon} />
              <input type="email" name="email" className="form-control" style={{ paddingRight: '40px' }} value={form.email} onChange={handleChange} placeholder="example@email.com" dir="ltr" required />
            </div>
          </div>

          {!isLogin && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">رقم الهاتف *</label>
                <div style={styles.inputWrap}>
                  <Phone size={18} style={styles.inputIcon} />
                  <input name="phone" className="form-control" style={{ paddingRight: '40px' }} value={form.phone} onChange={handleChange} placeholder="01xxxxxxxxx" dir="ltr" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">المدينة *</label>
                <div style={styles.inputWrap}>
                  <MapPin size={18} style={styles.inputIcon} />
                  <select name="city" className="form-control" style={{ paddingRight: '40px' }} value={form.city} onChange={handleChange} required>
                    <option value="">اختر..</option>
                    {['القاهرة', 'الجيزة', 'الإسكندرية', 'المنصورة', 'طنطا', 'أسيوط'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label className="form-label">كلمة المرور *</label>
            <div style={styles.inputWrap}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                className="form-control"
                style={{ paddingRight: '40px', paddingLeft: '40px' }}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                dir="ltr"
                required
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-gold btn-lg" style={{ width: '100%', marginBottom: '24px' }} disabled={loading}>
            {loading ? 'جاري المعالجة...' : isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={{ color: 'var(--silver-dark)' }}>
            {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
            <button style={styles.toggleBtn} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'سجل الآن' : 'تسجيل الدخول'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', background: 'var(--black)', padding: '40px 20px', position: 'relative', overflow: 'hidden' },
  bgGlow: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 60%)', pointerEvents: 'none' },
  card: { background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--r-xl)', padding: '40px', width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 },
  header: { textAlign: 'center', marginBottom: '32px', position: 'relative' },
  backBtn: { position: 'absolute', top: '0', right: '0', color: 'var(--silver-dark)', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', transition: 'var(--ease)' },
  title: { fontSize: '2rem', fontWeight: '900', color: 'var(--white)', marginBottom: '8px', fontFamily: 'var(--font-heading)' },
  sub: { color: 'var(--silver-dark)', fontSize: '0.9rem', lineHeight: 1.6 },
  errorBox: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '12px', borderRadius: 'var(--r-md)', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column' },
  inputWrap: { position: 'relative' },
  inputIcon: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--silver-dark)' },
  eyeBtn: { position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--silver-dark)', cursor: 'pointer', padding: '4px' },
  footer: { textAlign: 'center', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' },
  toggleBtn: { background: 'none', border: 'none', color: 'var(--gold)', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' },
};

export default Login;
