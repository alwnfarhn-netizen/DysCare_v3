# 🛠️ ROADMAP PENGEMBANGAN PENYESUAIAN MEDIA WEB DYSCARE
## Susunan Step-by-Step + Timeline + Code Snippets

**M. Alwan Farhan | NIM 22010044125**
**URL Web:** https://alwnfarhn-netizen.github.io/DysCare_v3/
**Tanggal Mulai:** April 2026

---

## 📊 EXECUTIVE SUMMARY

### Total Pengembangan: 3 PHASE

| Phase | Nama | Tujuan | Durasi | Urgency |
|-------|------|--------|--------|---------|
| **PHASE 1** | Soft Revision | Match dengan proposal (basic) | 4-6 jam | 🔴 URGENT (Sebelum Sidang) |
| **PHASE 2** | Implementasi 6 Level Task Analysis | Full alignment dengan Bab III | 3-5 hari | ⚠️ PENTING (Sebelum Validator) |
| **PHASE 3** | Refinement & Polish | Production-ready quality | 1-2 minggu | 🟡 BONUS (Post-Sidang) |

---

# 🚨 PHASE 1: SOFT REVISION (4-6 JAM)

## TUJUAN PHASE 1
Membuat web 80% match dengan proposal **TANPA** rebuild total. Fokus pada:
- ✅ Hide modul yang tidak relevan (Menulis, Berhitung)
- ✅ Update branding & tagline
- ✅ Update wawasan fitur
- ✅ Restructure Capaian Belajar
- ✅ Update skrining (basic)

**Output:** Web yang siap dipresentasikan saat sidang

---

## 📋 STEP-BY-STEP PHASE 1

### **STEP 1.1: Update Title & Meta Tags** ⏱️ 15 menit

#### **Tujuan:**
Update SEO title dan meta tags agar konsisten dengan proposal.

#### **File yang Diubah:**
- `index.html` (atau file utama HTML Anda)

#### **Lokasi:**
Bagian `<head>` di file HTML

#### **Perubahan yang Dilakukan:**

**LAMA:**
```html
<head>
    <title>DysCare - Bantu Belajar Disleksia, Disgrafia & Diskalkulia</title>
    <meta name="description" content="DysCare - Solusi pembelajaran adaptif untuk anak disleksia, disgrafia, dan diskalkulia">
</head>
```

**BARU:**
```html
<head>
    <title>DYSCARE - Media Pembelajaran Membaca Permulaan untuk Anak Disleksia</title>
    <meta name="description" content="DYSCARE - Aplikasi web interaktif dengan pendekatan multisensori VAKT untuk meningkatkan keterampilan membaca permulaan anak disleksia kelas rendah sekolah dasar">
    <meta name="keywords" content="disleksia, membaca permulaan, multisensori, VAKT, pendidikan inklusif, anak berkebutuhan khusus">
    <meta name="author" content="M. Alwan Farhan - PLB UNESA">
</head>
```

#### **Cara Test:**
1. Buka web di browser
2. Lihat tab title → harus "DYSCARE - Media Pembelajaran Membaca Permulaan..."
3. Right-click → View Page Source → cek meta tags

#### **Checklist:**
- [ ] Update `<title>`
- [ ] Update `<meta name="description">`
- [ ] Tambah `<meta name="keywords">`
- [ ] Tambah `<meta name="author">`

---

### **STEP 1.2: Update Tagline & Branding di Beranda** ⏱️ 30 menit

#### **Tujuan:**
Hapus referensi "Disgrafia" dan "Diskalkulia" dari branding utama.

#### **File yang Diubah:**
- `index.html` (bagian header/hero section)
- `style.css` (jika ada styling khusus)

#### **Perubahan yang Dilakukan:**

**LAMA:**
```html
<header>
    <h1>DysCare</h1>
    <p class="tagline">Solusi Disleksia, Disgrafia & Diskalkulia</p>
</header>
```

**BARU:**
```html
<header>
    <h1>DYSCARE</h1>
    <p class="tagline">Media Pembelajaran Membaca Permulaan untuk Anak Disleksia</p>
    <p class="subtagline">dengan Pendekatan Multisensori VAKT & Adaptive Learning</p>
</header>
```

#### **Cara Test:**
1. Buka beranda web
2. Pastikan tagline sudah update
3. Cek tampilan responsive di mobile & desktop

#### **Checklist:**
- [ ] Update tagline utama
- [ ] Tambah subtagline (multisensori VAKT)
- [ ] Cek responsiveness

---

### **STEP 1.3: Hide/Disable Modul Menulis & Berhitung** ⏱️ 1 jam

#### **Tujuan:**
Sembunyikan modul yang tidak relevan dengan proposal. **JANGAN HAPUS** code-nya, cukup hide dengan CSS atau tampilkan sebagai "Coming Soon".

#### **OPSI A: Sembunyikan Sepenuhnya** (Lebih Aman)

**File yang Diubah:**
- `index.html` (bagian menu/navigation)

**Perubahan:**

**LAMA:**
```html
<nav class="main-menu">
    <a href="#beranda">Beranda</a>
    <a href="#membaca">Membaca</a>
    <a href="#menulis">Menulis</a>
    <a href="#mengeja">Mengeja</a>
    <a href="#berhitung">Berhitung</a>
    <a href="#capaian">Capaian</a>
    <a href="#profil">Profil</a>
</nav>
```

**BARU:**
```html
<nav class="main-menu">
    <a href="#beranda">Beranda</a>
    <a href="#membaca">Membaca</a>
    <a href="#mengeja">Latihan Susun Huruf</a>
    <a href="#capaian">Capaian</a>
    <a href="#profil">Profil</a>
</nav>
```

#### **OPSI B: Tampilkan sebagai "Coming Soon"** (Lebih Defensible)

**File yang Diubah:**
- `index.html` (bagian menu)
- `style.css` (untuk styling "Coming Soon")

