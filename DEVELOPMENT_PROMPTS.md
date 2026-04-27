# 🎯 DYSCARE Development Prompts

Kumpulan prompt siap pakai untuk Claude Code di VS Code.
Semua prompt sudah disesuaikan dengan proposal post-revisi seminar proposal.

> **Cara Pakai**: Copy seluruh blok prompt yang relevan, paste ke chat Claude Code di VS Code, lalu tekan Enter. Claude akan otomatis membaca `CLAUDE.md` di root project sebagai context.

> **Urutan Eksekusi yang Disarankan**: Mulai dari **PROMPT 0** (setup), lalu lanjut ke **PROMPT 1** dan seterusnya secara berurutan.

---

## 📑 DAFTAR PROMPT

| # | Nama Prompt | Tujuan | Estimasi Waktu |
|---|-------------|--------|----------------|
| 0 | Setup & Backup | Persiapan repo + git branch | 5 menit |
| 1 | Branding & Title Alignment | Update title, meta, tagline | 15 menit |
| 2 | Hide Modul Non-Disleksia | Hide Menulis & Berhitung | 30 menit |
| 3 | Refactor Sistem 6 Level | Implementasi 6 level Task Analysis | 2 jam |
| 4 | Refactor Kriteria Naik Level | ≥80% akurasi × 3 sesi | 1.5 jam |
| 5 | Pre-Assessment Refocus | 12 soal khusus disleksia | 1 jam |
| 6 | Label VAKT Eksplisit | Tambah label V/A/K/T di UI | 30 menit |
| 7 | Konten 6 Level | Buat dataset reading + spelling per level | 2 jam |
| 8 | Storyboard Compliance Check | Verifikasi sesuai Lampiran 1 | 30 menit |
| 9 | Validation Readiness | Persiapan sebelum kirim ke validator | 1 jam |
| 10 | Final Polish | Bug fix + UX improvements | 1-2 jam |

**TOTAL ESTIMASI**: 10-12 jam efektif

---

## PROMPT 0: SETUP & BACKUP

```
Saya mau memulai pengembangan DYSCARE sesuai proposal post-revisi seminar proposal.

Tolong baca dulu CLAUDE.md di root project untuk memahami:
1. Ground truth proposal yang sudah diujikan dan direvisi
2. Arsitektur kode current
3. Aturan editing yang harus dipatuhi

Setelah itu, lakukan:

1. Cek status git current dengan menjalankan `git status` dan `git branch --list`
2. Buat backup branch dengan format `backup/before-development-YYYYMMDD` dari kondisi current
3. Push backup branch ke remote
4. Kembali ke main branch
5. Buat working branch baru bernama `feature/proposal-alignment`
6. Verifikasi semua file utama ada (index.html, css/style.css, dan semua file di js/)

Setelah selesai, beri saya laporan singkat tentang:
- Status backup berhasil atau tidak
- Working branch sudah aktif
- File apa saja yang ada di project
- Apa rencana eksekusi untuk task-task selanjutnya

JANGAN melakukan perubahan kode apapun di tahap ini, hanya setup dan verifikasi.
```

---

## PROMPT 1: BRANDING & TITLE ALIGNMENT

```
Lakukan alignment branding DYSCARE dengan judul proposal post-revisi.

JUDUL FINAL PROPOSAL:
"Pengembangan Media Pembelajaran Interaktif Berbasis Web DYSCARE dengan Pendekatan Multisensori VAKT untuk Meningkatkan Keterampilan Membaca Permulaan Anak Disleksia Kelas Rendah Sekolah Dasar"

TUGAS:

1. Update di file index.html:
   - Tag <title>: ubah menjadi "DYSCARE - Media Pembelajaran Membaca Permulaan untuk Anak Disleksia"
   - Tambahkan meta description yang merujuk pada proposal
   - Tambahkan meta keywords yang relevan: disleksia, membaca permulaan, multisensori VAKT, adaptive learning
   - Tambahkan meta author dengan nama M. Alwan Farhan dan afiliasi PLB UNESA 2026

2. Update branding di Home Screen index.html:
   - Heading utama: tetap "DYSCARE" (uppercase semua)
   - Subtitle baris 1: "Media Pembelajaran Membaca Permulaan untuk Anak Disleksia"
   - Subtitle baris 2: "Pendekatan Multisensori VAKT × Adaptive Learning"

3. Update copyright di css/style.css:
   - Ubah body::after content menjadi "© 2026 DYSCARE - M. Alwan Farhan | PLB UNESA"

4. Update User Guide section di index.html:
   - Section "Tentang DYSCARE": tulis ulang dengan paragraf yang merujuk pada:
     a. Fokus penelitian (disleksia perkembangan, anak SD kelas rendah)
     b. Pendekatan VAKT (Visual, Auditory, Kinesthetic, Tactile)
     c. Adaptive Learning rule-based dengan AI content variation
     d. Landasan teori Simple View of Reading (Gough & Tunmer, 1986)
   - Section "Wawasan Fitur": update list fitur dengan label akademik yang konsisten dengan proposal
   - Section "Tata Cara Penggunaan": tulis dalam bentuk numbered list 6 langkah

ATURAN:
- TIDAK BOLEH menggunakan tanda emdash (—) atau titik koma (;) di teks UI
- Gunakan bahasa Indonesia ramah anak untuk teks yang akan dilihat anak
- Gunakan bahasa Indonesia formal akademik untuk teks di User Guide

VERIFIKASI:
Setelah selesai, jalankan grep untuk pastikan tidak ada string lama "DysCare" (mixed case) yang masih tersisa:
grep -rn "DysCare" --include="*.html" --include="*.css" --include="*.js" .

Beri laporan ke saya hasil verifikasi tersebut.
```

