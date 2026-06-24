import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { uploadToCloudinary } from '../services/cloudinary';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Halk Eğitimi');
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // KENDİ YETKİLİ ADRESİN
  const adminEmail = "mgulaydr@gmail.com";

  // Kullanıcı durumunu ve mevcut makaleleri yükle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === adminEmail) {
        fetchArticles();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchArticles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "articles"));
      const items = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setArticles(items);
    } catch (error) {
      console.error("Yayınlar çekilemedi:", error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      alert("Giriş başarısız.");
    }
  };

  const handleLogout = () => { signOut(auth); };

  const handleSave = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let uploadedPdfUrl = "";
      if (pdfFile) {
        uploadedPdfUrl = await uploadToCloudinary(pdfFile);
      }
      
      await addDoc(collection(db, "articles"), {
        title,
        content,
        category,
        topic: customTopic || topic || 'Genel',
        pdfUrl: uploadedPdfUrl,
        createdAt: new Date()
      });

      alert("İçerik başarıyla yayınlandı!");
      fetchArticles(); // Listeyi güncelle
    } catch (error) {
      alert("Hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  // Veritabanından İçerik Silme Fonksiyonu
  const handleDelete = async (id) => {
    if (window.confirm("Bu eğitim materyalini tamamen silmek istediğinize emin misiniz?")) {
      try {
        await deleteDoc(doc(db, "articles", id));
        alert("Yayın başarıyla kaldırıldı.");
        fetchArticles(); // Listeyi güncelle
      } catch (error) {
        alert("Silme işlemi sırasında yetki hatası oluştu.");
      }
    }
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h2 style={{ color: '#004170', marginBottom: '20px' }}>Yönetici Girişi</h2>
        <button onClick={handleGoogleLogin} style={{ backgroundColor: '#4285F4', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
          🌐 Google ile Giriş Yap
        </button>
      </div>
    );
  }

  if (user && user.email !== adminEmail) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h2 style={{ color: '#b91c1c', marginBottom: '20px' }}>⚠️ Yetkisiz Erişim</h2>
        <p>Giriş yapılan hesap: `{user.email}`</p>
        <button onClick={handleLogout} style={{ backgroundColor: '#475569', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Çıkış Yap</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', textAlign: 'left' }}>
      {/* EKLEME FORMU */}
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #10b981', paddingBottom: '10px', marginBottom: '30px' }}>
          <h2 style={{ color: '#004170', margin: 0 }}>Yeni Eğitim Materyali Ekle</h2>
          <button onClick={handleLogout} style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Güvenli Çıkış</button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Makale / Sunum Başlığı</label>
            <input type="text" required onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Eğitim Türü</label>
              <select onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                <option value="Halk Eğitimi">Halk Eğitimi</option>
                <option value="Hizmet İçi Eğitim">Hizmet İçi Eğitim</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Ana Konu</label>
              <select onChange={e => setTopic(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                <option value="">-- Konu Seçin --</option>
                <option value="Sağlık Okuryazarlığı">Sağlık Okuryazarlığı</option>
                <option value="Salgın Yönetimi">Salgın Yönetimi</option>
                <option value="İlk Yardım">İlk Yardım</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Farklı Bir Konu Ekle</label>
            <input type="text" onChange={e => setCustomTopic(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Eğitim Metni (Markdown ve Tablo Girişi Yapabilirsiniz)</label>
            <textarea rows="10" required onChange={e => setContent(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}></textarea>
          </div>

          <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '8px', border: '1px dashed #10b981' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>📥 Sunum Yükle (PDF)</label>
            <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])} />
          </div>

          <button type="submit" disabled={uploading} style={{ backgroundColor: uploading ? '#94a3b8' : '#004170', color: 'white', padding: '15px', border: 'none', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            {uploading ? 'Yükleniyor...' : 'Sisteme Yükle ve Yayınla'}
          </button>
        </form>
      </div>

      {/* İÇERİK YÖNETİM PANELİ (SİLME ALANI) */}
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#004170', borderBottom: '2px solid #ef4444', paddingBottom: '10px', marginTop: 0, marginBottom: '20px' }}>📁 Mevcut Yayınları Yönet</h3>
        {articles.length === 0 ? (
          <p style={{ color: '#64748b' }}>Sistemde henüz yayınlanmış materyal bulunmuyor.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {articles.map(art => (
              <div key={art.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
                <div>
                  <h4 style={{ margin: 0, color: '#004170' }}>{art.title}</h4>
                  <span style={{ fontSize: '12px', color: '#64748b', marginRight: '10px' }}>{art.category}</span>
                  <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>{art.topic}</span>
                </div>
                <button onClick={() => handleDelete(art.id)} style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  🗑️ Yayından Kaldır
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}