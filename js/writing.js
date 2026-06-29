/* ==========================================================================
   MODUL 2: MENULIS (DISGRAFIA)
   Canvas tracing + AI vision evaluation
   ========================================================================== */

async function checkWritingWithAI() {
    const canvas = document.getElementById('writing-canvas');
    const feedbackDiv = document.getElementById('writing-feedback');
    const btn = document.getElementById('btn-check-writing');

    const currentArr = appState.writing[appState.writing.currentMode];
    const targetChar = currentArr[appState.writing.currentIdx];

    feedbackDiv.classList.remove('hidden');
    feedbackDiv.innerHTML = '<span class="text-gray-500"><i class="fa-solid fa-spinner fa-spin"></i> AI sedang melihat tulisanmu...</span>';
    btn.disabled = true;

    const imageData = canvas.toDataURL("image/png");
    const prompt = `Lihat gambar tulisan tangan ini. Anak sedang mencoba menulis huruf/angka "${targetChar}". Apakah tulisannya sudah terbaca? Berikan komentar super pendek (maksimal 10 kata) yang menyemangati dalam Bahasa Indonesia.`;

    const feedback = await generateMultimodalContent(prompt, imageData);

    if (feedback) {
        feedbackDiv.innerHTML = `<span class="text-brand-blue font-bold">🤖 Kata AI:</span> "${feedback.trim()}"`;
        
        // Tambahkan jumlah latihan dan simpan progres
        appState.progress.writing = (appState.progress.writing || 0) + 1;
        saveProgress();
        if (typeof updateProgressUI === 'function') updateProgressUI();
    } else {
        feedbackDiv.innerHTML = '<span class="text-red-400">Gagal terhubung ke AI. Coba lagi ya!</span>';
    }
    btn.disabled = false;
}