---

## PROMPT 2: HIDE MODUL NON-DISLEKSIA (MENULIS & BERHITUNG)

```
Lakukan hiding pada Modul Menulis dan Berhitung tanpa menghapus kode JS-nya.

JUSTIFIKASI AKADEMIK (untuk komentar di kode):
Sesuai dengan Bab III proposal post-revisi, Task Analysis 6 Level Membaca Permulaan TIDAK menyertakan modul Menulis dan Berhitung. Kedua modul ini berada di luar scope penelitian fase ini yang fokus pada disleksia perkembangan. Storyboard di Lampiran 1 yang masih menampilkan 4 modul adalah rancangan awal sebelum Task Analysis difinalisasi di Bab III.

TUGAS:

1. Di file index.html pada Home Screen:
   - Card "Menulis": ubah onclick dari navigateTo('writing-screen') menjadi showComingSoonAlert('Menulis')
   - Tambahkan badge orange "SEGERA" di pojok kanan atas card
   - Beri opacity 60% pada icon untuk visual cue
   - Ubah subtitle menjadi "Pengembangan Tahap Berikutnya"
   - Lakukan hal yang sama untuk card "Berhitung"

2. Di file js/utils.js:
   - Tambahkan fungsi baru showComingSoonAlert(moduleName)
   - Fungsi ini menampilkan modal info dengan:
     - Title: "🚧 Modul {moduleName}"
     - Pesan menjelaskan bahwa modul tersebut adalah pengembangan tahap berikutnya
     - Pesan menjelaskan bahwa fokus penelitian saat ini adalah membaca permulaan untuk anak disleksia
     - Mention bahwa modul Menulis dan Berhitung akan dikembangkan setelah modul utama divalidasi

3. Di file css/style.css:
   - Tambahkan styling .coming-soon-card untuk efek visual yang konsisten
   - Tambahkan overlay tipis pada card yang di-hide

4. Update User Guide di index.html:
   - Tambahkan poin di "Tata Cara Penggunaan" yang menjelaskan modul Menulis dan Berhitung akan tersedia di pengembangan tahap berikutnya

ATURAN PENTING:
- JANGAN menghapus file js/writing.js dan js/math.js
- JANGAN menghapus screen writing-screen dan math-screen di index.html
- JANGAN mengubah loading order script di bagian bottom index.html
- Modul tetap tersimpan di kode untuk continuation di tahap berikutnya

VERIFIKASI:
1. Buka aplikasi di browser
2. Klik card Menulis: harus muncul modal Coming Soon (BUKAN navigasi ke writing-screen)
3. Klik card Berhitung: harus muncul modal Coming Soon (BUKAN navigasi ke math-screen)
4. Klik card Membaca: harus tetap navigasi ke reading-screen
5. Klik card Mengeja: harus tetap navigasi ke spelling-screen
6. Buka Console DevTools: tidak ada error

Berikan saya screenshot atau laporan teks dari hasil testing tersebut.
```

---

## PROMPT 3: REFACTOR SISTEM 6 LEVEL TASK ANALYSIS

```
Refactor sistem level dari 3 tier (Easy/Medium/Hard) menjadi 6 level Task Analysis sesuai proposal Bab III.

REFERENSI PROPOSAL:
6 Level Task Analysis berbasis Simple View of Reading (Gough & Tunmer, 1986):

Level 1 - Pengenalan Huruf (Letter Recognition)
   Sub-keterampilan: identifikasi A-Z, bedakan b/d p/q m/w u/n, vokal vs konsonan
   Modul utama: Mengeja (drag-drop huruf)

Level 2 - Kesadaran Fonologis (Phonological Awareness)
   Sub-keterampilan: bunyi huruf individual, fonem awal/tengah/akhir, vokal a/i/u/e/o
   Modul utama: Membaca (TTS per huruf, latihan fonik)

Level 3 - Blending (Penggabungan Bunyi)
   Sub-keterampilan: KV (ba), KV-KV (ba+ju=baju), KVK (k+u+d+a=kuda)
   Modul utama: Mengeja (susun huruf jadi kata)

Level 4 - Pengenalan Kata (Word Recognition)
   Sub-keterampilan: kata KV-KV bermakna (ibu, buku), kata KVK (kuda, roti), sight words
   Modul utama: Mengeja dengan gambar pendukung

Level 5 - Membaca Kalimat Sederhana
   Sub-keterampilan: kalimat 3-4 kata, pemahaman literal
   Modul utama: Membaca cerita AI dengan word highlighting

Level 6 - Kelancaran Membaca (Reading Fluency)
   Sub-keterampilan: paragraf 2-3 kalimat dengan akurasi + intonasi + kecepatan
   Modul utama: Membaca dengan STT evaluation

TUGAS:

1. File js/config.js:
   - Restructure LEVEL_CONFIG menjadi 6 level
   - Setiap level memiliki: name, emoji, color, taskAnalysis (deskripsi singkat sub-keterampilan), hint
   - Threshold untuk versi current sementara pakai akumulasi poin (akan direfaktor di Prompt 4 berikutnya)

2. File js/level.js:
   - Update calculateLevel() untuk mendukung 6 level
   - Update getReadingSentencesByLevel() untuk pakai key sentencesL1-sentencesL6
   - Update getSpellingWordsByLevel() untuk pakai key wordsL1-wordsL6
   - Update getLevelAwarePrompt() dengan deskripsi level yang sesuai 6 level
   - Update renderLevelBadge() untuk warna dan label 6 level
   - Update updateLevelIndicator() dengan progression dots 6 titik

3. File css/style.css:
   - Tambah class .level-badge-l1 sampai .level-badge-l6 dengan warna gradient hijau ke ungu

4. File index.html pada progress-screen:
   - Update Level Indicator dengan struktur baru yang menampilkan:
     - Level number dan nama
     - Task analysis description
     - Hint untuk naik level
     - 6 progression dots untuk visualisasi

ATURAN:
- Setiap fungsi yang diubah HARUS punya komentar JSDoc dengan referensi ke Bab III proposal
- Mention Gough & Tunmer (1986) dan Cooper et al. (2020) di komentar fungsi level
- Pertahankan backward compatibility: jika ada appState dengan currentLevel 1-3, mapping ke level 1-2 di sistem baru

CATATAN: Konten dataset (sentences dan words) per level akan diisi di Prompt 7 berikutnya. Untuk sekarang, cukup buat empty array di state.js sebagai placeholder.

VERIFIKASI:
1. Buka Console DevTools, ketik appState.currentLevel
2. Pastikan output adalah angka 1-6
3. Cek tampilan Progress Screen, harus muncul 6 dots progression
4. Pastikan tidak ada error tentang sentencesEasy/Medium/Hard yang missing
```

