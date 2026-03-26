// ============================================================
// Trabant Tuning Studio - Fő JavaScript logika
// ============================================================

const canvas = document.getElementById('trabantCanvas');
const ctx = canvas.getContext('2d');

// --- Alapértelmezett tuning állapot ---
const defaultState = {
    bodyColor: '#3498db',
    wheelColor: '#1a1a1a',
    wheelStyle: 'standard',
    spoiler: false,
    windowTint: 0,
    exhaustStyle: 'standard',
    stripe: false,
    stripeColor: '#ffffff'
};

// Jelenlegi állapot másolata
let state = { ...defaultState };

// ============================================================
// TRABANT RAJZOLÓ FÜGGVÉNYEK
// ============================================================

/**
 * Főfüggvény: minden újrarajzoláskor ezt hívjuk meg.
 * Törli a vásznat, majd rétegesen rajzolja ki az autó részeit.
 */
function drawTrabant() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Háttér (ég + út)
    drawBackground();

    // Autó árnyék
    drawShadow();

    // Autó részei alulról felfelé
    drawBody();
    drawWindows();
    drawDetails();
    drawWheels();
    drawLights();
    drawExhaust();

    // Opcionális elemek
    if (state.spoiler) drawSpoiler();
    if (state.stripe) drawStripe();
}

/**
 * Háttér rajzolása: égbolt és aszfalt
 */
function drawBackground() {
    // Égbolt
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.65);
    skyGrad.addColorStop(0, '#87CEEB');
    skyGrad.addColorStop(1, '#b0e0ff');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.65);

    // Aszfalt
    const roadGrad = ctx.createLinearGradient(0, canvas.height * 0.65, 0, canvas.height);
    roadGrad.addColorStop(0, '#555');
    roadGrad.addColorStop(1, '#333');
    ctx.fillStyle = roadGrad;
    ctx.fillRect(0, canvas.height * 0.65, canvas.width, canvas.height * 0.35);

    // Útjelző csík
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(50, canvas.height * 0.72, 100, 8);
    ctx.fillRect(200, canvas.height * 0.72, 100, 8);
    ctx.fillRect(350, canvas.height * 0.72, 100, 8);
    ctx.fillRect(500, canvas.height * 0.72, 100, 8);
}

/**
 * Árnyék rajzolása az autó alatt
 */
