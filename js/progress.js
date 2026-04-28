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
async function generateProgressAdvice() {
    const container = document.getElementById('ai-advice-container');
    const textElem  = document.getElementById('ai-advice-text');

    container.classList.remove('hidden');
    textElem.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> AI sedang menganalisis nilaimu...';

    const p         = appState.progress;
    const levelInfo = LEVEL_CONFIG.LABELS[appState.currentLevel];
    const pass      = appState.sessionTracker.consecutivePass;
    const req       = LEVEL_CONFIG.CONSECUTIVE_SESSIONS_REQUIRED;

    const prompt = `Saya adalah asisten pendidikan untuk anak disleksia.
Data anak saat ini:
- Level: ${appState.currentLevel} (${levelInfo.name} - ${levelInfo.subtitle})
- Latihan Membaca: ${p.reading} latihan selesai
- Latihan Mengeja: ${p.spelling} latihan selesai
- Sesi lulus berturut-turut: ${pass} dari ${req} yang dibutuhkan untuk naik level

Berikan 1-2 kalimat saran yang spesifik, memotivasi, dan ramah anak.
Sebutkan modul mana yang perlu lebih banyak latihan.
Bahasa Indonesia yang santai dan menyenangkan untuk anak SD kelas 1-3.`;

    const advice = await generateAIContent(prompt);

    if (advice) {
        textElem.innerText = advice.trim();
    } else {
        textElem.innerText = "Teruslah berlatih! Setiap latihan membuat kamu semakin hebat dalam membaca.";
    }
}