---

## PROMPT 4: REFACTOR KRITERIA NAIK LEVEL JADI ≥80% AKURASI × 3 SESI

```
Refactor mekanisme naik level dari akumulasi poin menjadi akurasi per sesi sesuai proposal Bab III.

KRITERIA SESUAI PROPOSAL:
"Kriteria penguasaan yang digunakan adalah pencapaian minimal 80% akurasi pada tiga sesi latihan berturut-turut di setiap level."

JUSTIFIKASI AKADEMIK:
Sistem ini sesuai prinsip mastery learning (Cooper, Heron, & Heward, 2020) dan Zone of Proximal Development (Vygotsky, 1978). Anak harus menunjukkan penguasaan konsisten (3 sesi) sebelum diperkenalkan dengan materi yang lebih kompleks, sehingga mengurangi cognitive overload (Sweller, 1988).

DEFINISI:
- 1 sesi = 5-10 attempts pada satu modul (Membaca atau Mengeja) di level saat ini
- Akurasi sesi = (jawaban benar / total attempts) × 100%
- Sesi minimum: 5 attempts (kalau kurang dari 5, sesi tidak dihitung)
- Akurasi tracking dilakukan PER LEVEL, jadi saat naik level, counter akurasi reset

TUGAS:

1. File js/state.js:
   - Tambahkan property baru di appState:
     ```
     sessionTracker: {
         currentSession: {
             attempts: [],          // array {correct: bool, module: 'reading'|'spelling', timestamp}
             startedAt: null,
             completed: false
         },
         completedSessions: [],     // array {level, accuracy, completedAt}
         consecutivePasses: 0       // counter sesi berturut-turut yang ≥80%
     }
     ```

2. File js/storage.js:
   - Tambahkan saveSessionTracker() dan loadSessionTracker()
   - Tambahkan key STORAGE_KEYS.SESSIONS = 'dyscareSessions'

3. File js/level.js:
   - Buat fungsi baru: recordAttempt(moduleType, isCorrect)
     - Catat attempt ke currentSession.attempts
     - Cek apakah sesi sudah complete (≥5 attempts)
     - Jika complete, panggil completeCurrentSession()
   - Buat fungsi baru: completeCurrentSession()
     - Hitung akurasi
     - Push ke completedSessions
     - Cek apakah ≥80%, jika ya increment consecutivePasses
     - Jika consecutivePasses ≥3, panggil promoteToNextLevel()
     - Jika tidak ≥80%, reset consecutivePasses ke 0
     - Reset currentSession untuk sesi berikutnya
   - Buat fungsi baru: promoteToNextLevel()
     - Naikkan appState.currentLevel
     - Reset consecutivePasses ke 0
     - Show level up modal
   - REPLACE fungsi lama checkLevelUp() yang berbasis poin

4. File js/reading.js dan js/spelling.js:
   - Saat user jawab benar, panggil recordAttempt('reading'/'spelling', true)
   - Saat user jawab salah, panggil recordAttempt('reading'/'spelling', false)
   - HAPUS panggilan appState.progress.reading += 10 yang berbasis poin

5. File js/progress.js:
   - Update updateProgressUI() untuk menampilkan:
     - Akurasi sesi current (jika ada attempts)
     - Riwayat sesi terakhir (3 sesi terakhir)
     - Counter consecutive passes (X dari 3 sesi)
     - Indikator visual: berapa sesi lagi sampai naik level

6. File index.html pada progress-screen:
   - Update layout untuk menampilkan akurasi per sesi (BUKAN poin per modul)
   - Tampilkan progress bar yang menunjukkan progress menuju 3 sesi consecutive
   - Tampilkan riwayat sesi terakhir dengan akurasi-nya

ATURAN:
- JANGAN menghapus kompletely sistem poin lama, simpan sebagai legacy field di appState.progress
- Property appState.progress.reading dan .spelling tetap di-maintain untuk backward compatibility tampilan
- Tambahkan komentar JSDoc detail untuk setiap fungsi baru, mention Cooper et al. (2020) dan Vygotsky (1978)

VERIFIKASI:
1. Buka Console DevTools dan jalankan beberapa attempts:
   - recordAttempt('reading', true) sebanyak 5 kali
   - Cek appState.sessionTracker.completedSessions, harus ada 1 sesi dengan akurasi 100%
   - Cek consecutivePasses, harus 1
2. Jalankan 5 attempts lagi dengan 4 benar 1 salah
   - Akurasi sesi: 80% (pas batas)
   - consecutivePasses harus 2
3. Jalankan 5 attempts lagi dengan 5 benar
   - consecutivePasses harus 3
   - Modal Level Up harus muncul
   - Level naik ke level berikutnya
   - consecutivePasses reset ke 0
```

