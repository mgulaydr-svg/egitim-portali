import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom'; // URL'yi okumak için eklendi
import { db } from '../services/firebase';
import ArticleCard from '../components/ArticleCard';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams(); 
  const activeCategory = searchParams.get('kategori'); // URL'deki kategori adını yakala

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

  // Hem arama kutusuna hem de Navbar'dan gelen kategoriye göre filtrele
  const filteredData = articles.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || item.topic?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? item.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div style={{ backgroundColor: '#e2e8f0', padding: '40px 20px', textAlign: 'center', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ color: '#004170', marginBottom: '10px', fontSize: '28px' }}>
          {activeCategory ? `${activeCategory} Materyalleri` : 'Eğitim Materyalleri ve Araştırma Veritabanı'}
        </h2>
        {activeCategory && <p style={{ color: '#64748b', marginBottom: '20px' }}>Şu an sadece seçili kategoriyi görüntülüyorsunuz.</p>}
        
        <input 
          type="text" 
          placeholder="Makale veya konu arayın..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '70%', maxWidth: '600px', padding: '15px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none' }}
        />
      </div>

      {filteredData.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>Bu kategoriye veya aramaya uygun materyal bulunamadı.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
          {filteredData.map(item => (
            <ArticleCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}