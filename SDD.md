# SDD (Spec-Driven Development) - DYSCARE v3

> Dokumen ini adalah sumber kebenaran (source of truth) untuk pengembangan DYSCARE selanjutnya. Disusun berdasarkan audit langsung terhadap kode di repository (index.html, css/style.css, seluruh js/*.js, ai-config.js, ai-service.js) per Juni 2026, dibandingkan dengan ground truth di CLAUDE.md dan klaim yang sudah divalidasi di skripsi BAB III dan BAB IV.

> Status dokumen ini bukan dugaan. Setiap temuan disertai referensi file dan fungsi yang bisa diverifikasi langsung di kode.

---

## 0. Cara Membaca Dokumen Ini

Setiap requirement ditulis dengan format berikut.

**ID**: kode unik requirement, dipakai sebagai referensi di RDP.md
**Kondisi Saat Ini**: apa yang benar-benar terjadi di kode sekarang, dengan referensi file
**Kondisi Target**: apa yang seharusnya terjadi setelah perbaikan
**Mengapa**: justifikasi akademik atau teknis
**Kriteria Penerimaan**: cara memverifikasi bahwa requirement sudah terpenuhi
**Prioritas**: P0 (blocker sidang/validasi), P1 (penting tapi tidak blocker), P2 (peningkatan ke depan)

Keputusan desain dari sesi diskusi sebelumnya yang menjadi acuan tetap di seluruh dokumen ini.

1. Sistem poin lama (appState.progress.reading, appState.progress.spelling) dipertahankan sebagai tampilan saja. Sistem akurasi 3 sesi tetap menjadi satu satunya mekanisme progresi level. Kedua sistem berjalan paralel dengan peran yang berbeda dan jelas.
2. API key yang exposed di index.html dicatat sebagai satu requirement keamanan (REQ-SEC-01), bukan menjadi fokus utama SDD ini. Perbaikan fitur lain tetap berjalan terlebih dahulu.
3. Scope SDD ini mencakup audit dan perbaikan struktur, dataset konten 6 level, dan word highlighting secara menyeluruh.

---

## 1. Ringkasan Temuan Audit

Tabel ini memetakan seluruh kesenjangan yang ditemukan antara dokumentasi (CLAUDE.md, DEVELOPMENT_PROMPTS.md, skripsi BAB III/IV) dan kode aktual.

| ID | Area | Kesenjangan | File Terdampak | Prioritas |
|----|------|-------------|-----------------|-----------|
| REQ-LVL-01 | Sistem level | Dua sistem AI config berjalan paralel dan tidak konsisten | ai-config.js, ai-service.js, js/config.js, js/ai.js | P0 |
| REQ-LVL-02 | Konten per level | sentencesEasy/Medium/Hard dan wordsEasy/Medium/Hard (3 tier) belum direfaktor menjadi 6 level penuh | js/state.js, js/level.js | P0 |
| REQ-LVL-03 | Modul Mengeja vs Task Analysis | Pemetaan level ke modul tidak konsisten dengan tabel CLAUDE.md | js/level.js, js/state.js | P1 |
| REQ-LVL-04 | dataPerLevel duplikat | reading.js punya dataPerLevel terpisah dari state.js, dipakai hanya untuk prompt AI generatif | js/reading.js | P1 |
| REQ-AI-01 | Konfigurasi AI ganda | ai-service.js (Gemini Flash Lite via meta tag) tidak terhubung ke js/ai.js (Gemini 2.5 Flash + Imagen via config.js) | ai-config.js, ai-service.js, js/ai.js, js/config.js | P0 |
| REQ-AI-02 | API_KEY kosong | js/config.js API_KEY = "" menyebabkan generateImage dan generateMultimodalContent gagal | js/config.js, js/ai.js | P0 |
| REQ-HL-01 | Word highlighting | Belum diimplementasikan, hanya struktur span per kata yang disiapkan | js/reading.js, css/style.css | P0 |
| REQ-SEC-01 | API key exposed | Key Gemini live tertulis di meta tag publik index.html | index.html, ai-config.js | P1 (dicatat, tidak blocker) |
| REQ-MOD-01 | Modul hidden | Menulis dan Berhitung sudah di-hide dengan benar sesuai CLAUDE.md | index.html, js/config.js | Sudah sesuai, tidak ada aksi |
| REQ-DATA-01 | Dataset 6 level Membaca | Belum ada dataset sentencesL1 sampai sentencesL6 statis sebagai fallback | js/state.js | P0 |
| REQ-DATA-02 | Dataset 6 level Mengeja | Belum ada dataset wordsL1 sampai wordsL6 sesuai spesifikasi panjang kata per level | js/state.js | P0 |
| REQ-PROG-01 | Tampilan progress | Progress screen menampilkan poin lama dan akurasi sesi bersamaan tanpa penjelasan yang jelas ke pengguna dewasa | index.html, js/progress.js | P1 |
| REQ-ASMT-01 | Pre-assessment domain | Hanya domain reading dan spelling (2 domain), comprehension dari Prompt 5 DEVELOPMENT_PROMPTS.md tidak diimplementasikan | js/assessment.js | P2 (dokumentasikan sebagai keputusan final, bukan utang) |
| REQ-VAKT-01 | Label VAKT | Sudah diimplementasikan dengan baik di reading-screen dan spelling-screen | index.html | Sudah sesuai, tidak ada aksi |

---

## 2. REQ-AI-01 dan REQ-AI-02: Unifikasi Konfigurasi AI

### Kondisi Saat Ini

Terdapat dua jalur integrasi AI yang berjalan independen.

**Jalur A** (ai-config.js + ai-service.js):
- API key dibaca dari `<meta name="dyscare-ai-key">` di index.html
- Model: `gemini-flash-lite-latest`
- Fungsi: `generateCeritaAI(levelData, nomorSesi)` dan `generateSaranCerdas(performaData)`
- Dipanggil dari: js/reading.js (`loadReadingContent`) dan js/progress.js (`tampilkanSaranCerdas`)
- Memiliki fallback teks statis jika AI gagal merespons

**Jalur B** (js/config.js + js/ai.js):
- API key dari `const API_KEY = ""` di js/config.js, kosong
- Model: `gemini-2.5-flash-preview-09-2025` (text dan vision) dan `imagen-4.0-generate-001` (image)
- Fungsi: `generateAIContent(prompt)`, `generateMultimodalContent(prompt, base64Image)`, `generateImage(prompt)`
- Dipanggil dari: js/spelling.js (`generateImage`), js/math.js (`generateAIContent`), js/writing.js (`generateMultimodalContent`)
- Tidak memiliki fallback yang baik untuk generateImage, mengembalikan null lalu fallback ke emoji di spelling.js

Karena API_KEY di config.js kosong, setiap pemanggilan ke IMAGE_API_URL, TEXT_API_URL, dan VISION_API_URL pada Jalur B akan gagal di request (key kosong di URL menyebabkan 400 Bad Request dari Google). Modul Mengeja akan selalu fallback ke emoji (fallbackEmoji), bukan gambar AI. Modul Menulis (writing.js, hidden tapi kodenya tetap ada) akan selalu menampilkan pesan "Gagal terhubung ke AI".

### Kondisi Target

Satu sumber API key, satu konvensi pemanggilan, dipakai oleh seluruh fitur AI di aplikasi.

Keputusan arsitektur: pertahankan pola meta tag (ai-config.js) sebagai sumber key tunggal, karena ini memudahkan deployment tanpa menyentuh file JS (sesuai catatan di CLAUDE.md tentang config.js yang harus di-gitignore atau diisi manual saat deploy). js/config.js dan js/ai.js direfaktor untuk membaca dari sumber yang sama dengan ai-config.js.

Model yang dipakai harus konsisten dengan yang disebutkan di CLAUDE.md sebagai constraint: `gemini-2.5-flash-preview-09-2025` untuk text dan vision, `imagen-4.0-generate-001` untuk image generation. ai-service.js saat ini memakai `gemini-flash-lite-latest`, ini perlu diselaraskan atau didokumentasikan sebagai perbedaan yang disengaja (misalnya Flash Lite untuk fitur ringan seperti Saran Cerdas, model penuh untuk Cerita AI).

### Mengapa

Validator menilai Aspek Fitur AI dengan tiga butir: Cek Tulisan AI (E17, di modul Menulis yang hidden), Generatif AI menghasilkan konten bervariasi (Modul Mengeja dan Membaca), dan Saran AI di Capaian. Skor ahli media untuk Fitur AI adalah 83,3 persen, kategori Sangat Layak, tetapi ini dinilai berdasarkan tampilan dan deskripsi, bukan necessarily pengujian fungsional mendalam terhadap setiap panggilan API. Jika pengembangan lanjutan atau demo ulang menunjukkan fitur Cerita AI dan Buat Gambar gagal total karena key kosong, ini bisa jadi temuan baru yang merugikan saat sesi lanjutan atau publikasi.

### Kriteria Penerimaan

1. Hanya ada satu definisi API key di seluruh codebase, dibaca dari meta tag di index.html
2. js/ai.js, js/config.js, dan ai-service.js semuanya membaca key dari sumber yang sama
3. generateImage() di Modul Mengeja menghasilkan gambar AI (bukan langsung fallback emoji) ketika key valid tersedia
4. checkWritingWithAI() di Modul Menulis (meski hidden) menghasilkan feedback AI yang valid ketika key tersedia, untuk kebutuhan pengembangan tahap berikutnya
5. Console DevTools tidak menampilkan error 400 atau "API Key belum diatur" ketika key valid terpasang
6. Setiap fungsi AI memiliki fallback yang baik dan tidak membuat aplikasi macet ketika key tidak tersedia atau quota habis

### Prioritas

P0. Ini menentukan apakah klaim "Generatif AI menghasilkan konten bervariasi" (salah satu Kebaruan Penelitian poin 5 di BAB I skripsi) benar benar berfungsi end to end.

---

## 3. REQ-SEC-01: API Key Exposed di index.html

### Kondisi Saat Ini

`index.html` baris ke-7 area head berisi:

```html
<meta name="dyscare-ai-key" content="[REDACTED_OLD_KEY]">
```

Key ini terbaca oleh siapa pun yang membuka view-source halaman, termasuk crawler dan bot otomatis yang menyisir GitHub Pages untuk mencari kredensial yang ter-leak. Key ini terhubung ke Google Generative Language API yang menimbulkan biaya per pemanggilan tergantung tier billing Google Cloud yang terpasang pada key tersebut.

### Kondisi Target

Tidak ada perubahan arsitektur mendesak untuk SDD ini karena sudah disepakati sebagai item tunggal yang dicatat, bukan fokus utama. Namun requirement minimal yang harus dipenuhi sebelum repository ini dipublikasikan lebih luas (misalnya untuk lampiran skripsi atau publikasi jurnal) adalah:

1. Key yang saat ini exposed (`[REDACTED_OLD_KEY]`) harus dirotasi (revoke lalu generate baru) di Google AI Studio atau Google Cloud Console
2. Key baru sebaiknya memiliki application restriction berupa HTTP referrer yang dibatasi ke domain `alwnfarhn-netizen.github.io`, sehingga key tidak bisa dipakai dari domain lain meski ter-copy
3. Key baru sebaiknya memiliki API restriction yang hanya mengizinkan Generative Language API, bukan seluruh API project

### Mengapa

Tanpa application restriction, siapa pun yang menyalin key dari source bisa memakainya dari aplikasi lain, menghabiskan kuota gratis atau menimbulkan biaya pada akun Google Cloud milik peneliti. Untuk static site di GitHub Pages tanpa backend, menyembunyikan key sepenuhnya secara teknis tidak mungkin, sehingga mitigasi realistis adalah restriction di sisi Google Cloud, bukan menghilangkan key dari kode.

### Kriteria Penerimaan

1. Key lama sudah direvoke di Google AI Studio atau Cloud Console
2. Key baru memiliki HTTP referrer restriction yang mencantumkan domain GitHub Pages
3. Aplikasi tetap berfungsi normal setelah penggantian key

### Prioritas

P1, dicatat sebagai item tersendiri sesuai kesepakatan, dikerjakan setelah REQ-AI-01 dan REQ-AI-02 karena unifikasi konfigurasi AI akan membuat penggantian key menjadi satu titik perubahan saja.

---

## 4. REQ-LVL-02, REQ-DATA-01, REQ-DATA-02: Dataset Konten 6 Level

### Kondisi Saat Ini

`js/state.js` mendefinisikan konten dengan struktur 3 tier lama.

```javascript
reading: {
    sentencesEasy: [ /* 5 kalimat 2-3 kata */ ],
    sentencesMedium: [ /* 5 kalimat 4-5 kata */ ],
    sentencesHard: [ /* 5 kalimat 6+ kata */ ],
    currentSentence: "",
    isListening: false
}

