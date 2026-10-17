/**
 * LUMI CINEMATIC ANIMATION: "EVERY DREAM MATTERS" (45 Seconds)
 * 60 FPS HTML5 Canvas Animation Engine & Interactive Video Player
 * 
 * Title: LUMI — EVERY DREAM MATTERS
 * Duration: 45.0 Seconds
 * 
 * Story:
 * SCENE 1 (0–8s): Dark purple galaxy appears; stars twinkle; Lumi awakens, blinks, tilts head, notices golden star.
 * SCENE 2 (8–17s): Golden star circles Lumi; Lumi reaches toward it; spiral particles; background transitions to dream world.
 * SCENE 3 (17–27s): Glowing portal opens; Lumi flies toward it; natural hair & cloak motion; multi-depth parallax.
 * SCENE 4 (27–37s): Dream world dims; Lumi looks worried, hugs star companion; wave of golden & violet light restores stars.
 * SCENE 5 (37–45s): World glows; Lumi & companion float beneath magical tree; Lumi smiles & waves; "Lumi — The Dream Architect" & "Every dream matters."
 */

(function () {
  'use strict';

  // --- 1. PROCEDURAL CINEMATIC AUDIO SYNTHESIZER (WEB AUDIO API) ---
  class CinematicAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.masterGain = null;
      this.lastBeat = -1;
      this.notesMap = {
        'C2': 65.41, 'D2': 73.42, 'Eb2': 77.78, 'F2': 87.31, 'G2': 98.00, 'Ab2': 103.83, 'Bb2': 116.54,
        'C3': 130.81, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'Ab3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
        'C4': 261.63, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
        'C5': 523.25, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'Bb5': 932.33, 'B5': 987.77,
        'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'G6': 1567.98
      };
    }

    init() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime);
          this.masterGain.connect(this.ctx.destination);
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    setMuted(muted) {
      this.isMuted = muted;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime, 0.05);
      }
    }

    playTone(freq, duration = 0.8, type = 'sine', gainVal = 0.16) {
      if (!this.ctx || this.isMuted) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    playChime(note, duration = 1.0, gainVal = 0.2) {
      const f = this.notesMap[note] || 440;
      this.playTone(f, duration, 'sine', gainVal);
      this.playTone(f * 2, duration * 0.7, 'triangle', gainVal * 0.4);
      this.playTone(f * 3, duration * 0.4, 'sine', gainVal * 0.15);
    }

    playKindnessWave() {
      if (!this.ctx || this.isMuted) return;
      const waveChord = ['C4', 'G4', 'C5', 'E5', 'G5', 'C6'];
      waveChord.forEach((note, idx) => {
        setTimeout(() => this.playChime(note, 2.5, 0.22), idx * 45);
      });
      ['E6', 'G6', 'C6'].forEach((note, idx) => {
        setTimeout(() => this.playChime(note, 1.2, 0.14), 280 + idx * 80);
      });
    }

    updateSyncAudio(t) {
      if (!this.ctx || this.isMuted) return;
      const beat = Math.floor(t * 2); // 120 bpm half-beat grid
      if (beat === this.lastBeat) return;
      this.lastBeat = beat;

      // Scene 1: Galaxy Awakening (0-8s) - Quiet celestial lullaby
      if (t < 8.0) {
        if (beat % 2 === 0) {
          const notes = ['C4', 'E4', 'G4', 'C5', 'B4', 'G4', 'E4', 'D4'];
          this.playChime(notes[(beat / 2) % notes.length], 1.2, 0.17);
        }
      }
      // Scene 2: Starlight Dance (8-17s) - Playful circling arpeggios
      else if (t < 17.0) {
        const danceNotes = ['F4', 'A4', 'C5', 'F5', 'G5', 'E5', 'C5', 'G4'];
        this.playChime(danceNotes[beat % danceNotes.length], 0.6, 0.16);
        if (beat % 8 === 0) {
          this.playTone(this.notesMap['F2'], 2.0, 'sine', 0.2);
        }
      }
      // Scene 3: The Glowing Portal (17-27s) - Wonder-filled flight with portal resonance
      else if (t < 27.0) {
        const portalNotes = ['Eb4', 'G4', 'Bb4', 'Eb5', 'F5', 'Bb5'];
        this.playChime(portalNotes[beat % portalNotes.length], 0.7, 0.17);
        if (beat % 4 === 0) {
          this.playTone(this.notesMap['Eb3'], 1.6, 'triangle', 0.15);
        }
      }
      // Scene 4: The Kindness Wave (27-37s) - Tension, heartbeat, into radiant blast at 32.5s
      else if (t < 37.0) {
        if (t < 32.5) {
          if (beat % 2 === 0) {
            this.playTone(this.notesMap['C3'], 0.5, 'sine', 0.2);
            setTimeout(() => this.playChime('Eb4', 0.5, 0.12), 150);
          }
        } else if (beat === 65) {
          // 32.5s: EXACT KINDNESS WAVE
          this.playKindnessWave();
        } else {
          const joyfulArp = ['C5', 'E5', 'G5', 'C6', 'G5', 'E5'];
          this.playChime(joyfulArp[beat % joyfulArp.length], 0.8, 0.18);
        }
      }
      // Scene 5: Every Dream Matters (37-45s) - Sweet peaceful resolution under Dream Tree
      else {
        if (beat % 2 === 0) {
          const peaceNotes = ['G5', 'E5', 'C5', 'D5', 'E5', 'G5', 'C6', 'G5'];
          this.playChime(peaceNotes[(beat / 2) % peaceNotes.length], 1.4, 0.19);
        }
        if (beat % 8 === 0) {
          this.playTone(this.notesMap['C3'], 2.8, 'sine', 0.22);
          this.playTone(this.notesMap['G3'], 2.8, 'sine', 0.15);
        }
      }
    }
  }

  // --- 2. MAIN 60 FPS CINEMATIC ENGINE & TIMELINE CONTROLLER ---
  class LumiCinematicPlayer {
    constructor() {
      this.duration = 45.0; // Exact 45.0-Second Story
      this.currentTime = 0.0;
      this.isPlaying = false;
      this.lastFrameTime = 0;
      this.rafId = null;

      // Audio
      this.audio = new CinematicAudioEngine();

      // DOM Elements
      this.modal = document.getElementById('modal-intro');
      this.canvas = document.getElementById('cinematic-canvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.screenWrap = document.getElementById('cinematic-screen-wrap');
      this.bigPlayBtn = document.getElementById('cinematic-big-play');
      this.playPauseBtn = document.getElementById('ctrl-play-pause');
      this.playIcon = document.getElementById('ctrl-icon-play');
      this.pauseIcon = document.getElementById('ctrl-icon-pause');
      this.replayBtn = document.getElementById('ctrl-replay');
      this.skipBtn = document.getElementById('btn-intro-skip');
      this.muteBtn = document.getElementById('ctrl-mute-toggle');
      this.volOnIcon = document.getElementById('ctrl-icon-vol-on');
      this.volOffIcon = document.getElementById('ctrl-icon-vol-off');
      this.timelineTrack = document.getElementById('cinematic-timeline-track');
      this.timelineFill = document.getElementById('cinematic-timeline-fill');
      this.timelineHandle = document.getElementById('cinematic-timeline-handle');
      this.timeDisplay = document.getElementById('cinematic-current-time');
      this.chapterIndicator = document.getElementById('cinematic-chapter-indicator');
      this.sceneTitle = document.getElementById('cinematic-scene-title');
      this.overlayCard = document.getElementById('cinematic-overlay-card');
      this.overlayTag = document.getElementById('overlay-scene-tag');
      this.overlayHeading = document.getElementById('overlay-scene-heading');
      this.overlayCaption = document.getElementById('overlay-scene-caption');
      this.welcomeBanner = document.getElementById('cinematic-welcome-banner');
      this.exploreBtn = document.getElementById('cinematic-btn-explore');
      this.endReplayBtn = document.getElementById('cinematic-btn-replay-end');

      // Asset Preloads (Preserving Established Lumi Design)
      this.images = {
        sparkAwake: this.loadImage('assets/journey1_spark_hd.jpg'),
        lumiPortrait: this.loadImage('assets/about_photo_hd.jpg'),
        lumiFly: this.loadImage('assets/journey4_architect_hd.jpg'),
        portal: this.loadImage('assets/journey2_portal_hd.jpg'),
        dreamTree: this.loadImage('assets/proj3_garden_hd.jpg'),
        dreamWorldBg: this.loadImage('assets/hero_clean_bg.jpg')
      };

      // Procedural Particle Systems
      this.stars = this.createGalaxyStars(140);
      this.spiralParticles = [];
      this.climaxSparkles = this.createParticles(160, { xRange: 1280, yRange: 720, speed: 1.8, size: 3.5, colors: ['#fcd34d', '#ec4899', '#a855f7', '#38bdf8', '#ffffff'] });
      this.treePetals = this.createParticles(90, { xRange: 1280, yRange: 720, speed: 0.5, size: 2.8, colors: ['#fcd34d', '#f472b6', '#c084fc', '#ffffff'] });

      // 5 Coherent Story Scenes (45s Total)
      this.scenes = [
        {
          start: 0.0,
          end: 8.0,
          id: 1,
          name: "Scene 1: Galaxy Awakening",
          title: "Galaxy Awakening",
          tag: "🌌 Scene 1 of 5 (0s – 8s)",
          caption: "A dark purple galaxy slowly appears as tiny stars twinkle. Lumi wakes up, blinks, tilts her head, and notices a tiny golden star floating toward her."
        },
        {
          start: 8.0,
          end: 17.0,
          id: 2,
          name: "Scene 2: Starlight Dance",
          title: "Starlight Dance",
          tag: "✨ Scene 2 of 5 (8s – 17s)",
          caption: "The golden star circles Lumi. Lumi reaches toward it. Magical particles spiral around her, and the background transitions into a beautiful dream world."
        },
        {
          start: 17.0,
          end: 27.0,
          id: 3,
          name: "Scene 3: The Glowing Portal",
          title: "The Glowing Portal",
          tag: "🌀 Scene 3 of 5 (17s – 27s)",
          caption: "A glowing portal opens. Lumi flies toward it, her hair and cloak moving naturally. Floating islands, clouds, and stars move at different depths to create parallax."
        },
        {
          start: 27.0,
          end: 37.0,
          id: 4,
          name: "Scene 4: The Kindness Wave",
          title: "The Kindness Wave",
          tag: "💖 Scene 4 of 5 (27s – 37s)",
          caption: "The dream world begins losing its light. Lumi looks worried, then hugs her golden star companion. A wave of golden and violet light spreads across the environment, restoring the stars."
        },
        {
          start: 37.0,
          end: 45.0,
          id: 5,
          name: "Scene 5: Every Dream Matters",
          title: "Every Dream Matters",
          tag: "🌟 Scene 5 of 5 (37s – 45s)",
          caption: "The world glows beautifully. Lumi and her companion float beneath a magical tree. Lumi smiles and waves at the viewer."
        }
      ];

      this.isDraggingSeek = false;
      this.setupEventListeners();
    }

    loadImage(src) {
      const img = new Image();
      img.src = src;
      return img;
    }

    createGalaxyStars(count) {
      const arr = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * 1280,
          y: Math.random() * 720,
          size: Math.random() * 2.5 + 0.8,
          alpha: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.05 + 0.015,
          color: ['#fcd34d', '#fed7aa', '#c084fc', '#38bdf8', '#ffffff'][Math.floor(Math.random() * 5)]
        });
      }
      return arr;
    }

    createParticles(count, opt) {
      const arr = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * (opt.xRange || 1280),
          y: Math.random() * (opt.yRange || 720),
          size: Math.random() * (opt.size || 2.5) + 0.8,
          alpha: Math.random() * 0.7 + 0.3,
          speedX: (Math.random() - 0.5) * (opt.speed || 0.4),
          speedY: (Math.random() * -0.5 - 0.2) * (opt.speed || 0.4),
          color: opt.colors[Math.floor(Math.random() * opt.colors.length)]
        });
      }
      return arr;
    }

    setupEventListeners() {
      if (this.bigPlayBtn) {
        this.bigPlayBtn.addEventListener('click', () => this.play());
      }
      if (this.canvas) {
        this.canvas.addEventListener('click', () => this.togglePlayPause());
      }

      if (this.playPauseBtn) {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
      }

      if (this.replayBtn) {
        this.replayBtn.addEventListener('click', () => {
          this.seek(0);
          this.play();
        });
      }

      if (this.endReplayBtn) {
        this.endReplayBtn.addEventListener('click', () => {
          this.seek(0);
          this.play();
        });
      }

      // Skip Intro: jumps to Scene 5 finale card (39.5s)
      if (this.skipBtn) {
        this.skipBtn.addEventListener('click', () => {
          this.seek(39.5);
          this.play();
        });
      }

      if (this.muteBtn) {
        this.muteBtn.addEventListener('click', () => this.toggleMute());
      }

      if (this.exploreBtn) {
        this.exploreBtn.addEventListener('click', () => {
          this.close();
          const proj = document.getElementById('projects');
          if (proj) {
            proj.scrollIntoView({ behavior: 'smooth', block: 'center' });
            proj.classList.add('target-highlight');
            setTimeout(() => proj.classList.remove('target-highlight'), 1200);
          }
        });
      }

      if (this.timelineTrack) {
        const handleScrub = (e) => {
          const rect = this.timelineTrack.getBoundingClientRect();
          const clientX = e.touches ? e.touches[0].clientX : e.clientX;
          const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
          this.seek(pos * this.duration);
        };

        this.timelineTrack.addEventListener('mousedown', (e) => {
          this.isDraggingSeek = true;
          handleScrub(e);
        });

        window.addEventListener('mousemove', (e) => {
          if (this.isDraggingSeek) handleScrub(e);
        });

        window.addEventListener('mouseup', () => {
          this.isDraggingSeek = false;
        });

        this.timelineTrack.addEventListener('touchstart', (e) => {
          this.isDraggingSeek = true;
          handleScrub(e);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
          if (this.isDraggingSeek) handleScrub(e);
        }, { passive: true });

        window.addEventListener('touchend', () => {
          this.isDraggingSeek = false;
        });
      }

      window.addEventListener('keydown', (e) => {
        if (!this.modal || this.modal.hidden) return;
        if (e.code === 'Space') {
          e.preventDefault();
          this.togglePlayPause();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.seek(Math.min(this.duration, this.currentTime + 3));
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.seek(Math.max(0, this.currentTime - 3));
        } else if (e.key === 'KeyM') {
          this.toggleMute();
        } else if (e.key === 'Escape') {
          this.close();
        }
      });
    }

    open() {
      if (!this.modal) return;
      this.modal.hidden = false;
      document.body.style.overflow = 'hidden';
      this.audio.init();
      this.seek(0);
      this.play();
    }

    close() {
      if (!this.modal) return;
      this.pause();
      this.modal.hidden = true;
      document.body.style.overflow = '';
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    play() {
      this.isPlaying = true;
      this.audio.init();
      if (this.playIcon) this.playIcon.hidden = true;
      if (this.pauseIcon) this.pauseIcon.hidden = false;
      if (this.bigPlayBtn) {
        this.bigPlayBtn.classList.remove('visible');
        this.bigPlayBtn.style.display = 'none';
      }
      this.lastFrameTime = performance.now();
      if (!this.rafId) {
        this.rafId = requestAnimationFrame((t) => this.loop(t));
      }
    }

    pause() {
      this.isPlaying = false;
      if (this.playIcon) this.playIcon.hidden = false;
      if (this.pauseIcon) this.pauseIcon.hidden = true;
      if (this.bigPlayBtn && this.currentTime < 39.5) {
        this.bigPlayBtn.classList.add('visible');
        this.bigPlayBtn.style.display = 'flex';
      }
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    togglePlayPause() {
      if (this.isPlaying) this.pause();
      else this.play();
    }

    toggleMute() {
      const newMuted = !this.audio.isMuted;
      this.audio.setMuted(newMuted);
      if (this.volOnIcon) this.volOnIcon.hidden = newMuted;
      if (this.volOffIcon) this.volOffIcon.hidden = !newMuted;
    }

    seek(time) {
      this.currentTime = Math.max(0, Math.min(this.duration, time));
      this.updateUI();
      this.render(this.currentTime);
    }

    loop(timestamp) {
      if (!this.isPlaying) return;
      const delta = (timestamp - this.lastFrameTime) / 1000;
      this.lastFrameTime = timestamp;

      this.currentTime += delta;
      if (this.currentTime >= this.duration) {
        this.currentTime = this.duration;
        this.pause();
      }

      this.audio.updateSyncAudio(this.currentTime);
      this.updateUI();
      this.render(this.currentTime);

      if (this.isPlaying) {
        this.rafId = requestAnimationFrame((t) => this.loop(t));
      }
    }

    updateUI() {
      const pct = (this.currentTime / this.duration) * 100;
      if (this.timelineFill) this.timelineFill.style.width = `${pct}%`;
      if (this.timelineHandle) this.timelineHandle.style.left = `${pct}%`;
      if (this.timelineTrack) this.timelineTrack.setAttribute('aria-valuenow', Math.floor(this.currentTime));

      const mins = Math.floor(this.currentTime / 60);
      const secs = Math.floor(this.currentTime % 60);
      if (this.timeDisplay) {
        this.timeDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }

      const activeScene = this.scenes.find(s => this.currentTime >= s.start && this.currentTime < s.end) || this.scenes[this.scenes.length - 1];
      if (this.chapterIndicator) this.chapterIndicator.textContent = activeScene.name;
      if (this.sceneTitle) this.sceneTitle.textContent = `Lumi · ${activeScene.title}`;

      const sceneElapsed = this.currentTime - activeScene.start;
      if (this.overlayCard) {
        if (sceneElapsed < 3.8 && activeScene.id < 5) {
          const fade = sceneElapsed < 0.6 ? sceneElapsed / 0.6 : (sceneElapsed > 3.0 ? (3.8 - sceneElapsed) / 0.8 : 1);
          this.overlayCard.style.opacity = fade;
          this.overlayCard.classList.add('visible');
          this.overlayCard.style.display = 'block';
          if (this.overlayTag) this.overlayTag.textContent = activeScene.tag;
          if (this.overlayHeading) this.overlayHeading.textContent = activeScene.title;
          if (this.overlayCaption) this.overlayCaption.textContent = activeScene.caption;
        } else {
          this.overlayCard.classList.remove('visible');
          this.overlayCard.style.display = 'none';
        }
      }

      if (this.welcomeBanner) {
        if (this.currentTime >= 39.5) {
          this.welcomeBanner.classList.add('visible');
          this.welcomeBanner.style.display = 'flex';
          const bannerOpacity = Math.min(1, (this.currentTime - 39.5) / 0.8);
          this.welcomeBanner.style.opacity = bannerOpacity;
        } else {
          this.welcomeBanner.classList.remove('visible');
          this.welcomeBanner.style.display = 'none';
          this.welcomeBanner.style.opacity = 0;
        }
      }

      if (this.bigPlayBtn) {
        if (!this.isPlaying && this.currentTime < 39.5) {
          this.bigPlayBtn.classList.add('visible');
          this.bigPlayBtn.style.display = 'flex';
        } else {
          this.bigPlayBtn.classList.remove('visible');
          this.bigPlayBtn.style.display = 'none';
        }
      }
    }

    render(t) {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const W = 1280;
      const H = 720;

      ctx.save();
      ctx.clearRect(0, 0, W, H);

      if (t < 8.0) {
        this.renderScene1(ctx, t, W, H);
      } else if (t < 17.0) {
        this.renderScene2(ctx, t - 8.0, W, H);
      } else if (t < 27.0) {
        this.renderScene3(ctx, t - 17.0, W, H);
      } else if (t < 37.0) {
        this.renderScene4(ctx, t - 27.0, W, H);
      } else {
        this.renderScene5(ctx, t - 37.0, W, H);
      }

      ctx.restore();
    }

    // SCENE 1 (0–8s): Galaxy Awakening
    // Dark purple galaxy slowly appears. Tiny stars twinkle. Lumi wakes up, blinks, tilts her head, and notices a tiny golden star floating toward her.
    renderScene1(ctx, t, W, H) {
      const p = t / 8.0;

      // Dark purple galaxy gradient background
      const galGrad = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, 600);
      galGrad.addColorStop(0, '#2d144d');
      galGrad.addColorStop(0.5, '#160a2b');
      galGrad.addColorStop(1, '#080314');
      ctx.fillStyle = galGrad;
      ctx.fillRect(0, 0, W, H);

      // Twinkling stars field
      this.stars.forEach(s => {
        const twinkle = 0.4 + Math.sin(t * s.twinkleSpeed * 100 + s.x) * 0.6;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Lumi Awakening in center (with head tilt & eye blink animation)
      const img = this.images.sparkAwake;
      ctx.save();

      // Head tilt animation: tilts at 3.5s as she wakes up
      let headTilt = 0;
      if (t > 3.0) {
        headTilt = Math.sin((t - 3.0) * 1.5) * 0.07;
      }
      const breathe = Math.sin(t * 2.2) * 6;

      ctx.translate(W / 2, H / 2 + breathe);
      ctx.rotate(headTilt);
      ctx.translate(-W / 2, -(H / 2 + breathe));

      if (img && img.complete) {
        const imgAlpha = Math.min(1, Math.max(0, t / 2.0));
        ctx.globalAlpha = imgAlpha;
        ctx.drawImage(img, 0, 0, W, H);
        ctx.globalAlpha = 1.0;
      }

      // Eyelid Blinking Animation (blinks at 2.5s, 4.2s, 6.5s)
      let eyeOpen = 1.0;
      if (t < 2.0) eyeOpen = 0.1; // sleeping initially
      else if (t >= 2.0 && t < 2.4) eyeOpen = (t - 2.0) / 0.4;
      else if (t >= 4.0 && t < 4.3) eyeOpen = 0.2; // cute blink
      else if (t >= 6.2 && t < 6.5) eyeOpen = 0.25; // second blink

      if (eyeOpen < 0.9) {
        ctx.fillStyle = '#fce7f3';
        ctx.beginPath();
        ctx.ellipse(625, 435 + (1 - eyeOpen) * 6, 12, 10 * (1 - eyeOpen), 0, 0, Math.PI * 2);
        ctx.ellipse(655, 435 + (1 - eyeOpen) * 6, 12, 10 * (1 - eyeOpen), 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Golden Star floating toward Lumi from upper right (noticed at 4.5s)
      if (t > 3.8) {
        const starP = Math.min(1, (t - 3.8) / 4.2);
        const starX = 1100 - starP * 460 + Math.sin(t * 3) * 20;
        const starY = 120 + starP * 240 + Math.cos(t * 3) * 15;
        this.drawSmilingStarCompanion(ctx, starX, starY, 24, t);

        // Little stardust trail
        this.spiralParticles.push({
          x: starX + (Math.random() - 0.5) * 12,
          y: starY + (Math.random() - 0.5) * 12,
          size: Math.random() * 3 + 1,
          alpha: 0.9,
          color: '#fcd34d'
        });
      }

      this.updateAndDrawParticles(ctx, this.spiralParticles, 0.025);
      this.drawCinematicVignette(ctx, W, H);
    }

    // SCENE 2 (8–17s): Starlight Dance & Reaching
    // Golden star circles Lumi. Lumi reaches toward it. Magical particles spiral around her, and background transitions into dream world.
    renderScene2(ctx, t, W, H) {
      const p = t / 9.0;
      const worldBg = this.images.dreamWorldBg;
      const lumiFly = this.images.lumiFly;

      // Background transition from purple galaxy into beautiful dream world
      const bgAlpha = Math.min(1, p * 1.2);
      ctx.fillStyle = '#110927';
      ctx.fillRect(0, 0, W, H);

      if (worldBg && worldBg.complete) {
        ctx.save();
        ctx.globalAlpha = bgAlpha;
        ctx.drawImage(worldBg, 0, 0, W, H);
        ctx.restore();
      }

      // Parallax drifting stars
      this.stars.forEach(s => {
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha * (1 - bgAlpha * 0.5);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Lumi Floating & Reaching toward the star
      const lumiX = W / 2 - 20;
      const lumiY = H / 2 + 10 + Math.sin(t * 2.5) * 12;
      const reachTilt = Math.sin(t * 1.8) * 0.06;

      ctx.save();
      ctx.translate(lumiX, lumiY);
      ctx.rotate(reachTilt);

      if (lumiFly && lumiFly.complete) {
        ctx.drawImage(lumiFly, -W / 2 + 20, -H / 2 - 10, W, H);
      }
      ctx.restore();

      // Golden Star circling Lumi in 3D-like elliptical orbit
      const circleAngle = t * 3.5;
      const starRadiusX = 170;
      const starRadiusY = 70;
      const starX = lumiX + Math.cos(circleAngle) * starRadiusX;
      const starY = lumiY + Math.sin(circleAngle) * starRadiusY - 20;

      // Double-Helix Spiral Magical Particles
      for (let k = 0; k < 2; k++) {
        const spiralAngle = t * 4.0 + k * Math.PI;
        this.spiralParticles.push({
          x: lumiX + Math.cos(spiralAngle) * (140 - p * 30),
          y: lumiY + Math.sin(spiralAngle) * (90 - p * 20),
          size: Math.random() * 3.5 + 1.2,
          alpha: 1.0,
          color: k === 0 ? '#fcd34d' : '#38bdf8'
        });
      }

      this.updateAndDrawParticles(ctx, this.spiralParticles, 0.03);
      this.drawSmilingStarCompanion(ctx, starX, starY, 26, t);
      this.drawCinematicVignette(ctx, W, H);
    }

    // SCENE 3 (17–27s): The Glowing Portal & Parallax Flight
    // A glowing portal opens. Lumi flies toward it, her hair and cloak moving naturally. Floating islands, clouds, and stars move at different depths.
    renderScene3(ctx, t, W, H) {
      const p = t / 10.0;
      const portalImg = this.images.portal;

      ctx.fillStyle = '#06081c';
      ctx.fillRect(0, 0, W, H);

      // Depth Layer 1 (Slow Parallax 0.25x): Far cosmos & nebula
      this.stars.forEach(s => {
        const px = (s.x - t * 15) % W;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha * 0.7;
        ctx.beginPath();
        ctx.arc(px < 0 ? px + W : px, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Depth Layer 2 (Mid Parallax 0.65x): Ancient Portal & Floating Islands
      const portalZoom = 1.0 + p * 0.12;
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.scale(portalZoom, portalZoom);
      ctx.translate(-W / 2, -H / 2);

      if (portalImg && portalImg.complete) {
        ctx.drawImage(portalImg, 0, 0, W, H);
      }

      // Active Rotating Hyperspace Vortex inside the portal arch (x: 640, y: 355)
      const vortexX = W / 2;
      const vortexY = 355;
      ctx.save();
      ctx.translate(vortexX, vortexY);
      ctx.rotate(t * 2.2);

      for (let r = 0; r < 4; r++) {
        const rad = 45 + r * 30;
        ctx.strokeStyle = r % 2 === 0 ? 'rgba(56, 189, 248, 0.65)' : 'rgba(168, 85, 247, 0.55)';
        ctx.lineWidth = 14 + r * 4;
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 1.5);
        ctx.stroke();
      }
      ctx.restore();
      ctx.restore();

      // Depth Layer 3 (Foreground Fast Parallax 1.4x): Lumi Flying Toward Portal
      // Hair and cloak fluttering naturally with undulating motion
      const lumiProgress = Math.min(1, p * 1.15);
      const lumiX = 300 + lumiProgress * 320;
      const lumiY = 480 - lumiProgress * 110 + Math.sin(t * 3.5) * 14;
      const flightScale = 0.85 - lumiProgress * 0.25;

      ctx.save();
      ctx.translate(lumiX, lumiY);
      ctx.scale(flightScale, flightScale);
      ctx.rotate(Math.sin(t * 3.0) * 0.08);

      // Star companion flying alongside Lumi
      this.drawSmilingStarCompanion(ctx, -70, -35, 24, t);

      // Flying Starlight Ribbon Particles behind cloak
      this.spiralParticles.push({
        x: lumiX - 40 * flightScale,
        y: lumiY + 15 * flightScale,
        size: Math.random() * 3 + 1.5,
        alpha: 0.9,
        color: ['#fcd34d', '#38bdf8', '#c084fc'][Math.floor(Math.random() * 3)]
      });

      ctx.restore();
      this.updateAndDrawParticles(ctx, this.spiralParticles, 0.03);
      this.drawCinematicVignette(ctx, W, H);
    }

    // SCENE 4 (27–37s): The Kindness Wave
    // Dream world begins losing light. Lumi looks worried, hugs star companion. A wave of golden and violet light spreads, restoring stars.
    renderScene4(ctx, t, W, H) {
      const p = t / 10.0;
      const portrait = this.images.lumiPortrait;

      ctx.save();

      if (t < 5.5) {
        // Part A (27s - 32.5s): World dims, Lumi looks worried & hugs star companion close
        const dimP = Math.min(1, t / 4.0);
        const zoom = 1.06 + t * 0.01;

        ctx.translate(W / 2, H / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-W / 2, -H / 2);

        if (portrait && portrait.complete) {
          ctx.drawImage(portrait, 0, 0, W, H);
        }

        // Shadows creeping & dimming overlay
        ctx.fillStyle = `rgba(11, 8, 28, ${dimP * 0.55})`;
        ctx.fillRect(0, 0, W, H);

        // Starlight inside Lumi's chest starts to swell and glow with heartbeat
        const heartPulse = Math.sin(t * 8) * 0.5 + 0.5;
        const heartGrad = ctx.createRadialGradient(640, 480, 5, 640, 480, 140);
        heartGrad.addColorStop(0, `rgba(252, 211, 77, ${0.3 + heartPulse * 0.5})`);
        heartGrad.addColorStop(0.6, `rgba(168, 85, 247, ${0.15 + heartPulse * 0.3})`);
        heartGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = heartGrad;
        ctx.beginPath();
        ctx.arc(640, 480, 140, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Part B (32.5s - 37s): COLOSSAL WAVE OF GOLDEN & VIOLET LIGHT RESTORING THE WORLD!
        const waveP = (t - 5.5) / 4.5;

        if (portrait && portrait.complete) {
          ctx.drawImage(portrait, 0, 0, W, H);
        }

        // Expanding radial shockwave wave of golden, pink, and violet light
        const waveRadius = waveP * 1100;
        const rings = [
          { color: '#fcd34d', offset: 0, width: 32 },
          { color: '#ec4899', offset: 45, width: 24 },
          { color: '#a855f7', offset: 90, width: 20 },
          { color: '#38bdf8', offset: 130, width: 14 }
        ];

        rings.forEach(ring => {
          const r = Math.max(0, waveRadius - ring.offset);
          if (r > 0 && r < 1200) {
            ctx.save();
            ctx.strokeStyle = ring.color;
            ctx.shadowColor = ring.color;
            ctx.shadowBlur = 35;
            ctx.lineWidth = ring.width * (1.0 - waveP * 0.5);
            ctx.globalAlpha = Math.max(0, 1.0 - waveP * 0.65);
            ctx.beginPath();
            ctx.arc(640, 450, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }
        });

        // Restoring and sparkling constellation particles
        this.climaxSparkles.forEach(pt => {
          pt.y += pt.speedY * 2.2;
          pt.x += pt.speedX * 1.4;
          if (pt.y < 0) pt.y = H;
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.alpha * (0.7 + Math.sin(t * 6 + pt.x) * 0.3);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // Warm golden wash restoring vibrancy
        const washAlpha = Math.max(0, 0.4 - waveP * 0.4);
        ctx.fillStyle = `rgba(254, 215, 170, ${washAlpha})`;
        ctx.fillRect(0, 0, W, H);
      }

      ctx.restore();
      this.drawCinematicVignette(ctx, W, H);
    }

    // SCENE 5 (37–45s): Every Dream Matters
    // World glows beautifully. Lumi & companion float beneath magical tree. Lumi smiles & waves at viewer.
    renderScene5(ctx, t, W, H) {
      const p = t / 8.0;
      const treeBg = this.images.dreamTree;
      const lumiPortrait = this.images.lumiPortrait;

      ctx.save();

      // Shot A (37s - 40.5s): Restored glowing Dream Tree
      if (t < 3.5) {
        const shotP = t / 3.5;
        const panX = -15 + shotP * 30;
        const zoom = 1.04 - shotP * 0.03;

        ctx.translate(W / 2 + panX, H / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-W / 2, -H / 2);

        if (treeBg && treeBg.complete) {
          ctx.drawImage(treeBg, 0, 0, W, H);
        }

        // Restored Bioluminescent Golden Glow
        const lanternGlow = 0.7 + Math.sin(t * 3) * 0.3;
        const glowGrad = ctx.createRadialGradient(W / 2, H * 0.4, 40, W / 2, H * 0.4, 480);
        glowGrad.addColorStop(0, `rgba(252, 211, 77, ${0.28 * lanternGlow})`);
        glowGrad.addColorStop(0.5, `rgba(168, 85, 247, ${0.15 * lanternGlow})`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, W, H);
      } else {
        // Shot B (40.5s - 45s): Lumi smiling & waving warmly toward the camera!
        const closeP = (t - 3.5) / 4.5;
        const zoom = 1.08 + closeP * 0.05;
        const panY = Math.sin(t * 2.0) * 5;

        ctx.translate(W / 2, H / 2 + panY);
        ctx.scale(zoom, zoom);
        ctx.translate(-W / 2, -H / 2);

        if (lumiPortrait && lumiPortrait.complete) {
          ctx.drawImage(lumiPortrait, 0, 0, W, H);
        }

        if (t < 4.2) {
          const blendOut = 1.0 - (t - 3.5) / 0.7;
          ctx.save();
          ctx.globalAlpha = blendOut;
          if (treeBg && treeBg.complete) ctx.drawImage(treeBg, 0, 0, W, H);
          ctx.restore();
        }

        // Loving eye twinkle
        const glint = Math.max(0, Math.sin(t * 3.0));
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = glint * 0.8;
        ctx.beginPath();
        ctx.arc(580, 360, 4.5, 0, Math.PI * 2);
        ctx.arc(680, 360, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Friendly wave sparkles around Lumi's hand
        const waveX = 690 + Math.sin(t * 6) * 12;
        const waveY = 480 + Math.cos(t * 6) * 8;
        ctx.fillStyle = '#fcd34d';
        ctx.shadowColor = '#fcd34d';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(waveX, waveY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Drifting Starlight Petals
      this.treePetals.forEach(pt => {
        pt.y += 0.85;
        pt.x += Math.sin(t * 1.8 + pt.y * 0.02) * 1.0;
        if (pt.y > H) pt.y = 0;
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.alpha * (0.6 + Math.sin(t * 2 + pt.x) * 0.4);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      ctx.restore();
      this.drawCinematicVignette(ctx, W, H);
    }

    // Helper: Particle update & draw
    updateAndDrawParticles(ctx, arr, decay) {
      for (let i = arr.length - 1; i >= 0; i--) {
        const pt = arr[i];
        pt.alpha -= decay;
        if (pt.alpha <= 0) {
          arr.splice(i, 1);
          continue;
        }
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.alpha;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
    }

    drawSmilingStarCompanion(ctx, x, y, radius, t) {
      ctx.save();
      const glowGrad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 2.5);
      glowGrad.addColorStop(0, 'rgba(252, 211, 77, 0.85)');
      glowGrad.addColorStop(0.6, 'rgba(236, 72, 153, 0.25)');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      this.drawStarShape(ctx, x, y, 5, radius, radius * 0.5, Math.sin(t * 3) * 0.2, '#fde047', '#fed7aa');

      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(x - 5, y - 2, 2.2, 0, Math.PI * 2);
      ctx.arc(x + 5, y - 2, 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x, y + 1, 4.5, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();

      ctx.fillStyle = 'rgba(244, 114, 182, 0.6)';
      ctx.beginPath();
      ctx.arc(x - 8, y + 2, 2.5, 0, Math.PI * 2);
      ctx.arc(x + 8, y + 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    drawStarShape(ctx, cx, cy, spikes, outerRadius, innerRadius, rot, fillCol, strokeCol) {
      let rotAngle = (Math.PI / 2) * 3 + rot;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rotAngle) * outerRadius;
        y = cy + Math.sin(rotAngle) * outerRadius;
        ctx.lineTo(x, y);
        rotAngle += step;

        x = cx + Math.cos(rotAngle) * innerRadius;
        y = cy + Math.sin(rotAngle) * innerRadius;
        ctx.lineTo(x, y);
        rotAngle += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fillStyle = fillCol;
      ctx.fill();
      if (strokeCol) {
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    drawCinematicVignette(ctx, W, H) {
      const grad = ctx.createRadialGradient(W / 2, H / 2, W * 0.35, W / 2, H / 2, W * 0.62);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(3, 4, 14, 0.7)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }
  }

  // --- INITIALIZATION ---
  function initLumiCinematic() {
    if (!window.LumiCinematic) {
      window.LumiCinematic = new LumiCinematicPlayer();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLumiCinematic);
  } else {
    initLumiCinematic();
  }
})();
