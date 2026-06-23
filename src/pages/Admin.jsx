import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { uploadToCloudinary } from '../services/cloudinary';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Halk Eğitimi');
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setUploading(true);
    console.log("ADIM 1: Kaydetme tıklandı, işlem başlıyor...");

    try {
      let uploadedPdfUrl = "";
      
      if (pdfFile) {
        console.log("ADIM 2: PDF dosyası Cloudinary sunucularına gönderiliyor...");
        uploadedPdfUrl = await uploadToCloudinary(pdfFile);
        console.log("ADIM 3: Cloudinary yüklemesi başarılı! Link:", uploadedPdfUrl);
      }
      
      console.log("ADIM 4: Tüm bilgiler Firebase veritabanına yazılıyor...");
      await addDoc(collection(db, "articles"), {
        title,
        content,
        category,
        topic: customTopic || topic || 'Genel',
        pdfUrl: uploadedPdfUrl,
        createdAt: new Date()
      });

      console.log("ADIM 5: Tüm işlemler kusursuz tamamlandı!");
      alert("İçerik başarıyla yayınlandı ve ana sayfaya eklendi!");
    } catch (error) {
      console.error("HATA YAKALANDI:", error);
      alert("Bir hata oluştu. Lütfen Konsol ekranını kontrol et.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#004170', borderBottom: '2px solid #10b981', paddingBottom: '10px', marginBottom: '30px' }}>
        Yeni Eğitim Materyali Ekle
      </h2>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333f48' }}>Makale / Sunum Başlığı</label>
          <input type="text" required onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333f48' }}>Eğitim Türü</label>
            <select onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
              <option value="Halk Eğitimi">Halk Eğitimi</option>
              <option value="Hizmet İçi Eğitim">Hizmet İçi Eğitim</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333f48' }}>Ana Konu</label>
            <select onChange={e => setTopic(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
              <option value="">-- Konu Seçin --</option>
              <option value="Sağlık Okuryazarlığı">Sağlık Okuryazarlığı</option>
              <option value="Salgın Yönetimi">Salgın Yönetimi</option>
              <option value="İlk Yardım">İlk Yardım</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333f48' }}>Farklı Bir Konu Ekle</label>
          <input type="text" onChange={e => setCustomTopic(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#333f48' }}>İçerik Özeti / Eğitim Metni</label>
          <textarea rows="6" onChange={e => setContent(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', resize: 'vertical' }}></textarea>
        </div>

        <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '8px', border: '1px dashed #10b981' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#14532d' }}>📥 Sunum Yükle (PDF)</label>
          <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])} style={{ width: '100%' }} />
        </div>

        <button type="submit" disabled={uploading} style={{ backgroundColor: uploading ? '#94a3b8' : '#004170', color: 'white', padding: '15px', border: 'none', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
          {uploading ? 'Yükleniyor, lütfen bekleyin...' : 'Sisteme Yükle ve Yayınla'}
        </button>
      </form>
    </div>
  );
}
