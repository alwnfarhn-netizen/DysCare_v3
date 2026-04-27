# CLAUDE.md - DYSCARE Development Context

> File ini otomatis dibaca Claude Code di setiap sesi. JANGAN dihapus.
> Update file ini setiap kali ada perubahan signifikan pada proposal atau arsitektur.

---

## 📌 IDENTITAS PROYEK

**Nama Proyek**: DYSCARE
**Judul Penelitian**: Pengembangan Media Pembelajaran Interaktif Berbasis Web DYSCARE dengan Pendekatan Multisensori VAKT untuk Meningkatkan Keterampilan Membaca Permulaan Anak Disleksia Kelas Rendah Sekolah Dasar
**Peneliti**: M. Alwan Farhan (NIM 22010044125)
**Program Studi**: S1 Pendidikan Luar Biasa
**Fakultas**: Fakultas Ilmu Pendidikan
**Universitas**: Universitas Negeri Surabaya (UNESA)
**Tahun**: 2026
**Dosen Pembimbing**: Ima Kurrotun Ainin, M.Pd.
**Penguji 1**: Dr. Asri Wijiastuti, M.Pd.
**Penguji 2**: Ni Made Marlin Minarsih, S.Pd., M.Pd.

**URL Production**: https://alwnfarhn-netizen.github.io/DysCare_v3/
**Lokasi Penelitian**: SDN Menur Pumpungan, Surabaya

---

## 🎯 GROUND TRUTH (Tidak Boleh Diubah Tanpa Konfirmasi)

Section ini berisi keputusan-keputusan kunci dari proposal post-revisi yang sudah diujikan di seminar proposal. Setiap kode yang ditulis HARUS konsisten dengan poin-poin di bawah ini.

### Fokus Penelitian

1. **Single-target disability**: HANYA disleksia perkembangan (developmental dyslexia)
2. **Single-target skill**: HANYA membaca permulaan (early reading skills)
3. **Target user**: Anak SD kelas rendah (kelas 1-3, usia 6-9 tahun)
4. **Lingkup ADDIE**: Hanya Analysis, Design, Development. TIDAK termasuk Implementation dan Evaluation.
5. **Validasi**: Ahli Media + Ahli Materi + Praktisi (tidak ada user testing pada anak)

### 6 Level Task Analysis (Berbasis Simple View of Reading - Gough & Tunmer 1986)

Sistem pembelajaran DIBAGI menjadi 6 level progresif. Setiap level memiliki tujuan dan sub-keterampilan yang spesifik.

| Level | Nama | Fokus | Aktivitas DYSCARE |
|-------|------|-------|---------------------|
| 1 | Pengenalan Huruf (Letter Recognition) | Identifikasi huruf A-Z, bedakan b/d p/q m/w u/n | Modul Mengeja: drag-drop huruf, TTS nama huruf |
| 2 | Kesadaran Fonologis (Phonological Awareness) | Bunyi huruf, fonem awal-tengah-akhir | Modul Membaca: TTS per huruf, latihan fonik |
| 3 | Blending (Penggabungan Bunyi) | KV, KV-KV, KVK | Modul Mengeja: susun huruf, cerita AI sederhana |
| 4 | Pengenalan Kata (Word Recognition) | Baca kata bermakna KV-KV, KVK, sight words | Modul Mengeja: gambar pendukung, AI generatif |
| 5 | Membaca Kalimat Sederhana | Kalimat 3-4 kata, pemahaman literal | Modul Membaca: cerita AI dengan word highlighting |
| 6 | Kelancaran Membaca (Reading Fluency) | Akurasi + intonasi + kecepatan, paragraf 2-3 kalimat | Modul Membaca: STT evaluation, cerita AI variatif |

### Kriteria Adaptive Learning (CRITICAL)

**Naik level**: Anak harus mencapai **≥80% akurasi pada 3 sesi latihan berturut-turut** di level saat ini.

