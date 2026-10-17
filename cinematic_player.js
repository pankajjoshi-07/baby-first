/**
 * LUMI CINEMATIC INTRO: "EVERY DREAM MATTERS"
 * 60 FPS HTML5 Canvas Animation Engine & Interactive Video Player
 * 
 * Title: LUMI — EVERY DREAM MATTERS
 * Duration: 55.0 Seconds (5 Scenes x 11.0 Seconds)
 * 
 * Story:
 * 1. A Quiet Wish (0-11s): Cozy bedroom at night; a dreamer's wish turns into a glowing golden star.
 * 2. Lumi Is Born (11-22s): Golden star becomes Lumi; meets smiling star companion; flight into dream universe.
 * 3. The Lost Dream (22-33s): Lumi guides a lost dream to the Dream Machine; a purple storm strikes and steals light.
 * 4. The Magic of Kindness (33-44s): Lumi's inner kindness starlight awakens; colossal radiant shockwave breaks the storm.
 * 5. Every Dream Matters (44-55s): Islands glow again; Lumi hugs star companion beneath giant Dream Tree; "Lumi — The Dream Architect".
 */

(function () {
  'use strict';

  // --- 1. PROCEDURAL CINEMATIC AUDIO ENGINE (WEB AUDIO API) ---
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
          this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.32, this.ctx.currentTime);
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
        this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.32, this.ctx.currentTime, 0.05);
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

    playStormRumble() {
      if (!this.ctx || this.isMuted) return;
      try {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(55, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 1.2);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 1.2);
      } catch (e) {}
    }

    playShockwaveBlast() {
      if (!this.ctx || this.isMuted) return;
      const majorChord = ['C4', 'G4', 'C5', 'E5', 'G5', 'C6'];
      majorChord.forEach((note, idx) => {
        setTimeout(() => this.playChime(note, 2.5, 0.24), idx * 40);
      });
      ['E6', 'G6', 'C6', 'G5'].forEach((note, idx) => {
        setTimeout(() => this.playChime(note, 1.2, 0.15), 300 + idx * 90);
      });
    }

    updateSyncAudio(t) {
      if (!this.ctx || this.isMuted) return;
      const beat = Math.floor(t * 2); // 120 bpm half-beat grid
      if (beat === this.lastBeat) return;
      this.lastBeat = beat;

      // Scene 1: A Quiet Wish (0-11s) - Soft music box celesta lullaby
      if (t < 11.0) {
        if (beat % 2 === 0) {
          const lullabyNotes = ['C4', 'E4', 'G4', 'C5', 'B4', 'G4', 'E4', 'D4', 'C4', 'G4', 'C5', 'E5'];
          const n = lullabyNotes[(beat / 2) % lullabyNotes.length];
          this.playChime(n, 1.1, 0.18);
        }
        if (beat === 15) {
          ['C5', 'E5', 'G5', 'C6'].forEach((n, i) => setTimeout(() => this.playChime(n, 0.9, 0.2), i * 110));
        }
      }
      // Scene 2: Lumi Is Born (11-22s) - Whimsical flight arpeggios
      else if (t < 22.0) {
        const flightMelody = ['F4', 'A4', 'C5', 'F5', 'G5', 'E5', 'C5', 'G4'];
        this.playChime(flightMelody[beat % flightMelody.length], 0.6, 0.16);
        if (beat % 8 === 0) {
          this.playTone(this.notesMap['F2'], 2.0, 'sine', 0.2);
        }
      }
      // Scene 3: The Lost Dream & The Storm (22-33s) - Minor tension & storm rumble
      else if (t < 33.0) {
        if (t < 26.0) {
          const curiousNotes = ['D4', 'F4', 'A4', 'C5', 'Bb4'];
          this.playChime(curiousNotes[beat % curiousNotes.length], 0.7, 0.15);
        } else {
          if (beat % 4 === 0) {
            this.playStormRumble();
            this.playTone(this.notesMap['D2'], 1.4, 'sawtooth', 0.12);
          }
          if (beat % 2 === 1) {
            const stormNotes = ['Ab3', 'D4', 'F4', 'Ab4'];
            this.playTone(this.notesMap[stormNotes[beat % stormNotes.length]], 0.4, 'triangle', 0.14);
          }
        }
      }
      // Scene 4: The Magic of Kindness (33-44s) - Emotional heartbeat into radiant blast
      else if (t < 44.0) {
        if (t < 37.5) {
          if (beat % 2 === 0) {
            this.playTone(this.notesMap['C3'], 0.5, 'sine', 0.22);
            setTimeout(() => this.playChime('C5', 0.6, 0.14), 160);
          }
        } else if (beat === 75) {
          this.playShockwaveBlast();
        } else {
          const joyfulArp = ['C5', 'E5', 'G5', 'C6', 'G5', 'E5'];
          this.playChime(joyfulArp[beat % joyfulArp.length], 0.8, 0.2);
        }
      }
      // Scene 5: Every Dream Matters (44-55s) - Peaceful celestial lullaby resolution
      else {
        if (beat % 2 === 0) {
          const peaceMelody = ['G5', 'E5', 'C5', 'D5', 'E5', 'G5', 'C6', 'G5'];
          this.playChime(peaceMelody[(beat / 2) % peaceMelody.length], 1.4, 0.19);
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
      this.duration = 55.0; // 55.0-second complete animated short
      this.currentTime = 0.0;
      this.isPlaying = false;
      this.lastFrameTime = 0;
      this.rafId = null;

      // Audio Engine
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

      // Asset Preloads
      this.images = {
        bedroomWish: this.loadImage('assets/proj2_lantern_hd.jpg'),
        sparkAwake: this.loadImage('assets/journey1_spark_hd.jpg'),
        lumiFly: this.loadImage('assets/journey4_architect_hd.jpg'),
        dreamMachine: this.loadImage('assets/journey3_machine_hd.jpg'),
        kindnessClimax: this.loadImage('assets/about_photo_hd.jpg'),
        dreamTree: this.loadImage('assets/proj3_garden_hd.jpg')
      };

      // Procedural Particle Systems
      this.roomDust = this.createParticles(70, { xRange: 1280, yRange: 720, speed: 0.25, size: 2.2, colors: ['#fcd34d', '#fed7aa', '#ffffff'] });
      this.flightTrail = [];
      this.stormTendrils = this.createStormTendrils(30);
      this.climaxSparkles = this.createParticles(160, { xRange: 1280, yRange: 720, speed: 1.8, size: 3.5, colors: ['#fcd34d', '#ec4899', '#a855f7', '#38bdf8', '#ffffff'] });
      this.treePetals = this.createParticles(90, { xRange: 1280, yRange: 720, speed: 0.5, size: 2.8, colors: ['#fcd34d', '#f472b6', '#c084fc', '#ffffff'] });

      // 5 Coherent Story Scenes
      this.scenes = [
        {
          start: 0.0,
          end: 11.0,
          id: 1,
          name: "Scene 1: A Quiet Wish",
          title: "A Quiet Wish",
          tag: "🌙 Scene 1 of 5 · The Bedroom Window",
          caption: "In a cozy bedroom at night, a little dreamer wishes that nobody with a dream should ever feel alone. The wish transforms into a glowing golden star."
        },
        {
          start: 11.0,
          end: 22.0,
          id: 2,
          name: "Scene 2: Lumi Is Born",
          title: "Lumi Is Born",
          tag: "✨ Scene 2 of 5 · A Wizard of Starlight",
          caption: "The star awakens as Lumi, a tiny lavender-haired wizard with a starry purple cloak. Joined by a cheerful star companion, they fly into the dream universe."
        },
        {
          start: 22.0,
          end: 33.0,
          id: 3,
          name: "Scene 3: The Lost Dream",
          title: "The Lost Dream & The Storm",
          tag: "⛈ Scene 3 of 5 · Shadows Over the Sky",
          caption: "Lumi helps a tiny lost dream find its way home. Suddenly, an ancient purple storm gathers, stealing the light from the entire dream world."
        },
        {
          start: 33.0,
          end: 44.0,
          id: 4,
          name: "Scene 4: The Magic of Kindness",
          title: "The Magic of Kindness",
          tag: "💖 Scene 4 of 5 · The Radiant Light Within",
          caption: "Lumi discovers that every dream she ever helped left a little light inside her. Together with her star, they release a radiant wave of light that restores the world!"
        },
        {
          start: 44.0,
          end: 55.0,
          id: 5,
          name: "Scene 5: Every Dream Matters",
          title: "Every Dream Matters",
          tag: "🌟 Scene 5 of 5 · The Grand Finale",
          caption: "The islands glow again. Beneath the giant magical Dream Tree, Lumi hugs her star companion and smiles: Even the smallest dream can light up the universe."
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

    createStormTendrils(count) {
      const arr = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * 1280,
          y: Math.random() * 400,
          len: Math.random() * 120 + 40,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.05 + 0.02,
          alpha: Math.random() * 0.6 + 0.2
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

      if (this.skipBtn) {
        this.skipBtn.addEventListener('click', () => {
          if (this.currentTime < 48.5) {
            this.seek(48.5);
            this.play();
          } else {
            this.close();
            const proj = document.getElementById('projects');
            if (proj) proj.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
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
      if (this.bigPlayBtn && this.currentTime < 48.5) {
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
        if (sceneElapsed < 4.0 && activeScene.id < 5) {
          const fade = sceneElapsed < 0.6 ? sceneElapsed / 0.6 : (sceneElapsed > 3.2 ? (4.0 - sceneElapsed) / 0.8 : 1);
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
        if (this.currentTime >= 48.5) {
          this.welcomeBanner.classList.add('visible');
          this.welcomeBanner.style.display = 'flex';
          const bannerOpacity = Math.min(1, (this.currentTime - 48.5) / 0.8);
          this.welcomeBanner.style.opacity = bannerOpacity;
        } else {
          this.welcomeBanner.classList.remove('visible');
          this.welcomeBanner.style.display = 'none';
          this.welcomeBanner.style.opacity = 0;
        }
      }

      if (this.bigPlayBtn) {
        if (!this.isPlaying && this.currentTime < 48.5) {
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

      if (t < 11.0) {
        this.renderScene1(ctx, t, W, H);
      } else if (t < 22.0) {
        this.renderScene2(ctx, t - 11.0, W, H);
      } else if (t < 33.0) {
        this.renderScene3(ctx, t - 22.0, W, H);
      } else if (t < 44.0) {
        this.renderScene4(ctx, t - 33.0, W, H);
      } else {
        this.renderScene5(ctx, t - 44.0, W, H);
      }

      ctx.restore();
    }

    // SCENE 1: A QUIET WISH (0.0s – 11.0s)
    renderScene1(ctx, t, W, H) {
      const p = t / 11.0;
      const img = this.images.bedroomWish;

      const zoom = 1.15 - p * 0.12;
      const panX = -20 + p * 40;
      const panY = 10 - p * 25;

      ctx.save();
      ctx.translate(W / 2 + panX, H / 2 + panY);
      ctx.scale(zoom, zoom);
      ctx.translate(-W / 2, -H / 2);

      if (img && img.complete) {
        ctx.drawImage(img, 0, 0, W, H);
      } else {
        ctx.fillStyle = '#0a0d24';
        ctx.fillRect(0, 0, W, H);
      }

      const ambGrad = ctx.createRadialGradient(680, 360, 40, 680, 360, 480);
      ambGrad.addColorStop(0, 'rgba(254, 215, 170, 0.18)');
      ambGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
      ambGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      ctx.fillStyle = ambGrad;
      ctx.fillRect(0, 0, W, H);

      this.roomDust.forEach(pt => {
        pt.y += pt.speedY;
        pt.x += pt.speedX;
        if (pt.y < 0) pt.y = H;
        if (pt.x < 0) pt.x = W;
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.alpha * (0.6 + Math.sin(t * 2 + pt.x) * 0.4);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      let starX = 680;
      let starY = 390;
      let starScale = 1.0;
      let starGlow = 0.5 + Math.sin(t * 3.5) * 0.3;

      if (t > 4.5) {
        const riseProgress = Math.min(1, (t - 4.5) / 6.0);
        const easeRise = Math.pow(riseProgress, 1.4);
        starX = 680 + Math.sin(easeRise * Math.PI * 2) * 45 + easeRise * 40;
        starY = 390 - easeRise * 240;
        starScale = 1.0 + easeRise * 0.8;
        starGlow = 0.8 + Math.sin(t * 6) * 0.4;

        if (Math.random() < 0.6) {
          this.flightTrail.push({
            x: starX + (Math.random() - 0.5) * 20,
            y: starY + (Math.random() - 0.5) * 20,
            size: Math.random() * 3 + 1,
            alpha: 1.0,
            life: 1.0,
            color: ['#fcd34d', '#fed7aa', '#ffffff'][Math.floor(Math.random() * 3)]
          });
        }
      }

      for (let i = this.flightTrail.length - 1; i >= 0; i--) {
        const sp = this.flightTrail[i];
        sp.y += 0.8;
        sp.alpha -= 0.02;
        if (sp.alpha <= 0) {
          this.flightTrail.splice(i, 1);
          continue;
        }
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      this.drawStarWish(ctx, starX, starY, 32 * starScale, starGlow, t);

      ctx.restore();
      this.drawCinematicVignette(ctx, W, H);
    }

    // SCENE 2: LUMI IS BORN & FLIGHT (11.0s – 22.0s)
    renderScene2(ctx, t, W, H) {
      if (t < 5.0) {
        const subP = t / 5.0;
        const img = this.images.sparkAwake;
        const zoom = 1.05 + subP * 0.08;

        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-W / 2, -H / 2);

        if (img && img.complete) {
          ctx.drawImage(img, 0, 0, W, H);
        }

        const ringGrad = ctx.createRadialGradient(W / 2, H / 2 - 20, 60, W / 2, H / 2 - 20, 280);
        ringGrad.addColorStop(0, 'rgba(252, 211, 77, 0.25)');
        ringGrad.addColorStop(0.4, 'rgba(168, 85, 247, 0.2)');
        ringGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = ringGrad;
        ctx.fillRect(0, 0, W, H);

        const eyeSparkleAlpha = Math.max(0, Math.sin(t * 3));
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = eyeSparkleAlpha * 0.8;
        ctx.beginPath();
        ctx.arc(625, 435, 4, 0, Math.PI * 2);
        ctx.arc(655, 435, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        ctx.restore();
      } else {
        const flyP = (t - 5.0) / 6.0;
        const bg = this.images.lumiFly;

        ctx.save();
        const panX = -40 + flyP * 80;
        const panY = Math.sin(t * 1.8) * 15;

        ctx.translate(panX, panY);

        if (bg && bg.complete) {
          ctx.drawImage(bg, 0, 0, W, H);
        }

        const lumiX = 520;
        const lumiY = 360 + Math.sin(t * 2.5) * 14;

        const orbitAngle = t * 3.2;
        const compX = lumiX + Math.cos(orbitAngle) * 140;
        const compY = lumiY + Math.sin(orbitAngle) * 60 - 30;

        this.flightTrail.push({
          x: compX,
          y: compY,
          size: Math.random() * 3 + 1.2,
          alpha: 0.9,
          color: ['#fcd34d', '#fed7aa', '#38bdf8'][Math.floor(Math.random() * 3)]
        });

        for (let i = this.flightTrail.length - 1; i >= 0; i--) {
          const sp = this.flightTrail[i];
          sp.x -= 3.0;
          sp.alpha -= 0.025;
          if (sp.alpha <= 0) {
            this.flightTrail.splice(i, 1);
            continue;
          }
          ctx.fillStyle = sp.color;
          ctx.globalAlpha = sp.alpha;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        this.drawSmilingStarCompanion(ctx, compX, compY, 26, t);

        ctx.restore();
      }

      this.drawCinematicVignette(ctx, W, H);
    }

    // SCENE 3: THE LOST DREAM & THE PURPLE STORM (22.0s – 33.0s)
    renderScene3(ctx, t, W, H) {
      const img = this.images.dreamMachine;

      ctx.save();

      let shakeX = 0;
      let shakeY = 0;
      if (t > 4.5) {
        const lightningCycle = (t - 4.5) % 2.2;
        if (lightningCycle < 0.18) {
          shakeX = (Math.random() - 0.5) * 12;
          shakeY = (Math.random() - 0.5) * 10;
        }
      }
      ctx.translate(shakeX, shakeY);

      if (img && img.complete) {
        ctx.drawImage(img, 0, 0, W, H);
      }

      if (t < 4.5) {
        const guideP = t / 4.5;
        const dreamOrbX = 760 - guideP * 280;
        const dreamOrbY = 240 + Math.sin(t * 3) * 20 + guideP * 140;

        for (let i = 0; i < 8; i++) {
          const bx = 380 + Math.sin(t * 2 + i) * 30 + i * 25;
          const by = 260 - ((t * 80 + i * 45) % 260);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillStyle = 'rgba(252, 211, 77, 0.2)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(bx, by, 10 + i * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        const orbGrad = ctx.createRadialGradient(dreamOrbX, dreamOrbY, 2, dreamOrbX, dreamOrbY, 28);
        orbGrad.addColorStop(0, '#ffffff');
        orbGrad.addColorStop(0.3, '#38bdf8');
        orbGrad.addColorStop(0.7, 'rgba(236, 72, 153, 0.5)');
        orbGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(dreamOrbX, dreamOrbY, 28, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const stormP = (t - 4.5) / 6.5;

        ctx.fillStyle = `rgba(10, 6, 28, ${Math.min(0.72, stormP * 0.8)})`;
        ctx.fillRect(0, 0, W, H);

        const vortexX = 640;
        const vortexY = 160;
        ctx.save();
        ctx.translate(vortexX, vortexY);
        ctx.rotate(t * 1.5);

        for (let r = 0; r < 5; r++) {
          const vortexRadius = 60 + r * 45;
          ctx.strokeStyle = r % 2 === 0 ? 'rgba(147, 51, 234, 0.5)' : 'rgba(219, 39, 119, 0.4)';
          ctx.lineWidth = 12 + r * 6;
          ctx.beginPath();
          ctx.arc(0, 0, vortexRadius, 0, Math.PI * 1.6);
          ctx.stroke();
        }
        ctx.restore();

        const lightningCycle = (t - 4.5) % 2.2;
        if (lightningCycle < 0.18) {
          ctx.strokeStyle = '#fbcfe8';
          ctx.shadowColor = '#d946ef';
          ctx.shadowBlur = 25;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(vortexX, vortexY);
          ctx.lineTo(580, 260);
          ctx.lineTo(620, 340);
          ctx.lineTo(530, 480);
          ctx.stroke();

          ctx.fillStyle = 'rgba(192, 132, 252, 0.28)';
          ctx.fillRect(0, 0, W, H);
          ctx.shadowBlur = 0;
        }

        this.stormTendrils.forEach(td => {
          td.angle += td.speed;
          const tx = td.x + Math.cos(td.angle) * 30;
          const ty = td.y + Math.sin(td.angle) * 20;
          ctx.strokeStyle = 'rgba(88, 28, 135, 0.6)';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.quadraticCurveTo(tx + 20, ty - 30, tx + td.len, ty + 10);
          ctx.stroke();
        });
      }

      ctx.restore();
      this.drawCinematicVignette(ctx, W, H);
    }

    // SCENE 4: THE MAGIC OF KINDNESS (33.0s – 44.0s)
    renderScene4(ctx, t, W, H) {
      const portrait = this.images.kindnessClimax;

      ctx.save();

      if (t < 4.5) {
        const subP = t / 4.5;
        const zoom = 1.08 + subP * 0.12;

        ctx.translate(W / 2, H / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-W / 2, -H / 2);

        if (portrait && portrait.complete) {
          ctx.drawImage(portrait, 0, 0, W, H);
        }

        const pulse = Math.sin(t * 8) * 0.5 + 0.5;
        const heartGrad = ctx.createRadialGradient(640, 480, 10, 640, 480, 160);
        heartGrad.addColorStop(0, `rgba(252, 211, 77, ${0.4 + pulse * 0.4})`);
        heartGrad.addColorStop(0.5, `rgba(236, 72, 153, ${0.2 + pulse * 0.3})`);
        heartGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = heartGrad;
        ctx.beginPath();
        ctx.arc(640, 480, 160, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.8 + pulse * 0.2;
        ctx.beginPath();
        ctx.arc(580, 360, 5, 0, Math.PI * 2);
        ctx.arc(680, 360, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      } else {
        const waveP = (t - 4.5) / 6.5;

        if (portrait && portrait.complete) {
          ctx.drawImage(portrait, 0, 0, W, H);
        }

        const waveRadius = waveP * 950;
        const rings = [
          { color: '#fcd34d', offset: 0, width: 28 },
          { color: '#ec4899', offset: 40, width: 22 },
          { color: '#a855f7', offset: 80, width: 18 },
          { color: '#38bdf8', offset: 120, width: 14 }
        ];

        ctx.save();
        rings.forEach(ring => {
          const r = Math.max(0, waveRadius - ring.offset);
          if (r > 0 && r < 1100) {
            ctx.strokeStyle = ring.color;
            ctx.shadowColor = ring.color;
            ctx.shadowBlur = 30;
            ctx.lineWidth = ring.width * (1.0 - waveP * 0.5);
            ctx.globalAlpha = Math.max(0, 1.0 - waveP * 0.7);
            ctx.beginPath();
            ctx.arc(640, 450, r, 0, Math.PI * 2);
            ctx.stroke();
          }
        });
        ctx.restore();

        this.climaxSparkles.forEach(pt => {
          pt.y += pt.speedY * 2.5;
          pt.x += pt.speedX * 1.5;
          if (pt.y < 0) pt.y = H;
          ctx.fillStyle = pt.color;
          ctx.shadowColor = pt.color;
          ctx.shadowBlur = 10;
          ctx.globalAlpha = pt.alpha * (0.7 + Math.sin(t * 5 + pt.x) * 0.3);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;

        const washAlpha = Math.max(0, 0.45 - waveP * 0.45);
        ctx.fillStyle = `rgba(254, 215, 170, ${washAlpha})`;
        ctx.fillRect(0, 0, W, H);
      }

      ctx.restore();
      this.drawCinematicVignette(ctx, W, H);
    }

    // SCENE 5: EVERY DREAM MATTERS (44.0s – 55.0s)
    renderScene5(ctx, t, W, H) {
      const treeBg = this.images.dreamTree;
      const lumiPortrait = this.images.kindnessClimax;

      ctx.save();

      if (t < 4.5) {
        // Shot A: Wide cinematic sweep of the restored glowing Dream Tree on the floating island
        const shotP = t / 4.5;
        const panX = -20 + shotP * 40;
        const zoom = 1.05 - shotP * 0.04;

        ctx.translate(W / 2 + panX, H / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-W / 2, -H / 2);

        if (treeBg && treeBg.complete) {
          ctx.drawImage(treeBg, 0, 0, W, H);
        }

        const lanternGlow = 0.7 + Math.sin(t * 3) * 0.3;
        const glowGrad = ctx.createRadialGradient(W / 2, H * 0.4, 40, W / 2, H * 0.4, 500);
        glowGrad.addColorStop(0, `rgba(252, 211, 77, ${0.28 * lanternGlow})`);
        glowGrad.addColorStop(0.5, `rgba(168, 85, 247, ${0.16 * lanternGlow})`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, W, H);
      } else {
        // Shot B: Emotional Close-up of Lumi hugging star companion, looking toward camera and smiling!
        const closeP = (t - 4.5) / 6.5;
        const zoom = 1.08 + closeP * 0.06;
        const panY = Math.sin(t * 1.8) * 6;

        ctx.translate(W / 2, H / 2 + panY);
        ctx.scale(zoom, zoom);
        ctx.translate(-W / 2, -H / 2);

        if (lumiPortrait && lumiPortrait.complete) {
          ctx.drawImage(lumiPortrait, 0, 0, W, H);
        }

        if (t < 5.5) {
          const blendOut = 1.0 - (t - 4.5) / 1.0;
          ctx.save();
          ctx.globalAlpha = blendOut;
          if (treeBg && treeBg.complete) ctx.drawImage(treeBg, 0, 0, W, H);
          ctx.restore();
        }

        const haloGrad = ctx.createRadialGradient(W / 2, H * 0.6, 60, W / 2, H * 0.6, 420);
        haloGrad.addColorStop(0, 'rgba(252, 211, 77, 0.28)');
        haloGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.14)');
        haloGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = haloGrad;
        ctx.fillRect(0, 0, W, H);

        const glint = Math.max(0, Math.sin(t * 2.5));
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = glint * 0.75;
        ctx.beginPath();
        ctx.arc(580, 360, 4.5, 0, Math.PI * 2);
        ctx.arc(680, 360, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      this.treePetals.forEach(pt => {
        pt.y += 0.85;
        pt.x += Math.sin(t * 1.6 + pt.y * 0.02) * 1.0;
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

    drawStarWish(ctx, x, y, radius, glow, t) {
      ctx.save();
      const auraGrad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 3.5);
      auraGrad.addColorStop(0, `rgba(252, 211, 77, ${glow * 0.8})`);
      auraGrad.addColorStop(0.5, `rgba(254, 215, 170, ${glow * 0.35})`);
      auraGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(x, y, radius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      this.drawStarShape(ctx, x, y, 5, radius, radius * 0.45, t * 0.8, '#fcd34d', '#ffffff');
      ctx.restore();
    }

    drawSmilingStarCompanion(ctx, x, y, radius, t) {
      ctx.save();
      const glowGrad = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius * 2.5);
      glowGrad.addColorStop(0, 'rgba(252, 211, 77, 0.8)');
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
  document.addEventListener('DOMContentLoaded', () => {
    window.LumiCinematic = new LumiCinematicPlayer();
  });
})();
