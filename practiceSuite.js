
// SONIC THEORY PRO — PREMIUM PRACTICE SUITE


let bpm = 120;
let beatCount = 0;
let metronomeInterval = null;
let isPlayingScale = false;
let loopMode = false;
let arpeggioMode = false;

const flash = document.getElementById("metronome-flash");
const bpmInput = document.getElementById("bpm");
const bpmDisplay = document.getElementById("bpm-display");
const nowPlaying = document.getElementById("now-playing");
const playScaleBtn = document.getElementById("play-scale-btn");


// PREMIUM UI INJECTION


const controlBar = document.querySelector("#practice-suite .control-bar");

controlBar.insertAdjacentHTML("afterend", `
<div id="premium-practice-panel" class="glass" style="
    margin-top:20px;
    padding:30px;
    display:flex;
    flex-direction:column;
    gap:25px;
">

    <!-- TOP STATUS -->
    <div style="display:flex; justify-content:space-between; align-items:center;">
        <div id="transport-state" style="font-weight:600; opacity:0.8;">
            Ready
        </div>
        <div id="mode-display" style="opacity:0.6;">
            Mode: Normal
        </div>
    </div>

    <!-- BPM RING -->
    <div style="display:flex; justify-content:center;">
        <div id="bpm-ring" style="
            width:160px;
            height:160px;
            border-radius:50%;
            border:3px solid var(--accent);
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:32px;
            font-weight:700;
            position:relative;
            transition:0.15s ease;
        ">
            ${bpm}
        </div>
    </div>

    <!-- PROGRESS BAR -->
    <div style="
        height:10px;
        background:rgba(255,255,255,0.08);
        border-radius:6px;
        overflow:hidden;
    ">
        <div id="scale-progress-fill" style="
            height:100%;
            width:0%;
            background:linear-gradient(90deg, var(--accent), #33cfff);
            transition:0.2s ease;
        "></div>
    </div>

    <!-- TRANSPORT CONTROLS -->
    <div style="
        display:flex;
        justify-content:center;
        gap:15px;
        flex-wrap:wrap;
    ">
        <button id="loop-toggle">Loop OFF</button>
        <button id="arpeggio-toggle">Arpeggio OFF</button>
        <button id="stop-playback">Stop</button>
        <label style="opacity:0.6;">Volume</label>
        <input type="range" id="premium-volume" min="0" max="1" step="0.01" value="0.8">
    </div>
</div>
`);



// REFERENCES


const bpmRing = document.getElementById("bpm-ring");
const progressFill = document.getElementById("scale-progress-fill");
const transportState = document.getElementById("transport-state");
const modeDisplay = document.getElementById("mode-display");
const loopToggle = document.getElementById("loop-toggle");
const arpeggioToggle = document.getElementById("arpeggio-toggle");
const stopPlayback = document.getElementById("stop-playback");
const volumeSlider = document.getElementById("premium-volume");



// BPM CONTROL


bpmInput.addEventListener("input", () => {
    bpm = Number(bpmInput.value);
    bpmDisplay.innerText = bpm;
    bpmRing.innerText = bpm;
});



// MODE UPDATE


function updateModeDisplay() {
    if (loopMode && arpeggioMode)
        modeDisplay.innerText = "Mode: Loop + Arpeggio";
    else if (loopMode)
        modeDisplay.innerText = "Mode: Loop";
    else if (arpeggioMode)
        modeDisplay.innerText = "Mode: Arpeggio";
    else
        modeDisplay.innerText = "Mode: Normal";
}



// LOOP TOGGLE


loopToggle.addEventListener("click", () => {
    loopMode = !loopMode;
    loopToggle.innerText = loopMode ? "Loop ON" : "Loop OFF";
    updateModeDisplay();
});



// ARPEGGIO TOGGLE


arpeggioToggle.addEventListener("click", () => {
    arpeggioMode = !arpeggioMode;
    arpeggioToggle.innerText = arpeggioMode ? "Arpeggio ON" : "Arpeggio OFF";
    updateModeDisplay();
});



// VOLUME CONTROL


volumeSlider.addEventListener("input", () => {
    setMasterVolume(volumeSlider.value);
});



// STOP BUTTON


stopPlayback.addEventListener("click", () => {
    isPlayingScale = false;
    transportState.innerText = "Stopped";
    progressFill.style.width = "0%";
});



// METRONOME WITH PREMIUM PULSE
// 

// METRONOME WITH PREMIUM PULSE


// --- References to existing elements ---
const startBtn = document.getElementById("start-metronome");
const stopBtn = document.getElementById("stop-metronome");
const timeSignatureSelect = document.getElementById("time-signature");

