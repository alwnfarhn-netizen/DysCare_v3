/* ==========================================================================
   PROGRESS SCREEN: Capaian belajar + saran AI
   Menampilkan level indicator, progress bar sesi, dan latihan per modul
   ========================================================================== */

function updateProgressUI() {
    const maxExercises = 50; // batas atas visual progress bar latihan

    // Update jumlah latihan per modul
    const rVal  = document.getElementById('prog-read-val');
    const rBar  = document.getElementById('prog-bar-read');
    const sVal  = document.getElementById('prog-spell-val');
    const sBar  = document.getElementById('prog-bar-spell');

    if (rVal) rVal.innerText = appState.progress.reading + ' Latihan';
    if (rBar) rBar.style.width = Math.min((appState.progress.reading / maxExercises) * 100, 100) + '%';
    if (sVal) sVal.innerText = appState.progress.spelling + ' Latihan';
    if (sBar) sBar.style.width = Math.min((appState.progress.spelling / maxExercises) * 100, 100) + '%';

    // Update progress bar sesi menuju naik level
    const passEl = document.getElementById('prog-bar-session');
    if (passEl) {
        const pass = appState.sessionTracker.consecutivePass;
        const req  = LEVEL_CONFIG.CONSECUTIVE_SESSIONS_REQUIRED;
        passEl.style.width = Math.min((pass / req) * 100, 100) + '%';
    }

    // Update level indicator
    updateLevelIndicator();
}

/**
 * Generate saran AI berbasis level dan progres latihan anak.
 * Prompt mengacu pada data spesifik anak untuk saran yang relevan.
 *
 * Referensi: Farhah et al. (2025) tentang AI-powered learning analytics
 * dalam pendidikan khusus.
 */
async function tampilkanSaranCerdas() {
    const container = document.getElementById('ai-advice-container');
    const textElem  = document.getElementById('saran-cerdas-text');

    container.classList.remove('hidden');
    textElem.textContent = "Menganalisis progres...";

    const levelAktif = appState.currentLevel || 1;
    const namaLevel = LEVEL_CONFIG && LEVEL_CONFIG.LABELS && LEVEL_CONFIG.LABELS[levelAktif] 
        ? LEVEL_CONFIG.LABELS[levelAktif].name 
        : `Level ${levelAktif}`;
        
    const attempts = appState.sessionTracker.attempts || 0;
    const correct = appState.sessionTracker.correct || 0;
    const akurasiSesiTerakhir = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;
    
    const sesiLulusBerturut = appState.sessionTracker.consecutivePass || 0;
    const totalSesiHariIni = appState.sessionTracker.history ? appState.sessionTracker.history.length : 0;

    const performa = {
        level:         levelAktif,
        namaLevel:     namaLevel,
        akurasi:       akurasiSesiTerakhir,
        sesiLulus:     sesiLulusBerturut,
        itemSalah:     "huruf/kata yang baru dipelajari", // Placeholder karena belum track item secara spesifik
        polaKesalahan: "butuh lebih banyak latihan pengulangan", // Placeholder
        totalSesi:     totalSesiHariIni
    };

    const saran = await generateSaranCerdas(performa);
    textElem.textContent = saran;
}
