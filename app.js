/**
 * LUMI: THE LITTLE DREAM ARCHITECT — MAIN APPLICATION
 * Interactive Core, Modals, Easter Eggs, Parallax & Stardust Canvas Engine
 */

function initLumiApp() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. RETURNING VISITOR MEMORY (LocalStorage)
     ========================================================================== */
  const visitKey = 'lumi_dream_visitor';
  const hasVisited = localStorage.getItem(visitKey);
  const speechBubble = document.querySelector('.speech-bubble p');

  if (hasVisited && speechBubble) {
    speechBubble.innerHTML = "Welcome back, Stargazer! Lumi missed you! ✨";
  } else {
    try {
      localStorage.setItem(visitKey, 'true');
    } catch (e) {
      // LocalStorage might be disabled in private browsing
    }
  }

  /* ==========================================================================
     2. AUDIO CONTROLS & WEB AUDIO SYNTH (Strict User Interaction, No Autoplay)
     ========================================================================== */
  const lullabyToggle = document.getElementById('lullaby-toggle');
  const musicState = document.getElementById('music-state');
  const musicNoteIcon = document.getElementById('music-note-icon');

  const updateMusicUI = (isPlaying) => {
    if (!lullabyToggle) return;
    if (isPlaying) {
      lullabyToggle.classList.add('playing');
      if (musicState) musicState.textContent = '⏸';
      if (musicNoteIcon) musicNoteIcon.textContent = '🎶';
      lullabyToggle.setAttribute('title', 'Pause Lullaby Music (M key)');
    } else {
      lullabyToggle.classList.remove('playing');
      if (musicState) musicState.textContent = '▶';
      if (musicNoteIcon) musicNoteIcon.textContent = '🎵';
      lullabyToggle.setAttribute('title', 'Play Dreamy Lullaby (M key)');
    }
  };

  if (lullabyToggle) {
    lullabyToggle.addEventListener('click', () => {
      if (window.dreamAudio) {
        const isNowPlaying = window.dreamAudio.toggleMusic();
        updateMusicUI(isNowPlaying);
        if (!isNowPlaying && !window.dreamAudio.isPlaying && !window.dreamAudio.isSupported) {
          spawnFloatingFeedback(window.innerWidth - 140, 70, '🔇 Audio not supported');
        }
      }
    });
  }

  // Keyboard shortcut 'M' / 'm' to toggle music / mute
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'm' || e.key === 'M') {
      if (window.dreamAudio) {
        const isNowPlaying = window.dreamAudio.toggleMusic();
        updateMusicUI(isNowPlaying);
        spawnFloatingFeedback(window.innerWidth - 120, 70, isNowPlaying ? '🎶 Unmuted' : '🔇 Muted');
      }
    }
  });

  // Play subtle sound on click for interactive buttons
  document.querySelectorAll('.btn-primary, .btn-secondary, .tag-pill, .social-link, .nav-item, .card-link-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.dreamAudio) window.dreamAudio.playTap();
    });
  });

  // Cloud mascot tap feedback
  const cloudMascot = document.getElementById('cloud-mascot');
  if (cloudMascot) {
    cloudMascot.addEventListener('click', (e) => {
      if (window.dreamAudio) window.dreamAudio.playChime('G5');
      cloudMascot.style.transform = 'scale(1.2) rotate(12deg)';
      setTimeout(() => {
        cloudMascot.style.transform = '';
      }, 300);
      spawnFloatingFeedback(e.clientX || 100, e.clientY || (window.innerHeight - 80), '☁️ Giggle!');
      if (speechBubble) {
        const cutePhrases = [
          "Giggle! That tickles! ✨",
          "Every dream you weave matters! 🌸",
          "Stars are made of wishes like yours! ⭐",
          "Warm chamomile tea is ready! ☕",
          "Pillow clouds are fluffed and cozy! 🌙"
        ];
        speechBubble.textContent = cutePhrases[Math.floor(Math.random() * cutePhrases.length)];
      }
    });
  }

  /* ==========================================================================
     3. STARDUST CURSOR TRAIL & AMBIENT DRIFTING PARTICLES
     ========================================================================== */
  const canvas = document.getElementById('stardust-canvas');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ['#fcd34d', '#f472b6', '#c084fc', '#93c5fd', '#ffffff'];

    class Particle {
      constructor(x, y, isAmbient = false) {
        this.x = x !== undefined ? x : Math.random() * width;
        this.y = y !== undefined ? y : height + Math.random() * 20;
        this.isAmbient = isAmbient;
        this.size = isAmbient ? (Math.random() * 2 + 1) : (Math.random() * 3.5 + 1.2);
        this.speedX = (Math.random() - 0.5) * (isAmbient ? 0.4 : 1.5);
        this.speedY = isAmbient ? -(Math.random() * 0.4 + 0.2) : ((Math.random() - 0.5) * 1.5 - 0.6);
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = isAmbient ? (Math.random() * 0.5 + 0.2) : 1;
        this.decay = isAmbient ? 0.003 : (Math.random() * 0.02 + 0.015);
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
        if (this.isAmbient && (this.alpha <= 0 || this.y < -10)) {
          this.y = height + 10;
          this.x = Math.random() * width;
          this.alpha = Math.random() * 0.5 + 0.2;
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.isAmbient ? 4 : 8;
        ctx.shadowColor = this.color;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.size * 1.5);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.lineTo(this.x, this.y + this.size * 1.5);
        ctx.lineTo(this.x - this.size, this.y);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize 16 ambient cosmic floating particles
    for (let i = 0; i < 16; i++) {
      const p = new Particle(Math.random() * width, Math.random() * height, true);
      particles.push(p);
    }

    // Add trail particles on mousemove / touchmove
    let lastX = 0, lastY = 0;
    const addStardust = (x, y) => {
      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist > 6) {
        for (let i = 0; i < 2; i++) {
          particles.push(new Particle(x, y, false));
        }
        lastX = x;
        lastY = y;
      }
    };

    window.addEventListener('mousemove', (e) => addStardust(e.clientX, e.clientY), { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches[0]) addStardust(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    const animateStardust = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (!particles[i].isAmbient && particles[i].alpha <= 0) {
          particles.splice(i, 1);
        }
      }
      requestAnimationFrame(animateStardust);
    };
    animateStardust();
  }

  /* ==========================================================================
     4. LAYERED BACKGROUND PARALLAX (Subtle pointer effect on bg layers only)
     ========================================================================== */
  const heroBanner = document.getElementById('hero-banner');
  const heroParallaxBg = document.getElementById('hero-parallax-bg');
  const heroClouds = heroBanner ? heroBanner.querySelector('.hero-clouds-layer') : null;
  const heroParticles = heroBanner ? heroBanner.querySelector('.hero-particles-layer') : null;
  const skyStars = document.getElementById('sky-stars');

  if (heroBanner && !prefersReducedMotion) {
    let ticking = false;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    heroBanner.addEventListener('mousemove', (e) => {
      const rect = heroBanner.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      // Gentle dampening for subtle, elegant depth
      targetX = relX * 16;
      targetY = relY * 12;

      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    heroBanner.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });

    function updateParallax() {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      // Only move background layers; keep text & buttons rock-solid
      if (heroParallaxBg) {
        heroParallaxBg.style.transform = `translate(${currentX * 0.25}px, ${currentY * 0.2}px)`;
      }
      if (heroClouds) {
        heroClouds.style.transform = `translate(${currentX * -0.35}px, ${currentY * -0.25}px)`;
      }
      if (heroParticles) {
        heroParticles.style.transform = `translate(${currentX * 0.45}px, ${currentY * 0.35}px)`;
      }
      if (skyStars) {
        skyStars.style.transform = `translate(${currentX * 0.3}px, ${currentY * 0.25}px)`;
      }

      if (Math.abs(targetX - currentX) > 0.04 || Math.abs(targetY - currentY) > 0.04) {
        requestAnimationFrame(updateParallax);
      } else {
        ticking = false;
      }
    }
  }

  /* ==========================================================================
     5. LUMI CONTINUOUS FLOATING & EXPRESSION REACTIONS
     ========================================================================== */
  const heroLumiCharacter = document.getElementById('hero-lumi-character');
  if (heroLumiCharacter) {
    heroLumiCharacter.addEventListener('click', (e) => {
      // If clicking the star hitbox specifically, Easter Egg handler takes it
      if (e.target.closest('#hero-special-star')) return;

      if (window.dreamAudio) window.dreamAudio.playChime('E5');
      heroLumiCharacter.style.transform = 'scale(1.12) rotate(6deg)';
      setTimeout(() => { heroLumiCharacter.style.transform = ''; }, 350);

      spawnFloatingFeedback(e.clientX, e.clientY, '✨ Lumi winks!');

      if (speechBubble) {
        speechBubble.textContent = "✨ 'I'm weaving sweet dreams for you tonight!'";
      }
    });
  }

  // About Photo Interactive Wink / Bounce
  const aboutPhoto = document.getElementById('about-photo-interactive');
  if (aboutPhoto) {
    aboutPhoto.addEventListener('click', (e) => {
      if (window.dreamAudio) window.dreamAudio.playChime('C5');
      aboutPhoto.style.transform = 'scale(1.08) rotate(-4deg)';
      setTimeout(() => { aboutPhoto.style.transform = ''; }, 300);
      spawnFloatingFeedback(e.clientX, e.clientY, '⭐ Lumi & Star');
    });
  }

  // Personality Tag Pills (Interactive Sparks & Quotes)
  const tagPhrases = {
    curious: "✨ Curious: 'I chart uncharted skies to find forgotten wishes!'",
    kind: "🌸 Kind: 'No dreamer with a quiet wish should ever feel alone.'",
    creative: "🎨 Creative: 'I weave starlight and memories into cozy worlds!'",
    mischievous: "💫 Mischievous: 'Sometimes I tickle the clouds until they giggle stardust!'"
  };

  document.querySelectorAll('.tag-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const tag = pill.dataset.tag;
      const phrase = tagPhrases[tag] || "✨ Lumi's magical spark!";

      document.querySelectorAll('.tag-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const aboutQuoteText = document.getElementById('about-quote-text');
      if (aboutQuoteText) {
        aboutQuoteText.style.opacity = '0';
        setTimeout(() => {
          aboutQuoteText.textContent = phrase;
          aboutQuoteText.style.opacity = '1';
        }, 150);
      }

      if (speechBubble) speechBubble.textContent = phrase;
      if (window.dreamAudio) window.dreamAudio.playChime('E5');
      spawnFloatingFeedback(e.clientX, e.clientY, `✨ ${pill.textContent}`);
      pill.style.transform = 'scale(1.12)';
      setTimeout(() => { pill.style.transform = ''; }, 220);
    });
  });

  // Topbar Profile Avatar Button (About Lumi quick access)
  const profileBtn = document.getElementById('profile-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const aboutEl = document.getElementById('about-card') || document.getElementById('about');
      if (aboutEl) {
        aboutEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        aboutEl.classList.add('target-highlight');
        setTimeout(() => aboutEl.classList.remove('target-highlight'), 1200);
      }
      if (typeof setActiveNav === 'function') setActiveNav('about');
      if (window.dreamAudio) window.dreamAudio.playChime('C5');
      if (speechBubble) speechBubble.textContent = "✨ Welcome! Let me tell you about my dream world!";
    });
  }

  /* ==========================================================================
     6. EASTER EGG: THE HIDDEN ROOM (5 Clicks Unlock!)
     ========================================================================== */
  let starClickCount = 0;
  const targetClicks = 5;
  const clickCountText = document.getElementById('click-count-text');
  const lockIcon = document.getElementById('lock-icon');
  const secretBadge = document.getElementById('secret-badge');
  const modalEasterEgg = document.getElementById('modal-easter-egg');
  const secretHeaderBadge = document.getElementById('secret-header-badge');
  const secretSealStatus = document.getElementById('secret-seal-status');
  const secretBtnText = document.getElementById('secret-btn-text');
  const secretBtnCount = document.getElementById('secret-btn-count');
  const btnSecretTapAction = document.getElementById('btn-secret-tap-action');

  function spawnFloatingFeedback(x, y, text) {
    const el = document.createElement('div');
    el.className = 'star-float-feedback';
    el.textContent = text;
    el.style.left = `${x || (window.innerWidth / 2)}px`;
    el.style.top = `${y || (window.innerHeight / 2)}px`;
    document.body.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 950);
  }

  const registerSecretClick = (e) => {
    if (starClickCount >= targetClicks) {
      if (modalEasterEgg) {
        modalEasterEgg.hidden = false;
        document.body.style.overflow = 'hidden';
      }
      return;
    }

    starClickCount++;
    const clickX = e ? e.clientX : window.innerWidth / 2;
    const clickY = e ? e.clientY : window.innerHeight / 2;

    if (window.dreamAudio) {
      const scale = ['C5', 'E5', 'G5', 'A5', 'C6'];
      const note = scale[Math.min(starClickCount - 1, scale.length - 1)];
      window.dreamAudio.playChime(note);
    }

    spawnFloatingFeedback(clickX, clickY, `+⭐ (${starClickCount}/${targetClicks})`);

    // Lock icon pulse
    if (lockIcon) {
      lockIcon.style.transform = 'scale(1.3) rotate(-10deg)';
      setTimeout(() => { lockIcon.style.transform = ''; }, 200);
    }

    if (clickCountText) {
      clickCountText.textContent = `${starClickCount} / ${targetClicks} clicks`;
    }

    if (secretBtnCount) {
      secretBtnCount.textContent = `${starClickCount} / ${targetClicks}`;
    }

    if (secretSealStatus) {
      const remaining = targetClicks - starClickCount;
      secretSealStatus.textContent = remaining > 0 ? `${remaining} Tap${remaining > 1 ? 's' : ''} Remaining` : '✓ Slumber Seal Broken!';
    }

    const secretBarFill = document.getElementById('secret-bar-fill');
    if (secretBarFill) {
      const pct = Math.min(100, Math.round((starClickCount / targetClicks) * 100));
      secretBarFill.style.width = `${pct}%`;
    }

    // When 5 clicks reached: UNLOCK!
    if (starClickCount >= targetClicks) {
      if (lockIcon) lockIcon.textContent = '🔓';
      if (secretBadge) secretBadge.textContent = '🌟';
      if (clickCountText) clickCountText.textContent = '✨ UNLOCKED!';
      if (secretHeaderBadge) {
        secretHeaderBadge.textContent = '✨ Unlocked';
        secretHeaderBadge.classList.add('unlocked');
      }
      if (secretSealStatus) {
        secretSealStatus.textContent = '✓ Slumber Seal Broken!';
      }
      if (secretBtnText) {
        secretBtnText.textContent = 'Open Secret Sanctuary 🎶';
      }
      if (secretBtnCount) {
        secretBtnCount.textContent = 'UNLOCKED ✨';
      }
      if (btnSecretTapAction) {
        btnSecretTapAction.classList.add('unlocked');
      }

      if (window.dreamAudio) {
        window.dreamAudio.playUnlockSound();
      }

      spawnFloatingFeedback(clickX, clickY - 30, '🎉 SECRET UNLOCKED!');

      setTimeout(() => {
        if (modalEasterEgg) {
          modalEasterEgg.hidden = false;
          launchConfetti();
        }
      }, 350);
    }
  };

  const heroSpecialStar = document.getElementById('hero-special-star');
  if (heroSpecialStar) {
    heroSpecialStar.addEventListener('click', (e) => {
      e.stopPropagation();
      registerSecretClick(e);
    });
    heroSpecialStar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        registerSecretClick(e);
      }
    });
  }

  const hiddenArchTrigger = document.getElementById('hidden-arch-trigger');
  if (hiddenArchTrigger) {
    hiddenArchTrigger.setAttribute('role', 'button');
    hiddenArchTrigger.setAttribute('tabindex', '0');
    hiddenArchTrigger.addEventListener('click', (e) => {
      registerSecretClick(e);
    });
    hiddenArchTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        registerSecretClick(e);
      }
    });
  }

  if (btnSecretTapAction) {
    btnSecretTapAction.addEventListener('click', (e) => {
      registerSecretClick(e);
    });
  }

  /* ==========================================================================
     SECRET STARLIGHT MUSIC BOX STUDIO CONTROLLER
     ========================================================================== */
  let currentSecretTrack = 'waltz';
  let isSecretPlaying = false;
  let secretTempo = 1.0;
  let secretTimbre = 'musicbox';

  const trackMeta = {
    waltz: { title: "Lumi's Midnight Waltz", tempoTag: "3/4 Waltz" },
    whispers: { title: "Nebula Whispers", tempoTag: "Airy Ambient" },
    rain: { title: "Stardust Rain & Bells", tempoTag: "Crystal Droplets" }
  };

  const musicBoxDiscWrap = document.querySelector('.music-box-disc-wrap');
  const musicBoxDisc = document.getElementById('music-box-disc');
  const musicTrackTitle = document.getElementById('music-track-title');
  const musicTrackTempoTag = document.getElementById('music-track-tempo-tag');
  const musicPulseDot = document.getElementById('music-pulse-dot');
  const soundwaveBars = document.getElementById('music-soundwave-bars');
  const secretProgressBar = document.getElementById('secret-progress-bar');
  const currentNoteDisplay = document.getElementById('current-note-display');
  const btnSecretMasterPlay = document.getElementById('btn-secret-master-play');
  const playIcon = document.getElementById('play-icon');
  const playLabel = document.getElementById('play-label');

  function updateSecretPlayerUI(playing) {
    isSecretPlaying = !!playing;
    if (musicBoxDiscWrap) {
      if (isSecretPlaying) musicBoxDiscWrap.classList.add('playing');
      else musicBoxDiscWrap.classList.remove('playing');
    }
    if (musicBoxDisc) {
      if (isSecretPlaying) musicBoxDisc.classList.add('spinning');
      else musicBoxDisc.classList.remove('spinning');
    }
    if (musicPulseDot) {
      if (isSecretPlaying) musicPulseDot.classList.add('active');
      else musicPulseDot.classList.remove('active');
    }
    if (soundwaveBars) {
      if (isSecretPlaying) soundwaveBars.classList.add('active');
      else soundwaveBars.classList.remove('active');
    }
    if (playIcon && playLabel) {
      if (isSecretPlaying) {
        playIcon.textContent = '⏸';
        playLabel.textContent = 'Pause Music Box';
      } else {
        playIcon.textContent = '▶';
        playLabel.textContent = 'Play Celestial Music Box';
      }
    }
  }

  function stopSecretMusicBoxUI() {
    if (window.dreamAudio && typeof window.dreamAudio.stopSecretTrack === 'function') {
      window.dreamAudio.stopSecretTrack();
    }
    updateSecretPlayerUI(false);
    if (secretProgressBar) secretProgressBar.style.width = '0%';
    if (currentNoteDisplay) currentNoteDisplay.textContent = '—';
  }

  function startSecretMusicBoxUI(trackId = currentSecretTrack) {
    if (!window.dreamAudio) return;
    currentSecretTrack = trackId;
    window.dreamAudio.setSecretTempo(secretTempo);
    window.dreamAudio.setSecretTimbre(secretTimbre);

    const meta = trackMeta[currentSecretTrack] || trackMeta.waltz;
    if (musicTrackTitle) musicTrackTitle.textContent = meta.title;
    if (musicTrackTempoTag) {
      musicTrackTempoTag.textContent = `${meta.tempoTag} · ${secretTempo}x · ${secretTimbre === 'musicbox' ? 'Music Box' : secretTimbre === 'bell' ? 'Crystal Bell' : 'Stardust Echo'}`;
    }

    const started = window.dreamAudio.playSecretTrack(currentSecretTrack, (step) => {
      if (currentNoteDisplay) currentNoteDisplay.textContent = step.note;
      if (secretProgressBar && step.total > 0) {
        const pct = Math.round(((step.index + 1) / step.total) * 100);
        secretProgressBar.style.width = `${pct}%`;
      }
      if (soundwaveBars) {
        const bars = soundwaveBars.querySelectorAll('.bar');
        const activeBarIdx = step.index % bars.length;
        bars.forEach((b, idx) => {
          if (idx === activeBarIdx) {
            b.style.height = `${Math.floor(Math.random() * 14 + 14)}px`;
            b.style.background = '#fcd34d';
          } else {
            b.style.background = '';
          }
        });
      }
    });

    if (started) {
      updateSecretPlayerUI(true);
      document.querySelectorAll('.secret-track-card').forEach(card => {
        if (card.dataset.track === currentSecretTrack) {
          card.classList.add('active');
          const badge = card.querySelector('.track-badge');
          if (badge) badge.textContent = 'Playing';
        } else {
          card.classList.remove('active');
          const badge = card.querySelector('.track-badge');
          if (badge) badge.textContent = 'Select';
        }
      });
    }
  }

  // Master Play / Pause
  if (btnSecretMasterPlay) {
    btnSecretMasterPlay.addEventListener('click', () => {
      if (isSecretPlaying) {
        stopSecretMusicBoxUI();
      } else {
        startSecretMusicBoxUI(currentSecretTrack);
      }
    });
  }

  // Track Selector Cards
  document.querySelectorAll('.secret-track-card').forEach(card => {
    card.addEventListener('click', () => {
      const track = card.dataset.track;
      if (track) {
        currentSecretTrack = track;
        startSecretMusicBoxUI(track);
      }
    });
  });

  // Timbre Pill Buttons
  const timbrePills = document.querySelectorAll('#timbre-pills .synth-pill-btn');
  timbrePills.forEach(btn => {
    btn.addEventListener('click', () => {
      timbrePills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      secretTimbre = btn.dataset.timbre || 'musicbox';
      if (window.dreamAudio) {
        window.dreamAudio.setSecretTimbre(secretTimbre);
        window.dreamAudio.playChimeWithTimbre('C5', secretTimbre);
      }
      const meta = trackMeta[currentSecretTrack] || trackMeta.waltz;
      if (musicTrackTempoTag) {
        musicTrackTempoTag.textContent = `${meta.tempoTag} · ${secretTempo}x · ${secretTimbre === 'musicbox' ? 'Music Box' : secretTimbre === 'bell' ? 'Crystal Bell' : 'Stardust Echo'}`;
      }
    });
  });

  // Tempo Pill Buttons
  const tempoPills = document.querySelectorAll('#tempo-pills .synth-pill-btn');
  tempoPills.forEach(btn => {
    btn.addEventListener('click', () => {
      tempoPills.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      secretTempo = parseFloat(btn.dataset.tempo) || 1.0;
      if (window.dreamAudio) {
        window.dreamAudio.setSecretTempo(secretTempo);
        window.dreamAudio.playChimeWithTimbre('E5', secretTimbre);
      }
      const meta = trackMeta[currentSecretTrack] || trackMeta.waltz;
      if (musicTrackTempoTag) {
        musicTrackTempoTag.textContent = `${meta.tempoTag} · ${secretTempo}x · ${secretTimbre === 'musicbox' ? 'Music Box' : secretTimbre === 'bell' ? 'Crystal Bell' : 'Stardust Echo'}`;
      }
    });
  });

  // Live Chime Keyboard Interaction
  function triggerChimeKey(tineEl) {
    if (!tineEl) return;
    const note = tineEl.dataset.note;
    if (note && window.dreamAudio) {
      window.dreamAudio.playChimeWithTimbre(note, secretTimbre);
    }
    tineEl.classList.add('key-pressed');
    setTimeout(() => tineEl.classList.remove('key-pressed'), 240);

    const rect = tineEl.getBoundingClientRect();
    spawnFloatingFeedback(rect.left + rect.width / 2, rect.top - 10, `🎵 ${note}`);
  }

  document.querySelectorAll('.chime-key-tine').forEach(tine => {
    tine.addEventListener('click', () => triggerChimeKey(tine));
  });

  // Keyboard shortcut listener (keys 1-6 trigger chime notes when easter egg modal is open)
  window.addEventListener('keydown', (e) => {
    if (modalEasterEgg && !modalEasterEgg.hidden) {
      const keyMap = {
        '1': 'C5',
        '2': 'D5',
        '3': 'E5',
        '4': 'G5',
        '5': 'A5',
        '6': 'C6'
      };
      if (keyMap[e.key]) {
        e.preventDefault();
        const tine = document.querySelector(`.chime-key-tine[data-note="${keyMap[e.key]}"]`);
        if (tine) triggerChimeKey(tine);
      }
    }
  });

  const resetSecretBtn = document.getElementById('reset-secret-btn');
  if (resetSecretBtn) {
    resetSecretBtn.addEventListener('click', () => {
      stopSecretMusicBoxUI();
      starClickCount = 0;
      if (lockIcon) lockIcon.textContent = '🔒';
      if (secretBadge) secretBadge.textContent = '⭐';
      if (clickCountText) clickCountText.textContent = `0 / ${targetClicks} clicks`;
      const secretBarFill = document.getElementById('secret-bar-fill');
      if (secretBarFill) secretBarFill.style.width = '0%';
      if (modalEasterEgg) modalEasterEgg.hidden = true;
      document.body.style.overflow = '';
      if (window.dreamAudio) {
        window.dreamAudio.playTap();
      }
      updateMusicUI(false);
      spawnFloatingFeedback(window.innerWidth / 2, window.innerHeight / 2, '🔒 Chamber Relocked');
    });
  }

  /* ==========================================================================
     7. CONFETTI CELESTIAL CANNON FOR EASTER EGG
     ========================================================================== */
  function launchConfetti() {
    const confettiCanvas = document.getElementById('confetti-canvas');
    if (!confettiCanvas) return;
    const cctx = confettiCanvas.getContext('2d');
    const cWidth = confettiCanvas.width = 500;
    const cHeight = confettiCanvas.height = 300;

    const confettis = [];
    const colors = ['#fcd34d', '#f472b6', '#a855f7', '#60a5fa', '#34d399'];

    for (let i = 0; i < 75; i++) {
      confettis.push({
        x: cWidth / 2,
        y: cHeight / 2,
        vx: (Math.random() - 0.5) * 9,
        vy: (Math.random() - 0.75) * 10,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        alpha: 1
      });
    }

    const animateConfetti = () => {
      cctx.clearRect(0, 0, cWidth, cHeight);
      let alive = false;
      confettis.forEach(c => {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.22;
        c.rotation += c.vr;
        c.alpha -= 0.012;

        if (c.alpha > 0) {
          alive = true;
          cctx.save();
          cctx.globalAlpha = c.alpha;
          cctx.translate(c.x, c.y);
          cctx.rotate((c.rotation * Math.PI) / 180);
          cctx.fillStyle = c.color;
          cctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
          cctx.restore();
        }
      });
      if (alive) requestAnimationFrame(animateConfetti);
    };
    animateConfetti();
  }

  /* ==========================================================================
     8. PROJECT DETAIL MODALS WITH INTERACTIVE MINI-TOYS
     ========================================================================== */
  const projectModal = document.getElementById('modal-project');
  const projectModalBody = document.getElementById('project-modal-body');

  const projectDetails = {
    bubble: {
      id: 'bubble',
      title: "Dreamscape Creator (3D)",
      subtitle: "Sculpt, populate, and illuminate your own celestial floating realm.",
      img: "assets/proj1_bubble_hd.jpg",
      desc: "An interactive real-time 3D fantasy world-builder. Place magical trees, crystal clusters, cottages, glowing portals, lanterns, and flora across an ethereal floating island. Rotate the orbit camera, switch celestial presets from Golden Sunset to Aurora Dream, and create a tranquil sanctuary under the stars.",
      stats: [
        { label: "Render Engine", val: "Three.js 3D" },
        { label: "Island Realm", val: "Floating Biome" },
        { label: "Presets", val: "4 Celestial Skies" }
      ],
      interactiveType: "dreamscapeToy",
      toyTitle: "✨ 3D World-Builder: Dreamscape Creator",
      toyInstruction: "Drag to orbit camera · Scroll or pinch to zoom · Pick fantasy items to place on the floating island · Switch celestial skies in real-time!"
    },
    nightlight: {
      id: 'nightlight',
      title: "Nightlight Guardian",
      subtitle: "Interactive Cozy Sanctuary & Star Guardian Spirit.",
      img: "assets/proj2_lantern_hd.jpg",
      desc: "An interactive cozy night-time guardian sanctuary. Drapes your room in warm amber, moon blue, lavender, or aurora light. Adjust volumetric lantern brightness, listen to gentle rain, distant thunder, or starlight drones, watch shooting stars, and drift to sleep with a 30m / 60m bedtime timer while your loyal Guardian spirit watches over you.",
      stats: [
        { label: "Volumetric Glow", val: "4 Light Modes" },
        { label: "Cozy Ambience", val: "4 Soundscapes" },
        { label: "Sleep Sanctuary", val: "30m / 60m Timer" }
      ],
      interactiveType: "lanternToy",
      toyTitle: "🏮 Interactive Sanctuary: Nightlight Guardian",
      toyInstruction: "Interact with your Guardian spirit · Adjust ambient room glow · Listen to rain or thunder · Wish upon shooting stars!"
    },
    garden: {
      id: 'garden',
      title: "Memory Garden",
      subtitle: "Stores precious memories as glowing flowers.",
      img: "assets/proj3_garden_hd.jpg",
      desc: "Located on a floating basalt island overlooking the Great Cloud Sea, the Memory Garden cultivates memories of kindness and laughter into luminous petals that blossom whenever a sleepy wish is made.",
      stats: [
        { label: "Floral Species", val: "24 Cosmic Types" },
        { label: "Harvest Season", val: "Perpetual Midnight" },
        { label: "Soil Type", val: "Stardust Loam" }
      ],
      interactiveType: "gardenToy",
      toyTitle: "🌸 Interactive Sanctuary: Memory Garden",
      toyInstruction: "Plant precious memories as living cosmic flowers and floating crystal orbs across the ancient sanctuary."
    }
  };

  function openProjectModal(type) {
    // Teardown any running 3D canvas or active audio when opening/switching modal tabs
    if (window.DreamscapeCreator && typeof window.DreamscapeCreator.destroy === 'function') {
      window.DreamscapeCreator.destroy();
    }
    if (window.NightlightGuardian && typeof window.NightlightGuardian.destroy === 'function') {
      window.NightlightGuardian.destroy();
    }
    if (window.MemoryGarden && typeof window.MemoryGarden.destroy === 'function') {
      window.MemoryGarden.destroy();
    }

    const data = projectDetails[type] || projectDetails.bubble;
    if (window.dreamAudio) window.dreamAudio.playChime('C5');

    const modalWindow = projectModal ? projectModal.querySelector('.project-modal-window') : null;
    if (modalWindow) {
      modalWindow.classList.remove('dreamscape-modal-window', 'nightlight-modal-window', 'memory-garden-modal-window');
      if (data.id === 'bubble') {
        modalWindow.classList.add('dreamscape-modal-window');
      } else if (data.id === 'nightlight') {
        modalWindow.classList.add('nightlight-modal-window');
      } else if (data.id === 'garden') {
        modalWindow.classList.add('memory-garden-modal-window');
      }
    }

    projectModalBody.innerHTML = `
      <!-- Project Switcher Tabs -->
      <div class="project-modal-tabs" style="display:flex;gap:8px;margin-bottom:14px;overflow-x:auto;padding-bottom:4px;">
        <button class="project-tab-btn ${data.id === 'bubble' ? 'active' : ''}" data-project-tab="bubble" style="padding:6px 14px;border-radius:20px;font-size:0.78rem;font-weight:600;cursor:pointer;border:1px solid ${data.id === 'bubble' ? 'var(--accent-purple)' : 'var(--border-card)'};background:${data.id === 'bubble' ? 'linear-gradient(135deg, rgba(244,114,182,0.35), rgba(192,132,252,0.35))' : 'rgba(255,255,255,0.06)'};color:#fff;transition:all 0.2s;">
          ✨ Dreamscape Creator (3D)
        </button>
        <button class="project-tab-btn ${data.id === 'nightlight' ? 'active' : ''}" data-project-tab="nightlight" style="padding:6px 14px;border-radius:20px;font-size:0.78rem;font-weight:600;cursor:pointer;border:1px solid ${data.id === 'nightlight' ? 'var(--accent-purple)' : 'var(--border-card)'};background:${data.id === 'nightlight' ? 'linear-gradient(135deg, rgba(244,114,182,0.35), rgba(192,132,252,0.35))' : 'rgba(255,255,255,0.06)'};color:#fff;transition:all 0.2s;">
          🏮 Nightlight Guardian
        </button>
        <button class="project-tab-btn ${data.id === 'garden' ? 'active' : ''}" data-project-tab="garden" style="padding:6px 14px;border-radius:20px;font-size:0.78rem;font-weight:600;cursor:pointer;border:1px solid ${data.id === 'garden' ? 'var(--accent-purple)' : 'var(--border-card)'};background:${data.id === 'garden' ? 'linear-gradient(135deg, rgba(244,114,182,0.35), rgba(192,132,252,0.35))' : 'rgba(255,255,255,0.06)'};color:#fff;transition:all 0.2s;">
          🌸 Memory Garden
        </button>
      </div>

      <div class="project-modal-hero">
        <div style="position:relative;overflow:hidden;border-radius:14px;border:1px solid var(--border-card);margin-bottom:14px;height:210px;">
          <img id="project-modal-hero-img" src="${data.img}" alt="${data.title}" style="width:100%;height:100%;object-fit:cover;transition:filter 0.4s ease;">
          <div id="project-glow-layer" style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 50%, rgba(252,211,77,0.15) 0%, transparent 70%);transition:background 0.4s ease;"></div>
        </div>
        <h2 style="font-family:var(--font-display);font-size:1.6rem;color:#ffffff;margin-bottom:4px;">${data.title}</h2>
        <p style="color:var(--accent-gold);font-weight:600;font-size:0.85rem;margin-bottom:12px;">${data.subtitle}</p>
      </div>
      <p style="font-size:0.88rem;color:#cbd5e1;line-height:1.6;margin-bottom:16px;">${data.desc}</p>
      
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;">
        ${data.stats.map(s => `
          <div style="background:rgba(255,255,255,0.05);border:1px solid var(--border-card);border-radius:10px;padding:8px 10px;text-align:center;">
            <div style="font-size:0.68rem;color:var(--text-muted);">${s.label}</div>
            <div style="font-size:0.92rem;font-weight:700;color:#ffffff;margin-top:2px;">${s.val}</div>
          </div>
        `).join('')}
      </div>

      <!-- INTERACTIVE WORKSHOP MINI-TOY -->
      <div class="project-toy-outer-box" style="background:rgba(15,18,44,0.7);border:1px solid rgba(168,85,247,0.3);border-radius:14px;padding:14px;margin-bottom:20px;">
        <h4 style="font-family:var(--font-display);color:#fed7aa;font-size:0.95rem;margin-bottom:6px;">${data.toyTitle}</h4>
        <p style="font-size:0.78rem;color:#94a3b8;margin-bottom:12px;line-height:1.4;">${data.toyInstruction}</p>
        
        <div id="project-toy-container" style="min-height:90px;position:relative;background:rgba(7,9,25,0.6);border:1px dashed var(--border-card);border-radius:10px;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:10px;">
          <!-- Specific Mini-Toy controls will be mounted here -->
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:0.75rem;color:var(--text-dim);">Lumi Character Craft · Track 2</span>
        <button class="btn-primary" data-close="modal-project">Done Exploring</button>
      </div>
    `;

    // Connect switcher tabs inside modal
    projectModalBody.querySelectorAll('.project-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        openProjectModal(tab.dataset.projectTab);
      });
    });

    // Mount specific interactive toy
    mountInteractiveToy(data.interactiveType);

    projectModal.hidden = false;
    document.body.style.overflow = 'hidden';
    attachModalCloseEvents();
  }

  function mountInteractiveToy(type) {
    const container = document.getElementById('project-toy-container');
    if (!container) return;

    if (type === 'dreamscapeToy') {
      container.style.padding = '0';
      container.style.border = 'none';
      container.style.minHeight = '520px';
      container.style.height = '520px';
      container.style.background = '#060817';
      if (window.DreamscapeCreator && typeof window.DreamscapeCreator.mount === 'function') {
        window.DreamscapeCreator.mount(container);
      } else {
        container.innerHTML = '<div style="padding:24px;text-align:center;color:#fcd34d;">Loading 3D Dreamscape Engine...</div>';
      }
      return;
    }

    if (type === 'bubbleToy') {
      container.innerHTML = `
        <div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:10px;">
          <div id="bubble-chamber" style="width:100%;height:80px;position:relative;cursor:crosshair;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 80%);border-radius:8px;">
            <span style="font-size:0.75rem;color:var(--text-muted);pointer-events:none;">(Click chamber to pop stardust bubbles)</span>
          </div>
          <button id="btn-spawn-bubble" class="btn-secondary" style="padding:6px 14px;font-size:0.78rem;">
            🫧 Blow Dream Bubble
          </button>
        </div>
      `;

      const chamber = document.getElementById('bubble-chamber');
      const spawnBtn = document.getElementById('btn-spawn-bubble');

      const spawnBubble = (x, y) => {
        if (window.dreamAudio) window.dreamAudio.playChime('G5');
        const bubble = document.createElement('div');
        const size = Math.random() * 26 + 24;
        bubble.style.position = 'absolute';
        bubble.style.left = `${(x !== undefined ? x : Math.random() * 200 + 40)}px`;
        bubble.style.top = `${(y !== undefined ? y : Math.random() * 40 + 10)}px`;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.borderRadius = '50%';
        bubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(244,114,182,0.4) 60%, rgba(168,85,247,0.6) 100%)';
        bubble.style.boxShadow = '0 0 10px rgba(244,114,182,0.5), inset 0 0 6px #fff';
        bubble.style.cursor = 'pointer';
        bubble.style.transition = 'transform 0.2s ease, opacity 0.2s ease';

        bubble.addEventListener('click', (ev) => {
          ev.stopPropagation();
          if (window.dreamAudio) window.dreamAudio.playChime('C6');
          bubble.style.transform = 'scale(1.4)';
          bubble.style.opacity = '0';
          setTimeout(() => { if (bubble.parentNode) bubble.parentNode.removeChild(bubble); }, 150);
        });

        chamber.appendChild(bubble);
        setTimeout(() => {
          if (bubble.parentNode) {
            bubble.style.opacity = '0';
            setTimeout(() => { if (bubble.parentNode) bubble.parentNode.removeChild(bubble); }, 300);
          }
        }, 4000);
      };

      spawnBtn.addEventListener('click', () => spawnBubble());
      chamber.addEventListener('click', (e) => {
        const rect = chamber.getBoundingClientRect();
        spawnBubble(e.clientX - rect.left - 20, e.clientY - rect.top - 20);
      });

      // Spawn initial bubbles
      spawnBubble(60, 20);
      spawnBubble(180, 25);
    }
    else if (type === 'lanternToy') {
      container.style.padding = '0';
      container.style.border = 'none';
      container.style.minHeight = '520px';
      container.style.height = '520px';
      container.style.background = '#060817';
      if (window.NightlightGuardian && typeof window.NightlightGuardian.mount === 'function') {
        window.NightlightGuardian.mount(container);
      } else {
        container.innerHTML = '<div style="padding:24px;text-align:center;color:#fcd34d;">Loading Nightlight Guardian Sanctuary...</div>';
      }
    }
    else if (type === 'gardenToy') {
      container.style.padding = '0';
      container.style.border = 'none';
      container.style.minHeight = '560px';
      container.style.height = '560px';
      container.style.background = '#060817';
      if (window.MemoryGarden && typeof window.MemoryGarden.mount === 'function') {
        window.MemoryGarden.mount(container);
      } else {
        container.innerHTML = '<div style="padding:24px;text-align:center;color:#fcd34d;">Loading Enchanted Memory Garden...</div>';
      }
    }
  }

  // Open modal when clicking project mini cards (click & keyboard Enter/Space)
  document.querySelectorAll('.project-mini-card').forEach(card => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', () => {
      const type = card.dataset.project;
      openProjectModal(type);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const type = card.dataset.project;
        openProjectModal(type);
      }
    });
  });

  // Circle arrow button inside each project card
  document.querySelectorAll('.project-circle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.project-mini-card');
      const type = card ? card.dataset.project : 'bubble';
      openProjectModal(type);
    });
  });

  // "View All" button on projects card header
  const projectsViewAll = document.getElementById('projects-view-all');
  if (projectsViewAll) {
    projectsViewAll.addEventListener('click', () => {
      openProjectModal('bubble');
    });
  }

  /* ==========================================================================
     9. WATCH INTRO: CINEMATIC VIDEO PLAYER
     ========================================================================== */
  const btnWatchIntro = document.getElementById('btn-watch-intro');
  const aboutViewMore = document.getElementById('about-view-more');

  if (btnWatchIntro) {
    btnWatchIntro.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.LumiCinematic) {
        window.LumiCinematic.open();
      } else {
        const m = document.getElementById('modal-intro');
        if (m) m.hidden = false;
      }
    });
  }

  if (aboutViewMore) {
    aboutViewMore.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.LumiCinematic) {
        window.LumiCinematic.open();
      } else {
        const m = document.getElementById('modal-intro');
        if (m) m.hidden = false;
      }
    });
  }

  // Hero "Explore My World" button
  const btnExplore = document.getElementById('btn-explore');
  if (btnExplore) {
    btnExplore.addEventListener('click', (e) => {
      e.preventDefault();
      const proj = document.getElementById('projects');
      if (proj) {
        proj.scrollIntoView({ behavior: 'smooth', block: 'center' });
        proj.classList.add('target-highlight');
        setTimeout(() => { proj.classList.remove('target-highlight'); }, 1200);
      }
      if (typeof setActiveNav === 'function') setActiveNav('projects');
      if (window.dreamAudio) window.dreamAudio.playChime('E5');
    });
  }

  /* ==========================================================================
     10. SCROLL-DRIVEN ORIGIN STORY TIMELINE & CONSTELLATION ENGINE
     ========================================================================== */
  const milestones = document.querySelectorAll('.milestone-item');
  const storySection = document.getElementById('story');
  const constellationPath = document.querySelector('.constellation-path');
  const travelingStarEl = document.getElementById('constellation-traveling-star');
  const travelingStarGlow = travelingStarEl ? travelingStarEl.querySelector('.traveling-star-glow') : null;
  const progressPill = document.getElementById('journey-progress-pill');
  const progressText = document.getElementById('journey-progress-text');
  const completionBadge = document.getElementById('journey-completion-badge');
  const storyPanel = document.getElementById('journey-story-panel');
  const journeyCard = document.querySelector('.card-journey');

  if (storySection && milestones.length > 0) {
    const CHAPTER_DATA = {
      1: {
        id: 1,
        chapterPill: 'Chapter I · The Wish',
        epoch: 'Dream Nebula',
        title: 'A Tiny Spark',
        quote: '"I was born from a forgotten wish in the Dream Nebula."',
        narrative: 'In the quietest folds of the starlight clouds, where forgotten wishes drift like sleeping embers, a single pure hope ignited. Not big enough to light a world yet, but warm enough to dream.',
        img: 'assets/journey1_spark_hd.jpg',
        relic: '⭐ Star Spark Core',
        realm: 'Dream Nebula',
        note: 'C5 (523 Hz)',
        noteName: 'C5',
        color: '#fcd34d',
        theme: 'step-1'
      },
      2: {
        id: 2,
        chapterPill: 'Chapter II · The Gateway',
        epoch: 'Cosmic Gateway',
        title: 'First Discovery',
        quote: '"I found a portal to the dream world."',
        narrative: 'Drifting past ancient constellation arches, Lumi noticed a shimmering spiral gateway leading directly into the Great Cloud Sea—where thoughts turn into floating islands.',
        img: 'assets/journey2_portal_hd.jpg',
        relic: '🌀 Astral Gateway Key',
        realm: 'Cosmic Gateway',
        note: 'E5 (659 Hz)',
        noteName: 'E5',
        color: '#38bdf8',
        theme: 'step-2'
      },
      3: {
        id: 3,
        chapterPill: 'Chapter III · The Loom',
        epoch: 'Starlight Forge',
        title: 'The Dream Machine',
        quote: '"I built my first machine to craft dreams."',
        narrative: 'With spun moonbeams and stardust brass gears, Lumi forged a magical machine capable of catching fearful night worries and turning them into calming, cozy dreamscapes.',
        img: 'assets/journey3_machine_hd.jpg',
        relic: '🪄 Starlight Loom Wand',
        realm: 'Starlight Forge',
        note: 'G5 (784 Hz)',
        noteName: 'G5',
        color: '#c084fc',
        theme: 'step-3'
      },
      4: {
        id: 4,
        chapterPill: 'Chapter IV · The Calling',
        epoch: 'Master Architect',
        title: 'Becoming a Dream Architect',
        quote: '"Now I travel across worlds helping dreams come true."',
        narrative: 'Crowned by the living stars, Lumi took the eternal vow of the Dream Architect: to watch over bedtime sanctuaries, kindle comforting nightlights, and tend the Memory Garden for all who sleep.',
        img: 'assets/journey4_architect_hd.jpg',
        relic: '👑 Architect Diadem',
        realm: 'Great Cloud Sea',
        note: 'C6 (1046 Hz)',
        noteName: 'C6',
        color: '#f472b6',
        theme: 'step-4'
      }
    };

    // 1. Visited chapters persistence (localStorage)
    const STORAGE_KEY = 'lumi_journey_visited_v1';
    let visitedChapters = new Set();
    let currentOpenChapter = null;
    let isSectionInView = false;

    function loadVisitedChapters() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            visitedChapters = new Set(parsed.map(Number));
          }
        }
      } catch (e) {
        console.warn('Lumi journey progress load error:', e);
      }
      updateProgressUI(false);
    }

    function saveVisitedChapters() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(visitedChapters)));
      } catch (e) {
        console.warn('Lumi journey progress save error:', e);
      }
    }

    function updateProgressUI(triggerCelebration = true) {
      // Update checkmarks on milestone pills
      milestones.forEach(m => {
        const step = parseInt(m.dataset.step, 10);
        const pill = m.querySelector('.milestone-chapter-pill');
        if (pill) {
          let check = pill.querySelector('.chapter-check');
          if (visitedChapters.has(step)) {
            m.classList.add('visited');
            if (!check) {
              check = document.createElement('span');
              check.className = 'chapter-check';
              check.textContent = '✓';
              check.setAttribute('aria-label', 'Explored');
              pill.appendChild(check);
            }
          }
        }
      });

      const count = visitedChapters.size;
      if (progressText) {
        if (count === 4) {
          progressText.textContent = '4/4 All Chapters Explored ✨';
          if (progressPill) progressPill.classList.add('completed');
        } else {
          progressText.textContent = `${count}/4 Chapters Explored`;
          if (progressPill) progressPill.classList.remove('completed');
        }
      }

      // Check final constellation completion
      if (count === 4) {
        if (journeyCard) journeyCard.classList.add('constellation-completed');
        if (completionBadge) completionBadge.style.display = 'inline-flex';

        if (triggerCelebration) {
          triggerConstellationCelebration();
        }
      }
    }

    function markChapterVisited(stepId) {
      const isFirstVisit = !visitedChapters.has(stepId);
      visitedChapters.add(stepId);
      saveVisitedChapters();
      updateProgressUI(isFirstVisit);
    }

    // 2. Celebratory Celestial Audio & Star Shimmer
    function triggerConstellationCelebration() {
      if (window.dreamAudio && typeof window.dreamAudio.playChime === 'function') {
        const chord = ['C5', 'E5', 'G5', 'C6'];
        chord.forEach((note, idx) => {
          setTimeout(() => {
            window.dreamAudio.playChime(note);
          }, idx * 120);
        });
      }
      if (speechBubble) {
        speechBubble.textContent = '🌟 Miracle! The full constellation is complete! Lumi is proud of you! ✨';
      }
    }

    // 3. Expandable Story Panel Controller
    function openChapterPanel(stepId, playAudio = true) {
      const data = CHAPTER_DATA[stepId];
      if (!data || !storyPanel) return;

      // Avoid opening same panel or duplicate chime
      if (currentOpenChapter === stepId && storyPanel.classList.contains('open')) {
        return;
      }

      currentOpenChapter = stepId;
      markChapterVisited(stepId);

      // Play chapter tone
      if (playAudio && window.dreamAudio && typeof window.dreamAudio.playChime === 'function') {
        window.dreamAudio.playChime(data.noteName || 'C5');
      }

      // Update active milestone styling
      milestones.forEach(m => {
        m.classList.toggle('active', parseInt(m.dataset.step, 10) === stepId);
      });

      if (speechBubble) {
        speechBubble.textContent = `📖 Story: "${data.title}" - ${data.quote}`;
      }

      // Populate story panel fields
      const chPill = storyPanel.querySelector('#story-panel-ch-pill');
      const epoch = storyPanel.querySelector('#story-panel-epoch');
      const img = storyPanel.querySelector('#story-panel-img');
      const relicBadge = storyPanel.querySelector('#story-panel-relic-badge');
      const title = storyPanel.querySelector('#story-panel-title');
      const quote = storyPanel.querySelector('#story-panel-quote');
      const narrative = storyPanel.querySelector('#story-panel-narrative');
      const realm = storyPanel.querySelector('#story-panel-realm');
      const relic = storyPanel.querySelector('#story-panel-relic');
      const note = storyPanel.querySelector('#story-panel-note');

      if (chPill) chPill.textContent = data.chapterPill;
      if (epoch) epoch.textContent = data.epoch;
      if (img) {
        img.src = data.img;
        img.alt = `${data.title} Artwork`;
      }
      if (relicBadge) relicBadge.textContent = data.relic;
      if (title) title.textContent = data.title;
      if (quote) quote.textContent = data.quote;
      if (narrative) narrative.textContent = data.narrative;
      if (realm) realm.textContent = data.realm;
      if (relic) relic.textContent = data.relic;
      if (note) note.textContent = data.note;

      // Distinct theme color attribute
      storyPanel.setAttribute('data-theme', data.theme);
      storyPanel.setAttribute('aria-hidden', 'false');
      storyPanel.classList.add('open');

      // Scroll into view gently if panel is partly outside viewport
      setTimeout(() => {
        const r = storyPanel.getBoundingClientRect();
        if (r.bottom > window.innerHeight) {
          storyPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 150);
    }

    function closeChapterPanel() {
      if (!storyPanel) return;
      storyPanel.classList.remove('open');
      storyPanel.setAttribute('aria-hidden', 'true');
      const prevStep = currentOpenChapter;
      currentOpenChapter = null;

      // Restore keyboard focus to closed milestone item
      if (prevStep) {
        const m = document.querySelector(`.milestone-step-${prevStep}`);
        if (m) m.focus();
      }
    }

    // Story Panel Close and Prev/Next buttons
    const storyPanelCloseBtn = document.getElementById('story-panel-close-btn');
    if (storyPanelCloseBtn) {
      storyPanelCloseBtn.addEventListener('click', () => closeChapterPanel());
    }

    const storyPanelPrevBtn = document.getElementById('story-panel-prev-btn');
    if (storyPanelPrevBtn) {
      storyPanelPrevBtn.addEventListener('click', () => {
        if (!currentOpenChapter) return;
        const prev = currentOpenChapter > 1 ? currentOpenChapter - 1 : 4;
        openChapterPanel(prev, true);
      });
    }

    const storyPanelNextBtn = document.getElementById('story-panel-next-btn');
    if (storyPanelNextBtn) {
      storyPanelNextBtn.addEventListener('click', () => {
        if (!currentOpenChapter) return;
        const next = currentOpenChapter < 4 ? currentOpenChapter + 1 : 1;
        openChapterPanel(next, true);
      });
    }

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && storyPanel && storyPanel.classList.contains('open')) {
        closeChapterPanel();
      }
    });

    // 4. Milestone item click & keyboard listeners
    milestones.forEach(m => {
      const step = parseInt(m.dataset.step, 10) || 1;

      const triggerOpen = () => {
        openChapterPanel(step, true);
      };

      m.addEventListener('click', triggerOpen);

      m.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerOpen();
        }
      });
    });

    // 5. Traveling Constellation Star Loop
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let starProgress = 0; // 0.0 to 1.0
    let lastStarTime = performance.now();
    let starAnimFrame = null;
    const STAR_CYCLE_MS = 18000; // 18 seconds for full slow, elegant curve traversal

    function animateTravelingStar(now) {
      if (!isSectionInView || prefersReducedMotion) {
        starAnimFrame = null;
        return;
      }

      const dt = now - lastStarTime;
      lastStarTime = now;
      starProgress = (starProgress + (dt / STAR_CYCLE_MS)) % 1;

      if (constellationPath && travelingStarEl) {
        const totalLen = typeof constellationPath.getTotalLength === 'function'
          ? constellationPath.getTotalLength()
          : 600;
        const currentDist = starProgress * totalLen;
        const pt = constellationPath.getPointAtLength(currentDist);

        travelingStarEl.setAttribute('transform', `translate(${pt.x.toFixed(2)}, ${pt.y.toFixed(2)})`);

        // Check proximity to chapter nodes for subtle approach pulse
        const nodes = [
          { step: 1, p: 0.0 },
          { step: 2, p: 0.333 },
          { step: 3, p: 0.667 },
          { step: 4, p: 1.0 }
        ];

        nodes.forEach(node => {
          const diff = Math.min(Math.abs(starProgress - node.p), 1 - Math.abs(starProgress - node.p));
          const mItem = document.querySelector(`.milestone-step-${node.step}`);
          if (mItem) {
            mItem.classList.toggle('node-approaching', diff < 0.075);
          }
        });

        // Dynamic star color grading
        if (travelingStarGlow) {
          if (starProgress < 0.25) travelingStarGlow.style.fill = '#fcd34d';
          else if (starProgress < 0.55) travelingStarGlow.style.fill = '#38bdf8';
          else if (starProgress < 0.85) travelingStarGlow.style.fill = '#c084fc';
          else travelingStarGlow.style.fill = '#f472b6';
        }
      }

      starAnimFrame = requestAnimationFrame(animateTravelingStar);
    }

    function startStarAnimation() {
      if (prefersReducedMotion || starAnimFrame) return;
      lastStarTime = performance.now();
      starAnimFrame = requestAnimationFrame(animateTravelingStar);
    }

    function stopStarAnimation() {
      if (starAnimFrame) {
        cancelAnimationFrame(starAnimFrame);
        starAnimFrame = null;
      }
    }

    // 6. Intersection Observer for lazy animation & in-view illumination
    const storyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isSectionInView = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (constellationPath) {
            constellationPath.style.stroke = 'var(--accent-gold)';
            constellationPath.style.filter = 'drop-shadow(0 0 6px var(--accent-gold-glow))';
          }

          milestones.forEach((m, idx) => {
            setTimeout(() => {
              m.classList.add('in-view');
            }, idx * 220);
          });

          startStarAnimation();
        } else {
          stopStarAnimation();
        }
      });
    }, { threshold: 0.2 });

    storyObserver.observe(storySection);

    // 7. Scroll to explore button
    const journeyScrollBtn = document.getElementById('journey-scroll-btn');
    if (journeyScrollBtn) {
      journeyScrollBtn.addEventListener('click', () => {
        storySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Also open chapter 1 if no chapter currently open
        if (!currentOpenChapter) {
          setTimeout(() => {
            openChapterPanel(1, true);
          }, 400);
        }
      });
    }

    // Initialize visited status from localStorage on startup
    loadVisitedChapters();
  }

  /* ==========================================================================
     11. NAVIGATION & SCROLLSPY (Robust Section Mapping & Smooth Tracking)
     ========================================================================== */
  const navItems = document.querySelectorAll('.nav-item');
  const navTargets = [
    { id: 'home', el: document.getElementById('hero-banner'), nav: document.getElementById('nav-home') },
    { id: 'about', el: document.getElementById('about-card') || document.getElementById('about'), nav: document.getElementById('nav-about') },
    { id: 'projects', el: document.getElementById('projects'), nav: document.getElementById('nav-projects') },
    { id: 'story', el: document.getElementById('story'), nav: document.getElementById('nav-story') },
    { id: 'secret', el: document.getElementById('secret'), nav: document.getElementById('nav-secret') }
  ];

  let isNavClicking = false;
  let navClickTimer = null;

  function setActiveNav(tabId) {
    navItems.forEach(n => {
      if (n.dataset.tab === tabId) {
        n.classList.add('active');
      } else {
        n.classList.remove('active');
      }
    });
  }

  // Nav click handling
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.dataset.tab;
      setActiveNav(tab);

      isNavClicking = true;
      if (navClickTimer) clearTimeout(navClickTimer);
      navClickTimer = setTimeout(() => { isNavClicking = false; }, 900);

      let targetEl = null;
      if (tab === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        targetEl = document.getElementById('hero-banner');
      } else if (tab === 'about') {
        targetEl = document.getElementById('about-card') || document.getElementById('about');
      } else if (tab === 'projects') {
        targetEl = document.getElementById('projects');
      } else if (tab === 'story') {
        targetEl = document.getElementById('story');
      } else if (tab === 'secret') {
        targetEl = document.getElementById('secret');
      }

      if (targetEl && tab !== 'home') {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      if (targetEl) {
        targetEl.classList.add('target-highlight');
        setTimeout(() => {
          targetEl.classList.remove('target-highlight');
        }, 1200);
      }
    });
  });

  // Accurate ScrollSpy to update active nav state based on viewport position
  function updateScrollSpy() {
    if (isNavClicking) return;

    // Top of page
    if (window.scrollY < 120) {
      setActiveNav('home');
      return;
    }

    // Bottom of page
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 90)) {
      setActiveNav('secret');
      return;
    }

    const scrollFocus = window.scrollY + (window.innerHeight * 0.38);
    let activeId = 'home';

    navTargets.forEach(target => {
      if (target.el) {
        const top = target.el.offsetTop;
        const height = target.el.offsetHeight;
        if (scrollFocus >= top && scrollFocus < top + height + 60) {
          activeId = target.id;
        }
      }
    });

    setActiveNav(activeId);
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateScrollSpy();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  /* ==========================================================================
     12. GUESTBOOK / CELESTIAL WISHES POST OFFICE
     ========================================================================== */
  const defaultWishes = [
    { author: "Dreamer Aya", text: "May all anxious hearts find gentle sleep and warm dreams tonight.", charm: "⭐", time: "Just now" },
    { author: "Kieran Cloudkeeper", text: "Lumi, please deliver a quiet starlight boat to the tired children.", charm: "🌙", time: "10m ago" },
    { author: "Little Ghost Bo", text: "I love the lullaby notes! May your wand never run out of stardust! ✨", charm: "🧸", time: "1h ago" },
    { author: "Starhopper Leo", text: "Hoping the night sky keeps guiding every little dreamer safely home.", charm: "🚀", time: "2h ago" },
    { author: "Mira the Stargazer", text: "May soft dreams weave comfort across every bedtime pillow tonight.", charm: "🔮", time: "3h ago" },
    { author: "Petal Pixie Nori", text: "Wishing sweet lavender scents and blossoming cozy smiles for everyone resting.", charm: "🌸", time: "4h ago" },
    { author: "Orion the Wanderer", text: "Turn every restless storm cloud into gentle glowing aurora lights.", charm: "✨", time: "5h ago" },
    { author: "Captain Zephyr", text: "Charted through the Dream Nebula today. The starlight machinery is humming beautifully!", charm: "🪐", time: "6h ago" },
    { author: "Nana Willow", text: "Blessings to all the sleepy little ones waking up to bright new adventures tomorrow.", charm: "🕯️", time: "7h ago" },
    { author: "Coral of Cloud Sea", text: "May the tide of peaceful dreams wash away all daytime worries.", charm: "🌊", time: "8h ago" },
    { author: "Painter Pipkin", text: "I painted the midnight sky purple and gold just like Lumi taught me!", charm: "🎨", time: "9h ago" },
    { author: "Stardust Weaver Talia", text: "Wrapping every little dream in silk starlight until the morning sun rises.", charm: "🌟", time: "10h ago" }
  ];

  const wishKey = 'lumi_celestial_wishes_v4';
  const getStoredWishes = () => {
    try {
      const data = localStorage.getItem(wishKey);
      let wishes = data ? JSON.parse(data) : null;
      if (!wishes || !Array.isArray(wishes) || wishes.length < 12) {
        wishes = defaultWishes;
      }
      // Auto-purge any test wishes like "vcfcc" or "vvv"
      wishes = wishes.filter(w => {
        const author = (w.author || '').trim().toLowerCase();
        const text = (w.text || '').trim().toLowerCase();
        return author !== 'vcfcc' && text !== 'vvv';
      });
      localStorage.setItem(wishKey, JSON.stringify(wishes));
      return wishes;
    } catch {
      return defaultWishes;
    }
  };

  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  const openWishModalBtn = document.getElementById('open-wish-modal-btn');
  const modalWish = document.getElementById('modal-wish');
  const wishForm = document.getElementById('wish-form');

  const triggerOpenWishModal = () => {
    if (window.dreamAudio) window.dreamAudio.playChime('C5');
    if (modalWish) {
      modalWish.hidden = false;
      const input = document.getElementById('wish-author');
      if (input) input.focus();
    }
  };

  const renderWishes = () => {
    const stream = document.getElementById('wishes-stream');
    if (!stream) return;
    const wishes = getStoredWishes();

    // Render clean wish cards (without cross and without inline make-a-wish tile)
    stream.innerHTML = wishes.map((w, index) => `
      <div class="wish-tile" data-index="${index}">
        <div class="wish-tile-top">
          <span class="wish-author">${w.charm} ${escapeHtml(w.author)}</span>
          <span class="wish-tile-time">${escapeHtml(w.time)}</span>
        </div>
        <p class="wish-tile-text">"${escapeHtml(w.text)}"</p>
      </div>
    `).join('');
  };
  renderWishes();

  if (openWishModalBtn) {
    openWishModalBtn.addEventListener('click', triggerOpenWishModal);
  }

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = document.getElementById('wish-author').value.trim();
      const text = document.getElementById('wish-text').value.trim();
      const charm = (document.querySelector('input[name="charm"]:checked') || {}).value || '⭐';

      if (!author || !text) return;

      const newWish = { author, text, charm, time: "Just now" };
      const current = getStoredWishes();
      current.unshift(newWish);
      try {
        localStorage.setItem(wishKey, JSON.stringify(current));
      } catch (err) { }

      renderWishes();
      wishForm.reset();
      if (modalWish) modalWish.hidden = true;

      if (window.dreamAudio) window.dreamAudio.playUnlockSound();
      if (speechBubble) speechBubble.textContent = "✨ Your wish has flown into the constellation!";
    });
  }

  /* ==========================================================================
     13. SEARCH BAR WITH INSTANT DREAM FILTER
     ========================================================================== */
  const searchInput = document.getElementById('dream-search');
  const searchDropdown = document.getElementById('search-dropdown');

  const searchableIndex = [
    { title: "Dream Bubble Maker", type: "Project", section: "#projects" },
    { title: "Nightlight Guardian", type: "Project", section: "#projects" },
    { title: "Memory Garden", type: "Project", section: "#projects" },
    { title: "A Tiny Spark (Origin)", type: "Story", section: "#story" },
    { title: "The Dream Machine", type: "Story", section: "#story" },
    { title: "The Hidden Room", type: "Secret", section: "#secret" },
    { title: "Star Wand", type: "Quick Fact", section: "#quickfacts-card" },
    { title: "Dream Spirit", type: "Species", section: "#quickfacts-card" }
  ];

  if (searchInput && searchDropdown) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        searchDropdown.hidden = true;
        return;
      }
      const matches = searchableIndex.filter(item =>
        item.title.toLowerCase().includes(q) || item.type.toLowerCase().includes(q)
      );

      if (matches.length > 0) {
        searchDropdown.innerHTML = matches.map(m => `
          <div class="search-dropdown-item" data-target="${m.section}">
            <span><strong>${m.title}</strong></span>
            <small style="color:var(--accent-purple);">${m.type}</small>
          </div>
        `).join('');
        searchDropdown.hidden = false;

        searchDropdown.querySelectorAll('.search-dropdown-item').forEach(item => {
          item.addEventListener('click', () => {
            const targetId = item.dataset.target;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              targetEl.classList.add('target-highlight');
              setTimeout(() => { targetEl.classList.remove('target-highlight'); }, 1200);
            }
            searchDropdown.hidden = true;
            searchInput.value = '';
          });
        });
      } else {
        searchDropdown.innerHTML = `<div class="search-dropdown-item" style="color:var(--text-dim);">No dreams found. Create one in the guestbook!</div>`;
        searchDropdown.hidden = false;
      }
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.hidden = true;
      }
    });
  }

  /* ==========================================================================
     14. GENERAL MODAL CLOSE HANDLERS
     ========================================================================== */
  function attachModalCloseEvents() {
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.close;
        const modal = document.getElementById(modalId);
        if (modal) {
          if (modalId === 'modal-intro' && window.LumiCinematic) {
            window.LumiCinematic.close();
          } else {
            if (modalId === 'modal-project') {
              if (window.DreamscapeCreator && typeof window.DreamscapeCreator.destroy === 'function') {
                window.DreamscapeCreator.destroy();
              }
              if (window.NightlightGuardian && typeof window.NightlightGuardian.destroy === 'function') {
                window.NightlightGuardian.destroy();
              }
              if (window.MemoryGarden && typeof window.MemoryGarden.destroy === 'function') {
                window.MemoryGarden.destroy();
              }
            }
            if (modalId === 'modal-easter-egg') {
              if (typeof stopSecretMusicBoxUI === 'function') stopSecretMusicBoxUI();
            }
            modal.hidden = true;
            document.body.style.overflow = '';
          }
        }
      });
    });
  }
  attachModalCloseEvents();

  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        if (modal.id === 'modal-intro' && window.LumiCinematic) {
          window.LumiCinematic.close();
        } else {
          if (modal.id === 'modal-project') {
            if (window.DreamscapeCreator && typeof window.DreamscapeCreator.destroy === 'function') {
              window.DreamscapeCreator.destroy();
            }
            if (window.NightlightGuardian && typeof window.NightlightGuardian.destroy === 'function') {
              window.NightlightGuardian.destroy();
            }
            if (window.MemoryGarden && typeof window.MemoryGarden.destroy === 'function') {
              window.MemoryGarden.destroy();
            }
          }
          if (modal.id === 'modal-easter-egg') {
            if (typeof stopSecretMusicBoxUI === 'function') stopSecretMusicBoxUI();
          }
          modal.hidden = true;
          document.body.style.overflow = '';
        }
      }
    });
  });

  // ESC key closes any open modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (typeof stopSecretMusicBoxUI === 'function') {
        stopSecretMusicBoxUI();
      }
      if (window.DreamscapeCreator && typeof window.DreamscapeCreator.destroy === 'function') {
        window.DreamscapeCreator.destroy();
      }
      if (window.NightlightGuardian && typeof window.NightlightGuardian.destroy === 'function') {
        window.NightlightGuardian.destroy();
      }
      if (window.MemoryGarden && typeof window.MemoryGarden.destroy === 'function') {
        window.MemoryGarden.destroy();
      }
      if (window.LumiCinematic && document.getElementById('modal-intro') && !document.getElementById('modal-intro').hidden) {
        window.LumiCinematic.close();
      }
      document.querySelectorAll('.modal-backdrop:not([hidden])').forEach(m => {
        m.hidden = true;
      });
      document.body.style.overflow = '';
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLumiApp);
} else {
  initLumiApp();
}
