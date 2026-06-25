import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { uploadToCloudinary } from '../services/cloudinary';

export default function Admin() {
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [adminTab, setAdminTab] = useState('article'); 
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Form State'leri (Eğitim Materyali)
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Halk Eğitimi');
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Form State'leri (Aktivite Kartı)
  const [actTitle, setActTitle] = useState('');
  const [actArticleId, setActArticleId] = useState('none');
  const [actPurpose, setActPurpose] = useState('');
  const [actPrep, setActPrep] = useState('');
  const [actSteps, setActSteps] = useState('');
  const [actTag, setActTag] = useState('');
  const [editingActId, setEditingActId] = useState(null); // YENİ: Aktivite Düzenleme ID'si

  const [gallery, setGallery] = useState([]); 
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryTag, setGalleryTag] = useState('');
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(''); 
  const [currentImageUrl, setCurrentImageUrl] = useState(''); 

  const adminEmail = "mgulaydr@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === adminEmail) {
        fetchArticles();
        fetchActivities();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchArticles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "articles"));
      setArticles(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) { console.error(error); }
  };

  const fetchActivities = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "activities"));
      setActivities(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) { console.error(error); }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try { await signInWithEmailAndPassword(auth, loginEmail, loginPassword); } catch (error) { alert("Giriş başarısız."); }
  };

  // AKTİVİTE KARTINI KAYDETME VE GÜNCELLEME MOTORU
  const handleSaveActivity = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const relatedArt = articles.find(a => a.id === actArticleId);
      const articleTitle = relatedArt ? relatedArt.title : 'Bağımsız / Genel';

      const activityData = {
        title: actTitle,
        articleId: actArticleId,
        articleTitle: articleTitle,
        purpose: actPurpose,
        prepList: actPrep,
        steps: actSteps,
        tag: actTag || 'Genel',
        updatedAt: new Date()
      };

      if (editingActId) {
        await updateDoc(doc(db, "activities", editingActId), activityData);
        alert("Aktivite başarıyla güncellendi!");
      } else {
        await addDoc(collection(db, "activities"), { ...activityData, createdAt: new Date() });
        alert("Aktivite Kartı başarıyla eklendi!");
      }

      handleCancelActEdit();
      fetchActivities();
    } catch (error) {
      alert("Aktivite kaydedilirken hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  // YENİ: AKTİVİTE DÜZENLEME SEÇİMİ
  const handleEditActSelect = (act) => {
    setAdminTab('activity');
    setEditingActId(act.id);
    setActTitle(act.title || '');
    setActArticleId(act.articleId || 'none');
    setActPurpose(act.purpose || '');
    setActPrep(act.prepList || '');
    setActSteps(act.steps || '');
    setActTag(act.tag || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelActEdit = () => {
    setEditingActId(null);
    setActTitle(''); setActPurpose(''); setActPrep(''); setActSteps(''); setActTag(''); setActArticleId('none');
  };

  const handleAddGalleryImage = async () => {
    if (!galleryFile) return alert("Lütfen bir görsel seçin!");
    setUploadingGallery(true);
    try {
      const url = await uploadToCloudinary(galleryFile);
      setGallery([...gallery, { url, tag: galleryTag || 'Genel' }]);
      setGalleryFile(null); setGalleryTag('');
    } catch (error) { alert("Hata oluştu."); } finally { setUploadingGallery(false); }
  };

  const handleEditSelect = (art) => {
    setAdminTab('article');
    setEditingId(art.id);
    setTitle(art.title || ''); setContent(art.content || '');
    setCategory(art.category || 'Halk Eğitimi'); setTopic(art.topic || '');
    setCurrentPdfUrl(art.pdfUrl || ''); setCurrentImageUrl(art.imageUrl || ''); 
    setGallery(art.gallery || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null); setTitle(''); setContent(''); setCategory('Halk Eğitimi');
    setTopic(''); setCustomTopic(''); setPdfFile(null); setImageFile(null);
    setCurrentPdfUrl(''); setCurrentImageUrl(''); setGallery([]);
  };

  const handleDeleteArticle = async (id) => {
    if (window.confirm("Bu materyali silmek istediğinize emin misiniz?")) {
      await deleteDoc(doc(db, "articles", id)); fetchArticles();
    }
  };

  const handleDeleteActivity = async (id) => {
    if (window.confirm("Bu aktivite kartını silmek istediğinize emin misiniz?")) {
      await deleteDoc(doc(db, "activities", id)); fetchActivities();
      if(editingActId === id) handleCancelActEdit();
    }
  };

  if (!user || user.email !== adminEmail) {
    return (
      <div style={{ maxWidth: '400px', margin: '100px auto', backgroundColor: 'white', padding: '40px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h2>Yönetici Girişi</h2>
        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="E-Posta" required onChange={e => setLoginEmail(e.target.value)} style={{ padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
          <input type="password" placeholder="Şifre" required onChange={e => setLoginPassword(e.target.value)} style={{ padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
          <button type="submit" style={{ backgroundColor: '#0ea5e9', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Giriş Yap</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px', textAlign: 'left' }}>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => { setAdminTab('article'); handleCancelEdit(); }} style={{ flex: 1, padding: '15px', backgroundColor: adminTab === 'article' ? '#004170' : '#e2e8f0', color: adminTab === 'article' ? 'white' : '#475569', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>📄 Eğitim Materyali</button>
        <button onClick={() => { setAdminTab('activity'); handleCancelActEdit(); }} style={{ flex: 1, padding: '15px', backgroundColor: adminTab === 'activity' ? '#ea580c' : '#e2e8f0', color: adminTab === 'activity' ? 'white' : '#475569', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>🎲 Aktivite Kartı</button>
        <button onClick={() => signOut(auth)} style={{ backgroundColor: '#64748b', color: 'white', padding: '0 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Çıkış</button>
      </div>

      {adminTab === 'article' ? (
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h2 style={{ color: '#004170', marginTop: 0, marginBottom: '25px' }}>{editingId ? '📝 Materyali Düzenle' : 'Yeni Eğitim Materyali'}</h2>
          <form onSubmit={async (e) => {
            e.preventDefault(); setUploading(true);
            let pUrl = currentPdfUrl, iUrl = currentImageUrl;
            if (pdfFile) pUrl = await uploadToCloudinary(pdfFile);
            if (imageFile) iUrl = await uploadToCloudinary(imageFile);
            const data = { title, content, category, topic: customTopic || topic || 'Genel', pdfUrl: pUrl, imageUrl: iUrl, gallery, updatedAt: new Date() };
            if (editingId) { await updateDoc(doc(db, "articles", editingId), data); alert("Güncellendi!"); }
            else { await addDoc(collection(db, "articles"), { ...data, createdAt: new Date() }); alert("Eklendi!"); }
            handleCancelEdit(); fetchArticles(); setUploading(false);
          }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Başlık</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
            </div>
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
                  <option value="">-- Seçin --</option>
                  <option value="Sağlık Okuryazarlığı">Sağlık Okuryazarlığı</option>
                  <option value="Salgın Yönetimi">Salgın Yönetimi</option>
                  <option value="İlk Yardım">İlk Yardım</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Farklı Konu Adı</label>
              <input type="text" value={customTopic} onChange={e => setCustomTopic(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>İçerik Metni</label>
              <textarea rows="10" required value={content} onChange={e => setContent(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}></textarea>
            </div>
            <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>🎨 Galeriye Resim Ekle</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="file" accept="image/*" onChange={e => setGalleryFile(e.target.files[0])} />
                <input type="text" placeholder="Etiket" value={galleryTag} onChange={e => setGalleryTag(e.target.value)} style={{ padding: '6px' }} />
                <button type="button" onClick={handleAddGalleryImage}>{uploadingGallery ? '...' : 'Ekle'}</button>
              </div>
            </div>
            <div style={{ backgroundColor: '#eff6ff', padding: '15px', borderRadius: '6px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>🖼️ Kart Öne Çıkan Görseli</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
            </div>
            <div style={{ backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '6px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>📥 PDF Sunum Belgesi</label>
              <input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files[0])} />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button type="submit" disabled={uploading} style={{ flex: 1, backgroundColor: '#004170', color: 'white', padding: '15px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>{uploading ? 'Yükleniyor...' : 'Kaydet ve Yayınla'}</button>
              {editingId && <button type="button" onClick={handleCancelEdit} style={{ backgroundColor: '#64748b', color: 'white', padding: '15px 25px', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Vazgeç</button>}
            </div>
          </form>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderTop: '4px solid #ea580c' }}>
          <h2 style={{ color: '#ea580c', marginTop: 0, marginBottom: '25px' }}>{editingActId ? '🎲 Aktivite Kartını Düzenle' : '🎲 Yeni Aktivite Kartı Oluştur'}</h2>
          <form onSubmit={handleSaveActivity} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Aktivite / Oyun Adı</label>
              <input type="text" required value={actTitle} onChange={e => setActTitle(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>İlişkili Eğitim / Makale</label>
                <select value={actArticleId} onChange={e => setActArticleId(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                  <option value="none">-- Hiçbiri / Bağımsız Genel Aktivite --</option>
                  {articles.map(art => (
                    <option key={art.id} value={art.id}>{art.title} ({art.category})</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Bağlam / Süzme Etiketi</label>
                <input type="text" placeholder="Örn: Isınma Egzersizi" value={actTag} onChange={e => setActTag(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Aktivitenin Amacı</label>
              <input type="text" required value={actPurpose} onChange={e => setActPurpose(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Ön Hazırlık Listesi</label>
              <textarea rows="5" required value={actPrep} onChange={e => setActPrep(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}></textarea>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Adım Adım Uygulama Rehberi</label>
              <textarea rows="8" required value={actSteps} onChange={e => setActSteps(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}></textarea>
            </div>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button type="submit" disabled={uploading} style={{ flex: 1, backgroundColor: '#ea580c', color: 'white', padding: '15px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>{uploading ? 'Yükleniyor...' : (editingActId ? 'Değişiklikleri Kaydet' : '🎲 Aktivite Kartını Yayınla')}</button>
              {editingActId && <button type="button" onClick={handleCancelActEdit} style={{ backgroundColor: '#64748b', color: 'white', padding: '15px 25px', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Vazgeç</button>}
            </div>
          </form>
        </div>
      )}

      {/* YÖNETİM ALANI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#004170', borderBottom: '2px solid #3b82f6', paddingBottom: '8px', marginTop: 0 }}>📄 Materyalleri Yönet</h3>
          {articles.map(art => (
            <div key={art.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{art.title.substring(0,30)}...</span>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={() => handleEditSelect(art)} style={{ fontSize: '12px', padding: '4px' }}>✏️</button>
                <button onClick={() => handleDeleteArticle(art.id)} style={{ fontSize: '12px', padding: '4px', color: 'red' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#ea580c', borderBottom: '2px solid #f97316', paddingBottom: '8px', marginTop: 0 }}>🎲 Aktivite Kartlarını Yönet</h3>
          {activities.map(act => (
            <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#9a3412' }}>{act.title.substring(0,30)}...</span>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={() => handleEditActSelect(act)} style={{ fontSize: '12px', padding: '4px 8px', color: '#0369a1', border: '1px solid #bae6fd', backgroundColor: '#e0f2fe', borderRadius: '4px', cursor: 'pointer' }}>✏️ Düzenle</button>
                <button onClick={() => handleDeleteActivity(act.id)} style={{ fontSize: '12px', padding: '4px 8px', color: 'red', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', borderRadius: '4px', cursor: 'pointer' }}>🗑️ Sil</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}