spelling: {
    wordsEasy: [ /* 5 kata 3 huruf */ ],
    wordsMedium: [ /* 5 kata 4 huruf */ ],
    wordsHard: [ /* 5 kata 5-6 huruf */ ],
    currentWordObj: null
}
```

`js/level.js` memetakan 6 level ke 3 tier ini.

```javascript
function getReadingSentencesByLevel() {
    if (appState.currentLevel >= 5) return appState.reading.sentencesHard;
    if (appState.currentLevel >= 3) return appState.reading.sentencesMedium;
    return appState.reading.sentencesEasy;
}
```

Akibatnya level 1 dan 2 mendapat konten yang identik (sentencesEasy), level 3 dan 4 identik (sentencesMedium), level 5 dan 6 identik (sentencesHard). Ini bertentangan dengan tabel Task Analysis 6 Level di CLAUDE.md yang menyebutkan setiap level punya sub-keterampilan yang berbeda secara spesifik.

Terpisah dari ini, `js/reading.js` punya `dataPerLevel` dengan 6 entry lengkap (level 1 sampai 6, masing masing dengan namaLevel, polaKata, daftarKata, panjang, tema), tetapi struktur ini hanya dipakai sebagai parameter untuk `generateCeritaAI()`, tidak dipakai sebagai sumber konten statis fallback.

### Kondisi Target

#### Modul Membaca: sentencesL1 sampai sentencesL6

Setiap level memiliki array kalimat statis sebagai fallback ketika AI tidak tersedia, dengan struktur dan jumlah minimum sebagai berikut.

| Level | Key | Fokus | Format | Minimum Entri |
|-------|-----|-------|--------|----------------|
| 1 | sentencesL1 | Pengenalan Huruf | Huruf vokal/konsonan terpisah, contoh "a i u", "b a c a", "m a m a", "p a p a" | 8 |
| 2 | sentencesL2 | Kesadaran Fonologis | Suku kata terbuka KV, contoh "ba bi bu", "ka ki ku", "ma mi mu" | 8 |
| 3 | sentencesL3 | Blending menjadi Kata | Kata 2 suku kata KV-KV, contoh "ibu", "buku", "meja", "topi", "kuda", "roti" | 10 |
| 4 | sentencesL4 | Pengenalan Kata Kompleks | Kata 3+ suku kata atau KVK, contoh "sepatu", "pelangi", "kacamata", "mainan", "sekolah", "matahari" | 10 |
| 5 | sentencesL5 | Frasa dan Kalimat Pendek | Frasa 2-3 kata bermakna, contoh "ibu masak", "adik main bola", "kakak sekolah" | 10 |
| 6 | sentencesL6 | Kalimat Utuh SPOK | Kalimat 4-6 kata struktur lengkap, contoh "ibu memasak nasi di dapur", "adik bermain bola di halaman" | 10 |

Prinsip penyusunan konten yang berlaku untuk semua level.

1. Bahasa Indonesia, kosakata familiar anak SD kelas 1-3
2. Hindari kata dengan huruf yang sulit dibedakan anak disleksia (b/d, p/q) di level 1-2
3. Mulai dari kata frekuensi tinggi (sight words)
4. Tema sehari-hari: keluarga, hewan, makanan, sekolah, mainan
5. Konten harus konsisten dengan tema yang dipakai di dataPerLevel (reading.js) agar konten AI generatif dan fallback statis terasa selaras

#### Modul Mengeja: wordsL1 sampai wordsL6

Setiap level memiliki array objek kata dengan struktur konsisten.

```javascript
{
    word: "string",          // kata target, lowercase
    imagePrompt: "string",   // prompt Imagen, dalam Bahasa Inggris
    fallbackEmoji: "emoji",  // fallback jika AI image gagal
    phonetic: "string",      // opsional, untuk TTS
    category: "string"       // opsional, kategori tema
}
```

| Level | Key | Format | Minimum Entri |
|-------|-----|--------|----------------|
| 1 | wordsL1 | Kata sangat sederhana 2 huruf, contoh "ya" | 5 |
| 2 | wordsL2 | Kata 3 huruf KV-V atau V-KV, contoh ibu, api, air, ulu, iya | 6 |
| 3 | wordsL3 | Kata 4 huruf pola KV-KV, contoh apel, buku, ikan, meja, susu | 8 |
| 4 | wordsL4 | Kata 5 huruf, contoh pisang, gajah, kursi, balon, mobil, pensil | 8 |
| 5 | wordsL5 | Kata 6 huruf, contoh sepatu, jendela, bintang, boneka, gunung | 8 |
| 6 | wordsL6 | Kata 7+ huruf, contoh kacamata, pelangi, kupukupu, matahari, sekolahan | 6 |

Aturan tambahan khusus untuk imagePrompt: harus dalam Bahasa Inggris karena Imagen lebih akurat dengan prompt Inggris (sesuai catatan di DEVELOPMENT_PROMPTS.md Prompt 7), tetapi field word dan fallbackEmoji tetap dalam konteks Bahasa Indonesia.

#### Refaktor getReadingSentencesByLevel() dan getSpellingWordsByLevel()

```javascript
function getReadingSentencesByLevel() {
    const key = `sentencesL${appState.currentLevel}`;
    return appState.reading[key] || appState.reading.sentencesL1;
}

