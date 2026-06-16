# RDP (Requirements-Driven Prompting) - DYSCARE v3

> Setiap prompt di dokumen ini langsung berakar pada satu atau lebih requirement di SDD.md. Jangan jalankan prompt tanpa membaca requirement terkait di SDD.md terlebih dahulu, karena prompt ditulis ringkas dengan asumsi konteks SDD sudah dipahami oleh Claude Code (yang akan membaca CLAUDE.md dan SDD.md secara otomatis di awal sesi).

> Urutan eksekusi mengikuti Bagian 9 SDD.md. Jangan lompat urutan kecuali Anda memahami dependency-nya.

---

## CARA PAKAI

1. Pastikan SDD.md sudah ada di folder docs/ project ini, dan CLAUDE.md
   tetap ada di root project
2. Copy seluruh blok prompt yang relevan, paste ke chat Claude Code
3. Setiap prompt diawali instruksi membaca SDD.md bagian tertentu, jangan dihapus
4. Setelah satu prompt selesai dan diverifikasi, lanjut ke prompt berikutnya sesuai urutan
5. Jika Claude Code menemukan kondisi yang tidak sesuai deskripsi di SDD.md (misalnya file sudah diubah sejak audit), instruksikan Claude Code untuk berhenti dan melaporkan perbedaan tersebut sebelum melanjutkan

---

## PROMPT 0: VERIFIKASI KONDISI AWAL

Jalankan ini pertama kali untuk memastikan kondisi kode masih sesuai dengan asumsi SDD.md sebelum mengeksekusi prompt manapun.

```
Baca CLAUDE.md dan SDD.md di root project secara lengkap.

SDD.md berisi audit kondisi kode per Juni 2026. Tugas Anda sekarang adalah
memverifikasi apakah kondisi "Kondisi Saat Ini" yang dijelaskan di setiap
bagian SDD.md (Bagian 2 sampai 8) masih akurat dengan membaca file-file
berikut:

- index.html
- ai-config.js
- ai-service.js
- js/config.js
- js/ai.js
- js/state.js
- js/level.js
- js/reading.js
- js/spelling.js
- js/utils.js
- js/progress.js
- js/assessment.js

Untuk setiap REQ-ID di SDD.md (REQ-AI-01, REQ-AI-02, REQ-LVL-02, REQ-LVL-03,
REQ-LVL-04, REQ-HL-01, REQ-PROG-01, REQ-ASMT-01, REQ-SEC-01, REQ-DATA-01,
REQ-DATA-02), laporkan dalam format:

REQ-ID: [SESUAI / TIDAK SESUAI / SUDAH DIPERBAIKI SEBAGIAN]
Catatan: [jelaskan jika ada perbedaan dengan deskripsi SDD.md]

JANGAN melakukan perubahan kode apapun di tahap ini, hanya verifikasi dan
laporan. Jika ada REQ yang statusnya TIDAK SESUAI atau SUDAH DIPERBAIKI
SEBAGIAN, jelaskan secara spesifik apa yang sudah berbeda sebelum saya
memutuskan prompt mana yang masih relevan untuk dijalankan.
```

---

## PROMPT 1: UNIFIKASI KONFIGURASI AI

**Berakar pada**: REQ-AI-01, REQ-AI-02 (SDD.md Bagian 2)

