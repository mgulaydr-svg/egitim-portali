import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home'; // Home sayfasını içeri aldık

export default function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      <main style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '80vh' }}>
        <Routes>
          {/* Ana dizine (/) gelindiğinde Home bileşenini göster */}
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<h2>Admin Paneli (Yapım Aşamasında)</h2>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}