function getSpellingWordsByLevel() {
    const key = `wordsL${appState.currentLevel}`;
    return appState.spelling[key] || appState.spelling.wordsL1;
}
```

Struktur lama (sentencesEasy/Medium/Hard, wordsEasy/Medium/Hard) dipertahankan di state.js sebagai legacy field yang tidak lagi dirujuk oleh fungsi level, untuk menghindari breaking change pada kode lain yang mungkin masih mengaksesnya secara langsung, tetapi diberi komentar bahwa field ini sudah deprecated.

### Mengapa

Tanpa dataset 6 level yang berbeda secara substansial, klaim di BAB III tentang "Task Analysis enam level yang disusun secara hierarkis berdasarkan Simple View of Reading" (Gough & Tunmer, 1986) tidak tercermin di konten aktual yang dilihat anak, karena level 1-2, 3-4, dan 5-6 saat ini menampilkan materi yang identik. Ini adalah kesenjangan antara desain instruksional yang dideskripsikan di skripsi dan implementasi nyata.

### Kriteria Penerimaan

1. `Object.keys(appState.reading)` menyertakan sentencesL1 sampai sentencesL6, masing masing memenuhi jumlah minimum entri
2. `Object.keys(appState.spelling)` menyertakan wordsL1 sampai wordsL6, masing masing memenuhi jumlah minimum entri
3. Setiap entri wordsL1-L6 memiliki seluruh field wajib (word, imagePrompt, fallbackEmoji)
4. Navigasi ke reading-screen dan spelling-screen pada setiap level 1-6 menampilkan konten yang sesuai dengan tabel di atas, bukan duplikasi dari level lain
5. Tidak ada kata di level 1-2 yang mengandung huruf b, d, p, q secara berdekatan yang berpotensi membingungkan (verifikasi manual per kata)
6. Komentar JSDoc di setiap blok level menyebutkan sub-keterampilan yang dilatih dan referensi ke Bab III proposal

### Prioritas

P0.

---

## 5. REQ-LVL-03 dan REQ-LVL-04: Pemetaan Level ke Modul

### Kondisi Saat Ini

CLAUDE.md menyatakan pemetaan berikut di bagian "6 Level Task Analysis".

| Level | Modul Utama menurut CLAUDE.md |
|-------|-------------------------------|
| 1 | Mengeja (drag-drop huruf, TTS nama huruf) |
| 2 | Membaca (TTS per huruf, latihan fonik) |
| 3 | Mengeja (susun huruf, cerita AI sederhana) |
| 4 | Mengeja (gambar pendukung, AI generatif) |
| 5 | Membaca (cerita AI dengan word highlighting) |
| 6 | Membaca (STT evaluation, cerita AI variatif) |

Tabel "Modul yang Aktif vs Tidak Aktif" di CLAUDE.md menyebutkan Membaca aktif untuk Level 2, 5, 6 dan Mengeja aktif untuk Level 1, 3, 4.

Namun di kode, kedua modul (reading-screen dan spelling-screen) dapat diakses kapan saja dari home-screen tanpa pembatasan berdasarkan level aktif anak. `navigateTo('reading-screen')` dan `navigateTo('spelling-screen')` di index.html tidak memiliki guard yang mengecek `appState.currentLevel`. Implikasinya, anak di level 1 tetap bisa membuka Modul Membaca meski menurut CLAUDE.md modul utamanya seharusnya Mengeja, dan sebaliknya.

### Kondisi Target

Ada dua opsi desain yang valid secara akademis, dan keduanya harus dipertimbangkan sebelum implementasi.

**Opsi A: Kedua modul selalu tersedia, label "modul utama" hanya untuk penekanan konten**

Kedua kartu Membaca dan Mengeja tetap selalu bisa diakses dari home-screen di semua level. Perbedaan menurut level hanya pada konten yang ditampilkan (lewat getReadingSentencesByLevel dan getSpellingWordsByLevel yang sudah memuat 6 dataset terpisah). "Modul utama per level" di CLAUDE.md diinterpretasikan sebagai modul yang kontennya paling relevan untuk dilatih di level tersebut, bukan modul yang dibuka secara eksklusif.

Ini adalah opsi yang LEBIH SESUAI dengan kondisi kode saat ini dan TIDAK memerlukan perubahan navigasi, hanya memerlukan REQ-DATA-01 dan REQ-DATA-02 (dataset 6 level) untuk membuat konten benar benar berbeda per level.

**Opsi B: Modul yang bukan "modul utama" untuk level aktif ditampilkan dengan badge "Latihan Tambahan"**

Kartu Membaca dan Mengeja di home-screen tetap dapat diklik keduanya, tetapi modul yang menjadi "modul utama" untuk level aktif anak diberi badge visual seperti "Latihan Utama Level X", sedangkan modul lainnya diberi badge "Latihan Tambahan". Ini memberi sinyal pedagogis ke anak dan pendamping tanpa membatasi akses.

### Rekomendasi

Opsi A direkomendasikan sebagai kondisi target karena perubahannya minimal dan risiko regresi rendah. CLAUDE.md tabel "Modul yang Aktif vs Tidak Aktif" sebaiknya direvisi catatannya untuk mencerminkan bahwa "aktif" berarti modul tersedia untuk seluruh level, dengan konten yang menyesuaikan level (bukan modul yang exclusive per level). Keputusan ini harus diambil sebelum eksekusi RDP terkait, karena memengaruhi narasi di BAB III jika ada revisi lanjutan.

### Mengapa

Validator menilai "Kesesuaian level soal dengan kemampuan anak disleksia" (instrumen ahli materi, aspek Adaptive Learning, butir 10) berdasarkan konten yang ditampilkan saat level berubah, bukan berdasarkan modul mana yang dapat diakses. Selama konten per level berbeda secara substansial (REQ-DATA-01, REQ-DATA-02), butir ini tetap terpenuhi tanpa perlu membatasi navigasi modul.

### Kriteria Penerimaan

1. Keputusan Opsi A atau B didokumentasikan di CLAUDE.md sebagai ground truth final, menggantikan ambiguitas tabel "Modul Aktif vs Tidak Aktif" saat ini
2. Jika Opsi A: tidak ada perubahan kode navigasi, cukup pastikan REQ-DATA-01 dan REQ-DATA-02 selesai
3. Jika Opsi B: setiap kartu modul di home-screen menampilkan badge yang sesuai dengan level aktif anak, dan badge ter-update otomatis saat level berubah

### Prioritas

P1. Tidak memblokir validasi karena instrumen menilai konten dan kelayakan, bukan struktur navigasi, tetapi penting untuk konsistensi dokumentasi proyek ke depan.

---

## 6. REQ-HL-01: Word Highlighting

### Kondisi Saat Ini

`js/reading.js` fungsi `loadReadingContent()` me-render kalimat sebagai berikut.

```javascript
contentArea.innerHTML = appState.reading.currentSentence
    .split(' ')
    .map(w => `<span>${w}</span>`)
    .join(' ');