```
Baca SDD.md Bagian 2 (REQ-AI-01 dan REQ-AI-02) secara lengkap sebelum
mengerjakan apapun. Bagian ini menjelaskan dua jalur konfigurasi AI yang
berjalan paralel dan tidak konsisten.

TUJUAN: Satu sumber API key, dipakai konsisten oleh seluruh fitur AI.

KEPUTUSAN ARSITEKTUR (sudah final, jangan diubah):
Pola meta tag (seperti di ai-config.js, membaca dari
<meta name="dyscare-ai-key"> di index.html) dipertahankan sebagai sumber
key tunggal. js/config.js dan js/ai.js direfaktor untuk membaca dari
sumber yang sama.

TUGAS:

1. File js/config.js:
   - Hapus baris `const API_KEY = "";`
   - Tambahkan pembacaan key dari meta tag, persis seperti pola di
     ai-config.js:
     ```javascript
     const API_KEY = document
       .querySelector('meta[name="dyscare-ai-key"]')
       ?.getAttribute("content") ?? "";
     ```
   - Tambahkan validasi yang sama seperti ai-config.js: jika API_KEY kosong,
     console.warn dengan pesan yang jelas

2. File js/ai.js:
   - Pastikan TEXT_API_URL, IMAGE_API_URL, VISION_API_URL tetap menggunakan
     model yang sudah ditetapkan di CLAUDE.md sebagai constraint:
     gemini-2.5-flash-preview-09-2025 untuk text/vision,
     imagen-4.0-generate-001 untuk image
   - JANGAN UBAH model ini tanpa konfirmasi terpisah, sesuai aturan
     CLAUDE.md "JANGAN MENGUBAH API endpoint atau model Gemini tanpa
     konfirmasi"
   - Tambahkan penanganan error yang lebih baik di generateImage(): jika
     API_KEY kosong di awal pemanggilan, log peringatan yang jelas ke
     console SEBELUM melakukan fetch, bukan menunggu response gagal

3. File ai-service.js:
   - ai-service.js sudah memakai pola meta tag dengan benar via
     ai-config.js, TIDAK perlu diubah strukturnya
   - Periksa apakah model gemini-flash-lite-latest yang dipakai di sini
     adalah keputusan yang disengaja (model ringan untuk fitur Cerita AI
     dan Saran Cerdas yang dipanggil lebih sering) ATAU inkonsistensi yang
     perlu diselaraskan dengan js/ai.js
   - JANGAN ubah model di ai-service.js. Cukup tambahkan komentar di bagian
     atas file yang menjelaskan mengapa model ini berbeda dari js/ai.js,
     berdasarkan pertimbangan biaya/latency untuk fitur yang dipanggil
     frekuen (Cerita AI setiap kali tombol "Cerita AI" diklik, Saran Cerdas
     setiap kali tombol "Saran Cerdas" diklik)

4. Cek urutan loading script di index.html:
   - Pastikan ai-config.js dan js/config.js TIDAK saling bertentangan
     (keduanya akan membaca meta tag yang sama, ini OK karena keduanya
     hanya membaca, tidak menulis)
   - JANGAN ubah urutan loading script tanpa pemahaman penuh sesuai aturan
     CLAUDE.md

ATURAN:
- JANGAN MENGHAPUS KODE LAMA kecuali eksplisit diminta di atas
- Setiap fungsi yang diubah harus tetap punya komentar JSDoc

VERIFIKASI:
1. Buka Console DevTools, pastikan tidak ada pesan "API Key belum diatur"
   ketika meta tag terisi
2. Buka spelling-screen, klik "Buat Gambar & Kata" beberapa kali, pastikan
   tidak selalu fallback ke emoji (jika key valid dan quota tersedia)
3. Jalankan grep berikut dan pastikan hanya ada SATU definisi pembacaan
   meta tag dyscare-ai-key:
   grep -rn "dyscare-ai-key" --include="*.js" --include="*.html" .
4. Laporkan hasil verifikasi di atas ke saya secara tertulis, termasuk
   apakah generateImage() berhasil menghasilkan gambar non-emoji minimal
   sekali dalam pengujian
```

---

## PROMPT 2: DATASET KONTEN 6 LEVEL - MODUL MEMBACA

**Berakar pada**: REQ-DATA-01 (SDD.md Bagian 4)

