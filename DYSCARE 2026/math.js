/* ==========================================================================
   MODUL 4: BERHITUNG (DISKALKULIA)
   Soal pilihan ganda visual + AI story generator, level-aware
   ========================================================================== */

async function generateMathStory() {
    const btn = document.getElementById('btn-math-story');
    const problemsPool = getMathProblemsByLevel();
    const problem = problemsPool[appState.math.currentIndex % problemsPool.length];
    const originalText = document.getElementById('math-text-question').innerText;

    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Membuat...';
    btn.disabled = true;

    const opWord = problem.op === '+' ? 'ditambah' : 'dikurangi';
    const prompt = `Buatkan soal cerita matematika yang sangat pendek dan sederhana (1 kalimat saja) untuk anak TK/SD kelas 1 berdasarkan operasi ini: ${problem.num1} ${opWord} ${problem.num2}. Gunakan objek yang menarik (misal buah, mainan, hewan). Bahasa Indonesia.`;

    const story = await generateAIContent(prompt);

    if (story) {
        document.getElementById('math-text-question').innerText = story.trim();
        btn.innerHTML = '✨ Soal Baru';
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '✨ Buat Soal Cerita';
        }, 3000);
    } else {
        document.getElementById('math-text-question').innerText = originalText;
        btn.innerHTML = '❌ Gagal';
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = '✨ Buat Soal Cerita';
        }, 2000);
    }
}

function loadMathProblem() {
    // Ambil pool SESUAI LEVEL
    const problemsPool = getMathProblemsByLevel();

    // Reset index jika melebihi pool
    if (appState.math.currentIndex >= problemsPool.length) {
        appState.math.currentIndex = 0;
    }

    const p = problemsPool[appState.math.currentIndex];

    // Hitung jawaban benar berdasarkan operator
    const correctAns = p.op === '+' ? (p.num1 + p.num2) : (p.num1 - p.num2);

    // Render visual emoji (sesuaikan dengan operator)
    document.getElementById('math-visual-1').innerHTML = Array(p.num1).fill(p.visual1).join('');
    document.getElementById('math-visual-2').innerHTML = Array(p.num2).fill(p.visual2).join('');
    document.getElementById('math-operator').innerText = p.op;

    // Teks pertanyaan
    const actionWord = p.op === '+' ? 'Berapa jumlah' : 'Berapa sisa';
    document.getElementById('math-text-question').innerText = `${actionWord} ${p.name}?`;

    // Generate pilihan jawaban
    const opts = document.getElementById('math-options');
    opts.innerHTML = '';

    const maxRandom = appState.currentLevel === 3 ? 20 : (appState.currentLevel === 2 ? 15 : 10);

    let answers = [correctAns];
    while (answers.length < 4) {
        const randomAns = Math.floor(Math.random() * maxRandom) + 1;
        if (!answers.includes(randomAns) && randomAns >= 0) answers.push(randomAns);
    }

    answers.sort(() => 0.5 - Math.random()).forEach(ans => {
        const btn = document.createElement('button');
        btn.className = "w-full py-4 text-2xl font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition border border-purple-200";
        btn.innerText = ans;

        btn.onclick = () => {
            if (ans === correctAns) {
                playSound('correct');
                btn.classList.replace('bg-purple-50', 'bg-green-500');
                btn.classList.replace('text-purple-700', 'text-white');
                document.getElementById('math-feedback').innerHTML =
                    `<span class="text-green-500 feedback-animation">🎉 Benar!</span>`;

                appState.progress.math += 10;
                saveProgress();

                setTimeout(() => {
                    appState.math.currentIndex = (appState.math.currentIndex + 1) % problemsPool.length;
                    loadMathProblem();
                }, 1500);
            } else {
                playSound('wrong');
                btn.classList.replace('bg-purple-50', 'bg-red-200');
                document.getElementById('math-feedback').innerHTML =
                    `<span>🤔 Coba lagi...</span>`;
            }
        };
        opts.appendChild(btn);
    });

    document.getElementById('math-feedback').innerHTML = '';
}

function setupMath() {
    loadMathProblem();
    document.getElementById('btn-math-story').onclick = generateMathStory;
}
