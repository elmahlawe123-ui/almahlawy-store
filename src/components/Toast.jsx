import { useContext, useEffect } from 'react';
import { StoreContext } from '../context/StoreContext';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const icons = {
  success: <CheckCircle size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
};

const colors = {
  success: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', color: '#22c55e' },
  error:   { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)',  color: '#ef4444' },
  info:    { bg: 'rgba(201,169,110,0.12)', border: 'rgba(201,169,110,0.3)', color: '#C9A96E' },
};

const Toast = () => {
  const { notification } = useContext(StoreContext);
  if (!notification) return null;

  const c = colors[notification.type] || colors.success;

  return (
    <div
      key={notification.id}
      style={{
        position: 'fixed',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        background: c.bg,
        border: `1px solid ${c.border}`,
        backdropFilter: 'blur(20px)',
        borderRadius: '50px',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: c.color,
        fontWeight: '700',
        fontSize: '0.9rem',
        fontFamily: 'var(--font-heading)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap',
        animation: 'toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      {icons[notification.type] || icons.success}
      {notification.message}
      <style>{`
        @keyframes toastIn {
          from { opacity:0; transform:translateX(-50%) translateY(20px) scale(0.9); }
          to   { opacity:1; transform:translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Toast;