```
Baca SDD.md Bagian 4 (REQ-LVL-02, REQ-DATA-01, REQ-DATA-02) secara lengkap,
fokus pada tabel "Modul Membaca: sentencesL1 sampai sentencesL6".

TUJUAN: Membuat dataset kalimat statis untuk 6 level Modul Membaca sebagai
fallback ketika AI generatif tidak tersedia, dan sebagai sumber konten yang
benar-benar berbeda secara substansial per level (saat ini level 1-2, 3-4,
5-6 menampilkan konten identik karena pemetaan 3-tier).

TUGAS:

1. File js/state.js, di dalam object `reading`, tambahkan enam array baru:
   sentencesL1 sampai sentencesL6, sesuai spesifikasi tabel SDD.md Bagian 4:

   - sentencesL1 (Pengenalan Huruf): minimal 8 entri, huruf vokal/konsonan
     terpisah dengan spasi, format seperti "a i u", "b a c a", "m a m a"
   - sentencesL2 (Kesadaran Fonologis): minimal 8 entri, suku kata terbuka
     KV, format seperti "ba bi bu", "ka ki ku"
   - sentencesL3 (Blending menjadi Kata): minimal 10 entri, kata 2 suku
     kata KV-KV seperti "ibu", "buku", "meja", "topi", "kuda", "roti"
   - sentencesL4 (Pengenalan Kata Kompleks): minimal 10 entri, kata 3+
     suku kata atau KVK seperti "sepatu", "pelangi", "kacamata", "mainan",
     "sekolah", "matahari"
   - sentencesL5 (Frasa dan Kalimat Pendek): minimal 10 entri, frasa 2-3
     kata bermakna seperti "ibu masak", "adik main bola", "kakak sekolah"
   - sentencesL6 (Kalimat Utuh SPOK): minimal 10 entri, kalimat 4-6 kata
     struktur lengkap seperti "ibu memasak nasi di dapur", "adik bermain
     bola di halaman"

2. PRINSIP PENYUSUNAN (wajib dipatuhi untuk setiap entri):
   - Bahasa Indonesia, kosakata familiar anak SD kelas 1-3
   - HINDARI kata dengan huruf b, d, p, q berdekatan di Level 1 dan 2
     (anak disleksia rawan letter reversal pada pasangan huruf ini)
   - Mulai dari kata frekuensi tinggi (sight words bahasa Indonesia)
   - Tema sehari-hari: keluarga, hewan, makanan, sekolah, mainan
   - Konten harus selaras dengan tema di dataPerLevel (js/reading.js):
     Level 1 tema hewan, Level 2 tema keluarga, Level 3 tema sekolah,
     Level 4 tema bermain, Level 5 tema makanan, Level 6 tema kegiatan
     sehari-hari

3. Tambahkan komentar JSDoc di atas setiap array level yang menjelaskan:
   - Sub-keterampilan yang dilatih (mengacu pada nama level di
     LEVEL_CONFIG.LABELS di js/config.js)
   - Referensi ke Simple View of Reading (Gough & Tunmer, 1986) sebagai
     dasar hierarki

4. PERTAHANKAN struktur lama (sentencesEasy, sentencesMedium, sentencesHard)
   di state.js, tetapi tambahkan komentar di atasnya:
   "DEPRECATED: dipertahankan untuk kompatibilitas, tidak lagi dirujuk oleh
   getReadingSentencesByLevel(). Lihat sentencesL1-L6. Referensi SDD.md
   REQ-LVL-02."

ATURAN:
- JANGAN refactor getReadingSentencesByLevel() di prompt ini, itu adalah
  PROMPT 4 berikutnya
- JANGAN hapus sentencesEasy/Medium/Hard

VERIFIKASI:
1. Buka Console: Object.keys(appState.reading) harus menyertakan
   sentencesL1 sampai sentencesL6
2. Hitung panjang setiap array, pastikan memenuhi jumlah minimum di tabel
   SDD.md Bagian 4
3. Verifikasi manual: scan setiap entri sentencesL1 dan sentencesL2, pastikan
   tidak ada kata yang mengandung kombinasi b/d atau p/q berdekatan
4. Laporkan jumlah entri per level dan hasil verifikasi manual ke saya
```

---

## PROMPT 3: DATASET KONTEN 6 LEVEL - MODUL MENGEJA

**Berakar pada**: REQ-DATA-02 (SDD.md Bagian 4)

