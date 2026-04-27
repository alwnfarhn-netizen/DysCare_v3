/* ==========================================================================
   MAIN: Inisialisasi aplikasi
   Entry point - dijalankan setelah semua modul ter-load
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
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