function drawShadow() {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(300, 310, 200, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

/**
 * Fő karosszéria rajzolása
 * A Trabant jellegzetes dobozos formáját közelítjük meg
 */
function drawBody() {
    const bodyColor = state.bodyColor;

    // Gradiens a karosszériához (3D hatás)
    const bodyGrad = ctx.createLinearGradient(100, 150, 100, 310);
    bodyGrad.addColorStop(0, lightenColor(bodyColor, 40));
    bodyGrad.addColorStop(0.5, bodyColor);
    bodyGrad.addColorStop(1, darkenColor(bodyColor, 40));

    // --- Alsó karosszéria (küszöb rész) ---
    ctx.fillStyle = darkenColor(bodyColor, 30);
    roundRect(ctx, 110, 255, 390, 50, 8);
    ctx.fill();

    // --- Fő karosszéria test ---
    ctx.fillStyle = bodyGrad;
    roundRect(ctx, 100, 170, 400, 100, 12);
    ctx.fill();

    // --- Tető ---
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(160, 170);
    ctx.lineTo(200, 110);
    ctx.lineTo(400, 110);
    ctx.lineTo(430, 170);
    ctx.closePath();
    ctx.fill();

    // Karosszéria kontúr
    ctx.strokeStyle = darkenColor(bodyColor, 60);
    ctx.lineWidth = 2;
    roundRect(ctx, 100, 170, 400, 100, 12);
    ctx.stroke();

    // Tető kontúr
    ctx.beginPath();
    ctx.moveTo(160, 170);
    ctx.lineTo(200, 110);
    ctx.lineTo(400, 110);
    ctx.lineTo(430, 170);
    ctx.closePath();
    ctx.stroke();

    // --- Motorháztető (Trabant jellegzetesség) ---
    ctx.fillStyle = lightenColor(bodyColor, 20);
    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.lineTo(80, 220);
    ctx.lineTo(80, 260);
    ctx.lineTo(100, 270);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // --- Csomagtartó ---
    ctx.fillStyle = darkenColor(bodyColor, 20);
    ctx.beginPath();
    ctx.moveTo(500, 200);
    ctx.lineTo(520, 220);
    ctx.lineTo(520, 255);
    ctx.lineTo(500, 260);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

/**
 * Ablakok rajzolása - sötétítési effekttel
 */
function drawWindows() {
    const tintAlpha = state.windowTint / 100;
    const windowBaseColor = `rgba(135, 206, 235, 0.7)`;

    // Szélvédő
    ctx.fillStyle = windowBaseColor;
    ctx.beginPath();
    ctx.moveTo(168, 168);
    ctx.lineTo(205, 115);
    ctx.lineTo(280, 115);
    ctx.lineTo(280, 168);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Szélvédő sötétítés
    ctx.fillStyle = `rgba(0, 0, 0, ${tintAlpha})`;
    ctx.beginPath();
    ctx.moveTo(168, 168);
    ctx.lineTo(205, 115);
    ctx.lineTo(280, 115);
    ctx.lineTo(280, 168);
    ctx.closePath();
    ctx.fill();

    // Hátsó szélvédő
    ctx.fillStyle = windowBaseColor;
    ctx.beginPath();
    ctx.moveTo(320, 115);
    ctx.lineTo(395, 115);
    ctx.lineTo(425, 168);
    ctx.lineTo(320, 168);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#aaa';
    ctx.stroke();

    ctx.fillStyle = `rgba(0, 0, 0, ${tintAlpha})`;
    ctx.beginPath();
    ctx.moveTo(320, 115);
    ctx.lineTo(395, 115);
    ctx.lineTo(425, 168);
    ctx.lineTo(320, 168);
    ctx.closePath();
    ctx.fill();

    // Bal oldalsó ablak
    ctx.fillStyle = windowBaseColor;
    ctx.fillRect(115, 185, 70, 55);
    ctx.strokeStyle = '#aaa';
    ctx.strokeRect(115, 185, 70, 55);
    ctx.fillStyle = `rgba(0, 0, 0, ${tintAlpha})`;
    ctx.fillRect(115, 185, 70, 55);

    // Jobb oldalsó ablak
    ctx.fillStyle = windowBaseColor;
    ctx.fillRect(420, 185, 70, 55);
    ctx.strokeStyle = '#aaa';
    ctx.strokeRect(420, 185, 70, 55);
    ctx.fillStyle = `rgba(0, 0, 0, ${tintAlpha})`;
    ctx.fillRect(420, 185, 70, 55);

    // Középső (B-pillér)
    ctx.fillStyle = darkenColor(state.bodyColor, 40);
    ctx.fillRect(288, 115, 30, 55);

    // Ablak fényvisszaverődés
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(175, 125);
    ctx.lineTo(190, 115);
    ctx.lineTo(250, 115);
    ctx.lineTo(240, 125);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

/**
 * Apró részletek: ajtó vonalak, kilincsek, hűtőrács
 */
function drawDetails() {
    ctx.strokeStyle = darkenColor(state.bodyColor, 50);
    ctx.lineWidth = 1.5;

    // Ajtó elválasztó vonal
    ctx.beginPath();
    ctx.moveTo(282, 170);
    ctx.lineTo(282, 255);
    ctx.stroke();

    // Bal ajtó kilincs
    ctx.fillStyle = '#c0c0c0';
    roundRect(ctx, 230, 220, 35, 10, 4);
    ctx.fill();
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Jobb ajtó kilincs
    roundRect(ctx, 340, 220, 35, 10, 4);
    ctx.fill();
    ctx.stroke();

    // Hűtőrács (elöl)
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(82, 230 + i * 8);
        ctx.lineTo(100, 230 + i * 8);
        ctx.stroke();
    }

    // Trabant embléma (középen)
    ctx.save();
    ctx.fillStyle = '#c0c0c0';
    ctx.beginPath();
    ctx.arc(300, 200, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#3498db';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('T', 300, 200);
    ctx.restore();
}

/**
 * Kerekek rajzolása a kiválasztott stílusban
 */
function drawWheels() {
    drawWheel(175, 295, 45);  // Bal kerék
    drawWheel(430, 295, 45);  // Jobb kerék
}

/**
 * Egyedi kerék rajzoló - stílus alapján különböző küllőket rajzol
 * @param {number} x - középpont X
 * @param {number} y - középpont Y
 * @param {number} r - sugár
 */
function drawWheel(x, y, r) {
    // Gumiabroncs
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Gumiabroncs oldalfal
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, r - 2, 0, Math.PI * 2);
    ctx.stroke();

    // Felni
    ctx.fillStyle = state.wheelColor;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.72, 0, Math.PI * 2);
    ctx.fill();

    const style = state.wheelStyle;

    if (style === 'standard') {
        // 4 egyszerű küllő
        drawSpokes(x, y, r, 4, state.wheelColor);

    } else if (style === 'sport') {
        // 5 dupla küllő
        ctx.strokeStyle = darkenColor(state.wheelColor, 30);
        ctx.lineWidth = 4;
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const angle2 = angle + 0.15;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(angle) * r * 0.2, y + Math.sin(angle) * r * 0.2);
            ctx.lineTo(x + Math.cos(angle) * r * 0.68, y + Math.sin(angle) * r * 0.68);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(angle2) * r * 0.2, y + Math.sin(angle2) * r * 0.2);
            ctx.lineTo(x + Math.cos(angle2) * r * 0.68, y + Math.sin(angle2) * r * 0.68);
            ctx.stroke();
        }

    } else if (style === 'classic') {
        // 8 vékony klasszikus küllő
        drawSpokes(x, y, r, 8, state.wheelColor);

    } else if (style === 'chrome') {
        // Króm felni: csillogó hatás
        const chromeGrad = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, 2, x, y, r * 0.72);
        chromeGrad.addColorStop(0, '#ffffff');
        chromeGrad.addColorStop(0.3, '#c0c0c0');
        chromeGrad.addColorStop(0.7, '#808080');
        chromeGrad.addColorStop(1, '#404040');
        ctx.fillStyle = chromeGrad;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.72, 0, Math.PI * 2);
        ctx.fill();
        drawSpokes(x, y, r, 6, '#c0c0c0');
    }

    // Felni középső csavar
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.arc(x, y, r * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#555';
    ctx.beginPath();
    ctx.arc(x, y, r * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // Gumiabroncs fehér felirat szimulálása
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.85, Math.PI * 0.3, Math.PI * 0.9);
    ctx.stroke();
    ctx.restore();
}

