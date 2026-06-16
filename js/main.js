/* ==========================================================================
   MAIN: Inisialisasi aplikasi
   Entry point - dijalankan setelah semua modul ter-load
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Kontrol visibilitas modul sesuai flag di config.js
    if (SHOW_DISGRAFIA_MODUL)   document.getElementById('card-menulis').classList.remove('hidden');
    if (SHOW_DISKALKULIA_MODUL) document.getElementById('card-berhitung').classList.remove('hidden');

    // Load data tersimpan
    loadProgress();
    loadLevel();
    loadLevelProgress(); // muat riwayat sesi akurasi untuk adaptive progression

    // Setup UI aksesibilitas
    loadAccessibilitySettings();

    // Setup modul interaktif
    setupReading();
    setupSpelling();
    setupMath();
    setupProfilePage();

    // ───── ROUTING AWAL ─────
    if (!hasCompletedAssessment()) {
        navigateTo('assessment-screen');
        initAssessment();
    } else {
        navigateTo('home-screen');
    }
});
