/* ==========================================================================
   KONFIGURASI API & KONSTANTA GLOBAL
   ========================================================================== */

// ⚠️ Ganti dengan API Key Gemini Anda dari https://aistudio.google.com/apikey
const API_KEY = "";

// Endpoint API Gemini
const TEXT_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;
const IMAGE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`;
const VISION_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

// Konfigurasi Sistem Level (Adaptive Learning)
const LEVEL_CONFIG = {
    // Ambang batas naik level berdasarkan TOTAL POIN (reading + spelling + math)
    THRESHOLD_MEDIUM: 50,   // Total poin untuk naik ke level Sedang
    THRESHOLD_HARD: 100,    // Total poin untuk naik ke level Sulit

    // Label level
    LABELS: {
        1: { name: 'Mudah',  emoji: '🌱', color: 'green',  hint: 'Kumpulkan 50 poin untuk naik ke Level Sedang' },
        2: { name: 'Sedang', emoji: '🌟', color: 'yellow', hint: 'Kumpulkan 100 poin untuk naik ke Level Sulit' },
        3: { name: 'Sulit',  emoji: '🏆', color: 'red',    hint: 'Kamu sudah di level tertinggi! Pertahankan.' }
    }
};

// Storage Keys (konsisten di seluruh aplikasi)
const STORAGE_KEYS = {
    PROGRESS: 'dyscareProgress',
    PROFILE:  'dyscareProfile',
    LEVEL:    'dyscareLevel',
    HISTORY:  'dyscareSessionHistory'
};