/**
 * Küllők rajzolása adott számban
 */
function drawSpokes(x, y, r, count, color) {
    ctx.strokeStyle = darkenColor(color, 20);
    ctx.lineWidth = 3.5;
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(angle) * r * 0.15, y + Math.sin(angle) * r * 0.15);
        ctx.lineTo(x + Math.cos(angle) * r * 0.68, y + Math.sin(angle) * r * 0.68);
        ctx.stroke();
    }
}

/**
 * Fényszórók és hátsó lámpák
 */
function drawLights() {
    // Első fényszóró
    const headlightGrad = ctx.createRadialGradient(90, 225, 2, 90, 225, 18);
    headlightGrad.addColorStop(0, '#ffffc0');
    headlightGrad.addColorStop(0.5, '#ffff80');
    headlightGrad.addColorStop(1, '#ffcc00');
    ctx.fillStyle = headlightGrad;
    ctx.beginPath();
    ctx.ellipse(90, 225, 12, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Első fény fényvisszaverő keret
    ctx.strokeStyle = '#c0c0c0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(90, 225, 14, 20, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Hátsó lámpa
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.ellipse(512, 230, 10, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Irányjelző (narancs)
    ctx.fillStyle = '#f39c12';
    ctx.beginPath();
    ctx.ellipse(512, 250, 7, 8, 0, 0, Math.PI * 2);
    ctx.fill();
}

/**
 * Kipufogó rajzolása
 */
function drawExhaust() {
    ctx.fillStyle = '#555';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;

    if (state.exhaustStyle === 'standard') {
        // Egy sima cső
        ctx.fillRect(490, 268, 35, 10);
        ctx.strokeRect(490, 268, 35, 10);
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(525, 273, 5, 0, Math.PI * 2);
        ctx.fill();

    } else if (state.exhaustStyle === 'sport') {
        // Dupla cső
        ctx.fillRect(490, 260, 35, 8);
        ctx.strokeRect(490, 260, 35, 8);
        ctx.fillRect(490, 272, 35, 8);
        ctx.strokeRect(490, 272, 35, 8);
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(525, 264, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(525, 276, 4, 0, Math.PI * 2);
        ctx.fill();

    } else if (state.exhaustStyle === 'racing') {
        // Quad cső
        const positions = [[490, 258], [490, 268], [503, 258], [503, 268]];
        positions.forEach(([px, py]) => {
            ctx.fillStyle = '#555';
            ctx.fillRect(px, py, 28, 8);
            ctx.strokeRect(px, py, 28, 8);
            ctx.fillStyle = '#222';
            ctx.beginPath();
            ctx.arc(px + 28, py + 4, 3.5, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

/**
 * Hátsó spoiler rajzolása
 */
function drawSpoiler() {
    const spoilerColor = darkenColor(state.bodyColor, 20);

    // Tartólábak
    ctx.fillStyle = spoilerColor;
    ctx.fillRect(360, 100, 10, 25);
    ctx.fillRect(410, 100, 10, 25);

    // Spoiler lap
    ctx.fillStyle = darkenColor(state.bodyColor, 10);
    roundRect(ctx, 345, 90, 90, 15, 4);
    ctx.fill();
    ctx.strokeStyle = darkenColor(state.bodyColor, 60);
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Spoiler él
    ctx.fillStyle = '#333';
    roundRect(ctx, 345, 90, 90, 5, 2);
    ctx.fill();
}

/**
 * Racing csík rajzolása az autó tetején/oldalán
 */
function drawStripe() {
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = state.stripeColor;

    // Oldalsó csík (bal)
    ctx.fillRect(110, 210, 390, 12);

    // Tető csík
    ctx.beginPath();
    ctx.moveTo(200, 110);
    ctx.lineTo(400, 110);
    ctx.lineTo(400, 122);
    ctx.lineTo(200, 122);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

// ============================================================
// SEGÉDFÜGGVÉNYEK
// ============================================================

/**
 * Lekerekített sarkú téglalap rajzolása
 */
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

/**
 * Szín sötétítése (hex → rgb manipuláció)
 * @param {string} hex - Hex színkód
 * @param {number} amount - Sötétítés mértéke (0-255)
 */
function darkenColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0xff) - amount);
    const b = Math.max(0, (num & 0xff) - amount);
    return `rgb(${r},${g},${b})`;
}

/**
 * Szín világosítása
 * @param {string} hex - Hex színkód
 * @param {number} amount - Világosítás mértéke
 */
function lightenColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0xff) + amount);
    const b = Math.min(255, (num & 0xff) + amount);
    return `rgb(${r},${g},${b})`;
}

// ============================================================
// ESEMÉNYKEZELŐK
// ============================================================

// Karosszéria szín gombok
document.querySelectorAll('.color-btn:not([data-target])').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.color-btn:not([data-target])').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.bodyColor = btn.dataset.color;
        drawTrabant();
    });
});