```
Baca SDD.md Bagian 4 (REQ-DATA-02) secara lengkap, fokus pada tabel
"Modul Mengeja: wordsL1 sampai wordsL6" dan struktur objek yang disyaratkan.

TUJUAN: Membuat dataset kata untuk 6 level Modul Mengeja dengan struktur
objek yang konsisten, termasuk imagePrompt untuk Imagen API.

TUGAS:

1. File js/state.js, di dalam object `spelling`, tambahkan enam array baru:
   wordsL1 sampai wordsL6, sesuai spesifikasi tabel SDD.md Bagian 4. Setiap
   entri WAJIB memiliki struktur:

   ```javascript
   {
       word: "string",          // kata target, lowercase, Bahasa Indonesia
       imagePrompt: "string",   // prompt Imagen, BAHASA INGGRIS
       fallbackEmoji: "emoji",  // fallback jika AI image gagal
       phonetic: "string",      // opsional
       category: "string"       // opsional, kategori tema
   }
   ```

   Spesifikasi per level:
   - wordsL1: minimal 5 entri, kata 2 huruf sangat sederhana (contoh: "ya")
   - wordsL2: minimal 6 entri, kata 3 huruf pola KV-V atau V-KV (contoh:
     ibu, api, air, ulu, iya)
   - wordsL3: minimal 8 entri, kata 4 huruf pola KV-KV (contoh: apel, buku,
     ikan, meja, susu)
   - wordsL4: minimal 8 entri, kata 5 huruf (contoh: pisang, gajah, kursi,
     balon, mobil, pensil)
   - wordsL5: minimal 8 entri, kata 6 huruf (contoh: sepatu, jendela,
     bintang, boneka, gunung)
   - wordsL6: minimal 6 entri, kata 7+ huruf (contoh: kacamata, pelangi,
     kupukupu, matahari, sekolahan)

2. ATURAN imagePrompt:
   - HARUS dalam Bahasa Inggris (Imagen lebih akurat dengan prompt Inggris,
     sesuai catatan DEVELOPMENT_PROMPTS.md Prompt 7)
   - Deskriptif dan spesifik, contoh: "a red apple, simple cartoon
     illustration, white background" bukan sekadar "apple"
   - Konsisten gaya "simple cartoon illustration" di seluruh entri agar
     hasil Imagen visual konsisten

3. ATURAN word dan fallbackEmoji:
   - HINDARI kata dengan huruf b, d, p, q berdekatan di wordsL1 dan wordsL2
   - fallbackEmoji harus benar-benar merepresentasikan kata (cek di
     https://emojipedia.org jika ragu tentang ketersediaan emoji)
   - Setiap kata HARUS bisa diilustrasikan secara konkret (hindari kata
     abstrak)
   - Gunakan kata yang relevan dengan kehidupan anak Indonesia

4. Tambahkan komentar JSDoc di atas setiap array level yang menjelaskan
   sub-keterampilan yang dilatih dan referensi Bab III proposal

5. PERTAHANKAN struktur lama (wordsEasy, wordsMedium, wordsHard) dengan
   komentar "DEPRECATED" yang sama seperti pada PROMPT 2 untuk
   sentencesEasy/Medium/Hard

ATURAN:
- JANGAN refactor getSpellingWordsByLevel() di prompt ini, itu adalah
  PROMPT 4 berikutnya
- JANGAN hapus wordsEasy/Medium/Hard

VERIFIKASI:
1. Buka Console: Object.keys(appState.spelling) harus menyertakan wordsL1
   sampai wordsL6
2. Untuk setiap level, verifikasi setiap entri memiliki field word,
   imagePrompt, dan fallbackEmoji (tidak ada yang undefined)
3. Verifikasi manual: scan wordsL1 dan wordsL2, pastikan tidak ada kata
   dengan kombinasi b/d atau p/q berdekatan
4. Laporkan jumlah entri per level dan hasil verifikasi ke saya
```

---

## PROMPT 4: REFACTOR FUNGSI PENGAMBIL KONTEN PER LEVEL

**Berakar pada**: REQ-LVL-02 (SDD.md Bagian 4), dijalankan SETELAH Prompt 2 dan 3 selesai

```
Baca SDD.md Bagian 4, bagian "Refaktor getReadingSentencesByLevel() dan
getSpellingWordsByLevel()". PASTIKAN Prompt 2 dan Prompt 3 sebelumnya sudah
dieksekusi dan sentencesL1-L6 serta wordsL1-L6 sudah tersedia di state.js
sebelum melanjutkan. Jika belum tersedia, BERHENTI dan laporkan ke saya.

TUJUAN: Mengganti pemetaan 3-tier (Easy/Medium/Hard) dengan pemetaan
langsung 1-ke-1 dari currentLevel ke dataset L1-L6.

TUGAS:

1. File js/level.js, ganti implementasi getReadingSentencesByLevel():

   ```javascript
   /**
    * Ambil pool kalimat membaca sesuai level saat ini (1-6).
    *
    * Setiap level memiliki dataset terpisah (sentencesL1-L6) yang berbeda
    * secara substansial, sesuai Task Analysis Bab III proposal berbasis
    * Simple View of Reading (Gough & Tunmer, 1986).
    *
    * @returns {string[]}
    */
   function getReadingSentencesByLevel() {
       const key = `sentencesL${appState.currentLevel}`;
       return appState.reading[key] || appState.reading.sentencesL1;
   }
   ```

2. File js/level.js, ganti implementasi getSpellingWordsByLevel() dengan
   pola yang sama menggunakan wordsL{currentLevel}, fallback ke wordsL1

3. File js/level.js, fungsi getMathProblemsByLevel() TIDAK diubah (modul
   math di-hide, dipertahankan untuk future development sesuai aturan
   CLAUDE.md)

4. Tambahkan komentar JSDoc yang menjelaskan perubahan dari sistem 3-tier
   ke sistem 6-level langsung, dengan referensi ke SDD.md REQ-LVL-02

ATURAN:
- JANGAN ubah signature fungsi (nama fungsi dan return type tetap sama),
  agar pemanggil di reading.js dan spelling.js tidak perlu diubah
- JANGAN hapus sentencesEasy/Medium/Hard atau wordsEasy/Medium/Hard, biarkan
  sebagai legacy field yang sudah diberi komentar DEPRECATED di Prompt 2/3

VERIFIKASI:
1. Buka Console, set appState.currentLevel = 1, panggil
   getReadingSentencesByLevel(), pastikan hasilnya adalah sentencesL1
2. Ulangi untuk currentLevel 2 sampai 6, pastikan setiap level mengembalikan
   array yang BERBEDA (bandingkan isi array, bukan hanya panjang)
3. Lakukan hal yang sama untuk getSpellingWordsByLevel() dan wordsL1-L6
4. Navigasi ke reading-screen pada level 1, catat kalimat yang muncul,
   ganti currentLevel ke 4 via Console lalu reload reading-screen, pastikan
   kalimat yang muncul berbeda dan sesuai tema wordsL4/sentencesL4
5. Laporkan hasil pengujian per level ke saya
```

