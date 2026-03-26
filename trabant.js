// ============================================================
// Trabant Tuning Studio - Vezérlő logika
// ============================================================

// --- Állapot objektum (minden beállítás itt tárolódik) ---
const state = {
    bodyFilter: 'none',
    bodyColor: 'Eredeti',
    brightness: 100,
    saturation: 100,
    hue: 0,
    finish: 'normal',
    windowTint: 0,
    wheel: 'standard',
    wheelSize: 1,
    wheelFilter: 'none',
    spoiler: false,
    exhaust: 'standard',
    lights: 'standard',
    rideHeight: 0,
    stickers: {},
    stickerFilter: 'none',
    background: 'assets/backgrounds/garage.jpg'
};

// --- DOM elemek lekérése ---
const carStage    = document.getElementById('carStage');
const bodyLayer   = document.getElementById('bodyLayer');
const windowLayer = document.getElementById('windowLayer');
const spoilerLayer= document.getElementById('spoilerLayer');
const exhaustLayer= document.getElementById('exhaustLayer');
const lightsLayer = document.getElementById('lightsLayer');
const wheelFL     = document.getElementById('wheelFrontLeft');
const wheelRR     = document.getElementById('wheelRearRight');

// ============================================================
// FILTER ÖSSZEÁLLÍTÁS
// A CSS filter property-be fűzzük össze a beállításokat
// ============================================================

/**
 * Összeállítja a karosszéria CSS filter stringet
 * az aktuális állapot alapján.
 */
function buildBodyFilter() {
    let base = state.bodyFilter === 'none' ? '' : state.bodyFilter + ' ';
    base += `brightness(${state.brightness / 100}) `;
    base += `saturate(${state.saturation / 100}) `;
    base += `hue-rotate(${state.hue}deg)`;

    // Matt fényezés: kontraszt és telítettség csökkentés
    if (state.finish === 'matte') {
        base += ' contrast(0.88) saturate(0.65)';
    }
    // Metálfényű: kontrast és telítettség növelés
    else if (state.finish === 'metallic') {
        base += ' contrast(1.12) saturate(1.4) brightness(1.05)';
    }

    return base.trim() || 'none';
}

/**
 * Az összes vizuális elemet frissíti az állapot alapján.
 * Ezt hívjuk minden beállítás változáskor.
 */
function updateCar() {
    // Karosszéria filter alkalmazása
    bodyLayer.style.filter = buildBodyFilter();

    // Ablak sötétítés (opacity + szín overlay helyett filter)
    const tintFactor = 1 - (state.windowTint / 100);
    windowLayer.style.filter = `brightness(${tintFactor})`;
    windowLayer.style.opacity = tintFactor < 0.1 ? 0.05 : 1;

    // Kerék kép csere
    const wheelSrc = `assets/wheels/wheel_${state.wheel}.png`;
    wheelFL.src = wheelSrc;
    wheelRR.src = wheelSrc;

    // Kerék méret alkalmazása
    const wheelSize = state.wheelSize;
    wheelFL.style.width  = `${18 * wheelSize}%`;
    wheelRR.style.width  = `${18 * wheelSize}%`;

    // Felni szín filter
    if (state.wheelFilter !== 'none') {
        wheelFL.style.filter = state.wheelFilter;
        wheelRR.style.filter = state.wheelFilter;
    } else {
        wheelFL.style.filter = 'none';
        wheelRR.style.filter = 'none';
    }

    // Autó magasság (lowering)
    const heightOffset = -state.rideHeight;
    wheelFL.style.bottom = `${8 + heightOffset * 0.3}%`;
    wheelRR.style.bottom = `${8 + heightOffset * 0.3}%`;
    bodyLayer.style.transform = `translateY(${state.rideHeight * 0.5}px)`;

    // Spoiler láthatóság
    spoilerLayer.classList.toggle('hidden', !state.spoiler);

    // Kipufogó kép csere
    exhaustLayer.src = `assets/parts/exhaust_${state.exhaust}.png`;

    // Fényszóró kép csere
    const lightsSuffix = state.lights === 'standard' ? '' : `_${state.lights}`;
    lightsLayer.src = `assets/parts/lights${lightsSuffix}.png`;

    // Háttér csere
    carStage.style.backgroundImage = `url('${state.background}')`;

    // Matt/metál osztály a stage-re
    carStage.className = 'car-stage';
    if (state.finish !== 'normal') {
        carStage.classList.add(state.finish);
    }

    // Összefoglaló szöveg frissítése
    updateSummary();
}

/**
 * Frissíti a konfiguráció összefoglaló szövegét
 */
