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
        } else {
          console.log("Makale bulunamadı!");
        }
      } catch (error) {
        console.error("Makale yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px', color: '#004170', fontWeight: 'bold' }}>İçerik yükleniyor...</div>;
  }

  if (!article) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2 style={{ color: '#b91c1c' }}>İçerik Bulunamadı</h2>
        <Link to="/" style={{ color: '#004170', fontWeight: 'bold' }}>Ana Sayfaya Dön</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#475569', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
        ⬅️ Listeye Geri Dön
      </Link>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <span style={{ backgroundColor: '#004170', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>{article.category}</span>
        <span style={{ backgroundColor: '#10b981', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>{article.topic}</span>
      </div>

      <h1 style={{ color: '#004170', fontSize: '32px', marginTop: 0, marginBottom: '25px', lineHeight: '1.3' }}>{article.title}</h1>

      <div style={{ color: '#334155', fontSize: '16px', lineHeight: '1.8', whiteSpace: 'pre-wrap', marginBottom: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '25px' }}>
        {article.content}
      </div>

      {article.pdfUrl && (
        <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '6px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, color: '#14532d' }}>Bu Eğitime Ait Ek Kaynak Bulunuyor</h4>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#16a34a' }}>Sunum veya detaylı kılavuz belgesini cihazınıza indirebilirsiniz.</p>
          </div>
          <button 
            onClick={() => window.open(article.pdfUrl, '_blank')}
            style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            📥 PDF Sunumunu Aç / İndir
          </button>
        </div>
      )}
    </div>
  );
}