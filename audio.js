// ================================
// SONIC THEORY PRO - AUDIO ENGINE
// ================================

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContextClass();

let isAudioUnlocked = false;

document.addEventListener("click", () => {
    if (!isAudioUnlocked) {
        audioCtx.resume();
        isAudioUnlocked = true;
    }
}, { once: true });


// ================================
// MASTER OUTPUT
// ================================

const masterGain = audioCtx.createGain();
masterGain.gain.value = 0.8;
masterGain.connect(audioCtx.destination);


// ================================
// NOTE FREQUENCY MAP (4th octave)
// ================================

const noteFrequencies = {
    C: 261.63, "C#": 277.18,
    D: 293.66, "D#": 311.13,
    E: 329.63,
    F: 349.23, "F#": 369.99,
    G: 392.00, "G#": 415.30,
    A: 440.00, "A#": 466.16,
    B: 493.88
};


// ================================
// REALISTIC PIANO ADSR
// ================================

function playNote(note, duration = 0.6, velocity = 1) {

    if (!noteFrequencies[note]) return;

    const now = audioCtx.currentTime;
    const baseFreq = noteFrequencies[note];

    // Piano uses harmonic layering
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const osc3 = audioCtx.createOscillator();

    const gain = audioCtx.createGain();

    osc1.type = "sine";
    osc2.type = "triangle";
    osc3.type = "sine";

    osc1.frequency.value = baseFreq;
    osc2.frequency.value = baseFreq * 2; // harmonic
    osc3.frequency.value = baseFreq * 3; // harmonic

    osc2.detune.value = 5;
    osc3.detune.value = -5;

    osc1.connect(gain);
    osc2.connect(gain);
    osc3.connect(gain);

    gain.connect(masterGain);

    // ADSR Envelope (Piano-like)
    const attack = 0.01;
    const decay = 0.15;
    const sustainLevel = 0.4 * velocity;
    const release = 0.4;

    gain.gain.setValueAtTime(0, now);

    // Attack
    gain.gain.linearRampToValueAtTime(1 * velocity, now + attack);

    // Decay
    gain.gain.linearRampToValueAtTime(
        sustainLevel,
        now + attack + decay
    );

    // Release
    gain.gain.setTargetAtTime(
        0.0001,
        now + duration,
        release
    );

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + duration + release);
    osc2.stop(now + duration + release);
    osc3.stop(now + duration + release);
}



// ================================
// METRONOME CLICK WITH ACCENT
// ================================

function playClick(isAccent = false) {

    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "square";
    osc.frequency.value = isAccent ? 1500 : 1000;

    gain.gain.setValueAtTime(isAccent ? 1.2 : 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.12);
}


// ================================
// MASTER VOLUME CONTROL
// ================================

function setMasterVolume(value) {
    masterGain.gain.value = value;
}