// --- Wrap BPM ring and beat circles in vertical container ---
let bpmWrapper = document.getElementById("bpm-wrapper");
if (!bpmWrapper) {
    bpmWrapper = document.createElement("div");
    bpmWrapper.id = "bpm-wrapper";
    bpmWrapper.style.display = "flex";
    bpmWrapper.style.flexDirection = "column"; // vertical layout
    bpmWrapper.style.alignItems = "center";
    bpmWrapper.style.gap = "15px";

    bpmRing.parentNode.insertBefore(bpmWrapper, bpmRing);
    bpmWrapper.appendChild(bpmRing);
}

// --- Create beat circles container below BPM ring ---
let beatCirclesContainer = document.getElementById("beat-circles");
if (!beatCirclesContainer) {
    beatCirclesContainer = document.createElement("div");
    beatCirclesContainer.id = "beat-circles";

    beatCirclesContainer.style.display = "flex";
    beatCirclesContainer.style.justifyContent = "center";
    beatCirclesContainer.style.alignItems = "center";
    beatCirclesContainer.style.gap = "15px";

    bpmWrapper.appendChild(beatCirclesContainer);
}

// --- Function to render beat circles ---
function renderBeatCircles(beatsPerMeasure) {
    beatCirclesContainer.innerHTML = "";
    for (let i = 0; i < beatsPerMeasure; i++) {
        const circle = document.createElement("div");
        circle.className = "beat-circle";
        circle.innerText = i + 1;
        beatCirclesContainer.appendChild(circle);
    }
}

// Initial render
let beatsPerMeasure = parseInt(timeSignatureSelect.value);
renderBeatCircles(beatsPerMeasure);

// Update circles when time signature changes
timeSignatureSelect.addEventListener("change", () => {
    beatsPerMeasure = parseInt(timeSignatureSelect.value);
    renderBeatCircles(beatsPerMeasure);
});

// --- START METRONOME ---
startBtn.addEventListener("click", () => {
    if (metronomeInterval) clearInterval(metronomeInterval);

    beatCount = 0;
    beatsPerMeasure = parseInt(timeSignatureSelect.value);
    renderBeatCircles(beatsPerMeasure);

    const interval = 60000 / bpm;

    metronomeInterval = setInterval(() => {
        const isAccent = beatCount % beatsPerMeasure === 0;

        playClick(isAccent);

        // Animate main BPM ring
        bpmRing.style.transform = "scale(1.1)";
        bpmRing.style.boxShadow = isAccent
            ? "0 0 60px var(--accent)"
            : "0 0 25px var(--accent)";
        setTimeout(() => bpmRing.style.transform = "scale(1)", 100);

        // Highlight current beat circle
        const circles = beatCirclesContainer.children;
        for (let i = 0; i < circles.length; i++) {
            if (i === beatCount % beatsPerMeasure) {
                circles[i].classList.add("active");
            } else {
                circles[i].classList.remove("active");
            }
        }

        beatCount++;
    }, interval);
});

// --- STOP METRONOME ---
stopBtn.addEventListener("click", () => {
    clearInterval(metronomeInterval);
    metronomeInterval = null;
    bpmRing.style.boxShadow = "none";

    // Reset beat circles
    const circles = beatCirclesContainer.children;
    for (let i = 0; i < circles.length; i++) {
        circles[i].classList.remove("active");
    }
});



// PREMIUM SCALE PLAYBACK


playScaleBtn.addEventListener("click", async () => {

    if (isPlayingScale) return;

    const activeKeys = document.querySelectorAll(".key.active");

    if (!activeKeys.length) {
        alert("Generate a scale first!");
        return;
    }

    isPlayingScale = true;
    transportState.innerText = "Playing...";
    nowPlaying.innerText = "Scale Playback";

    const interval = 60000 / bpm;

    do {

        for (let i = 0; i < activeKeys.length; i++) {

            if (!isPlayingScale) break;

            const note = activeKeys[i].dataset.note;

            activeKeys[i].classList.add("active-play");

            playNote(note, interval / 1000 * 0.9, 1);

            progressFill.style.width =
                `${((i + 1) / activeKeys.length) * 100}%`;

            await new Promise(r => setTimeout(r, interval));

            activeKeys[i].classList.remove("active-play");
        }

        // Arpeggio Backwards
        if (arpeggioMode && isPlayingScale) {
            for (let i = activeKeys.length - 2; i > 0; i--) {

                if (!isPlayingScale) break;

                const note = activeKeys[i].dataset.note;

                activeKeys[i].classList.add("active-play");

                playNote(note, interval / 1000 * 0.9, 0.9);

                progressFill.style.width =
                    `${((activeKeys.length - i) / activeKeys.length) * 100}%`;

                await new Promise(r => setTimeout(r, interval));

                activeKeys[i].classList.remove("active-play");
            }
        }

    } while (loopMode && isPlayingScale);

    transportState.innerText = "Ready";
    nowPlaying.innerText = "Not Playing";
    progressFill.style.width = "0%";
    isPlayingScale = false;
});