```

Setiap kata dibungkus `<span>` tanpa id atau class yang bisa ditarget. Fungsi `speakText(text, rate)` di js/utils.js memanggil `SpeechSynthesisUtterance` tanpa event handler `onboundary`, sehingga tidak ada mekanisme yang menyinkronkan kata yang sedang dibacakan dengan highlight visual.

`css/style.css` sudah memiliki class `.highlight-word` yang siap dipakai.

```css
.highlight-word {
    background-color: #fef08a;
    border-radius: 4px;
    padding: 0 2px;
}
```

Tetapi class ini tidak pernah ditambahkan atau dihapus dari elemen manapun di kode JS.

### Kondisi Target

Saat tombol Dengar (btn-listen) ditekan, setiap kata di reading-content mendapat highlight kuning (.highlight-word) secara berurutan, sinkron dengan kata yang sedang diucapkan TTS, lalu highlight dihapus saat kata berikutnya dimulai dan saat TTS selesai seluruhnya.

Implementasi yang disarankan:

1. Setiap `<span>` di reading-content diberi `id="word-N"` dengan N adalah indeks kata (0, 1, 2, dst), saat `loadReadingContent()` me-render kalimat
2. `speakText()` di utils.js diberi parameter opsional `onWordBoundary` callback, atau dibuat fungsi baru `speakTextWithHighlight(text, rate)` khusus untuk reading-screen agar tidak mengubah signature yang dipakai modul lain
3. Event `onboundary` dari SpeechSynthesisUtterance memberikan informasi `charIndex`, yang dipetakan ke indeks kata dengan menghitung posisi spasi dalam teks
4. Saat boundary terpicu untuk kata ke-N, tambahkan class `highlight-word` ke `#word-N` dan hapus dari kata sebelumnya
5. Saat `utterance.onend` terpicu, hapus seluruh class highlight-word

