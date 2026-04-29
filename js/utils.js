/* ==========================================================================
   UTILITIES: Helper umum (modal, SFX, navigasi)
   ========================================================================== */

/* -------------------- NAVIGASI -------------------- */
function navigateTo(screenId) {
    // Sembunyikan semua layar
    document.querySelectorAll('.screen-content').forEach(el => el.classList.add('hidden'));

    // Tampilkan layar tujuan
    document.getElementById(screenId).classList.remove('hidden');
    appState.currentScreen = screenId;

    // Atur visibilitas header
    const header = document.getElementById('app-header');
    if (screenId === 'home-screen' || screenId === 'assessment-screen') {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }

    // Inisialisasi per layar
    if (screenId === 'reading-screen')    loadReadingContent();
    if (screenId === 'spelling-screen')   loadSpellingContent();
    if (screenId === 'math-screen')       loadMathProblem();
    if (screenId === 'writing-screen')    setupWritingCanvas();
    if (screenId === 'progress-screen')   updateProgressUI();
    if (screenId === 'profile-screen')    { loadProfileData(); renderAssessmentSummary(); }
    if (screenId === 'assessment-screen') { /* initAssessment dipanggil manual */ }

    window.scrollTo(0, 0);
}

/* -------------------- MODAL -------------------- */
function toggleAccessibilityPanel() {
    document.getElementById('accessibility-panel').classList.toggle('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function showInfoModal(title, msg, iconClass = "fa-solid fa-info-circle") {
    document.getElementById('info-modal-title').innerText = title;
    document.getElementById('info-modal-message').innerText = msg;
    document.getElementById('info-modal-icon').innerHTML = `<i class="${iconClass}"></i>`;
    document.getElementById('info-modal').classList.remove('hidden');
}

/* -------------------- SFX ENGINE -------------------- */
// Membangun suara native tanpa file audio eksternal
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioCtx();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'correct') {
        // Suara "Ting-Ting" (Berhasil)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);         // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);   // E5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    } else if (type === 'wrong') {
        // Suara "Bzzzt" (Salah)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'levelup') {
        // Suara fanfare singkat (Naik level)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);        // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3);  // G5
        osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.45); // C6
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.8);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
    }
}

/* -------------------- TEXT-TO-SPEECH HELPER -------------------- */
function speakText(text, rate = 0.8) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
}

