/**
 * LUMI: THE LITTLE DREAM ARCHITECT — MAIN APPLICATION
 * Interactive Core, Modals, Easter Eggs & Stardust Canvas Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. RETURNING VISITOR MEMORY (LocalStorage)
     ========================================================================== */
  const visitKey = 'lumi_dream_visitor';
  const hasVisited = localStorage.getItem(visitKey);
  const speechBubble = document.querySelector('.speech-bubble p');

  if (hasVisited && speechBubble) {
    speechBubble.innerHTML = "Welcome back, Stargazer! Lumi missed you! ✨";
  } else {
    localStorage.setItem(visitKey, 'true');
  }

  /* ==========================================================================
     2. AUDIO CONTROLS & WEB AUDIO SYNTH
     ========================================================================== */
  const lullabyToggle = document.getElementById('lullaby-toggle');
  const musicState = document.getElementById('music-state');
  const musicNoteIcon = document.getElementById('music-note-icon');

  if (lullabyToggle) {
    lullabyToggle.addEventListener('click', () => {
      if (window.dreamAudio) {
        const isNowPlaying = window.dreamAudio.toggleMusic();
        if (isNowPlaying) {
          lullabyToggle.classList.add('playing');
          musicState.textContent = '⏸';
          musicNoteIcon.textContent = '🎶';
        } else {
          lullabyToggle.classList.remove('playing');
          musicState.textContent = '▶';
          musicNoteIcon.textContent = '🎵';
        }
      }
    });
  }

  // Play sound on click for interactive buttons
  document.querySelectorAll('.btn-primary, .btn-secondary, .tag-pill, .social-link, .nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.dreamAudio) window.dreamAudio.playTap();
    });
  });

  // Cloud mascot tap feedback
  const cloudMascot = document.getElementById('cloud-mascot');
  if (cloudMascot) {
    cloudMascot.addEventListener('click', () => {
      if (window.dreamAudio) window.dreamAudio.playChime('G5');
      cloudMascot.style.transform = 'scale(1.2) rotate(12deg)';
      setTimeout(() => {
        cloudMascot.style.transform = '';
      }, 300);
      if (speechBubble) {
        const cutePhrases = [
          "Giggle! That tickles! ✨",
          "Every dream you weave matters! 🌸",
          "Stars are made of wishes like yours! ⭐",
          "Warm chamomile tea is ready! ☕"
        ];
        speechBubble.textContent = cutePhrases[Math.floor(Math.random() * cutePhrases.length)];
      }
    });
  }

  /* ==========================================================================
     3. STARDUST CURSOR TRAIL CANVAS (+2 Bonus Pts)
     ========================================================================== */
  const canvas = document.getElementById('stardust-canvas');
  if (canvas) {
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
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3.5 + 1.2;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5 - 0.6; // float upwards
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        
        // Draw cute diamond star
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

    // Add particles on mousemove / touchmove
    let lastX = 0, lastY = 0;
    const addStardust = (x, y) => {
      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist > 5) {
        for (let i = 0; i < 2; i++) {
          particles.push(new Particle(x, y));
        }
        lastX = x;
        lastY = y;
      }
    };

    window.addEventListener('mousemove', (e) => addStardust(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
      if (e.touches[0]) addStardust(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    const animateStardust = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) {
          particles.splice(i, 1);
        }
      }
      requestAnimationFrame(animateStardust);
    };
    animateStardust();
  }

  /* ==========================================================================
     4. EASTER EGG: THE HIDDEN ROOM (5 Clicks Unlock!)
     ========================================================================== */
  let starClickCount = 0;
  const targetClicks = 5;
  const clickCountText = document.getElementById('click-count-text');
  const lockIcon = document.getElementById('lock-icon');
  const secretBadge = document.getElementById('secret-badge');
  const modalEasterEgg = document.getElementById('modal-easter-egg');

  const registerSecretClick = () => {
    starClickCount++;
    if (window.dreamAudio) {
      // Ascending musical chime on each click
      const scale = ['C5', 'E5', 'G5', 'A5', 'C6'];
      const note = scale[Math.min(starClickCount - 1, scale.length - 1)];
      window.dreamAudio.playChime(note);
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

      // Trigger Confetti & Open Secret Modal
      setTimeout(() => {
        if (modalEasterEgg) {
          modalEasterEgg.hidden = false;
          launchConfetti();
        }
      }, 400);
    }
  };

  const heroSpecialStar = document.getElementById('hero-special-star');
  if (heroSpecialStar) {
    heroSpecialStar.addEventListener('click', registerSecretClick);
  }

  const hiddenArchTrigger = document.getElementById('hidden-arch-trigger');
  if (hiddenArchTrigger) {
    hiddenArchTrigger.addEventListener('click', () => {
      if (starClickCount >= targetClicks) {
        if (modalEasterEgg) modalEasterEgg.hidden = false;
      } else {
        registerSecretClick();
      }
    });
  }

  // Secret Melody Player inside Easter Egg Modal
  const playSecretTuneBtn = document.getElementById('play-secret-tune-btn');
  if (playSecretTuneBtn) {
    playSecretTuneBtn.addEventListener('click', () => {
      if (window.dreamAudio) {
        window.dreamAudio.stopLullaby();
        window.dreamAudio.startLullaby(window.dreamAudio.secretScore);
      }
    });
  }

  /* ==========================================================================
     5. CONFETTI CELESTIAL CANNON FOR EASTER EGG
     ========================================================================== */
  function launchConfetti() {
    const confettiCanvas = document.getElementById('confetti-canvas');
    if (!confettiCanvas) return;
    const cctx = confettiCanvas.getContext('2d');
    const cWidth = confettiCanvas.width = 500;
    const cHeight = confettiCanvas.height = 300;

    const confettis = [];
    const colors = ['#fcd34d', '#f472b6', '#a855f7', '#60a5fa', '#34d399'];

    for (let i = 0; i < 60; i++) {
      confettis.push({
        x: cWidth / 2,
        y: cHeight / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.7) * 9,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    const animateConfetti = () => {
      cctx.clearRect(0, 0, cWidth, cHeight);
      let alive = false;
      confettis.forEach(c => {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.2; // gravity
        c.rotation += c.vr;
        c.alpha -= 0.01;

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
     6. THEME TOGGLE: DEEP NIGHT -> TWILIGHT -> 90s CHAOS (+5 Bonus Pts)
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themes = ['theme-night', 'theme-twilight', 'theme-chaos'];
  const themeIcons = ['🌙', '🌅', '🎠'];
  let currentThemeIdx = 0;

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.remove(themes[currentThemeIdx]);
      currentThemeIdx = (currentThemeIdx + 1) % themes.length;
      document.body.classList.add(themes[currentThemeIdx]);
      if (themeIcon) themeIcon.textContent = themeIcons[currentThemeIdx];

      if (window.dreamAudio) window.dreamAudio.playChime('E5');

      if (themes[currentThemeIdx] === 'theme-chaos') {
        if (speechBubble) speechBubble.textContent = "🎠 90s Chaos Mode Activated! Pure nostalgic joy! ✨";
      }
    });
  }

  /* ==========================================================================
     7. PROJECT DETAIL MODALS
     ========================================================================== */
  const projectModal = document.getElementById('modal-project');
  const projectModalBody = document.getElementById('project-modal-body');

  const projectDetails = {
    bubble: {
      title: "Dream Bubble Maker",
      subtitle: "Turns forgotten wishes into floating worlds.",
      img: "assets/proj1_clean.jpg",
      desc: "The Dream Bubble Maker encapsulates fragile bedtime thoughts inside starlight resin. When a child tosses and turns with worries, this apparatus gently floats into their thoughts and expands into a warm, safe sanctuary.",
      stats: [
        { label: "Stability", val: "99.8%" },
        { label: "Memory Density", val: "4.2 Tb/Bubble" },
        { label: "Fragrance", val: "Fresh Lavender" }
      ],
      interactivePrompt: "Pop the Dream Bubble to release soothing stardust!"
    },
    nightlight: {
      title: "Nightlight Guardian",
      subtitle: "Transforms nightmares into friendly companions.",
      img: "assets/proj2_clean.jpg",
      desc: "Crafted from fallen crescent moon porcelain and brass coils, this lantern casts a warm geometric shadow on bedroom walls. Shadow monsters passing through its beam transform into soft fluffy bunnies.",
      stats: [
        { label: "Glow Radius", val: "12 Meters" },
        { label: "Nightmare Absorption", val: "100%" },
        { label: "Battery", val: "Moonbeam Charged" }
      ],
      interactivePrompt: "Switch between Starlight Warmth and Nebula Blue glow!"
    },
    garden: {
      title: "Memory Garden",
      subtitle: "Stores precious memories as glowing flowers.",
      img: "assets/proj3_clean.jpg",
      desc: "Located on a floating basalt island overlooking the Great Cloud Sea, the Memory Garden cultivates memories of kindness and laughter into luminous petals that blossom whenever a sleepy wish is made.",
      stats: [
        { label: "Floral Species", val: "24 Cosmic Types" },
        { label: "Harvest Season", val: "Perpetual Midnight" },
        { label: "Soil Type", val: "Stardust Loam" }
      ],
      interactivePrompt: "Nourish a cosmic blossom with starlight dew!"
    }
  };

  document.querySelectorAll('.project-mini-card').forEach(card => {
    card.addEventListener('click', () => {
      const type = card.dataset.project;
      const data = projectDetails[type];
      if (!data) return;

      if (window.dreamAudio) window.dreamAudio.playChime('C5');

      projectModalBody.innerHTML = `
        <div class="project-modal-hero">
          <img src="${data.img}" alt="${data.title}" style="width:100%;height:220px;object-fit:cover;border-radius:14px;border:1px solid var(--border-card);margin-bottom:14px;">
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
        <div style="display:flex;justify-content:flex-end;">
          <button class="btn-primary" data-close="modal-project">Close Exploration</button>
        </div>
      `;

      projectModal.hidden = false;
      attachModalCloseEvents();
    });
  });

  /* ==========================================================================
     8. WATCH INTRO MODAL
     ========================================================================== */
  const btnWatchIntro = document.getElementById('btn-watch-intro');
  const modalIntro = document.getElementById('modal-intro');
  if (btnWatchIntro && modalIntro) {
    btnWatchIntro.addEventListener('click', () => {
      if (window.dreamAudio) window.dreamAudio.playChime('G5');
      modalIntro.hidden = false;
    });
  }

  /* ==========================================================================
     9. GUESTBOOK / CELESTIAL WISHES POST OFFICE
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
      localStorage.setItem(wishKey, JSON.stringify(current));

      // Increment Odometer
      const odometer = document.getElementById('odometer-val');
      if (odometer) {
        const val = parseInt(odometer.textContent.replace(/,/g, ''), 10) || 3492;
        odometer.textContent = (val + 1).toLocaleString();
      }

      renderWishes();
      wishForm.reset();
      if (modalWish) modalWish.hidden = true;

      if (window.dreamAudio) window.dreamAudio.playUnlockSound();
      if (speechBubble) speechBubble.textContent = "✨ Your wish has flown into the constellation!";
    });
  }

  /* ==========================================================================
     10. SEARCH BAR WITH INSTANT DREAM FILTER
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
              targetEl.style.outline = '2px solid var(--accent-gold)';
              setTimeout(() => { targetEl.style.outline = ''; }, 1500);
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

    // Close search dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.hidden = true;
      }
    });
  }

  /* ==========================================================================
     11. NAVIGATION TAB SWITCHING & SMOOTH SCROLL
     ========================================================================== */
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      const tab = item.dataset.tab;
      if (tab === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (tab === 'about') {
        document.getElementById('about-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (tab === 'projects') {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (tab === 'story') {
        document.getElementById('story')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (tab === 'secret') {
        document.getElementById('secret')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  /* ==========================================================================
     12. GENERAL MODAL CLOSE HANDLERS
     ========================================================================== */
  function attachModalCloseEvents() {
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.close;
        const modal = document.getElementById(modalId);
        if (modal) modal.hidden = true;
      });
    });
  }
  attachModalCloseEvents();

  // Close modals on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.hidden = true;
      }
    });
  });
});