Catatan teknis penting: Web Speech API `onboundary` memiliki dukungan browser yang tidak konsisten (beberapa browser memicu boundary per kata, beberapa per karakter, beberapa tidak sama sekali). Implementasi harus memiliki fallback degradasi yang baik, yaitu jika `onboundary` tidak terpicu sama sekali dalam waktu tertentu, highlight tidak ditampilkan tetapi TTS tetap berjalan normal tanpa error.

### Mengapa

Ini disebut eksplisit dua kali. Pertama di storyboard Lampiran 1 proposal ("Anak mendengarkan cerita dengan sorotan kata per kata"). Kedua di rubric ahli media butir 13 (Aspek Audio Multimedia: "Word highlighting mendukung sinkronisasi visual-auditori"). Ahli media memberi skor 100 persen pada Aspek Audio dan Multimedia, kemungkinan berdasarkan deskripsi fitur dan observasi permukaan, bukan pengujian sinkronisasi mendalam. Untuk pengembangan lanjutan (fase Implementation, atau publikasi), kesenjangan ini berisiko ditemukan dan mempertanyakan validitas skor 100 persen tersebut.

### Kriteria Penerimaan

1. Saat tombol Dengar ditekan, minimal satu kata mendapat class highlight-word selama TTS berbicara (dapat diverifikasi lewat DevTools Elements panel secara real time)
2. Highlight berpindah dari kata ke kata mengikuti urutan pembacaan, pada browser yang mendukung onboundary (Chrome desktop sebagai baseline)
3. Highlight terhapus seluruhnya saat TTS selesai (utterance.onend)
4. Pada browser yang tidak mendukung onboundary, TTS tetap berjalan tanpa error JavaScript di console, highlight cukup tidak muncul (graceful degradation)
5. Tidak ada regresi pada fitur Baca (Rekam) yang sudah berjalan

