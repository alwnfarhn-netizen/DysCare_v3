/* ==========================================================================
   MAIN: Inisialisasi aplikasi
   Entry point - dijalankan setelah semua modul ter-load
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Load data tersimpan
    loadProgress();
    loadLevel();

    // Setup UI
    loadAccessibilitySettings();

    // Setup modul interaktif
    setupReading();
    setupSpelling();
    setupMath();
    setupProfilePage();

    // Tampilkan halaman utama
    navigateTo('home-screen');

    console.log('🚀 DYSCARE ready. Current level:', appState.currentLevel);
    console.log('📊 Total score:', getTotalScore());
});