// 🎼 DIATONIC PROGRESSION CONNECTOR dded but not functioning yet


const PROGRESSIONS = {
    "I-IV-V-I": [0, 3, 4, 0],
    "I-V-vi-IV": [0, 4, 5, 3],
    "ii-V-I-vi": [1, 4, 0, 5]
};

const ROMANS = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];

function generatePracticeProgression() {

    if (!window.musicState || !window.musicState.root) {
        alert("Generate scale first");
        return;
    }

    const container = document.getElementById("progression-output");
    container.innerHTML = "";

    const root = window.musicState.root;
    const NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    const MAJOR_SCALE_INTERVALS = [0,2,4,5,7,9,11];
    const CHORD_QUALITIES = ['maj','min','min','maj','maj','min','dim'];

    const rootIndex = NOTES.indexOf(root);

    // Build full diatonic chord list
    const diatonicChords = MAJOR_SCALE_INTERVALS.map((interval, i) => {
        const chordRoot = NOTES[(rootIndex + interval) % 12];
        return {
            root: chordRoot,
            quality: CHORD_QUALITIES[i],
            roman: ROMANS[i]
        };
    });

    // Get selected progression
    const select = document.getElementById("progression-select");
    const selected = select.value;

    let progressionIndexes;

    if (selected === "custom") {
        progressionIndexes = [
            parseInt(document.getElementById("c1").value),
            parseInt(document.getElementById("c2").value),
            parseInt(document.getElementById("c3").value),
            parseInt(document.getElementById("c4").value)
        ];
    } else {
        progressionIndexes = PROGRESSIONS[selected];
    }

    // Render 4 chord charts
    progressionIndexes.forEach(index => {

        const chord = diatonicChords[index];

        const card = document.createElement("div");
        card.className = "card glass";

        const title = document.createElement("h3");
        title.innerText = `${chord.roman} - ${chord.root}${chord.quality}`;
        card.appendChild(title);

        // Reuse chordLab piano renderer
        const instrument = document.getElementById("instrument-select").value;

            if (instrument === "piano") {
                card.appendChild(renderPianoChord(chord.root, chord.quality));
            } else {
                card.appendChild(renderGuitarChord(chord.root, chord.quality));
            }
        container.appendChild(card);
    });
}

function renderPracticePianoChord(root, quality) {

    const NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    const CHORD_INTERVALS = {
        maj: [0,4,7],
        min: [0,3,7],
        dim: [0,3,6]
    };

    const piano = document.createElement("div");
    piano.style.position = "relative";
    piano.style.width = "280px";
    piano.style.height = "120px";

    const chordNotes = CHORD_INTERVALS[quality]
        .map(i => NOTES[(NOTES.indexOf(root)+i)%12]);

    const whiteKeys = ['C','D','E','F','G','A','B'];
    const blackKeys = [
        {note:'C#',left:30},
        {note:'D#',left:70},
        {note:'F#',left:150},
        {note:'G#',left:190},
        {note:'A#',left:230}
    ];

    whiteKeys.forEach((note,i)=>{
        const key = document.createElement("div");
        key.className = "key white";
        key.style.position="absolute";
        key.style.left=`${i*40}px`;
        key.style.width="40px";
        key.style.height="120px";
        if(chordNotes.includes(note)) key.classList.add("active");
        piano.appendChild(key);
    });

    blackKeys.forEach(b=>{
        const key = document.createElement("div");
        key.className="key black";
        key.style.position="absolute";
        key.style.left=`${b.left}px`;
        key.style.width="26px";
        key.style.height="70px";
        if(chordNotes.includes(b.note)) key.classList.add("active");
        piano.appendChild(key);
    });

    return piano;
}


// Connect button to function
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("generate-progression-btn");
    if (btn) {
        btn.addEventListener("click", generatePracticeProgression);
    }
});

// costom selecto operator //

const progressionSelect = document.getElementById("progression-select");
const customSelectors = document.getElementById("custom-selectors");

// Run once on load
toggleCustomSelectors();

// Listen for change
progressionSelect.addEventListener("change", toggleCustomSelectors);

function toggleCustomSelectors() {
    if (progressionSelect.value === "custom") {
        customSelectors.style.display = "flex"; // or block if you prefer
    } else {
        customSelectors.style.display = "none";
    }
}