### Prioritas

P0.

---

## 7. REQ-PROG-01: Tampilan Progress Screen

### Kondisi Saat Ini

`progress-screen` di index.html menampilkan tiga blok informasi.

1. Level Indicator (current-level-label, current-level-hint) - dari sistem 6 level, sudah benar
2. Sesi lulus berturut-turut (current-level-pass-count, prog-bar-session) - dari sessionTracker, sudah benar
3. Progress bar Membaca dan Mengeja (prog-read-val, prog-bar-read, prog-spell-val, prog-bar-spell) - dari appState.progress, sistem poin lama

Ketiga blok ini ditampilkan bersamaan tanpa label yang menjelaskan bahwa blok 3 adalah hitungan latihan kumulatif (sekadar informasi jumlah aktivitas), sementara blok 1 dan 2 adalah indikator progresi level yang sebenarnya. Bagi guru atau orang tua yang membuka halaman ini, bisa timbul kebingungan: mengapa progress bar Membaca menunjukkan 12 dari 50 latihan tetapi level tidak naik, padahal sudah lulus 2 dari 3 sesi.

### Kondisi Target

Sesuai keputusan yang sudah disepakati, sistem poin tetap dipertahankan untuk display. Maka kondisi target BUKAN menghapus blok 3, melainkan memperjelas perannya melalui label.