---

## PROMPT 5: PRE-ASSESSMENT REFOCUS UNTUK DISLEKSIA SAJA

```
Refocus pre-assessment 12 soal yang saat ini berisi 4 reading + 4 spelling + 4 math menjadi 12 soal yang relevan untuk profiling disleksia.

JUSTIFIKASI AKADEMIK:
Pre-assessment dalam DYSCARE bertujuan untuk diagnostic placement, sesuai prinsip dynamic assessment (Vygotsky, 1978). Karena fokus penelitian adalah disleksia membaca permulaan, soal Berhitung yang sebelumnya mengukur diskalkulia perlu diganti dengan soal yang mengukur sub-skill membaca yang ketiga: pemahaman bacaan (comprehension), sehingga ketiga domain assessment menjadi:
1. Reading (Recognition) - pengenalan kata
2. Spelling (Decoding) - susun huruf
3. Comprehension - pemahaman makna

TUGAS:

1. File js/assessment.js:
   - Replace ASSESSMENT_QUESTIONS.math dengan ASSESSMENT_QUESTIONS.comprehension
   - Buat 4 soal pemahaman bacaan dengan tipe yang sesuai untuk anak SD kelas rendah:
     a. Soal 1: Identifikasi kategori (mana kata yang artinya HEWAN dari pilihan: meja, kucing, pintu, buku) → answer: KUCING
     b. Soal 2: Pemahaman konteks ("Ibu sedang memasak. Apa yang dimasak ibu?" dengan emoji 🍚) → answer: NASI
     c. Soal 3: Lawan kata (lawan dari BESAR adalah?) → answer: KECIL
     d. Soal 4: Asosiasi suara-makna (Hewan apa yang berkata "guk guk"? dengan emoji 🐕) → answer: ANJING

   - Update initAssessment() untuk menggunakan domain comprehension
   - Update domainInfo mapping
   - Update calculateAssessmentResult() untuk track scores comprehension (bukan math)
   - Update domainName mapping
   - Update threshold persentase untuk mapping ke 6 level (BUKAN 3 level lagi)

2. Mapping persentase ke 6 level entry:
   - ≥92% (11-12 benar) → Level 5 Membaca Kalimat
   - ≥75% (9-10 benar) → Level 4 Pengenalan Kata
   - ≥58% (7-8 benar) → Level 3 Blending
   - ≥42% (5-6 benar) → Level 2 Kesadaran Fonologis
   - <42% (0-4 benar) → Level 1 Pengenalan Huruf

3. File js/config.js:
   - Update ASSESSMENT_CONFIG untuk dukung threshold 6 level
   - Tambahkan komentar JSDoc panjang yang menjelaskan rasionalisasi pemetaan persentase

4. File js/assessment.js pada renderAssessmentSummary():
   - Update tampilan domainRows untuk reflect domain baru:
     - Reading (Recognition) - color blue
     - Spelling (Decoding) - color green
     - Comprehension (Pemahaman) - color orange (BUKAN purple lagi)

5. File index.html pada assessment-screen:
   - Pastikan progress bar tetap menampilkan "Soal X dari 12"
   - Pastikan domain badge berfungsi (📖 Membaca, 🔤 Susun Huruf, 🧠 Pemahaman)

ATURAN:
- Setiap soal harus mendukung pendekatan VAKT: ada visual (emoji/teks), audio (TTS button), kinesthetic (tap to answer)
- Bahasa soal harus ramah anak, tidak ada istilah teknis
- Hindari pertanyaan ambigu yang punya lebih dari satu jawaban benar

VERIFIKASI:
1. Reset localStorage di Console DevTools: localStorage.clear()
2. Refresh halaman
3. Pre-assessment 12 soal harus muncul
4. Lewati 12 soal dengan jawaban random
5. Pastikan layar selesai menampilkan level yang sesuai (1-5, tidak 1-3 seperti sebelumnya)
6. Buka Profile screen
7. Ringkasan skrining harus menampilkan 3 domain: Reading, Spelling, Comprehension
```

---

## PROMPT 6: LABEL VAKT EKSPLISIT DI UI

