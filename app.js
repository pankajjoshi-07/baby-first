/**
 * LUMI: THE LITTLE DREAM ARCHITECT — MAIN APPLICATION
 * Interactive Core, Modals, Easter Eggs, Parallax & Stardust Canvas Engine
 */

document.addEventListener('DOMContentLoaded', () => {
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
     4. LAYERED BACKGROUND PARALLAX
     ========================================================================== */
  const heroBanner = document.getElementById('hero-banner');
  const heroParallaxBg = document.getElementById('hero-parallax-bg');
  const heroZone = document.getElementById('hero-interactive-zone');

  if (heroBanner && !prefersReducedMotion) {
    let ticking = false;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    heroBanner.addEventListener('mousemove', (e) => {
      const rect = heroBanner.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = relX * 24;
      targetY = relY * 16;

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
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      if (heroParallaxBg) {
        heroParallaxBg.style.transform = `translate(${currentX * 0.4}px, ${currentY * 0.4}px)`;
      }
      if (heroZone) {
        heroZone.style.transform = `translate(${currentX * -0.5}px, ${currentY * -0.5}px)`;
      }

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
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

  /* ==========================================================================
     6. EASTER EGG: THE HIDDEN ROOM (5 Clicks Unlock!)
     ========================================================================== */
  let starClickCount = 0;
  const targetClicks = 5;
  const clickCountText = document.getElementById('click-count-text');
  const lockIcon = document.getElementById('lock-icon');
  const secretBadge = document.getElementById('secret-badge');
  const modalEasterEgg = document.getElementById('modal-easter-egg');

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
      if (modalEasterEgg) modalEasterEgg.hidden = false;
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

    // When 5 clicks reached: UNLOCK!
    if (starClickCount >= targetClicks) {
      if (lockIcon) lockIcon.textContent = '🔓';
      if (secretBadge) secretBadge.textContent = '🌟';
      if (clickCountText) clickCountText.textContent = '✨ UNLOCKED!';

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
  }

  const hiddenArchTrigger = document.getElementById('hidden-arch-trigger');
  if (hiddenArchTrigger) {
    hiddenArchTrigger.addEventListener('click', (e) => {
      registerSecretClick(e);
    });
  }

  // Secret Melody Player inside Easter Egg Modal
  const playSecretTuneBtn = document.getElementById('play-secret-tune-btn');
  if (playSecretTuneBtn) {
    playSecretTuneBtn.addEventListener('click', () => {
      if (window.dreamAudio) {
        window.dreamAudio.stopLullaby();
        window.dreamAudio.startLullaby(window.dreamAudio.secretScore);
        playSecretTuneBtn.innerHTML = '<span>🎶 Playing "Lumi\'s Midnight Waltz"...</span>';
        setTimeout(() => {
          playSecretTuneBtn.innerHTML = '<span>🎵 Replay Secret Melody</span>';
        }, 7000);
      }
    });
  }

  const resetSecretBtn = document.getElementById('reset-secret-btn');
  if (resetSecretBtn) {
    resetSecretBtn.addEventListener('click', () => {
      starClickCount = 0;
      if (lockIcon) lockIcon.textContent = '🔒';
      if (secretBadge) secretBadge.textContent = '⭐';
      if (clickCountText) clickCountText.textContent = `0 / ${targetClicks} clicks`;
      if (modalEasterEgg) modalEasterEgg.hidden = true;
      if (window.dreamAudio) window.dreamAudio.playTap();
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
      title: "Dream Bubble Maker",
      subtitle: "Turns forgotten wishes into floating worlds.",
      img: "assets/proj1_bubble_hd.jpg",
      desc: "The Dream Bubble Maker encapsulates fragile bedtime thoughts inside starlight resin. When a child tosses and turns with worries, this apparatus gently floats into their thoughts and expands into a warm, safe sanctuary.",
      stats: [
        { label: "Stability", val: "99.8%" },
        { label: "Memory Density", val: "4.2 Tb/Bubble" },
        { label: "Fragrance", val: "Fresh Lavender" }
      ],
      interactiveType: "bubbleToy",
      toyTitle: "🫧 Interactive Workshop: Dream Bubble Blower",
      toyInstruction: "Tap the button below or click anywhere in the cloud chamber to spawn floating dream bubbles. Click any bubble to pop it with a soothing chime!"
    },
    nightlight: {
      id: 'nightlight',
      title: "Nightlight Guardian",
      subtitle: "Transforms nightmares into friendly companions.",
      img: "assets/proj2_lantern_hd.jpg",
      desc: "Crafted from fallen crescent moon porcelain and brass coils, this lantern casts a warm geometric shadow on bedroom walls. Shadow monsters passing through its beam transform into soft fluffy bunnies.",
      stats: [
        { label: "Glow Radius", val: "12 Meters" },
        { label: "Nightmare Absorption", val: "100%" },
        { label: "Battery", val: "Moonbeam Charged" }
      ],
      interactiveType: "lanternToy",
      toyTitle: "💡 Interactive Workshop: Glow Spectrum Switch",
      toyInstruction: "Toggle the lantern between Cozy Honey Amber and Cosmic Nebula Blue to see the ambient shadow transform in real-time."
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
      toyTitle: "🌸 Interactive Workshop: Stardust Soil Nursery",
      toyInstruction: "Water the cosmic stardust soil to blossom glowing memories of joy and laughter."
    }
  };

  function openProjectModal(type) {
    const data = projectDetails[type] || projectDetails.bubble;
    if (window.dreamAudio) window.dreamAudio.playChime('C5');

    projectModalBody.innerHTML = `
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
      <div style="background:rgba(15,18,44,0.7);border:1px solid rgba(168,85,247,0.3);border-radius:12px;padding:14px;margin-bottom:20px;">
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

    // Mount specific interactive toy
    mountInteractiveToy(data.interactiveType);

    projectModal.hidden = false;
    attachModalCloseEvents();
  }

  function mountInteractiveToy(type) {
    const container = document.getElementById('project-toy-container');
    if (!container) return;

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
      container.innerHTML = `
        <div style="display:flex;gap:12px;align-items:center;">
          <button id="btn-glow-amber" class="btn-primary" style="font-size:0.78rem;padding:6px 14px;">
            🌟 Warm Amber
          </button>
          <button id="btn-glow-blue" class="btn-secondary" style="font-size:0.78rem;padding:6px 14px;">
            🌌 Nebula Blue
          </button>
        </div>
      `;

      const heroImg = document.getElementById('project-modal-hero-img');
      const glowLayer = document.getElementById('project-glow-layer');
      const btnAmber = document.getElementById('btn-glow-amber');
      const btnBlue = document.getElementById('btn-glow-blue');

      btnAmber.addEventListener('click', () => {
        if (window.dreamAudio) window.dreamAudio.playChime('E5');
        if (heroImg) heroImg.style.filter = 'sepia(0.3) saturate(1.4)';
        if (glowLayer) glowLayer.style.background = 'radial-gradient(circle at 50% 50%, rgba(252,211,77,0.3) 0%, transparent 75%)';
      });

      btnBlue.addEventListener('click', () => {
        if (window.dreamAudio) window.dreamAudio.playChime('A5');
        if (heroImg) heroImg.style.filter = 'hue-rotate(180deg) saturate(1.3)';
        if (glowLayer) glowLayer.style.background = 'radial-gradient(circle at 50% 50%, rgba(96,165,250,0.3) 0%, transparent 75%)';
      });
    }
    else if (type === 'gardenToy') {
      container.innerHTML = `
        <div style="width:100%;display:flex;flex-direction:column;align-items:center;gap:8px;">
          <div id="garden-bloom-row" style="display:flex;gap:16px;font-size:1.6rem;min-height:36px;align-items:center;">
            <span>🌱</span><span>🌱</span><span>🌱</span>
          </div>
          <button id="btn-water-garden" class="btn-secondary" style="font-size:0.78rem;padding:6px 14px;">
            ✨ Nourish with Stardust
          </button>
        </div>
      `;

      const bloomRow = document.getElementById('garden-bloom-row');
      const waterBtn = document.getElementById('btn-water-garden');
      let bloomed = false;

      waterBtn.addEventListener('click', () => {
        if (window.dreamAudio) window.dreamAudio.playChime('C6');
        bloomed = !bloomed;
        if (bloomed) {
          bloomRow.innerHTML = `
            <span style="animation:gentle-bob 1s ease infinite;">🌸</span>
            <span style="animation:gentle-bob 1s ease 0.2s infinite;">🌺</span>
            <span style="animation:gentle-bob 1s ease 0.4s infinite;">🌼</span>
          `;
          waterBtn.textContent = '✨ Blooms are Radiant! (Reset)';
        } else {
          bloomRow.innerHTML = '<span>🌱</span><span>🌱</span><span>🌱</span>';
          waterBtn.textContent = '✨ Nourish with Stardust';
        }
      });
    }
  }

  // Open modal when clicking project mini cards
  document.querySelectorAll('.project-mini-card').forEach(card => {
    card.addEventListener('click', () => {
      const type = card.dataset.project;
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
    });
  }

  /* ==========================================================================
     10. SCROLL-DRIVEN ORIGIN STORY TIMELINE ANIMATION
     ========================================================================== */
  const milestones = document.querySelectorAll('.milestone-item');
  const storySection = document.getElementById('story');
  const constellationPath = document.querySelector('.constellation-path');

  if (storySection && milestones.length > 0) {
    const storyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate constellation path line
          if (constellationPath) {
            constellationPath.style.stroke = 'var(--accent-gold)';
            constellationPath.style.filter = 'drop-shadow(0 0 6px var(--accent-gold-glow))';
          }

          // Sequentially illuminate milestones
          milestones.forEach((m, idx) => {
            setTimeout(() => {
              m.classList.add('in-view');
              if (idx === 0) m.classList.add('active');
            }, idx * 300);
          });
        }
      });
    }, { threshold: 0.25 });

    storyObserver.observe(storySection);

    // Interactive milestone click
    milestones.forEach(m => {
      m.addEventListener('click', () => {
        milestones.forEach(node => node.classList.remove('active'));
        m.classList.add('active');
        if (window.dreamAudio) {
          const step = parseInt(m.dataset.step, 10) || 1;
          const notes = ['C5', 'E5', 'G5', 'C6'];
          window.dreamAudio.playChime(notes[step - 1] || 'C5');
        }
        const title = m.querySelector('.milestone-title')?.textContent || '';
        if (speechBubble) {
          speechBubble.textContent = `📖 Story: "${title}" - Lumi's journey continues! ✨`;
        }
      });
    });

    const journeyScrollBtn = document.getElementById('journey-scroll-btn');
    if (journeyScrollBtn) {
      journeyScrollBtn.addEventListener('click', () => {
        storySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  /* ==========================================================================
     11. NAVIGATION & SCROLLSPY
     ========================================================================== */
  const navItems = document.querySelectorAll('.nav-item');
  const sections = [
    { id: 'home', el: document.getElementById('home'), nav: document.getElementById('nav-home') },
    { id: 'about', el: document.getElementById('about'), nav: document.getElementById('nav-about') },
    { id: 'projects', el: document.getElementById('projects'), nav: document.getElementById('nav-projects') },
    { id: 'story', el: document.getElementById('story'), nav: document.getElementById('nav-story') },
    { id: 'secret', el: document.getElementById('secret'), nav: document.getElementById('nav-secret') }
  ];

  // Nav click handling
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      const tab = item.dataset.tab;
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

      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl.classList.add('target-highlight');
        setTimeout(() => {
          targetEl.classList.remove('target-highlight');
        }, 1200);
      }
    });
  });

  // ScrollSpy with IntersectionObserver
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const matched = sections.find(s => s.id === id);
        if (matched && matched.nav) {
          navItems.forEach(n => n.classList.remove('active'));
          matched.nav.classList.add('active');
        }
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => {
    if (s.el) spyObserver.observe(s.el);
  });

  /* ==========================================================================
     12. GUESTBOOK / CELESTIAL WISHES POST OFFICE
     ========================================================================== */
  const defaultWishes = [
    { author: "Dreamer Aya", text: "May all anxious hearts find gentle sleep and warm dreams tonight.", charm: "⭐", time: "Just now" },
    { author: "Kieran Cloudkeeper", text: "Lumi, please deliver a quiet starlight boat to the tired children.", charm: "🌙", time: "10m ago" },
    { author: "Little Ghost Bo", text: "I love the lullaby notes! May your wand never run out of stardust! ✨", charm: "🧸", time: "1h ago" }
  ];

  const wishKey = 'lumi_celestial_wishes';
  const getStoredWishes = () => {
    try {
      const data = localStorage.getItem(wishKey);
      return data ? JSON.parse(data) : defaultWishes;
    } catch {
      return defaultWishes;
    }
  };

  const renderWishes = () => {
    const stream = document.getElementById('wishes-stream');
    if (!stream) return;
    const wishes = getStoredWishes();
    stream.innerHTML = wishes.map(w => `
      <div class="wish-tile">
        <div class="wish-tile-top">
          <span>${w.charm} ${w.author}</span>
          <span class="wish-tile-time">${w.time}</span>
        </div>
        <p class="wish-tile-text">"${w.text}"</p>
      </div>
    `).join('');
  };
  renderWishes();

  const openWishModalBtn = document.getElementById('open-wish-modal-btn');
  const modalWish = document.getElementById('modal-wish');
  const wishForm = document.getElementById('wish-form');

  if (openWishModalBtn && modalWish) {
    openWishModalBtn.addEventListener('click', () => {
      if (window.dreamAudio) window.dreamAudio.playChime('C5');
      modalWish.hidden = false;
    });
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
          modal.hidden = true;
          document.body.style.overflow = '';
        }
      }
    });
  });

  // ESC key closes any open modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (window.LumiCinematic && document.getElementById('modal-intro') && !document.getElementById('modal-intro').hidden) {
        window.LumiCinematic.close();
      }
      document.querySelectorAll('.modal-backdrop:not([hidden])').forEach(m => {
        m.hidden = true;
      });
      document.body.style.overflow = '';
    }
  });
});
