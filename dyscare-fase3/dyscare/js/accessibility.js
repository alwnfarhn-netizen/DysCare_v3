/* ==========================================================================
   ACCESSIBILITY: Panel pengaturan (font disleksia, ukuran, kontras, kecerahan)
   ========================================================================== */

function loadAccessibilitySettings() {
    const body = document.body;
    const html = document.documentElement;

    const btnFont     = document.getElementById('btn-acc-font');
    const btnSize     = document.getElementById('btn-acc-size');
    const btnContrast = document.getElementById('btn-acc-contrast');
    const btnBright   = document.getElementById('btn-acc-brightness');

    let fontActive = false;

    let sizeLevel = 0;
    const sizes = [16, 18, 20];
    const sizeLabels = ['Normal', 'Besar', 'Ekstra'];

    let contrastLevel = 0;
    const contrasts = [1, 1.25, 1.5];
    const contrastLabels = ['Normal', 'Tinggi', 'Maksimal'];

    let brightLevel = 0;
    const brights = [1, 1.3, 0.7];
    const brightLabels = ['Normal', 'Terang', 'Redup'];

    function updateUI(btn, isActive, iconId) {
        const icon = document.getElementById(iconId);
        if (isActive) {
            btn.classList.add('border-brand-blue', 'bg-blue-50');
            btn.classList.remove('border-gray-200', 'bg-white');
            if (icon) {
                icon.classList.add('text-brand-blue');
                icon.classList.remove('text-gray-600');
            }
        } else {
            btn.classList.remove('border-brand-blue', 'bg-blue-50');
            btn.classList.add('border-gray-200', 'bg-white');
            if (icon) {
                icon.classList.remove('text-brand-blue');
                icon.classList.add('text-gray-600');
            }
        }
    }

    // Font Disleksia
    btnFont.addEventListener('click', () => {
        fontActive = !fontActive;
        body.classList.toggle('dyslexia-mode-opendyslexic', fontActive);
        updateUI(btnFont, fontActive, 'icon-acc-font');
    });

    // Ukuran Teks
    btnSize.addEventListener('click', () => {
        sizeLevel = (sizeLevel + 1) % sizes.length;
        html.style.fontSize = sizes[sizeLevel] + 'px';
        document.getElementById('lbl-acc-size').innerText = sizeLabels[sizeLevel];
        updateUI(btnSize, sizeLevel > 0, 'icon-acc-size');
    });

    // Kontras & Kecerahan
    const updateFilters = () => {
        document.getElementById('app').style.filter =
            `contrast(${contrasts[contrastLevel]}) saturate(${brights[brightLevel]})`;
    };

    btnContrast.addEventListener('click', () => {
        contrastLevel = (contrastLevel + 1) % contrasts.length;
        document.getElementById('lbl-acc-contrast').innerText = contrastLabels[contrastLevel];
        updateUI(btnContrast, contrastLevel > 0, 'icon-acc-contrast');
        updateFilters();
    });

    btnBright.addEventListener('click', () => {
        brightLevel = (brightLevel + 1) % brights.length;
        document.getElementById('lbl-acc-bright').innerText = brightLabels[brightLevel];
        updateUI(btnBright, brightLevel > 0, 'icon-acc-bright');
        updateFilters();
    });
}