1. Tambahkan label kecil di atas blok progress bar Membaca/Mengeja, contoh teks: "Total Latihan Dikerjakan (Informasi Tambahan)"
2. Tambahkan satu baris keterangan di bawah Level Indicator yang menjelaskan hubungan, contoh: "Kenaikan level ditentukan oleh akurasi sesi (lihat di atas), bukan jumlah latihan di bawah ini"
3. Pertimbangkan urutan visual: Level Indicator dan Sesi Lulus Berturut-turut (indikator progresi) ditempatkan di atas, Total Latihan (informasi tambahan) ditempatkan di bawah, agar urutan baca mencerminkan kepentingan informasi

### Mengapa

Aspek Pengoperasian pada instrumen ahli media butir 22 menilai "Dashboard Capaian jelas". Kejelasan bukan hanya soal data ditampilkan, tetapi juga soal pengguna memahami arti data tersebut. Tanpa label pembeda, dua sistem pelacakan yang berjalan paralel berisiko disalahartikan sebagai dua hal yang saling bertentangan.

### Kriteria Penerimaan

1. Ada label teks yang membedakan secara eksplisit antara "indikator progresi level" dan "total latihan dikerjakan"
2. Urutan visual di progress-screen menempatkan indikator progresi level lebih dulu (lebih atas) dibanding total latihan
3. Tidak ada perubahan pada logika appState.progress atau sessionTracker, perubahan murni pada label dan urutan tampilan (HTML/CSS)

### Prioritas

P1.

---

## 8. REQ-ASMT-01: Dokumentasi Keputusan Pre-Assessment

### Kondisi Saat Ini

DEVELOPMENT_PROMPTS.md Prompt 5 menginstruksikan penggantian domain ketiga assessment dari math menjadi comprehension, dengan rasionalisasi bahwa tiga domain assessment seharusnya Reading (Recognition), Spelling (Decoding), dan Comprehension.

Kode aktual di js/assessment.js menunjukkan ASSESSMENT_QUESTIONS hanya memiliki dua domain: reading dan spelling, terbagi rata 2 soal per level untuk 6 level (12 soal total). Tidak ada domain comprehension. domainInfo di renderAssessmentQuestion() hanya memetakan reading dan spelling.

Ini bisa dibaca sebagai dua kemungkinan: Prompt 5 belum dieksekusi sama sekali, atau Prompt 5 dieksekusi dengan keputusan akhir berbeda (2 domain dianggap cukup representatif untuk fokus penelitian disleksia membaca permulaan, comprehension dianggap di luar scope assessment awal meski relevan untuk Modul Membaca).

### Kondisi Target

