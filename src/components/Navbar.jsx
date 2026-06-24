import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ backgroundColor: '#004170', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
        Eğitim Portalı
      </Link>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/?kategori=Halk Eğitimi" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>Halk Eğitimi</Link>
        <Link to="/?kategori=Hizmet İçi Eğitim" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>Hizmet İçi Eğitim</Link>
        <Link to="/?kategori=Sunumlar & İnfografikler" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s' }}>Sunumlar & İnfografikler</Link>
        <Link to="/admin" style={{ backgroundColor: '#10b981', color: 'white', padding: '6px 15px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
          Yönetici Girişi
        </Link>
      </div>
    </nav>
  );
}