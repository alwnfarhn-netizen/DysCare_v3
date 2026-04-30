/* ==========================================================================
   KONFIGURASI API & KONSTANTA GLOBAL
   ========================================================================== */

// ⚠️ Ganti dengan API Key Gemini Anda dari https://aistudio.google.com/apikey
const API_KEY = "";

// Endpoint API Gemini (model: gemini-2.5-flash-preview-09-2025 dan imagen-4.0-generate-001)
const TEXT_API_URL   = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;
const IMAGE_API_URL  = `https://generativelanguage.googleapis.com/v1/models/imagen-4.0-generate-001:predict?key=${API_KEY}`;
const VISION_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

/**
 * Konfigurasi Sistem 6 Level Adaptif DYSCARE.
 *
 * Taksonomi 6 level berdasarkan Simple View of Reading (Gough & Tunmer, 1986)
 * yang dijabarkan dalam Task Analysis Bab III proposal.
 *
 * Kriteria naik level: akurasi ≥80% pada 3 sesi latihan berturut-turut.
 * Justifikasi: Cooper, Heron & Heward (2020) tentang mastery learning criterion
 * dalam Applied Behavior Analysis.
 */
const LEVEL_CONFIG = {
    TOTAL_LEVELS: 6,

    // Mastery criterion sesuai Task Analysis Bab III proposal
    ACCURACY_THRESHOLD: 80,           // persen minimum per sesi (≥80%)
    CONSECUTIVE_SESSIONS_REQUIRED: 3, // jumlah sesi berturut-turut yang harus lulus

    // Jumlah latihan per sesi sebelum akurasi dihitung
    EXERCISES_PER_SESSION: 5,

    // Label dan metadata tiap level (Task Analysis Bab III, Tabel Level)
    LABELS: {
        1: {
            name: 'Pengenalan Huruf',
            subtitle: 'Identifikasi A-Z, bedakan b/d, p/q, m/w, u/n',
            emoji: '🔤',
            color: 'blue',
            hint: 'Capai akurasi 80% selama 3 sesi untuk naik ke Level 2: Kesadaran Fonologis'
        },
        2: {
            name: 'Kesadaran Fonologis',
            subtitle: 'Bunyi huruf, fonem awal, tengah, dan akhir',
            emoji: '👂',
            color: 'green',
            hint: 'Capai akurasi 80% selama 3 sesi untuk naik ke Level 3: Korespondensi Grafem-Fonem'
        },
        3: {
            name: 'Korespondensi Grafem-Fonem',
            subtitle: 'Hubungan huruf dan bunyi: fonem ke grafem',
            emoji: '🔊',
            color: 'yellow',
            hint: 'Capai akurasi 80% selama 3 sesi untuk naik ke Level 4: Blending Suku Kata'
        },
        4: {
            name: 'Blending Suku Kata',
            subtitle: 'Menggabungkan suku kata: KV-KV, KVK',
            emoji: '📝',
            color: 'orange',
            hint: 'Capai akurasi 80% selama 3 sesi untuk naik ke Level 5: Membaca Kata'
        },
        5: {
            name: 'Membaca Kata',
            subtitle: 'Membaca kata bermakna dalam konteks kalimat',
            emoji: '📖',
            color: 'red',
            hint: 'Capai akurasi 80% selama 3 sesi untuk naik ke Level 6: Kelancaran Membaca'
        },
        6: {
            name: 'Kelancaran Membaca',
            subtitle: 'Akurasi + intonasi + kecepatan, paragraf pendek',
            emoji: '🏆',
            color: 'purple',
            hint: 'Level tertinggi! Pertahankan kelancaran membacamu.'
        }
    }
};

// Kontrol visibilitas modul sesuai batasan penelitian fase R&D ini.
// Dinonaktifkan sesuai Batasan Penelitian fase R&D ini (fokus: disleksia)
// Aktifkan kembali pada fase Implementation penelitian lanjutan
const SHOW_DISGRAFIA_MODUL   = false;
const SHOW_DISKALKULIA_MODUL = false;

// Storage Keys (konsisten di seluruh aplikasi)
const STORAGE_KEYS = {
    PROGRESS:       'dyscareProgress',
    PROFILE:        'dyscareProfile',
    LEVEL:          'dyscareLevel',
    HISTORY:        'dyscareSessionHistory',
    ASSESSMENT:     'dyscareAssessment',
    LEVEL_PROGRESS: 'dyscareLevelProgress'
};

/**
 * Konfigurasi Pre-Assessment 12 soal diagnostik.
 *
 * Soal dibagi 2 per level (6 level × 2 soal = 12 soal total).
 * Entry level ditentukan dari total skor dengan rentang per level.
 * Soal hanya mencakup domain membaca dan mengeja (disleksia), sesuai scope
 * penelitian yang fokus pada early reading skills (Bab I & III proposal).
 */
const ASSESSMENT_CONFIG = {
    TOTAL_QUESTIONS: 12,
    QUESTIONS_PER_LEVEL: 2,
    // Skor minimum untuk masuk ke masing-masing level (0-12)
    ENTRY_THRESHOLDS: { 1: 0, 2: 2, 3: 4, 4: 6, 5: 8, 6: 10 }
};
