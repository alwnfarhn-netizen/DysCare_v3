/* ==========================================================================
   MODUL 1: MEMBACA (DISLEKSIA)
   Mengimplementasikan adaptive difficulty via level.js
   ========================================================================== */

// Data level sesuai level aktif anak (ambil dari state/localStorage)
const dataPerLevel = {
  1: { level:1, namaLevel:"Pengenalan Huruf",      polaKata:"Huruf tunggal vokal dan konsonan", daftarKata:"a, i, u, e, o, b, d, m, n",            panjang:"1 kalimat",   tema:"hewan" },
  2: { level:2, namaLevel:"Kesadaran Fonologis",   polaKata:"Suku kata KV",                    daftarKata:"ba, bi, bo, da, di, ma, mi, na, ni",    panjang:"2 kalimat",   tema:"keluarga" },
  3: { level:3, namaLevel:"Grafem-Fonem",          polaKata:"Kata KV-KV sederhana",            daftarKata:"bola, kaki, mata, sapi, buku, dada",    panjang:"2-3 kalimat", tema:"sekolah" },
  4: { level:4, namaLevel:"Blending Suku Kata",    polaKata:"Kata 2 suku kata KV-KVK",         daftarKata:"batu, makan, tidur, duduk, minum",      panjang:"3-4 kalimat", tema:"bermain" },
  5: { level:5, namaLevel:"Membaca Kata",          polaKata:"Kata frekuensi tinggi SD kelas 1", daftarKata:"semua kata level 3 dan 4 digabung",    panjang:"4-5 kalimat", tema:"makanan" },
  6: { level:6, namaLevel:"Kelancaran Membaca",    polaKata:"Kalimat lengkap S-P-O",            daftarKata:"semua kata frekuensi tinggi",           panjang:"5-8 kalimat", tema:"kegiatan sehari-hari" },
};

async function loadReadingContent() {
    const contentArea = document.getElementById('reading-content');
    const feedbackArea = document.getElementById('reading-feedback');

    feedbackArea.innerHTML = "";
    contentArea.innerHTML = '<span class="text-gray-400 text-lg animate-pulse">Menyiapkan bacaan...</span>';

    const levelAktif = appState.currentLevel || 1;
    const nomorSesi = (appState.progress.reading || 0) + 1;

    const levelData = dataPerLevel[levelAktif] || dataPerLevel[1];
    
    // Gunakan fungsi generateCeritaAI dari ai-service.js
    const teks = await generateCeritaAI(levelData, nomorSesi);

    appState.reading.currentSentence = teks;

    // Render kalimat sebagai span per kata (untuk highlight nanti)
    contentArea.innerHTML = appState.reading.currentSentence
        .split(' ')
        .map(w => `<span>${w}</span>`)
        .join(' ');
}

function setupReading() {
    const btnListen = document.getElementById('btn-listen');
    const btnSpeak  = document.getElementById('btn-speak');
    const btnNext   = document.getElementById('btn-next-reading');
    const feedback  = document.getElementById('reading-feedback');

    // Text-to-Speech
    btnListen.addEventListener('click', () => {
        speakText(appState.reading.currentSentence, 0.8);
    });

    // Speech-to-Text (Perekaman)
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'id-ID';
        recognition.continuous = false;

        btnSpeak.addEventListener('click', () => {
            if (appState.reading.isListening) return;
            try {
                recognition.start();
                btnSpeak.classList.add('bg-red-500', 'animate-pulse');
                btnSpeak.innerHTML = '<i class="fa-solid fa-stop"></i> Mendengarkan...';
                appState.reading.isListening = true;
                feedback.innerHTML = "🎤 Silakan baca...";
            } catch (e) {
                console.error(e);
            }
        });

        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript.toLowerCase();
            const target = appState.reading.currentSentence
                .toLowerCase()
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
            const cleanTranscript = transcript.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

            const isCorrect = cleanTranscript.includes(target) || target.includes(cleanTranscript);

            if (isCorrect) {
                playSound('correct');
                feedback.innerHTML = `<span class="text-green-500 feedback-animation"><i class="fa-solid fa-star"></i> Hebat! Benar.</span>`;
                appState.progress.reading++;
                saveProgress();
            } else {
                playSound('wrong');
                feedback.innerHTML = `<span class="text-orange-500">Hampir! Kamu bilang: "${transcript}"</span>`;
            }

            // Catat hasil untuk adaptive level progression (akurasi berbasis sesi)
            recordExerciseResult(isCorrect);
        };

        recognition.onend = () => {
            btnSpeak.classList.remove('bg-red-500', 'animate-pulse');
            btnSpeak.classList.add('bg-green-500');
            btnSpeak.innerHTML = '<i class="fa-solid fa-microphone"></i> Baca (Rekam)';
            appState.reading.isListening = false;
        };
    } else {
        btnSpeak.style.display = 'none';
        feedback.innerText = "Browser ini tidak mendukung fitur perekaman suara.";
    }

    btnNext.addEventListener('click', loadReadingContent);
}
