import React from 'react';

export default function ArticleCard({ item }) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%'
    }}>
      <div>
        {/* Kategori ve Konu Etiketleri */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <span style={{ backgroundColor: '#004170', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{item.category}</span>
          <span style={{ backgroundColor: '#10b981', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{item.topic}</span>
        </div>
        
        {/* Başlık ve Özet */}
        <h3 style={{ color: '#004170', marginTop: '0', fontSize: '18px', lineHeight: '1.4' }}>{item.title}</h3>
        <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>{item.content || item.summary}</p>
      </div>
      
      {/* Gerçek İndirme / Görüntüleme Butonu */}
      <button 
        onClick={() => {
          if(item.pdfUrl) {
            window.open(item.pdfUrl, '_blank');
          } else {
            alert('Bu eğitim için henüz bir PDF dosyası yüklenmemiş.');
          }
        }}
        style={{
          marginTop: '20px',
          backgroundColor: item.pdfUrl ? '#f0fdf4' : '#f8fafc',
          color: item.pdfUrl ? '#16a34a' : '#94a3b8',
          border: `1px solid ${item.pdfUrl ? '#bbf7d0' : '#cbd5e1'}`,
          padding: '12px',
          borderRadius: '4px',
          cursor: item.pdfUrl ? 'pointer' : 'not-allowed',
          fontWeight: 'bold',
          width: '100%',
          transition: 'all 0.2s'
        }}>
        {item.pdfUrl ? '📥 PDF Sunumunu Görüntüle' : '📄 PDF Bulunmuyor'}
      </button>
    </div>
  );
}