/* -------------------- RANDOM HELPER -------------------- */
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/* -------------------- INFO MODUL -------------------- */
const INFO_CONTENT = {
    membaca: {
        title: "📖 Modul Membaca",
        body: `
            <p><strong>Tujuan:</strong> Melatih membaca permulaan anak disleksia melalui pendekatan multisensori VAKT.</p>
            <p><strong>Cara pakai:</strong></p>
            <ul class="list-disc pl-4 space-y-1">
                <li>Tekan <strong>Dengar</strong> — teks dibacakan, setiap kata di-highlight</li>
                <li>Tekan <strong>Baca (Rekam)</strong> — rekam suara anak membaca</li>
                <li>Tekan <strong>Cerita AI</strong> — dapatkan teks baru agar anak tidak bosan</li>
            </ul>
            <p><strong>Pendekatan VAKT aktif:</strong><br>
            👁 Visual: highlight kata berjalan<br>
            👂 Auditory: Text-to-Speech<br>
            ✋ Kinesthetic: rekam suara<br>
            🤚 Tactile: tap layar</p>
            <p class="text-xs text-gray-400 mt-2">Fitur Rekam hanya tersedia di Google Chrome.</p>
        `
    },
    mengeja: {
        title: "🔤 Modul Mengeja",
        body: `
            <p><strong>Tujuan:</strong> Melatih kesadaran fonologis dan korespondensi grafem-fonem (Level 2–3).</p>
            <p><strong>Cara pakai:</strong></p>
            <ul class="list-disc pl-4 space-y-1">
                <li>Susun huruf-huruf acak menjadi kata sesuai gambar</li>
                <li>Tekan ikon suara untuk mendengar nama kata</li>
                <li>Tekan <strong>Cek Jawaban</strong> setelah selesai menyusun</li>
                <li>Tekan <strong>Buat Gambar & Kata</strong> untuk soal baru dari AI</li>
            </ul>
            <p><strong>Pendekatan VAKT aktif:</strong><br>
            👁 Visual: gambar AI pendukung kata<br>
            👂 Auditory: TTS nama kata<br>
            ✋ Kinesthetic: drag & drop huruf<br>
            🤚 Tactile: sentuh tile untuk memindah huruf</p>
        `
    },
    capaian: {
        title: "🏆 Halaman Capaian",
        body: `
            <p><strong>Yang ditampilkan:</strong></p>
            <ul class="list-disc pl-4 space-y-1">
                <li><strong>Level saat ini</strong> — dari 6 level task analysis membaca permulaan</li>
                <li><strong>Sesi lulus berturut-turut</strong> — target 3 sesi akurasi ≥80% untuk naik level</li>
                <li><strong>Jumlah latihan</strong> — total sesi Membaca dan Mengeja</li>
            </ul>
            <p><strong>Kriteria naik level:</strong> Akurasi ≥80% selama 3 sesi berturut-turut → naik otomatis.</p>
            <p><strong>Saran Cerdas AI:</strong> Analisis pola kesalahan dan rekomendasi latihan prioritas.</p>
        `
    },
    skrining: {
        title: "📋 Skrining Awal",
        body: `
            <p><strong>Apa itu skrining?</strong> Tes 12 soal singkat untuk menentukan level awal yang sesuai kemampuan anak.</p>
            <p><strong>Mencakup 6 domain:</strong> pengenalan huruf, kesadaran fonologis, grafem-fonem, blending, membaca kata, dan kelancaran membaca.</p>
            <p><strong>Tips:</strong></p>
            <ul class="list-disc pl-4 space-y-1">
                <li>Bacakan soal keras jika anak belum bisa membaca mandiri</li>
                <li>Jangan beri petunjuk — biarkan anak menjawab apa adanya</li>
                <li>Skrining hanya dilakukan sekali di awal</li>
            </ul>
            <p class="text-xs text-gray-400 mt-2">Guru yang sudah punya hasil asesmen manual bisa gunakan fitur Lewati Skrining di Panel Guru.</p>
        `
    },
    aksesibilitas: {
        title: "♿ Fitur Aksesibilitas",
        body: `
            <ul class="list-disc pl-4 space-y-2">
                <li><strong>Font Disleksia (OpenDyslexic):</strong> Huruf lebih berat di bagian bawah agar tidak mudah tertukar bagi anak disleksia</li>
                <li><strong>Ukuran Teks:</strong> Normal / Besar / Sangat Besar</li>
                <li><strong>Kontras Tinggi:</strong> Latar gelap, teks terang — untuk anak sensitif kontras</li>
                <li><strong>Kecerahan Redup:</strong> Untuk anak sensitif cahaya layar</li>
            </ul>
            <p class="text-xs text-gray-400 mt-2">Pengaturan tersimpan otomatis dan tetap aktif saat aplikasi dibuka kembali.</p>
        `
    },
    level: {
        title: "📊 Sistem Level Belajar",
        body: `
            <p><strong>DYSCARE menggunakan 6 level progresif:</strong></p>
            <ul class="list-disc pl-4 space-y-1">
                <li><strong>Level 1</strong> — Pengenalan Huruf (b/d, p/q, m/w)</li>
                <li><strong>Level 2</strong> — Kesadaran Fonologis (bunyi & suku kata)</li>
                <li><strong>Level 3</strong> — Korespondensi Grafem-Fonem</li>
                <li><strong>Level 4</strong> — Blending Suku Kata (ba+tu = batu)</li>
                <li><strong>Level 5</strong> — Membaca Kata secara mandiri</li>
                <li><strong>Level 6</strong> — Kelancaran Membaca kalimat</li>
            </ul>
            <p><strong>Naik level jika:</strong> akurasi ≥80% selama 3 sesi berturut-turut.</p>
        `
    }
};

function showInfo(key) {
    const content = INFO_CONTENT[key];
    if (!content) return;
    document.getElementById('info-detail-title').textContent = content.title;
    document.getElementById('info-detail-body').innerHTML = content.body;
    document.getElementById('info-detail-modal').classList.remove('hidden');
}
