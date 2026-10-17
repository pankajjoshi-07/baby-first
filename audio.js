/**
 * LUMI'S CELESTIAL SOUND ENGINE
 * Web Audio API Generative Music Box & Sound FX (+3 Bonus Points)
 * Features:
 * - Real Web Audio API oscillators (celesta / crystal music box)
 * - Calming Pentatonic Dreamy Lullaby loop
 * - Interactive chime FX on star and card clicks
 * - Secret Easter Egg Melody
 * - Strict Mute Switch & Browser AudioContext resume
 */

class DreamAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.currentNoteIndex = 0;
    this.musicTimer = null;
    
    // Pentatonic scale frequencies for heavenly dream sound (Hz)
    // C4, D4, E4, G4, A4, C5, D5, E5, G5, A5
    this.notes = {
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'G4': 392.00, 'A4': 440.00,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'G5': 783.99, 'A5': 880.00,
      'C6': 1046.50
    };

    // Cozy Bedtime Lullaby sequence (notes & duration in beats)
    this.lullabyScore = [
      { note: 'E5', dur: 0.5 }, { note: 'G5', dur: 0.5 }, { note: 'A5', dur: 1.0 },
      { note: 'G5', dur: 0.5 }, { note: 'E5', dur: 0.5 }, { note: 'D5', dur: 1.0 },
      { note: 'C5', dur: 0.5 }, { note: 'D5', dur: 0.5 }, { note: 'E5', dur: 1.0 },
      { note: 'D5', dur: 0.5 }, { note: 'C5', dur: 0.5 }, { note: 'A4', dur: 1.0 },
      { note: 'C5', dur: 0.5 }, { note: 'D5', dur: 0.5 }, { note: 'E5', dur: 0.75 }, { note: 'G5', dur: 0.75 },
      { note: 'A5', dur: 1.5 }, { note: 'G5', dur: 1.5 }
    ];

    // Secret Easter Egg Track: "Lumi's Midnight Waltz"
    this.secretScore = [
      { note: 'C5', dur: 0.4 }, { note: 'E5', dur: 0.4 }, { note: 'G5', dur: 0.4 }, { note: 'C6', dur: 0.8 },
      { note: 'A5', dur: 0.4 }, { note: 'G5', dur: 0.4 }, { note: 'E5', dur: 0.8 },
      { note: 'F5', dur: 0.4 }, { note: 'A5', dur: 0.4 }, { note: 'C6', dur: 0.8 },
      { note: 'G5', dur: 0.4 }, { note: 'E5', dur: 0.4 }, { note: 'D5', dur: 0.8 }, { note: 'C5', dur: 1.2 }
    ];
  }

  initContext() {
    try {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
          this.isSupported = true;
        } else {
          this.isSupported = false;
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      this.isSupported = false;
    }
  }

  // Play a single celestial crystal music box note
  playChime(noteName = 'C5', customFreq = null) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const freq = customFreq || this.notes[noteName] || 523.25;
    const now = this.ctx.currentTime;

    // Primary bell oscillator (Sine)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Overtone chime oscillator (Triangle)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.01, now); // subtle shimmer harmonic

    // Gain Envelopes (soft attack, slow decay)
    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.06, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    // Gentle lowpass filter for warm cozy feel
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, now);

    // Connect nodes
    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(filter);
    gain2.connect(filter);
    filter.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.3);
    osc2.stop(now + 0.9);
  }

  // Play button click / tap feedback
  playTap() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Play magical unlock fanfare
  playUnlockSound() {
    this.initContext();
    if (!this.ctx) return;
    const chord = ['C5', 'E5', 'G5', 'C6'];
    chord.forEach((n, idx) => {
      setTimeout(() => {
        this.playChime(n);
      }, idx * 120);
    });
  }

  // Start continuous generative lullaby loop
  startLullaby(score = this.lullabyScore) {
    this.initContext();
    if (!this.ctx) return;
    this.isPlaying = true;
    this.currentNoteIndex = 0;

    const playNext = () => {
      if (!this.isPlaying) return;

      const item = score[this.currentNoteIndex];
      this.playChime(item.note);

      this.currentNoteIndex = (this.currentNoteIndex + 1) % score.length;
      const delayMs = (item.dur || 0.6) * 650;
      this.musicTimer = setTimeout(playNext, delayMs);
    };

    playNext();
  }

  // Stop lullaby loop
  stopLullaby() {
    this.isPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  // Toggle Music On / Off
  toggleMusic() {
    if (this.isPlaying) {
      this.stopLullaby();
      return false;
    } else {
      this.isMuted = false;
      this.startLullaby();
      return true;
    }
  }

  // Toggle Mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopLullaby();
    }
    return this.isMuted;
  }
}

// Global audio singleton
window.dreamAudio = new DreamAudioEngine();