Tidak ada perubahan kode yang dipaksakan di sini. Sesuai arahan sebelumnya, ini didokumentasikan sebagai keputusan final, bukan utang teknis, KECUALI jika setelah ditinjau ternyata 2 domain dianggap tidak representatif.

Pertimbangan untuk menjaga 2 domain (reading dan spelling saja):

1. Konsisten dengan Batasan Penelitian BAB I yang menyatakan fokus pada early reading skills, di mana decoding (spelling/mengeja) dan recognition (reading/membaca) adalah dua pilar utama Simple View of Reading (Gough & Tunmer, 1986)
2. Comprehension sebagai komponen kedua Simple View of Reading lebih relevan untuk level 5-6 (Membaca Kalimat, Kelancaran Membaca) yang sudah tercakup dalam soal level5 dan level6 existing, meski tidak diberi label domain comprehension secara eksplisit

Pertimbangan untuk menambah domain comprehension:

1. Memberi data profiling yang lebih kaya untuk Saran Cerdas AI di halaman Capaian
2. Selaras dengan dokumentasi DEVELOPMENT_PROMPTS.md yang sudah ditulis sebelumnya, sehingga tidak ada dokumen yang menyesatkan pembaca di kemudian hari

### Kriteria Penerimaan

1. CLAUDE.md dan/atau DEVELOPMENT_PROMPTS.md diperbarui untuk mencerminkan keputusan final (2 domain dipertahankan, ATAU comprehension ditambahkan)
2. Jika keputusan adalah mempertahankan 2 domain, Prompt 5 di DEVELOPMENT_PROMPTS.md diberi catatan "SUPERSEDED - keputusan akhir: 2 domain dipertahankan, lihat SDD.md REQ-ASMT-01" agar tidak membingungkan pembaca dokumen di masa depan
3. Tidak ada perubahan kode jika keputusan adalah mempertahankan kondisi saat ini

### Prioritas

P2. Murni dokumentasi, tidak ada dampak fungsional langsung terhadap validasi yang sudah selesai.

---

## 9. Ringkasan Urutan Eksekusi yang Disarankan

Urutan ini memperhitungkan dependency antar requirement. REQ yang lebih awal menjadi fondasi bagi REQ berikutnya.

| Urutan | REQ ID | Alasan Urutan |
|--------|--------|----------------|
| 1 | REQ-AI-01, REQ-AI-02 | Fondasi seluruh fitur AI. Tanpa ini, REQ-DATA-01/02 (yang menyertakan imagePrompt untuk Imagen) tidak bisa diuji end to end |
| 2 | REQ-DATA-01, REQ-DATA-02 | Mengisi konten 6 level. Membutuhkan AI config yang sudah benar untuk uji generateImage per kata baru |
| 3 | REQ-LVL-02 (refactor getReadingSentencesByLevel/getSpellingWordsByLevel) | Bergantung pada REQ-DATA-01/02 sudah tersedia sebagai sumber data |
| 4 | REQ-HL-01 | Independen dari yang lain, bisa dikerjakan paralel, tetapi disarankan setelah konten 6 level stabil agar pengujian highlight memakai kalimat final, bukan kalimat placeholder |
| 5 | REQ-LVL-03, REQ-LVL-04 | Keputusan dokumentasi, bisa dikerjakan kapan saja, idealnya setelah REQ-DATA selesai agar keputusan didasarkan pada konten yang sudah final |
| 6 | REQ-PROG-01 | Perubahan UI kecil, tidak bergantung pada yang lain |
| 7 | REQ-SEC-01 | Sebaiknya dikerjakan setelah REQ-AI-01/02 selesai, karena unifikasi config membuat penggantian key menjadi satu titik perubahan |
| 8 | REQ-ASMT-01 | Dokumentasi murni, bisa dikerjakan kapan saja, tidak mendesak |

---

## 10. Glosarium Singkatan

| Singkatan | Kepanjangan | Konteks |
|-----------|-------------|---------|
| VAKT | Visual, Auditory, Kinesthetic, Tactile | Pendekatan multisensori, Birsh (2018) |
| ADDIE | Analysis, Design, Development, Implementation, Evaluation | Model pengembangan, Branch (2010) |
| SLD | Specific Learning Disabilities | DSM-5, American Psychiatric Association (2022) |
| ZPD | Zone of Proximal Development | Vygotsky (1978) |
| TTS | Text-to-Speech | Web Speech API |
| STT | Speech-to-Text | Web Speech API, fitur "Baca (Rekam)" |
| WCAG | Web Content Accessibility Guidelines | W3C (2023), versi 2.2 |

---

**Dokumen ini terakhir diperbarui**: Juni 2026
**Versi**: 1.0
**Dasar audit**: index.html, css/style.css, ai-config.js, ai-service.js, seluruh js/*.js per commit yang dilampirkan ke sesi ini