INI BERBEDA dengan implementasi current yang menggunakan akumulasi poin (50, 100). Sistem akumulasi poin adalah peninggalan versi awal yang HARUS direfaktor menjadi sistem akurasi-per-sesi.

**Mekanisme adaptive yang DIPAKAI**:

1. Rule-based progression berdasarkan akurasi
2. AI-generated content variation untuk variasi materi
3. Direct feedback berdasarkan respons pengguna
4. Rekomendasi latihan berbasis pola skor

**Mekanisme adaptive yang TIDAK dipakai** (hanya disebut di Bab II sebagai konsep teoretis):

- Bayesian Knowledge Tracing (BKT)
- Item Response Theory (IRT)
- Reinforcement Learning (RL)

### Modul yang Aktif vs Tidak Aktif

| Modul | Status | Justifikasi |
|-------|--------|-------------|
| **Membaca** | ✅ AKTIF | Modul utama untuk Level 2, 5, 6 |
| **Mengeja (Susun Huruf)** | ✅ AKTIF | Modul utama untuk Level 1, 3, 4 |
| **Menulis** | 🚫 HIDE | Disgrafia di luar scope penelitian fase ini |
| **Berhitung** | 🚫 HIDE | Diskalkulia di luar scope penelitian fase ini |

CATATAN PENTING: Storyboard di Lampiran 1 proposal MASIH menampilkan 4 modul, namun ini adalah rancangan awal sebelum Task Analysis 6 Level di-finalize di Bab III. **Bab III adalah ground truth final**, sehingga Modul Menulis dan Berhitung di-hide tanpa menghapus kode (untuk pengembangan tahap berikutnya).

### Pendekatan Multisensori VAKT

Setiap modul HARUS mengintegrasikan empat modalitas:

- **V (Visual)**: Gambar AI, teks, ikon, animasi, word highlighting
- **A (Auditory)**: Text-to-Speech (TTS) bahasa Indonesia, efek suara
- **K (Kinesthetic)**: Drag-and-drop, perekaman suara (STT), gestur
- **T (Tactile)**: Sentuhan layar untuk interaksi (touch-friendly)

Setiap aktivitas pembelajaran HARUS mencantumkan label VAKT yang relevan secara eksplisit di UI agar penilaian ahli media dapat mengidentifikasi penerapan multisensori dengan jelas.

### Aksesibilitas (WCAG 2.2 + Anak Disleksia)

- Font OpenDyslexic sebagai opsi (toggle on/off)
- Pengaturan ukuran teks (Normal/Besar/Ekstra)
- Pengaturan kontras (Normal/Tinggi/Maksimal)
- Pengaturan kecerahan (Normal/Terang/Redup)
- Warna latar yang ramah disleksia (cream/krem)
- Spacing antar huruf dan kata yang lebih longgar saat font OpenDyslexic aktif

---

## 🏗️ ARSITEKTUR KODE

### Struktur File

```
DysCare_v3/
├── index.html              # Entry point, semua screen
├── css/
│   └── style.css           # Styling global + modul-specific
└── js/
    ├── config.js           # API keys, konstanta global, threshold
    ├── state.js            # Global appState, konten per level
    ├── utils.js            # Helper umum (modal, SFX, navigasi, TTS)
    ├── storage.js          # localStorage management
    ├── accessibility.js    # Panel pengaturan aksesibilitas
    ├── ai.js               # Integrasi Gemini (text, vision, image)
    ├── level.js            # Engine adaptive learning + 6 level
    ├── assessment.js       # Pre-assessment 12 soal diagnostik
    ├── reading.js          # Modul Membaca (Level 2, 5, 6)
    ├── spelling.js         # Modul Mengeja (Level 1, 3, 4)
    ├── writing.js          # Modul Menulis (HIDDEN, di-preserve untuk future)
    ├── math.js             # Modul Berhitung (HIDDEN, di-preserve untuk future)
    ├── progress.js         # Halaman capaian dengan progress bar + AI advice
    └── main.js             # Entry point, routing awal
```

### Urutan Loading Script (di index.html)

