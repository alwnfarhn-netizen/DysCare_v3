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

    // ───── ROUTING AWAL ─────
    // Cek apakah user baru (belum pernah skrining)
    if (!hasCompletedAssessment()) {
        // User baru → tampilkan pre-assessment
        navigateTo('assessment-screen');
        initAssessment();
        console.log('👋 User baru terdeteksi, memulai pre-assessment');
    } else {
        // User lama → langsung ke home
        navigateTo('home-screen');
        const result = getAssessmentResult();
        console.log('✅ Riwayat skrining ditemukan:', result.entryLabel);
    }

    console.log('🚀 DYSCARE ready. Current level:', appState.currentLevel);
    console.log('📊 Total score:', getTotalScore());
});
