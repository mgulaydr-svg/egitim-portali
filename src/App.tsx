import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; import Footer from './components/Footer';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ArticleDetail from './pages/ArticleDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      <main style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} /> 
          <Route path="/article/:id" element={<ArticleDetail />} /> 
        </Routes>
        <Footer/>
      </main>
    </BrowserRouter>
  );
}