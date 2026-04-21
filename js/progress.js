/* ==========================================================================
   PROGRESS SCREEN: Capaian belajar + saran AI
   Menampilkan level indicator dan progress bars
   ========================================================================== */

function updateProgressUI() {
    const max = 100;
    const updateBar = (idVal, idBar, val) => {
        document.getElementById(idVal).innerText = val + " Poin";
        document.getElementById(idBar).style.width = Math.min((val / max) * 100, 100) + "%";
    };

    updateBar('prog-read-val',  'prog-bar-read',  appState.progress.reading);
    updateBar('prog-spell-val', 'prog-bar-spell', appState.progress.spelling);
    updateBar('prog-math-val',  'prog-bar-math',  appState.progress.math);

    // Update level indicator
    updateLevelIndicator();
}

async function generateProgressAdvice() {
    const container = document.getElementById('ai-advice-container');
    const textElem = document.getElementById('ai-advice-text');

    container.classList.remove('hidden');
    textElem.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> AI sedang menganalisis nilaimu...';

    const p = appState.progress;
    const levelInfo = LEVEL_CONFIG.LABELS[appState.currentLevel];
    const totalScore = getTotalScore();

    const prompt = `Saya adalah asisten pendidikan untuk anak dengan kesulitan belajar.
Data anak:
- Level saat ini: ${levelInfo.name}
- Skor Membaca: ${p.reading} poin
- Skor Mengeja: ${p.spelling} poin
- Skor Berhitung: ${p.math} poin
- Total: ${totalScore} poin

Berikan 1-2 kalimat saran yang spesifik dan memotivasi untuk anak ini. Sebutkan area mana yang perlu lebih banyak latihan berdasarkan skornya. Bahasa Indonesia, ramah anak.`;

    const advice = await generateAIContent(prompt);

    if (advice) {
        textElem.innerText = advice.trim();
    } else {
        textElem.innerText = "Teruslah belajar dan jangan menyerah! Kamu pasti bisa.";
    }
}
