import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { signInWithRedirect, GoogleAuthProvider, onAuthStateChanged, signOut, getRedirectResult } from 'firebase/auth'; // getRedirectResult eklendi
import { uploadToCloudinary } from '../services/cloudinary';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  
  // Form State'leri
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Halk Eğitimi');
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Galeri State'leri
  const [gallery, setGallery] = useState([]); 
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryTag, setGalleryTag] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Düzenleme (Edit) State'leri
  const [editingId, setEditingId] = useState(null);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(''); 
  const [currentImageUrl, setCurrentImageUrl] = useState(''); 

  // KENDİ YETKİLİ ADRESİNİ YAZ
  const adminEmail = "mgulaydr@gmail.com";

  useEffect(() => {
    // Yönlendirme dönüşünü yakala ve girişi tamamla
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log("Giriş başarılı:", result.user);
        }
      })
      .catch((error) => {
        console.error("Yönlendirme hatası:", error);
      });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === adminEmail) fetchArticles();
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

  const handleAddGalleryImage = async () => {
    if (!galleryFile) return alert("Lütfen bir görsel seçin!");
    setUploadingGallery(true);
    try {
      const url = await uploadToCloudinary(galleryFile);
      setGallery([...gallery, { url, tag: galleryTag || 'Genel' }]);
      setGalleryFile(null);
      setGalleryTag('');
      document.getElementById('galleryInput').value = '';
    } catch (error) {
      alert("Galeriye görsel yüklenirken hata oluştu.");
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index) => {
    const newGallery = [...gallery];
    newGallery.splice(index, 1);
    setGallery(newGallery);
  };

  const handleEditSelect = (art) => {
    setEditingId(art.id);
    setTitle(art.title || '');
    setContent(art.content || '');
    setCategory(art.category || 'Halk Eğitimi');
    setTopic(art.topic || '');
    setCustomTopic('');
    setCurrentPdfUrl(art.pdfUrl || '');
    setCurrentImageUrl(art.imageUrl || ''); 
    setGallery(art.gallery || []);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null); setTitle(''); setContent(''); setCategory('Halk Eğitimi');
    setTopic(''); setCustomTopic(''); setPdfFile(null); setImageFile(null);
    setCurrentPdfUrl(''); setCurrentImageUrl(''); setGallery([]); setGalleryTag('');
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try { await signInWithRedirect(auth, provider); } catch (error) { alert("Giriş başlatılamadı."); }
  };

  const handleLogout = () => { signOut(auth); };

  const handleSave = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let uploadedPdfUrl = currentPdfUrl;
      let uploadedImageUrl = currentImageUrl;

      if (pdfFile) uploadedPdfUrl = await uploadToCloudinary(pdfFile);
      if (imageFile) uploadedImageUrl = await uploadToCloudinary(imageFile);
      
      const articleData = {
        title, content, category, topic: customTopic || topic || 'Genel',
        pdfUrl: uploadedPdfUrl, imageUrl: uploadedImageUrl,
        gallery: gallery,
        updatedAt: new Date()
      };

      if (editingId) {
        await updateDoc(doc(db, "articles", editingId), articleData);
        alert("İçerik başarıyla güncellendi!");
      } else {
        await addDoc(collection(db, "articles"), { ...articleData, createdAt: new Date() });
        alert("İçerik başarıyla yayınlandı!");
      }

      handleCancelEdit(); fetchArticles(); 
    } catch (error) {
      alert("İşlem sırasında hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu materyali silmek istediğinize emin misiniz?")) {
      try {
        await deleteDoc(doc(db, "articles", id));
        if(editingId === id) handleCancelEdit();
        fetchArticles(); 
      } catch (error) { alert("Silme işlemi başarısız."); }
    }
  };

  if (!user || user.email !== adminEmail) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', backgroundColor: 'white', padding: '40px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#004170', marginBottom: '20px' }}>Yönetici Girişi</h2>
        {!user ? (
          <button onClick={handleGoogleLogin} style={{ backgroundColor: '#4285F4', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', width: '100%', fontSize: '16px' }}>🌐 Google ile Giriş Yap</button>
        ) : (
          <div>
            <p style={{ color: '#b91c1c', marginBottom: '20px' }}>⚠️ Yetkisiz Erişim ({user.email})</p>
            <button onClick={handleLogout} style={{ backgroundColor: '#475569', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Çıkış Yap</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', textAlign: 'left' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #10b981', paddingBottom: '10px', marginBottom: '30px' }}>
          <h2 style={{ color: '#004170', margin: 0 }}>{editingId ? '📝 Eğitim Materyalini Düzenle' : 'Yeni Eğitim Materyali Ekle'}</h2>
          <button onClick={handleLogout} style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Güvenli Çıkış</button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Makale / Sunum Başlığı</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
          </div>

          {/* HEM EĞİTİM TÜRÜ HEM ANA KONU BURADA YAN YANA DURUYOR */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Eğitim Türü</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                <option value="Halk Eğitimi">Halk Eğitimi</option>
                <option value="Hizmet İçi Eğitim">Hizmet İçi Eğitim</option>
                <option value="Okul Eğitimleri">Okul Eğitimleri</option>
                <option value="Sunumlar & İnfografikler">Sunumlar & İnfografikler</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Ana Konu</label>
              <select value={topic} onChange={e => setTopic(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                <option value="">-- Konu Seçin --</option>
                <option value="Sağlık Okuryazarlığı">Sağlık Okuryazarlığı</option>
                <option value="Salgın Yönetimi">Salgın Yönetimi</option>
                <option value="İlk Yardım">İlk Yardım</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Farklı Bir Konu Ekle</label>
            <input type="text" value={customTopic} onChange={e => setCustomTopic(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Eğitim Metni</label>
            <textarea rows="10" required value={content} onChange={e => setContent(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}></textarea>
          </div>

          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '15px', color: '#0f172a' }}>🎨 Makale İçi Görsel Galerisi & İnfografikler</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
              <input type="file" id="galleryInput" accept="image/*" onChange={e => setGalleryFile(e.target.files[0])} style={{ flex: 1 }} />
              <input type="text" placeholder="Etiket (Örn: Diyabet, İlkyardım)" value={galleryTag} onChange={e => setGalleryTag(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', width: '200px' }} />
              <button type="button" onClick={handleAddGalleryImage} disabled={uploadingGallery} style={{ backgroundColor: '#0ea5e9', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                {uploadingGallery ? 'Yükleniyor...' : '+ Ekle'}
              </button>
            </div>

            {gallery.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '15px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                {gallery.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '120px', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                    <img src={img.url} alt="gallery" style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                    <div style={{ backgroundColor: '#0f172a', color: 'white', fontSize: '11px', padding: '4px', textAlign: 'center' }}>🏷️ {img.tag}</div>
                    <button type="button" onClick={() => removeGalleryImage(idx)} style={{ position: 'absolute', top: '2px', right: '2px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px' }}>X</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ backgroundColor: '#eff6ff', padding: '20px', borderRadius: '8px', border: '1px dashed #3b82f6' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#1e3a8a' }}>🖼️ Öne Çıkan Görsel Yükle (Kart Görseli)</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ width: '100%' }} />
          </div>

          <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '8px', border: '1px dashed #10b981' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#14532d' }}>📥 Sunum Yükle (PDF)</label>
            <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])} style={{ width: '100%' }} />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button type="submit" disabled={uploading} style={{ flex: 1, backgroundColor: uploading ? '#94a3b8' : (editingId ? '#10b981' : '#004170'), color: 'white', padding: '15px', border: 'none', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
              {uploading ? 'Yükleniyor...' : (editingId ? 'Değişiklikleri Kaydet' : 'Sisteme Yükle ve Yayınla')}
            </button>
            {editingId && <button type="button" onClick={handleCancelEdit} style={{ backgroundColor: '#64748b', color: 'white', padding: '15px 25px', border: 'none', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>Vazgeç</button>}
          </div>
        </form>
      </div>

      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#004170', borderBottom: '2px solid #3b82f6', paddingBottom: '10px', marginTop: 0, marginBottom: '20px' }}>📁 Mevcut Yayınları Yönet</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {articles.map(art => (
            <div key={art.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
              <div>
                <h4 style={{ margin: 0, color: '#004170' }}>{art.title}</h4>
                <span style={{ fontSize: '12px', color: '#64748b', marginRight: '10px' }}>{art.category}</span>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>{art.topic}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEditSelect(art)} style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>✏️ Düzenle</button>
                <button onClick={() => handleDelete(art.id)} style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>🗑️ Kaldır</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}