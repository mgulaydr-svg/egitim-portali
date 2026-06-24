import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { uploadToCloudinary } from '../services/cloudinary';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Halk Eğitimi');
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // DİKKAT: BURAYA KENDİ GMAIL ADRESİNİ YAZ
  const adminEmail = "senin-gmail-adresin@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Giriş hatası:", error);
      alert("Giriş yapılamadı. Tarayıcınızın açılır pencere engelleyicisini kontrol edin.");
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let uploadedPdfUrl = "";
      if (pdfFile) {
        uploadedPdfUrl = await uploadToCloudinary(pdfFile);
      }
      
      const finalTopic = customTopic || topic || 'Genel';
      
      await addDoc(collection(db, "articles"), {
        title,
        content,
        category,
        topic: finalTopic,
        pdfUrl: uploadedPdfUrl,
        authorName: user.displayName,
        authorEmail: user.email,
        createdAt: new Date()
      });

      alert("İçerik başarıyla yayınlandı!");
    } catch (error) {
      console.error("Hata:", error);
      alert("Yükleme sırasında hata oluştu. Veritabanı kurallarını kontrol edin.");
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h2 style={{ color: '#004170', marginBottom: '20px' }}>Yönetici Girişi</h2>
        <button onClick={handleGoogleLogin} style={{ backgroundColor: '#4285F4', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '16px' }}>
          🌐 Google ile Giriş Yap
        </button>
      </div>
    );
  }

  if (user && user.email !== adminEmail) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h2 style={{ color: '#b91c1c', marginBottom: '20px' }}>⚠️ Yetkisiz Erişim</h2>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>Bu e-posta adresi yönetici paneli için yetkilendirilmemiştir.</p>
        <button onClick={handleLogout} style={{ backgroundColor: '#475569', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Çıkış Yap</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #10b981', paddingBottom: '10px', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: '#004170', margin: 0 }}>Yeni Eğitim Materyali Ekle</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>Hoş geldin, {user.displayName}</p>
        </div>
        <button onClick={handleLogout} style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: '#475569' }}>Güvenli Çıkış</button>
      </div>

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