---

## PROMPT 5: WORD HIGHLIGHTING DI MODUL MEMBACA

**Berakar pada**: REQ-HL-01 (SDD.md Bagian 6)

```
Baca SDD.md Bagian 6 (REQ-HL-01) secara lengkap, termasuk catatan teknis
tentang dukungan browser yang tidak konsisten untuk SpeechSynthesisUtterance
onboundary.

TUJUAN: Saat tombol Dengar ditekan di reading-screen, kata yang sedang
dibacakan TTS mendapat highlight visual (.highlight-word), sinkron dengan
audio, lalu highlight terhapus saat kata berikutnya dimulai dan saat TTS
selesai.

TUGAS:

1. File js/reading.js, fungsi loadReadingContent(), ubah rendering kalimat
   agar setiap span kata memiliki id unik:

   ```javascript
   contentArea.innerHTML = appState.reading.currentSentence
       .split(' ')
       .map((w, i) => `<span id="word-${i}">${w}</span>`)
       .join(' ');
   ```

2. File js/utils.js, tambahkan fungsi baru speakTextWithHighlight() yang
   TIDAK mengubah signature speakText() yang sudah ada (agar pemanggil lain
   seperti assessment.js dan spelling.js tidak terdampak):

   ```javascript
   /**
    * Bacakan teks dengan TTS sambil menyorot kata yang sedang dibacakan.
    *
    * Implementasi modalitas Visual + Auditory dalam pendekatan multisensori
    * VAKT (Birsh, 2018). Sinkronisasi visual-auditori ini disebut eksplisit
    * di storyboard Lampiran 1 proposal dan rubric ahli media butir 13.
    *
    * Catatan: event 'boundary' pada SpeechSynthesisUtterance memiliki
    * dukungan browser yang tidak konsisten. Jika boundary tidak terpicu,
    * TTS tetap berjalan normal tanpa highlight (graceful degradation).
    *
    * @param {string} text - teks yang dibacakan, sama dengan yang
    *                         ditampilkan di reading-content
    * @param {number} rate - kecepatan bicara
    */
   function speakTextWithHighlight(text, rate = 0.8) {
       // Hapus highlight dari pemanggilan sebelumnya jika ada
       document.querySelectorAll('.highlight-word').forEach(el =>
           el.classList.remove('highlight-word'));

       const words = text.split(' ');
       const utterance = new SpeechSynthesisUtterance(text);
       utterance.lang = 'id-ID';
       utterance.rate = rate;

       // Hitung posisi karakter awal setiap kata untuk pemetaan boundary
       const wordStartIndices = [];
       let pos = 0;
       words.forEach(w => {
           wordStartIndices.push(pos);
           pos += w.length + 1; // +1 untuk spasi
       });

       utterance.onboundary = (event) => {
           if (event.name !== 'word') return;

           // Cari indeks kata berdasarkan charIndex
           let wordIndex = 0;
           for (let i = wordStartIndices.length - 1; i >= 0; i--) {
               if (event.charIndex >= wordStartIndices[i]) {
                   wordIndex = i;
                   break;
               }
           }

           document.querySelectorAll('.highlight-word').forEach(el =>
               el.classList.remove('highlight-word'));

           const wordEl = document.getElementById(`word-${wordIndex}`);
           if (wordEl) wordEl.classList.add('highlight-word');
       };

       utterance.onend = () => {
           document.querySelectorAll('.highlight-word').forEach(el =>
               el.classList.remove('highlight-word'));
       };

       window.speechSynthesis.speak(utterance);
   }
   ```

3. File js/reading.js, fungsi setupReading(), ubah event listener btnListen
   agar memanggil speakTextWithHighlight() bukan speakText():

   ```javascript
   btnListen.addEventListener('click', () => {
       speakTextWithHighlight(appState.reading.currentSentence, 0.8);
   });
   ```

4. JANGAN ubah pemanggilan speakText() di file lain (assessment.js,
   spelling.js tetap memakai speakText() biasa tanpa highlight, karena
   tidak ada elemen per-kata yang relevan di modul tersebut)

ATURAN:
- speakText() yang sudah ada TIDAK BOLEH dihapus atau diubah signaturenya
- Implementasi harus defensif: jika words.length === 0 atau text kosong,
  jangan crash

VERIFIKASI:
1. Buka reading-screen di Chrome Desktop, tekan tombol Dengar
2. Amati elemen di DevTools Elements panel selama TTS berbicara, pastikan
   class highlight-word berpindah antar span#word-N
3. Setelah TTS selesai, pastikan tidak ada elemen yang masih memiliki class
   highlight-word
4. Tekan tombol Dengar lagi sebelum TTS sebelumnya selesai (klik cepat dua
   kali), pastikan tidak ada error di Console dan highlight tidak nyangkut
   di kata lama
5. Jika memungkinkan, uji juga di Firefox dan catat apakah onboundary
   terpicu atau tidak (laporkan saja, tidak perlu fix tambahan jika tidak
   terpicu, ini adalah graceful degradation yang diharapkan)
6. Laporkan hasil pengujian di setiap poin di atas ke saya
```

