import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useSearchParams, Link } from 'react-router-dom';
import { db } from '../services/firebase';
import ArticleCard from '../components/ArticleCard';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams(); 
  const activeCategory = searchParams.get('kategori');

  // Galeri Filtresi İçin
  const [selectedTag, setSelectedTag] = useState('Tümü');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "articles"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        items.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());
        setArticles(items);
      } catch (error) {
        console.error("Veri çekilirken hata:", error);
      }
    };
    fetchArticles();
  }, []);

  const filteredData = articles.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || item.topic?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? item.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  // İnfografikler Sayfası için Tüm Galerileri Toplama Motoru
  let allGalleryItems = [];
  let uniqueTags = ['Tümü'];

  if (activeCategory === 'Sunumlar & İnfografikler') {
    filteredData.forEach(art => {
      if (art.gallery && art.gallery.length > 0) {
        art.gallery.forEach(g => {
          allGalleryItems.push({ ...g, articleId: art.id, articleTitle: art.title });
          if (!uniqueTags.includes(g.tag)) uniqueTags.push(g.tag);
        });
      }
    });
  }

  const filteredGallery = selectedTag === 'Tümü' ? allGalleryItems : allGalleryItems.filter(g => g.tag === selectedTag);

  return (
    <div>
      <div style={{ backgroundColor: '#e2e8f0', padding: '40px 20px', textAlign: 'center', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ color: '#004170', marginBottom: '10px', fontSize: '28px' }}>
          {activeCategory ? `${activeCategory} Materyalleri` : 'Eğitim Materyalleri ve Araştırma Veritabanı'}
        </h2>
        
        {/* EĞER İNFOGRAFİKLER SAYFASINDAYSAK ARAMA YERİNE ETİKET FİLTRESİ GÖSTER */}
        {activeCategory === 'Sunumlar & İnfografikler' ? (
          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {uniqueTags.map(tag => (
              <button 
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  backgroundColor: selectedTag === tag ? '#0ea5e9' : 'white',
                  color: selectedTag === tag ? 'white' : '#475569',
                  border: `1px solid ${selectedTag === tag ? '#0ea5e9' : '#cbd5e1'}`,
                  padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s'
                }}>
                {tag}
              </button>
            ))}
          </div>
        ) : (
          <input 
            type="text" 
            placeholder="Makale veya konu arayın..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '70%', maxWidth: '600px', padding: '15px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none', marginTop: '20px' }}
          />
        )}
      </div>

      {activeCategory === 'Sunumlar & İnfografikler' ? (
        /* VİTRİN: ETİKETLİ İNFOGRAFİK GALERİSİ */
        filteredGallery.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>Bu etiketle veya kategoride henüz bir görsel bulunmuyor.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {filteredGallery.map((img, idx) => (
              <div key={idx} style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                <img src={img.url} alt={img.tag} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>🏷️ {img.tag}</span>
                    <p style={{ margin: '10px 0', fontSize: '14px', color: '#0f172a', fontWeight: 'bold', lineHeight: '1.4' }}>{img.articleTitle}</p>
                  </div>
                  <Link to={`/article/${img.articleId}`} style={{ color: '#0ea5e9', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', display: 'block', marginTop: '10px' }}>
                    Makaleye Git ➔
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* DİĞER SAYFALAR İÇİN STANDART KART GÖRÜNÜMÜ */
        filteredData.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>Aramanıza uygun materyal bulunamadı.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
            {filteredData.map(item => (
              <ArticleCard key={item.id} item={item} />
            ))}
          </div>
        )
      )}
    </div>
  );
}