Urutan ini PENTING karena setiap file punya dependency. JANGAN diubah tanpa pemahaman penuh:

```
config.js → state.js → utils.js → storage.js → accessibility.js
→ ai.js → level.js → assessment.js → reading.js → writing.js
→ spelling.js → math.js → progress.js → main.js
```

### Konvensi Penamaan

- **File JS**: lowercase tanpa hyphen (`reading.js`, bukan `reading-module.js`)
- **CSS class**: kebab-case (`level-badge`, bukan `levelBadge`)
- **JS function**: camelCase (`loadReadingContent`, bukan `load_reading_content`)
- **Constant**: UPPER_SNAKE_CASE (`API_KEY`, `LEVEL_CONFIG`)
- **DOM ID**: kebab-case (`reading-screen`, bukan `readingScreen`)
- **Komentar Bahasa**: Indonesia untuk komentar fungsional, Inggris untuk istilah teknis

### Konvensi Komentar untuk Justifikasi Akademik

Setiap fungsi atau modul yang berhubungan dengan teori pembelajaran HARUS punya komentar yang merujuk pada referensi proposal. Contoh:

```javascript
/**
 * Hitung level berdasarkan akurasi sesi.
 *
 * Kriteria naik level: ≥80% akurasi pada 3 sesi berturut-turut.
 * Justifikasi: Sesuai Task Analysis Bab III proposal yang merujuk
 * pada Cooper, Heron, & Heward (2020) tentang mastery learning.
 */
```

Komentar seperti ini SANGAT MEMBANTU saat sidang karena penguji bisa langsung melihat keterkaitan kode dengan proposal.

---

## 🛠️ STACK TEKNOLOGI

- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript (ES6+)
- **CSS Framework**: Tailwind CSS via CDN
- **Icon**: Font Awesome 6.4
- **Font**: Poppins (default) + OpenDyslexic (opsi disleksia)
- **AI Integration**: Google Gemini API (text + vision + Imagen)
- **Storage**: Browser localStorage (no backend)
- **Hosting**: GitHub Pages (static site)
- **Speech**: Web Speech API (TTS + STT)
- **Audio**: Web Audio API (untuk SFX synthetic)

### Constraint Penting

1. **No Backend**: Semua state disimpan di localStorage. Tidak ada database, tidak ada server.
2. **No Build Step**: Static HTML/CSS/JS yang langsung di-deploy ke GitHub Pages.
3. **Vanilla JS**: TIDAK MENGGUNAKAN React, Vue, Angular. Tetap vanilla untuk kemudahan deployment dan modifikasi.
4. **API Key**: Disimpan di `config.js` yang harus di-gitignore atau diisi manual saat deploy.

---

## 📋 ATURAN KETIKA MENGEDIT KODE

### Prioritas Pengeditan

1. **JANGAN MENGHAPUS KODE LAMA** kecuali eksplisit diminta. Modul Menulis dan Berhitung tetap dipertahankan untuk future development.
2. **JANGAN MENGUBAH STRUKTUR FILE** tanpa konfirmasi. Pertahankan modular separation.
3. **JANGAN MENGGUNAKAN LIBRARY BARU** tanpa diskusi. Project ini sengaja minimal dependencies.
4. **JANGAN MENGUBAH API endpoint** atau model Gemini tanpa konfirmasi. Saat ini menggunakan `gemini-2.5-flash-preview-09-2025` dan `imagen-4.0-generate-001`.

### Saat Menemukan Konflik Antara Kode dan Proposal

Jika ada perbedaan antara kode current dan proposal:

1. Proposal post-revisi (BAB III) adalah ground truth untuk arsitektur dan algoritma
2. Storyboard di Lampiran adalah rancangan awal, BISA berbeda dengan implementasi final
3. Kode current sudah memiliki struktur yang baik, jadi PRIORITASKAN refactor dibanding rewrite
4. Saat ragu, TANYAKAN ke pengguna sebelum mengubah perilaku fundamental

### Backup Strategy

Sebelum melakukan perubahan signifikan:

