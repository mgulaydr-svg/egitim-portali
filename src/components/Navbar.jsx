import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ backgroundColor: '#004170', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', flexWrap: 'wrap', gap: '15px' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
        Eğitim Portalı
      </Link>
      
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Link to="/?kategori=Halk Eğitimi" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '500' }}>Halk Eğitimi</Link>
        <Link to="/?kategori=Hizmet İçi Eğitim" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '500' }}>Hizmet İçi Eğitim</Link>
        <Link to="/?kategori=Okul Eğitimleri" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '500' }}>Okul Eğitimleri</Link>
        <Link to={`/?kategori=${encodeURIComponent('Sunumlar & İnfografikler')}`} style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '500' }}>Sunumlar & İnfografikler</Link>
        
        {/* YENİ SEKME */}
        <Link to="/?kategori=Aktivite Kartları" style={{ color: '#fdba74', textDecoration: 'none', fontWeight: 'bold' }}>🎲 Aktivite Kartları</Link>
        
        <Link to="/admin" style={{ backgroundColor: '#10b981', color: 'white', padding: '6px 15px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', marginLeft: '10px' }}>
          Yönetici Girişi
        </Link>
      </div>
    </nav>
  );
}