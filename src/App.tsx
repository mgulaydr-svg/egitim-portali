import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin'; // Admin sayfasını import ettik

export default function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      <main style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Admin panelini Route'a bağladık */}
          <Route path="/admin" element={<Admin />} /> 
        </Routes>
      </main>
    </BrowserRouter>
  );
}