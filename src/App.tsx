import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ArticleDetail from './pages/ArticleDetail'; // Bunu ekledik

export default function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      <main style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} /> 
          {/* Detay sayfası rotasını ekledik */}
          <Route path="/article/:id" element={<ArticleDetail />} /> 
        </Routes>
      </main>
    </BrowserRouter>
  );
}