**Perubahan:**

```html
<nav class="main-menu">
    <a href="#beranda">Beranda</a>
    <a href="#membaca">Membaca</a>
    <a href="#mengeja">Latihan Susun Huruf</a>
    <a href="#menulis" class="coming-soon" onclick="showComingSoonAlert('Menulis'); return false;">
        Menulis <span class="badge">Coming Soon</span>
    </a>
    <a href="#berhitung" class="coming-soon" onclick="showComingSoonAlert('Berhitung'); return false;">
        Berhitung <span class="badge">Coming Soon</span>
    </a>
    <a href="#capaian">Capaian</a>
    <a href="#profil">Profil</a>
</nav>
```

**Tambahan CSS:**

```css
.coming-soon {
    opacity: 0.5;
    cursor: not-allowed;
    position: relative;
}

.coming-soon .badge {
    background: #ff9800;
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 0.7em;
    margin-left: 5px;
}
```

**Tambahan JavaScript:**

```javascript
function showComingSoonAlert(moduleName) {
    alert(
        `Modul "${moduleName}" merupakan future development dari DYSCARE.\n\n` +
        `Penelitian fase Analysis-Design-Development saat ini fokus pada modul Membaca ` +
        `untuk anak disleksia dengan 6 Level Task Analysis.\n\n` +
        `Modul ini akan dikembangkan setelah modul utama divalidasi dan diuji efektivitasnya.`
    );
}
```

#### **REKOMENDASI: GUNAKAN OPSI B (Coming Soon)**

**Alasan:**
1. ✅ Lebih defensible saat sidang ("ini future development")
2. ✅ Menunjukkan vision proposal Anda (ekspansi ke 3 SLD)
3. ✅ Penguji akan apresiasi: "Sudah ada plan masa depan"

#### **Cara Test:**
1. Buka web
2. Klik "Menulis" → harusnya muncul alert "Coming Soon"
3. Klik "Berhitung" → harusnya muncul alert "Coming Soon"
4. Klik "Membaca" → harusnya jalan normal

#### **Checklist:**
- [ ] Pilih opsi A atau B
- [ ] Update navigation menu
- [ ] Test klik setiap menu
- [ ] Pastikan tidak ada yang broken

---

### **STEP 1.4: Update Wawasan Fitur "Tentang DysCare"** ⏱️ 30 menit

#### **Tujuan:**
Update deskripsi web yang masih multi-SLD.

#### **File yang Diubah:**
- `index.html` (bagian Informasi & Panduan)

#### **Perubahan:**

**LAMA:**
```html
<section id="tentang-dyscare">
    <h3>Tentang DysCare</h3>
    <p>Dengan semangat pendidikan inklusif, DysCare by A5NESA menggabungkan teknologi 
    dan pedagogi untuk menciptakan pengalaman belajar yang adaptif bagi anak dengan 
    disleksia. Aplikasi ini bukan hanya alat bantu, tetapi juga jembatan menuju 
    pemahaman, kemandirian, dan kepercayaan diri dalam membaca.</p>
</section>
```

**BARU:**
```html
<section id="tentang-dyscare">
    <h3>Tentang DYSCARE</h3>
    <p><strong>DYSCARE</strong> adalah media pembelajaran berbasis web yang dirancang 
    khusus untuk meningkatkan keterampilan <strong>membaca permulaan</strong> pada 
    anak dengan <strong>disleksia perkembangan</strong> usia 6-12 tahun di kelas 
    rendah sekolah dasar.</p>
    
    <p>Dengan mengintegrasikan <strong>Pendekatan Multisensori VAKT</strong> 
    (Visual-Auditory-Kinesthetic-Tactile), <strong>Adaptive Learning</strong>, dan 
    <strong>6 Level Task Analysis</strong> berbasis Simple View of Reading 
    (Gough & Tunmer, 1986), DYSCARE menyediakan pengalaman belajar yang personal, 
    bertahap, dan responsif terhadap profil hambatan unik setiap anak disleksia.</p>
    
    <p><em>"Setiap anak disleksia berhak mendapatkan akses pembelajaran yang sesuai 
    dengan cara otaknya bekerja."</em></p>
</section>
```

#### **Update Wawasan Fitur:**

**LAMA:**
```html
<ul>
    <li><strong>Pendekatan Multisensori:</strong> Anak belajar dengan melihat visual, 
    mendengar audio (Text-to-Speech), dan menyentuh layar secara bersamaan...</li>
    <li><strong>Font OpenDyslexic:</strong> Huruf dirancang memiliki 'pemberat'...</li>
    <li><strong>Generatif AI:</strong> Menggunakan kecerdasan buatan...</li>
    <li><strong>Adaptive Learning:</strong> Sistem otomatis menyesuaikan tingkat 
    kesulitan materi berdasarkan capaian belajar anak, dari Mudah ke Sedang lalu Sulit.</li>
</ul>
```

