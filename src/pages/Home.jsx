import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import ArticleCard from '../components/ArticleCard';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "articles"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // En yeni eklenen en üstte çıksın diye sıralıyoruz
        items.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());
        setArticles(items);
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
      }
    };
    fetchArticles();
  }, []);

  const filteredData = articles.filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.topic?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ backgroundColor: '#e2e8f0', padding: '40px 20px', textAlign: 'center', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ color: '#004170', marginBottom: '20px', fontSize: '24px' }}>Eğitim Materyalleri ve Araştırma Veritabanı</h2>
        <input 
          type="text" 
          placeholder="Makale, konu veya eğitim türü arayın..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '70%', maxWidth: '600px', padding: '15px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none' }}
        />
      </div>

      {filteredData.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>Henüz sisteme eklenmiş bir eğitim materyali bulunmuyor veya aramanıza uygun sonuç yok.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
          {filteredData.map(item => (
            <ArticleCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}