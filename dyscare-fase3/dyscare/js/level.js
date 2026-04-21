/* ==========================================================================
   LEVEL SYSTEM: Core Adaptive Learning Engine
   ==========================================================================
   Modul ini adalah jantung dari sistem adaptif DYSCARE. Secara teknis:

   1. Tingkat kesulitan ditentukan oleh TOTAL POIN pengguna (reading + spelling + math)
   2. Sistem secara otomatis menaikkan level ketika ambang batas tercapai
   3. Setiap modul (reading/spelling/math) mengambil konten SESUAI level saat ini
   4. Ada notifikasi "Level Up" saat transisi

   Mekanisme ini dapat dijelaskan di BAB III proposal sebagai:
   → "Rule-based adaptive difficulty adjustment dengan threshold-based progression"
   ========================================================================== */

/**
 * Hitung total poin pengguna
 * @returns {number}
 */
function getTotalScore() {
    return appState.progress.reading +
           appState.progress.spelling +
           appState.progress.math;
}

/**
 * Tentukan level berdasarkan total skor
 * @param {number} totalScore
 * @returns {number} 1 | 2 | 3
 */
function calculateLevel(totalScore) {
    if (totalScore >= LEVEL_CONFIG.THRESHOLD_HARD) return 3;
    if (totalScore >= LEVEL_CONFIG.THRESHOLD_MEDIUM) return 2;
    return 1;
}

/**
 * Cek apakah user baru saja naik level, tampilkan modal jika ya
 */
function checkLevelUp() {
    const newLevel = calculateLevel(getTotalScore());

    if (newLevel > appState.currentLevel) {
        const previousLevel = appState.currentLevel;
        appState.currentLevel = newLevel;
        saveLevel();

        // Tampilkan notifikasi
        showLevelUpNotification(newLevel, previousLevel);
    }
}

/**
 * Tampilkan modal "Level Naik!"
 */
function showLevelUpNotification(newLevel, prevLevel) {
    const info = LEVEL_CONFIG.LABELS[newLevel];
    const display = document.getElementById('new-level-display');

    if (display) {
        display.innerHTML = `${info.emoji} ${info.name}`;
    }

    playSound('levelup');
    document.getElementById('level-up-modal').classList.remove('hidden');
}

/**
 * Ambil data konten membaca sesuai level saat ini
 * @returns {string[]}
 */
function getReadingSentencesByLevel() {
    switch (appState.currentLevel) {
        case 3: return appState.reading.sentencesHard;
        case 2: return appState.reading.sentencesMedium;
        default: return appState.reading.sentencesEasy;
    }
}

/**
 * Ambil data konten mengeja sesuai level saat ini
 * @returns {Array}
 */
function getSpellingWordsByLevel() {
    switch (appState.currentLevel) {
        case 3: return appState.spelling.wordsHard;
        case 2: return appState.spelling.wordsMedium;
        default: return appState.spelling.wordsEasy;
    }
}

/**
 * Ambil data konten berhitung sesuai level saat ini
 * @returns {Array}
 */
function getMathProblemsByLevel() {
    switch (appState.currentLevel) {
        case 3: return appState.math.problemsHard;
        case 2: return appState.math.problemsMedium;
        default: return appState.math.problemsEasy;
    }
}

/**
 * Update tampilan badge level di progress screen
 */
function updateLevelIndicator() {
    const info = LEVEL_CONFIG.LABELS[appState.currentLevel];
    const labelEl = document.getElementById('current-level-label');
    const hintEl = document.getElementById('current-level-hint');

    if (labelEl) labelEl.innerHTML = `${info.emoji} ${info.name}`;
    if (hintEl) hintEl.innerText = info.hint;
}

/**
 * Dapatkan prompt AI yang sudah disesuaikan level
 * Digunakan oleh modul reading untuk Imagen dan text-gen
 * @param {string} basePrompt
 * @returns {string}
 */
function getLevelAwarePrompt(basePrompt) {
    const levelDesc = {
        1: "sangat pendek 2-3 kata, kosakata sangat sederhana untuk anak TK",
        2: "pendek 4-5 kata, kosakata dasar untuk anak SD kelas 1",
        3: "agak panjang 6-8 kata, kalimat lengkap untuk anak SD kelas 2-3"
    };
    return basePrompt.replace(
        '{LEVEL}',
        levelDesc[appState.currentLevel] || levelDesc[1]
    );
}

/**
 * Render badge level (huruf kecil berwarna) untuk ditampilkan di header modul
 */
function renderLevelBadge() {
    const info = LEVEL_CONFIG.LABELS[appState.currentLevel];
    const colorClass = {
        1: 'level-badge-easy',
        2: 'level-badge-medium',
        3: 'level-badge-hard'
    }[appState.currentLevel];

    return `<span class="level-badge ${colorClass}">${info.emoji} ${info.name}</span>`;
}