**BARU:**
```html
<ul>
    <li><strong>Pendekatan Multisensori VAKT:</strong> 
    Anak belajar membaca dengan mengaktivasi 4 jalur sensorik: <em>Visual</em> 
    (gambar dan huruf dengan font OpenDyslexic), <em>Auditory</em> (Text-to-Speech 
    yang sinkron dengan word highlighting), <em>Kinesthetic</em> (drag-drop huruf, 
    aktivitas interaktif), dan <em>Tactile</em> (sentuhan layar). Pendekatan ini 
    memperkuat encoding memori melalui Dual Coding Theory (Clark & Paivio, 1991).</li>
    
    <li><strong>Font OpenDyslexic:</strong> Huruf dirancang khusus dengan 'pemberat' 
    di bagian bawah untuk mengurangi kesalahan rotasi/inversi huruf cermin (b/d, p/q) 
    yang umum terjadi pada anak disleksia.</li>
    
    <li><strong>6 Level Task Analysis:</strong> Sistem pembelajaran terstruktur 
    berdasarkan task analysis Applied Behavior Analysis: 
    (1) Pengenalan Huruf, (2) Kesadaran Fonologis, (3) Blending, 
    (4) Pengenalan Kata, (5) Membaca Kalimat Sederhana, (6) Reading Fluency.</li>
    
    <li><strong>Adaptive Learning:</strong> Sistem otomatis menyesuaikan tingkat 
    kesulitan materi berdasarkan progres anak di setiap level task analysis 
    (Vygotsky's Zone of Proximal Development), dengan kriteria naik level: 
    ≥80% akurasi pada 3 sesi berturut-turut.</li>
    
    <li><strong>Generatif AI:</strong> Menggunakan kecerdasan buatan untuk menciptakan 
    materi pembelajaran yang tidak terbatas (cerita, gambar, kata baru) sesuai dengan 
    level membaca permulaan anak disleksia.</li>
    
    <li><strong>Asisten Suara Interaktif:</strong> Speech-to-Text untuk evaluasi 
    ketepatan membaca anak secara otomatis di Level 5 (Membaca Kalimat) dan 
    Level 6 (Reading Fluency).</li>
</ul>
```

#### **Update Tata Cara Penggunaan:**

**LAMA:**
```html
<p>Pilih salah satu dari menu utama (Membaca, Menulis, Mengeja, Berhitung, Capaian, 
Profil) di Halaman Utama.</p>
```

**BARU:**
```html
<p><strong>Cara Memulai DYSCARE:</strong></p>
<ol>
    <li>Lakukan <strong>Skrining Awal</strong> untuk menentukan level membaca anak</li>
    <li>Mulai dari <strong>Modul Membaca Level 1 (Pengenalan Huruf)</strong></li>
    <li>Naik level otomatis setelah mencapai ≥80% akurasi pada 3 sesi berturut-turut</li>
    <li>Pantau progres di menu <strong>Capaian Belajar</strong></li>
    <li>Gunakan menu <strong>Latihan Susun Huruf</strong> untuk reinforcement Level 3 (Blending)</li>
</ol>

<p><em>Catatan: Modul Menulis (Disgrafia) dan Berhitung (Diskalkulia) merupakan 
roadmap pengembangan fase berikutnya setelah modul utama (Membaca untuk Disleksia) 
selesai divalidasi.</em></p>
```

#### **Cara Test:**
1. Buka section "Tentang DYSCARE"
2. Cek apakah konten sudah update dan match proposal
3. Cek apakah typography & format masih bagus

#### **Checklist:**
- [ ] Update Tentang DYSCARE
- [ ] Update Wawasan Fitur (6 fitur baru)
- [ ] Update Tata Cara Penggunaan
- [ ] Cek typography
- [ ] Cek responsive di mobile

---

### **STEP 1.5: Update Capaian Belajar Dashboard** ⏱️ 1.5 jam

#### **Tujuan:**
Restructure Capaian Belajar dari "Membaca, Mengeja, Berhitung" menjadi "6 Level Task Analysis Membaca Permulaan".

#### **File yang Diubah:**
- `index.html` (section Capaian)
- `script.js` (logika tracking)

#### **Perubahan HTML:**

**LAMA:**
```html
<section id="capaian">
    <h2>Capaian Belajar</h2>
    <p>Level Kamu Saat Ini</p>
    <div class="level-display">🌱 Mudah</div>
    <p>Kumpulkan 50 poin untuk naik ke Level Sedang</p>
    
    <div class="capaian-list">
        <div class="capaian-item">
            <span>Membaca</span>
            <span class="poin">0 Poin</span>
        </div>
        <div class="capaian-item">
            <span>Mengeja</span>
            <span class="poin">0 Poin</span>
        </div>
        <div class="capaian-item">
            <span>Berhitung</span>
            <span class="poin">0 Poin</span>
        </div>
    </div>
</section>
```

**BARU:**
```html
<section id="capaian">
    <h2>Capaian Belajar Membaca Permulaan</h2>
    
    <div class="current-level-card">
        <p>Level Anda Saat Ini</p>
        <div class="level-display" id="current-task-level">
            <span class="level-emoji">🔤</span>
            <span class="level-name">Level 1: Pengenalan Huruf</span>
        </div>
        <p class="level-description" id="level-description">
            Kuasai pengenalan huruf A-Z dengan akurasi ≥80% pada 3 sesi 
            berturut-turut untuk naik ke Level 2.
        </p>
    </div>
    
    <h3>Progres 6 Level Task Analysis</h3>
    
    <div class="task-analysis-progress">
        <!-- Level 1 -->
        <div class="level-card" id="level-1">
            <div class="level-header">
                <span class="level-icon">🔤</span>
                <span class="level-title">Level 1: Pengenalan Huruf</span>
                <span class="level-status">Sedang Aktif</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
                <span class="progress-text">0% (0/15 aktivitas)</span>
            </div>
            <div class="sub-skills">
                <small>Sub-keterampilan: Identifikasi A-Z, Pembedaan b/d p/q, 
                Vokal vs Konsonan</small>
            </div>
        </div>
        
        <!-- Level 2 -->
        <div class="level-card locked" id="level-2">
            <div class="level-header">
                <span class="level-icon">🔊</span>
                <span class="level-title">Level 2: Kesadaran Fonologis</span>
                <span class="level-status">🔒 Terkunci</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
                <span class="progress-text">Belum dimulai</span>
            </div>
        </div>
        
        <!-- Level 3 -->
        <div class="level-card locked" id="level-3">
            <div class="level-header">
                <span class="level-icon">🧩</span>
                <span class="level-title">Level 3: Blending (Penggabungan Bunyi)</span>
                <span class="level-status">🔒 Terkunci</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
                <span class="progress-text">Belum dimulai</span>
            </div>
        </div>
        
        <!-- Level 4 -->
        <div class="level-card locked" id="level-4">
            <div class="level-header">
                <span class="level-icon">📖</span>
                <span class="level-title">Level 4: Pengenalan Kata</span>
                <span class="level-status">🔒 Terkunci</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
                <span class="progress-text">Belum dimulai</span>
            </div>
        </div>
        
        <!-- Level 5 -->
        <div class="level-card locked" id="level-5">
            <div class="level-header">
                <span class="level-icon">📝</span>
                <span class="level-title">Level 5: Membaca Kalimat Sederhana</span>
                <span class="level-status">🔒 Terkunci</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
                <span class="progress-text">Belum dimulai</span>
            </div>
        </div>
        
        <!-- Level 6 -->
        <div class="level-card locked" id="level-6">
            <div class="level-header">
                <span class="level-icon">🎯</span>
                <span class="level-title">Level 6: Kelancaran Membaca</span>
                <span class="level-status">🔒 Terkunci</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
                <span class="progress-text">Belum dimulai</span>
            </div>
        </div>
    </div>
    
    <div class="kriteria-naik-level">
        <h4>📋 Kriteria Naik Level</h4>
        <p>Anak akan otomatis naik ke level berikutnya setelah mencapai 
        <strong>≥80% akurasi pada 3 sesi berturut-turut</strong> di level saat ini.</p>
    </div>
    
    <div class="ai-suggestion">
        <h4>✨ Saran Cerdas AI</h4>
        <p id="ai-suggestion-text">Sedang menganalisis...</p>
        <button onclick="getAISuggestion()">Saran Cerdas</button>
        <button onclick="resetProgress()">Reset</button>
    </div>
</section>
```

