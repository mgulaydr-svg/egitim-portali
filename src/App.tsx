import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// İleride sayfalarımızı buraya import edeceğiz:
// import Home from './pages/Home';
// import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      {/* Menü her sayfada görünecek */}
      <Navbar /> 
      
      <main style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '80vh' }}>
        <Routes>
          {/* Şimdilik Home sayfası yerine geçici bir karşılama metni koyalım */}
          <Route path="/" element={<h2 style={{ textAlign: 'center', marginTop: '50px', color: '#004170' }}>Nitelikli Eğitim ve Sağlık Okuryazarlığı Sistemine Hoş Geldiniz!</h2>} />
          <Route path="/admin" element={<h2>Admin Paneli (Yapım Aşamasında)</h2>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}