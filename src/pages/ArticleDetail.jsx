import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, "articles", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setArticle(docSnap.data());
        }
      } catch (error) {
        console.error("Makale yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  // Metindeki Markdown ve HTML öğelerini şık elementlere dönüştüren fonksiyon
  const renderFormattedContent = (rawText) => {
    if (!rawText) return "";

    // Adım 1: Satırları ayır ve işle
    const lines = rawText.split('\n');
    let inTable = false;
    let tableRows = [];

    const processedBlocks = lines.map((line, index) => {
      const trimmed = line.trim();

      // H2 Başlık Kontrolü (## Başlık)
      if (trimmed.startsWith('## ')) {
        return <h2 key={index} style={{ color: '#004170', marginTop: '30px', marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', textAlign: 'left' }}>{trimmed.replace('## ', '')}</h2>;
      }

      // H3 Başlık Kontrolü (### Başlık)
      if (trimmed.startsWith('### ')) {
        return <h3 key={index} style={{ color: '#0f766e', marginTop: '20px', marginBottom: '10px', textAlign: 'left' }}>{trimmed.replace('### ', '')}</h3>;
      }

      // Callout / Aside Kutusu Kontrolü (<aside> veya </aside>)
      if (trimmed.startsWith('<aside>') || trimmed.startsWith('</aside>')) {
        return null; // Etiket satırlarını temizle
      }

      // Eğer satır callout içindeki bir emoji veya özel madde ise şık kutuya çevir
      if (trimmed.startsWith('1️⃣') || trimmed.startsWith('2️⃣') || trimmed.startsWith('3️⃣') || trimmed.startsWith('⚠️') || trimmed.startsWith('💧') || trimmed.startsWith('🍬') || trimmed.startsWith('⭐') || trimmed.startsWith('🛡️')) {
        return (
          <div key={index} style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #10b981', padding: '15px 20px', borderRadius: '0 8px 8px 0', margin: '20px 0', color: '#334155', fontSize: '15px', lineHeight: '1.6', textAlign: 'left' }}>
            {trimmed}
          </div>
        );
      }

      // Tablo Satır Kontrolü (| hücre | hücre |)
      if (trimmed.startsWith('|')) {
        if (trimmed.includes('---')) return null; // Tablo çizgisini atla
        
        const cells = trimmed.split('|').map(c => c.trim()).filter(c => c !== '');
        const isHeader = index === lines.findIndex(l => l.trim().startsWith('|')); // İlk satırı başlık yap
        
        return (
          <tr key={index} style={{ backgroundColor: isHeader ? '#f1f5f9' : 'white', borderBottom: '1px solid #e2e8f0' }}>
            {cells.map((cell, cIdx) => (
              <td key={cIdx} style={{ padding: '12px', fontWeight: isHeader ? 'bold' : 'normal', color: '#334155', border: '1px solid #e2e8f0' }}>
                {cell}
              </td>
            ))}
          </tr>
        );
      }

      // Standart Paragraf ve Liste Maddeleri
      if (trimmed === '') return <div key={index} style={{ height: '10px' }} />;
      
      return (
        <p key={index} style={{ color: '#334155', fontSize: '16px', lineHeight: '1.8', marginBottom: '15px', textAlign: 'left' }}>
          {trimmed.startsWith('- ') ? '• ' + trimmed.substring(2) : trimmed}
        </p>
      );
    });

    return (
      <div style={{ width: '100%' }}>
        {processedBlocks}
      </div>
    );
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#004170', fontWeight: 'bold' }}>İçerik yükleniyor...</div>;
  if (!article) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#b91c1c' }}>İçerik bulunamadı.</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'left' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#475569', textDecoration: 'none', fontWeight: 'bold' }}>
        ⬅️ Listeye Geri Dön
      </Link>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <span style={{ backgroundColor: '#004170', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>{article.category}</span>
        <span style={{ backgroundColor: '#10b981', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>{article.topic}</span>
      </div>

      <h1 style={{ color: '#004170', fontSize: '32px', marginTop: 0, marginBottom: '25px', lineHeight: '1.3', textAlign: 'left' }}>{article.title}</h1>

      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '25px' }}>
        {renderFormattedContent(article.content)}
      </div>

      {article.pdfUrl && (
        <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '6px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px' }}>
          <div>
            <h4 style={{ margin: 0, color: '#14532d', textAlign: 'left' }}>Bu Eğitime Ait Ek Kaynak Bulunuyor</h4>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#16a34a', textAlign: 'left' }}>Sunum veya detaylı kılavuz belgesini görüntüleyebilirsiniz.</p>
          </div>
          <button onClick={() => window.open(article.pdfUrl, '_blank')} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            📥 PDF Sunumunu Aç
          </button>
        </div>
      )}
    </div>
  );
}