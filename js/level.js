/* ==========================================================================
   LEVEL SYSTEM: Core Adaptive Learning Engine
   ==========================================================================
   Modul ini adalah jantung dari sistem adaptif DYSCARE.

   Mekanisme yang diimplementasikan (sesuai Bab III proposal):
   1. Rule-based progression berbasis akurasi per sesi
   2. Kriteria naik level: akurasi ≥80% pada 3 sesi berturut-turut
   3. Konten disesuaikan level saat ini (6 level progresif)
   4. Notifikasi "Level Naik" saat transisi

   Referensi teori:
   - Cooper, Heron & Heward (2020): mastery learning criterion (80% accuracy)
   - Gough & Tunmer (1986): Simple View of Reading, dasar taksonomi 6 level
   - Vygotsky (1978): Zone of Proximal Development, prinsip progressive difficulty
   ========================================================================== */

/**
 * Catat satu hasil latihan dan cek apakah sesi perlu dievaluasi.
 *
 * Dipanggil dari reading.js dan spelling.js setiap kali anak menjawab.
 * Setiap EXERCISES_PER_SESSION latihan = 1 sesi. Akurasi dihitung di akhir sesi.
 *
 * @param {boolean} isCorrect - apakah jawaban anak benar
 */
function recordExerciseResult(isCorrect) {
    const tracker = appState.sessionTracker;

    tracker.attempts++;
    if (isCorrect) tracker.correct++;

    // Evaluasi sesi setelah mencapai jumlah latihan yang ditentukan
    if (tracker.attempts >= LEVEL_CONFIG.EXERCISES_PER_SESSION) {
        const accuracy = Math.round((tracker.correct / tracker.attempts) * 100);
        const passed   = accuracy >= LEVEL_CONFIG.ACCURACY_THRESHOLD;

        const entry = {
            level:     appState.currentLevel,
            accuracy,
            passed,
            timestamp: Date.now()
        };

        tracker.history.push(entry);
        if (tracker.history.length > 50) tracker.history.shift();

        // Perbarui jumlah sesi berturut-turut yang lulus
        if (passed) {
            tracker.consecutivePass++;
        } else {
            tracker.consecutivePass = 0;
        }

        // Reset counter untuk sesi berikutnya
        tracker.correct  = 0;
        tracker.attempts = 0;

        // Simpan dan cek apakah syarat naik level terpenuhi
        saveLevelProgress();
        checkLevelUp();

        // Tampilkan ringkasan sesi
        showSessionSummary(accuracy, passed, tracker.consecutivePass);
    }
}

/**
 * Cek apakah anak sudah memenuhi syarat naik level.
 *
 * Syarat: consecutivePass >= CONSECUTIVE_SESSIONS_REQUIRED (3 sesi berturut-turut)
 * dan currentLevel < TOTAL_LEVELS (bukan level tertinggi).
 */
function checkLevelUp() {
    const { consecutivePass } = appState.sessionTracker;
    const { CONSECUTIVE_SESSIONS_REQUIRED, TOTAL_LEVELS } = LEVEL_CONFIG;

    if (consecutivePass >= CONSECUTIVE_SESSIONS_REQUIRED &&
        appState.currentLevel < TOTAL_LEVELS) {

        const previousLevel = appState.currentLevel;
        appState.currentLevel++;
        appState.sessionTracker.consecutivePass = 0; // reset untuk level baru

        saveLevel();
        showLevelUpNotification(appState.currentLevel, previousLevel);
    }
}

/**
 * Tampilkan ringkasan akurasi setelah sesi selesai.
 *
 * @param {number} accuracy - akurasi sesi (0-100)
 * @param {boolean} passed - apakah lulus threshold 80%
 * @param {number} consecutivePass - sesi berturut-turut yang lulus
 */
function showSessionSummary(accuracy, passed, consecutivePass) {
    const { CONSECUTIVE_SESSIONS_REQUIRED } = LEVEL_CONFIG;
    const remaining = CONSECUTIVE_SESSIONS_REQUIRED - consecutivePass;

    const icon    = passed ? '🌟' : '💪';
    const message = passed
        ? (remaining > 0
            ? `Sesi lulus! Butuh ${remaining} sesi lagi untuk naik level.`
            : 'Siap naik level!')
        : `Akurasi ${accuracy}%. Butuh 80% untuk lulus. Ayo coba lagi!`;

    showInfoModal(
        `${icon} Sesi Selesai (${accuracy}%)`,
        message
    );
}

/**
 * Tampilkan modal "Level Naik!" dengan informasi level baru.
 *
 * @param {number} newLevel - level yang baru dicapai
 * @param {number} prevLevel - level sebelumnya
 */
