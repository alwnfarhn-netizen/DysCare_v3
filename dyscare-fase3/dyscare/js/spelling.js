/* ==========================================================================
   MODUL 3: MENGEJA (VISUAL SPASIAL)
   Drag & drop huruf + AI image generation, level-aware
   ========================================================================== */

async function loadSpellingContent() {
    const drop = document.getElementById('spelling-drop-zone');
    const bank = document.getElementById('letter-bank');
    const fb = document.getElementById('spelling-feedback');

    drop.innerHTML = '';
    bank.innerHTML = '';
    fb.innerHTML = '';

    // Ambil kata dari pool SESUAI LEVEL
    const wordsPool = getSpellingWordsByLevel();
    const item = randomFromArray(wordsPool);
    appState.spelling.currentWordObj = item;

    const imgContainer = document.getElementById('spelling-image-container');
    const icon = imgContainer.querySelector('span');
    const loader = document.getElementById('image-loader');

    // Bersihkan gambar lama
    imgContainer.querySelector('img')?.remove();
    if (icon) {
        icon.style.display = 'none';
        icon.style.fontSize = '';
    }
    loader.classList.remove('hidden');

    // Coba generate gambar dengan AI, fallback ke emoji jika gagal
    const base64 = await generateImage(item.imagePrompt);

    if (base64) {
        const img = document.createElement('img');
        img.src = `data:image/png;base64,${base64}`;
        imgContainer.appendChild(img);
    } else {
        if (icon) {
            icon.style.display = 'block';
            icon.style.fontSize = '5rem';
            icon.innerText = item.fallbackEmoji;
        }
    }
    loader.classList.add('hidden');

    // Buat tile huruf yang diacak
    item.word.toUpperCase()
        .split('')
        .sort(() => 0.5 - Math.random())
        .forEach((char, i) => {
            const div = document.createElement('div');
            div.className = 'letter-tile bg-white border border-gray-300 shadow-sm hover:shadow-md cursor-move';
            div.innerText = char;
            div.draggable = true;
            div.id = `tile-${i}-${char}`;

            div.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.id);
                setTimeout(() => div.classList.add('hidden'), 0);
            });

            div.addEventListener('dragend', () => div.classList.remove('hidden'));

            // Klik untuk pindah (alternatif touch-friendly)
            div.addEventListener('click', () => {
                if (div.parentElement === bank) {
                    drop.appendChild(div);
                } else {
                    bank.appendChild(div);
                }
            });

            bank.appendChild(div);
        });
}

function setupSpelling() {
    const drop = document.getElementById('spelling-drop-zone');

    // Audio hint
    document.getElementById('btn-spell-listen').addEventListener('click', () => {
        if (appState.spelling.currentWordObj) {
            speakText(appState.spelling.currentWordObj.word, 0.8);
        }
    });

    drop.addEventListener('dragover', (e) => e.preventDefault());
    drop.addEventListener('drop', (e) => {
        e.preventDefault();
        drop.appendChild(document.getElementById(e.dataTransfer.getData('text/plain')));
    });

    document.getElementById('btn-check-spelling').addEventListener('click', () => {
        const currentAnswer = Array.from(drop.children).map(c => c.innerText).join('');
        if (currentAnswer === appState.spelling.currentWordObj.word.toUpperCase()) {
            playSound('correct');
            document.getElementById('spelling-feedback').innerHTML =
                `<span class="text-green-500 feedback-animation"><i class="fa-solid fa-check-circle"></i> Benar!</span>`;
            appState.progress.spelling += 10;
            saveProgress();
        } else {
            playSound('wrong');
            document.getElementById('spelling-feedback').innerHTML =
                `<span class="text-red-400">Coba lagi...</span>`;
        }
    });

    document.getElementById('btn-next-spelling').addEventListener('click', loadSpellingContent);
}
