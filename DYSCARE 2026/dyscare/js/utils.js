/* ==========================================================================
   UTILITIES: Helper umum (modal, SFX, navigasi)
   ========================================================================== */

/* -------------------- NAVIGASI -------------------- */
function navigateTo(screenId) {
    // Sembunyikan semua layar
    document.querySelectorAll('.screen-content').forEach(el => el.classList.add('hidden'));

    // Tampilkan layar tujuan
    document.getElementById(screenId).classList.remove('hidden');
    appState.currentScreen = screenId;

    // Atur visibilitas header
    const header = document.getElementById('app-header');
    if (screenId === 'home-screen') {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }

    // Inisialisasi per layar
    if (screenId === 'reading-screen')  loadReadingContent();
    if (screenId === 'spelling-screen') loadSpellingContent();
    if (screenId === 'math-screen')     loadMathProblem();
    if (screenId === 'writing-screen')  setupWritingCanvas();
    if (screenId === 'progress-screen') updateProgressUI();
    if (screenId === 'profile-screen')  loadProfileData();

    window.scrollTo(0, 0);
}

/* -------------------- MODAL -------------------- */
function toggleAccessibilityPanel() {
    document.getElementById('accessibility-panel').classList.toggle('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

function showInfoModal(title, msg, iconClass = "fa-solid fa-info-circle") {
    document.getElementById('info-modal-title').innerText = title;
    document.getElementById('info-modal-message').innerText = msg;
    document.getElementById('info-modal-icon').innerHTML = `<i class="${iconClass}"></i>`;
    document.getElementById('info-modal').classList.remove('hidden');
}

/* -------------------- SFX ENGINE -------------------- */
// Membangun suara native tanpa file audio eksternal
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioCtx();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'correct') {
        // Suara "Ting-Ting" (Berhasil)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);         // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1);   // E5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
    } else if (type === 'wrong') {
        // Suara "Bzzzt" (Salah)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'levelup') {
        // Suara fanfare singkat (Naik level)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);        // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3);  // G5
        osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.45); // C6
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.8);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
    }
}

/* -------------------- TEXT-TO-SPEECH HELPER -------------------- */
function speakText(text, rate = 0.8) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
}

/* -------------------- RANDOM HELPER -------------------- */
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
