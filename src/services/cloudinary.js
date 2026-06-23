export const uploadToCloudinary = async (file) => {
    const cloudName = "dnz1jxdqm";
    const uploadPreset = "icerik_kutuphanesi"; // Önceki projelerdeki preset
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData
        });
        if (!response.ok) throw new Error("Yükleme hatası oluştu.");
        const data = await response.json();
        return data.secure_url; // Cloudinary'den dönen güvenli bağlantı
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};