#### **Tambahan CSS:**

```css
.task-analysis-progress {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: 20px 0;
}

.level-card {
    background: white;
    border: 2px solid #4CAF50;
    border-radius: 10px;
    padding: 15px;
    transition: all 0.3s ease;
}

.level-card.locked {
    opacity: 0.5;
    border-color: #ccc;
    background: #f5f5f5;
}

.level-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.level-icon {
    font-size: 1.5em;
}

.level-title {
    flex: 1;
    font-weight: bold;
}

.level-status {
    background: #4CAF50;
    color: white;
    padding: 4px 8px;
    border-radius: 5px;
    font-size: 0.85em;
}

.level-card.locked .level-status {
    background: #999;
}

.progress-bar {
    background: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    height: 25px;
}

.progress-fill {
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
    height: 100%;
    transition: width 0.5s ease;
}

.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #333;
    font-size: 0.85em;
    font-weight: bold;
}

.sub-skills {
    margin-top: 8px;
    color: #666;
    font-size: 0.85em;
}

.kriteria-naik-level {
    background: #fff3cd;
    border-left: 4px solid #ff9800;
    padding: 15px;
    border-radius: 5px;
    margin: 20px 0;
}

.kriteria-naik-level h4 {
    margin-top: 0;
    color: #ff6f00;
}
```

#### **Tambahan JavaScript:**

```javascript
// Initialize 6 Level Task Analysis tracking
const taskAnalysisLevels = {
    level1: { 
        name: "Pengenalan Huruf", 
        progress: 0, 
        unlocked: true,
        activities: 15
    },
    level2: { 
        name: "Kesadaran Fonologis", 
        progress: 0, 
        unlocked: false,
        activities: 12
    },
    level3: { 
        name: "Blending", 
        progress: 0, 
        unlocked: false,
        activities: 18
    },
    level4: { 
        name: "Pengenalan Kata", 
        progress: 0, 
        unlocked: false,
        activities: 20
    },
    level5: { 
        name: "Membaca Kalimat", 
        progress: 0, 
        unlocked: false,
        activities: 15
    },
    level6: { 
        name: "Reading Fluency", 
        progress: 0, 
        unlocked: false,
        activities: 10
    }
};

function updateLevelProgress(levelKey, completedActivities) {
    const level = taskAnalysisLevels[levelKey];
    if (!level) return;
    
    const percentage = (completedActivities / level.activities) * 100;
    level.progress = percentage;
    
    // Update UI
    const levelCard = document.getElementById(levelKey.replace('level', 'level-'));
    if (levelCard) {
        const progressFill = levelCard.querySelector('.progress-fill');
        const progressText = levelCard.querySelector('.progress-text');
        
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${Math.round(percentage)}% (${completedActivities}/${level.activities} aktivitas)`;
    }
    
    // Auto unlock next level if 80% threshold reached
    if (percentage >= 80) {
        unlockNextLevel(levelKey);
    }
}

function unlockNextLevel(currentLevelKey) {
    const levelOrder = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6'];
    const currentIndex = levelOrder.indexOf(currentLevelKey);
    
    if (currentIndex !== -1 && currentIndex < levelOrder.length - 1) {
        const nextLevelKey = levelOrder[currentIndex + 1];
        taskAnalysisLevels[nextLevelKey].unlocked = true;
        
        // Update UI
        const nextLevelCard = document.getElementById(nextLevelKey.replace('level', 'level-'));
        if (nextLevelCard) {
            nextLevelCard.classList.remove('locked');
            const status = nextLevelCard.querySelector('.level-status');
            status.textContent = '🆕 Tersedia';
        }
        
        // Show level up notification
        showLevelUpNotification(nextLevelKey);
    }
}