```
Tambahkan label VAKT (Visual, Auditory, Kinesthetic, Tactile) yang eksplisit di setiap aktivitas pembelajaran agar penilaian ahli media dapat mengidentifikasi penerapan multisensori dengan jelas.

REFERENSI PROPOSAL:
Bab III dan instrumen ahli media butir 7-9 (aspek multisensori) menyebut bahwa penilaian akan dilakukan terhadap "Ketersediaan elemen visual, auditori, dan kinestetik". Untuk memudahkan identifikasi, setiap elemen UI yang merepresentasikan modalitas tertentu harus diberi label yang konsisten.

CONVENTION LABEL:
- Visual (V) → ikon mata atau gambar
- Auditory (A) → ikon speaker atau telinga
- Kinesthetic (K) → ikon tangan menggerakkan
- Tactile (T) → ikon jari menyentuh

TUGAS:

1. File index.html pada reading-screen:
   - Di reading-controls, tambahkan label kecil pada setiap tombol:
     - Tombol "Dengar" → label "Auditory" dengan ikon 👂
     - Tombol "Baca (Rekam)" → label "Kinesthetic" dengan ikon 🎤
     - Tombol "Buat Cerita" → label "Visual" dengan ikon 👁
   - Di bawah controls, tambahkan baris ringkasan modalitas:
     "Visual: lihat kalimat | Auditory: dengar pelafalan | Kinesthetic: rekam suara | Tactile: sentuh layar"

2. File index.html pada spelling-screen:
   - Tambahkan baris ringkasan modalitas di bawah header:
     "Visual: gambar AI | Auditory: dengar kata | Kinesthetic: drag huruf | Tactile: tap"
   - Pada btn-spell-listen, tambahkan tooltip "Auditory: dengar pelafalan kata"
   - Pada drop zone, tambahkan tooltip "Kinesthetic: drag huruf ke sini"

3. File index.html pada User Guide:
   - Update Wawasan Fitur dengan satu poin yang menjelaskan implementasi VAKT secara eksplisit:
     "Pendekatan Multisensori VAKT: Anak belajar melalui empat jalur indera secara terpadu, yaitu Visual (gambar dan teks), Auditory (Text-to-Speech bahasa Indonesia), Kinesthetic (gerakan drag huruf dan rekam suara), serta Tactile (sentuhan layar)."

4. File css/style.css:
   - Tambah utility class .vakt-label dengan styling pill kecil
   - Variants: .vakt-visual, .vakt-auditory, .vakt-kinesthetic, .vakt-tactile dengan warna berbeda

5. Komentar di kode:
   - Pada setiap fungsi handler tombol di reading.js dan spelling.js, tambah komentar JSDoc yang mention modalitas yang di-trigger
   - Contoh:
     /**
      * Handler tombol rekam suara - implementasi modalitas Kinesthetic
      * Sesuai pendekatan multisensori VAKT (Birsh, 2018)
      */

ATURAN:
- Label VAKT harus konsisten di seluruh aplikasi
- Warna untuk setiap modalitas harus konsisten:
  - Visual: blue
  - Auditory: orange
  - Kinesthetic: green
  - Tactile: purple
- Label tidak boleh terlalu mencolok agar tidak mengganggu pengalaman anak

VERIFIKASI:
1. Buka reading-screen, pastikan setiap tombol punya label modalitas yang jelas
2. Buka spelling-screen, pastikan ringkasan VAKT muncul
3. Hover setiap tombol, pastikan tooltip menjelaskan modalitas yang di-trigger
4. Buka User Guide, pastikan section VAKT komprehensif
```

---

## PROMPT 7: KONTEN DATASET 6 LEVEL READING + SPELLING

```
Buat dataset konten pembelajaran untuk modul Membaca dan Mengeja di setiap dari 6 level Task Analysis.

REFERENSI PROPOSAL Bab III:
Setiap level memiliki sub-keterampilan spesifik yang perlu dilatih. Konten harus progresif dari sederhana ke kompleks dengan pendekatan scaffolding (Vygotsky, 1978).

PRINSIP PENYUSUNAN KONTEN:
1. Bahasa: Indonesia, kosakata familiar untuk anak SD kelas 1-3
2. Hindari kata yang mengandung hambatan visual disleksia (b/d, p/q yang sulit dibedakan) di level awal
3. Mulai dari kata-kata frekuensi tinggi (sight words)
4. Gunakan tema sehari-hari: keluarga, hewan, makanan, sekolah, mainan

TUGAS:

1. File js/state.js, restructure modul reading menjadi 6 level:

   Level 1 (sentencesL1) - Pengenalan Huruf:
   - Format: huruf-huruf vokal/konsonan dasar yang ditampilkan terpisah
   - Contoh: "a i u", "b a c a", "m a m a", "p a p a"
   - Minimal 8 entries

   Level 2 (sentencesL2) - Kesadaran Fonologis:
   - Format: suku kata terbuka KV
   - Contoh: "ba bi bu", "ka ki ku", "ma mi mu"
   - Minimal 8 entries

   Level 3 (sentencesL3) - Blending menjadi Kata:
   - Format: kata 2 suku kata KV-KV
   - Contoh: "ibu", "buku", "meja", "topi", "kuda", "roti"
   - Minimal 10 entries

   Level 4 (sentencesL4) - Pengenalan Kata Kompleks:
   - Format: kata 3+ suku kata atau kata KVK
   - Contoh: "sepatu", "pelangi", "kacamata", "mainan", "sekolah", "matahari"
   - Minimal 10 entries

   Level 5 (sentencesL5) - Frasa dan Kalimat Pendek:
   - Format: frasa 2-3 kata bermakna
   - Contoh: "ibu masak", "adik main bola", "kakak sekolah"
   - Minimal 10 entries

   Level 6 (sentencesL6) - Kalimat Utuh dengan SPOK:
   - Format: kalimat 4-6 kata dengan struktur lengkap
   - Contoh: "ibu memasak nasi di dapur", "adik bermain bola di halaman"
   - Minimal 10 entries

2. File js/state.js, restructure modul spelling menjadi 6 level:

   Level 1 (wordsL1) - Pengenalan Huruf 2 huruf:
   - Format: kata sangat sederhana dengan 2 huruf
   - Contoh: { word: "ya", imagePrompt: "anak mengangguk kartun", fallbackEmoji: "✅" }
   - Minimal 5 entries

   Level 2 (wordsL2) - 3 huruf:
   - Format: kata 3 huruf KV-V atau V-KV
   - Contoh: ibu, api, air, ulu, iya
   - Minimal 6 entries

   Level 3 (wordsL3) - 4 huruf KV-KV:
   - Format: kata 4 huruf dengan pola KV-KV
   - Contoh: apel, buku, ikan, meja, susu
   - Minimal 8 entries

   Level 4 (wordsL4) - 5 huruf:
   - Format: kata 5 huruf dengan kombinasi pola
   - Contoh: pisang, gajah, kursi, balon, mobil, pensil
   - Minimal 8 entries

   Level 5 (wordsL5) - 6 huruf:
   - Format: kata 6 huruf
   - Contoh: sepatu, jendela, bintang, boneka, gunung
   - Minimal 8 entries

   Level 6 (wordsL6) - 7+ huruf:
   - Format: kata kompleks 7+ huruf
   - Contoh: kacamata, pelangi, kupukupu, matahari, sekolahan
   - Minimal 6 entries

3. Untuk setiap entry spelling, struktur object:
   ```
   {
       word: "string",                          // kata target (lowercase)
       imagePrompt: "string",                   // prompt untuk Imagen API
       fallbackEmoji: "emoji",                  // fallback jika AI image gagal
       phonetic: "string",                      // pelafalan (opsional, untuk TTS)
       category: "string"                       // kategori tema (opsional)
   }
   ```

4. Tambahkan komentar JSDoc di setiap level array yang menjelaskan:
   - Sub-keterampilan yang dilatih
   - Referensi ke Bab III proposal

ATURAN PENTING:
- HINDARI kata-kata dengan huruf yang sulit dibedakan disleksia (b vs d, p vs q) di Level 1-2
- Setiap kata HARUS bisa diilustrasikan secara konkret
- Gunakan kata yang relevan dengan kehidupan anak Indonesia (rendang, bukan pizza misalnya untuk konteks lokal)
- Pastikan imagePrompt jelas dan deskriptif untuk hasil Imagen yang baik
- imagePrompt HARUS dalam bahasa Inggris karena Imagen lebih akurat dengan English prompt

VERIFIKASI:
1. Buka Console: Object.keys(appState.reading) harus include sentencesL1 sampai sentencesL6
2. Buka Console: Object.keys(appState.spelling) harus include wordsL1 sampai wordsL6
3. Setiap array harus punya jumlah minimum sesuai spec di atas
4. Test di tiap level: navigate ke reading-screen dan spelling-screen, pastikan konten muncul sesuai level
```

