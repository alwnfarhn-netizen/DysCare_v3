/* ==========================================================================
   PRE-ASSESSMENT MODULE
   ==========================================================================
   Skrining awal 12 soal (4 per domain) untuk menentukan level entry adaptif.

   Alur:
   1. User baru buka app → cek localStorage
   2. Belum ada riwayat skrining → tampilkan assessment-screen
   3. User kerjakan 12 soal → sistem hitung skor per domain
   4. Tentukan level awal berdasarkan skor total
   5. Simpan hasil → tampilkan ringkasan (untuk dewasa) → mulai belajar

   Penjelasan untuk BAB III:
   → "Diagnostic pre-assessment dengan 12 item yang mencakup tiga domain
     kesulitan belajar spesifik (membaca/disleksia, mengeja/disgrafia,
     berhitung/diskalkulia). Hasil skrining digunakan untuk menentukan
     entry level adaptif sesuai profil kemampuan pengguna."
   ========================================================================== */

/* -------------------- BANK SOAL SKRINING -------------------- */

const ASSESSMENT_QUESTIONS = {
    // ───── DOMAIN MEMBACA (4 soal) ─────
    // Fokus: pengenalan kata + pemahaman sederhana
    reading: [
        {
            id: 'r1',
            type: 'choose-word',
            instruction: 'Kata mana yang berbunyi "BOLA"?',
            audioText: 'Bola',
            options: ['BOLA', 'BALA', 'BULA', 'BOLO'],
            correct: 'BOLA'
        },
        {
            id: 'r2',
            type: 'choose-word',
            instruction: 'Kata mana yang berbunyi "IBU"?',
            audioText: 'Ibu',
            options: ['IBO', 'IBU', 'UBI', 'UBU'],
            correct: 'IBU'
        },
        {
            id: 'r3',
            type: 'match-image',
            instruction: 'Gambar ini adalah apa?',
            emoji: '🍎',
            options: ['APEL', 'ABEL', 'APAL', 'IPEL'],
            correct: 'APEL'
        },
        {
            id: 'r4',
            type: 'match-image',
            instruction: 'Gambar ini adalah apa?',
            emoji: '🐱',
            options: ['KUCIN', 'KUCING', 'KACING', 'KUCIGG'],
            correct: 'KUCING'
        }
    ],

    // ───── DOMAIN MENGEJA (4 soal) ─────
    // Fokus: phonological awareness + spelling
    spelling: [
        {
            id: 's1',
            type: 'first-letter',
            instruction: 'Huruf pertama dari kata "APEL" adalah?',
            audioText: 'Apel',
            options: ['A', 'E', 'P', 'L'],
            correct: 'A'
        },
        {
            id: 's2',
            type: 'first-letter',
            instruction: 'Huruf pertama dari kata "BUKU" adalah?',
            audioText: 'Buku',
            options: ['U', 'K', 'B', 'O'],
            correct: 'B'
        },
        {
            id: 's3',
            type: 'count-letters',
            instruction: 'Kata "MATA" terdiri dari berapa huruf?',
            audioText: 'Mata',
            options: ['3', '4', '5', '2'],
            correct: '4'
        },
        {
            id: 's4',
            type: 'missing-letter',
            instruction: 'Huruf yang hilang pada kata "B_KU" adalah?',
            audioText: 'Buku',
            options: ['A', 'U', 'O', 'I'],
            correct: 'U'
        }
    ],

    // ───── DOMAIN BERHITUNG (4 soal) ─────
    // Fokus: number sense + basic operations
    math: [
        {
            id: 'm1',
            type: 'count-emoji',
            instruction: 'Berapa jumlah apel?',
            emojis: '🍎🍎🍎',
            options: ['2', '3', '4', '5'],
            correct: '3'
        },
        {
            id: 'm2',
            type: 'simple-add',
            instruction: 'Berapa hasilnya?',
            question: '2 + 1 = ?',
            options: ['2', '3', '4', '5'],
            correct: '3'
        },
        {
            id: 'm3',
            type: 'simple-add',
            instruction: 'Berapa hasilnya?',
            question: '3 + 2 = ?',
            options: ['4', '5', '6', '7'],
            correct: '5'
        },
        {
            id: 'm4',
            type: 'count-compare',
            instruction: 'Mana yang lebih banyak?',
            optionsEmoji: [
                { label: 'A', emoji: '⭐⭐⭐⭐', value: 4 },
                { label: 'B', emoji: '⭐⭐', value: 2 }
            ],
            options: ['A', 'B'],
            correct: 'A'
        }
    ]
};

