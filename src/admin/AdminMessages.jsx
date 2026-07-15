import { useState, useEffect } from 'react';
import { Mail, CheckCircle2, Trash2 } from 'lucide-react';
import { MessagesDB } from '../db/database';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);

  const loadMessages = () => {
    setMessages(MessagesDB.getAll());
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkRead = (id) => {
    MessagesDB.markRead(id);
    loadMessages();
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      MessagesDB.delete(id);
      loadMessages();
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>صندوق الرسائل</h1>
        <p style={styles.sub}>تواصل العملاء والاستفسارات الواردة من صفحة اتصل بنا</p>
      </div>

      <div style={styles.grid}>
        {messages.length === 0 ? (
          <div style={styles.empty}>لا توجد رسائل حالياً</div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} style={{ ...styles.card, opacity: msg.read ? 0.7 : 1 }}>
              <div style={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ ...styles.avatar, background: msg.read ? 'var(--black-light)' : 'rgba(201,169,110,0.15)', color: msg.read ? 'var(--silver)' : 'var(--gold)' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 style={styles.name}>{msg.name}</h3>
                    <p style={styles.date}>{new Date(msg.createdAt).toLocaleString('ar-EG')}</p>
                  </div>
                </div>
                {!msg.read && <span style={styles.unreadBadge}>جديد</span>}
              </div>
              
              <div style={styles.cardBody}>
                <p style={styles.contactInfo}><strong>الهاتف:</strong> {msg.phone}</p>
                {msg.email && <p style={styles.contactInfo}><strong>البريد:</strong> {msg.email}</p>}
                
                <div style={styles.messageBox}>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{msg.message}</p>
                </div>
              </div>

              <div style={styles.cardFooter}>
                {!msg.read ? (
                  <button style={styles.btnRead} onClick={() => handleMarkRead(msg.id)}>
                    <CheckCircle2 size={16} /> تحديد كمقروءة
                  </button>
                ) : (
                  <span style={{ color: 'var(--silver)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={16} /> مقروءة
                  </span>
                )}
                <button style={styles.btnDelete} onClick={() => handleDelete(msg.id)}>
                  <Trash2 size={16} /> حذف
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '30px', maxWidth: '1000px', margin: '0 auto' },
  header: { marginBottom: '30px' },
  title: { fontSize: '2rem', color: 'var(--white)', fontWeight: '800', marginBottom: '8px' },
  sub: { color: 'var(--silver)', fontSize: '1rem' },
  empty: { padding: '40px', textAlign: 'center', color: 'var(--silver)', background: 'var(--black-card)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' },
  grid: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: 'var(--black-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px', transition: 'opacity 0.3s' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' },
  avatar: { width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: '1.2rem', color: 'var(--white)', fontWeight: '700', marginBottom: '4px' },
  date: { fontSize: '0.85rem', color: 'var(--silver-dark)' },
  unreadBadge: { background: '#ef4444', color: 'white', padding: '4px 10px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold' },
  cardBody: { marginBottom: '16px' },
  contactInfo: { fontSize: '0.9rem', color: 'var(--silver)', marginBottom: '4px' },
  messageBox: { background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', marginTop: '12px', color: 'var(--white)', fontSize: '0.95rem' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' },
  btnRead: { background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: '600' },
  btnDelete: { background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' },
};

export default AdminMessages;