function setupWritingCanvas() {
    let canvas = document.getElementById('writing-canvas');

    // Hapus listener lama (cegah bug penumpukan saat navigasi bolak-balik)
    const newCanvas = canvas.cloneNode(true);
    canvas.parentNode.replaceChild(newCanvas, canvas);
    canvas = newCanvas;

    const ctx = canvas.getContext('2d');
    const guideOutline = document.getElementById('trace-guide-outline');
    const guideDots = document.getElementById('trace-guide-dots');
    const modeAbjadBtn = document.getElementById('btn-mode-abjad');
    const modeAngkaBtn = document.getElementById('btn-mode-angka');
    const nextBtn = document.getElementById('btn-next-letter');
    let painting = false;

    function updateGuideText() {
        const arr = appState.writing[appState.writing.currentMode];
        const char = arr[appState.writing.currentIdx];
        
        if (guideOutline) {
            guideOutline.innerText = char;
            guideOutline.style.fontSize = (char === '10') ? '200px' : '250px';
        }
        if (guideDots) {
            guideDots.innerText = char;
            guideDots.style.fontSize = (char === '10') ? '200px' : '250px';
        }

        const indicator = document.getElementById('start-indicator');
        if (indicator) {
            const startPositions = {
                'a': { top: '15%', left: '45%' },
                'b': { top: '5%',  left: '25%' },
                'c': { top: '15%', left: '50%' },
                'd': { top: '15%', left: '50%' },
                'e': { top: '35%', left: '30%' },
                'f': { top: '5%',  left: '50%' },
                'g': { top: '15%', left: '50%' },
                'h': { top: '5%',  left: '25%' },
                'i': { top: '15%', left: '40%' },
                'j': { top: '15%', left: '40%' },
                'k': { top: '5%',  left: '25%' },
                'l': { top: '5%',  left: '40%' },
                'm': { top: '20%', left: '25%' },
                'n': { top: '20%', left: '30%' },
                'o': { top: '15%', left: '40%' },
                'p': { top: '20%', left: '30%' },
                'q': { top: '15%', left: '50%' },
                'r': { top: '20%', left: '35%' },
                's': { top: '15%', left: '45%' },
                't': { top: '10%', left: '40%' },
                'u': { top: '15%', left: '30%' },
                'v': { top: '15%', left: '30%' },
                'w': { top: '20%', left: '25%' },
                'x': { top: '20%', left: '30%' },
                'y': { top: '15%', left: '30%' },
                'z': { top: '15%', left: '30%' },
                '1': { top: '10%', left: '35%' },
                '2': { top: '10%', left: '30%' },
                '3': { top: '10%', left: '30%' },
                '4': { top: '10%', left: '30%' },
                '5': { top: '10%', left: '30%' },
                '6': { top: '10%', left: '50%' },
                '7': { top: '10%', left: '30%' },
                '8': { top: '10%', left: '40%' },
                '9': { top: '10%', left: '50%' },
                '10': { top: '10%', left: '20%' }
            };
            const pos = startPositions[char] || { top: '20%', left: '50%' };
            indicator.style.top = pos.top;
            indicator.style.left = pos.left;
        }
    }

    function switchMode(mode) {
        appState.writing.currentMode = mode;
        appState.writing.currentIdx = 0;

        if (mode === 'alphabets') {
            modeAbjadBtn.classList.replace('text-gray-500', 'text-red-600');
            modeAbjadBtn.classList.add('bg-white', 'shadow-sm');
            modeAngkaBtn.classList.replace('text-red-600', 'text-gray-500');
            modeAngkaBtn.classList.remove('bg-white', 'shadow-sm');
            nextBtn.innerHTML = 'Huruf Lanjut <i class="fa-solid fa-arrow-right"></i>';
        } else {
            modeAngkaBtn.classList.replace('text-gray-500', 'text-red-600');
            modeAngkaBtn.classList.add('bg-white', 'shadow-sm');
            modeAbjadBtn.classList.replace('text-red-600', 'text-gray-500');
            modeAbjadBtn.classList.remove('bg-white', 'shadow-sm');
            nextBtn.innerHTML = 'Angka Lanjut <i class="fa-solid fa-arrow-right"></i>';
        }

        updateGuideText();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById('writing-feedback').classList.add('hidden');
    }

    modeAbjadBtn.onclick = () => switchMode('alphabets');
    modeAngkaBtn.onclick = () => switchMode('numbers');

    // Set inisial mode
    switchMode(appState.writing.currentMode);

    // History untuk Undo
    let strokeHistory = [];

    function saveState() {
        strokeHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        if (strokeHistory.length > 20) strokeHistory.shift();
    }

    // Logika gambar
    function startPosition(e) {
        saveState();
        painting = true;
        draw(e);
    }
    function finishedPosition() { painting = false; ctx.beginPath(); }
    function draw(e) {
        if (!painting) return;
        if (e.type === 'touchmove') e.preventDefault();

        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#4E65C6';

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchstart', startPosition);
    canvas.addEventListener('touchend', finishedPosition);
    canvas.addEventListener('touchmove', draw);

    document.getElementById('btn-undo-canvas').onclick = () => {
        if (strokeHistory.length > 0) {
            const prevState = strokeHistory.pop();
            ctx.putImageData(prevState, 0, 0);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        document.getElementById('writing-feedback').classList.add('hidden');
    };

    document.getElementById('btn-clear-canvas').onclick = () => {
        strokeHistory = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById('writing-feedback').classList.add('hidden');
    };

    nextBtn.onclick = () => {
        const arr = appState.writing[appState.writing.currentMode];
        appState.writing.currentIdx = (appState.writing.currentIdx + 1) % arr.length;
        updateGuideText();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        document.getElementById('writing-feedback').classList.add('hidden');
    };

    document.getElementById('btn-check-writing').onclick = checkWritingWithAI;

    const btnListenWriting = document.getElementById('btn-listen-writing');
    if (btnListenWriting) {
        btnListenWriting.onclick = () => {
            const arr = appState.writing[appState.writing.currentMode];
            const char = arr[appState.writing.currentIdx];
            speakText(char);
        };
    }
}