function showLevelUpNotification(newLevel, prevLevel) {
    const info    = LEVEL_CONFIG.LABELS[newLevel];
    const display = document.getElementById('new-level-display');

    if (display) {
        display.innerHTML = `${info.emoji} Level ${newLevel}: ${info.name}`;
    }

    playSound('levelup');
    document.getElementById('level-up-modal').classList.remove('hidden');
}

/* --------------------------------------------------------------------------
   FUNGSI KONTEN PER LEVEL
   Memetakan 6 level ke konten Easy/Medium/Hard yang tersedia di state.js.
   Pemetaan: Level 1-2 → Easy, Level 3-4 → Medium, Level 5-6 → Hard
   -------------------------------------------------------------------------- */

/**
 * Ambil pool kalimat membaca sesuai level saat ini.
 * @returns {string[]}
 */
function getReadingSentencesByLevel() {
    if (appState.currentLevel >= 5) return appState.reading.sentencesHard;
    if (appState.currentLevel >= 3) return appState.reading.sentencesMedium;
    return appState.reading.sentencesEasy;
}

/**
 * Ambil pool kata mengeja sesuai level saat ini.
 * @returns {Array}
 */
function getSpellingWordsByLevel() {
    if (appState.currentLevel >= 5) return appState.spelling.wordsHard;
    if (appState.currentLevel >= 3) return appState.spelling.wordsMedium;
    return appState.spelling.wordsEasy;
}

/**
 * Ambil pool soal berhitung sesuai level saat ini.
 * Modul ini dipertahankan untuk future development (scope penelitian fase berikutnya).
 * @returns {Array}
 */
function getMathProblemsByLevel() {
    if (appState.currentLevel >= 5) return appState.math.problemsHard;
    if (appState.currentLevel >= 3) return appState.math.problemsMedium;
    return appState.math.problemsEasy;
}

/* --------------------------------------------------------------------------
   FUNGSI TAMPILAN
   -------------------------------------------------------------------------- */

/**
 * Update tampilan badge level di progress screen.
 */
function updateLevelIndicator() {
    const info    = LEVEL_CONFIG.LABELS[appState.currentLevel];
    const labelEl = document.getElementById('current-level-label');
    const hintEl  = document.getElementById('current-level-hint');
    const passEl  = document.getElementById('current-level-pass-count');

    if (labelEl) labelEl.innerHTML =
        `${info.emoji} Level ${appState.currentLevel}: ${info.name}`;
    if (hintEl)  hintEl.innerText = info.hint;
    if (passEl) {
        const pass = appState.sessionTracker.consecutivePass;
        const req  = LEVEL_CONFIG.CONSECUTIVE_SESSIONS_REQUIRED;
        passEl.innerText = `Sesi lulus berturut-turut: ${pass}/${req}`;
    }
}

/**
 * Render badge level inline untuk header modul.
 * @returns {string} HTML string badge
 */
function renderLevelBadge() {
    const info = LEVEL_CONFIG.LABELS[appState.currentLevel];
    return `<span class="level-badge level-badge-${appState.currentLevel}">` +
        `${info.emoji} Level ${appState.currentLevel}</span>`;
}

/**
 * Dapatkan prompt AI yang sudah disesuaikan dengan deskripsi level saat ini.
 * Digunakan oleh modul reading dan spelling untuk membuat konten variasi AI.
 *
 * @param {string} basePrompt - prompt dasar dengan placeholder {LEVEL}
 * @returns {string} prompt yang sudah diisi deskripsi level
 */
function getLevelAwarePrompt(basePrompt) {
    const levelDesc = {
        1: "sangat pendek 2-3 suku kata atau huruf tunggal untuk anak kelas 1 SD yang baru kenal huruf",
        2: "2-3 kata sederhana dengan suku kata KV untuk anak kelas 1 SD belajar bunyi huruf",
        3: "3-4 kata dengan pola KV-KV dan KVK untuk anak kelas 1 SD belajar menggabungkan bunyi",
        4: "3-4 kata bermakna sehari-hari dengan kata-kata yang sering dilihat anak kelas 1-2 SD",
        5: "kalimat 4-5 kata sederhana yang mudah dipahami anak kelas 2 SD",
        6: "kalimat 5-7 kata lengkap dengan intonasi jelas untuk anak kelas 2-3 SD"
    };
    return basePrompt.replace(
        '{LEVEL}',
        levelDesc[appState.currentLevel] || levelDesc[1]
    );
}

/**
 * Hitung total latihan yang sudah diselesaikan (reading + spelling).
 * Digunakan untuk tampilan di progress screen.
 * @returns {number}
 */
function getTotalExercises() {
    return appState.progress.reading + appState.progress.spelling;
}

/**
 * Kompatibilitas mundur: getTotalScore() masih bisa dipanggil dari kode lama.
 * Mengembalikan total latihan (bukan poin lagi).
 * @returns {number}
 */
function getTotalScore() {
    return getTotalExercises();
}
