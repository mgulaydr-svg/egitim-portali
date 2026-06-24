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

  const renderFormattedContent = (rawText) => {
    if (!rawText) return "";

    const lines = rawText.split('\n');
    const elements = [];
    let inAside = false;
    let asideContent = [];
    let inTable = false;
    let tableRows = [];

    const renderTextWithBold = (text) => {
      if (!text.includes('**')) return text;
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} style={{ color: '#0f172a', fontWeight: '800' }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed === '<aside>') {
        inAside = true;
        asideContent = [];
        continue;
      }
      if (trimmed === '</aside>') {
        inAside = false;
        elements.push(
          <div key={`aside-${i}`} style={{ backgroundColor: '#f0fdf4', borderLeft: '5px solid #10b981', padding: '20px', borderRadius: '0 8px 8px 0', margin: '25px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            {asideContent.map((aLine, aIdx) => {
              if(aLine.trim() === '') return <div key={`asc-${aIdx}`} style={{height: '10px'}} />;
              return (
                <div key={`ast-${aIdx}`} style={{ color: '#166534', fontSize: '15px', lineHeight: '1.7', marginBottom: '8px', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                  {renderTextWithBold(aLine)}
                </div>
              )
            })}
          </div>
        );
        continue;
      }
      if (inAside) {
        asideContent.push(trimmed);
        continue;
      }

      if (trimmed.startsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        if (!trimmed.includes('---')) {
          tableRows.push(trimmed);
        }
        if (i === lines.length - 1 || !lines[i + 1].trim().startsWith('|')) {
          inTable = false;
          elements.push(
            <div key={`table-${i}`} style={{ overflowX: 'auto', margin: '30px 0', borderRadius: '8px', boxShadow: '0 0 0 1px #e2e8f0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', backgroundColor: 'white', tableLayout: 'fixed' }}>
                <tbody>
                  {tableRows.map((row, rIdx) => {
                    const cells = row.split('|').map(c => c.trim()).filter(c => c !== '');
                    const isHeader = rIdx === 0;
                    return (
                      <tr key={`tr-${rIdx}`} style={{ backgroundColor: isHeader ? '#f8fafc' : 'white', borderBottom: '1px solid #e2e8f0' }}>
                        {cells.map((cell, cIdx) => (
                          <td key={`td-${cIdx}`} style={{ padding: '14px 16px', fontWeight: isHeader ? 'bold' : 'normal', color: isHeader ? '#0f172a' : '#334155', borderRight: cIdx !== cells.length - 1 ? '1px solid #e2e8f0' : 'none', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                            {renderTextWithBold(cell)}
                          </td>
                        ))}
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

      if (trimmed === '') {
        elements.push(<div key={`space-${i}`} style={{ height: '12px' }} />);
        continue;
      }

      if (trimmed.startsWith('## ')) {
        elements.push(<h2 key={`h2-${i}`} style={{ color: '#004170', marginTop: '35px', marginBottom: '15px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', fontSize: '24px', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{renderTextWithBold(trimmed.replace('## ', ''))}</h2>);
        continue;
      }
      if (trimmed.startsWith('### ')) {
        elements.push(<h3 key={`h3-${i}`} style={{ color: '#0f766e', marginTop: '25px', marginBottom: '12px', fontSize: '20px', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{renderTextWithBold(trimmed.replace('### ', ''))}</h3>);
        continue;
      }

      if (trimmed.startsWith('- ')) {
        elements.push(
          <div key={`ul-${i}`} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ color: '#10b981', marginRight: '12px', fontSize: '20px', lineHeight: '1.4' }}>•</span>
            <span style={{ color: '#334155', fontSize: '16px', lineHeight: '1.8', flex: 1, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{renderTextWithBold(trimmed.substring(2))}</span>
          </div>
        );
        continue;
      }

      const numberedListMatch = trimmed.match(/^(\d+)\.\s(.*)/);
      if (numberedListMatch) {
        elements.push(
          <div key={`ol-${i}`} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ backgroundColor: '#e2e8f0', color: '#0f172a', fontWeight: 'bold', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', marginRight: '12px', fontSize: '12px', flexShrink: 0, marginTop: '2px' }}>
              {numberedListMatch[1]}
            </span>
            <span style={{ color: '#334155', fontSize: '16px', lineHeight: '1.8', flex: 1, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{renderTextWithBold(numberedListMatch[2])}</span>
          </div>
        );
        continue;
      }

      elements.push(
        <p key={`p-${i}`} style={{ color: '#334155', fontSize: '16px', lineHeight: '1.8', marginBottom: '12px', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
          {renderTextWithBold(trimmed)}
        </p>
      );
    }

    return <div style={{ width: '100%' }}>{elements}</div>;
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

      <h1 style={{ color: '#004170', fontSize: '32px', marginTop: 0, marginBottom: '25px', lineHeight: '1.3', textAlign: 'left', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{article.title}</h1>

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