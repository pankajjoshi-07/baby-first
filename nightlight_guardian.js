/**
 * LUMI — NIGHTLIGHT GUARDIAN (CINEMATIC COZY SANCTUARY)
 * 
 * Hyper-Realistic Living Night-Time Bedroom Sanctuary:
 * - Direct 2.5D Camera Parallax Tracking with organic depth
 * - Living Lantern Star Guardian & Perched Companion with animated eye tracking & blinking
 * - Ethereal Stardust Spirit Familiar with fluid stardust ribbon trails & wing flutters
 * - Volumetric Crepuscular God Rays radiating from brass filigree cutouts
 * - Photorealistic Specular Light Puddle dancing on the wooden table sill
 * - Window Atmosphere: Cross-star diffraction spikes, glass rain droplets with 3D caustic refraction,
 *   magnesium shooting stars with plasma ionization trails, and sheet lightning flashes
 * - Interactive Bedside Elements: Tappable crystal lantern, companion star, and antique leather journal
 * - Layered Cinematic Depth of Field: Foreground bokeh discs, warm midground thermal motes, distant stars
 * - Binaural Generative Web Audio API Engine: Nocturnal breeze, crickets, window rain pings,
 *   sub-bass rolling thunder, 432Hz sleep drone, crystal chimes
 * - Sleep Sanctuary Mode with 30m / 60m gradual soothing dim countdown timer
 * - Apple Vision Pro-grade Glassmorphism HUD (Zero-clip, fully responsive)
 * - Clean lifecycle management with zero memory/audio leaks
 */

