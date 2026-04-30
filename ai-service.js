// ai-service.js
// Fungsi utama pemanggil Gemini AI untuk DysCare

// ── Helper utama ──────────────────────────────────────────────────────
async function callGemini(systemPrompt, userPrompt, maxTokens = 300) {
  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [{
          role: "user",
          parts: [{ text: userPrompt }]
        }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.8,
          topP: 0.9
        }
      })
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("DysCare Gemini error:", err);
      return null;
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? null;

  } catch (e) {
    console.error("DysCare: Gagal memanggil Gemini:", e);
    return null;
  }
}

// ── Fitur 1: Cerita AI (Modul Membaca) ───────────────────────────────
async function generateCeritaAI(levelData, nomorSesi) {

  const systemPrompt = `Kamu adalah generator teks bacaan untuk anak 
disleksia usia 6–12 tahun yang belajar membaca melalui platform DYSCARE. 
Tugasmu menghasilkan teks bacaan pendek sesuai level membaca anak.

Aturan wajib:
- Gunakan HANYA kata sesuai pola fonologi level yang diminta
- Kalimat maksimal 5–7 kata
- Tema kehidupan sehari-hari anak Indonesia
- JANGAN gunakan tanda baca selain titik dan koma
- Buat cerita berbeda dari sesi sebelumnya
- Output HANYA teks cerita saja tanpa judul atau penjelasan`;

  const userPrompt = `Buat teks bacaan untuk anak disleksia:

Level aktif: ${levelData.level} — ${levelData.namaLevel}
Pola kata yang dilatih: ${levelData.polaKata}
Contoh kata yang boleh digunakan: ${levelData.daftarKata}
Panjang teks: ${levelData.panjang}
Nomor sesi: ${nomorSesi}
Tema hari ini: ${levelData.tema}

Hasilkan teks bacaan sekarang.`;

  const hasil = await callGemini(systemPrompt, userPrompt, 250);

  // Fallback kalau AI tidak merespons
  const fallback = {
    1: "Ini huruf a. Ini huruf i.",
    2: "Ba bi bu. Da di du. Ma mi mu.",
    3: "Budi punya bola. Bola Budi biru.",
    4: "Budi makan nasi. Ibu masak sayur.",
    5: "Budi pergi ke sekolah. Ibu mengantar Budi. Budi senang belajar.",
    6: "Budi dan Siti bermain di taman. Mereka menangkap kupu-kupu. Ibu menonton dari bangku taman."
  };

  return hasil ?? fallback[levelData.level] ?? fallback[5];
}

// ── Fitur 2: Saran Cerdas AI (Halaman Capaian) ───────────────────────
async function generateSaranCerdas(performaData) {

  const systemPrompt = `Kamu adalah asisten pembelajaran untuk guru 
dan orang tua anak disleksia yang menggunakan platform DYSCARE. 
Tugasmu menganalisis data performa belajar anak dan memberikan satu 
rekomendasi latihan yang spesifik dan praktis.

Aturan wajib:
- Gunakan bahasa Indonesia yang hangat dan positif
- Mulai dengan satu kalimat apresiasi terhadap progres anak
- Sebutkan aktivitas DYSCARE mana yang perlu diulang
- Maksimal 4 kalimat
- Output HANYA teks rekomendasi tanpa judul atau format apapun`;

  const userPrompt = `Data performa anak di DYSCARE:

Level aktif: ${performaData.level} — ${performaData.namaLevel}
Akurasi sesi terakhir: ${performaData.akurasi}%
Sesi lulus berturut-turut: ${performaData.sesiLulus} dari 3
Item paling sering salah: ${performaData.itemSalah}
Pola kesalahan: ${performaData.polaKesalahan}
Total sesi hari ini: ${performaData.totalSesi}

Berikan satu rekomendasi latihan yang spesifik dan memotivasi.`;

  const hasil = await callGemini(systemPrompt, userPrompt, 200);

  // Fallback kalau AI tidak merespons
  return hasil ?? `Anak sudah menunjukkan semangat belajar yang luar biasa hari ini! Area yang perlu diperkuat adalah ${performaData.itemSalah}. Coba ulangi latihan di Modul Mengeja pada level yang sama dengan fokus pada huruf tersebut. Lakukan 5 menit latihan tambahan sebelum sesi DYSCARE berikutnya.`;
}
