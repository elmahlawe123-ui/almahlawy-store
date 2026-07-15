import { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';

const Admin = () => {
  const { minItemsForPrice, setMinItemsForPrice } = useContext(StoreContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('تم حفظ الإعدادات بنجاح!');
  };

  return (
    <div style={styles.page}>
      <div className="container">
        <h1 className="section-title">لوحة التحكم (الإدارة)</h1>
        
        <div style={styles.card}>
          <h2 style={{ marginBottom: '20px', color: 'var(--color-gold)' }}>إعدادات التسعير الديناميكي</h2>
          <p style={{ marginBottom: '20px', color: 'var(--color-text-muted)' }}>
            هنا يمكنك تحديد الحد الأدنى لتعدد الأصناف (المنتجات المختلفة) التي يجب أن يضيفها العميل إلى سلة التسوق حتى يظهر له السعر الإجمالي النهائي لطلبه.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="minItems">الحد الأدنى لعدد الأصناف المختلفة:</label>
              <input 
                type="number" 
                id="minItems" 
                min="1"
                className="form-control" 
                value={minItemsForPrice || ''}
                onChange={(e) => setMinItemsForPrice(parseInt(e.target.value, 10) || 1)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              حفظ الإعدادات
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: '60px 0',
    minHeight: '70vh',
    backgroundColor: 'var(--color-bg)'
  },
  card: {
    backgroundColor: 'var(--color-white)',
    padding: '40px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    maxWidth: '600px',
    margin: '0 auto'
  }
};

export default Admin;
