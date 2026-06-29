import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  // Günün tarihini Türkçe formatta alma
  useEffect(() => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('tr-TR', options));
  }, []);

  // Menü Kutucuklarının Verileri
  const navItems = [
    { title: "Halk Eğitimi", desc: "Toplum sağlığı materyalleri", link: "/?kategori=Halk Eğitimi", icon: "👥", color: "#3b82f6" },
    { title: "Hizmet İçi Eğitim", desc: "Personel gelişim modülleri", link: "/?kategori=Hizmet İçi Eğitim", icon: "👨‍⚕️", color: "#10b981" },
    { title: "Okul Eğitimleri", desc: "Müfredat ve öğrenci sunumları", link: "/?kategori=Okul Eğitimleri", icon: "📚", color: "#8b5cf6" },
    { title: "Görseller", desc: "Görsel veri ve analizler", link: `/?kategori=${encodeURIComponent('Sunumlar & İnfografikler')}`, icon: "📊", color: "#0ea5e9" },
    { title: "Aktivite Kartları", desc: "Sınıf içi interaktif oyunlar", link: "/?kategori=Aktivite Kartları", icon: "🎲", color: "#ea580c" }
  ];

  return (
    <>
      <style>{`
        .navbar-wrapper { width: 100%; }
        
        /* 1. KATMAN: KOYU RENKLİ ÜST BİLGİ ALANI */
        .top-header { background-color: #004170; color: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 50; }
        .brand-area { display: flex; align-items: center; gap: 15px; text-decoration: none; color: white; }
        .header-logo { width: 70px; height: 70px; object-fit: contain; background-color: white; border-radius: 50%; padding: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        
        /* ESTİ BİRAZ YAZILARI AYNI RENK VE OKUNAKLI */
        .brand-titles { display: flex; flex-direction: column; }
        .brand-title { font-size: 30px; font-weight: 900; margin: 0; color: #ffffff; letter-spacing: 0.5px; }
        .brand-subtitle { font-size: 17px; font-weight: 600; margin: 0; color: #ffffff; letter-spacing: 1px; }
        
        .info-area { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
        .info-row { display: flex; gap: 15px; font-size: 13px; color: #cbd5e1; font-weight: 500; }
        .admin-btn { background-color: #10b981; color: white; padding: 6px 16px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 13px; transition: background 0.2s; }
        .admin-btn:hover { background-color: #059669; }

        /* 2. KATMAN: BEYAZ NAVİGASYON ALANI */
        .bottom-nav { background-color: #ffffff; padding: 25px 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); display: flex; gap: 15px; justify-content: center; align-items: center; position: relative; z-index: 40; border-bottom: 1px solid #e2e8f0; }
        
        /* 5 BUTON YAN YANA (Alta kaymasını engelleyen flex ayarı) */
        .nav-box { flex: 1; max-width: 210px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; text-decoration: none; color: #334155; transition: all 0.3s; display: flex; flex-direction: column; gap: 6px; border-top-width: 4px; border-top-style: solid; }
        .nav-box:hover { background-color: #ffffff; transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border-color: #cbd5e1; }
        .nav-box-title { font-size: 14px; font-weight: bold; display: flex; align-items: center; gap: 8px; color: #0f172a; }
        .nav-box-desc { font-size: 11px; color: #64748b; line-height: 1.4; }

        /* YAN MENÜ VE MOBİL (Hamburger) */
        .mobile-toggle { display: none; background: none; border: none; color: white; font-size: 28px; cursor: pointer; }
        .mobile-sidebar { position: fixed; top: 0; right: -100%; width: 280px; height: 100vh; background-color: #004170; z-index: 100; transition: right 0.3s ease; box-shadow: -5px 0 15px rgba(0,0,0,0.3); padding: 20px; overflow-y: auto; }
        .mobile-sidebar.open { right: 0; }
        .overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(0,0,0,0.5); z-index: 90; display: none; backdrop-filter: blur(2px); }
        .overlay.open { display: block; }

        /* RESPONSIVE: EKRAN KÜÇÜLÜNCE BEYAZ ALANI YOK ET, HAMBURGERİ AÇ */
        @media (max-width: 1024px) {
          .bottom-nav { display: none; } /* Dar ekranda beyaz alanı ve butonları tamamen saklar */
          .mobile-toggle { display: block; } /* Hamburger ikonunu gösterir */
          .info-area { display: none; } /* Tarih ve ziyaretçi kısmı dar ekranda yan menüye geçer */
          .brand-title { font-size: 24px; }
          .brand-subtitle { font-size: 14px; }
          .header-logo { width: 55px; height: 55px; }
        }
      `}</style>

      {/* KARARTMA ARKA PLANI (Mobil menü açıldığında) */}
      <div className={`overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>

      <div className="navbar-wrapper">
        {/* 1. KATMAN: ÜST BİLGİ ALANI */}
        <header className="top-header">
          <Link to="/" className="brand-area">
            {/* LOGO GÖRSELİ */}
            <img src="/logo.jpg" alt="Esti Biraz Logo" className="header-logo" />
            <div className="brand-titles">
              <h1 className="brand-title">Esti Biraz</h1>
              <h2 className="brand-subtitle">EĞİTİM PORTALI</h2>
            </div>
          </Link>

          <div className="info-area">
            <div className="info-row">
              <span>📅 {currentDate}</span>
              <span>|</span>
              <span title="Temsili Sayaç">👁️ 1.245 Ziyaretçi</span>
            </div>
            <Link to="/admin" className="admin-btn">⚙️ Yönetici Girişi</Link>
          </div>

          <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
        </header>

        {/* 2. KATMAN: BEYAZ NAVİGASYON ALANI (Geniş Ekran) */}
        <nav className="bottom-nav">
          {navItems.map((item, idx) => (
            <Link key={idx} to={item.link} className="nav-box" style={{ borderTopColor: item.color }}>
              <div className="nav-box-title">
                <span>{item.icon}</span> {item.title}
              </div>
              <div className="nav-box-desc">{item.desc}</div>
            </Link>
          ))}
        </nav>
      </div>

      {/* MOBİL YAN MENÜ (Sidebar) */}
      <div className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
          <h3 style={{ color: 'white', margin: 0 }}>Menü</h3>
          <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>✖</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {navItems.map((item, idx) => (
            <Link key={idx} to={item.link} onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'block', backgroundColor: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', textDecoration: 'none', color: 'white', borderLeft: `4px solid ${item.color}` }}>
              <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>{item.icon} {item.title}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.desc}</div>
            </Link>
          ))}
          
          <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <p style={{ color: '#cbd5e1', fontSize: '12px', marginBottom: '10px' }}>📅 {currentDate}</p>
            <p style={{ color: '#cbd5e1', fontSize: '12px', marginBottom: '15px' }}>👁️ 1.245 Ziyaretçi</p>
            <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="admin-btn" style={{ display: 'block', textAlign: 'center' }}>⚙️ Yönetici Girişi</Link>
          </div>
        </div>
      </div>
    </>
  );
}