import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { SettingsDB } from '../db/database';
import { GoogleGenerativeAI } from '@google/generative-ai';

const ChatBox = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'مرحباً بك في معرض المحلاوى للأدوات الصحية! 👑\nكيف يمكنني مساعدتك اليوم؟', 
      sender: 'bot',
      options: ['كيف أعرف الأسعار؟', 'كيف أقوم بالطلب؟', 'ما هي طرق الدفع؟', 'التواصل مع المبيعات']
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const getBotResponse = (text) => {
    const t = text.toLowerCase().replace(/[أإآ]/g, 'ا');
    
    if (t.includes('سعر') || t.includes('اسعار') || t.includes('بكام')) {
      return { 
        text: 'الأسعار في المحلاوى مخصصة لكل عميل لضمان أفضل خصم ممكن! 🎉\nنظامنا يعتمد على تنوع الأصناف في سلتك (وليس زيادة كمية الصنف الواحد). أضف منتجاتك للسلة واطلب عرض سعر ليتم تجهيز الأفضل لطلبك.',
        options: ['كيف أقوم بالطلب؟', 'التواصل مع المبيعات']
      };
    }
    if (t.includes('اشتري') || t.includes('طلب') || t.includes('شراء')) {
      return {
        text: 'خطوات الطلب بسيطة:\n1️⃣ تصفح المنتجات وأضف ما يعجبك للمجموعة (السلة).\n2️⃣ اذهب للسلة واضغط على "متابعة لمعرفة السعر".\n3️⃣ أدخل بياناتك، وسيقوم فريق المبيعات بالتواصل معك بأسعارك الخاصة.',
        options: ['ما هي طرق الدفع؟', 'كيف أعرف الأسعار؟']
      };
    }
    if (t.includes('دفع') || t.includes('فيزا') || t.includes('كاش') || t.includes('تقسيط')) {
      return {
        text: 'لراحتك، وفرنا طرق دفع متعددة:\n• الدفع نقداً عند الاستلام (كاش)\n• التحويل البنكي\n• الدفع السريع عبر إنستا باي (InstaPay)',
        options: ['هل يتوفر شحن؟', 'كيف أقوم بالطلب؟']
      };
    }
    if (t.includes('توصيل') || t.includes('شحن') || t.includes('محافظات')) {
      return {
        text: 'بالتأكيد! 🚚 نوفر خدمة شحن آمنة وموثوقة لجميع أنحاء ومحافظات مصر لضمان وصول طلبك سليماً وبدون خدوش.',
        options: ['أريد الاستفسار عن منتج معين']
      };
    }
    if (t.includes('تتبع') || t.includes('اوردر') || t.includes('طلبي')) {
      return {
        text: 'يمكنك معرفة حالة طلبك لحظة بلحظة عن طريق زيارة رابط "تتبع الطلب" في أسفل الموقع وإدخال رقم طلبك ورقم هاتفك.',
        options: ['التواصل مع المبيعات']
      };
    }
    if (t.includes('واتساب') || t.includes('خدمة') || t.includes('مبيعات') || t.includes('منتج معين')) {
      return {
        text: 'يسعدنا جداً خدمتك شخصياً! اضغط على الزر بالأسفل ليتم تحويلك مباشرة للدردشة مع أحد خبرائنا.',
        options: ['فتح محادثة واتساب الآن 💬']
      };
    }
    
    // Default fallback
    return {
      text: 'عذراً، لم أفهم استفسارك بشكل كامل. هل تود معرفة كيفية عمل الأسعار لدينا، أم تفضل التحدث مباشرة مع خدمة العملاء للحصول على مساعدة سريعة؟',
      options: ['كيف أعرف الأسعار؟', 'التواصل مع المبيعات']
    };
  };

  const callGeminiAPI = async (userText, apiKey, currentMessages) => {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `أنت ممثل خدمة عملاء محترف ولطيف لمعرض "المحلاوى للأدوات الصحية".
مهمتك مساعدة العملاء والإجابة على أسئلتهم.
قواعد هامة جداً:
1. لا تقم بإعطاء أي أسعار صريحة للمنتجات إطلاقاً.
2. إذا سأل العميل عن سعر، أخبره بلطف أن الأسعار لدينا مخصصة وتعتمد على تنوع المنتجات في السلة. اطلب منه إضافة المنتجات للسلة والضغط على "متابعة لمعرفة السعر" ليقوم فريق المبيعات بالتواصل معه بعرض سعر خاص.
3. طرق الدفع المتاحة: نقداً عند الاستلام، التحويل البنكي، أو المحافظ الإلكترونية مثل إنستا باي.
4. نوفر خدمة الشحن لجميع محافظات مصر.
5. إذا طلب العميل التحدث مع شخص بشري أو واجه مشكلة معقدة، اطلب منه الضغط على خيار "التواصل مع المبيعات".
6. اجعل إجاباتك قصيرة وواضحة جداً (لا تتعدى 3-4 سطور).
استخدم إيموجي مناسبة بشكل خفيف.`
      });

      const history = currentMessages
        .filter(m => m.id !== 1) // skip the initial default message to save tokens if desired, or keep it. Let's just pass all.
        .map(m => `${m.sender === 'bot' ? 'Assistant' : 'User'}: ${m.text}`)
        .join('\n');
      
      const prompt = `${history}\nUser: ${userText}\nAssistant:`;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.error('Gemini error:', err);
      return null;
    }
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;
    
    if (text === 'فتح محادثة واتساب الآن 💬' || text.includes('التواصل مع المبيعات')) {
      const settings = SettingsDB.get();
      const phone = (settings.phone || '').replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent('مرحباً، أحتاج لمساعدة من خلال المتجر...')}`, '_blank');
      return;
    }

    const newMsg = { id: Date.now(), text, sender: 'user' };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    const settings = SettingsDB.get();
    
    if (settings.geminiApiKey && settings.geminiApiKey.trim() !== '') {
      const aiResponse = await callGeminiAPI(text, settings.geminiApiKey, messages);
      if (aiResponse) {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponse, sender: 'bot' }]);
        setIsTyping(false);
        return;
      }
    }

    // Fallback logic if Gemini fails or is not configured
    setTimeout(() => {
      const botReply = getBotResponse(text);
      if (botReply) {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          text: botReply.text, 
          sender: 'bot', 
          options: botReply.options 
        }]);
      }
      setIsTyping(false);
    }, 900 + Math.random() * 600);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, isTyping]);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          ...styles.trigger,
          transform: open ? 'scale(0)' : 'scale(1)',
          pointerEvents: open ? 'none' : 'all',
        }}
        title="محادثة المساعدة"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <div style={{
        ...styles.chatWindow,
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
        pointerEvents: open ? 'all' : 'none',
      }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={styles.avatar}><Bot size={20} /></div>
            <div>
              <p style={{ fontWeight: '700', fontSize: '0.9rem', margin: 0, color: 'var(--black)' }}>المساعد الذكي</p>
              <p style={{ fontSize: '0.7rem', opacity: 0.8, margin: 0, color: 'var(--black)' }}>متصل الآن</p>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={() => setOpen(false)}><X size={18} /></button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          {messages.map(m => (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
              <div style={{ ...styles.msgBubble, ...(m.sender === 'user' ? styles.msgUser : styles.msgBot) }}>
                {m.text.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
              </div>
              
              {/* Render Options if available and message is from bot */}
              {m.options && (
                <div style={styles.quickReplies}>
                  {m.options.map((opt, i) => (
                    <button key={i} style={styles.quickBtn} onClick={() => handleSend(opt)}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ ...styles.msgBubble, ...styles.msgBot, display: 'flex', gap: '4px', padding: '14px 16px' }}>
                <span style={{ ...styles.typingDot, animationDelay: '0s' }} />
                <span style={{ ...styles.typingDot, animationDelay: '0.2s' }} />
                <span style={{ ...styles.typingDot, animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} style={{ height: '1px' }} />
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <input
            type="text"
            placeholder="اكتب استفسارك هنا..."
            style={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(input)}
          />
          <button style={styles.sendBtn} onClick={() => handleSend(input)}>
            <Send size={18} />
          </button>
        </div>
      </div>
      
      {/* Styles for typing animation */}
      <style>
        {`
          @keyframes bounceDot {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
        `}
      </style>
    </>
  );
};

const styles = {
  trigger: { position: 'fixed', bottom: '28px', right: '28px', width: '56px', height: '56px', borderRadius: '50%', background: 'var(--grad-gold)', color: 'var(--black)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 20px rgba(201, 169, 110, 0.4)', transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', zIndex: 8900 },
  chatWindow: { position: 'fixed', bottom: '100px', right: '28px', width: '360px', height: '520px', background: 'var(--black-mid)', borderRadius: 'var(--r-lg)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 8901, boxShadow: '0 10px 40px rgba(0,0,0,0.6)', transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', transformOrigin: 'bottom right' },
  header: { background: 'var(--grad-gold)', color: 'var(--black)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.1)' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.1)', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' },
  closeBtn: { background: 'rgba(0,0,0,0.1)', border: 'none', color: 'var(--black)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' },
  body: { flex: 1, padding: '20px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--black)' },
  msgBubble: { padding: '12px 16px', borderRadius: '16px', fontSize: '0.88rem', lineHeight: 1.6, maxWidth: '88%', wordBreak: 'break-word' },
  msgUser: { background: 'var(--grad-gold)', color: 'var(--black)', borderBottomLeftRadius: '4px', fontWeight: '600' },
  msgBot: { background: 'var(--black-card)', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--silver)', borderBottomRightRadius: '4px' },
  quickReplies: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px', justifyContent: 'flex-start' },
  quickBtn: { background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', color: 'var(--gold)', padding: '8px 14px', borderRadius: '50px', fontSize: '0.82rem', cursor: 'pointer', transition: 'var(--ease)' },
  footer: { padding: '14px', background: 'var(--black-card)', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px' },
  input: { flex: 1, background: 'var(--black)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50px', padding: '12px 18px', color: 'var(--white)', fontSize: '0.9rem', outline: 'none', transition: 'border-color 0.3s' },
  sendBtn: { width: '46px', height: '46px', borderRadius: '50%', background: 'var(--grad-gold)', border: 'none', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'transform 0.2s', paddingRight: '4px' },
  typingDot: { width: '6px', height: '6px', borderRadius: '50%', background: 'var(--silver-dark)', animation: 'bounceDot 1s infinite' }
};

export default ChatBox;
