// ====================== GLOBAL MUSIC STATE ======================
window.musicState = {
  root: 'C',
  scaleType: 'major',
  scaleNotes: [],
  diatonicChords: []
};

// ====================== APP INIT ======================
document.addEventListener('DOMContentLoaded', () => {

  // ---------------- NAVIGATION ----------------
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      item.classList.add('active');
      document.getElementById(item.dataset.section).classList.add('active');
    });
  });

  // ---------------- CONSTANTS ----------------
  const NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const CLASSICAL = ['Sa','Re','Ga','Ma','Pa','Dha','Ni','Sa'];

  const SCALE_FORMULAS = {
    major:    [0,2,4,5,7,9,11,12],
    minor:    [0,2,3,5,7,8,10,12],
    dorian:   [0,2,3,5,7,9,10,12],
    majPent:  [0,2,4,7,9,12],
    minPent:  [0,3,5,7,10,12]
  };

  const DIATONIC_QUALITY = {
    major: ['maj','min','min','maj','maj','min','dim'],
    minor: ['min','dim','maj','min','min','maj','maj']
  };

  // ---------------- PIANO ----------------
  const pianoWrapper = document.getElementById('piano-wrapper');

  function createPiano() {
    pianoWrapper.innerHTML = '';
    for (let i = 0; i < 24; i++) {
      const note = NOTES[i % 12];
      const key = document.createElement('div');
      key.className = `key ${note.includes('#') ? 'black' : 'white'}`;
      key.dataset.note = note;
      key.dataset.index = i;
      pianoWrapper.appendChild(key);
    }
  }

  function clearPiano() {
    document.querySelectorAll('.key').forEach(k => {
      k.classList.remove('active');
      k.innerText = '';
    });
  }

  function findOctaveStart(root) {
    const keys = document.querySelectorAll('.key');
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].dataset.note === root) return i;
    }
    return 0;
  }

  // ---------------- SCALE GENERATION ----------------
  function generateScale() {
    const rootInput = document.getElementById('root-input').value.trim().toUpperCase() || 'C';
    const scaleType = document.getElementById('scale-type').value;
    const displayType = document.getElementById('note-display').value;

    if (!NOTES.includes(rootInput)) {
      alert('Invalid root note');
      return;
    }

    clearPiano();

    const rootIndex = NOTES.indexOf(rootInput);
    const intervals = SCALE_FORMULAS[scaleType];
    const startIndex = findOctaveStart(rootInput);
    const keys = document.querySelectorAll('.key');

    const scaleNotes = [];
    const classicalNotes = [...CLASSICAL];

    if (scaleType === 'minor') {
      classicalNotes[2] = 'komal Ga';
      classicalNotes[5] = 'komal Dha';
      classicalNotes[6] = 'komal Ni';
    }

    intervals.forEach((interval, i) => {
      const key = keys[startIndex + interval];
      if (!key) return;

      key.classList.add('active');

      const noteName = NOTES[(rootIndex + interval) % 12];
      scaleNotes.push(noteName);

      key.innerText = displayType === 'western'
        ? noteName
        : classicalNotes[i];
    });

    // -------- Display Scale Notes --------
    document.getElementById('notes-list').innerText =
      displayType === 'western'
        ? scaleNotes.join(' ')
        : classicalNotes.slice(0, scaleNotes.length).join(' ');

    // -------- Diatonic Chords --------
    let diatonicChords = [];

    if (DIATONIC_QUALITY[scaleType]) {
      DIATONIC_QUALITY[scaleType].forEach((quality, i) => {
        diatonicChords.push(scaleNotes[i] + quality);
      });
      document.getElementById('chords-list').innerText = diatonicChords.join(', ');
    } else {
      document.getElementById('chords-list').innerText =
        'Diatonic chords not defined for this scale';
    }

    // -------- SAVE GLOBAL STATE --------
    window.musicState.root = rootInput;
    window.musicState.scaleType = scaleType;
    window.musicState.scaleNotes = scaleNotes;
    window.musicState.diatonicChords = diatonicChords;
  }

  // ---------------- EVENTS ----------------
  document.getElementById('generate-btn')
    .addEventListener('click', generateScale);

  // ---------------- INIT ----------------
  createPiano();
  generateScale();
});