---

## PROMPT 8: STORYBOARD COMPLIANCE CHECK

```
Verifikasi bahwa implementasi DYSCARE sudah selaras dengan Storyboard di Lampiran 1 proposal post-revisi (kecuali untuk modul yang sengaja di-hide).

STORYBOARD DI LAMPIRAN 1:

1. Beranda Utama:
   "Pengguna membuka aplikasi dan melihat 4 menu utama: Membaca, Menulis, Mengeja, dan Berhitung. Tombol besar memudahkan navigasi anak."
   STATUS: 4 menu masih ada (Menulis & Berhitung di-hide dengan badge SEGERA)

2. Modul Membaca Disleksia:
   "Anak mendengarkan cerita dengan sorotan kata per kata (word highlight). Merekam suara untuk evaluasi ketepatan membaca otomatis via Speech-to-Text."
   STATUS: TTS ada, STT ada. Cek apakah word highlighting sudah implemented.

3. Modul Mengeja Visual:
   "Anak melihat gambar atau mendengar suara, lalu menyusun huruf acak menjadi kata yang benar. AI membuat tantangan kata baru dari tema tertentu."
   STATUS: Drag-drop sudah ada, AI image sudah ada. Cek apakah AI generative untuk kata baru sudah ada.

4. Panel Aksesibilitas:
   "Orang tua atau guru mengaktifkan font OpenDyslexic, menyesuaikan ukuran teks, kontras, dan kecerahan layar sesuai kebutuhan visual anak."
   STATUS: Sudah ada di accessibility.js

5. Profil Pengguna:
   "Anak atau orang tua memasukkan nama panggilan untuk personalisasi pengalaman belajar. Data tersimpan lokal."
   STATUS: Sudah ada di profile-screen

6. Capaian & Progress:
   "Orang tua atau guru memantau poin kemajuan di tiga area. Fitur Saran Cerdas AI memberikan rekomendasi latihan berikutnya berdasarkan data progres anak."
   STATUS: Progress bar sudah ada, AI advice sudah ada. Cek apakah "tiga area" perlu di-update karena modul Menulis dan Berhitung di-hide.

TUGAS:

1. Lakukan compliance audit dengan membaca:
   - File index.html (semua screen)
   - File js/reading.js, spelling.js, accessibility.js, progress.js
   - File js/storage.js (untuk data persistence)

2. Buat laporan dalam format markdown dengan struktur:
   ```
   # Storyboard Compliance Report

   ## ✅ COMPLIANT
   - [list fitur yang sudah sesuai storyboard dengan referensi file:line]

   ## ⚠️ PARTIAL
   - [list fitur yang ada tapi belum sempurna, dengan saran perbaikan]

   ## ❌ MISSING
   - [list fitur yang belum ada dan perlu diimplementasikan]

   ## 🔧 ACTION ITEMS
   1. [prioritas tinggi: harus diperbaiki sebelum validasi]
   2. [prioritas sedang: nice to have]
   3. [prioritas rendah: future improvement]
   ```

3. Khusus untuk fitur "Word Highlighting" di Modul Membaca:
   - Cek apakah saat TTS bermain, kata yang sedang dibacakan punya highlight visual
   - Jika belum ada, ini adalah ACTION ITEM prioritas tinggi karena disebut eksplisit di storyboard DAN di rubric ahli media butir 13

4. Khusus untuk "Tiga Area" di Capaian:
   - Storyboard menyebut "tiga area" tapi modul Menulis dan Berhitung di-hide
   - Cek apakah area di Capaian sekarang adalah:
     a. Reading (membaca) - YES
     b. Spelling (mengeja) - YES
     c. ??? - perlu didefinisikan
   - Saran: ganti area ketiga jadi "Comprehension" atau "Overall Mastery" yang merepresentasikan capaian gabungan

5. Khusus untuk Modul Menulis dan Berhitung yang di-hide:
   - Storyboard masih menampilkan kedua modul, tapi kode sudah hide
   - Pastikan ada justifikasi tertulis (di User Guide atau di komentar kode) yang menjelaskan ini adalah keputusan post-revisi proposal
   - Kalau perlu, tambah footnote di README atau dokumentasi

ATURAN:
- Laporan harus objective, sebut file:line untuk setiap claim
- Action items harus actionable, bukan abstrak
- Prioritaskan compliance dengan rubric penilaian ahli media (lebih konkrit dibanding storyboard)

OUTPUT:
Tulis laporan ini ke file COMPLIANCE_REPORT.md di root project.
```