---

## PROMPT 6: TAMPILAN PROGRESS SCREEN

**Berakar pada**: REQ-PROG-01 (SDD.md Bagian 7)

```
Baca SDD.md Bagian 7 (REQ-PROG-01) secara lengkap.

TUJUAN: Memperjelas bahwa progress bar Membaca/Mengeja (sistem poin lama,
appState.progress) adalah informasi tambahan jumlah latihan, BUKAN penentu
kenaikan level. Kenaikan level ditentukan oleh Level Indicator dan Sesi
Lulus Berturut-turut (sessionTracker).

TUGAS:

1. File index.html, pada progress-screen, urutkan ulang blok secara visual:
   - Blok Level Indicator (id="level-indicator") tetap di posisi paling atas
   - Blok Sesi Lulus Berturut-turut tetap di bawahnya
   - Tambahkan satu baris teks kecil di bawah blok Sesi Lulus Berturut-turut:
     "Kenaikan level ditentukan oleh akurasi sesi di atas, bukan jumlah
     latihan di bawah ini"
   - Blok grid Membaca/Mengeja (progress bar lama) dipindah ke bawah blok
     Sesi Lulus, dengan tambahan judul kecil di atasnya:
     "Total Latihan Dikerjakan (Informasi Tambahan)"

2. File css/style.css: tidak ada perubahan struktural yang diperlukan,
   gunakan class Tailwind yang sudah ada (text-xs, text-gray-400, dst)
   konsisten dengan styling existing di file ini

3. JANGAN ubah logika di js/progress.js, js/level.js, atau js/storage.js.
   Perubahan murni pada urutan dan label di index.html

ATURAN:
- TIDAK BOLEH menggunakan tanda emdash atau titik koma di teks UI baru
- Bahasa Indonesia ramah untuk guru/orang tua (audiens halaman ini adalah
  dewasa, bukan anak, sesuai konteks Panel Guru/Orang Tua)

VERIFIKASI:
1. Buka progress-screen, pastikan urutan dari atas ke bawah adalah:
   Level Indicator -> Sesi Lulus Berturut-turut -> keterangan kecil ->
   Total Latihan Dikerjakan
2. Pastikan tidak ada elemen yang hilang dibanding sebelumnya, hanya
   berpindah posisi dan mendapat label baru
3. Buka Console DevTools, pastikan tidak ada error
4. Laporkan screenshot atau deskripsi urutan akhir ke saya
```

---

## PROMPT 7: DOKUMENTASI PEMETAAN LEVEL KE MODUL

**Berakar pada**: REQ-LVL-03, REQ-LVL-04 (SDD.md Bagian 5)