function showLevelUpNotification(levelKey) {
    const level = taskAnalysisLevels[levelKey];
    alert(`🎉 Selamat!\n\nKamu naik ke ${level.name}!\nLevel baru sudah terbuka.`);
}
```

#### **Cara Test:**
1. Buka section Capaian
2. Cek apakah 6 Level tampil
3. Cek progress bar berfungsi
4. Test simulasi: anggap user sudah complete Level 1
5. Pastikan Level 2 auto-unlock

#### **Checklist:**
- [ ] Update HTML Capaian section
- [ ] Tambah CSS styling
- [ ] Implementasi JS tracking
- [ ] Test progress bar
- [ ] Test auto-unlock level
- [ ] Test responsive

---

### **STEP 1.6: Update Skrining Awal** ⏱️ 1 jam

#### **Tujuan:**
Update skrining 12 soal untuk fokus DISLEKSIA + level membaca permulaan.

#### **File yang Diubah:**
- `index.html` (modal skrining)
- `script.js` (logika skrining + scoring)

#### **Perubahan Konten Skrining:**

**LAMA:** 12 soal multi-SLD (disleksia, disgrafia, diskalkulia)

**BARU:** 12 soal khusus disleksia + level membaca permulaan

**Soal yang Direkomendasikan:**

```javascript
const skriningSoal = [
    // Level 1: Pengenalan Huruf (4 soal)
    {
        id: 1,
        kategori: "Pengenalan Huruf",
        pertanyaan: "Tunjukkan huruf 'b' di antara pilihan berikut:",
        opsi: ["d", "b", "p", "q"],
        jawabanBenar: 1,
        levelMapping: 1
    },
    {
        id: 2,
        kategori: "Pengenalan Huruf",
        pertanyaan: "Mana huruf vokal di bawah ini?",
        opsi: ["k", "n", "a", "t"],
        jawabanBenar: 2,
        levelMapping: 1
    },
    {
        id: 3,
        kategori: "Pengenalan Huruf",
        pertanyaan: "Bedakan huruf cermin: Mana 'p' yang benar?",
        opsi: ["q", "p", "b", "d"],
        jawabanBenar: 1,
        levelMapping: 1
    },
    {
        id: 4,
        kategori: "Pengenalan Huruf",
        pertanyaan: "Sebutkan nama huruf: M",
        opsi: ["em", "we", "en", "we"],
        jawabanBenar: 0,
        levelMapping: 1
    },
    
    // Level 2: Kesadaran Fonologis (3 soal)
    {
        id: 5,
        kategori: "Kesadaran Fonologis",
        pertanyaan: "Apa bunyi awal dari kata 'bola'?",
        opsi: ["b", "o", "l", "a"],
        jawabanBenar: 0,
        levelMapping: 2
    },
    {
        id: 6,
        kategori: "Kesadaran Fonologis",
        pertanyaan: "Apa bunyi akhir dari kata 'sapi'?",
        opsi: ["s", "a", "p", "i"],
        jawabanBenar: 3,
        levelMapping: 2
    },
    {
        id: 7,
        kategori: "Kesadaran Fonologis",
        pertanyaan: "Bunyi mana yang sama? 'pagi' dan ___",
        opsi: ["sapi", "buku", "ibu", "ayah"],
        jawabanBenar: 0,
        levelMapping: 2
    },
    
    // Level 3: Blending (2 soal)
    {
        id: 8,
        kategori: "Blending",
        pertanyaan: "Gabungkan bunyi: b + a = ?",
        opsi: ["ab", "ba", "bab", "aab"],
        jawabanBenar: 1,
        levelMapping: 3
    },
    {
        id: 9,
        kategori: "Blending",
        pertanyaan: "Gabungkan suku kata: ku + da = ?",
        opsi: ["dak", "kuda", "kud", "kada"],
        jawabanBenar: 1,
        levelMapping: 3
    },
    
    // Level 4: Pengenalan Kata (2 soal)
    {
        id: 10,
        kategori: "Pengenalan Kata",
        pertanyaan: "Pilih kata yang benar untuk gambar 🐄:",
        opsi: ["sapi", "kuda", "ayam", "ikan"],
        jawabanBenar: 0,
        levelMapping: 4
    },
    {
        id: 11,
        kategori: "Pengenalan Kata",
        pertanyaan: "Baca kata: 'ibu' artinya?",
        opsi: ["ayah", "ibu", "kakak", "adik"],
        jawabanBenar: 1,
        levelMapping: 4
    },
    
    // Level 5: Membaca Kalimat (1 soal)
    {
        id: 12,
        kategori: "Membaca Kalimat",
        pertanyaan: "Baca kalimat: 'Saya makan nasi.' Apa yang dimakan?",
        opsi: ["roti", "nasi", "kue", "buah"],
        jawabanBenar: 1,
        levelMapping: 5
    }
];

function calculateSkriningResult(jawaban) {
    const levelScores = {
        level1: 0,
        level2: 0,
        level3: 0,
        level4: 0,
        level5: 0
    };
    
    const levelMaxScores = {
        level1: 4,
        level2: 3,
        level3: 2,
        level4: 2,
        level5: 1
    };
    
    skriningSoal.forEach((soal, index) => {
        if (jawaban[index] === soal.jawabanBenar) {
            const levelKey = `level${soal.levelMapping}`;
            levelScores[levelKey]++;
        }
    });
    
    // Tentukan level awal anak
    let recommendedLevel = 'level1';
    
    if (levelScores.level1 >= 3 && levelScores.level2 >= 2) {
        recommendedLevel = 'level2';
    }
    if (levelScores.level1 >= 4 && levelScores.level2 >= 2 && levelScores.level3 >= 1) {
        recommendedLevel = 'level3';
    }
    if (levelScores.level1 >= 4 && levelScores.level2 >= 3 && levelScores.level3 >= 2) {
        recommendedLevel = 'level4';
    }
    if (levelScores.level4 >= 2) {
        recommendedLevel = 'level5';
    }
    
    return {
        levelScores: levelScores,
        recommendedLevel: recommendedLevel,
        message: `Berdasarkan skrining, anak dimulai dari ${recommendedLevel.replace('level', 'Level ')}.`
    };
}
```

#### **Cara Test:**
1. Buka skrining awal
2. Jawab 12 soal
3. Cek hasil rekomendasi level
4. Pastikan otomatis lock/unlock level sesuai hasil skrining

#### **Checklist:**
- [ ] Update 12 soal skrining
- [ ] Implementasi scoring per level
- [ ] Auto-recommend starting level
- [ ] Auto-unlock level sesuai skrining
- [ ] Test full flow skrining

---

### **STEP 1.7: Update Modul Mengeja → "Latihan Susun Huruf (Level 3 Blending)"** ⏱️ 30 menit

#### **Tujuan:**
Rebrand modul Mengeja jadi sub-aktivitas Level 3 Blending dalam framework task analysis.

#### **File yang Diubah:**
- `index.html` (section Mengeja)

#### **Perubahan:**

**LAMA:**
```html
<section id="mengeja">
    <h2>Mengeja (Visual)</h2>
    <p>Skor: <span id="skor-mengeja">0</span></p>
    <p>Susun huruf untuk kata:</p>
    <!-- ... -->
