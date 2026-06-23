import React, { useState } from 'react';
import ArticleCard from '../components/ArticleCard';

// Test amaçlı, Karabağlar eğitimlerine uygun geçici (mock) veri
const mockData = [
  {
    id: 1,
    title: 'Bulaşıcı Hastalıklar ve Korunma Yolları',
    category: 'Halk Eğitimi',
    topic: 'Salgın Yönetimi',
    summary: 'Halk eğitimleri için hazırlanan, salgın hastalıkların yayılımını önleme ve temel hijyen kurallarını içeren güncel eğitim modülü.',
    pdfUrl: 'korunma-yollari.pdf'
  },
  {
    id: 2,
    title: 'Sağlık Okuryazarlığı Temelleri',
    category: 'Halk Eğitimi',
    topic: 'Okuryazarlık',
    summary: 'Vatandaşların sağlık sistemini daha iyi anlaması ve doğru bilgiye ulaşması için hazırlanan görsel ağırlıklı infografik seti.',
    pdfUrl: 'okuryazarlik.pdf'
  },
  {
    id: 3,
    title: 'Filyasyon ve Saha Çalışması Rehberi',
    category: 'Hizmet İçi Eğitim',
    topic: 'Saha Çalışması',
    summary: 'Sağlık personeli ve filyasyon ekipleri için hazırlanan interaktif eğitim modülleri ve güncel mevzuat analizleri.',
    pdfUrl: 'filyasyon.pdf'
  },
  {
    id: 4,
    title: 'Bölgesel Demografik Sağlık İstatistikleri',
    category: 'Hizmet İçi Eğitim',
    topic: 'İstatistik',
    summary: 'Karabağlar bölgesine ait tıbbi sürveyans raporları ve sağlık hizmetleri kullanım oranlarını gösteren detaylı veri analizi.',
    pdfUrl: 'istatistik.pdf'
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  // Arama çubuğuna yazılan metne göre kartları anında filtreleme
  const filteredData = mockData.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* EBSCO Tarzı Arama Banner Alanı */}
      <div style={{ backgroundColor: '#e2e8f0', padding: '40px 20px', textAlign: 'center', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ color: '#004170', marginBottom: '20px', fontSize: '24px' }}>Eğitim Materyalleri ve Araştırma Veritabanı</h2>
        <input 
          type="text" 
          placeholder="Makale, konu veya eğitim türü arayın..." 
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '70%', maxWidth: '600px', padding: '15px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '16px', outline: 'none' }}
        />
      </div>

      {/* Dinamik Kart Dizilimi (Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        {filteredData.map(item => (
          <ArticleCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}