```
Baca SDD.md Bagian 5 (REQ-LVL-03 dan REQ-LVL-04) secara lengkap, termasuk
Opsi A dan Opsi B serta rekomendasi.

KEPUTUSAN: Opsi A dipilih (kedua modul Membaca dan Mengeja selalu tersedia
di semua level, perbedaan hanya pada konten via dataset L1-L6 yang sudah
dibuat di Prompt 2 dan 3).

TUJUAN: Memastikan CLAUDE.md mencerminkan keputusan ini dengan akurat,
menghilangkan ambiguitas tabel "Modul yang Aktif vs Tidak Aktif".

TUGAS:

1. File CLAUDE.md, pada bagian "Modul yang Aktif vs Tidak Aktif", tambahkan
   catatan setelah tabel yang sudah ada:

   "Catatan tentang akses modul per level: Modul Membaca dan Modul Mengeja
   keduanya selalu dapat diakses dari Beranda di semua level (1-6). Tabel
   '6 Level Task Analysis' yang mencantumkan 'Aktivitas DYSCARE' per level
   menunjukkan modul mana yang kontennya PALING RELEVAN untuk level
   tersebut, bukan pembatasan akses. Perbedaan substansial antar level
   terletak pada konten (sentencesL1-L6 dan wordsL1-L6 di state.js), bukan
   pada modul mana yang dapat dibuka. Keputusan ini didokumentasikan di
   SDD.md REQ-LVL-03."

2. File CLAUDE.md, pada bagian "🏗️ ARSITEKTUR KODE", komentar untuk
   reading.js dan spelling.js, tambahkan catatan singkat bahwa
   dataPerLevel di reading.js (untuk prompt AI generatif) dan
   sentencesL1-L6/wordsL1-L6 di state.js (untuk fallback statis dan
   pemetaan getReadingSentencesByLevel/getSpellingWordsByLevel) adalah
   DUA STRUKTUR DATA YANG BERBEDA TUJUAN tapi harus SELARAS TEMA. Referensi
   SDD.md REQ-LVL-04.

3. JANGAN ubah kode JS apapun di prompt ini, murni dokumentasi di CLAUDE.md

ATURAN:
- Pertahankan format dan gaya penulisan CLAUDE.md yang sudah ada
- TIDAK BOLEH menggunakan tanda emdash atau titik koma

VERIFIKASI:
1. Tampilkan diff CLAUDE.md sebelum dan sesudah perubahan
2. Pastikan tidak ada bagian CLAUDE.md lain yang terhapus secara tidak
   sengaja
3. Laporkan diff tersebut ke saya untuk review sebelum dianggap selesai
```

---

## PROMPT 8: ROTASI API KEY DAN RESTRICTION

**Berakar pada**: REQ-SEC-01 (SDD.md Bagian 3)

```
Baca SDD.md Bagian 3 (REQ-SEC-01) secara lengkap.

PENTING: Prompt ini berbeda dari prompt lain. Sebagian besar pekerjaan
dilakukan di LUAR codebase (Google AI Studio / Google Cloud Console), bukan
di kode. Claude Code hanya membantu bagian yang terkait kode.

TUGAS UNTUK CLAUDE CODE (bagian kode):

1. Setelah saya (pengguna) memberikan API key BARU yang sudah dirotasi dan
   diberi restriction, update nilai content pada meta tag berikut di
   index.html:

   ```html
   <meta name="dyscare-ai-key" content="GANTI_DENGAN_KEY_BARU">
   ```

2. Verifikasi tidak ada key LAMA ([REDACTED_OLD_KEY])
   yang masih tertinggal di file manapun:

   grep -rn "[REDACTED_OLD_KEY]" .

3. Jika ditemukan di file lain (misalnya komentar, dokumentasi, atau
   .env contoh), ganti atau hapus sesuai konteks, laporkan setiap lokasi
   yang ditemukan

TUGAS UNTUK SAYA (di luar Claude Code, dijelaskan agar Claude Code tahu
konteksnya dan tidak mencoba melakukan ini sendiri):

1. Buka Google AI Studio (aistudio.google.com/apikey) atau Google Cloud
   Console
2. Revoke key lama: [REDACTED_OLD_KEY]
3. Generate key baru
4. Tambahkan Application Restriction: HTTP referrers, masukkan
   https://alwnfarhn-netizen.github.io/*
5. Tambahkan API Restriction: hanya Generative Language API
6. Berikan key baru tersebut ke Claude Code untuk dimasukkan ke index.html

ATURAN:
- Claude Code TIDAK PERLU dan TIDAK BISA melakukan rotasi key, ini murni
  tugas manusia di Google Cloud Console
- JANGAN membuat asumsi tentang key baru, tunggu key diberikan secara
  eksplisit oleh saya sebelum mengubah index.html

VERIFIKASI:
1. Setelah key baru dimasukkan, buka aplikasi, pastikan fitur AI (Cerita
   AI, Buat Gambar, Saran Cerdas) tetap berfungsi
2. grep memastikan key lama sudah tidak ada di codebase
3. Laporkan hasil grep dan hasil pengujian fungsional ke saya
```