/* -------------------- STATE PRE-ASSESSMENT -------------------- */

const assessmentState = {
    currentIndex: 0,
    allQuestions: [],  // flat array 12 soal
    answers: [],       // menyimpan {questionId, domain, correct, userAnswer}
    totalAnswered: 0
};

/* -------------------- INISIALISASI -------------------- */

function initAssessment() {
    // Gabung semua soal menjadi flat array dengan tag domain
    assessmentState.allQuestions = [
        ...ASSESSMENT_QUESTIONS.reading.map(q => ({ ...q, domain: 'reading' })),
        ...ASSESSMENT_QUESTIONS.spelling.map(q => ({ ...q, domain: 'spelling' })),
        ...ASSESSMENT_QUESTIONS.math.map(q => ({ ...q, domain: 'math' }))
    ];

    assessmentState.currentIndex = 0;
    assessmentState.answers = [];
    assessmentState.totalAnswered = 0;

    renderAssessmentQuestion();
}

/* -------------------- RENDER SOAL -------------------- */

function renderAssessmentQuestion() {
    const container = document.getElementById('assessment-question-container');
    const progressBar = document.getElementById('assessment-progress-bar');
    const progressLabel = document.getElementById('assessment-progress-label');

    const q = assessmentState.allQuestions[assessmentState.currentIndex];
    const total = assessmentState.allQuestions.length;
    const current = assessmentState.currentIndex + 1;

    // Update progress indicator
    progressLabel.innerText = `Soal ${current} dari ${total}`;
    progressBar.style.width = ((current / total) * 100) + '%';

    // Domain badge
    const domainInfo = {
        reading:  { label: '📖 Membaca', color: 'bg-blue-100 text-brand-blue' },
        spelling: { label: '🔤 Mengeja', color: 'bg-green-100 text-green-700' },
        math:     { label: '🔢 Berhitung', color: 'bg-purple-100 text-purple-700' }
    }[q.domain];

    let questionVisual = '';

    // Visual sesuai tipe soal
    if (q.type === 'match-image' || q.type === 'count-emoji') {
        questionVisual = `<div class="text-7xl md:text-8xl mb-6 feedback-animation">${q.emoji || q.emojis}</div>`;
    } else if (q.type === 'simple-add') {
        questionVisual = `<div class="text-5xl md:text-6xl font-bold text-purple-600 mb-6 feedback-animation">${q.question}</div>`;
    } else if (q.type === 'count-compare') {
        questionVisual = `
            <div class="flex gap-8 mb-6 justify-center feedback-animation">
                ${q.optionsEmoji.map(opt => `
                    <div class="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
                        <div class="text-xs font-bold text-gray-500 mb-2">Pilihan ${opt.label}</div>
                        <div class="text-4xl">${opt.emoji}</div>
                    </div>
                `).join('')}
            </div>`;
    } else {
        // choose-word, first-letter, count-letters, missing-letter
        questionVisual = `<div class="text-4xl md:text-5xl font-bold text-gray-700 mb-6 feedback-animation tracking-wider">${q.audioText || q.instruction}</div>`;
    }

    // Tombol dengar (untuk semua soal yang ada audioText)
    const listenBtn = q.audioText
        ? `<button onclick="speakText('${q.audioText}', 0.7)" class="mt-2 bg-blue-50 hover:bg-blue-100 text-brand-blue px-4 py-2 rounded-full text-sm transition">
             <i class="fa-solid fa-volume-high"></i> Dengar
           </button>`
        : '';

    container.innerHTML = `
        <div class="text-center">
            <div class="flex justify-center mb-4">
                <span class="inline-block px-3 py-1 rounded-full text-xs font-bold ${domainInfo.color}">
                    ${domainInfo.label}
                </span>
            </div>

            <p class="text-gray-500 text-lg mb-6">${q.instruction}</p>

            ${questionVisual}

            ${listenBtn}

            <div class="grid grid-cols-2 gap-4 max-w-md mx-auto mt-8">
                ${q.options.map(opt => `
                    <button
                        onclick="submitAssessmentAnswer('${opt.replace(/'/g, "\\'")}')"
                        class="assessment-option-btn bg-white hover:bg-brand-blue hover:text-white border-2 border-gray-200 hover:border-brand-blue py-4 px-6 rounded-xl font-bold text-xl text-gray-700 transition-all shadow-sm">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