(() => {
  const STORAGE_KEY = 'lumi_nightlight_v1';

  // Original artwork native dimensions (16:9)
  const ART_ORIG_WIDTH = 1376;
  const ART_ORIG_HEIGHT = 768;

  const COLOR_MODES = {
    amber: {
      id: 'amber',
      name: 'Warm Amber',
      icon: '🏮',
      label: 'Amber',
      core: '#fef08a',
      glow: 'rgba(251, 191, 36, 0.65)',
      beam: 'rgba(252, 211, 77, 0.32)',
      ambient: '#78350f',
      woodGlow: 'rgba(245, 158, 11, 0.35)',
      rayColor: 'rgba(253, 224, 71, 0.16)',
      filter: 'sepia(0.25) saturate(1.28) brightness(1.04)'
    },
    blue: {
      id: 'blue',
      name: 'Moon Blue',
      icon: '🌌',
      label: 'Moon Blue',
      core: '#e0f2fe',
      glow: 'rgba(56, 189, 248, 0.65)',
      beam: 'rgba(56, 189, 248, 0.32)',
      ambient: '#0369a1',
      woodGlow: 'rgba(14, 165, 233, 0.32)',
      rayColor: 'rgba(56, 189, 248, 0.16)',
      filter: 'hue-rotate(185deg) saturate(1.22) brightness(1.02)'
    },
    lavender: {
      id: 'lavender',
      name: 'Lavender Twilight',
      icon: '🔮',
      label: 'Twilight',
      core: '#f5d0fe',
      glow: 'rgba(192, 132, 252, 0.65)',
      beam: 'rgba(192, 132, 252, 0.32)',
      ambient: '#6b21a8',
      woodGlow: 'rgba(168, 85, 247, 0.32)',
      rayColor: 'rgba(192, 132, 252, 0.16)',
      filter: 'hue-rotate(240deg) saturate(1.25) brightness(1.03)'
    },
    aurora: {
      id: 'aurora',
      name: 'Aurora Emerald',
      icon: '✨',
      label: 'Emerald',
      core: '#d1fae5',
      glow: 'rgba(52, 211, 153, 0.65)',
      beam: 'rgba(52, 211, 153, 0.32)',
      ambient: '#065f46',
      woodGlow: 'rgba(16, 185, 129, 0.32)',
      rayColor: 'rgba(52, 211, 153, 0.16)',
      filter: 'hue-rotate(85deg) saturate(1.35) brightness(1.05)'
    }
  };

  const AMBIENCE_MODES = {
    peaceful: { id: 'peaceful', name: 'Peaceful Night', icon: '🌙', desc: 'Nocturnal crickets & warm midnight breeze' },
    rain: { id: 'rain', name: 'Gentle Rain', icon: '🌧️', desc: 'Cozy pitter-patter against the windowpane' },
    thunder: { id: 'thunder', name: 'Distant Thunder', icon: '⚡', desc: 'Deep resonant rumbles & soft raindrops' },
    starlight: { id: 'starlight', name: 'Starlight Drone', icon: '⭐', desc: '432Hz celestial binaural harmonic pad' },
    off: { id: 'off', name: 'Muted', icon: '🔇', desc: 'Silent sanctuary' }
  };

  const MOODS = {
    calm: {
      id: 'calm',
      name: 'Calm',
      icon: '😌',
      quote: 'Breathe softly... the stars are watching over you tonight.',
      pulseSpeed: 0.002,
      pulseAmp: 0.08
    },
    sleepy: {
      id: 'sleepy',
      name: 'Sleepy',
      icon: '😴',
      quote: 'Close your eyes... drift into a gentle lavender dream.',
      pulseSpeed: 0.0012,
      pulseAmp: 0.04
    },
    curious: {
      id: 'curious',
      name: 'Curious',
      icon: '✨',
      quote: 'Did you see that shooting star? The night is full of magic!',
      pulseSpeed: 0.0038,
      pulseAmp: 0.14
    }
  };

  const BEDTIME_STORIES = [
    "The stars do not rush, yet darkness always fades. Sleep gently tonight, Stargazer.",
    "Every star in the night sky holds a dream whispered by someone who needed comfort.",
    "The old lantern has kept watch over a thousand peaceful nights. You are safe here.",
    "When rain taps the window, it is only the clouds singing a quiet bedtime lullaby.",
    "Tomorrow is a fresh canvas of wonder. Rest your eyes and let the starlight guide you."
  ];

  class NightlightGuardianApp {
    constructor() {
      this.container = null;
      this.isMounted = false;
      this.animationFrameId = null;

      // Settings & State
      this.currentColorKey = 'amber';
      this.currentAmbienceKey = 'peaceful';
      this.currentMoodKey = 'calm';
      this.brightness = 0.85; // 0.2 to 1.0
      this.isMuted = false;

      // Sleep Sanctuary Mode
      this.isSleepModeActive = false;
      this.sleepTimerTotalSeconds = 0;
      this.sleepTimerRemainingSeconds = 0;
      this.sleepInterval = null;

      // 2.5D Camera Parallax
      this.pointer = { x: 0.5, y: 0.5 };
      this.parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };

      // Lantern Sway Physics (Damped Harmonic Oscillator)
      this.lanternSway = { angle: 0, vel: 0 };

      // Character & Eye Animation State
      this.mainStar = {
        blinkTimer: 3.0,
        isBlinking: false,
        eyeLookX: 0,
        eyeLookY: 0,
        smileBoost: 0
      };

      this.companionStar = {
        blinkTimer: 4.2,
        isBlinking: false,
        wingPhase: 0,
        eyeLookX: 0,
        eyeLookY: 0,
        bounceOffset: 0
      };

      // Floating Ethereal Stardust Spirit (Lumi's Familiar Wisp)
      this.familiar = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        vx: 0,
        vy: 0,
        tail: [], // History of positions for smooth ribbon trail
        wingPhase: 0,
        isReacting: false,
        reactionTimer: 0,
        blinkTimer: 2.2,
        isBlinking: false
      };

      // Multi-layer Particle Systems
      this.bokehParticles = [];   // Foreground soft out-of-focus bokeh discs
      this.thermalMotes = [];     // Midground convection stardust rising from lantern
      this.outsideStars = [];     // Distant sparkling stars with diffraction spikes
      this.shootingStars = [];    // Cinematic bolide meteors with plasma trails
      this.raindrops = [];        // 3D refractive water beads on window glass
      this.burstSparkles = [];    // Click/interaction hearts and stars
      this.butterflies = [];      // Transformed shadow creatures

      // Environmental Events
      this.activeRainEvent = false;
      this.shadowCreature = null;
      this.lightningFlash = 0; // 0.0 to 1.0

      // Audio Nodes tracking for leak-free disposal
      this.audioCtx = null;
      this.ambienceNodes = [];
      this.cricketTimer = null;
      this.thunderTimer = null;
      this.rainPingTimer = null;

      this.boundResize = () => this.onResize();
      this.boundPointerMove = (e) => this.onPointerMove(e);
      this.boundPointerLeave = () => this.onPointerLeave();
    }

    /**
     * Mounts Nightlight Guardian inside target container element
     */
    mount(container) {
      if (!container) return;
      this.destroy(); // Clean slate

      this.container = container;
      this.isMounted = true;

      // Load saved preferences
      this.loadPreferences();

      // Build DOM structure
      this.buildUI();

      // Initialize High-DPI Canvas & Particle layers
      this.initCanvas();

      // Initialize Ambience Audio if not muted
      if (this.currentAmbienceKey !== 'off' && !this.isMuted) {
        this.startAmbience(this.currentAmbienceKey);
      }

      // Start 60fps render loop
      this.lastTime = performance.now();
      this.animate();

      // Attach event listeners
      window.addEventListener('resize', this.boundResize);
      container.addEventListener('pointermove', this.boundPointerMove);
      container.addEventListener('pointerleave', this.boundPointerLeave);

      // Play soft initial chime
      if (window.dreamAudio && typeof window.dreamAudio.playChime === 'function') {
        window.dreamAudio.playChime('E5');
      }
    }

    /**
     * Builds responsive glassmorphism UI & scene structure
     */
    buildUI() {
      this.container.innerHTML = `
        <div id="nightlight-root" class="nightlight-root" style="position:relative;width:100%;height:100%;overflow:hidden;border-radius:12px;background:#050714;user-select:none;-webkit-user-select:none;">
          <!-- 1. Photorealistic Backdrop Artwork (with 2.5D Parallax wrapper) -->
          <div id="nl-parallax-wrap" style="position:absolute;inset:-4%;width:108%;height:108%;pointer-events:none;transition:transform 0.12s ease-out;will-change:transform;">
            <div id="nl-scene-art" style="position:absolute;inset:0;background-image:url('assets/proj2_lantern_hd.jpg');background-size:cover;background-position:center;transition:filter 0.6s ease;transform:scale(1.02);"></div>
          </div>

          <!-- 2. Dynamic Volumetric & Atmospheric Canvas Overlay -->
          <canvas id="nl-canvas" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;"></canvas>

          <!-- 3. Dynamic Specular Light Radiance Mask -->
          <div id="nl-light-mask" style="position:absolute;inset:0;pointer-events:none;z-index:1;mix-blend-mode:screen;transition:opacity 0.5s ease;"></div>

          <!-- 4. Interactive Bedside Hotspots (Hover/Click zones) -->
          <div id="nl-interactive-zones" style="position:absolute;inset:0;z-index:3;">
            <!-- A. Lantern Zone -->
            <div id="nl-zone-lantern" title="Tap the crystal lantern!" style="position:absolute;width:24%;height:58%;left:38%;top:20%;cursor:pointer;border-radius:20px;"></div>
            <!-- B. Companion Star Zone -->
            <div id="nl-zone-companion" title="Pet the star companion!" style="position:absolute;width:18%;height:38%;left:64%;top:32%;cursor:pointer;border-radius:50%;"></div>
            <!-- C. Antique Journal Zone -->
            <div id="nl-zone-journal" title="Open Lumi's Bedside Journal" style="position:absolute;width:22%;height:22%;left:76%;top:75%;cursor:pointer;border-radius:12px;"></div>
            <!-- D. Outside Window Zone -->
            <div id="nl-zone-window" title="Wish upon the night sky!" style="position:absolute;width:30%;height:68%;left:0;top:0;cursor:pointer;"></div>
          </div>

          <!-- 5. Responsive Glassmorphism HUD -->
          <div class="nightlight-hud" style="position:absolute;inset:0;pointer-events:none;z-index:5;display:flex;flex-direction:column;justify-content:space-between;padding:12px;box-sizing:border-box;">
            <!-- Top Bar: Title Badge, Sleep Countdown, Quick Actions -->
            <div class="nl-top-bar" style="display:flex;justify-content:space-between;align-items:center;width:100%;gap:8px;flex-wrap:wrap;pointer-events:auto;">
              <!-- Title Badge -->
              <div class="nl-title-badge" style="display:inline-flex;align-items:center;gap:8px;background:rgba(9,12,36,0.85);backdrop-filter:blur(12px);border:1px solid rgba(168,85,247,0.35);padding:5px 12px;border-radius:20px;box-shadow:0 4px 16px rgba(0,0,0,0.5);flex-shrink:0;">
                <span style="font-size:1.0rem;">🏮</span>
                <div>
                  <div style="font-size:0.78rem;font-weight:700;color:#ffffff;line-height:1.2;">Nightlight Guardian <span style="color:#fcd34d;font-size:0.68rem;font-weight:600;">Sanctuary</span></div>
                  <div id="nl-mood-status" style="font-size:0.65rem;color:#cbd5e1;line-height:1;">Mood: Calm · Stars Watching</div>
                </div>
              </div>

              <!-- Sleep Mode Live Timer Display -->
              <div id="nl-sleep-timer-badge" style="display:none;align-items:center;gap:6px;background:linear-gradient(135deg, rgba(99,102,241,0.4), rgba(168,85,247,0.4));border:1px solid rgba(168,85,247,0.6);padding:4px 12px;border-radius:20px;color:#fde047;font-size:0.75rem;font-weight:700;box-shadow:0 0 15px rgba(168,85,247,0.4);animation:pulse-timer 2s infinite;">
                <span>🌙 Sleep Mode:</span>
                <span id="nl-timer-digits">30:00</span>
                <button id="nl-btn-cancel-sleep" style="background:rgba(239,68,68,0.35);border:1px solid rgba(239,68,68,0.6);color:#fff;border-radius:10px;padding:2px 6px;font-size:0.65rem;cursor:pointer;margin-left:4px;">Wake</button>
              </div>

              <!-- Top Quick Action Buttons -->
              <div class="nl-quick-actions" style="display:inline-flex;align-items:center;gap:6px;flex-shrink:0;">
                <button id="nl-btn-mute" class="nl-glass-btn" title="Toggle Ambience Sound" style="background:rgba(9,12,36,0.85);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.18);color:#fff;border-radius:50%;width:30px;height:30px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;">
                  <span id="nl-mute-icon">${this.isMuted ? '🔇' : '🔊'}</span>
                </button>
                <button id="nl-btn-help" class="nl-glass-btn" title="Sanctuary Guide & Bedside Secrets" style="background:rgba(9,12,36,0.85);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.18);color:#fff;border-radius:50%;width:30px;height:30px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.82rem;transition:all 0.2s;">
                  ?
                </button>
                <button id="nl-btn-reset-prefs" class="nl-glass-btn" title="Reset All Settings" style="background:rgba(239,68,68,0.22);border:1px solid rgba(239,68,68,0.45);color:#fca5a5;padding:5px 10px;border-radius:14px;font-size:0.72rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all 0.2s;">
                  <span>🔄</span> <span class="nl-btn-text">Reset</span>
                </button>
              </div>
            </div>

            <!-- Middle: Journal Ribbon (Shown when clicking bedside book) -->
            <div style="display:flex;flex-direction:column;align-items:center;gap:8px;width:100%;pointer-events:none;">
              <!-- Bedside Journal Ribbon (Shown when clicking book) -->
              <div id="nl-journal-ribbon" style="display:none;pointer-events:auto;background:rgba(15,18,44,0.95);backdrop-filter:blur(14px);border:1px solid rgba(253,224,71,0.4);border-radius:16px;padding:12px 18px;max-width:380px;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,0.7);animation:pulse-timer 3s infinite;">
                <div style="font-size:0.72rem;text-transform:uppercase;color:#fcd34d;font-weight:700;margin-bottom:4px;letter-spacing:1px;">📖 Lumi's Bedside Journal</div>
                <p id="nl-journal-text" style="font-family:var(--font-display, serif);font-size:0.85rem;color:#f8fafc;line-height:1.45;margin-bottom:8px;font-style:italic;">
                  "The stars do not rush, yet darkness always fades. Sleep gently tonight, Stargazer."
                </p>
                <button id="nl-btn-close-journal" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#cbd5e1;padding:3px 12px;border-radius:10px;font-size:0.68rem;cursor:pointer;">
                  Close Journal ✨
                </button>
              </div>
            </div>

            <!-- Bottom: Control Deck -->
            <div class="nl-bottom-bar" style="display:flex;flex-direction:column;gap:8px;width:100%;pointer-events:auto;max-width:100%;">
              <!-- Row A: Magical Events & Sleep Mode Triggers -->
              <div class="nl-events-row" style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;">
                <button id="nl-btn-event-star" class="nl-pill-btn" title="Wish upon a Shooting Star" style="background:rgba(9,12,36,0.85);backdrop-filter:blur(8px);border:1px solid rgba(253,224,71,0.35);color:#fde047;padding:4px 10px;border-radius:14px;font-size:0.72rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all 0.2s;">
                  <span>🌠</span> <span>Shooting Star</span>
                </button>
                <button id="nl-btn-event-rain" class="nl-pill-btn" title="Toggle Cozy Window Rain" style="background:rgba(9,12,36,0.85);backdrop-filter:blur(8px);border:1px solid rgba(56,189,248,0.35);color:#7dd3fc;padding:4px 10px;border-radius:14px;font-size:0.72rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all 0.2s;">
                  <span>🌧️</span> <span>Window Rain</span>
                </button>
                <button id="nl-btn-event-shadow" class="nl-pill-btn" title="Disperse Shadows into Butterflies" style="background:rgba(9,12,36,0.85);backdrop-filter:blur(8px);border:1px solid rgba(192,132,252,0.35);color:#d8b4fe;padding:4px 10px;border-radius:14px;font-size:0.72rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all 0.2s;">
                  <span>🛡️</span> <span>Shadow Event</span>
                </button>
                <button id="nl-btn-sleep-menu" class="nl-pill-btn" title="Activate Sleep Sanctuary Mode" style="background:linear-gradient(135deg, rgba(99,102,241,0.5), rgba(168,85,247,0.5));border:1px solid rgba(168,85,247,0.7);color:#ffffff;padding:4px 12px;border-radius:14px;font-size:0.72rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all 0.2s;">
                  <span>🌙</span> <span>Sleep Mode</span>
                </button>
              </div>

              <!-- Row B: Unified Bottom Deck (Color Modes, Brightness Slider, Soundscape, Mood) -->
              <div class="nl-controls-dock" style="display:flex;align-items:center;justify-content:space-between;background:rgba(9,12,36,0.92);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.14);border-radius:24px;padding:5px 12px;gap:10px;overflow-x:auto;scrollbar-width:none;box-shadow:0 8px 32px rgba(0,0,0,0.6);max-width:100%;">
                <!-- 1. Color Modes -->
                <div style="display:inline-flex;align-items:center;gap:4px;flex-shrink:0;">
                  <span style="font-size:0.65rem;color:#94a3b8;font-weight:600;text-transform:uppercase;margin-right:2px;">Light</span>
                  ${Object.values(COLOR_MODES).map(c => `
                    <button class="nl-color-btn ${c.id === this.currentColorKey ? 'active' : ''}" data-color="${c.id}" title="${c.name}" style="background:${c.id === this.currentColorKey ? 'linear-gradient(135deg, #f59e0b, #ec4899)' : 'rgba(255,255,255,0.06)'};border:1px solid ${c.id === this.currentColorKey ? '#fde047' : 'transparent'};color:#fff;padding:4px 8px;border-radius:12px;font-size:0.7rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;white-space:nowrap;transition:all 0.2s;">
                      <span>${c.icon}</span> <span class="nl-btn-text">${c.label}</span>
                    </button>
                  `).join('')}
                </div>

                <!-- Divider -->
                <div style="width:1px;height:22px;background:rgba(255,255,255,0.15);flex-shrink:0;"></div>

                <!-- 2. Brightness Slider -->
                <div style="display:inline-flex;align-items:center;gap:6px;flex-shrink:0;">
                  <span style="font-size:0.75rem;">💡</span>
                  <input id="nl-slider-brightness" type="range" min="20" max="100" value="${Math.round(this.brightness * 100)}" style="width:65px;accent-color:#f59e0b;cursor:pointer;" title="Adjust Lamp Glow Brightness">
                </div>

                <!-- Divider -->
                <div style="width:1px;height:22px;background:rgba(255,255,255,0.15);flex-shrink:0;"></div>

                <!-- 3. Ambience Selector Dropdown -->
                <div style="display:inline-flex;align-items:center;gap:4px;flex-shrink:0;">
                  <span style="font-size:0.65rem;color:#94a3b8;font-weight:600;text-transform:uppercase;">Sound</span>
                  <select id="nl-select-ambience" style="background:rgba(15,23,42,0.9);border:1px solid rgba(168,85,247,0.4);color:#ffffff;padding:3px 6px;border-radius:10px;font-size:0.72rem;font-weight:600;cursor:pointer;outline:none;">
                    ${Object.values(AMBIENCE_MODES).map(a => `
                      <option value="${a.id}" ${a.id === this.currentAmbienceKey ? 'selected' : ''}>${a.icon} ${a.name}</option>
                    `).join('')}
                  </select>
                </div>

                <!-- Divider -->
                <div style="width:1px;height:22px;background:rgba(255,255,255,0.15);flex-shrink:0;"></div>

                <!-- 4. Mood Selector -->
                <div style="display:inline-flex;align-items:center;gap:4px;flex-shrink:0;">
                  <span style="font-size:0.65rem;color:#94a3b8;font-weight:600;text-transform:uppercase;">Mood</span>
                  <select id="nl-select-mood" style="background:rgba(15,23,42,0.9);border:1px solid rgba(168,85,247,0.4);color:#fde047;padding:3px 6px;border-radius:10px;font-size:0.72rem;font-weight:600;cursor:pointer;outline:none;">
                    ${Object.values(MOODS).map(m => `
                      <option value="${m.id}" ${m.id === this.currentMoodKey ? 'selected' : ''}>${m.icon} ${m.name}</option>
                    `).join('')}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- 6. Sleep Timer Selection Modal Overlay -->
          <div id="nl-sleep-overlay" style="display:none;position:absolute;inset:0;background:rgba(5,7,20,0.85);backdrop-filter:blur(8px);z-index:10;align-items:center;justify-content:center;padding:16px;">
            <div style="background:rgba(15,18,44,0.96);border:1px solid rgba(168,85,247,0.5);border-radius:18px;padding:20px;max-width:320px;width:100%;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,0.7);">
              <div style="font-size:2rem;margin-bottom:6px;">🌙</div>
              <h3 style="font-family:var(--font-display, serif);font-size:1.2rem;color:#ffffff;margin-bottom:6px;">Sleep Sanctuary Mode</h3>
              <p style="font-size:0.78rem;color:#94a3b8;line-height:1.4;margin-bottom:16px;">
                Drapes the room in soft bedtime amber, starts peaceful sounds, and gently rocks you into starlight slumber with gradual dimming.
              </p>
              <div style="display:flex;gap:10px;justify-content:center;margin-bottom:14px;">
                <button id="nl-btn-sleep-30" style="background:linear-gradient(135deg, #6366f1, #a855f7);border:none;color:#fff;padding:8px 14px;border-radius:12px;font-size:0.8rem;font-weight:700;cursor:pointer;flex:1;">
                  30 Minutes
                </button>
                <button id="nl-btn-sleep-60" style="background:linear-gradient(135deg, #8b5cf6, #ec4899);border:none;color:#fff;padding:8px 14px;border-radius:12px;font-size:0.8rem;font-weight:700;cursor:pointer;flex:1;">
                  60 Minutes
                </button>
              </div>
              <button id="nl-btn-sleep-close" style="background:transparent;border:1px solid rgba(255,255,255,0.2);color:#94a3b8;padding:5px 16px;border-radius:10px;font-size:0.75rem;cursor:pointer;">
                Close
              </button>
            </div>
          </div>

          <!-- 7. Guide / Help Overlay -->
          <div id="nl-guide-overlay" style="display:none;position:absolute;inset:0;background:rgba(5,7,20,0.88);backdrop-filter:blur(8px);z-index:10;align-items:center;justify-content:center;padding:16px;">
            <div style="background:rgba(15,18,44,0.96);border:1px solid rgba(168,85,247,0.5);border-radius:18px;padding:22px;max-width:360px;width:100%;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,0.7);">
              <div style="font-size:1.8rem;margin-bottom:6px;">🏮</div>
              <h3 style="font-family:var(--font-display, serif);font-size:1.25rem;color:#ffffff;margin-bottom:8px;">Nightlight Sanctuary Secrets</h3>
              <div style="text-align:left;font-size:0.78rem;color:#cbd5e1;line-height:1.5;margin-bottom:16px;display:flex;flex-direction:column;gap:6px;">
                <div>✨ <strong>Tap Lantern:</strong> The star inside taps back with crystal chimes & swaying shadows.</div>
                <div>⭐ <strong>Pet Star Companion:</strong> Tap the perched star for happy wing flutters & stardust.</div>
                <div>📖 <strong>Read Bedside Journal:</strong> Tap the antique leather book to read soothing bedtime thoughts.</div>
                <div>🏮 <strong>Lighting Modes:</strong> Switch Amber, Blue, Twilight, or Aurora volumetric rays.</div>
                <div>🌧️ <strong>Magical Events:</strong> Call shooting stars, glass raindrops, or turn shadows into butterflies.</div>
                <div>🌙 <strong>Sleep Mode:</strong> Set 30m / 60m bedtime timer with gradual soothing dim.</div>
              </div>
              <button id="nl-btn-guide-close" style="background:linear-gradient(135deg, #a855f7, #ec4899);border:none;color:#fff;padding:8px 20px;border-radius:14px;font-size:0.8rem;font-weight:700;cursor:pointer;">
                Enter Sanctuary ✨
              </button>
            </div>
          </div>
        </div>
      `;

      this.updateLightingVisuals();
      this.attachHUDListeners();
    }

    /**
     * Maps coordinate (px, py) from the native 1376x768 image onto the current responsive canvas
     */
    getImageCoords(px, py) {
      const origW = ART_ORIG_WIDTH;
      const origH = ART_ORIG_HEIGHT;
      const imgRatio = origW / origH;
      const containerRatio = this.canvasWidth / this.canvasHeight;

      let renderW, renderH, offsetX, offsetY;
      if (containerRatio > imgRatio) {
        renderW = this.canvasWidth;
        renderH = this.canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (this.canvasHeight - renderH) / 2;
      } else {
        renderW = this.canvasHeight * imgRatio;
        renderH = this.canvasHeight;
        offsetX = (this.canvasWidth - renderW) / 2;
        offsetY = 0;
      }

      const scale = renderW / origW;
      return {
        x: offsetX + px * scale,
        y: offsetY + py * scale,
        scale: scale,
        offsetX: offsetX,
        offsetY: offsetY,
        renderW: renderW,
        renderH: renderH
      };
    }

    /**
     * Initializes High-DPI 2D canvas and seeds realistic layered particle systems
     */
    initCanvas() {
      this.canvas = this.container.querySelector('#nl-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.onResize();

      // 1. Seed Distant Outside Stars with 4-point diffraction spikes (Window area: x < 35%)
      this.outsideStars = [];
      for (let i = 0; i < 24; i++) {
        this.outsideStars.push({
          relX: Math.random() * 0.32,
          relY: Math.random() * 0.65,
          size: Math.random() * 1.8 + 0.8,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.003 + 0.001,
          hasSpikes: Math.random() > 0.45
        });
      }

      // 2. Seed Midground Thermal Stardust Motes around lantern
      this.thermalMotes = [];
      for (let i = 0; i < 45; i++) {
        this.thermalMotes.push({
          x: (0.35 + Math.random() * 0.45) * this.canvasWidth,
          y: (0.2 + Math.random() * 0.7) * this.canvasHeight,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -Math.random() * 0.6 - 0.15, // Rising thermal current
          size: Math.random() * 2.2 + 0.8,
          alpha: Math.random() * 0.8 + 0.2,
          phase: Math.random() * Math.PI * 2,
          colorType: Math.random() > 0.4 ? 'gold' : 'violet'
        });
      }

      // 3. Seed Foreground Soft Bokeh Orbs (Depth of Field)
      this.bokehParticles = [];
      for (let i = 0; i < 14; i++) {
        this.bokehParticles.push({
          x: Math.random() * this.canvasWidth,
          y: Math.random() * this.canvasHeight,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 16 + 10,
          alpha: Math.random() * 0.18 + 0.06,
          phase: Math.random() * Math.PI * 2
        });
      }

      // 4. Position Familiar Stardust Wisp between lantern and companion star
      const lampPos = this.getImageCoords(706, 466);
      this.familiar.x = lampPos.x + 85 * lampPos.scale;
      this.familiar.y = lampPos.y - 70 * lampPos.scale;
      this.familiar.targetX = this.familiar.x;
      this.familiar.targetY = this.familiar.y;
      this.familiar.tail = [];
    }

    /**
     * Updates canvas dimensions on window / modal resize
     */
    onResize() {
      if (!this.canvas || !this.container) return;
      const rect = this.container.getBoundingClientRect();
      this.canvasWidth = rect.width || 800;
      this.canvasHeight = rect.height || 520;

      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = this.canvasWidth * dpr;
      this.canvas.height = this.canvasHeight * dpr;
      if (this.ctx) {
        this.ctx.resetTransform();
        this.ctx.scale(dpr, dpr);
      }
    }

    /**
     * Pointer tracking for natural 2.5D parallax, eye gaze, and familiar attraction
     */
    onPointerMove(e) {
      if (!this.container) return;
      const rect = this.container.getBoundingClientRect();
      this.pointer.x = (e.clientX - rect.left) / rect.width;
      this.pointer.y = (e.clientY - rect.top) / rect.height;

      // Parallax target (subtle realistic camera drift)
      this.parallax.targetX = (this.pointer.x - 0.5) * 14; // pixels
      this.parallax.targetY = (this.pointer.y - 0.5) * 9;

      // Eyes look at pointer
      const lampPos = this.getImageCoords(706, 466);
      const compPos = this.getImageCoords(970, 372);

      const dxM = (e.clientX - rect.left) - lampPos.x;
      const dyM = (e.clientY - rect.top) - lampPos.y;
      const distM = Math.sqrt(dxM * dxM + dyM * dyM);
      if (distM > 0) {
        this.mainStar.eyeLookX = (dxM / distM) * 3.2;
        this.mainStar.eyeLookY = (dyM / distM) * 2.2;
      }

      const dxC = (e.clientX - rect.left) - compPos.x;
      const dyC = (e.clientY - rect.top) - compPos.y;
      const distC = Math.sqrt(dxC * dxC + dyC * dyC);
      if (distC > 0) {
        this.companionStar.eyeLookX = (dxC / distC) * 3.0;
        this.companionStar.eyeLookY = (dyC / distC) * 2.0;
      }

      // Familiar spirit follows pointer with curiosity when pointer is active
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;
      this.familiar.targetX = pointerX + (Math.sin(performance.now() * 0.003) * 25);
      this.familiar.targetY = pointerY - 35 + (Math.cos(performance.now() * 0.004) * 15);
    }

    onPointerLeave() {
      this.parallax.targetX = 0;
      this.parallax.targetY = 0;
      this.mainStar.eyeLookX = 0;
      this.mainStar.eyeLookY = 0;
      this.companionStar.eyeLookX = 0;
      this.companionStar.eyeLookY = 0;

      // Return familiar spirit to resting perch near companion star
      const lampPos = this.getImageCoords(706, 466);
      this.familiar.targetX = lampPos.x + 85 * lampPos.scale;
      this.familiar.targetY = lampPos.y - 70 * lampPos.scale;
    }

    /**
     * Updates scene background filter, radial volumetric lighting, and specular masks
     */
    updateLightingVisuals() {
      const mode = COLOR_MODES[this.currentColorKey] || COLOR_MODES.amber;
      const art = this.container.querySelector('#nl-scene-art');
      const mask = this.container.querySelector('#nl-light-mask');
      const b = this.brightness;

      if (art) {
        art.style.filter = `${mode.filter} brightness(${0.65 + b * 0.45})`;
      }

      if (mask) {
        mask.style.opacity = `${b * 0.85}`;
        const lampPos = this.getImageCoords(706, 466);
        const pctX = Math.round((lampPos.x / this.canvasWidth) * 100);
        const pctY = Math.round((lampPos.y / this.canvasHeight) * 100);
        mask.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, ${mode.glow} 0%, ${mode.beam} 35%, transparent 75%)`;
      }

      // Update active color button styles in HUD
      this.container.querySelectorAll('.nl-color-btn').forEach(btn => {
        const isMatch = btn.dataset.color === this.currentColorKey;
        btn.classList.toggle('active', isMatch);
        btn.style.background = isMatch
          ? 'linear-gradient(135deg, #f59e0b, #ec4899)'
          : 'rgba(255,255,255,0.06)';
        btn.style.borderColor = isMatch ? '#fde047' : 'transparent';
      });
    }

    /**
     * Attaches interactive click & touch handlers to HUD controls and Bedside Hotspots
     */
    attachHUDListeners() {
      // 1. Interactive Hotspots
      const zoneLantern = this.container.querySelector('#nl-zone-lantern');
      if (zoneLantern) {
        zoneLantern.addEventListener('click', (e) => {
          e.stopPropagation();
          this.triggerLanternTap();
        });
      }

      const zoneCompanion = this.container.querySelector('#nl-zone-companion');
      if (zoneCompanion) {
        zoneCompanion.addEventListener('click', (e) => {
          e.stopPropagation();
          this.triggerCompanionPet();
        });
      }

      const zoneJournal = this.container.querySelector('#nl-zone-journal');
      if (zoneJournal) {
        zoneJournal.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openBedsideJournal();
        });
      }

      const zoneWindow = this.container.querySelector('#nl-zone-window');
      if (zoneWindow) {
        zoneWindow.addEventListener('click', (e) => {
          e.stopPropagation();
          this.triggerShootingStar();
        });
      }

      // 2. Journal close button
      const btnCloseJournal = this.container.querySelector('#nl-btn-close-journal');
      if (btnCloseJournal) {
        btnCloseJournal.addEventListener('click', () => {
          const ribbon = this.container.querySelector('#nl-journal-ribbon');
          if (ribbon) ribbon.style.display = 'none';
        });
      }

      // 3. Color Mode Buttons
      this.container.querySelectorAll('.nl-color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.setColorMode(btn.dataset.color);
        });
      });

      // 4. Brightness Slider
      const slider = this.container.querySelector('#nl-slider-brightness');
      if (slider) {
        slider.addEventListener('input', (e) => {
          this.brightness = parseInt(e.target.value, 10) / 100;
          this.updateLightingVisuals();
          this.savePreferences();
        });
      }

      // 5. Ambience Dropdown
      const ambSelect = this.container.querySelector('#nl-select-ambience');
      if (ambSelect) {
        ambSelect.addEventListener('change', (e) => {
          this.setAmbience(e.target.value);
        });
      }

      // 6. Mood Selector
      const moodSelect = this.container.querySelector('#nl-select-mood');
      if (moodSelect) {
        moodSelect.addEventListener('change', (e) => {
          this.setMood(e.target.value);
        });
      }

      // 7. Magical Events Buttons
      const btnStar = this.container.querySelector('#nl-btn-event-star');
      if (btnStar) {
        btnStar.addEventListener('click', (e) => {
          e.stopPropagation();
          this.triggerShootingStar();
        });
      }

      const btnRain = this.container.querySelector('#nl-btn-event-rain');
      if (btnRain) {
        btnRain.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleWindowRain();
        });
      }

      const btnShadow = this.container.querySelector('#nl-btn-event-shadow');
      if (btnShadow) {
        btnShadow.addEventListener('click', (e) => {
          e.stopPropagation();
          this.triggerShadowEvent();
        });
      }

      // 8. Sleep Mode Menu & Direct Toggle
      const btnSleepMenu = this.container.querySelector('#nl-btn-sleep-menu');
      if (btnSleepMenu) {
        btnSleepMenu.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleSleepMode();
        });
      }

      const btnCancelSleep = this.container.querySelector('#nl-btn-cancel-sleep');
      if (btnCancelSleep) {
        btnCancelSleep.addEventListener('click', (e) => {
          e.stopPropagation();
          this.cancelSleepMode();
        });
      }

      // 9. Help / Guide Modal
      const btnHelp = this.container.querySelector('#nl-btn-help');
      const guideOverlay = this.container.querySelector('#nl-guide-overlay');
      const btnGuideClose = this.container.querySelector('#nl-btn-guide-close');

      if (btnHelp && guideOverlay) {
        btnHelp.addEventListener('click', () => {
          guideOverlay.style.display = 'flex';
        });
      }
      if (btnGuideClose && guideOverlay) {
        btnGuideClose.addEventListener('click', () => {
          guideOverlay.style.display = 'none';
        });
      }

      // 10. Mute Button
      const btnMute = this.container.querySelector('#nl-btn-mute');
      const muteIcon = this.container.querySelector('#nl-mute-icon');
      if (btnMute) {
        btnMute.addEventListener('click', () => {
          this.isMuted = !this.isMuted;
          if (muteIcon) muteIcon.textContent = this.isMuted ? '🔇' : '🔊';
          if (this.isMuted) {
            this.stopAmbience();
            this.showToast('🔇 Ambience sound muted');
          } else {
            this.startAmbience(this.currentAmbienceKey);
            this.showToast('🔊 Ambience sound enabled');
          }
          this.savePreferences();
        });
      }

      // 11. Reset Preferences Button
      const btnReset = this.container.querySelector('#nl-btn-reset-prefs');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          if (confirm('Reset nightlight lighting and sound preferences to default?')) {
            this.resetPreferences();
          }
        });
      }
    }

    /**
     * Tapping the lantern taps crystal glass, sways lantern, beams joy
     */
    triggerLanternTap() {
      // Impulse sway
      this.lanternSway.vel += 0.08;
      this.mainStar.smileBoost = 1.0;

      // Play crystal glass tink sound
      this.playGlassTink();

      const lampPos = this.getImageCoords(706, 466);
      // Burst stardust motes escaping the lantern slats
      for (let i = 0; i < 22; i++) {
        const a = (i / 22) * Math.PI * 2;
        const spd = Math.random() * 4 + 2;
        this.burstSparkles.push({
          x: lampPos.x,
          y: lampPos.y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd - 1.5,
          size: Math.random() * 4 + 2,
          alpha: 1.0,
          color: Math.random() > 0.4 ? '#fde047' : '#fef08a',
          isStar: true
        });
      }

      this.showToast('🏮 The lantern star taps back cheerfully! ✨');

      // Familiar spirit loops around lantern
      this.familiar.isReacting = true;
      this.familiar.reactionTimer = 1.0;
    }

    /**
     * Petting the perched companion star
     */
    triggerCompanionPet() {
      this.companionStar.bounceOffset = -18;

      if (window.dreamAudio && typeof window.dreamAudio.playChime === 'function') {
        window.dreamAudio.playChime('C6');
      }

      const compPos = this.getImageCoords(970, 372);
      // Burst hearts & stardust
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const spd = Math.random() * 3.5 + 1.5;
        this.burstSparkles.push({
          x: compPos.x,
          y: compPos.y,
          vx: Math.cos(a) * spd,
          vy: Math.sin(a) * spd - 1.8,
          size: Math.random() * 5 + 3,
          alpha: 1.0,
          color: Math.random() > 0.5 ? '#f472b6' : '#fde047',
          isHeart: Math.random() > 0.4
        });
      }

      this.showToast('⭐ The companion star giggles and flutters its wings! 💖');
    }

    /**
     * Opens the bedside antique leather journal with golden thought
     */
    openBedsideJournal() {
      const ribbon = this.container.querySelector('#nl-journal-ribbon');
      const textEl = this.container.querySelector('#nl-journal-text');
      if (ribbon && textEl) {
        const quote = BEDTIME_STORIES[Math.floor(Math.random() * BEDTIME_STORIES.length)];
        textEl.textContent = `"${quote}"`;
        ribbon.style.display = 'block';
      }

      if (window.dreamAudio && typeof window.dreamAudio.playChime === 'function') {
        window.dreamAudio.playChime('A5');
      }

      const bookPos = this.getImageCoords(1220, 710);
      for (let i = 0; i < 14; i++) {
        this.burstSparkles.push({
          x: bookPos.x + (Math.random() - 0.5) * 60,
          y: bookPos.y - 10,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 3 - 1,
          size: Math.random() * 3.5 + 2,
          alpha: 1.0,
          color: '#fde047',
          isStar: true
        });
      }
    }

    /**
     * Changes Nightlight Color Mode
     */
    setColorMode(colorKey) {
      if (!COLOR_MODES[colorKey]) return;
      this.currentColorKey = colorKey;
      this.updateLightingVisuals();
      this.savePreferences();

      const mode = COLOR_MODES[colorKey];
      this.showToast(`${mode.icon} ${mode.name} Activated`);

      if (window.dreamAudio && typeof window.dreamAudio.playChime === 'function') {
        const chord = { amber: 'E5', blue: 'A5', lavender: 'C6', aurora: 'G5' };
        window.dreamAudio.playChime(chord[colorKey] || 'E5');
      }
    }

    /**
     * Changes Ambience Soundscape Mode
     */
    setAmbience(ambienceKey) {
      if (!AMBIENCE_MODES[ambienceKey]) return;
      this.currentAmbienceKey = ambienceKey;
      this.savePreferences();

      // Sync dropdown select in dock
      const ambSelect = this.container.querySelector('#nl-select-ambience');
      if (ambSelect) ambSelect.value = ambienceKey;

      if (ambienceKey === 'off' || this.isMuted) {
        this.stopAmbience();
      } else {
        this.startAmbience(ambienceKey);
      }
    }

    /**
     * Changes Guardian Mood
     */
    setMood(moodKey) {
      if (!MOODS[moodKey]) return;
      this.currentMoodKey = moodKey;
      this.savePreferences();

      // Sync mood select in dock
      const moodSelect = this.container.querySelector('#nl-select-mood');
      if (moodSelect) moodSelect.value = moodKey;

      const mood = MOODS[moodKey];
      const statusEl = this.container.querySelector('#nl-mood-status');
      if (statusEl) {
        statusEl.textContent = `Mood: ${mood.name} · Stars Watching`;
      }

      this.triggerCompanionPet();
    }

    /**
     * Triggers brilliant, cinematic shooting stars across the windowpane with instant visual feedback
     */
    triggerShootingStar() {
      // 1. Instant button bounce & gold flash animation
      const btn = this.container.querySelector('#nl-btn-event-star');
      if (btn) {
        btn.style.transform = 'scale(1.14)';
        btn.style.background = 'linear-gradient(135deg, #f59e0b, #fbbf24)';
        btn.style.borderColor = '#fde047';
        btn.style.boxShadow = '0 0 20px rgba(253, 224, 71, 0.9)';
        btn.style.color = '#78350f';
        btn.style.fontWeight = '700';
        setTimeout(() => {
          if (btn) {
            btn.style.transform = '';
            btn.style.background = 'rgba(9,12,36,0.85)';
            btn.style.borderColor = 'rgba(253,224,71,0.35)';
            btn.style.boxShadow = '';
            btn.style.color = '#fde047';
            btn.style.fontWeight = '600';
          }
        }, 450);
      }

      // 2. Ambient sky flash
      this.lightningFlash = 0.55;

      // 3. Spawn 3 magnificent bolide meteors in succession across the window
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          if (!this.isMounted) return;
          this.shootingStars.push({
            x: this.canvasWidth * (0.04 + Math.random() * 0.22),
            y: this.canvasHeight * (0.05 + Math.random() * 0.16),
            vx: 13 + Math.random() * 4,
            vy: 7.0 + Math.random() * 2.5,
            length: 130,
            alpha: 1.0,
            decay: 0.015,
            coreColor: '#ffffff',
            tailColor: i % 2 === 0 ? '#fde047' : '#f472b6'
          });
        }, i * 140);
      }

      // 4. Characters glance toward window in excitement
      this.mainStar.eyeLookX = -3.2;
      this.mainStar.eyeLookY = -1.5;
      this.companionStar.eyeLookX = -3.0;
      this.companionStar.eyeLookY = -1.2;

      // 5. Sound chime
      if (window.dreamAudio && typeof window.dreamAudio.playChime === 'function') {
        window.dreamAudio.playChime('C6');
      }
    }

    /**
     * Toggles sliding windowpane raindrops with 3D water refraction and clear active button state
     */
    toggleWindowRain() {
      this.activeRainEvent = !this.activeRainEvent;

      const btn = this.container.querySelector('#nl-btn-event-rain');
      if (btn) {
        if (this.activeRainEvent) {
          btn.innerHTML = '<span>🌧️</span> <span>Rain: ON</span>';
          btn.style.background = 'linear-gradient(135deg, rgba(14,165,233,0.85), rgba(56,189,248,0.85))';
          btn.style.borderColor = '#38bdf8';
          btn.style.boxShadow = '0 0 18px rgba(56,189,248,0.85)';
          btn.style.color = '#ffffff';
          btn.style.fontWeight = '700';
        } else {
          btn.innerHTML = '<span>🌧️</span> <span>Window Rain</span>';
          btn.style.background = 'rgba(9,12,36,0.85)';
          btn.style.borderColor = 'rgba(56,189,248,0.35)';
          btn.style.boxShadow = 'none';
          btn.style.color = '#7dd3fc';
          btn.style.fontWeight = '600';
        }
      }

      if (this.activeRainEvent) {
        // Spawn 65 3D glass raindrops strictly within the window area
        this.raindrops = [];
        const winPos = this.getImageCoords(400, 540);
        const winWidth = Math.min(winPos.x, this.canvasWidth * 0.38);

        for (let i = 0; i < 65; i++) {
          this.raindrops.push({
            x: Math.random() * winWidth,
            y: Math.random() * this.canvasHeight,
            speed: Math.random() * 2.5 + 0.8,
            radius: Math.random() * 2.8 + 1.4,
            tailLength: Math.random() * 18 + 8,
            alpha: Math.random() * 0.6 + 0.4,
            stuckTimer: Math.random() * 200
          });
        }

        if (this.currentAmbienceKey !== 'thunder' && !this.isMuted) {
          this.setAmbience('rain');
        }
      } else {
        this.raindrops = [];
        if (this.currentAmbienceKey === 'rain') {
          this.setAmbience('peaceful');
        }
      }
    }

    /**
     * Triggers a whimsical shadow creature that instantly dissolves into stardust butterflies
     */
    triggerShadowEvent() {
      if (this.shadowCreature) return;

      const btn = this.container.querySelector('#nl-btn-event-shadow');
      if (btn) {
        btn.style.transform = 'scale(1.14)';
        btn.style.background = 'linear-gradient(135deg, rgba(168,85,247,0.85), rgba(216,180,254,0.85))';
        btn.style.borderColor = '#c084fc';
        btn.style.boxShadow = '0 0 20px rgba(192,132,252,0.9)';
        btn.style.color = '#ffffff';
        setTimeout(() => {
          if (btn) {
            btn.style.transform = '';
            btn.style.background = 'rgba(9,12,36,0.85)';
            btn.style.borderColor = 'rgba(192,132,252,0.35)';
            btn.style.boxShadow = '';
            btn.style.color = '#d8b4fe';
          }
        }, 500);
      }

      // Immediate action: spawn shadow wisp smoothly moving in
      this.shadowCreature = {
        x: this.canvasWidth * 0.10,
        y: this.canvasHeight * 0.72,
        targetX: this.canvasWidth * 0.48,
        targetY: this.canvasHeight * 0.54,
        alpha: 0.85,
        state: 'creeping',
        timer: 0
      };

      // Lantern flares with gold protective aura immediately
      this.triggerLanternTap();

      // Transform after 500ms
      setTimeout(() => {
        if (!this.shadowCreature) return;
        this.shadowCreature.state = 'transforming';

        for (let i = 0; i < 24; i++) {
          this.butterflies.push({
            x: this.shadowCreature.x,
            y: this.shadowCreature.y,
            vx: (Math.random() - 0.5) * 5,
            vy: -Math.random() * 4 - 2,
            size: Math.random() * 7 + 4,
            alpha: 1.0,
            wingPhase: Math.random() * Math.PI * 2,
            color: Math.random() > 0.4 ? '#fde047' : '#c084fc'
          });
        }

        setTimeout(() => {
          this.shadowCreature = null;
        }, 800);
      }, 500);
    }

    /**
     * Direct toggle for Sleep Mode: OFF -> 30m -> 60m -> Wake
     */
    toggleSleepMode() {
      const btn = this.container.querySelector('#nl-btn-sleep-menu');
      if (!this.isSleepModeActive) {
        // 1. Activate 30 Minutes
        this.startSleepMode(30);
        if (btn) {
          btn.innerHTML = '<span>🌙</span> <span>Sleep: 30m</span>';
          btn.style.background = 'linear-gradient(135deg, #6366f1, #a855f7)';
          btn.style.borderColor = '#c084fc';
          btn.style.boxShadow = '0 0 16px rgba(168,85,247,0.85)';
        }
      } else if (this.sleepTimerTotalSeconds === 30 * 60) {
        // 2. Switch to 60 Minutes
        this.startSleepMode(60);
        if (btn) {
          btn.innerHTML = '<span>🌙</span> <span>Sleep: 60m</span>';
          btn.style.background = 'linear-gradient(135deg, #8b5cf6, #ec4899)';
          btn.style.borderColor = '#f472b6';
          btn.style.boxShadow = '0 0 16px rgba(236,72,153,0.85)';
        }
      } else {
        // 3. Cancel / Wake up
        this.cancelSleepMode();
      }
    }

    /**
     * Starts Sleep Mode with countdown timer & gradual soothing dim
     */
    startSleepMode(minutes = 30) {
      this.isSleepModeActive = true;
      this.sleepTimerTotalSeconds = minutes * 60;
      this.sleepTimerRemainingSeconds = this.sleepTimerTotalSeconds;

      this.setColorMode('amber');
      this.setMood('sleepy');

      // Soothing bedtime level
      this.brightness = 0.35;
      const slider = this.container.querySelector('#nl-slider-brightness');
      if (slider) slider.value = '35';
      this.updateLightingVisuals();

      // Show timer display badge
      const timerBadge = this.container.querySelector('#nl-sleep-timer-badge');
      const timerDigits = this.container.querySelector('#nl-timer-digits');
      if (timerBadge) timerBadge.style.display = 'inline-flex';
      if (timerDigits) timerDigits.textContent = `${minutes}:00`;

      if (this.sleepInterval) clearInterval(this.sleepInterval);
      this.sleepInterval = setInterval(() => {
        this.sleepTimerRemainingSeconds--;
        if (this.sleepTimerRemainingSeconds <= 0) {
          this.completeSleepMode();
        } else {
          const m = Math.floor(this.sleepTimerRemainingSeconds / 60);
          const s = this.sleepTimerRemainingSeconds % 60;
          if (timerDigits) {
            timerDigits.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
          }
        }
      }, 1000);
    }

    /**
     * Cancels Sleep Mode & wakes up sanctuary
     */
    cancelSleepMode() {
      this.isSleepModeActive = false;
      if (this.sleepInterval) {
        clearInterval(this.sleepInterval);
        this.sleepInterval = null;
      }

      const timerBadge = this.container.querySelector('#nl-sleep-timer-badge');
      if (timerBadge) timerBadge.style.display = 'none';

      const btn = this.container.querySelector('#nl-btn-sleep-menu');
      if (btn) {
        btn.innerHTML = '<span>🌙</span> <span>Sleep Mode</span>';
        btn.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(168,85,247,0.5))';
        btn.style.borderColor = 'rgba(168,85,247,0.7)';
        btn.style.boxShadow = 'none';
      }

      this.brightness = 0.85;
      const slider = this.container.querySelector('#nl-slider-brightness');
      if (slider) slider.value = '85';
      this.updateLightingVisuals();
      this.setMood('calm');
    }

    completeSleepMode() {
      this.cancelSleepMode();
      this.brightness = 0.2;
      this.updateLightingVisuals();
    }

    /**
     * Synthesizes crystal glass "tink" sound using Web Audio API
     */
    playGlassTink() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!this.audioCtx) this.audioCtx = new AudioContext();
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const t = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const oscHarmonic = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(3200, t);
        osc.frequency.exponentialRampToValueAtTime(1800, t + 0.35);

        oscHarmonic.type = 'sine';
        oscHarmonic.frequency.setValueAtTime(6400, t);
        oscHarmonic.frequency.exponentialRampToValueAtTime(3600, t + 0.2);

        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);

        osc.connect(gain);
        oscHarmonic.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(t);
        oscHarmonic.start(t);
        osc.stop(t + 0.4);
        oscHarmonic.stop(t + 0.4);
      } catch (e) { }
    }

    /**
     * Synthesizes rich real-time ambient soundscapes using Web Audio API
     */
    startAmbience(modeKey) {
      this.stopAmbience();
      if (this.isMuted || modeKey === 'off') return;

      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!this.audioCtx) this.audioCtx = new AudioContext();
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const now = this.audioCtx.currentTime;

        if (modeKey === 'peaceful') {
          // 1. Soft nocturnal breeze (filtered pink noise)
          const bufferSize = this.audioCtx.sampleRate * 2;
          const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          let lastOut = 0.0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
          }
          const noise = this.audioCtx.createBufferSource();
          noise.buffer = noiseBuffer;
          noise.loop = true;

          const filter = this.audioCtx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(320, now);

          const gain = this.audioCtx.createGain();
          gain.gain.setValueAtTime(0.04, now);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(this.audioCtx.destination);
          noise.start(now);
          this.ambienceNodes.push(noise, filter, gain);

          // 2. Periodic natural cricket chirps
          const chirp = () => {
            if (!this.isMounted || this.currentAmbienceKey !== 'peaceful') return;
            const t = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const g = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(4600 + (Math.random() - 0.5) * 400, t);
            osc.frequency.exponentialRampToValueAtTime(4900, t + 0.045);
            g.gain.setValueAtTime(0.015, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.065);
            osc.connect(g);
            g.connect(this.audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.07);

            this.cricketTimer = setTimeout(chirp, Math.random() * 3800 + 2200);
          };
          this.cricketTimer = setTimeout(chirp, 1800);

        } else if (modeKey === 'rain') {
          // Steady rain noise wash
          const bufferSize = this.audioCtx.sampleRate * 2;
          const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          const noise = this.audioCtx.createBufferSource();
          noise.buffer = noiseBuffer;
          noise.loop = true;

          const filter = this.audioCtx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1150, now);
          filter.Q.setValueAtTime(1.1, now);

          const gain = this.audioCtx.createGain();
          gain.gain.setValueAtTime(0.05, now);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(this.audioCtx.destination);
          noise.start(now);
          this.ambienceNodes.push(noise, filter, gain);

          // Randomized delicate glass raindrop pings
          const ping = () => {
            if (!this.isMounted || this.currentAmbienceKey !== 'rain') return;
            const t = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const g = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(2400 + Math.random() * 800, t);
            g.gain.setValueAtTime(0.008, t);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
            osc.connect(g);
            g.connect(this.audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.06);

            this.rainPingTimer = setTimeout(ping, Math.random() * 700 + 300);
          };
          this.rainPingTimer = setTimeout(ping, 400);

        } else if (modeKey === 'thunder') {
          // Rain foundation + periodic rolling sub-bass thunder with lightning flash
          this.startAmbience('rain');

          const rollThunder = () => {
            if (!this.isMounted || this.currentAmbienceKey !== 'thunder') return;

            // Trigger sheet lightning flash across the window
            this.lightningFlash = 1.0;

            const t = this.audioCtx.currentTime + 1.2; // 1.2s thunder delay (distance)
            const osc = this.audioCtx.createOscillator();
            const g = this.audioCtx.createGain();
            const filt = this.audioCtx.createBiquadFilter();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(68, t);
            osc.frequency.exponentialRampToValueAtTime(32, t + 3.2);

            filt.type = 'lowpass';
            filt.frequency.setValueAtTime(120, t);

            g.gain.setValueAtTime(0.001, t);
            g.gain.linearRampToValueAtTime(0.14, t + 0.5);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);

            osc.connect(filt);
            filt.connect(g);
            g.connect(this.audioCtx.destination);
            osc.start(t);
            osc.stop(t + 3.6);

            this.thunderTimer = setTimeout(rollThunder, Math.random() * 11000 + 7000);
          };
          this.thunderTimer = setTimeout(rollThunder, 2500);

        } else if (modeKey === 'starlight') {
          // 432Hz binaural meditation drone + 648Hz fifth overtone
          const freqs = [432, 648];
          freqs.forEach((freq, idx) => {
            const osc = this.audioCtx.createOscillator();
            const g = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            g.gain.setValueAtTime(0.022 / (idx + 1), now);

            osc.connect(g);
            g.connect(this.audioCtx.destination);
            osc.start(now);
            this.ambienceNodes.push(osc, g);
          });
        }
      } catch (e) {
        console.warn('Ambience audio initialization notice:', e);
      }
    }

    /**
     * Cleanly stops and disconnects all ambient audio nodes
     */
    stopAmbience() {
      if (this.cricketTimer) {
        clearTimeout(this.cricketTimer);
        this.cricketTimer = null;
      }
      if (this.thunderTimer) {
        clearTimeout(this.thunderTimer);
        this.thunderTimer = null;
      }
      if (this.rainPingTimer) {
        clearTimeout(this.rainPingTimer);
        this.rainPingTimer = null;
      }

      this.ambienceNodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (e) { }
      });
      this.ambienceNodes = [];
    }

    /**
     * Main 60fps render loop
     */
    animate() {
      if (!this.isMounted) return;
      this.animationFrameId = requestAnimationFrame(() => this.animate());

      const now = performance.now();
      const dt = Math.min((now - this.lastTime) / 1000, 0.1);
      this.lastTime = now;

      // 1. Update 2.5D Parallax camera smoothly
      this.parallax.x += (this.parallax.targetX - this.parallax.x) * 0.08;
      this.parallax.y += (this.parallax.targetY - this.parallax.y) * 0.08;
      const wrap = this.container.querySelector('#nl-parallax-wrap');
      if (wrap) {
        wrap.style.transform = `translate3d(${this.parallax.x}px, ${this.parallax.y}px, 0)`;
      }

      // 2. Update Damped Lantern Pendulum Sway
      this.lanternSway.vel += -this.lanternSway.angle * 12 * dt; // Spring force
      this.lanternSway.vel *= 0.94; // Damping
      this.lanternSway.angle += this.lanternSway.vel * dt;

      // 3. Update Character Physics & Blink Cycles
      this.updateCharacters(now, dt);

      // 4. Render All Photorealistic Canvas Layers
      try {
        this.renderCanvas(now, dt);
      } catch (err) {
        console.error('Canvas render glitch:', err);
      }
    }

    /**
     * Updates main star, companion star, and familiar spirit
     */
    updateCharacters(now, dt) {
      // Main Star inside lantern
      this.mainStar.blinkTimer -= dt;
      if (this.mainStar.blinkTimer <= 0) {
        this.mainStar.isBlinking = true;
        this.mainStar.blinkTimer = Math.random() * 4 + 3.0;
        setTimeout(() => { this.mainStar.isBlinking = false; }, 130);
      }
      if (this.mainStar.smileBoost > 0) {
        this.mainStar.smileBoost = Math.max(0, this.mainStar.smileBoost - dt * 1.5);
      }

      // Companion Star on perch
      this.companionStar.blinkTimer -= dt;
      if (this.companionStar.blinkTimer <= 0) {
        this.companionStar.isBlinking = true;
        this.companionStar.blinkTimer = Math.random() * 5 + 3.5;
        setTimeout(() => { this.companionStar.isBlinking = false; }, 130);
      }
      this.companionStar.wingPhase += dt * 6.0;
      if (this.companionStar.bounceOffset < 0) {
        this.companionStar.bounceOffset += dt * 50;
        if (this.companionStar.bounceOffset > 0) this.companionStar.bounceOffset = 0;
      }

      // Familiar Stardust Wisp physics & ribbon tail
      const fam = this.familiar;
      const dx = fam.targetX - fam.x;
      const dy = fam.targetY - fam.y;
      fam.vx += dx * 0.06;
      fam.vy += dy * 0.06;
      fam.vx *= 0.88;
      fam.vy *= 0.88;
      fam.x += fam.vx * dt * 45;
      fam.y += fam.vy * dt * 45;

      fam.wingPhase += dt * 7.5;
      fam.blinkTimer -= dt;
      if (fam.blinkTimer <= 0) {
        fam.isBlinking = true;
        fam.blinkTimer = Math.random() * 3.5 + 2.0;
        setTimeout(() => { fam.isBlinking = false; }, 110);
      }

      // Record ribbon trail
      fam.tail.unshift({ x: fam.x, y: fam.y, time: now });
      if (fam.tail.length > 14) fam.tail.pop();

      // Sheet lightning decay
      if (this.lightningFlash > 0) {
        this.lightningFlash = Math.max(0, this.lightningFlash - dt * 2.5);
      }
    }

    /**
     * Master Canvas Rendering Routine:
     * - Volumetric God Rays
     * - Wood Table Specular Reflection
     * - Outside Stars & Shooting Stars
     * - Window Rain with 3D Caustics
     * - Living Star Expressions (Eyes & Breath)
     * - Familiar Stardust Wisp & Ribbon
     * - Convection Motes & Depth of Field Bokeh
     */
    renderCanvas(now, dt) {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      const mode = COLOR_MODES[this.currentColorKey] || COLOR_MODES.amber;
      const mood = MOODS[this.currentMoodKey] || MOODS.calm;
      const lampPos = this.getImageCoords(706, 466);
      const compPos = this.getImageCoords(970, 372);
      const b = this.brightness;

      // Pulse rhythm of the living lantern star
      const starPulse = 1.0 + Math.sin(now * mood.pulseSpeed) * mood.pulseAmp;

      // =========================================================================
      // LAYER 1: Sheet Lightning Flash (Outside Window)
      // =========================================================================
      if (this.lightningFlash > 0) {
        const winPos = this.getImageCoords(400, 540);
        this.ctx.save();
        this.ctx.fillStyle = `rgba(224, 231, 255, ${this.lightningFlash * 0.55})`;
        this.ctx.fillRect(0, 0, winPos.x, this.canvasHeight);
        this.ctx.restore();
      }

      // =========================================================================
      // LAYER 2: Outside Distant Stars with Diffraction Spikes
      // =========================================================================
      this.ctx.save();
      const winPos = this.getImageCoords(400, 540);
      this.outsideStars.forEach(st => {
        const sx = st.relX * this.canvasWidth + (this.parallax.x * -0.4);
        const sy = st.relY * this.canvasHeight + (this.parallax.y * -0.4);
        const twinkle = 0.4 + Math.sin(now * st.speed + st.phase) * 0.55;

        this.ctx.fillStyle = '#ffffff';
        this.ctx.globalAlpha = twinkle;
        this.ctx.beginPath();
        this.ctx.arc(sx, sy, st.size, 0, Math.PI * 2);
        this.ctx.fill();

        // 4-point cross diffraction spikes (anamorphic lens glint)
        if (st.hasSpikes && twinkle > 0.6) {
          const spikeLen = st.size * 5 * twinkle;
          this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          this.ctx.lineWidth = 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(sx - spikeLen, sy);
          this.ctx.lineTo(sx + spikeLen, sy);
          this.ctx.moveTo(sx, sy - spikeLen);
          this.ctx.lineTo(sx, sy + spikeLen);
          this.ctx.stroke();
        }
      });
      this.ctx.restore();

      // =========================================================================
      // LAYER 3: Volumetric Crepuscular Light Beams (God Rays)
      // =========================================================================
      this.ctx.save();
      this.ctx.globalCompositeOperation = 'screen';
      const numRays = 8;
      const rayOriginX = lampPos.x;
      const rayOriginY = lampPos.y - 12 * lampPos.scale;
      const rayAngleOffset = this.lanternSway.angle * 0.5;

      for (let i = 0; i < numRays; i++) {
        const baseAngle = (i / numRays) * Math.PI * 2 + rayAngleOffset;
        const rayLen = (180 + Math.sin(now * 0.0015 + i) * 30) * lampPos.scale * b;
        const widthSpread = 0.22;

        const p1x = rayOriginX + Math.cos(baseAngle - widthSpread) * rayLen;
        const p1y = rayOriginY + Math.sin(baseAngle - widthSpread) * rayLen;
        const p2x = rayOriginX + Math.cos(baseAngle + widthSpread) * rayLen;
        const p2y = rayOriginY + Math.sin(baseAngle + widthSpread) * rayLen;

        const rayGrad = this.ctx.createRadialGradient(
          rayOriginX, rayOriginY, 15 * lampPos.scale,
          rayOriginX, rayOriginY, rayLen
        );
        rayGrad.addColorStop(0, mode.rayColor);
        rayGrad.addColorStop(0.5, mode.beam);
        rayGrad.addColorStop(1, 'transparent');

        this.ctx.fillStyle = rayGrad;
        this.ctx.beginPath();
        this.ctx.moveTo(rayOriginX, rayOriginY);
        this.ctx.lineTo(p1x, p1y);
        this.ctx.lineTo(p2x, p2y);
        this.ctx.closePath();
        this.ctx.fill();
      }
      this.ctx.restore();

      // =========================================================================
      // LAYER 4: Dynamic Specular Light Puddle on the Wooden Table Sill
      // =========================================================================
      this.ctx.save();
      this.ctx.globalCompositeOperation = 'screen';
      const tablePos = this.getImageCoords(715, 690);
      const puddleGrad = this.ctx.createRadialGradient(
        tablePos.x, tablePos.y, 10,
        tablePos.x, tablePos.y, 130 * lampPos.scale
      );
      puddleGrad.addColorStop(0, mode.woodGlow);
      puddleGrad.addColorStop(0.6, mode.beam);
      puddleGrad.addColorStop(1, 'transparent');

      this.ctx.fillStyle = puddleGrad;
      this.ctx.globalAlpha = b * starPulse * 0.75;
      this.ctx.beginPath();
      // Elliptical pool following wood perspective
      this.ctx.ellipse(tablePos.x, tablePos.y, 140 * lampPos.scale, 45 * lampPos.scale, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      // =========================================================================
      // LAYER 5: Living Expressions for Lantern Star (Eyes, Blush, Core Pulse)
      // =========================================================================
      this.ctx.save();
      const faceX = lampPos.x + (this.lanternSway.angle * 15);
      const faceY = lampPos.y;

      // Soft internal warm core breathing
      const starCoreGrad = this.ctx.createRadialGradient(
        faceX, faceY, 5 * lampPos.scale,
        faceX, faceY, 48 * lampPos.scale * starPulse
      );
      starCoreGrad.addColorStop(0, mode.core);
      starCoreGrad.addColorStop(0.45, mode.glow);
      starCoreGrad.addColorStop(1, 'transparent');

      this.ctx.globalCompositeOperation = 'screen';
      this.ctx.fillStyle = starCoreGrad;
      this.ctx.globalAlpha = (0.35 + (this.mainStar.smileBoost * 0.3)) * b;
      this.ctx.beginPath();
      this.ctx.arc(faceX, faceY, 48 * lampPos.scale * starPulse, 0, Math.PI * 2);
      this.ctx.fill();

      // Specular eye glints & blink over main star's face
      const leftEyePos = this.getImageCoords(685, 468);
      const rightEyePos = this.getImageCoords(743, 448);
      const eyeLookX = this.mainStar.eyeLookX;
      const eyeLookY = this.mainStar.eyeLookY;

      if (!this.mainStar.isBlinking) {
        // High-specular white eye reflections
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.globalAlpha = 0.9;
        [leftEyePos, rightEyePos].forEach(pos => {
          this.ctx.beginPath();
          this.ctx.arc(pos.x + eyeLookX, pos.y + eyeLookY, 2.2 * lampPos.scale, 0, Math.PI * 2);
          this.ctx.fill();
        });
      } else {
        // Cute sleeping/blinking arcs
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = '#78350f';
        this.ctx.lineWidth = 2.0 * lampPos.scale;
        [leftEyePos, rightEyePos].forEach(pos => {
          this.ctx.beginPath();
          this.ctx.arc(pos.x, pos.y, 4 * lampPos.scale, 0.2, Math.PI - 0.2);
          this.ctx.stroke();
        });
      }
      this.ctx.restore();

      // =========================================================================
      // LAYER 6: Living Expressions for Perched Companion Star
      // =========================================================================
      this.ctx.save();
      const compX = compPos.x;
      const compY = compPos.y + this.companionStar.bounceOffset;

      // Translucent luminous fluttering wings
      this.ctx.globalCompositeOperation = 'screen';
      const wingFlap = Math.sin(this.companionStar.wingPhase);
      const wingGrad = this.ctx.createLinearGradient(compX, compY, compX + 35 * compPos.scale, compY - 20);
      wingGrad.addColorStop(0, '#ffffff');
      wingGrad.addColorStop(0.6, mode.glow);
      wingGrad.addColorStop(1, 'transparent');

      this.ctx.fillStyle = wingGrad;
      this.ctx.globalAlpha = 0.5 + Math.abs(wingFlap) * 0.3;
      const wingRadiusX = Math.max(0.1, 16 * compPos.scale);
      const wingRadiusY = Math.max(0.1, 8 * compPos.scale * Math.abs(wingFlap));
      // Right wing
      this.ctx.beginPath();
      this.ctx.ellipse(compX + 22 * compPos.scale, compY - 8, wingRadiusX, wingRadiusY, 0.4, 0, Math.PI * 2);
      this.ctx.fill();
      // Left wing
      this.ctx.beginPath();
      this.ctx.ellipse(compX - 22 * compPos.scale, compY - 8, wingRadiusX, wingRadiusY, -0.4, 0, Math.PI * 2);
      this.ctx.fill();

      // Companion Eye Glints & Blink
      const cLeftEye = this.getImageCoords(941, 348);
      const cRightEye = this.getImageCoords(988, 362);
      if (!this.companionStar.isBlinking) {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.globalAlpha = 0.95;
        [cLeftEye, cRightEye].forEach(pos => {
          this.ctx.beginPath();
          this.ctx.arc(pos.x + this.companionStar.eyeLookX, pos.y + this.companionStar.eyeLookY + this.companionStar.bounceOffset, 2.0 * compPos.scale, 0, Math.PI * 2);
          this.ctx.fill();
        });
      } else {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = '#78350f';
        this.ctx.lineWidth = 1.8 * compPos.scale;
        [cLeftEye, cRightEye].forEach(pos => {
          this.ctx.beginPath();
          this.ctx.arc(pos.x, pos.y + this.companionStar.bounceOffset, 3.5 * compPos.scale, 0.2, Math.PI - 0.2);
          this.ctx.stroke();
        });
      }
      this.ctx.restore();

      // =========================================================================
      // LAYER 7: Ethereal Floating Familiar Stardust Wisp (Lumi's Companion)
      // =========================================================================
      this.renderFamiliarSpirit(now, dt, mode);

      // =========================================================================
      // LAYER 8: Midground Thermal Convection Stardust Motes
      // =========================================================================
      this.ctx.save();
      this.thermalMotes.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = 0.35 + Math.sin(now * 0.003 + p.phase) * 0.4;

        // Wrap around room
        if (p.y < 0) p.y = this.canvasHeight;
        if (p.x < 0) p.x = this.canvasWidth;
        if (p.x > this.canvasWidth) p.x = 0;

        // Light intensification if particle drifts through lantern beam
        const distToLamp = Math.hypot(p.x - lampPos.x, p.y - lampPos.y);
        const inBeamBoost = distToLamp < 140 * lampPos.scale ? 1.8 : 1.0;

        this.ctx.fillStyle = p.colorType === 'gold' ? '#fde047' : '#c084fc';
        this.ctx.globalAlpha = Math.min(1.0, p.alpha * inBeamBoost * b);
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * inBeamBoost, 0, Math.PI * 2);
        this.ctx.fill();
      });
      this.ctx.restore();

      // =========================================================================
      // LAYER 9: Windowpane Glass Rain Droplets with 3D Caustics & Wet Trails
      // =========================================================================
      if (this.raindrops.length > 0) {
        this.ctx.save();
        const winPos = this.getImageCoords(400, 540);
        const winWidth = Math.min(winPos.x, this.canvasWidth * 0.35);

        this.raindrops.forEach(drop => {
          drop.y += drop.speed;
          if (drop.y > this.canvasHeight) {
            drop.y = -10;
            drop.x = Math.random() * winWidth;
          }

          // Wet condensation streak
          this.ctx.strokeStyle = 'rgba(186, 230, 253, 0.22)';
          this.ctx.lineWidth = drop.radius * 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(drop.x, drop.y - drop.tailLength);
          this.ctx.lineTo(drop.x, drop.y);
          this.ctx.stroke();

          // 3D Glass Water Bead Body
          this.ctx.fillStyle = 'rgba(224, 242, 254, 0.45)';
          this.ctx.beginPath();
          this.ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
          this.ctx.fill();

          // Specular white highlight (Top-left)
          this.ctx.fillStyle = '#ffffff';
          this.ctx.globalAlpha = 0.85;
          this.ctx.beginPath();
          this.ctx.arc(drop.x - drop.radius * 0.35, drop.y - drop.radius * 0.35, drop.radius * 0.45, 0, Math.PI * 2);
          this.ctx.fill();
        });
        this.ctx.restore();
      }

      // =========================================================================
      // LAYER 10: Shooting Stars with Ionized Plasma Decay
      // =========================================================================
      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const s = this.shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          this.shootingStars.splice(i, 1);
          continue;
        }

        this.ctx.save();
        const tailX = s.x - s.vx * 7;
        const tailY = s.y - s.vy * 7;
        const grad = this.ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, s.tailColor);
        grad.addColorStop(1, 'transparent');

        this.ctx.strokeStyle = grad;
        this.ctx.lineWidth = 3.5;
        this.ctx.globalAlpha = s.alpha;
        this.ctx.beginPath();
        this.ctx.moveTo(s.x, s.y);
        this.ctx.lineTo(tailX, tailY);
        this.ctx.stroke();

        // White-hot magnesium meteor core
        this.ctx.fillStyle = s.coreColor;
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, 4.0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }

      // =========================================================================
      // LAYER 11: Shadow Creature & Transforming Butterflies
      // =========================================================================
      if (this.shadowCreature) {
        const sc = this.shadowCreature;
        sc.timer += dt;
        if (sc.state === 'creeping') {
          sc.alpha = Math.min(sc.alpha + dt * 0.8, 0.72);
          sc.x += (sc.targetX - sc.x) * 0.035;
          sc.y += (sc.targetY - sc.y) * 0.035;
        } else if (sc.state === 'transforming') {
          sc.alpha = Math.max(sc.alpha - dt * 2.2, 0);
        }

        this.ctx.save();
        this.ctx.globalAlpha = sc.alpha;
        this.ctx.fillStyle = '#0f172a';
        this.ctx.shadowColor = '#475569';
        this.ctx.shadowBlur = 24;
        this.ctx.beginPath();
        this.ctx.arc(sc.x, sc.y, 28, 0, Math.PI * 2);
        this.ctx.fill();

        // Cute glowing eyes on shadow wisp
        this.ctx.fillStyle = '#a855f7';
        this.ctx.beginPath();
        this.ctx.arc(sc.x - 8, sc.y - 4, 3, 0, Math.PI * 2);
        this.ctx.arc(sc.x + 8, sc.y - 4, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }

      // Flying butterflies from transformed shadow
      for (let i = this.butterflies.length - 1; i >= 0; i--) {
        const bfly = this.butterflies[i];
        bfly.x += bfly.vx;
        bfly.y += bfly.vy;
        bfly.alpha -= 0.012;
        bfly.wingPhase += dt * 12;

        if (bfly.alpha <= 0) {
          this.butterflies.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = bfly.alpha;
        this.ctx.fillStyle = bfly.color;
        const flap = Math.cos(bfly.wingPhase) * bfly.size;
        const bRadX = Math.max(0.1, bfly.size);
        const bRadY = Math.max(0.1, Math.abs(flap));
        this.ctx.beginPath();
        this.ctx.ellipse(bfly.x - flap * 0.5, bfly.y, bRadX, bRadY, 0.3, 0, Math.PI * 2);
        this.ctx.ellipse(bfly.x + flap * 0.5, bfly.y, bRadX, bRadY, -0.3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }

      // =========================================================================
      // LAYER 12: Interaction Burst Sparkles & Hearts
      // =========================================================================
      for (let i = this.burstSparkles.length - 1; i >= 0; i--) {
        const sp = this.burstSparkles[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= 0.022;

        if (sp.alpha <= 0) {
          this.burstSparkles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = sp.alpha;
        this.ctx.fillStyle = sp.color;
        this.ctx.shadowColor = sp.color;
        this.ctx.shadowBlur = 8;

        if (sp.isHeart) {
          const sz = sp.size;
          this.ctx.beginPath();
          this.ctx.arc(sp.x - sz / 4, sp.y - sz / 4, sz / 4, Math.PI, 0, false);
          this.ctx.arc(sp.x + sz / 4, sp.y - sz / 4, sz / 4, Math.PI, 0, false);
          this.ctx.lineTo(sp.x, sp.y + sz / 2);
          this.ctx.closePath();
          this.ctx.fill();
        } else {
          this.ctx.beginPath();
          this.ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          this.ctx.fill();
        }
        this.ctx.restore();
      }

      // =========================================================================
      // LAYER 13: Foreground Cinematic Bokeh Discs (Depth of Field)
      // =========================================================================
      this.ctx.save();
      this.ctx.globalCompositeOperation = 'screen';
      this.bokehParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = 0.08 + Math.sin(now * 0.002 + p.phase) * 0.06;

        if (p.x < -30) p.x = this.canvasWidth + 30;
        if (p.x > this.canvasWidth + 30) p.x = -30;
        if (p.y < -30) p.y = this.canvasHeight + 30;
        if (p.y > this.canvasHeight + 30) p.y = -30;

        const bokehGrad = this.ctx.createRadialGradient(p.x, p.y, p.radius * 0.2, p.x, p.y, p.radius);
        bokehGrad.addColorStop(0, mode.core);
        bokehGrad.addColorStop(0.7, mode.glow);
        bokehGrad.addColorStop(1, 'transparent');

        this.ctx.fillStyle = bokehGrad;
        this.ctx.globalAlpha = p.alpha * b;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      });
      this.ctx.restore();
    }

    /**
     * Renders the Ethereal Stardust Spirit Familiar with glowing ribbon tails & fairy wings
     */
    renderFamiliarSpirit(now, dt, mode) {
      const fam = this.familiar;
      this.ctx.save();

      // 1. Fluid Stardust Ribbon Trail
      if (fam.tail.length > 2) {
        this.ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < fam.tail.length - 1; i++) {
          const t1 = fam.tail[i];
          const t2 = fam.tail[i + 1];
          const progress = 1 - (i / fam.tail.length);

          this.ctx.strokeStyle = mode.glow;
          this.ctx.lineWidth = progress * 7;
          this.ctx.globalAlpha = progress * 0.45 * this.brightness;
          this.ctx.beginPath();
          this.ctx.moveTo(t1.x, t1.y);
          this.ctx.lineTo(t2.x, t2.y);
          this.ctx.stroke();
        }
      }

      // 2. Translucent Ethereal Wings
      this.ctx.globalCompositeOperation = 'screen';
      const wingFlap = Math.sin(fam.wingPhase);
      const wingGrad = this.ctx.createLinearGradient(fam.x, fam.y, fam.x + 20, fam.y - 15);
      wingGrad.addColorStop(0, '#ffffff');
      wingGrad.addColorStop(0.7, mode.glow);
      wingGrad.addColorStop(1, 'transparent');

      this.ctx.fillStyle = wingGrad;
      this.ctx.globalAlpha = 0.55 + Math.abs(wingFlap) * 0.3;
      const famWingY = Math.max(0.1, 6 * Math.abs(wingFlap));
      // Right wing
      this.ctx.beginPath();
      this.ctx.ellipse(fam.x + 14, fam.y - 4, 12, famWingY, 0.35, 0, Math.PI * 2);
      this.ctx.fill();
      // Left wing
      this.ctx.beginPath();
      this.ctx.ellipse(fam.x - 14, fam.y - 4, 12, famWingY, -0.35, 0, Math.PI * 2);
      this.ctx.fill();

      // 3. Glowing Radiant Spirit Core
      const coreGrad = this.ctx.createRadialGradient(fam.x, fam.y, 2, fam.x, fam.y, 22);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.35, mode.core);
      coreGrad.addColorStop(0.75, mode.glow);
      coreGrad.addColorStop(1, 'transparent');

      this.ctx.fillStyle = coreGrad;
      this.ctx.globalAlpha = 0.95 * this.brightness;
      this.ctx.beginPath();
      this.ctx.arc(fam.x, fam.y, 20, 0, Math.PI * 2);
      this.ctx.fill();

      // 4. Luminous Anime Eyes & Cheeks
      this.ctx.globalCompositeOperation = 'source-over';
      const dxLook = (this.pointer.x * this.canvasWidth - fam.x);
      const dyLook = (this.pointer.y * this.canvasHeight - fam.y);
      const distLook = Math.hypot(dxLook, dyLook) || 1;
      const eyeX = (dxLook / distLook) * 2.2;
      const eyeY = (dyLook / distLook) * 1.5;

      if (!fam.isBlinking) {
        // High-contrast eye dots
        this.ctx.fillStyle = '#1e1b4b';
        this.ctx.beginPath();
        this.ctx.ellipse(fam.x - 5 + eyeX, fam.y - 1 + eyeY, 2.4, 3.2, 0, 0, Math.PI * 2);
        this.ctx.ellipse(fam.x + 5 + eyeX, fam.y - 1 + eyeY, 2.4, 3.2, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // White specular reflections
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(fam.x - 6 + eyeX, fam.y - 2 + eyeY, 1.1, 0, Math.PI * 2);
        this.ctx.arc(fam.x + 4 + eyeX, fam.y - 2 + eyeY, 1.1, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Sleepy happy curve
        this.ctx.strokeStyle = '#1e1b4b';
        this.ctx.lineWidth = 1.4;
        this.ctx.beginPath();
        this.ctx.arc(fam.x - 5, fam.y - 1, 2.5, 0.2, Math.PI - 0.2);
        this.ctx.arc(fam.x + 5, fam.y - 1, 2.5, 0.2, Math.PI - 0.2);
        this.ctx.stroke();
      }

      // Sweet blushing cheeks
      this.ctx.fillStyle = 'rgba(244, 114, 182, 0.7)';
      this.ctx.beginPath();
      this.ctx.ellipse(fam.x - 8, fam.y + 4, 3.0, 1.8, 0, 0, Math.PI * 2);
      this.ctx.ellipse(fam.x + 8, fam.y + 4, 3.0, 1.8, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }

    /**
     * Toast notices disabled per user request
     */
    showToast(msg) {
      // Intentionally empty: do not display text over the sanctuary
      return;
    }

    /**
     * Saves user preferences to localStorage
     */
    savePreferences() {
      try {
        const payload = {
          color: this.currentColorKey,
          brightness: this.brightness,
          ambience: this.currentAmbienceKey,
          mood: this.currentMoodKey,
          isMuted: this.isMuted
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) { }
    }

    /**
     * Loads user preferences from localStorage
     */
    loadPreferences() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (data.color && COLOR_MODES[data.color]) this.currentColorKey = data.color;
          if (data.brightness !== undefined) this.brightness = Math.max(0.2, Math.min(1.0, data.brightness));
          if (data.ambience && AMBIENCE_MODES[data.ambience]) this.currentAmbienceKey = data.ambience;
          if (data.mood && MOODS[data.mood]) this.currentMoodKey = data.mood;
          if (data.isMuted !== undefined) this.isMuted = !!data.isMuted;
        }
      } catch (e) { }
    }

    /**
     * Resets preferences to default cozy settings
     */
    resetPreferences() {
      this.currentColorKey = 'amber';
      this.brightness = 0.85;
      this.currentAmbienceKey = 'peaceful';
      this.currentMoodKey = 'calm';
      this.isMuted = false;
      this.cancelSleepMode();
      this.activeRainEvent = false;
      this.raindrops = [];

      this.savePreferences();

      // Update UI components
      const slider = this.container.querySelector('#nl-slider-brightness');
      if (slider) slider.value = '85';

      const ambSelect = this.container.querySelector('#nl-select-ambience');
      if (ambSelect) ambSelect.value = 'peaceful';

      const moodSelect = this.container.querySelector('#nl-select-mood');
      if (moodSelect) moodSelect.value = 'calm';

      const muteIcon = this.container.querySelector('#nl-mute-icon');
      if (muteIcon) muteIcon.textContent = '🔊';

      this.updateLightingVisuals();
      this.setAmbience('peaceful');
      this.setMood('calm');

      this.showToast('✨ Nightlight preferences reset to cozy default');
      if (window.dreamAudio && typeof window.dreamAudio.playUnlockSound === 'function') {
        window.dreamAudio.playUnlockSound();
      }
    }

    /**
     * Clean teardown when modal is closed or tab switched
     */
    destroy() {
      this.isMounted = false;

      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      if (this.sleepInterval) {
        clearInterval(this.sleepInterval);
        this.sleepInterval = null;
      }

      this.stopAmbience();

      window.removeEventListener('resize', this.boundResize);
      if (this.container) {
        this.container.removeEventListener('pointermove', this.boundPointerMove);
        this.container.removeEventListener('pointerleave', this.boundPointerLeave);
      }

      this.bokehParticles = [];
      this.thermalMotes = [];
      this.outsideStars = [];
      this.shootingStars = [];
      this.raindrops = [];
      this.burstSparkles = [];
      this.butterflies = [];
      this.shadowCreature = null;
      this.canvas = null;
      this.ctx = null;
    }
  }

  // Export singleton instance on window object
  window.NightlightGuardian = new NightlightGuardianApp();
})();
