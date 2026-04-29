/* ==========================================================================
   MODUL 1: MEMBACA (DISLEKSIA)
   Mengimplementasikan adaptive difficulty via level.js

   Pendekatan VAKT:
   - Visual   : teks kalimat dengan word highlighting per kata (TTS)
   - Auditory : Text-to-Speech (speakText) bahasa Indonesia
   - Kinesthetic : rekam suara via Web Speech API (STT)
   - Tactile  : tap tombol di layar sentuh

   Kompatibilitas STT:
   - Chrome/Edge: window.SpeechRecognition || window.webkitSpeechRecognition
   - Safari 14.5+: window.webkitSpeechRecognition
   - Firefox: tidak mendukung STT → fallback evaluasi manual (guru/orang tua)
   ========================================================================== */

async function loadReadingContent() {
    const contentArea = document.getElementById('reading-content');
    const feedbackArea = document.getElementById('reading-feedback');

    feedbackArea.innerHTML = "";

    // Ambil kalimat dari pool SESUAI LEVEL
    const sentencesPool = getReadingSentencesByLevel();

    // 30% kemungkinan memakai AI (jika API key tersedia), 70% pakai data lokal
    const useAI = Math.random() > 0.7 && API_KEY;

    if (useAI) {
        contentArea.innerHTML = '<span class="text-gray-400 text-lg animate-pulse">🤖 Sedang membuat kalimat baru...</span>';

        const basePrompt = "Buatkan satu kalimat {LEVEL} bahasa Indonesia untuk latihan membaca. Hanya kalimat saja, tanpa tanda petik, tanpa penjelasan tambahan.";
        const prompt = getLevelAwarePrompt(basePrompt);

        const aiText = await generateAIContent(prompt);

        appState.reading.currentSentence = aiText
            ? aiText.trim().replace(/["""']/g, '')
            : randomFromArray(sentencesPool);
    } else {
        appState.reading.currentSentence = randomFromArray(sentencesPool);
    }

    // Render kalimat sebagai span per kata (untuk highlight nanti)
    contentArea.innerHTML = appState.reading.currentSentence
        .split(' ')
        .map(w => `<span>${w}</span>`)
        .join(' ');
}

/**
 * Hitung akurasi per kata antara ucapan anak dan kalimat target.
 *
 * Pendekatan: hitung berapa kata target yang muncul di ucapan anak,
 * lalu bagi dengan jumlah total kata target. Toleran terhadap urutan
 * dan kata yang terlewat — lebih sesuai untuk evaluasi membaca anak disleksia.
 *
 * @param {string} transcript - hasil STT (ucapan anak)
 * @param {string} target     - kalimat yang harus dibaca
 * @returns {number} persentase akurasi 0-100
 */
function calcWordAccuracy(transcript, target) {
    const clean = s => s.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .trim();

    const targetWords  = clean(target).split(/\s+/);
    const spokenWords  = clean(transcript).split(/\s+/);

    let matched = 0;
    targetWords.forEach(word => {
        if (spokenWords.includes(word)) matched++;
    });

    return Math.round((matched / targetWords.length) * 100);
}

/**
 * Tampilkan UI evaluasi manual untuk browser yang tidak mendukung STT.
 *
 * Digunakan sebagai fallback di Firefox dan browser lain.
 * Guru atau orang tua yang menilai apakah anak membaca dengan benar.
 *
 * @param {HTMLElement} feedback - elemen area feedback
 */
function showManualEvaluation(feedback) {
    feedback.innerHTML = `
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-2">
            <p class="text-sm text-blue-700 font-semibold mb-2">
                <i class="fa-solid fa-clipboard-check mr-1"></i>
                Apakah anak berhasil membaca dengan benar?
            </p>
            <div class="flex gap-2">
                <button id="btn-manual-correct"
                    class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold text-sm transition">
                    ✅ Benar
                </button>
                <button id="btn-manual-wrong"
                    class="flex-1 bg-orange-400 hover:bg-orange-500 text-white py-2 rounded-lg font-bold text-sm transition">
                    🔄 Coba Lagi
                </button>
            </div>
        </div>`;

    document.getElementById('btn-manual-correct').addEventListener('click', () => {
        playSound('correct');
        feedback.innerHTML = '<span class="text-green-500 feedback-animation"><i class="fa-solid fa-star"></i> Hebat! Lanjut ke kalimat berikutnya.</span>';
        appState.progress.reading++;
        saveProgress();
        recordExerciseResult(true);
    });

    document.getElementById('btn-manual-wrong').addEventListener('click', () => {
        playSound('wrong');
        feedback.innerHTML = '<span class="text-orange-500">Ayo coba lagi! Dengarkan dulu lalu baca.</span>';
        recordExerciseResult(false);
    });
}

function setupReading() {
    const btnListen = document.getElementById('btn-listen');
    const btnSpeak  = document.getElementById('btn-speak');
    const btnNext   = document.getElementById('btn-next-reading');
    const feedback  = document.getElementById('reading-feedback');

    // Text-to-Speech (semua browser)
    btnListen.addEventListener('click', () => {
        speakText(appState.reading.currentSentence, 0.8);
    });

    // Speech-to-Text: gunakan standard API dulu, fallback ke webkit (Chrome/Safari)
    // Referensi: W3C Web Speech API Specification
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang            = 'id-ID';
        recognition.continuous      = false;
        recognition.interimResults  = false;
        recognition.maxAlternatives = 3; // coba beberapa alternatif transkripsi

        btnSpeak.addEventListener('click', () => {
            if (appState.reading.isListening) return;
            try {
                recognition.start();
                btnSpeak.classList.add('bg-red-500', 'animate-pulse');
                btnSpeak.innerHTML = '<i class="fa-solid fa-stop"></i> Mendengarkan...';
                appState.reading.isListening = true;
                feedback.innerHTML = "🎤 Silakan baca dengan keras...";
            } catch (e) {
                console.error('STT start error:', e);
                feedback.innerHTML = '<span class="text-red-500 text-sm">Gagal memulai perekaman. Coba lagi.</span>';
                appState.reading.isListening = false;
            }
        });

        recognition.onresult = (e) => {
            // Bandingkan semua alternatif transkripsi, ambil yang akurasinya tertinggi
            let bestTranscript = '';
            let bestAccuracy   = 0;

            for (let i = 0; i < e.results[0].length; i++) {
                const t   = e.results[0][i].transcript;
                const acc = calcWordAccuracy(t, appState.reading.currentSentence);
                if (acc > bestAccuracy) {
                    bestAccuracy   = acc;
                    bestTranscript = t;
                }
            }

            // Threshold akurasi 70% — toleran terhadap 1-2 kata yang terlewat
            const isCorrect = bestAccuracy >= 70;

            if (isCorrect) {
                playSound('correct');
                feedback.innerHTML = `
                    <span class="text-green-500 feedback-animation">
                        <i class="fa-solid fa-star"></i> Hebat! Akurasi ${bestAccuracy}%.
                    </span>`;
                appState.progress.reading++;
                saveProgress();
            } else {
                playSound('wrong');
                feedback.innerHTML = `
                    <span class="text-orange-500">
                        Hampir! Kamu bilang: "<em>${bestTranscript}</em>" (${bestAccuracy}% kata tepat)
                    </span>`;
            }

            // Catat untuk adaptive level progression (akurasi berbasis sesi)
            recordExerciseResult(isCorrect);
        };

        recognition.onerror = (e) => {
            btnSpeak.classList.remove('bg-red-500', 'animate-pulse');
            btnSpeak.innerHTML = '<i class="fa-solid fa-microphone"></i> Baca (Rekam)';
            appState.reading.isListening = false;

            if (e.error === 'not-allowed') {
                feedback.innerHTML = '<span class="text-red-500 text-sm"><i class="fa-solid fa-lock mr-1"></i>Akses mikrofon ditolak. Izinkan mikrofon di pengaturan browser.</span>';
            } else if (e.error === 'no-speech') {
                feedback.innerHTML = '<span class="text-orange-500 text-sm">Tidak terdengar. Coba bicara lebih keras.</span>';
            } else if (e.error === 'network') {
                // Jaringan tidak tersedia → fallback ke evaluasi manual
                feedback.innerHTML = '<span class="text-yellow-600 text-sm">STT memerlukan koneksi internet. Beralih ke evaluasi manual.</span>';
                showManualEvaluation(feedback);
            }
        };

        recognition.onend = () => {
            btnSpeak.classList.remove('bg-red-500', 'animate-pulse');
            btnSpeak.innerHTML = '<i class="fa-solid fa-microphone"></i> Baca (Rekam)';
            appState.reading.isListening = false;
        };

    } else {
        // Fallback: Firefox dan browser lain yang tidak mendukung Web Speech API
        // Ganti tombol rekam dengan evaluasi manual oleh guru/orang tua
        btnSpeak.innerHTML = '<i class="fa-solid fa-clipboard-check"></i> Evaluasi Membaca';
        btnSpeak.title = 'Klik setelah anak selesai membaca untuk menilai';

        btnSpeak.addEventListener('click', () => {
            showManualEvaluation(feedback);
        });
    }

    btnNext.addEventListener('click', loadReadingContent);
}