```bash
# Buat branch backup
git checkout -b backup/before-<task-name>-$(date +%Y%m%d)

# Kembali ke main untuk kerja
git checkout main

# Buat working branch baru
git checkout -b feature/<task-name>

# Commit secara incremental per logical change
```

---

## ✅ DEFINITION OF DONE

Sebuah perubahan dianggap selesai HANYA JIKA memenuhi semua kriteria berikut:

1. ✅ Kode sudah ditulis dan disimpan
2. ✅ Tidak ada error di Console DevTools
3. ✅ Sudah ditest secara manual di Chrome Desktop
4. ✅ Sudah ditest secara manual di Chrome Mobile (DevTools mobile view)
5. ✅ Komentar akademik sudah ditambahkan untuk fungsi-fungsi penting
6. ✅ Konsisten dengan ground truth di file ini
7. ✅ Tidak melanggar aturan di section "Aturan Ketika Mengedit Kode"

---

## 🎓 KONTEKS AKADEMIK UNTUK CLAUDE

### Bahasa & Tone

- **Bahasa untuk peneliti**: Bahasa Indonesia formal akademik
- **Bahasa untuk anak (UI)**: Bahasa Indonesia santai dan ramah anak
- **Diksi**: Hindari emdash dan titik koma. Gunakan koma dan titik biasa.
- **Penggunaan istilah teknis**: Selalu beri terjemahan Indonesia setelah istilah Inggris pertama kali muncul. Contoh: "Text-to-Speech (Pengubah Teks ke Suara)"

### Karakter Pengguna

Alwan adalah mahasiswa S1 PLB UNESA yang:

- Mengejar nilai A dan IPK tinggi
- Suka penelitian berlandaskan masalah nyata
- Tidak suka skripsi yang terlalu generik atau terlalu sempit
- Berambisi menjadi mahasiswa berprestasi
- Sangat berhati-hati dengan misinformasi karena akan diuji oleh dosen penguji

### Tugas Claude di Project Ini

Claude bertindak sebagai mentor akademik dan developer pendamping yang:

1. Memberikan kode yang konsisten dengan proposal
2. Menyertakan justifikasi akademik dalam komentar kode
3. Memberi tahu jika ada perubahan yang berisiko bertentangan dengan proposal
4. Menggunakan referensi yang valid dan dapat ditelusuri
5. Tidak mengarang sumber atau referensi
6. Memprioritaskan kualitas dibanding kecepatan delivery

---

## 📚 REFERENSI INTI YANG DIPAKAI DI PROPOSAL

Saat menulis komentar akademik di kode, gunakan referensi-referensi ini yang sudah ada di Daftar Pustaka proposal:

- Gough, P. B., & Tunmer, W. E. (1986). Decoding, reading, and reading disability. — **Simple View of Reading**
- Branch, R. M. (2010). Instructional Design: The ADDIE Approach. — **Model ADDIE**
- Cooper, J. O., Heron, T. E., & Heward, W. L. (2020). Applied Behavior Analysis. — **Task Analysis**
- Vygotsky, L. S. (1978). Mind in Society. — **Zone of Proximal Development**
- Mayer, R. E. (2009). Multimedia Learning. — **Cognitive Theory of Multimedia Learning**
- W3C (2023). WCAG 2.2. — **Aksesibilitas Web**
- American Psychiatric Association (2022). DSM-5. — **Definisi Disleksia**
- Snowling, M. J., Hulme, C., & Nation, K. (2020). Defining and understanding dyslexia. — **Karakteristik Disleksia**
- Birsh, J. R. (2018). Multisensory Teaching of Basic Language Skills. — **VAKT Multisensori**
- Contrino et al. (2024). Adaptive learning systems for students with SLD. — **Adaptive Learning untuk SLD**
- Farhah et al. (2025). ALGA-Ed AI-powered learning analytics. — **AI dalam Pendidikan Khusus**

---

**Last Updated**: April 2026
**Versi CLAUDE.md**: 1.0
