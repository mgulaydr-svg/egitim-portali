import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header>
      {/* Koyu Mavi Ana Üst Menü */}
      <div style={{ backgroundColor: '#002b49', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
        <h1 style={{ margin: 0, fontSize: '24px', letterSpacing: '1px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>EĞİTİM PORTALI</Link>
        </h1>
        <nav>
          <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none', fontSize: '14px' }}>Araştırmaya Başlayın</Link>
          <Link to="/admin" style={{ backgroundColor: '#b91c1c', color: 'white', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>Admin Girişi</Link>
        </nav>
      </div>
      
      {/* Açık Mavi Alt Menü */}
      <div style={{ backgroundColor: '#3b82f6', padding: '10px 30px', display: 'flex', justifyContent: 'center', gap: '30px', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
        <span style={{ cursor: 'pointer' }}>Halk Eğitimi Modülleri</span>
        <span style={{ cursor: 'pointer' }}>Hizmet İçi Eğitimler</span>
        <span style={{ cursor: 'pointer' }}>Sunumlar & İnfografikler</span>
      </div>
    </header>
  );
}