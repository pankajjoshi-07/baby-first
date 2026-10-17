/**
 * LUMI CINEMATIC INTRO PLAYER
 * 60 FPS HTML5 Canvas Animation Engine & Interactive Timeline Video Player
 * 
 * Features:
 * - 36-Second 4-Scene Cinematic Character Story
 * - Scene 1 (0-9s): The Awakening in the Dream Nebula
 * - Scene 2 (9-18s): Cosmic Flight with Particle Magical Trail
 * - Scene 3 (18-27s): The Dimensional Celestial Portal Vortex
 * - Scene 4 (27-36s): The Dream Architect & "Welcome to the Dream World"
 * - Full video player controls: Play/Pause, Seek Scrubber, Replay, Mute, Skip, Fullscreen, Close
 * - Procedural celestial synthesizer audio with real-time sync
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER ENGINE FOR CINEMATIC SOUNDTRACK ---
  class CinematicAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.masterGain = null;
      this.lastChordTime = -1;
      this.notesMap = {
        'C3': 130.81, 'Eb3': 155.56, 'F3': 174.61, 'G3': 196.00, 'Bb3': 233.08,
        'C4': 261.63, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23,
        'G4': 392.00, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88, 'C5': 523.25,
        'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99,
        'A5': 880.00, 'Bb5': 932.33, 'C6': 1046.50
      };
    }

    init() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
          this.masterGain = this.ctx.createGain();
          this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.28, this.ctx.currentTime);
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
        this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.28, this.ctx.currentTime, 0.05);
      }
    }

    playTone(freq, duration = 0.6, type = 'sine', gainVal = 0.15) {
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

    playChime(note, duration = 0.8) {
      const f = this.notesMap[note] || 440;
      this.playTone(f, duration, 'sine', 0.2);
      this.playTone(f * 2, duration * 0.7, 'triangle', 0.08);
    }

    // Synchronized soundtrack triggers based on playback time
    updateSyncAudio(time) {
      if (!this.ctx || this.isMuted) return;
      const beat = Math.floor(time * 2); // 120 bpm pulse
      if (beat !== this.lastChordTime) {
        this.lastChordTime = beat;

        // Scene 1: Gentle ethereal awakening chimes
        if (time < 9) {
          if (beat % 4 === 0) {
            const chords = [['C4', 'G4', 'Eb5'], ['Bb3', 'F4', 'D5'], ['Ab3', 'Eb4', 'C5']];
            const ch = chords[Math.floor(beat / 4) % chords.length];
            ch.forEach((n, i) => setTimeout(() => this.playChime(n, 1.2), i * 180));
          }
        }
        // Scene 2: Flying starlight arpeggios
        else if (time < 18) {
          const melody = ['C5', 'Eb5', 'G5', 'Bb5', 'C6', 'Bb5', 'G5', 'Eb5'];
          const note = melody[beat % melody.length];
          this.playChime(note, 0.4);
        }
        // Scene 3: Portal warp resonance
        else if (time < 27) {
          if (beat % 2 === 0) {
            const portalNotes = ['Eb4', 'G4', 'Bb4', 'Eb5', 'F5'];
            this.playTone(this.notesMap[portalNotes[beat % portalNotes.length]], 0.5, 'triangle', 0.18);
          }
        }
        // Scene 4: Celestial Celebration Fanfare
        else {
          if (beat % 2 === 0) {
            const fanfare = ['C5', 'G5', 'E5', 'C6', 'G5', 'A5', 'F5', 'G5'];
            this.playChime(fanfare[beat % fanfare.length], 0.6);
          }
        }
      }
    }
  }

  // --- MAIN CINEMATIC ENGINE ---
  class LumiCinematicPlayer {
    constructor() {
      this.duration = 36.0; // 36-second cinematic story
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

      // Asset Preloads
      this.images = {
        spark: this.loadImage('assets/journey1_spark_hd.jpg'),
        portal: this.loadImage('assets/journey2_portal_hd.jpg'),
        architect: this.loadImage('assets/journey4_architect_hd.jpg'),
        lumiPortrait: this.loadImage('assets/about_photo_hd.jpg'),
        lumiChar: this.loadImage('assets/lumi_hero_character.png')
      };

      // Particle Systems
      this.stardustParticles = this.createStardust(120);
      this.trailParticles = [];
      this.warpStars = this.createWarpStars(140);
      this.celebrationStars = this.createCelebrationStars(80);

      // Scene Metadata
      this.scenes = [
        {
          start: 0,
          end: 9,
          id: 1,
          name: "Scene 1: The Awakening",
          title: "The Starlight Awakening",
          tag: "🌌 Scene 1 of 4 · Dream Nebula",
          caption: "A tiny forgotten wish ignites in the quiet sanctuary of the Dream Nebula, and Lumi opens their eyes..."
        },
        {
          start: 9,
          end: 18,
          id: 2,
          name: "Scene 2: Cosmic Flight",
          title: "Gliding Through the Cosmos",
          tag: "✨ Scene 2 of 4 · The Starlight Trail",
          caption: "Lumi takes to the starlit skies, floating past dream islands and leaving a sparkling magical trail..."
        },
        {
          start: 18,
          end: 27,
          id: 3,
          name: "Scene 3: The Celestial Portal",
          title: "The Portal to Dream Worlds",
          tag: "🌀 Scene 3 of 4 · Dimensional Gateway",
          caption: "Lumi uncovers an ancient stone archway and plunges through its swirling cosmic vortex..."
        },
        {
          start: 27,
          end: 36,
          id: 4,
          name: "Scene 4: The Dream Architect",
          title: "Welcome to the Dream World",
          tag: "🪄 Scene 4 of 4 · The Grand Premiere",
          caption: "Armed with a starlight wand and celestial friends, Lumi turns restless worries into radiant constellations!"
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

    createStardust(count) {
      const arr = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * 1280,
          y: Math.random() * 720,
          size: Math.random() * 2.5 + 0.8,
          alpha: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.4 + 0.1,
          twinkleSpeed: Math.random() * 0.04 + 0.01,
          color: ['#fcd34d', '#ec4899', '#a855f7', '#60a5fa', '#ffffff'][Math.floor(Math.random() * 5)]
        });
      }
      return arr;
    }

    createWarpStars(count) {
      const arr = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 500 + 40;
        arr.push({
          angle,
          dist,
          speed: Math.random() * 14 + 10,
          len: Math.random() * 40 + 15,
          color: ['#38bdf8', '#c084fc', '#fcd34d', '#ffffff'][Math.floor(Math.random() * 4)]
        });
      }
      return arr;
    }

    createCelebrationStars(count) {
      const arr = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          orbitX: 640 + (Math.random() - 0.5) * 500,
          orbitY: 340 + (Math.random() - 0.5) * 300,
          radius: Math.random() * 80 + 30,
          angle: Math.random() * Math.PI * 2,
          speed: (Math.random() * 0.03 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
          size: Math.random() * 3 + 1.5,
          color: ['#fcd34d', '#ec4899', '#38bdf8', '#fed7aa', '#ffffff'][Math.floor(Math.random() * 5)]
        });
      }
      return arr;
    }

    setupEventListeners() {
      // Big play / Screen click
      if (this.bigPlayBtn) {
        this.bigPlayBtn.addEventListener('click', () => this.play());
      }
      if (this.canvas) {
        this.canvas.addEventListener('click', () => this.togglePlayPause());
      }

      // Play / Pause button
      if (this.playPauseBtn) {
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
      }

      // Replay
      if (this.replayBtn) {
        this.replayBtn.addEventListener('click', () => {
          this.seek(0);
          this.play();
        });
      }

      // Skip Intro
      if (this.skipBtn) {
        this.skipBtn.addEventListener('click', () => {
          if (this.currentTime < 28.5) {
            this.seek(28.5);
            this.play();
          } else {
            this.close();
            const proj = document.getElementById('projects');
            if (proj) proj.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      }

      // Mute Toggle
      if (this.muteBtn) {
        this.muteBtn.addEventListener('click', () => this.toggleMute());
      }

      // Explore Lumi's World
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

      // Timeline Scrubber Click & Drag
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

        // Touch support
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

      // Keyboard Controls
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
      if (this.bigPlayBtn && this.currentTime < 28.5) {
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

      // Advance timeline
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
      // Progress Bar
      const pct = (this.currentTime / this.duration) * 100;
      if (this.timelineFill) this.timelineFill.style.width = `${pct}%`;
      if (this.timelineHandle) this.timelineHandle.style.left = `${pct}%`;
      if (this.timelineTrack) this.timelineTrack.setAttribute('aria-valuenow', Math.floor(this.currentTime));

      // Time Display mm:ss
      const mins = Math.floor(this.currentTime / 60);
      const secs = Math.floor(this.currentTime % 60);
      if (this.timeDisplay) {
        this.timeDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }

      // Current Scene Info
      const activeScene = this.scenes.find(s => this.currentTime >= s.start && this.currentTime < s.end) || this.scenes[this.scenes.length - 1];
      if (this.chapterIndicator) this.chapterIndicator.textContent = activeScene.name;
      if (this.sceneTitle) this.sceneTitle.textContent = `Lumi · ${activeScene.title}`;

      // Scene Title Overlay (fades in for first 3.8s of Scenes 1, 2, and 3)
      const sceneElapsed = this.currentTime - activeScene.start;
      if (this.overlayCard) {
        if (sceneElapsed < 3.8 && activeScene.id < 4) {
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

      // Scene 4 Welcome Banner: ONLY visible when currentTime >= 28.5
      if (this.welcomeBanner) {
        if (this.currentTime >= 28.5) {
          this.welcomeBanner.classList.add('visible');
          this.welcomeBanner.style.display = 'flex';
          const bannerOpacity = Math.min(1, (this.currentTime - 28.5) / 0.8);
          this.welcomeBanner.style.opacity = bannerOpacity;
        } else {
          this.welcomeBanner.classList.remove('visible');
          this.welcomeBanner.style.display = 'none';
          this.welcomeBanner.style.opacity = 0;
        }
      }

      // Big play button: hide if playing or if on welcome banner
      if (this.bigPlayBtn) {
        if (!this.isPlaying && this.currentTime < 28.5) {
          this.bigPlayBtn.classList.add('visible');
          this.bigPlayBtn.style.display = 'flex';
        } else {
          this.bigPlayBtn.classList.remove('visible');
          this.bigPlayBtn.style.display = 'none';
        }
      }
    }

    // --- RENDER ENGINE: DRAWS 60FPS CINEMATIC SCENES ---
    render(t) {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const W = 1280;
      const H = 720;

      ctx.save();
      ctx.clearRect(0, 0, W, H);

      if (t < 9.0) {
        this.renderScene1(ctx, t, W, H);
      } else if (t < 18.0) {
        this.renderScene2(ctx, t - 9.0, W, H);
      } else if (t < 27.0) {
        this.renderScene3(ctx, t - 18.0, W, H);
      } else {
        this.renderScene4(ctx, t - 27.0, W, H);
      }

      ctx.restore();
    }

    // SCENE 1: THE AWAKENING (0s - 9s)
    renderScene1(ctx, t, W, H) {
      // Camera Zoom & Subtle Pan
      const zoom = 1.0 + (t / 9.0) * 0.12;
      ctx.translate(W / 2, H / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-W / 2, -H / 2);

      // Deep space nebula background
      const grad = ctx.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, 800);
      grad.addColorStop(0, '#1a103c');
      grad.addColorStop(0.5, '#0d0926');
      grad.addColorStop(1, '#050412');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Spark image (Lumi in starlight nest)
      if (this.images.spark && this.images.spark.complete) {
        ctx.save();
        const imgAlpha = Math.min(1, Math.max(0, (t - 1.0) / 2.0));
        ctx.globalAlpha = imgAlpha;
        ctx.drawImage(this.images.spark, 0, 0, W, H);
        ctx.restore();
      }

      // Initial Glowing Star Birth (0s - 4.5s)
      if (t < 4.5) {
        const starProgress = Math.min(1, t / 2.5);
        const starX = W / 2;
        const starY = H / 2 - 20;
        const starRadius = 8 + starProgress * 28 + Math.sin(t * 8) * 4;

        // Radial golden aura
        const starGrad = ctx.createRadialGradient(starX, starY, 2, starX, starY, starRadius * 3);
        starGrad.addColorStop(0, '#ffffff');
        starGrad.addColorStop(0.3, '#fcd34d');
        starGrad.addColorStop(0.7, 'rgba(236,72,153,0.4)');
        starGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = starGrad;
        ctx.beginPath();
        ctx.arc(starX, starY, starRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        // 4 Golden Star Spikes
        ctx.save();
        ctx.translate(starX, starY);
        ctx.rotate(t * 0.8);
        ctx.strokeStyle = 'rgba(252,211,77,0.85)';
        ctx.lineWidth = 2.5;
        const spikeLen = starRadius * 2.4;
        ctx.beginPath();
        ctx.moveTo(0, -spikeLen); ctx.lineTo(0, spikeLen);
        ctx.moveTo(-spikeLen, 0); ctx.lineTo(spikeLen, 0);
        ctx.stroke();
        ctx.restore();
      }

      // Twinkling Stardust Rising from Nest
      this.drawStardust(ctx, t, 1.2);

      // Awakening Light Rays from Lumi
      if (t >= 3.0) {
        ctx.save();
        const rayAlpha = Math.min(0.35, (t - 3.0) * 0.1) * (0.8 + Math.sin(t * 3) * 0.2);
        ctx.globalAlpha = rayAlpha;
        const rayGrad = ctx.createRadialGradient(W / 2, H / 2 - 40, 20, W / 2, H / 2 - 40, 450);
        rayGrad.addColorStop(0, 'rgba(252,211,77,0.7)');
        rayGrad.addColorStop(0.5, 'rgba(168,85,247,0.3)');
        rayGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = rayGrad;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }
    }

    // SCENE 2: COSMIC FLIGHT & MAGICAL TRAIL (9s - 18s)
    renderScene2(ctx, t, W, H) {
      // Parallax Background Space
      ctx.fillStyle = '#06081c';
      ctx.fillRect(0, 0, W, H);

      // Layer 1: Distant Nebulae (Drifting slowly)
      const nebGrad = ctx.createLinearGradient(0, 0, W, H);
      nebGrad.addColorStop(0, '#1c0f3d');
      nebGrad.addColorStop(0.5, '#0e163d');
      nebGrad.addColorStop(1, '#050718');
      ctx.fillStyle = nebGrad;
      ctx.fillRect(0, 0, W, H);

      // Layer 2: Moving Floating Clouds & Parallax Sky Islands
      const cloudOffset = (t * 110) % (W + 400);
      this.drawStylizedCloud(ctx, W - cloudOffset, 150, 260, 'rgba(168,85,247,0.22)');
      this.drawStylizedCloud(ctx, W - cloudOffset + 700, 480, 320, 'rgba(96,165,250,0.18)');
      this.drawStylizedCloud(ctx, W - (cloudOffset * 1.5) + 300, 580, 300, 'rgba(236,72,153,0.16)');

      // Layer 3: Twinkling Stardust Field
      this.drawStardust(ctx, t, 2.5);

      // Lumi's Flight Path across the sky (from x: 100 to x: 1100)
      const progress = t / 9.0; // 0 to 1
      const lumiX = 100 + progress * (W - 200);
      const lumiY = 340 + Math.sin(t * 3.0) * 85;
      const bankAngle = Math.cos(t * 3.0) * 0.16;

      // Spawn Starlight Trail Particles Behind Lumi
      if (this.isPlaying || Math.random() < 0.6) {
        for (let i = 0; i < 4; i++) {
          this.trailParticles.push({
            x: lumiX - 45 + (Math.random() - 0.5) * 20,
            y: lumiY + (Math.random() - 0.5) * 20,
            vx: -Math.random() * 3.5 - 2,
            vy: (Math.random() - 0.5) * 2.5,
            size: Math.random() * 5 + 2,
            alpha: 1.0,
            decay: Math.random() * 0.025 + 0.015,
            color: ['#fcd34d', '#ec4899', '#38bdf8', '#fed7aa', '#ffffff'][Math.floor(Math.random() * 5)]
          });
        }
      }

      // Render & Update Starlight Trail
      for (let i = this.trailParticles.length - 1; i >= 0; i--) {
        const p = this.trailParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          this.trailParticles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // 4-point sparkle cross on larger trail particles
        if (p.size > 3.0) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - p.size * 2); ctx.lineTo(p.x, p.y + p.size * 2);
          ctx.moveTo(p.x - p.size * 2, p.y); ctx.lineTo(p.x + p.size * 2, p.y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Render Flying Lumi Character
      ctx.save();
      ctx.translate(lumiX, lumiY);
      ctx.rotate(bankAngle);

      // Celestial Aura Glow around Lumi
      const auraGrad = ctx.createRadialGradient(0, 0, 15, 0, 0, 120);
      auraGrad.addColorStop(0, 'rgba(252,211,77,0.7)');
      auraGrad.addColorStop(0.4, 'rgba(236,72,153,0.4)');
      auraGrad.addColorStop(0.8, 'rgba(168,85,247,0.2)');
      auraGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 120, 0, Math.PI * 2);
      ctx.fill();

      // Golden Starlight Outer Ring
      ctx.strokeStyle = 'rgba(252,211,77,0.85)';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#fcd34d';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(0, 0, 68, 0, Math.PI * 2);
      ctx.stroke();

      // Lumi Portrait in Flight Sphere
      if (this.images.lumiPortrait && this.images.lumiPortrait.complete) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, 65, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(this.images.lumiPortrait, -65, -65, 130, 130);
        ctx.restore();
      }
      ctx.restore();

      // Foreground Cloud Layer (Fast parallax)
      this.drawStylizedCloud(ctx, W - (cloudOffset * 1.8) - 150, 650, 380, 'rgba(8,10,30,0.75)');
    }

    // SCENE 3: CELESTIAL PORTAL & DIMENSIONAL WARP (18s - 27s)
    renderScene3(ctx, t, W, H) {
      if (t < 4.5) {
        // Part A: Discovering the Ancient Archway (18s - 22.5s)
        const subT = t / 4.5;
        // Camera smooth zoom into the portal
        const zoom = 1.0 + subT * 0.35;
        ctx.translate(W / 2, H / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-W / 2, -H / 2);

        // Portal background image
        if (this.images.portal && this.images.portal.complete) {
          ctx.drawImage(this.images.portal, 0, 0, W, H);
        } else {
          ctx.fillStyle = '#0a0d2a';
          ctx.fillRect(0, 0, W, H);
        }

        // Active Rotating Hyperspace Vortex Center (x: 640, y: 355)
        const vortexX = W / 2;
        const vortexY = 355;
        ctx.save();
        ctx.translate(vortexX, vortexY);
        ctx.rotate(t * 1.8);

        // Vortex spiral arms
        for (let arm = 0; arm < 4; arm++) {
          ctx.save();
          ctx.rotate((arm * Math.PI) / 2);
          const armGrad = ctx.createLinearGradient(0, 0, 150, 150);
          armGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
          armGrad.addColorStop(0.4, 'rgba(56,189,248,0.6)');
          armGrad.addColorStop(0.8, 'rgba(168,85,247,0.3)');
          armGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = armGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 140, 0, 0.8);
          ctx.lineTo(0, 0);
          ctx.fill();
          ctx.restore();
        }

        // Vortex Center Radiant Core
        const coreGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 80);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.4, '#38bdf8');
        coreGrad.addColorStop(0.8, '#a855f7');
        coreGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Lumi approaches portal
        const approachX = 350 + subT * 260;
        const approachY = 480 - subT * 100;
        const approachScale = 1.0 - subT * 0.35;
        ctx.save();
        ctx.translate(approachX, approachY);
        ctx.scale(approachScale, approachScale);
        if (this.images.lumiPortrait && this.images.lumiPortrait.complete) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, 0, 45, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(this.images.lumiPortrait, -45, -45, 90, 90);
          ctx.restore();
        }
        ctx.restore();
      } else {
        // Part B: Dimensional Warp Speed Tunnel (22.5s - 27s)
        const warpT = (t - 4.5) / 4.5;
        ctx.fillStyle = '#03020c';
        ctx.fillRect(0, 0, W, H);

        const centerX = W / 2;
        const centerY = H / 2;

        // Warp tunnel streaking stars
        ctx.save();
        this.warpStars.forEach((star) => {
          star.dist += star.speed * (1.0 + warpT * 2.5);
          if (star.dist > 750) star.dist = Math.random() * 50 + 20;

          const x1 = centerX + Math.cos(star.angle) * star.dist;
          const y1 = centerY + Math.sin(star.angle) * star.dist;
          const tailLen = star.len * (1.0 + warpT * 2.0);
          const x2 = centerX + Math.cos(star.angle) * (star.dist + tailLen);
          const y2 = centerY + Math.sin(star.angle) * (star.dist + tailLen);

          ctx.strokeStyle = star.color;
          ctx.lineWidth = 2.0 + warpT * 1.5;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });
        ctx.restore();

        // Central Dimensional Horizon
        const tunnelGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 380);
        tunnelGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
        tunnelGrad.addColorStop(0.3, 'rgba(56,189,248,0.5)');
        tunnelGrad.addColorStop(0.7, 'rgba(168,85,247,0.3)');
        tunnelGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = tunnelGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 380, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // SCENE 4: THE DREAM ARCHITECT & CELEBRATION (27s - 36s)
    renderScene4(ctx, t, W, H) {
      // Gentle camera float
      const bobY = Math.sin(t * 1.8) * 10;
      ctx.translate(0, bobY);

      // Dream World Canopy Artwork
      if (this.images.architect && this.images.architect.complete) {
        ctx.drawImage(this.images.architect, 0, 0, W, H);
      } else {
        ctx.fillStyle = '#100c30';
        ctx.fillRect(0, 0, W, H);
      }

      // Orbiting Celebration Stars around Lumi
      ctx.save();
      this.celebrationStars.forEach((star) => {
        star.angle += star.speed;
        const curX = star.orbitX + Math.cos(star.angle) * star.radius;
        const curY = star.orbitY + Math.sin(star.angle) * (star.radius * 0.45);

        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(curX, curY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Twinkle rays on bright stars
        if (star.size > 3.0) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(curX - 6, curY); ctx.lineTo(curX + 6, curY);
          ctx.moveTo(curX, curY - 6); ctx.lineTo(curX, curY + 6);
          ctx.stroke();
        }
      });
      ctx.restore();

      // Lumi's Wand Starlight Halo Pulse
      const wandX = 350;
      const wandY = 440;
      const haloRadius = 45 + Math.sin(t * 4.0) * 12;
      const wandGrad = ctx.createRadialGradient(wandX, wandY, 5, wandX, wandY, haloRadius);
      wandGrad.addColorStop(0, '#ffffff');
      wandGrad.addColorStop(0.4, '#fcd34d');
      wandGrad.addColorStop(0.8, 'rgba(236,72,153,0.3)');
      wandGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = wandGrad;
      ctx.beginPath();
      ctx.arc(wandX, wandY, haloRadius, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Vignette
      const vig = ctx.createRadialGradient(W / 2, H / 2, 350, W / 2, H / 2, 750);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(5, 6, 20, 0.65)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);
    }

    // Helper: Draw animated ambient stardust
    drawStardust(ctx, t, speedMult = 1.0) {
      ctx.save();
      this.stardustParticles.forEach((star) => {
        star.y -= star.speed * speedMult;
        if (star.y < 0) star.y = 720;

        const alpha = star.alpha * (0.6 + Math.sin(t * 4 + star.x) * 0.4);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    // Helper: Draw stylized fluffy nebula clouds
    drawStylizedCloud(ctx, x, y, width, color) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, width * 0.28, 0, Math.PI * 2);
      ctx.arc(x + width * 0.22, y - width * 0.08, width * 0.24, 0, Math.PI * 2);
      ctx.arc(x + width * 0.45, y, width * 0.26, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Instantiate globally on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    window.LumiCinematic = new LumiCinematicPlayer();

    // Wire Hero "Watch Intro" Button to Cinematic Video Player
    const btnWatchIntro = document.getElementById('btn-watch-intro');
    if (btnWatchIntro) {
      btnWatchIntro.addEventListener('click', (e) => {
        e.preventDefault();
        window.LumiCinematic.open();
      });
    }

    // Also wire About Lumi "View More" button to Cinematic Video Player
    const aboutViewMore = document.getElementById('about-view-more');
    if (aboutViewMore) {
      aboutViewMore.addEventListener('click', (e) => {
        e.preventDefault();
        window.LumiCinematic.open();
      });
    }

    // Close button inside cinematic header
    const closeBtns = document.querySelectorAll('.cinematic-close-btn');
    closeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (window.LumiCinematic) window.LumiCinematic.close();
      });
    });
  });
})();
