// chordLab.js — Real Music Logic Version
// Generates piano and guitar chord diagrams based on the current scale

document.addEventListener("DOMContentLoaded", () => {
  const NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

  // Diatonic Major chord intervals
  const MAJOR_SCALE_INTERVALS = [0,2,4,5,7,9,11];
  const CHORD_QUALITIES = ['maj','min','min','maj','maj','min','dim'];

  // Chord interval formulas
  const CHORD_INTERVALS = {
    maj: [0,4,7],
    min: [0,3,7],
    dim: [0,3,6]
  };

  const STRINGS = ['E','A','D','G','B','E'];
  const MAX_FRETS = 5;

  const chordBtn = document.getElementById("generate-chords-btn");
  const instrumentSelect = document.getElementById("chord-instrument");
  const container = document.getElementById("chord-chart-container");

  // Event listeners
  chordBtn.addEventListener("click", generateChordLab);
  instrumentSelect.addEventListener("change", generateChordLab);

  // ===================== MAIN FUNCTION =====================
  function generateChordLab() {
    if (!window.musicState || !window.musicState.root) {
      alert("Generate scale first");
      return;
    }

    container.innerHTML = "";

    const root = window.musicState.root;
    const rootIndex = NOTES.indexOf(root);
    const instrument = instrumentSelect.value;

    MAJOR_SCALE_INTERVALS.forEach((interval,i) => {
      const chordRoot = NOTES[(rootIndex + interval) % 12];
      const quality = CHORD_QUALITIES[i];
      const chordName = chordRoot + quality;

      const card = document.createElement("div");
      card.className = "card glass";

      const title = document.createElement("h3");
      title.innerText = chordName;
      card.appendChild(title);

      if (instrument === "piano") {
        card.appendChild(renderPianoChord(chordRoot, quality));
      } else {
        card.appendChild(renderGuitarChord(chordRoot, quality));
      }

      container.appendChild(card);
    });
  }

  // ===================== PIANO =====================
// ===================== PIANO (True Chromatic Centered Layout) =====================
function renderPianoChord(root, quality) {

  const piano = document.createElement("div");
  piano.className = "mini-piano";

  const chordNotes = CHORD_INTERVALS[quality].map(i =>
    NOTES[(NOTES.indexOf(root) + i) % 12]
  );

  const whitePattern = ['C','D','E','F','G','A','B'];

  // Find previous white note before root
  let rootIndex = NOTES.indexOf(root);
  let startIndex = rootIndex;

  do {
    startIndex = (startIndex - 1 + 12) % 12;
  } while (!whitePattern.includes(NOTES[startIndex]));

  // Build 13 semitones (1 white before root + full octave)
  const chromaticNotes = [];
  for (let i = 0; i < 13; i++) {
    chromaticNotes.push(NOTES[(startIndex + i) % 12]);
  }

  // Extract white keys for layout
  const whiteNotes = chromaticNotes.filter(n => whitePattern.includes(n));

  const whiteKeyWidth = 40;
  piano.style.position = "relative";
  piano.style.height = "150px";
  piano.style.width = `${whiteNotes.length * whiteKeyWidth}px`;
  piano.style.margin = "0 auto";

  // Draw white keys
  whiteNotes.forEach((note, i) => {

    const key = document.createElement("div");
    key.className = "key white";
    key.style.position = "absolute";
    key.style.left = `${i * whiteKeyWidth}px`;
    key.style.width = `${whiteKeyWidth}px`;
    key.style.height = "150px";

    if (chordNotes.includes(note)) {
      key.classList.add("active");
    }

    const label = document.createElement("span");
    label.innerText = note;
    label.style.position = "absolute";
    label.style.bottom = "5px";
    label.style.fontSize = "11px";
    label.style.fontWeight = "600";
    key.appendChild(label);

    piano.appendChild(key);
  });

  // Black key mapping (true piano layout)
  const blackBetween = {
    'C' : 'C#',
    'D': 'D#',
    'F': 'F#',
    'G': 'G#',
    'A': 'A#'
  };

  const blackWidth = 24;
const blackHeight = 160;

whiteNotes.forEach((note, i) => {

  if (blackBetween[note]) {

    const sharpNote = blackBetween[note];

    const key = document.createElement("div");
    key.className = "key black";
    key.style.position = "absolute";

    key.style.left = `${(i * whiteKeyWidth) + whiteKeyWidth - (blackWidth / 2)}px`;
    key.style.width = `${blackWidth}px`;
    key.style.height = `${blackHeight}px`;
    key.style.zIndex = "2";

    if (chordNotes.includes(sharpNote)) {
      key.classList.add("active");
    }

    const label = document.createElement("span");
    label.innerText = sharpNote;
    label.style.position = "absolute";
    label.style.bottom = "5px";
    label.style.fontSize = "9px";
    label.style.color = "#fff";
    key.appendChild(label);

    piano.appendChild(key);
  }
});


  return piano;
}



  // ===================== GUITAR =====================
// ===================== GUITAR (True Chart — Fixed Frets 1–5) =====================
function renderGuitarChord(root, quality) {

  const ACCENT = "#00f2ff";

  const board = document.createElement("div");
  board.style.position = "relative";
  board.style.width = "220px";
  board.style.height = "250px";
  board.style.background = "#fff";
  board.style.border = "2px solid #000";
  board.style.borderRadius = "10px";
  board.style.margin = "0 auto";
  board.style.paddingTop = "70px";

  const stringSpacing = 32;
  const fretSpacing = 40;
  const startX = 40;
  const startY = 80;
  const visibleFrets = 5;

  // ===================== CAGED SHAPE LIBRARY =====================

  const SHAPES = {

    maj: {

      C:  { frets: [-1,3,2,0,1,0], fingers:[0,3,2,0,1,0] },
      A:  { frets: [-1,0,2,2,2,0], fingers:[0,0,2,3,4,0] },
      G:  { frets: [3,2,0,0,0,3], fingers:[2,1,0,0,0,3] },
      E:  { frets: [0,2,2,1,0,0], fingers:[0,2,3,1,0,0] },
      D:  { frets: [-1,-1,0,2,3,2], fingers:[0,0,0,1,3,2] },

      F:  { frets: [1,3,3,2,1,1], fingers:[1,3,4,2,1,1] },
      B:  { frets: [-1,2,4,4,4,2], fingers:[0,1,3,4,4,1] }

    },

    min: {

      A: { frets: [-1,0,2,2,1,0], fingers:[0,0,3,4,1,0] },
      E: { frets: [0,2,2,0,0,0], fingers:[0,2,3,0,0,0] },
      D: { frets: [-1,-1,0,2,3,1], fingers:[0,0,0,2,3,1] },

      F: { frets:[1,3,3,1,1,1], fingers:[1,3,4,1,1,1] },
      B: { frets:[-1,2,4,4,3,2], fingers:[0,1,3,4,2,1] }

    },

    dim: {

      B: { frets:[-1,2,3,1,3,1], fingers:[0,2,3,1,4,1] },
      C: { frets:[-1,3,4,2,4,2], fingers:[0,2,3,1,4,1] }

    }

  };

  let frets = [];
  let fingers = [];

  // ===================== SHAPE SELECTION =====================

  if (SHAPES[quality] && SHAPES[quality][root]) {

    frets = SHAPES[quality][root].frets.slice();
    fingers = SHAPES[quality][root].fingers.slice();

  } else {

    // Smart fallback using common barre shapes

    if (quality === "maj") {
      const baseShape = SHAPES.maj.F;
      frets = transposeShape("F", root, baseShape.frets);
      fingers = baseShape.fingers.slice();

    }
    else if (quality === "min") {
      const baseShape = SHAPES.min.F;
      frets = transposeShape("F", root, baseShape.frets);
      fingers = baseShape.fingers.slice();

    }
    else if (quality === "dim") {
      const baseShape = SHAPES.dim.B;
    frets = transposeShape("B", root, baseShape.frets);
    fingers = baseShape.fingers.slice();

    }
    else {
      frets = [-1,-1,-1,-1,-1,-1];
      fingers = [0,0,0,0,0,0];
    }

  }
  // ===================== DETECT FRETBOARD POSITION =====================

    const playedFrets = frets.filter(f => f > 0);

    let positionLabel = "Open Position";

    if (playedFrets.length > 0) {
      const minFret = Math.min(...playedFrets);
      if (minFret > 1) {
        positionLabel = `${minFret}th Fret`;
      }
    }


  // ===================== TITLE =====================

  const title = document.createElement("div");
  title.innerText = `${root}${quality}`;
  title.style.position = "absolute";
  title.style.top = "15px";
  title.style.width = "100%";
  title.style.textAlign = "center";
  title.style.fontWeight = "bold";
  title.style.fontSize = "18px";
  board.appendChild(title);

  // ===================== STRING LABELS =====================


  // ===================== STRING LABELS (Above Nut) =====================

STRINGS.forEach((note, i) => {

  const x = startX + i * stringSpacing;

  const label = document.createElement("div");
  label.innerText = note;

  label.style.position = "absolute";
  label.style.left = `${x - 10}px`;
  label.style.top = `${startY - 35}px`;   // moved clearly above nut
  label.style.width = "20px";
  label.style.textAlign = "center";
  label.style.fontSize = "14px";
  label.style.fontWeight = "700";
  label.style.color = "#000";

  board.appendChild(label);

});


  // ===================== DRAW STRINGS =====================

  STRINGS.forEach((_, sIdx) => {

    const x = startX + sIdx * stringSpacing;

    const stringLine = document.createElement("div");
    stringLine.style.position = "absolute";
    stringLine.style.left = `${x}px`;
    stringLine.style.top = `${startY}px`;
    stringLine.style.height = `${visibleFrets * fretSpacing}px`;
    stringLine.style.width = "2px";
    stringLine.style.background = "#000";
    board.appendChild(stringLine);

  });

  // ===================== DRAW FRETS =====================

  // ===================== DRAW FRETS + LEFT SIDE FRET NUMBERS =====================

for (let f = 0; f <= visibleFrets; f++) {

  const y = startY + f * fretSpacing;

  // Fret Line
  const fretLine = document.createElement("div");
  fretLine.style.position = "absolute";
  fretLine.style.left = `${startX}px`;
  fretLine.style.top = `${y}px`;
  fretLine.style.width = `${stringSpacing * (STRINGS.length - 1)}px`;
  fretLine.style.height = f === 0 ? "8px" : "2px"; // Nut thicker
  fretLine.style.background = "#000";
  board.appendChild(fretLine);

  // Left Side Vertical Fret Numbers (skip nut)
  if (f > 0) {

    const fretLabel = document.createElement("div");
    fretLabel.innerText = f;

    fretLabel.style.position = "absolute";
    fretLabel.style.left = `${startX - 25}px`;  // Left side column
    fretLabel.style.top = `${y - (fretSpacing / 2) - 8}px`;
    fretLabel.style.width = "20px";
    fretLabel.style.textAlign = "center";
    fretLabel.style.fontSize = "13px";
    fretLabel.style.fontWeight = "700";
    fretLabel.style.color = "#000";
    fretLabel.style.paddingRight = "20px"

    board.appendChild(fretLabel);
  }
}


  // ===================== DRAW NOTES =====================

  const fretGroups = {};

  frets.forEach((fret, sIdx) => {

    const x = startX + sIdx * stringSpacing;

    if (fret === -1) {

      const mute = document.createElement("div");
      mute.innerText = "X";
      mute.style.position = "absolute";
      mute.style.left = `${x - 5}px`;
      mute.style.top = `${startY - 65}px`;
      mute.style.fontWeight = "bold";
      board.appendChild(mute);
      return;

    }

    if (fret === 0) {

      const open = document.createElement("div");
      open.innerText = "O";
      open.style.position = "absolute";
      open.style.left = `${x - 5}px`;
      open.style.top = `${startY - 65}px`;
      open.style.fontWeight = "bold";
      board.appendChild(open);
      return;

    }

    if (fret > visibleFrets) return;

    if (!fretGroups[fret]) fretGroups[fret] = [];
    fretGroups[fret].push(sIdx);

    const y = startY + fret * fretSpacing - fretSpacing / 2;

    const dot = document.createElement("div");
    dot.style.position = "absolute";
    dot.style.left = `${x - 10}px`;
    dot.style.top = `${y}px`;
    dot.style.width = "20px";
    dot.style.height = "20px";
    dot.style.borderRadius = "50%";
    dot.style.background = ACCENT;
    dot.style.display = "flex";
    dot.style.alignItems = "center";
    dot.style.justifyContent = "center";
    dot.style.fontSize = "12px";
    dot.style.fontWeight = "bold";
    dot.style.color = "#000";
    dot.innerText = fingers[sIdx] || "";
    board.appendChild(dot);

  });

  // ===================== SMART BARRE =====================

  Object.keys(fretGroups).forEach(f => {

    const strings = fretGroups[f];
    if (strings.length < 3) return;

    const sorted = strings.sort((a,b)=>a-b);

    let adjacent = false;
    for (let i=0;i<sorted.length-1;i++){
      if (sorted[i+1] - sorted[i] === 1) adjacent = true;
    }

    if (adjacent) return;

    const first = sorted[0];
    const last = sorted[sorted.length-1];

    const x1 = startX + first * stringSpacing;
    const x2 = startX + last * stringSpacing;
    const y = startY + f * fretSpacing - fretSpacing / 2 + 8;

    const barre = document.createElement("div");
    barre.style.position = "absolute";
    barre.style.left = `${x1 - 10}px`;
    barre.style.top = `${y}px`;
    barre.style.width = `${x2 - x1 + 20}px`;
    barre.style.height = "12px";
    barre.style.background = ACCENT;
    barre.style.borderRadius = "8px";
    board.appendChild(barre);

  });

  function transposeShape(baseRoot, targetRoot, fretsArray) {

  const baseIndex = NOTES.indexOf(baseRoot);
  const targetIndex = NOTES.indexOf(targetRoot);

  let diff = targetIndex - baseIndex;
  if (diff < 0) diff += 12;

  return fretsArray.map(f => {
    if (f <= 0) return f;  // keep open & muted
    return f + diff;
  });
}


  return board;
}

window.renderPianoChord = renderPianoChord;
window.renderGuitarChord = renderGuitarChord;


})