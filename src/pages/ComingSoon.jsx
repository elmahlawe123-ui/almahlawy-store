import { useState, useEffect } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import Countdown from '../components/Countdown';

const images = [
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=1920'
];

const getNextMidnight = () => {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  return next.toISOString();
};

const ComingSoon = ({ onUnlock }) => {
  const [bgIndex, setBgIndex] = useState(0);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [targetDate, setTargetDate] = useState(getNextMidnight());

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    
    // Check if we passed midnight to reset timer
    const midnightTimer = setInterval(() => {
      if (new Date() >= new Date(targetDate)) {
        setTargetDate(getNextMidnight());
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(midnightTimer);
    };
  }, [targetDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '7324') {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={styles.page}>
      {/* Animated Backgrounds */}
      {images.map((img, idx) => (
        <div
          key={idx}
          style={{
            ...styles.bgImage,
            backgroundImage: `url(${img})`,
            opacity: bgIndex === idx ? 1 : 0,
          }}
        />
      ))}
      <div style={styles.overlay} />

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.logo}>
          م
        </div>
        
        <h1 style={styles.title}>
          الموقع تحت <span style={{ color: 'var(--gold)' }}>التطوير</span>
        </h1>
        <p style={styles.subtitle}>
          نعمل على تجهيز تجربة تسوق استثنائية لمعرض المحلاوي. ترقبوا الافتتاح الكبير!
        </p>

        <div style={styles.timerBox}>
          <p style={{ color: 'var(--silver)', marginBottom: '16px', fontSize: '1rem', textAlign: 'center' }}>
            الافتتاح خلال
          </p>
          <div dir="ltr" style={{ display: 'flex', justifyContent: 'center' }}>
            <Countdown endDate={targetDate} size="lg" />
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrap}>
            <Lock size={18} style={styles.icon} />
            <input
              type="password"
              placeholder="رمز الدخول للمطورين"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                ...styles.input,
                borderColor: error ? '#ef4444' : 'rgba(255,255,255,0.1)',
                animation: error ? 'shake 0.4s' : 'none'
              }}
            />
            <button type="submit" style={styles.submitBtn}>
              <ArrowRight size={18} />
            </button>
          </div>
          {error && <p style={styles.errorText}>الرمز غير صحيح</p>}
        </form>
      </div>

      <style>
        {`
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  page: { position: 'relative', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  bgImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', transition: 'opacity 1.5s ease-in-out', zIndex: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(13,13,13,0.7), rgba(13,13,13,0.95))', backdropFilter: 'blur(4px)', zIndex: 2 },
  content: { position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px', maxWidth: '600px', width: '100%' },
  logo: { width: '80px', height: '80px', borderRadius: '50%', background: 'var(--grad-gold)', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '900', fontFamily: 'var(--font-heading)', marginBottom: '30px', boxShadow: '0 10px 30px rgba(201,169,110,0.3)' },
  title: { fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: '900', color: 'var(--white)', marginBottom: '16px', textAlign: 'center', fontFamily: 'var(--font-heading)' },
  subtitle: { fontSize: '1.2rem', color: 'var(--silver-dark)', textAlign: 'center', marginBottom: '40px', lineHeight: 1.6 },
  timerBox: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r-lg)', padding: '30px', width: '100%', marginBottom: '40px', backdropFilter: 'blur(10px)' },
  form: { width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '8px' },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  icon: { position: 'absolute', right: '16px', color: 'var(--silver-dark)' },
  input: { width: '100%', padding: '16px 44px 16px 16px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', color: 'var(--white)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.3s', textAlign: 'center' },
  submitBtn: { position: 'absolute', left: '8px', width: '38px', height: '38px', borderRadius: '50%', background: 'var(--grad-gold)', border: 'none', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s' },
  errorText: { color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', margin: 0, fontWeight: '700' }
};

export default ComingSoon;
