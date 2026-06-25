import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useSearchParams, Link } from 'react-router-dom';
import { db } from '../services/firebase';
import ArticleCard from '../components/ArticleCard';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [activities, setActivities] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams(); 
  const activeCategory = searchParams.get('kategori');

  const [selectedTag, setSelectedTag] = useState('Tümü');
  const [activeModalAct, setActiveModalAct] = useState(null); 

  // YENİ: Sayfalama (Pagination) State'leri
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchPortalData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "articles"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        items.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());
        setArticles(items);

        const actSnapshot = await getDocs(collection(db, "activities"));
        const acts = actSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setActivities(acts);
      } catch (error) { console.error("Veri çekilemedi:", error); }
    };
    fetchPortalData();
  }, []);

  // AKILLI SIFIRLAMA: Filtreler veya aramalar değiştiğinde otomatik olarak 1. sayfaya dön
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory, selectedTag]);

  // Normal makale filtrelemesi
  const filteredArticles = articles.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || item.topic?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? item.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  // YENİ: Sayfalama Hesaplama Motoru (Eğitim/Makale Kartları İçin)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

  // Aktivite Süzme ve Etiket Toplama
  let uniqueTags = ['Tümü'];
  activities.forEach(act => { if (act.tag && !uniqueTags.includes(act.tag)) uniqueTags.push(act.tag); });
  const filteredActivities = selectedTag === 'Tümü' ? activities : activities.filter(a => a.tag === selectedTag);

  // Modal İçi Şık Metin Biçimlendirici Süzgeç
  const renderModalFormattedText = (rawText) => {
    if (!rawText) return "";
    const lines = rawText.split('\n');
    const elements = [];
    let inAside = false, asideContent = [], inTable = false, tableRows = [];

    const renderTextWithBold = (text) => {
      if (!text.includes('**')) return text;
      return text.split(/(\*\*.*?\*\*)/g).map((part, i) => part.startsWith('**') ? <strong key={i} style={{ color: '#0f172a' }}>{part.slice(2, -2)}</strong> : part);
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]; const trimmed = line.trim();
      
      if (trimmed === '<aside>') { inAside = true; asideContent = []; continue; }
      if (trimmed === '</aside>') {
        inAside = false;
        elements.push(<div key={`aside-${i}`} style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #10b981', padding: '15px', borderRadius: '4px', margin: '15px 0', color: '#166534' }}>{asideContent.map((al, ai) => <div key={ai}>{renderTextWithBold(al)}</div>)}</div>); continue;
      }
      if (inAside) { asideContent.push(trimmed); continue; }

      if (trimmed.startsWith('|')) {
        if (!inTable) { inTable = true; tableRows = []; }
        if (!trimmed.includes('---')) tableRows.push(trimmed);
        if (i === lines.length - 1 || !lines[i + 1].trim().startsWith('|')) {
          inTable = false;
          elements.push(
            <div key={`table-${i}`} style={{ overflowX: 'auto', margin: '15px 0', borderRadius: '6px', boxShadow: '0 0 0 1px #e2e8f0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: 'white', fontSize: '13px' }}>
                <tbody>
                  {tableRows.map((row, rIdx) => {
                    const cells = row.split('|').map(c => c.trim()).filter(c => c !== '');
                    const isHeader = rIdx === 0;
                    return (
                      <tr key={`tr-${rIdx}`} style={{ backgroundColor: isHeader ? '#f8fafc' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                        {cells.map((cell, cIdx) => <td key={`td-${cIdx}`} style={{ padding: '8px 10px', fontWeight: isHeader ? 'bold' : 'normal', color: '#334155' }}>{renderTextWithBold(cell)}</td>)}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      if (trimmed.startsWith('- ')) {
        elements.push(<div key={`ul-${i}`} style={{ display: 'flex', margin: '6px 0' }}><span style={{ color: '#ea580c', marginRight: '10px' }}>•</span><span>{renderTextWithBold(trimmed.substring(2))}</span></div>); continue;
      }
      const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        elements.push(<div key={`ol-${i}`} style={{ display: 'flex', margin: '6px 0' }}><span style={{ fontWeight: 'bold', color: '#ea580c', marginRight: '10px' }}>{numMatch[1]}.</span><span>{renderTextWithBold(numMatch[2])}</span></div>); continue;
      }
      if (trimmed === '') { elements.push(<div key={i} style={{ height: '8px' }} />); continue; }
      elements.push(<p key={i} style={{ margin: '0 0 8px 0', lineHeight: '1.6', color: '#334155' }}>{renderTextWithBold(trimmed)}</p>);
    }
    return elements;
  };

  // İnfografikler Sayfası Havuzu
  let allGalleryItems = [];
  let uniqueGalleryTags = ['Tümü'];
  if (activeCategory === 'Sunumlar & İnfografikler') {
    articles.forEach(art => {
      if (art.gallery && art.gallery.length > 0) {
        art.gallery.forEach(g => {
          allGalleryItems.push({ ...g, articleId: art.id, articleTitle: art.title });
          if (!uniqueGalleryTags.includes(g.tag)) uniqueGalleryTags.push(g.tag);
        });
      }
    });
  }
  const filteredGallery = selectedTag === 'Tümü' ? allGalleryItems : allGalleryItems.filter(g => g.tag === selectedTag);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ backgroundColor: '#e2e8f0', padding: '40px 20px', textAlign: 'center', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ color: '#004170', marginBottom: '10px', fontSize: '28px' }}>
          {activeCategory === 'Aktivite Kartları' ? '🎲 İnteraktif Aktivite ve Oyun Çantası' : activeCategory ? `${activeCategory} Materyalleri` : 'Eğitim Materyalleri ve Araştırma Veritabanı'}
        </h2>
        
        {activeCategory === 'Aktivite Kartları' ? (
          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {uniqueTags.map(tag => (
              <button key={tag} onClick={() => setSelectedTag(tag)} style={{ backgroundColor: selectedTag === tag ? '#ea580c' : 'white', color: selectedTag === tag ? 'white' : '#475569', border: `1px solid ${selectedTag === tag ? '#ea580c' : '#cbd5e1'}`, padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>{tag}</button>
            ))}
          </div>
        ) : activeCategory === 'Sunumlar & İnfografikler' ? (
          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {uniqueGalleryTags.map(tag => (
              <button key={tag} onClick={() => setSelectedTag(tag)} style={{ backgroundColor: selectedTag === tag ? '#0ea5e9' : 'white', color: selectedTag === tag ? 'white' : '#475569', border: `1px solid ${selectedTag === tag ? '#0ea5e9' : '#cbd5e1'}`, padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>{tag}</button>
            ))}
          </div>
        ) : (
          <input type="text" placeholder="Makale veya konu arayın..." onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '70%', maxWidth: '600px', padding: '15px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none', marginTop: '20px' }} />
        )}
      </div>

      {activeCategory === 'Aktivite Kartları' ? (
        /* GÖRÜNÜM: AKTİVİTE KART GRIDI */
        filteredActivities.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>Seçili etikette aktivite bulunamadı.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
            {filteredActivities.map(act => (
              <div key={act.id} style={{ backgroundColor: '#fff7ed', border: '2px dashed #fb923c', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ backgroundColor: '#ffedd5', color: '#ea580c', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>🎲 {act.tag}</span>
                    {act.articleId !== 'none' && <span style={{ color: '#0ea5e9', fontSize: '11px', fontWeight: 'bold' }}>🔗 İlişkili</span>}
                  </div>
                  <h3 style={{ color: '#9a3412', margin: '0 0 10px 0', fontSize: '18px', lineHeight: '1.3' }}>{act.title}</h3>
                  <p style={{ color: '#78350f', fontSize: '13px', margin: '0 0 15px 0', lineHeight: '1.5' }}><strong>🎯 Amaç:</strong> {act.purpose.substring(0, 90)}...</p>
                </div>
                <div>
                  {act.articleId !== 'none' && <Link to={`/article/${act.articleId}`} style={{ display: 'block', textDecoration: 'none', fontSize: '12px', color: '#0284c7', marginBottom: '10px', fontWeight: '500' }}>📄 {act.articleTitle.substring(0,25)}...</Link>}
                  <button onClick={() => setActiveModalAct(act)} style={{ width: '100%', backgroundColor: '#ea580c', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Uygulama Adımlarını Aç ➔</button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeCategory === 'Sunumlar & İnfografikler' ? (
        /* İNFOGRAFİK GALERİSİ */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {filteredGallery.map((img, idx) => (
            <div key={idx} style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
              <img src={img.url} alt={img.tag} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '15px' }}>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>🏷️ {img.tag}</span>
                <p style={{ margin: '10px 0', fontSize: '14px', color: '#0f172a', fontWeight: 'bold' }}>{img.articleTitle}</p>
                <Link to={`/article/${img.articleId}`} style={{ color: '#0ea5e9', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>Makaleye Git ➔</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* GÜNCELLENDİ: STANDART KART GÖRÜNÜMÜ VE SAYFALAMA */
        <>
          {filteredArticles.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>Aramanıza uygun materyal bulunamadı.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
              {currentArticles.map(item => <ArticleCard key={item.id} item={item} />)}
            </div>
          )}

          {/* SÜLEYMAN SİHİRLİ SAYFALAMA PANELİ */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '50px', marginBottom: '20px' }}>
              <button 
                disabled={currentPage === 1}
                onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: currentPage === 1 ? '#f1f5f9' : '#ffffff', color: currentPage === 1 ? '#94a3b8' : '#004170', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
              >
                ← Önceki
              </button>
              
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => { setCurrentPage(pageNum); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: currentPage === pageNum ? '#004170' : '#cbd5e1',
                      backgroundColor: currentPage === pageNum ? '#004170' : '#ffffff',
                      color: currentPage === pageNum ? '#ffffff' : '#334155',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'all 0.2s'
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: currentPage === totalPages ? '#f1f5f9' : '#ffffff', color: currentPage === totalPages ? '#94a3b8' : '#004170', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
              >
                Sonraki →
              </button>
            </div>
          )}
        </>
      )}

      {/* DETAY MODALI */}
      {activeModalAct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', maxWidth: '650px', width: '95%', maxHeight: '85vh', overflowY: 'auto', borderRadius: '12px', padding: '30px', boxSizing: 'border-box', overflowWrap: 'anywhere', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #fed7aa', paddingBottom: '15px', marginBottom: '20px' }}>
              <div>
                <span style={{ backgroundColor: '#fff7ed', color: '#ea580c', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', border: '1px solid #ffedd5' }}>🎲 {activeModalAct.tag}</span>
                <h3 style={{ margin: '8px 0 0 0', color: '#9a3412', fontSize: '22px' }}>{activeModalAct.title}</h3>
              </div>
              <button onClick={() => setActiveModalAct(null)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', color: '#64748b' }}>X</button>
            </div>
            
            <p style={{ backgroundColor: '#fff7ed', padding: '12px', borderRadius: '6px', color: '#78350f', fontSize: '14px', margin: '0 0 20px 0' }}>🎯 <strong>Aktivitenin Amacı:</strong> {activeModalAct.purpose}</p>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#c2410c', margin: '0 0 8px 0', fontSize: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>📦 Ön Hazırlık ve Materyaller</h4>
              <div style={{ fontSize: '14px', color: '#334155' }}>{renderModalFormattedText(activeModalAct.prepList)}</div>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <h4 style={{ color: '#c2410c', margin: '0 0 8px 0', fontSize: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>🚀 Adım Adım Uygulama Rehberi</h4>
              <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>{renderModalFormattedText(activeModalAct.steps)}</div>
            </div>
            
            <button onClick={() => setActiveModalAct(null)} style={{ width: '100%', backgroundColor: '#475569', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>Kapat</button>
          </div>
        </div>
      )}

    </div>
  );
}