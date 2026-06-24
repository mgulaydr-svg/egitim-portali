import React from 'react';
import { Link } from 'react-router-dom';

export default function ArticleCard({ item }) {
  const createExcerpt = (text) => {
    if (!text) return "";
    return text.length > 120 ? text.substring(0, 120) + "..." : text;
  };

  // Kategoriye Göre Dinamik Renk ve İkon Teması Belirleme
  const isHizmetIci = item.category === 'Hizmet İçi Eğitim';
  const isSunum = item.category === 'Sunumlar & İnfografikler';

  const theme = isHizmetIci ? {
    border: '#10b981', bg: '#ecfdf5', badgeBg: '#059669', badgeText: 'white', icon: '👨‍⚕️'
  } : isSunum ? {
    border: '#f59e0b', bg: '#fffbeb', badgeBg: '#d97706', badgeText: 'white', icon: '📊'
  } : { // Varsayılan: Halk Eğitimi
    border: '#3b82f6', bg: '#eff6ff', badgeBg: '#2563eb', badgeText: 'white', icon: '👥'
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: `1px solid ${theme.border}`, // Sınır rengi kategoriye göre
      borderTop: `5px solid ${theme.border}`, // Üst şerit rengi
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      overflow: 'hidden'
    }}>
      
      {/* ÜST GÖRSEL/FOTOĞRAF ALANI */}
      <div style={{ height: '140px', backgroundColor: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e2e8f0' }}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '60px', opacity: '0.8' }}>{theme.icon}</span>
        )}
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Etiketler */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <span style={{ backgroundColor: theme.badgeBg, color: theme.badgeText, padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{item.category}</span>
          <span style={{ backgroundColor: '#e2e8f0', color: '#475569', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{item.topic}</span>
        </div>
        
        <h3 style={{ color: '#0f172a', marginTop: '0', fontSize: '18px', lineHeight: '1.4' }}>
          <Link to={`/article/${item.id}`} style={{ color: '#0f172a', textDecoration: 'none' }}>{item.title}</Link>
        </h3>
        
        <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', flex: 1 }}>
          {createExcerpt(item.content)}
        </p>

        <Link to={`/article/${item.id}`} style={{ color: theme.badgeBg, textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', display: 'inline-block', marginTop: '10px' }}>
          Devamını Oku ➔
        </Link>
      </div>
      
      <div style={{ padding: '0 20px 20px 20px' }}>
        <button 
          onClick={() => {
            if(item.pdfUrl) window.open(item.pdfUrl, '_blank');
          }}
          style={{
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
          {item.pdfUrl ? '📥 Kaynağı Görüntüle' : '📄 Kaynak Eklenmemiş'}
        </button>
      </div>
    </div>
  );
}