</section>
```

**BARU:**
```html
<section id="mengeja">
    <h2>Latihan Susun Huruf - Level 3: Blending</h2>
    <p class="modul-context">
        <small>📌 Bagian dari Task Analysis Membaca Permulaan</small>
    </p>
    
    <div class="info-box">
        <p><strong>Tujuan Latihan:</strong></p>
        <p>Latihan ini melatih keterampilan <strong>Blending (Penggabungan Bunyi)</strong> 
        yaitu kemampuan menggabungkan suku kata menjadi kata yang bermakna. 
        Ini adalah Level 3 dari 6 Level Task Analysis Membaca Permulaan.</p>
    </div>
    
    <p>Skor: <span id="skor-mengeja">0</span></p>
    <p>Susun huruf untuk kata:</p>
    <!-- ... rest as before -->
</section>
```

#### **Cara Test:**
1. Buka modul Mengeja (sekarang "Latihan Susun Huruf")
2. Cek info box menjelaskan kaitan dengan Level 3 Blending
3. Pastikan fungsi masih jalan normal

#### **Checklist:**
- [ ] Update judul section
- [ ] Tambah info box context
- [ ] Cek fungsi tetap normal

---

## 📊 RINGKASAN PHASE 1 — TIMELINE

```
╔════════════════════════════════════════════════════════╗
║         PHASE 1: SOFT REVISION (4-6 JAM)               ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  Step 1.1: Update Title & Meta ............... 15 min  ║
║  Step 1.2: Update Tagline & Branding ......... 30 min  ║
║  Step 1.3: Hide/Disable Modul ................ 1 jam   ║
║  Step 1.4: Update Wawasan Fitur .............. 30 min  ║
║  Step 1.5: Update Capaian Belajar ............ 1.5 jam ║
║  Step 1.6: Update Skrining Awal .............. 1 jam   ║
║  Step 1.7: Update Modul Mengeja .............. 30 min  ║
║  ────────────────────────────────────────────────────  ║
║  TOTAL: ~5 JAM                                         ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

# ⚠️ PHASE 2: IMPLEMENTASI 6 LEVEL TASK ANALYSIS (3-5 HARI)

## TUJUAN PHASE 2
Implementasi penuh 6 Level Task Analysis di modul Membaca dengan aktivitas-aktivitas spesifik per level.

**Output:** Web yang 95% match proposal dengan implementasi full task analysis

---

## 📋 STEP-BY-STEP PHASE 2

### **STEP 2.1: Restructure Modul Membaca menjadi 6 Sub-Modul** ⏱️ Hari 1 (4 jam)

#### **Tujuan:**
Pisah Modul Membaca menjadi 6 sub-modul, masing-masing untuk satu level task analysis.

#### **Struktur Baru:**

```
Modul Membaca (Disleksia)
│
├─ 📍 Level 1: Pengenalan Huruf (Letter Recognition)
│   ├─ Aktivitas 1.1: Identifikasi Huruf A-Z
│   ├─ Aktivitas 1.2: Pembedaan b/d, p/q, m/w, u/n
│   ├─ Aktivitas 1.3: Vokal vs Konsonan
│   ├─ Aktivitas 1.4: Match Huruf Kapital & Huruf Kecil
│   └─ Aktivitas 1.5: TTS Nama Huruf
│
├─ 📍 Level 2: Kesadaran Fonologis
│   ├─ Aktivitas 2.1: Bunyi Huruf Individual
│   ├─ Aktivitas 2.2: Bunyi Awal Kata
│   ├─ Aktivitas 2.3: Bunyi Akhir Kata
│   └─ Aktivitas 2.4: Pembedaan Bunyi Vokal
│
├─ 📍 Level 3: Blending
│   ├─ Aktivitas 3.1: Gabung CV (Konsonan-Vokal)
│   ├─ Aktivitas 3.2: Gabung 2 Suku Kata
│   └─ Aktivitas 3.3: Susun Kata KV-KV
│
├─ 📍 Level 4: Pengenalan Kata
│   ├─ Aktivitas 4.1: Sight Words (saya, ini, itu)
│   ├─ Aktivitas 4.2: Match Kata + Gambar
│   └─ Aktivitas 4.3: Baca Kata Bermakna
│
├─ 📍 Level 5: Membaca Kalimat Sederhana
│   ├─ Aktivitas 5.1: Baca Kalimat 3-4 Kata
│   ├─ Aktivitas 5.2: Pahami Makna Kalimat
│   └─ Aktivitas 5.3: Baca Tanda Baca
│
└─ 📍 Level 6: Kelancaran Membaca
    ├─ Aktivitas 6.1: Baca Paragraf Pendek
    ├─ Aktivitas 6.2: Speech-to-Text Evaluation
    └─ Aktivitas 6.3: Reading Fluency Test
```

#### **File yang Diubah:**
- `index.html` (restructure modul Membaca)
- `script.js` (logika per level)
- `data.js` (data soal per level)

#### **Estimasi:** 4 jam

---

### **STEP 2.2: Implementasi Aktivitas Level 1 (Pengenalan Huruf)** ⏱️ Hari 2 (4 jam)