---

## PROMPT 9: VALIDATION READINESS CHECK

```
Persiapkan DYSCARE untuk dikirim ke validator (Ahli Media + Ahli Materi + Praktisi).

REFERENSI PROPOSAL:
Lampiran 2-4 proposal berisi instrumen penilaian dengan total ~50 indikator. Aplikasi harus memenuhi indikator-indikator ini agar validator dapat menilai dengan akurat.

INDIKATOR KUNCI YANG HARUS LULUS (dari Lampiran 2 - Ahli Media):

A. Aspek Tampilan (6 butir):
- Tampilan menarik untuk anak 5-10 tahun
- Desain sesuai kebutuhan disleksia
- Gambar/ilustrasi sesuai materi pengenalan huruf, blending, membaca kata
- Gambar dan ikon jelas
- Pilihan warna nyaman untuk disleksia visual
- Font OpenDyslexic dan ukuran teks tepat

B. Aspek Aksesibilitas (4 butir):
- Pengatur ukuran teks Normal/Sedang/Besar berfungsi
- Pengatur kontras berfungsi
- Font OpenDyslexic mengurangi rotasi/inversi huruf
- Layout proporsional

C. Aspek Audio Multimedia (3 butir):
- TTS jelas pada modul Membaca
- Suara TTS dan efek sesuai konteks disleksia
- Word highlighting mendukung sinkronisasi visual-auditori

D. Aspek Interaktivitas (3 butir):
- Animasi tidak berlebihan
- Aktivitas susun huruf, drag-drop responsif
- Aktivitas Level 3 Blending interaktif

E. Aspek Fitur AI (3 butir):
- Cek Tulisan AI akurat dan sesuai (CATATAN: ini di modul Menulis yang di-hide)
- Generatif AI menghasilkan konten bervariasi
- Saran AI di Capaian relevan

F. Aspek Pengoperasian (4 butir):
- Navigasi mudah untuk anak 6-12 tahun
- Bisa digunakan berulang dengan konten variatif
- Aksesibilitas lintas perangkat (PC, tablet, smartphone)
- Dashboard Capaian jelas

TUGAS:

1. Lakukan systematic check setiap indikator dengan running aplikasi di:
   - Chrome desktop (1920x1080)
   - Chrome mobile emulator (iPhone 14 Pro, Galaxy S20)
   - Firefox desktop
   - Safari (jika tersedia)

2. Buat checklist VALIDATION_CHECKLIST.md di root project:
   ```
   # Validation Readiness Checklist

   ## A. Aspek Tampilan
   - [ ] A1: Tampilan menarik 5-10 tahun (CHECKED on Chrome Desktop)
   - [ ] A2: Desain disleksia-friendly
   - [ ] A3: Gambar Level 1, 3, 4 sesuai
   - [ ] A4: Gambar dan ikon jelas
   - [ ] A5: Warna nyaman
   - [ ] A6: Font OpenDyslexic dan size tepat

   ... dan seterusnya untuk semua 22 butir
   ```

3. Untuk setiap butir yang FAIL atau PARTIAL, buat issue dengan:
   - Description: apa yang missing
   - Severity: critical / major / minor
   - Suggested fix
   - File yang perlu diubah

4. Khusus untuk Word Highlighting (Aspek C butir 13):
   - Jika belum implemented, IMPLEMENTASIKAN di reading.js
   - Saat speakText() dipanggil, highlight kata yang sedang dibacakan dengan background kuning
   - Gunakan SpeechSynthesisUtterance dengan event onboundary untuk timing yang akurat
   - Hapus highlight saat TTS selesai

5. Khusus untuk Cek Tulisan AI (Aspek E butir 17):
   - Modul Menulis sedang di-hide. Pastikan rubric ini tidak akan blocker.
   - Tulis di catatan untuk validator: "Modul Menulis di-hide pada fase ini. Indikator E17 diaplikasikan untuk fitur AI lain (variasi materi, saran capaian)."

6. Buat dokumen panduan validator GUIDE_FOR_VALIDATORS.md:
   - URL akses aplikasi
   - Cara reset progress untuk testing fresh
   - Penjelasan fitur per modul yang di-evaluate
   - Catatan tentang modul yang di-hide
   - Kontak peneliti

7. Cross-browser testing:
   - Buat tabel kompatibilitas
   - Note jika ada feature yang hanya jalan di browser tertentu (misal STT hanya di Chrome)

ATURAN:
- Setiap claim harus didukung evidence (screenshot atau steps to reproduce)
- Issue critical HARUS difix sebelum kirim ke validator
- Issue major sebaiknya difix, kalau tidak buatlah workaround documentation
- Issue minor bisa dimention sebagai "future improvement" di laporan

OUTPUT:
1. VALIDATION_CHECKLIST.md (status semua 22+ butir)
2. ISSUES.md (list issues yang ditemukan)
3. GUIDE_FOR_VALIDATORS.md (panduan untuk validator)
```

