import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkedActivities, setLinkedActivities] = useState([]); // Makaleye bağlı aktiviteler

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const docRef = doc(db, "articles", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setArticle(docSnap.data());

        // Bu makaleye bağlı aktiviteleri de çekelim (Hata vermemesi için client-side filtreleme)
        const actSnap = await getDocs(collection(db, "activities"));
        const allActs = actSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setLinkedActivities(allActs.filter(a => a.articleId === id));

      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchArticleData();
  }, [id]);

  // Akıllı Metin Dönüştürücü Süzgeç (Aktiviteler için de ortak çalışacak)
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
          <div key={`aside-${i}`} style={{ backgroundColor: '#f0fdf4', borderLeft: '5px solid #10b981', padding: '20px', borderRadius: '0 8px 8px 0', margin: '25px 0' }}>
            {asideContent.map((aLine, aIdx) => <div key={`ast-${aIdx}`} style={{ color: '#166534', fontSize: '15px', lineHeight: '1.7', marginBottom: '4px' }}>{renderTextWithBold(aLine)}</div>)}
          </div>
        ); continue;
      }
      if (inAside) { asideContent.push(trimmed); continue; }

      // Tablo Desteği
      if (trimmed.startsWith('|')) {
        if (!inTable) { inTable = true; tableRows = []; }
        if (!trimmed.includes('---')) tableRows.push(trimmed);
        if (i === lines.length - 1 || !lines[i + 1].trim().startsWith('|')) {
          inTable = false;
          elements.push(
            <div key={`table-${i}`} style={{ overflowX: 'auto', margin: '20px 0', borderRadius: '8px', boxShadow: '0 0 0 1px #e2e8f0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: 'white' }}>
                <tbody>
                  {tableRows.map((row, rIdx) => {
                    const cells = row.split('|').map(c => c.trim()).filter(c => c !== '');
                    const isHeader = rIdx === 0;
                    return (
                      <tr key={`tr-${rIdx}`} style={{ backgroundColor: isHeader ? '#f8fafc' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                        {cells.map((cell, cIdx) => <td key={`td-${cIdx}`} style={{ padding: '12px', fontWeight: isHeader ? 'bold' : 'normal', color: '#334155' }}>{renderTextWithBold(cell)}</td>)}
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
      
      // Liste ve Madde İşaretleri
      if (trimmed.startsWith('- ')) {
        elements.push(<div key={`ul-${i}`} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}><span style={{ color: '#ea580c', marginRight: '12px', fontSize: '18px' }}>•</span><span style={{ color: '#334155', fontSize: '16px', lineHeight: '1.6', flex: 1 }}>{renderTextWithBold(trimmed.substring(2))}</span></div>); continue;
      }
      const numberedListMatch = trimmed.match(/^(\d+)\.\s(.*)/);
      if (numberedListMatch) {
        elements.push(<div key={`ol-${i}`} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}><span style={{ backgroundColor: '#ea580c', color: 'white', fontWeight: 'bold', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', marginRight: '12px', fontSize: '12px', flexShrink: 0 }}>{numberedListMatch[1]}</span><span style={{ color: '#334155', fontSize: '16px', lineHeight: '1.6', flex: 1 }}>{renderTextWithBold(numberedListMatch[2])}</span></div>); continue;
      }

      elements.push(<p key={`p-${i}`} style={{ color: '#334155', fontSize: '16px', lineHeight: '1.8', marginBottom: '12px' }}>{renderTextWithBold(trimmed)}</p>);
    }
    return <div style={{ width: '100%' }}>{elements}</div>;
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#004170' }}>Yükleniyor...</div>;
  if (!article) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#b91c1c' }}>İçerik bulunamadı.</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'left' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#475569', textDecoration: 'none', fontWeight: 'bold' }}>⬅️ Listeye Geri Dön</Link>
      
      <h1 style={{ color: '#004170', fontSize: '32px', marginTop: 0, marginBottom: '25px', lineHeight: '1.3' }}>{article.title}</h1>
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '25px' }}>{renderFormattedContent(article.content)}</div>

      {article.pdfUrl && (
        <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '6px', border: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px' }}>
          <div><h4 style={{ margin: 0, color: '#14532d' }}>Bu Eğitime Ait Ek Sunum Dosyası</h4></div>
          <button onClick={() => window.open(article.pdfUrl, '_blank')} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>📥 Sunumu Görüntüle</button>
        </div>
      )}

      {/* YENİ: MAKALEYE BAĞLI AKTİVİTE KARTLARI */}
      {linkedActivities.length > 0 && (
        <div style={{ marginTop: '60px', paddingTop: '30px', borderTop: '3px solid #ea580c' }}>
          <h2 style={{ color: '#ea580c', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>🎲 Bu Eğitime Ait Uygulamalı Aktiviteler</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {linkedActivities.map(act => (
              <div key={act.id} style={{ backgroundColor: '#fff7ed', border: '2px dashed #fb923c', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <h3 style={{ color: '#9a3412', margin: 0 }}>{act.title}</h3>
                  <span style={{ backgroundColor: '#ea580c', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>🏷️ {act.tag}</span>
                </div>
                <p style={{ color: '#78350f', fontWeight: '500', margin: '0 0 20px 0', borderBottom: '1px solid #fed7aa', paddingBottom: '10px' }}>🎯 <strong>Amacı:</strong> {act.purpose}</p>
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: '#c2410c', margin: '0 0 8px 0' }}>📦 Ön Hazırlık ve Materyaller</h4>
                  <div>{renderFormattedContent(act.prepList)}</div>
                </div>
                <div>
                  <h4 style={{ color: '#c2410c', margin: '0 0 8px 0' }}>🚀 Adım Adım Uygulama Rehberi</h4>
                  <div>{renderFormattedContent(act.steps)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}