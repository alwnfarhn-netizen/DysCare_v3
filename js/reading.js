/* ==========================================================================
   MODUL 1: MEMBACA (DISLEKSIA)
   Mengimplementasikan adaptive difficulty via level.js
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