/* -------------------- TANGANI JAWABAN -------------------- */

function submitAssessmentAnswer(userAnswer) {
    const q = assessmentState.allQuestions[assessmentState.currentIndex];
    const isCorrect = userAnswer === q.correct;

    // Simpan jawaban
    assessmentState.answers.push({
        questionId: q.id,
        domain: q.domain,
        correct: isCorrect,
        userAnswer
    });
    assessmentState.totalAnswered++;

    // Visual feedback singkat (tanpa memberi tahu benar/salah ke anak,
    // supaya tidak menurunkan rasa percaya diri)
    playSound(isCorrect ? 'correct' : 'wrong');

    // Disable semua tombol sebentar
    document.querySelectorAll('.assessment-option-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.innerText.trim() === userAnswer) {
            btn.classList.add('bg-brand-blue', 'text-white', 'border-brand-blue');
        }
    });

    // Lanjut ke soal berikutnya atau finish
    setTimeout(() => {
        assessmentState.currentIndex++;
        if (assessmentState.currentIndex < assessmentState.allQuestions.length) {
            renderAssessmentQuestion();
        } else {
            finishAssessment();
        }
    }, 600);
}

/* -------------------- HITUNG SKOR & TENTUKAN LEVEL -------------------- */

function calculateAssessmentResult() {
    const scores = { reading: 0, spelling: 0, math: 0 };
    const maxPerDomain = 4;

    assessmentState.answers.forEach(ans => {
        if (ans.correct) scores[ans.domain]++;
    });

    const totalScore = scores.reading + scores.spelling + scores.math;
    const totalMax = 12;
    const percentage = (totalScore / totalMax) * 100;

    // Tentukan level entry
    let entryLevel, entryLabel, entryEmoji;
    if (percentage >= 78) {          // ≥ 9/12 benar
        entryLevel = 2;
        entryLabel = 'Sedang';
        entryEmoji = '🌟';
    } else if (percentage >= 44) {   // ≥ 5/12 benar
        entryLevel = 1;
        entryLabel = 'Mudah';
        entryEmoji = '🌱';
    } else {                         // < 5/12 benar
        entryLevel = 1;
        entryLabel = 'Mudah (dengan pendampingan)';
        entryEmoji = '🌱';
    }

    // Identifikasi domain terkuat & terlemah
    const sortedDomains = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const strongest = sortedDomains[0];
    const weakest = sortedDomains[sortedDomains.length - 1];

    const domainName = {
        reading:  'Membaca',
        spelling: 'Mengeja',
        math:     'Berhitung'
    };

    return {
        scores,
        totalScore,
        totalMax,
        percentage: Math.round(percentage),
        entryLevel,
        entryLabel,
        entryEmoji,
        strongest: { key: strongest[0], name: domainName[strongest[0]], score: strongest[1] },
        weakest: { key: weakest[0], name: domainName[weakest[0]], score: weakest[1] },
        timestamp: Date.now(),
        completedAt: new Date().toISOString()
    };
}

/* -------------------- FINALISASI -------------------- */

function finishAssessment() {
    const result = calculateAssessmentResult();

    // Simpan hasil ke localStorage
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT, JSON.stringify(result));

    // Set level awal sesuai hasil skrining
    appState.currentLevel = result.entryLevel;
    saveLevel();

    // Tampilkan layar transisi "selesai" ke anak (tanpa detail angka)
    showAssessmentComplete(result);
}

function showAssessmentComplete(result) {
    const container = document.getElementById('assessment-question-container');
    const progressLabel = document.getElementById('assessment-progress-label');
    const progressBar = document.getElementById('assessment-progress-bar');

    progressLabel.innerText = 'Skrining Selesai!';
    progressBar.style.width = '100%';

    container.innerHTML = `
        <div class="text-center py-8">
            <div class="text-7xl mb-6 feedback-animation">🎉</div>
            <h2 class="text-3xl font-bold text-brand-blue mb-4">Hebat! Kamu Sudah Selesai!</h2>
            <p class="text-gray-600 text-lg mb-2">Sekarang kita mulai belajar di level</p>
            <div class="text-4xl font-bold text-orange-500 mb-6">${result.entryEmoji} ${result.entryLabel}</div>

            <p class="text-gray-500 text-sm mb-8 max-w-md mx-auto">
                Soal-soal akan disesuaikan dengan kemampuanmu.
                Semangat belajar! 💪
            </p>

            <button
                onclick="exitAssessmentToHome()"
                class="bg-brand-blue hover:bg-brand-bluehover text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-200 transition text-lg">
                Mulai Belajar <i class="fa-solid fa-arrow-right ml-2"></i>
            </button>
        </div>
    `;
}