---

## PROMPT 9: DOKUMENTASI KEPUTUSAN PRE-ASSESSMENT

**Berakar pada**: REQ-ASMT-01 (SDD.md Bagian 8)

```
Baca SDD.md Bagian 8 (REQ-ASMT-01) secara lengkap, termasuk pertimbangan
untuk mempertahankan 2 domain vs menambah domain comprehension.

KEPUTUSAN AWAL (perlu konfirmasi dari pengguna sebelum eksekusi penuh):
Pertahankan 2 domain (reading dan spelling), TIDAK menambah domain
comprehension, dengan alasan konsistensi dengan Batasan Penelitian BAB I
yang fokus pada early reading skills (decoding dan recognition sebagai dua
pilar Simple View of Reading).

TUGAS:

1. File DEVELOPMENT_PROMPTS.md, pada PROMPT 5 (Pre-Assessment Refocus),
   tambahkan catatan di awal blok prompt tersebut:

   "STATUS: SUPERSEDED. Keputusan akhir adalah mempertahankan 2 domain
   (reading dan spelling) tanpa domain comprehension terpisah, karena
   konsisten dengan Batasan Penelitian BAB I yang fokus pada early reading
   skills sebagai dua pilar Simple View of Reading (Gough & Tunmer, 1986).
   Comprehension sebagai komponen kedua sudah tercermin secara implisit
   pada soal level5 dan level6 (Membaca Kalimat dan Kelancaran Membaca).
   Lihat SDD.md REQ-ASMT-01 untuk detail pertimbangan."

2. File CLAUDE.md, pada bagian referensi ke pre-assessment (jika ada),
   pastikan konsisten dengan keputusan di atas. Jika CLAUDE.md tidak
   menyebut comprehension sama sekali, tidak perlu perubahan tambahan.

3. JANGAN ubah js/assessment.js, js/config.js (ASSESSMENT_CONFIG), atau
   file kode lainnya. Murni dokumentasi.

ATURAN:
- TIDAK BOLEH menggunakan tanda emdash atau titik koma
- Pertahankan format DEVELOPMENT_PROMPTS.md yang sudah ada, hanya
  menambahkan catatan status di awal blok PROMPT 5

VERIFIKASI:
1. Tampilkan diff DEVELOPMENT_PROMPTS.md sebelum dan sesudah
2. Pastikan PROMPT 5 masih bisa dibaca utuh sebagai referensi historis,
   hanya diberi catatan status di atasnya, tidak dihapus
3. Laporkan diff ke saya untuk review
```

---

## RINGKASAN STATUS SETELAH SEMUA PROMPT DIJALANKAN

Setelah Prompt 0-9 selesai dan diverifikasi, kondisi yang diharapkan:

| REQ ID | Status Setelah Eksekusi |
|--------|--------------------------|
| REQ-AI-01, REQ-AI-02 | Satu sumber API key, fitur AI di Mengeja dan Menulis berfungsi jika key valid |
| REQ-DATA-01 | sentencesL1-L6 tersedia, masing-masing berbeda secara substansial |
| REQ-DATA-02 | wordsL1-L6 tersedia dengan struktur lengkap termasuk imagePrompt |
| REQ-LVL-02 | getReadingSentencesByLevel dan getSpellingWordsByLevel memakai dataset L1-L6 |
| REQ-HL-01 | Word highlighting aktif saat TTS membaca di reading-screen |
| REQ-PROG-01 | Progress screen membedakan indikator progresi level vs total latihan |
| REQ-LVL-03, REQ-LVL-04 | CLAUDE.md mendokumentasikan Opsi A secara eksplisit |
| REQ-SEC-01 | Key lama direvoke, key baru dengan restriction terpasang |
| REQ-ASMT-01 | DEVELOPMENT_PROMPTS.md Prompt 5 diberi status SUPERSEDED dengan alasan jelas |

Setelah seluruh status di atas tercapai, jalankan kembali PROMPT 9
"Validation Readiness Check" dari DEVELOPMENT_PROMPTS.md untuk memastikan
seluruh perubahan tidak menimbulkan regresi pada indikator validator yang
sudah dipenuhi sebelumnya (skor ahli media 91,3%, ahli materi 90,28%,
kepraktisan 98,53%).

---

**Dokumen ini terakhir diperbarui**: Juni 2026
**Versi**: 1.0
**Bergantung pada**: SDD.md versi 1.0, CLAUDE.md, DEVELOPMENT_PROMPTS.md
