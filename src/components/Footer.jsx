import React from 'react';

export default function Footer() {
  return (
    <>
      <style>{`
        /* 1. EKOSİSTEM VİTRİNİ (BEYAZ ALAN) */
        .ecosystem-wrapper { background-color: #ffffff; padding: 60px 20px; border-top: 1px solid #e2e8f0; text-align: center; }
        .eco-title { color: #004170; font-size: 24px; margin: 0 0 10px 0; font-weight: 800; }
        .eco-subtitle { color: #64748b; font-size: 15px; margin: 0 0 40px 0; }
        
        .eco-grid { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; }
        .eco-card { display: flex; flex-direction: column; align-items: center; justify-content: space-between; width: 220px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px 20px; text-decoration: none; transition: all 0.3s; }
        .eco-card:hover { transform: translateY(-5px); box-shadow: 0 15px 25px -5px rgba(0,0,0,0.1); border-color: #cbd5e1; background: #ffffff; }
        .eco-logo { width: 100%; height: 120px; object-fit: contain; margin-bottom: 20px; border-radius: 8px; }
        .eco-name { color: #0f172a; font-weight: bold; font-size: 16px; margin-bottom: 5px; }
        .eco-link-text { color: #0ea5e9; font-size: 13px; font-weight: bold; }

        /* 2. KOYU RENKLİ ANA FOOTER */
        .main-footer { background-color: #004170; color: white; padding: 50px 20px 30px; text-align: center; }
        .footer-slogan { font-size: 22px; font-weight: 300; font-style: italic; opacity: 0.9; margin-bottom: 30px; letter-spacing: 0.5px; }
        .footer-slogan strong { font-weight: 700; color: #10b981; }

        /* SOSYAL MEDYA BUTONLARI */
        .social-container { display: flex; justify-content: center; gap: 15px; margin-bottom: 40px; }
        .social-btn { display: flex; align-items: center; justify-content: center; width: 45px; height: 45px; border-radius: 50%; background-color: rgba(255,255,255,0.1); color: white; transition: all 0.3s; }
        .social-btn:hover { background-color: rgba(255,255,255,0.2); transform: scale(1.1); }
        .social-btn svg { width: 20px; height: 20px; fill: currentColor; }

        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; font-size: 13px; color: #94a3b8; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
      `}</style>

      {/* ÜST KATMAN: DİĞER UYGULAMALARIMIZ (BEYAZ) */}
      <section className="ecosystem-wrapper">
        <h2 className="eco-title">Esti Biraz Ekosistemi</h2>
        <p className="eco-subtitle">Eğitim ve verimlilik için tasarladığımız diğer dijital araçlarımızı keşfedin.</p>
        
        <div className="eco-grid">
          <a href="https://mgulaydr-svg.github.io/esti-biraz/" target="_blank" rel="noreferrer" className="eco-card">
            <div>
              <img src="/logo.png" alt="Esti Biraz" className="eco-logo" />
              <div className="eco-name">Esti Biraz</div>
            </div>
            <div className="eco-link-text">İncele ➔</div>
          </a>

          <a href="https://mgulaydr-svg.github.io/sorularla-calisma/" target="_blank" rel="noreferrer" className="eco-card">
            <div>
              <img src="/sorularla-logo.jpg" alt="Sorularla Çalışma" className="eco-logo" />
              <div className="eco-name">Sorularla Çalışma</div>
            </div>
            <div className="eco-link-text">İncele ➔</div>
          </a>

          <a href="https://mgulaydr-svg.github.io/akilli-kartlar/" target="_blank" rel="noreferrer" className="eco-card">
            <div>
              <img src="/akilli-kartlar-logo.png" alt="Akıllı Kartlar" className="eco-logo" />
              <div className="eco-name">Akıllı Kartlar</div>
            </div>
            <div className="eco-link-text">İncele ➔</div>
          </a>
        </div>
      </section>

      {/* ALT KATMAN: FOOTER VE SOSYAL MEDYA (KOYU) */}
      <footer className="main-footer">
        <div className="footer-slogan">
          "Bilgiyi tasarlıyor, eğitimi <strong>dijitalle</strong> buluşturuyoruz."
        </div>

        <div className="social-container">
          {/* Instagram İkonu */}
          <a href="#" target="_blank" rel="noreferrer" className="social-btn" title="Instagram">
            <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          
          {/* X (Twitter) İkonu */}
          <a href="#" target="_blank" rel="noreferrer" className="social-btn" title="X (Twitter)">
            <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>

          {/* Threads İkonu */}
          <a href="#" target="_blank" rel="noreferrer" className="social-btn" title="Threads">
            <svg viewBox="0 0 24 24"><path d="M16.5 12c0 2.485-2.015 4.5-4.5 4.5s-4.5-2.015-4.5-4.5c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5zm-4.5-2.5c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2zm8.5 2.5c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8c2.27 0 4.316.945 5.768 2.463l-1.464 1.39C13.626 4.793 11.936 4 10 4 5.589 4 2 7.589 2 12s3.589 8 8 8 8-3.589 8-8c0-1.157-.253-2.258-.702-3.243l1.831-.775C19.742 9.387 20 10.666 20 12z"/></svg>
          </a>

          {/* WhatsApp İkonu */}
          <a href="https://wa.me/905XXXXXXXXX" target="_blank" rel="noreferrer" className="social-btn" title="WhatsApp">
            <svg viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.115.549 4.17 1.593 5.986L.045 23.955l6.103-1.602A11.968 11.968 0 0012.031 24c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm6.541 17.151c-.276.78-1.571 1.487-2.185 1.54-.567.049-1.298.15-4.135-1.025-3.486-1.444-5.748-5.02-5.918-5.247-.17-.227-1.411-1.878-1.411-3.582 0-1.704.887-2.54 1.205-2.898.319-.359.695-.448.922-.448.227 0 .454.004.654.013.208.01.488-.083.763.581.284.681.979 2.391 1.064 2.56.085.171.142.37.028.598-.113.227-.17.37-.341.568-.17.199-.356.44-.51.61-.17.185-.353.388-.142.753.213.365.945 1.56 2.029 2.527 1.402 1.248 2.57 1.636 2.94 1.806.368.17.581.142.8-.114.218-.256.945-1.096 1.2-1.472.256-.375.51-.313.852-.185.34.128 2.158 1.017 2.527 1.201.369.185.615.276.7.433.085.157.085.906-.191 1.686z"/></svg>
          </a>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Esti Biraz Eğitim Portalı. Tüm hakları saklıdır.</span>
          <span>İzmir, Türkiye</span>
        </div>
      </footer>
    </>
  );
}