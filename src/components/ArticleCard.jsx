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
        <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>{item.summary}</p>
      </div>
      
      {/* İndirme Butonu */}
      <button 
        onClick={() => alert(`Bu buton daha sonra doğrudan şu PDF'yi indirecek: ${item.pdfUrl}`)}
        style={{
          marginTop: '20px',
          backgroundColor: '#f8fafc',
          color: '#004170',
          border: '1px solid #cbd5e1',
          padding: '12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          width: '100%',
          transition: 'background-color 0.2s'
        }}>
        📥 PDF Sunumunu İndir / Görüntüle
      </button>
    </div>
  );
}