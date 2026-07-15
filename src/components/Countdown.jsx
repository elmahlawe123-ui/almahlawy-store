import { useState, useEffect } from 'react';

const Countdown = ({ endDate, size = 'md' }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const target = new Date(endDate).getTime();
    
    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };

    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, [endDate]);

  if (!timeLeft) {
    return <span style={{ color: '#ef4444', fontWeight: '700' }}>انتهى العرض</span>;
  }

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const boxSize = isLarge ? '80px' : isSmall ? '40px' : '56px';
  const numSize = isLarge ? '2rem' : isSmall ? '1rem' : '1.3rem';
  const labelSize = isLarge ? '0.9rem' : isSmall ? '0.6rem' : '0.75rem';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: isSmall ? '4px' : '12px', direction: 'ltr' }}>
      {[
        { val: timeLeft.days, label: 'يوم' },
        { val: timeLeft.hours, label: 'ساعة' },
        { val: timeLeft.minutes, label: 'دقيقة' },
        { val: timeLeft.seconds, label: 'ثانية' }
      ].map((u, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: isSmall ? '4px' : '12px' }}>
          <div style={{ 
            width: boxSize, height: boxSize, 
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'var(--grad-card)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r-sm)'
          }}>
            <span style={{ color: 'var(--gold)', fontSize: numSize, fontWeight: '900', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
              {u.val.toString().padStart(2, '0')}
            </span>
            <span style={{ color: 'var(--silver-dark)', fontSize: labelSize }}>{u.label}</span>
          </div>
          {i < 3 && <span style={{ color: 'var(--silver-dark)', fontWeight: '700', fontSize: numSize }}>:</span>}
        </div>
      ))}
    </div>
  );
};

export default Countdown;
