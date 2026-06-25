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
        if (docSnap.exists()) setArticle(docSnap.data());
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchArticle();
  }, [id]);

  const renderFormattedContent = (rawText) => {
    if (!rawText) return "";
    const lines = rawText.split('\n');
    const elements = [];
    let inAside = false, asideContent = [], inTable = false, tableRows = [];

    const renderTextWithBold = (text) => {
      if (!text.includes('**')) return text;
      return text.split(/(\*\*.*?\*\*)/g).map((part, i) => part.startsWith('**') ? <strong key={i} style={{ color: '#0f172a', fontWeight: '800' }}>{part.slice(2, -2)}</strong> : part);
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]; const trimmed = line.trim();

      if (trimmed === '<aside>') { inAside = true; asideContent = []; continue; }
      if (trimmed === '</aside>') {
        inAside = false;
        elements.push(
          <div key={`aside-${i}`} style={{ backgroundColor: '#f0fdf4', borderLeft: '5px solid #10b981', padding: '20px', borderRadius: '0 8px 8px 0', margin: '25px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            {asideContent.map((aLine, aIdx) => <div key={`ast-${aIdx}`} style={{ color: '#166534', fontSize: '15px', lineHeight: '1.7', marginBottom: '8px' }}>{renderTextWithBold(aLine)}</div>)}
          </div>
        ); continue;
      }
      if (inAside) { asideContent.push(trimmed); continue; }

      const imageMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imageMatch) {
        elements.push(
          <div key={`img-${i}`} style={{ margin: '35px 0', textAlign: 'center' }}>
            <img src={imageMatch[2]} alt={imageMatch[1]} style={{ maxWidth: '100%', borderRadius: '8px' }} />
            <p style={{ color: '#64748b', fontSize: '13px', marginTop: '10px', fontStyle: 'italic' }}>{imageMatch[1]}</p>
          </div>
        ); continue;
      }

      if (trimmed.startsWith('## ')) { elements.push(<h2 key={`h2-${i}`} style={{ color: '#004170', marginTop: '35px', marginBottom: '15px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', fontSize: '24px' }}>{renderTextWithBold(trimmed.replace('## ', ''))}</h2>); continue; }
      if (trimmed.startsWith('### ')) { elements.push(<h3 key={`h3-${i}`} style={{ color: '#0f766e', marginTop: '25px', marginBottom: '12px', fontSize: '20px' }}>{renderTextWithBold(trimmed.replace('### ', ''))}</h3>); continue; }
      
      if (trimmed === '') { elements.push(<div key={`space-${i}`} style={{ height: '12px' }} />); continue; }
      if (trimmed.startsWith('- ')) {
        elements.push(<div key={`ul-${i}`} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}><span style={{ color: '#10b981', marginRight: '12px', fontSize: '20px' }}>•</span><span style={{ color: '#334155', fontSize: '16px', lineHeight: '1.8', flex: 1 }}>{renderTextWithBold(trimmed.substring(2))}</span></div>); continue;
      }

      elements.push(<p key={`p-${i}`} style={{ color: '#334155', fontSize: '16px', lineHeight: '1.8', marginBottom: '12px' }}>{renderTextWithBold(trimmed)}</p>);
    }
    return <div style={{ width: '100%' }}>{elements}</div>;
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#004170' }}>İçerik yükleniyor...</div>;
  if (!article) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#b91c1c' }}>İçerik bulunamadı.</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'left' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#475569', textDecoration: 'none', fontWeight: 'bold' }}>⬅️ Listeye Geri Dön</Link>
      
      <h1 style={{ color: '#004170', fontSize: '32px', marginTop: 0, marginBottom: '25px', lineHeight: '1.3' }}>{article.title}</h1>
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '25px' }}>{renderFormattedContent(article.content)}</div>

      {article.pdfUrl && (
        <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '6px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px' }}>
          <div><h4 style={{ margin: 0, color: '#14532d' }}>Ek Kaynak Bulunuyor</h4></div>
          <button onClick={() => window.open(article.pdfUrl, '_blank')} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>📥 PDF Sunumunu Aç</button>
        </div>
      )}

      {/* YENİ: GALERİ ALANI */}
      {article.gallery && article.gallery.length > 0 && (
        <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '2px dashed #cbd5e1' }}>
          <h3 style={{ color: '#0f766e', marginBottom: '20px' }}>🖼️ İlgili İnfografikler ve Görseller</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {article.gallery.map((img, idx) => (
              <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <a href={img.url} target="_blank" rel="noreferrer">
                  <img src={img.url} alt={img.tag} style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
                </a>
                <div style={{ backgroundColor: '#f8fafc', padding: '10px', textAlign: 'center', fontSize: '13px', color: '#475569', fontWeight: 'bold' }}>
                  🏷️ {img.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}