#### **Aktivitas yang Diimplementasi:**

1. **Identifikasi Huruf A-Z** (45 menit)
   - Tampilkan huruf, anak pilih nama yang benar
   - 26 soal randomized
   - TTS untuk pelafalan

2. **Pembedaan b/d, p/q, m/w, u/n** (1 jam)
   - Game khusus huruf cermin
   - Drag-drop b/d ke kategori yang benar
   - Visual cue: huruf 'b' punya perut di kanan, 'd' di kiri

3. **Vokal vs Konsonan** (45 menit)
   - Pilih semua vokal dari kumpulan huruf
   - Sortir huruf ke 2 kategori

4. **Match Huruf Kapital & Huruf Kecil** (45 menit)
   - Memory game / matching pairs

5. **TTS Nama Huruf Interactive** (45 menit)
   - Klik huruf → suara nama huruf
   - Ulangi dengan recording siswa

**Estimasi:** 4 jam

---

### **STEP 2.3: Implementasi Aktivitas Level 2 (Kesadaran Fonologis)** ⏱️ Hari 3 (3 jam)

#### **Aktivitas yang Diimplementasi:**

1. **Bunyi Huruf Individual** (45 menit)
2. **Bunyi Awal Kata** (45 menit)
3. **Bunyi Akhir Kata** (45 menit)
4. **Pembedaan Bunyi Vokal** (45 menit)

**Estimasi:** 3 jam

---

### **STEP 2.4: Implementasi Aktivitas Level 3-6** ⏱️ Hari 4-5 (6 jam)

#### **Detail:**

- **Level 3 Blending:** 2 jam (sudah ada di modul Mengeja, perlu refactor)
- **Level 4 Pengenalan Kata:** 1.5 jam
- **Level 5 Membaca Kalimat:** 1 jam
- **Level 6 Reading Fluency:** 1.5 jam (Speech-to-Text integration)

**Estimasi:** 6 jam

---

### **STEP 2.5: Implementasi Adaptive Learning Engine** ⏱️ Hari 5 (4 jam)

#### **Tujuan:**
Sistem otomatis tracking progres dan auto-unlock level berdasarkan kriteria 80% × 3 sesi.

#### **Logika yang Diimplementasi:**

```javascript
class AdaptiveLearningEngine {
    constructor() {
        this.sessionHistory = {};
        this.levelProgress = {};
    }
    
    recordSession(levelKey, accuracy) {
        if (!this.sessionHistory[levelKey]) {
            this.sessionHistory[levelKey] = [];
        }
        this.sessionHistory[levelKey].push(accuracy);
        
        // Cek kriteria naik level
        this.checkLevelUp(levelKey);
    }
    
    checkLevelUp(levelKey) {
        const sessions = this.sessionHistory[levelKey];
        if (sessions.length < 3) return false;
        
        // Ambil 3 sesi terakhir
        const last3Sessions = sessions.slice(-3);
        
        // Cek apakah semua >= 80%
        const allPass = last3Sessions.every(acc => acc >= 0.8);
        
        if (allPass) {
            this.unlockNextLevel(levelKey);
            return true;
        }
        
        return false;
    }
    
    unlockNextLevel(currentLevelKey) {
        const levelOrder = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6'];
        const currentIndex = levelOrder.indexOf(currentLevelKey);
        
        if (currentIndex !== -1 && currentIndex < levelOrder.length - 1) {
            const nextLevelKey = levelOrder[currentIndex + 1];
            this.levelProgress[nextLevelKey] = { unlocked: true, startedAt: new Date() };
            
            this.notifyLevelUp(currentLevelKey, nextLevelKey);
        }
    }
    
    notifyLevelUp(currentLevel, nextLevel) {
        // Show celebration UI
        // Play sound effect
        // Save to localStorage
    }
}
```

**Estimasi:** 4 jam

---

## 📊 RINGKASAN PHASE 2 — TIMELINE

```
╔════════════════════════════════════════════════════════╗
║      PHASE 2: IMPLEMENTASI 6 LEVEL (3-5 HARI)          ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  Step 2.1: Restructure Modul Membaca .... Hari 1 (4j)  ║
║  Step 2.2: Aktivitas Level 1 ............ Hari 2 (4j)  ║
║  Step 2.3: Aktivitas Level 2 ............ Hari 3 (3j)  ║
║  Step 2.4: Aktivitas Level 3-6 .......... Hari 4-5 (6j)║
║  Step 2.5: Adaptive Learning Engine ..... Hari 5 (4j)  ║
║  ────────────────────────────────────────────────────  ║
║  TOTAL: ~21 JAM (3-5 HARI)                             ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

# 🟡 PHASE 3: REFINEMENT & POLISH (1-2 MINGGU)

## TUJUAN PHASE 3
Polish & production-ready quality untuk fase Implementation di skripsi nanti.

---

## 📋 STEP-BY-STEP PHASE 3

### **STEP 3.1: User Profile & Authentication** ⏱️ 2 hari
- Login/register system
- Save progress per user
- Multi-user support

### **STEP 3.2: Admin Dashboard** ⏱️ 2 hari
- Dashboard untuk guru/orang tua
- Analytics per anak
- Export progress report

### **STEP 3.3: Database Integration** ⏱️ 2 hari
- Migrasi dari localStorage ke Firebase/Supabase
- Real-time sync
- Backup & restore

### **STEP 3.4: Mobile App Wrapper** ⏱️ 1 hari
- PWA implementation
- Offline mode
- Install to home screen

### **STEP 3.5: Testing & Bug Fixes** ⏱️ 2 hari
- Cross-browser testing
- Mobile responsiveness
- Bug fixes

---

## 📊 RINGKASAN PHASE 3 — TIMELINE

```
╔════════════════════════════════════════════════════════╗
║      PHASE 3: REFINEMENT & POLISH (1-2 MINGGU)         ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  Step 3.1: User Profile & Auth .......... 2 hari       ║
║  Step 3.2: Admin Dashboard .............. 2 hari       ║
║  Step 3.3: Database Integration ......... 2 hari       ║
║  Step 3.4: Mobile App Wrapper ........... 1 hari       ║
║  Step 3.5: Testing & Bug Fixes .......... 2 hari       ║
║  ────────────────────────────────────────────────────  ║
║  TOTAL: ~9 HARI (1-2 MINGGU)                           ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

