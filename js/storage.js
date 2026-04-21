/* ==========================================================================
   STORAGE: Pengelolaan localStorage (progress, profile, level, history)
   ========================================================================== */

/* -------------------- PROGRESS -------------------- */
function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (saved) {
        appState.progress = JSON.parse(saved);
    }
    updateScoreDisplays();
}

function saveProgress() {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(appState.progress));
    updateScoreDisplays();

    // Cek apakah perlu naik level
    checkLevelUp();

    // Simpan session ke history (untuk fitur chart di Fase 3)
    saveSessionEntry();
}

function updateScoreDisplays() {
    const rScore = document.getElementById('reading-score');
    const sScore = document.getElementById('spelling-score');
    const mScore = document.getElementById('math-score');

    if (rScore) rScore.innerText = appState.progress.reading;
    if (sScore) sScore.innerText = appState.progress.spelling;
    if (mScore) mScore.innerText = appState.progress.math;
}

/* -------------------- LEVEL -------------------- */
function loadLevel() {
    const saved = localStorage.getItem(STORAGE_KEYS.LEVEL);
    if (saved) {
        appState.currentLevel = parseInt(saved, 10);
    } else {
        appState.currentLevel = 1;
    }
}

function saveLevel() {
    localStorage.setItem(STORAGE_KEYS.LEVEL, String(appState.currentLevel));
}

/* -------------------- SESSION HISTORY (untuk chart nanti) -------------------- */
function saveSessionEntry() {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
    history.push({
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0],
        progress: { ...appState.progress },
        level: appState.currentLevel
    });

    // Batasi maksimal 100 entri terakhir supaya tidak membengkak
    if (history.length > 100) history.shift();

    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

function getSessionHistory() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
}

/* -------------------- PROFILE -------------------- */
function loadProfileData() {
    const p = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (p) {
        const data = JSON.parse(p);
        const input = document.getElementById('profile-name-input');
        if (input) input.value = data.name || '';
    }
}

function saveProfileData(name) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify({ name }));
}

function getProfileName() {
    const p = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (p) {
        return JSON.parse(p).name || '';
    }
    return '';
}

/* -------------------- RESET -------------------- */
function confirmResetProgress() {
    appState.progress = { reading: 0, spelling: 0, math: 0 };
    appState.currentLevel = 1;

    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(appState.progress));
    localStorage.setItem(STORAGE_KEYS.LEVEL, '1');
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.ASSESSMENT);

    updateScoreDisplays();
    updateProgressUI();
    closeModal('confirm-modal');
    showInfoModal('Sukses', 'Progres, level, dan skrining telah direset. Silakan lakukan skrining ulang saat buka aplikasi lagi.');
}

function resetProgressWithConfirmation() {
    document.getElementById('confirm-modal').classList.remove('hidden');
}

/* -------------------- PROFILE PAGE SETUP -------------------- */
function setupProfilePage() {
    document.getElementById('save-profile-btn').addEventListener('click', () => {
        const nameVal = document.getElementById('profile-name-input').value.trim();
        saveProfileData(nameVal);

        const fb = document.getElementById('profile-save-feedback');
        fb.classList.remove('hidden');
        setTimeout(() => fb.classList.add('hidden'), 2000);
    });
}