function exitAssessmentToHome() {
    navigateTo('home-screen');
}

/* -------------------- LEWATI SKRINING (khusus dewasa) -------------------- */

function skipAssessment() {
    // Tandai sudah skrining dengan hasil "skipped"
    const skipResult = {
        skipped: true,
        entryLevel: 1,
        entryLabel: 'Mudah',
        timestamp: Date.now(),
        completedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.ASSESSMENT, JSON.stringify(skipResult));
    appState.currentLevel = 1;
    saveLevel();
    navigateTo('home-screen');
}

/* -------------------- CEK APAKAH USER BARU -------------------- */

function hasCompletedAssessment() {
    return localStorage.getItem(STORAGE_KEYS.ASSESSMENT) !== null;
}

function getAssessmentResult() {
    const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT);
    return data ? JSON.parse(data) : null;
}

/* -------------------- RINGKASAN UNTUK DEWASA (di halaman Profil) -------------------- */

function renderAssessmentSummary() {
    const result = getAssessmentResult();
    const container = document.getElementById('assessment-summary-container');

    if (!container) return;

    if (!result) {
        container.innerHTML = `
            <div class="bg-gray-50 p-4 rounded-xl text-center text-gray-500 text-sm">
                Belum ada data skrining. Skrining akan muncul saat anak membuka aplikasi pertama kali.
            </div>
        `;
        return;
    }

    if (result.skipped) {
        container.innerHTML = `
            <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm">
                <div class="font-bold text-yellow-700 mb-1">⚠️ Skrining Dilewati</div>
                <p class="text-yellow-700">Anak memulai dari level Mudah tanpa profiling awal.</p>
                <button onclick="resetAssessmentAndRedo()" class="mt-3 text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-full">
                    Lakukan Skrining Ulang
                </button>
            </div>
        `;
        return;
    }

    const domainRows = [
        { key: 'reading', name: 'Membaca (Disleksia)', score: result.scores.reading, color: 'blue' },
        { key: 'spelling', name: 'Mengeja (Disgrafia)', score: result.scores.spelling, color: 'green' },
        { key: 'math', name: 'Berhitung (Diskalkulia)', score: result.scores.math, color: 'purple' }
    ];

    container.innerHTML = `
        <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <div class="text-xs text-gray-500">Hasil Skrining Awal</div>
                    <div class="text-sm font-semibold text-gray-700">
                        ${new Date(result.completedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-xs text-gray-500">Skor Total</div>
                    <div class="text-lg font-bold text-brand-blue">${result.totalScore}/${result.totalMax} (${result.percentage}%)</div>
                </div>
            </div>

            <div class="space-y-2 mb-4">
                ${domainRows.map(row => `
                    <div class="flex items-center gap-3">
                        <div class="flex-1 text-sm font-medium text-gray-700">${row.name}</div>
                        <div class="flex-1 bg-gray-100 rounded-full h-3">
                            <div class="bg-${row.color}-500 h-3 rounded-full" style="width: ${(row.score / 4) * 100}%"></div>
                        </div>
                        <div class="text-sm font-bold text-gray-600 w-10 text-right">${row.score}/4</div>
                    </div>
                `).join('')}
            </div>

            <div class="border-t border-gray-100 pt-3 space-y-1 text-xs text-gray-600">
                <div><span class="font-semibold">Level awal:</span> ${result.entryEmoji} ${result.entryLabel}</div>
                <div><span class="font-semibold">Domain terkuat:</span> ${result.strongest.name} (${result.strongest.score}/4)</div>
                <div><span class="font-semibold">Perlu latihan ekstra:</span> ${result.weakest.name} (${result.weakest.score}/4)</div>
            </div>

            <button onclick="resetAssessmentAndRedo()" class="mt-4 w-full text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg">
                <i class="fa-solid fa-rotate-right mr-1"></i> Lakukan Skrining Ulang
            </button>
        </div>
    `;
}

function resetAssessmentAndRedo() {
    localStorage.removeItem(STORAGE_KEYS.ASSESSMENT);
    navigateTo('assessment-screen');
    initAssessment();
}