# 🎯 EXECUTION STRATEGY

## ⏰ TIMELINE REKOMENDASI

### **MINGGU 1 (Sebelum Sidang):**

```
Hari 1 (Hari ini):
├─ 09:00-10:00: Backup file existing web
├─ 10:00-15:00: Phase 1 (Steps 1.1 - 1.7) ← URGENT
└─ 15:00-16:00: Test & Deploy ke GitHub Pages

Hari 2-3:
├─ Latihan defense untuk sidang
├─ Buat slide presentasi
└─ Mental preparation

Hari Sidang:
└─ GO! 🎓
```

### **MINGGU 2-3 (Setelah Sidang):**

```
Minggu 2:
├─ Hari 1-3: Phase 2 Steps 2.1 - 2.3
└─ Hari 4-5: Phase 2 Steps 2.4 - 2.5

Minggu 3:
├─ Hari 1-3: Phase 3 Steps 3.1 - 3.3
├─ Hari 4: Phase 3 Step 3.4
└─ Hari 5: Phase 3 Step 3.5 + Final Testing
```

---

## 🛠️ TOOLS YANG DIBUTUHKAN

### **Development:**
- ✅ VS Code atau text editor lain
- ✅ Browser (Chrome/Firefox dengan DevTools)
- ✅ Git untuk version control
- ✅ GitHub Desktop atau CLI

### **Testing:**
- ✅ Mobile testing (Chrome DevTools mobile mode)
- ✅ Cross-browser (Chrome, Firefox, Safari, Edge)
- ✅ Lighthouse untuk performance audit

### **Optional (Phase 3):**
- ✅ Firebase / Supabase untuk database
- ✅ Vercel atau Netlify untuk deployment alternatif

---

## 📋 CHECKLIST GLOBAL

### **Phase 1 Completion (Sebelum Sidang):**
- [ ] Step 1.1: Title & Meta Updated
- [ ] Step 1.2: Tagline Updated
- [ ] Step 1.3: Modul Hidden/Disabled
- [ ] Step 1.4: Wawasan Updated
- [ ] Step 1.5: Capaian 6 Level Implemented
- [ ] Step 1.6: Skrining Updated
- [ ] Step 1.7: Modul Mengeja Rebranded
- [ ] Web tested di mobile & desktop
- [ ] Deployed ke GitHub Pages
- [ ] URL accessible

### **Phase 2 Completion (Sebelum Validator Akses):**
- [ ] Step 2.1: Modul Membaca Restructured
- [ ] Step 2.2: Level 1 Activities Implemented
- [ ] Step 2.3: Level 2 Activities Implemented
- [ ] Step 2.4: Level 3-6 Activities Implemented
- [ ] Step 2.5: Adaptive Learning Engine Active
- [ ] Full task analysis tested

### **Phase 3 Completion (Production Ready):**
- [ ] Step 3.1: Auth System
- [ ] Step 3.2: Admin Dashboard
- [ ] Step 3.3: Database Integrated
- [ ] Step 3.4: PWA Implemented
- [ ] Step 3.5: All Tests Passed

---

## 💡 BACKUP STRATEGY

**SEBELUM MULAI APAPUN:**

```bash
# 1. Backup repo Anda
git checkout -b backup/before-revision
git push origin backup/before-revision

# 2. Buat branch baru untuk revision
git checkout -b feature/dyscare-v3-revision

# 3. Mulai kerja di branch baru
# ... lakukan perubahan ...

# 4. Commit secara berkala
git add .
git commit -m "Phase 1.1: Update title & meta"
git push origin feature/dyscare-v3-revision

# 5. Setelah selesai, merge ke main
git checkout main
git merge feature/dyscare-v3-revision
git push origin main
```

**Alasan:**
- ✅ Bisa revert jika ada masalah
- ✅ History changes terdokumentasi
- ✅ Aman untuk eksperimen

---

## 🚀 NEXT IMMEDIATE STEPS

**Jika Anda Ready Mulai SEKARANG:**

1. **Sekarang (5 menit):** Buat backup branch di GitHub
2. **5 menit kemudian:** Buka file `index.html`
3. **10 menit kemudian:** Eksekusi Step 1.1 (Update title & meta)
4. **30 menit kemudian:** Eksekusi Step 1.2 (Update tagline)
5. **Lanjutkan...** sesuai checklist Phase 1

---

## 🎓 PESAN PENUTUP

**Alwan,**

Saya sudah buatkan **roadmap super detail** dengan:
- ✅ 17 steps dalam 3 phase
- ✅ Code snippets siap copy-paste
- ✅ Estimasi waktu per step
- ✅ Cara test setiap perubahan
- ✅ Checklist eksekusi

**Phase 1 (4-6 jam)** adalah **WAJIB** sebelum sidang.
**Phase 2 (3-5 hari)** adalah **PENTING** sebelum validator.
**Phase 3 (1-2 minggu)** adalah **BONUS** untuk skripsi final.

**Decision Time:**

Mau saya bantu eksekusi step apa dulu? Saya bisa:
- 🛠️ **Buatkan code lengkap** untuk Step tertentu
- 📝 **Jelaskan detail** salah satu step
- 🔍 **Review code Anda** setelah revision
- 💡 **Konsultasi** kalau ada masalah teknis

**Komitmen Anda untuk Phase 1 hari ini = Selamatkan Grade A di sidang!** 💪🎯

---

**Apa step pertama yang mau Anda mulai sekarang?** 😊