function updateSummary() {
    const parts = [];
    parts.push(`Szín: ${state.bodyColor}`);
    parts.push(`Felni: ${state.wheel}`);
    if (state.spoiler) parts.push('Spoiler: ✓');
    if (state.windowTint > 0) parts.push(`Tint: ${state.windowTint}%`);
    document.getElementById('summaryText').textContent = parts.join(' | ');
}

// ============================================================
// TAB NAVIGÁCIÓ
// ============================================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Aktív tab gomb
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Aktív tab tartalom megjelenítése
        const tabId = btn.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById(`tab-${tabId}`).classList.add('active');
    });
});

// ============================================================
// SZÍN KEZELŐK
// ============================================================

// Karosszéria szín preset gombok
document.querySelectorAll('.preset-color:not([data-target])').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.preset-color:not([data-target])').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // CSS filter beállítása az adott színre
        state.bodyFilter = btn.dataset.color;
        state.bodyColor  = btn.dataset.name || btn.title;
        updateCar();
    });
});

// Fényerő csúszka
document.getElementById('brightness').addEventListener('input', (e) => {
    state.brightness = parseInt(e.target.value);
    document.getElementById('brightnessVal').textContent = `${state.brightness}%`;
    updateCar();
});

// Telítettség csúszka
document.getElementById('saturation').addEventListener('input', (e) => {
    state.saturation = parseInt(e.target.value);
    document.getElementById('saturationVal').textContent = `${state.saturation}%`;
    updateCar();
});

// Hue-rotate csúszka
document.getElementById('hueRotate').addEventListener('input', (e) => {
    state.hue = parseInt(e.target.value);
    document.getElementById('hueVal').textContent = `${state.hue}°`;
    updateCar();
});

// Fényezés típus gombok
document.querySelectorAll('.finish-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.finish-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.finish = btn.dataset.finish;
        updateCar();
    });
});

// Ablak sötétítés
document.getElementById('windowTint').addEventListener('input', (e) => {
    state.windowTint = parseInt(e.target.value);
    document.getElementById('tintVal').textContent = `${state.windowTint}%`;
    updateCar();
});

// ============================================================
// FELNI KEZELŐK
// ============================================================

// Felni stílus választó
document.querySelectorAll('.wheel-option').forEach(opt => {
    opt.addEventListener('click', () => {
        document.querySelectorAll('.wheel-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        state.wheel = opt.dataset.wheel;
        updateCar();
    });
});

// Felni méret
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.wheelSize = parseFloat(btn.dataset.size);
        updateCar();
    });
});

// Felni szín filter
document.querySelectorAll('.preset-color[data-target="wheel"]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.preset-color[data-target="wheel"]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.wheelFilter = btn.dataset.color;
        updateCar();
    });
});

// ============================================================
// ALKATRÉSZ KEZELŐK
// ============================================================

// Spoiler toggle
document.getElementById('spoilerToggle').addEventListener('change', (e) => {
    state.spoiler = e.target.checked;
    updateCar();
});

// Kipufogó választó
document.querySelectorAll('.part-card[data-exhaust]').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.part-card[data-exhaust]').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.exhaust = card.dataset.exhaust;
        updateCar();
    });
});

// Fényszóró választó
document.querySelectorAll('.part-card[data-lights]').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.part-card[data-lights]').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.lights = card.dataset.lights;
        updateCar();
    });
});

// Felfüggesztés magasság
document.getElementById('rideHeight').addEventListener('input', (e) => {
    state.rideHeight = parseInt(e.target.value);
    const val = state.rideHeight;
    document.getElementById('rideVal').textContent =
        val === 0 ? 'Alap' : val < 0 ? `+${Math.abs(val)}mm sport` : `-${val}mm emelt`;
    updateCar();
});

// ============================================================
// MATRICA KEZELŐK
// ============================================================

// Matrica be/ki kapcsolók
document.querySelectorAll('.sticker-toggle').forEach(toggle => {
    toggle.addEventListener('change', (e) => {
        const targetId = e.target.dataset.target;
        const layer = document.getElementById(targetId);
        if (layer) {
            layer.classList.toggle('hidden', !e.target.checked);
            state.stickers[targetId] = e.target.checked;
        }
    });
});

// Matrica szín filter
document.querySelectorAll('.preset-color[data-target="sticker"]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.preset-color[data-target="sticker"]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.stickerFilter = btn.dataset.color;

        // Minden látható matrica rétegre alkalmaz
        ['stickerStripe', 'stickerFlames'].forEach(id => {
            const el = document.getElementById(id);
            if (el && !el.classList.contains('hidden')) {
                el.style.filter = state.stickerFilter !== 'none' ? state.stickerFilter : 'none';
            }
        });
    });
});

