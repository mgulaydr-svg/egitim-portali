import React, { useState } from 'react';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Halk Eğitimi');
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [pdfFile, setPdfFile] = useState(null);

  // Sahte (Mock) Kaydetme İşlemi
  const handleSave = (e) => {
    e.preventDefault();
    const finalTopic = customTopic || topic || 'Genel';
    alert(`Başarıyla Kaydedildi!\n\nBaşlık: ${title}\nKategori: ${category}\nKonu: ${finalTopic}\nDosya: ${pdfFile ? pdfFile.name : 'Yok'}`);
    // İleride burası Firebase ve Cloudinary'ye bağlanacak
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#004170', borderBottom: '2px solid #10b981', paddingBottom: '10px', marginBottom: '30px' }}>
        Yeni Eğitim Materyali Ekle
      </h2>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Başlık */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333f48' }}>Makale / Sunum Başlığı</label>
          <input 
            type="text" 
            required
            placeholder="Örn: Bulaşıcı Hastalıklardan Korunma..."
            onChange={e => setTitle(e.target.value)} 
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '16px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Kategori (Halk Eğitimi / Hizmet İçi) */}
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333f48' }}>Eğitim Türü</label>
            <select 
              onChange={e => setCategory(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '16px', backgroundColor: 'white' }}
            >
              <option value="Halk Eğitimi">Halk Eğitimi</option>
              <option value="Hizmet İçi Eğitim">Hizmet İçi Eğitim</option>
            </select>
          </div>

          {/* Konu Seçimi */}
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333f48' }}>Ana Konu</label>
            <select 
              onChange={e => setTopic(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '16px', backgroundColor: 'white' }}
            >
              <option value="">-- Konu Seçin --</option>
              <option value="Sağlık Okuryazarlığı">Sağlık Okuryazarlığı</option>
              <option value="Salgın Yönetimi">Salgın Yönetimi</option>
              <option value="İlk Yardım">İlk Yardım</option>
            </select>
          </div>
        </div>

        {/* Dinamik Alt Konu Ekleme */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333f48' }}>Farklı Bir Konu Ekle (Listede Yoksa)</label>
          <input 
            type="text" 
            placeholder="Yeni bir konu veya alt konu yazın..."
            onChange={e => setCustomTopic(e.target.value)} 
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '16px', backgroundColor: '#f8fafc' }}
          />
        </div>

        {/* Metin Editörü (Şimdilik Textarea, ileride Zengin Metin) */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333f48' }}>İçerik Özeti / Eğitim Metni</label>
          <textarea 
            rows="6"
            placeholder="Eğitim içeriğini buraya yazın..."
            onChange={e => setContent(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '16px', resize: 'vertical' }}
          ></textarea>
        </div>

        {/* Cloudinary PDF Yükleme Alanı */}
        <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '8px', border: '1px dashed #10b981' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#14532d' }}>📥 Sunum Yükle (PDF)</label>
          <input 
            type="file" 
            accept=".pdf" 
            onChange={e => setPdfFile(e.target.files[0])} 
            style={{ width: '100%', cursor: 'pointer' }}
          />
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#16a34a' }}>*Seçilen dosya otomatik olarak Cloudinary sunucularına aktarılacaktır.</p>
        </div>

        {/* Kaydet Butonu */}
        <button 
          type="submit"
          style={{ backgroundColor: '#004170', color: 'white', padding: '15px', border: 'none', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
        >
          Sisteme Yükle ve Yayınla
        </button>
      </form>
    </div>
  );
}