// Felni szín gombok
document.querySelectorAll('.color-btn[data-target="wheel"]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.color-btn[data-target="wheel"]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.wheelColor = btn.dataset.color;
        drawTrabant();
    });
});

// Egyéni szín picker
document.getElementById('customColor').addEventListener('input', (e) => {
    state.bodyColor = e.target.value;
    drawTrabant();
});

// Felni stílus
document.getElementById('wheelStyle').addEventListener('change', (e) => {
    state.wheelStyle = e.target.value;
    drawTrabant();
});

// Spoiler toggle
document.getElementById('spoilerToggle').addEventListener('change', (e) => {
    state.spoiler = e.target.checked;
    drawTrabant();
});

// Ablak sötétítés csúszka
const tintSlider = document.getElementById('windowTint');
const tintValue = document.getElementById('tintValue');
tintSlider.addEventListener('input', (e) => {
    state.windowTint = parseInt(e.target.value);
    tintValue.textContent = `${state.windowTint}%`;
    drawTrabant();
});

// Kipufogó stílus
document.getElementById('exhaustStyle').addEventListener('change', (e) => {
    state.exhaustStyle = e.target.value;
    drawTrabant();
});

// Csík toggle
document.getElementById('stripeToggle').addEventListener('change', (e) => {
    state.stripe = e.target.checked;
    drawTrabant();
});

// Csík szín
document.getElementById('stripeColor').addEventListener('input', (e) => {
    state.stripeColor = e.target.value;
    drawTrabant();
});

// Reset gomb - visszaállítja az alapértelmezett állapotot
document.getElementById('resetBtn').addEventListener('click', () => {
    state = { ...defaultState };

    // UI elemek visszaállítása
    document.getElementById('wheelStyle').value = 'standard';
    document.getElementById('spoilerToggle').checked = false;
    document.getElementById('windowTint').value = 0;
    tintValue.textContent = '0%';
    document.getElementById('exhaustStyle').value = 'standard';
    document.getElementById('stripeToggle').checked = false;
    document.getElementById('stripeColor').value = '#ffffff';
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));

    drawTrabant();
});

// Kép mentése PNG-ként
document.getElementById('saveBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'trabant_tuning.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// ============================================================
// INICIALIZÁLÁS - oldal betöltésekor első rajzolás
// ============================================================
drawTrabant();