// ============================================================
// HÁTTÉR VÁLASZTÓ
// ============================================================
document.querySelectorAll('.bg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.background = btn.dataset.bg;
        updateCar();
    });
});

// ============================================================
// KÉPERNYŐKÉP MENTÉS (html2canvas)
// ============================================================
document.getElementById('screenshotBtn').addEventListener('click', () => {
    html2canvas(carStage, {
        useCORS: true,
        scale: 2,   // 2x felbontás jobb minőségért
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'trabant_konfig.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});

// ============================================================
// KONFIGURÁCIÓ MEGOSZTÁS (URL paraméterként)
// ============================================================
document.getElementById('shareBtn').addEventListener('click', () => {
    // Az állapotot Base64 kódolva az URL-be tesszük
    const encoded = btoa(JSON.stringify({
        bodyFilter: state.bodyFilter,
        bodyColor: state.bodyColor,
        brightness: state.brightness,
        saturation: state.saturation,
        hue: state.hue,
        finish: state.finish,
        windowTint: state.windowTint,
        wheel: state.wheel,
        wheelSize: state.wheelSize,
        spoiler: state.spoiler,
        exhaust: state.exhaust
    }));

    const shareUrl = `${window.location.origin}${window.location.pathname}?config=${encoded}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
        alert('✅ Link vágólapra másolva!\n\n' + shareUrl);
    }).catch(() => {
        prompt('Másold ki a linket:', shareUrl);
    });
});

/**
 * URL paraméterből konfiguráció betöltése
 * Ha valaki megosztott linken nyitja meg az oldalt,
 * automatikusan betölti a beállításokat.
 */
function loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const config = params.get('config');
    if (!config) return;

    try {
        const loaded = JSON.parse(atob(config));
        Object.assign(state, loaded);

        // UI szinkronizálása a betöltött állapottal
        document.getElementById('brightness').value = state.brightness;
        document.getElementById('brightnessVal').textContent = `${state.brightness}%`;
        document.getElementById('saturation').value = state.saturation;
        document.getElementById('saturationVal').textContent = `${state.saturation}%`;
        document.getElementById('hueRotate').value = state.hue;
        document.getElementById('hueVal').textContent = `${state.hue}°`;
        document.getElementById('windowTint').value = state.windowTint;
        document.getElementById('tintVal').textContent = `${state.windowTint}%`;
        document.getElementById('spoilerToggle').checked = state.spoiler;

        updateCar();
    } catch(e) {
        console.warn('Érvénytelen konfiguráció az URL-ben:', e);
    }
}

// ============================================================
// RESET
// ============================================================
document.getElementById('resetBtn').addEventListener('click', () => {
    // Állapot visszaállítása
    Object.assign(state, {
        bodyFilter: 'none',
        bodyColor: 'Eredeti',
        brightness: 100,
        saturation: 100,
        hue: 0,
        finish: 'normal',
        windowTint: 0,
        wheel: 'standard',
        wheelSize: 1,
        wheelFilter: 'none',
        spoiler: false,
        exhaust: 'standard',
        lights: 'standard',
        rideHeight: 0,
        stickers: {},
        stickerFilter: 'none'
    });

    // UI elemek visszaállítása
    document.getElementById('brightness').value    = 100;
    document.getElementById('brightnessVal').textContent = '100%';
    document.getElementById('saturation').value    = 100;
    document.getElementById('saturationVal').textContent = '100%';
    document.getElementById('hueRotate').value     = 0;
    document.getElementById('hueVal').textContent  = '0°';
    document.getElementById('windowTint').value    = 0;
    document.getElementById('tintVal').textContent = '0%';
    document.getElementById('rideHeight').value    = 0;
    document.getElementById('rideVal').textContent = 'Alap';
    document.getElementById('spoilerToggle').checked = false;

    document.querySelectorAll('.sticker-toggle').forEach(t => t.checked = false);
    document.querySelectorAll('.preset-color').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('[data-wheel]').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-wheel="standard"]')?.classList.add('active');
    document.querySelectorAll('.finish-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-finish="normal"]')?.classList.add('active');
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-size="1"]')?.classList.add('active');

    ['stickerStripe', 'stickerFlames'].forEach(id => {
        document.getElementById(id)?.classList.add('hidden');
    });

    updateCar();
});

// ============================================================
// INICIALIZÁLÁS
// ============================================================
loadFromURL();  // URL-ből betöltés ha van config
updateCar();    // Első renderelés