---

## PROMPT 10: FINAL POLISH

```
Lakukan final polish DYSCARE sebelum demo sidang dan kirim ke validator.

CHECKLIST POLISH:

1. UX Improvements:
   - Loading state yang smooth (skeleton loader, bukan spinner blank)
   - Empty states yang informatif (saat tidak ada data)
   - Error states yang ramah anak (jika AI gagal load)
   - Success states yang motivating (sound + animation)
   - Hover states yang konsisten

2. Performance:
   - Cek Network tab DevTools, pastikan tidak ada request yang gagal
   - Cek Console, pastikan tidak ada warning atau error
   - Image lazy loading (jika ada banyak gambar)
   - Compress assets jika ada yang besar

3. Accessibility (WCAG 2.2):
   - Semantic HTML: pakai <button> bukan <div onclick>
   - Alt text untuk semua gambar
   - aria-label untuk tombol icon-only
   - Focus visible saat keyboard navigation
   - Color contrast minimum 4.5:1 untuk text

4. Bug Fixes:
   - Test edge case: anak skip pre-assessment, langsung mainkan modul
   - Test edge case: localStorage penuh atau corrupted
   - Test edge case: API key invalid atau quota exceeded
   - Test edge case: koneksi internet putus saat AI request
   - Test edge case: orientasi landscape vs portrait di mobile

5. Polishing UI:
   - Consistency check: semua tombol punya transition yang sama
   - Spacing consistent di semua screen (gunakan tailwind spacing scale)
   - Typography hierarchy jelas (h1 > h2 > h3 > body)
   - Color palette tidak ada deviasi dari brand-blue dan brand-yellow

6. Content Polish:
   - Cek typo di semua teks bahasa Indonesia
   - Cek konsistensi istilah (jangan mix "user" dan "anak", pilih satu)
   - Pastikan tidak ada placeholder text yang lupa diganti
   - Cek emoji rendering konsisten di semua browser

7. Documentation:
   - README.md di root: deskripsi project, cara install, cara run
   - LICENSE file (MIT atau sejenis)
   - CHANGELOG.md untuk track perubahan

8. Pre-Demo Test:
   - Test full flow dari awal: clear localStorage → pre-assessment → 6 level reading → 6 level spelling
   - Test reset progress functionality
   - Test toggle aksesibilitas (font, ukuran, kontras, kecerahan)
   - Test profile save dan load
   - Test AI features: TTS, STT, Imagen, Gemini text gen, Gemini Vision

TUGAS:
Lakukan checklist di atas secara sistematis. Untuk setiap item:
- Identifikasi apakah sudah baik atau perlu improvement
- Lakukan fix jika perlu
- Document di POLISH_LOG.md apa saja yang sudah diperbaiki

ATURAN:
- Polish boleh subjektif tapi harus konsisten
- Jangan over-engineer di tahap ini, cukup raih "good enough" untuk demo dan validasi
- Performance optimization jangan terlalu agresif yang malah introduce bug

OUTPUT:
1. Aplikasi yang sudah di-polish
2. POLISH_LOG.md detail perubahan
3. Final demo video (optional, kalau punya OBS atau Loom)
```

---

## 🚀 BONUS: PROMPT TROUBLESHOOTING

Gunakan prompt ini jika ada error yang tidak terselesaikan:

```
Saya menemukan error di DYSCARE: [DESKRIPSI ERROR]

Tolong:
1. Baca CLAUDE.md untuk memahami arsitektur project
2. Identifikasi file dan fungsi yang relevan dengan error ini
3. Reproduce error dengan menjalankan kode di browser
4. Berikan analisis root cause
5. Berikan 2-3 alternatif solusi dengan trade-off masing-masing
6. Tunggu konfirmasi saya sebelum implement solusi yang dipilih

JANGAN langsung edit kode tanpa diskusi. Berikan saya pemahaman dulu.
```

---

## 🎓 BONUS: PROMPT UNTUK MENULIS LAPORAN BAB IV

Setelah pengembangan selesai dan validator memberi feedback, gunakan prompt ini untuk membantu nulis Bab IV (Hasil dan Pembahasan):

```
Saya sudah menyelesaikan pengembangan DYSCARE dan mendapat hasil dari validator. Tolong bantu saya tulis Bab IV.

KONTEKS:
- Lihat CLAUDE.md untuk memahami project
- Saya akan attach file hasil validasi: [attach file]

TUGAS:
1. Baca hasil validasi
2. Hitung persentase kelayakan per aspek
3. Tulis Bab IV dengan struktur:
   A. Hasil Pengembangan
      1. Hasil Tahap Analysis
      2. Hasil Tahap Design
      3. Hasil Tahap Development
   B. Hasil Uji Kelayakan
      1. Penilaian Ahli Media
      2. Penilaian Ahli Materi
      3. Penilaian Praktisi
   C. Pembahasan
      1. Pengembangan Produk
      2. Kelayakan Produk
      3. Implikasi Pendidikan

ATURAN:
- Bahasa Indonesia akademik formal
- Hindari emdash dan titik koma
- Setiap claim akademik harus didukung referensi yang VALID
- Format APA 7th edition
- Gunakan referensi yang sudah ada di proposal (jangan tambah yang baru kecuali sangat perlu)
- 100% human writing, hindari frasa-frasa yang khas AI
```

---

**File ini terakhir diupdate**: April 2026
**Versi**: 1.0
**Author**: M. Alwan Farhan untuk DYSCARE Development
