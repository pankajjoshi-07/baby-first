/**
 * Lumi — The Little Dream Architect
 * Module: Memory Garden Sanctuary Engine
 * File: memory_garden.js
 * 
 * Features:
 * - High-DPI Living Canvas (1376x768 native coordinate mapping with 2.5D natural parallax)
 * - Central Luminous Cosmic Tree with Volumetric God Rays & Ambient Breathing Auras
 * - 4 Working Seasonal Atmospheres (Spring Bloom, Golden Summer, Autumn Glow, Moonlit Garden)
 * - 5 Distinct Moods (Joy 💛, Love 💖, Achievement ⭐, Peace 🌿, Nostalgia 🔮)
 * - Living Memory Objects: Blooming Cosmic Flowers & Floating Crystal Orbs with growth animations
 * - Deterministic, non-overlapping garden sanctuary anchors across terraces, paths, and boughs
 * - Interactive Canvas Hit-Testing with hover tooltips and detail inspection modal
 * - Create, Edit, and Delete (with confirmation) workflows with input validation
 * - Sliding Glassmorphic Memory Timeline Drawer with Search, Date sorting & Mood filters
 * - Robust Versioned Persistence (localStorage key: 'lumi_memory_garden_v1')
 * - Safe First-Time Initialization (Starter memories ONLY when storage is completely empty)
 * - JSON Export & Import with structural validation
 * - Standalone Web Audio API generative chimes & harmonics respecting mute settings
 * - Complete teardown (destroy) releasing all animation frames, nodes, and listeners
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'lumi_memory_garden_v1';
  const ART_ORIG_WIDTH = 1376;
  const ART_ORIG_HEIGHT = 768;

  // 1. Mood Configurations & Visual Styling
  const MOODS = {
    joy: {
      id: 'joy',
      label: 'Joy',
      icon: '💛',
      color: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.85)',
      coreColor: '#ffffff',
      petalColor: '#f59e0b',
      particleColor: '#fde047',
      audioNote: 'E5',
      desc: 'Laughter, radiant warmth, and sunny unforgettable moments'
    },
    love: {
      id: 'love',
      label: 'Love',
      icon: '💖',
      color: '#f472b6',
      glow: 'rgba(244, 114, 182, 0.85)',
      coreColor: '#fff1f2',
      petalColor: '#ec4899',
      particleColor: '#fb7185',
      audioNote: 'A5',
      desc: 'Tender bonds, gentle hugs, and cherished affection'
    },
    achievement: {
      id: 'achievement',
      label: 'Achievement',
      icon: '⭐',
      color: '#c084fc',
      glow: 'rgba(192, 132, 252, 0.85)',
      coreColor: '#faf5ff',
      petalColor: '#a855f7',
      particleColor: '#e879f9',
      audioNote: 'C6',
      desc: 'Milestones, breakthroughs, bravery, and proud steps forward'
    },
    peace: {
      id: 'peace',
      label: 'Peace',
      icon: '🌿',
      color: '#34d399',
      glow: 'rgba(52, 211, 153, 0.85)',
      coreColor: '#ecfdf5',
      petalColor: '#10b981',
      particleColor: '#6ee7b7',
      audioNote: 'G5',
      desc: 'Stillness, serene breezes, quiet contentment, and meditation'
    },
    nostalgia: {
      id: 'nostalgia',
      label: 'Nostalgia',
      icon: '🔮',
      color: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.85)',
      coreColor: '#f0f9ff',
      petalColor: '#0ea5e9',
      particleColor: '#7dd3fc',
      audioNote: 'D6',
      desc: 'Bittersweet echoes, childhood memories, and timeless dreams'
    }
  };

  // 2. Seasonal Atmosphere Presets (Actually modifies scene filter, lighting, and ambient particles)
  const SEASONS = {
    spring: {
      id: 'spring',
      name: 'Spring Bloom',
      icon: '🌸',
      tagline: 'Fresh morning dew, blooming blossoms & pink cherry petals',
      filter: 'hue-rotate(335deg) saturate(1.22) brightness(1.05)',
      glow: 'rgba(244, 114, 182, 0.32)',
      sunbeam: 'rgba(253, 224, 71, 0.16)',
      particleType: 'petals',
      particleColors: ['#fbcfe8', '#f472b6', '#a7f3d0', '#fde047'],
      soundNote: 'F5'
    },
    summer: {
      id: 'summer',
      name: 'Golden Summer',
      icon: '☀️',
      tagline: 'Radiant golden sunbeams, amber glow & dancing fireflies',
      filter: 'hue-rotate(30deg) saturate(1.35) brightness(1.12)',
      glow: 'rgba(251, 191, 36, 0.38)',
      sunbeam: 'rgba(254, 240, 138, 0.28)',
      particleType: 'fireflies',
      particleColors: ['#fde047', '#f59e0b', '#fb923c', '#ffffff'],
      soundNote: 'A5'
    },
    autumn: {
      id: 'autumn',
      name: 'Autumn Glow',
      icon: '🍁',
      tagline: 'Amber twilight, rustling copper leaves & cozy memories',
      filter: 'hue-rotate(60deg) saturate(1.25) contrast(1.05) brightness(0.98)',
      glow: 'rgba(249, 115, 22, 0.32)',
      sunbeam: 'rgba(251, 146, 60, 0.18)',
      particleType: 'leaves',
      particleColors: ['#fb923c', '#ea580c', '#f59e0b', '#dc2626'],
      soundNote: 'D5'
    },
    moonlit: {
      id: 'moonlit',
      name: 'Moonlit Garden',
      icon: '🌙',
      tagline: 'Deep midnight navy, silver lunar rays & celestial stardust',
      filter: 'hue-rotate(200deg) saturate(1.3) contrast(1.1) brightness(0.95)',
      glow: 'rgba(99, 102, 241, 0.35)',
      sunbeam: 'rgba(165, 243, 252, 0.18)',
      particleType: 'stardust',
      particleColors: ['#c084fc', '#38bdf8', '#818cf8', '#ffffff'],
      soundNote: 'C5'
    }
  };

  // 3. Pre-mapped Sanctuary Anchors across 1376x768 landscape for zero awkward overlapping
  const SANCTUARY_ANCHORS = [
    // Floating Orbs in the canopy & hanging lanterns
    { id: 0, px: 430, py: 410, prefType: 'orb', label: 'West Lantern Bough' },
    { id: 1, px: 530, py: 480, prefType: 'orb', label: 'Mid Canopy West' },
    { id: 2, px: 600, py: 360, prefType: 'orb', label: 'High Bough West' },
    { id: 3, px: 770, py: 370, prefType: 'orb', label: 'High Bough East' },
    { id: 4, px: 870, py: 470, prefType: 'orb', label: 'Mid Canopy East' },
    { id: 5, px: 940, py: 420, prefType: 'orb', label: 'East Lantern Bough' },
    { id: 6, px: 688, py: 310, prefType: 'orb', label: 'Crown of the Tree' },
    { id: 7, px: 350, py: 480, prefType: 'orb', label: 'West Cloud Drift' },
    { id: 8, px: 1030, py: 490, prefType: 'orb', label: 'East Cloud Drift' },

    // Blooming Flowers along stone terrace beds, cobblestone trails, and root shrines
    { id: 9, px: 280, py: 670, prefType: 'flower', label: 'West Terrace Bed A' },
    { id: 10, px: 340, py: 695, prefType: 'flower', label: 'West Terrace Bed B' },
    { id: 11, px: 410, py: 715, prefType: 'flower', label: 'West Cobble Path' },
    { id: 12, px: 480, py: 730, prefType: 'flower', label: 'Lower Stone Step Left' },
    { id: 13, px: 540, py: 680, prefType: 'flower', label: 'Tree Root Shrine West' },
    { id: 14, px: 620, py: 650, prefType: 'flower', label: 'Root Arch Hollow' },
    { id: 15, px: 688, py: 680, prefType: 'flower', label: 'Central Garden Heart' },
    { id: 16, px: 760, py: 660, prefType: 'flower', label: 'Tree Root Shrine East' },
    { id: 17, px: 830, py: 690, prefType: 'flower', label: 'East Cobble Path' },
    { id: 18, px: 910, py: 710, prefType: 'flower', label: 'East Terrace Bed A' },
    { id: 19, px: 980, py: 690, prefType: 'flower', label: 'East Terrace Bed B' },
    { id: 20, px: 1060, py: 660, prefType: 'flower', label: 'Far East Meadow' },
    { id: 21, px: 640, py: 735, prefType: 'flower', label: 'Garden Gateway Left' },
    { id: 22, px: 735, py: 735, prefType: 'flower', label: 'Garden Gateway Right' },
    { id: 23, px: 590, py: 590, prefType: 'flower', label: 'Grotto Niche West' },
    { id: 24, px: 790, py: 600, prefType: 'flower', label: 'Grotto Niche East' }
  ];

  // Default starter memories (Loaded ONLY when localStorage is completely empty on very first use)
  const STARTER_MEMORIES = [
    {
      id: 'mem_starter_1',
      title: 'First Starlight Wish',
      description: 'Lumi showed us how to catch a gentle falling star in a paper cup and whisper a bedtime wish to the night sky.',
      date: '2026-05-12',
      mood: 'joy',
      type: 'flower',
      anchorIndex: 15,
      created: 1715472000000
    },
    {
      id: 'mem_starter_2',
      title: 'Midnight Rain on the Cloud Sea',
      description: 'Listening to the rhythmic tapping of raindrops against the ancient tree leaves while sipping warm cinnamon cocoa.',
      date: '2026-07-20',
      mood: 'peace',
      type: 'flower',
      anchorIndex: 11,
      created: 1721433600000
    },
    {
      id: 'mem_starter_3',
      title: 'Lighting the Cosmic Tree',
      description: 'Climbed the highest spiral staircase and watched all 24 crystal lanterns ignite simultaneously across the galaxy.',
      date: '2026-09-04',
      mood: 'achievement',
      type: 'orb',
      anchorIndex: 2,
      created: 1725408000000
    }
  ];

  class MemoryGardenEngine {
    constructor() {
      this.container = null;
      this.canvas = null;
      this.ctx = null;
      this.isMounted = false;
      this.animationFrameId = null;
      this.lastTime = 0;

      // Dimensions
      this.canvasWidth = 800;
      this.canvasHeight = 520;

      // Garden State
      this.memories = [];
      this.currentSeasonKey = 'spring';
      this.brightness = 0.9;
      this.particlesEnabled = true;
      this.isMuted = false;
      this.activeMoodFilter = 'all';
      this.timelineSearchQuery = '';
      this.timelineSortOrder = 'newest';
      this.isTimelineOpen = false;

      // Interaction State
      this.hoveredMemory = null;
      this.selectedMemory = null;
      this.editingMemoryId = null;
      this.pointer = { x: 0.5, y: 0.5, px: 0, py: 0, isHovering: false };
      this.parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };

      // Particles & Atmospheric FX
      this.ambientParticles = [];
      this.burstSparks = [];
      this.treePulsePhase = 0;

      // Magical Garden Events (Spells)
      this.gardenFairies = [];
      this.stardustShower = [];
      this.wishLanterns = [];
      this.shockwaves = [];
      this.treeFlash = 0;

      // Audio Synthesis
      this.audioCtx = null;

      // Bound Event Listeners for safe removal
      this.boundResize = () => this.onResize();
      this.boundPointerMove = (e) => this.onPointerMove(e);
      this.boundPointerLeave = () => this.onPointerLeave();
      this.boundCanvasClick = (e) => this.onCanvasClick(e);
    }

    /**
     * Mounts Memory Garden inside target container element
     */
    mount(container) {
      if (!container) return;
      this.destroy(); // Ensure clean slate

      this.container = container;
      this.isMounted = true;

      // 1. Load persisted data
      this.loadData();

      // 2. Build DOM layout & HUD
      this.buildUI();

      // 3. Initialize Canvas & High-DPI context
      this.initCanvas();

      // 4. Populate ambient particles
      this.initParticles();

      // 5. Start 60fps render loop
      this.lastTime = performance.now();
      this.animate();

      // 6. Attach event listeners
      window.addEventListener('resize', this.boundResize);
      if (this.canvas) {
        this.canvas.addEventListener('pointermove', this.boundPointerMove);
        this.canvas.addEventListener('pointerleave', this.boundPointerLeave);
        this.canvas.addEventListener('click', this.boundCanvasClick);
      }

      // Play soft opening chime
      this.playHarmonicTone('C5');
    }

    /**
     * Builds DOM HUD overlays, controls, drawers, and modal forms
     */
    buildUI() {
      const season = SEASONS[this.currentSeasonKey] || SEASONS.spring;

      this.container.innerHTML = `
        <div class="memory-garden-wrapper" style="position:relative;width:100%;height:100%;overflow:hidden;background:#050716;font-family:var(--font-sans, system-ui, sans-serif);user-select:none;">
          <!-- 1. Photorealistic Master 1376x768 Scenic Artwork with 2.5D Parallax -->
          <div id="mg-parallax-wrap" style="position:absolute;inset:-15px;transition:transform 0.12s cubic-bezier(0.2, 0.9, 0.4, 1);will-change:transform;">
            <img id="mg-scene-art" src="assets/proj3_garden_hd.jpg" alt="Enchanted Memory Garden" style="width:100%;height:100%;object-fit:cover;display:block;filter:${season.filter};transition:filter 0.6s ease;">
          </div>

          <!-- 2. High-DPI Volumetric & Living Objects Canvas Overlay -->
          <canvas id="mg-canvas" style="position:absolute;inset:0;width:100%;height:100%;z-index:2;cursor:default;"></canvas>

          <!-- 3. Atmospheric Radiance Mask (Transforms scene according to Season) -->
          <div id="mg-light-mask" style="position:absolute;inset:0;pointer-events:none;z-index:1;mix-blend-mode:screen;transition:background 0.6s ease, opacity 0.5s ease;"></div>

          <!-- 4. Interactive Hover Tooltip for Flowers and Orbs -->
          <div id="mg-tooltip" style="display:none;position:absolute;z-index:6;pointer-events:none;transform:translate(-50%, -100%);padding:6px 12px;background:rgba(9,12,36,0.92);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.22);border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.6);white-space:nowrap;transition:opacity 0.15s ease;">
            <div id="mg-tooltip-content" style="display:flex;align-items:center;gap:6px;font-size:0.75rem;font-weight:600;color:#ffffff;"></div>
            <div style="font-size:0.65rem;color:#cbd5e1;text-align:center;margin-top:2px;">Click to view story ✨</div>
          </div>

          <!-- 5. Glassmorphism HUD Controls (Top & Bottom Bars) -->
          <div class="mg-hud" style="position:absolute;inset:0;pointer-events:none;z-index:5;display:flex;flex-direction:column;justify-content:space-between;padding:12px;box-sizing:border-box;">
            <!-- Top Bar: Title Badge, Season Presets, Brightness, Mute, Help -->
            <div class="mg-top-bar" style="display:flex;justify-content:space-between;align-items:center;width:100%;gap:8px;flex-wrap:wrap;pointer-events:auto;">
              <!-- Title Badge -->
              <div class="mg-title-badge" style="display:inline-flex;align-items:center;gap:8px;background:rgba(9,12,36,0.85);backdrop-filter:blur(12px);border:1px solid rgba(244,114,182,0.35);padding:5px 12px;border-radius:20px;box-shadow:0 4px 16px rgba(0,0,0,0.5);flex-shrink:0;">
                <span style="font-size:1.0rem;">🌸</span>
                <div>
                  <div style="font-size:0.78rem;font-weight:700;color:#ffffff;line-height:1.2;">Memory Garden <span style="color:#f472b6;font-size:0.68rem;font-weight:600;">Sanctuary</span></div>
                  <div id="mg-stats-count" style="font-size:0.65rem;color:#cbd5e1;line-height:1;">Blooming: ${this.memories.length} Memories</div>
                </div>
              </div>

              <!-- 4 Working Season Atmosphere Selector Pills -->
              <div class="mg-season-selector" style="display:inline-flex;align-items:center;gap:4px;background:rgba(9,12,36,0.88);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.14);border-radius:20px;padding:3px 6px;">
                ${Object.values(SEASONS).map(s => `
                  <button class="mg-season-btn ${s.id === this.currentSeasonKey ? 'active' : ''}" data-season="${s.id}" title="${s.tagline}" style="background:${s.id === this.currentSeasonKey ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'transparent'};border:1px solid ${s.id === this.currentSeasonKey ? '#f472b6' : 'transparent'};color:#fff;padding:3px 8px;border-radius:14px;font-size:0.7rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all 0.2s;">
                    <span>${s.icon}</span> <span>${s.name}</span>
                  </button>
                `).join('')}
              </div>

              <!-- Top Right Controls (Particles, Brightness, Sound, Guide, Data) -->
              <div class="mg-top-tools" style="display:inline-flex;align-items:center;gap:6px;flex-shrink:0;">
                <button id="mg-btn-particles" title="Toggle Floating Stardust & Fireflies" style="background:${this.particlesEnabled ? 'rgba(56,189,248,0.25)' : 'rgba(9,12,36,0.85)'};border:1px solid ${this.particlesEnabled ? '#38bdf8' : 'rgba(255,255,255,0.18)'};color:#7dd3fc;padding:4px 8px;border-radius:14px;font-size:0.68rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:3px;transition:all 0.2s;">
                  <span>✨</span> <span>FX</span>
                </button>

                <div style="display:inline-flex;align-items:center;gap:4px;background:rgba(9,12,36,0.85);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.15);padding:2px 8px;border-radius:14px;">
                  <span style="font-size:0.68rem;">💡</span>
                  <input id="mg-slider-brightness" type="range" min="30" max="100" value="${Math.round(this.brightness * 100)}" style="width:50px;accent-color:#f472b6;cursor:pointer;" title="Adjust Garden Light Intensity">
                </div>

                <button id="mg-btn-mute" title="Toggle Audio Sound" style="background:rgba(9,12,36,0.85);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.18);color:#fff;border-radius:50%;width:28px;height:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;">
                  <span id="mg-mute-icon">${this.isMuted ? '🔇' : '🔊'}</span>
                </button>

                <button id="mg-btn-help" title="Sanctuary Secrets & Guide" style="background:rgba(9,12,36,0.85);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.18);color:#fff;border-radius:50%;width:28px;height:28px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;transition:all 0.2s;">
                  ?
                </button>

                <button id="mg-btn-data-menu" title="Backup & Restore Memories (Export / Import)" style="background:rgba(168,85,247,0.25);border:1px solid rgba(168,85,247,0.45);color:#d8b4fe;padding:4px 8px;border-radius:14px;font-size:0.68rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:3px;transition:all 0.2s;">
                  <span>⚙️</span> <span>Data</span>
                </button>
              </div>
            </div>

            <!-- Bottom Controls Deck (Two-tier: Spells Bar + Action/Filter Dock) -->
            <div class="mg-bottom-deck" style="display:flex;flex-direction:column;gap:6px;width:100%;pointer-events:auto;align-items:center;">
              <!-- Tier 1: Magical Garden Spells Bar -->
              <div class="mg-spells-bar" style="display:flex;align-items:center;gap:6px;background:rgba(9,12,36,0.88);backdrop-filter:blur(12px);border:1px solid rgba(244,114,182,0.3);padding:3px 8px;border-radius:20px;box-shadow:0 4px 18px rgba(0,0,0,0.5);flex-wrap:wrap;justify-content:center;">
                <span style="font-size:0.68rem;color:#f472b6;font-weight:700;letter-spacing:0.5px;padding-left:4px;text-transform:uppercase;">Magic:</span>
                <button id="mg-btn-event-fairies" class="mg-spell-btn" title="Summon a swarm of bioluminescent fluttering fairies">
                  <span>🦋</span> <span>Fairy Swarm</span>
                </button>
                <button id="mg-btn-event-shower" class="mg-spell-btn" title="Call down a glittering stardust meteor shower">
                  <span>✨</span> <span>Stardust Shower</span>
                </button>
                <button id="mg-btn-event-lantern" class="mg-spell-btn" title="Release a warm glowing silk wish lantern into the sky">
                  <span>🏮</span> <span>Wish Lantern</span>
                </button>
                <button id="mg-btn-event-resonate" class="mg-spell-btn" title="Awaken the Cosmic Tree to resonate memory harmonics">
                  <span>🔮</span> <span>Tree Resonance</span>
                </button>
              </div>

              <!-- Tier 2: Action & Filter Dock -->
              <div class="mg-actions-dock" style="display:flex;justify-content:space-between;align-items:center;width:100%;gap:8px;flex-wrap:wrap;">
                <!-- Left: Plant Memory Primary Button -->
                <button id="mg-btn-open-create" style="background:linear-gradient(135deg, #f472b6, #a855f7);border:1px solid #fbcfe8;color:#ffffff;padding:5px 13px;border-radius:18px;font-size:0.75rem;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 18px rgba(244,114,182,0.45);transition:all 0.2s;">
                  <span>🌱</span> <span>Plant Memory</span>
                </button>

                <!-- Center: Compact Mood Filters -->
                <div class="mg-filter-row" style="display:inline-flex;align-items:center;gap:4px;background:rgba(9,12,36,0.9);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.14);border-radius:20px;padding:3px 6px;overflow-x:auto;max-width:100%;">
                  <button class="mg-filter-btn ${this.activeMoodFilter === 'all' ? 'active' : ''}" data-filter="all" style="background:${this.activeMoodFilter === 'all' ? 'rgba(255,255,255,0.2)' : 'transparent'};border:none;color:#fff;padding:2px 6px;border-radius:12px;font-size:0.68rem;font-weight:600;cursor:pointer;">
                    All (${this.memories.length})
                  </button>
                  ${Object.values(MOODS).map(m => {
                    const count = this.memories.filter(x => x.mood === m.id).length;
                    const isAct = this.activeMoodFilter === m.id;
                    return `
                      <button class="mg-filter-btn ${isAct ? 'active' : ''}" data-filter="${m.id}" title="${m.desc}" style="background:${isAct ? m.color : 'transparent'};color:${isAct ? '#000' : '#cbd5e1'};border:none;padding:2px 6px;border-radius:12px;font-size:0.68rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:3px;transition:all 0.2s;">
                        <span>${m.icon}</span> <span>${m.label}</span> <span style="opacity:0.8;">(${count})</span>
                      </button>
                    `;
                  }).join('')}
                </div>

                <!-- Right: Timeline Drawer Toggle -->
                <button id="mg-btn-toggle-timeline" style="background:rgba(9,12,36,0.85);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.2);color:#ffffff;padding:5px 12px;border-radius:18px;font-size:0.72rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all 0.2s;">
                  <span>📜</span> <span>${this.isTimelineOpen ? 'Hide Timeline' : 'Timeline'}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 6. Sliding Memory Timeline Drawer (Explore chronological memories without hiding garden) -->
          <div id="mg-timeline-drawer" style="display:${this.isTimelineOpen ? 'flex' : 'none'};position:absolute;bottom:84px;left:12px;right:12px;max-height:220px;background:rgba(9,12,36,0.94);backdrop-filter:blur(16px);border:1px solid rgba(244,114,182,0.4);border-radius:16px;z-index:7;flex-direction:column;box-shadow:0 12px 36px rgba(0,0,0,0.8);padding:10px;animation:fadeIn 0.2s ease;">
            <!-- Drawer Header -->
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.1);">
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="font-size:0.85rem;">📜</span>
                <span style="font-size:0.75rem;font-weight:700;color:#ffffff;">Chronological Memory Stream</span>
                <span id="mg-timeline-count-badge" style="font-size:0.65rem;background:rgba(255,255,255,0.1);padding:1px 6px;border-radius:10px;color:#cbd5e1;"></span>
              </div>
              <div style="display:flex;align-items:center;gap:6px;">
                <input id="mg-input-search" type="text" placeholder="Search memories..." value="${this.timelineSearchQuery}" style="background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.15);color:#fff;border-radius:10px;padding:2px 8px;font-size:0.7rem;outline:none;width:120px;">
                <button id="mg-btn-sort-toggle" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#cbd5e1;padding:2px 8px;border-radius:10px;font-size:0.68rem;cursor:pointer;">
                  ${this.timelineSortOrder === 'newest' ? '📅 Newest' : '📅 Oldest'}
                </button>
                <button id="mg-btn-close-timeline" style="background:transparent;border:none;color:#94a3b8;font-size:0.9rem;cursor:pointer;padding:0 4px;">✕</button>
              </div>
            </div>

            <!-- Drawer Memory Horizontal Cards Track -->
            <div id="mg-timeline-list" style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scrollbar-width:thin;">
              <!-- Dynamic Cards rendered here -->
            </div>
          </div>

          <!-- 7. Create / Edit Memory Modal Dialog -->
          <div id="mg-modal-form" style="display:none;position:absolute;inset:0;background:rgba(4,6,18,0.85);backdrop-filter:blur(10px);z-index:10;align-items:center;justify-content:center;padding:16px;">
            <div style="background:rgba(15,18,44,0.96);border:1px solid rgba(244,114,182,0.45);border-radius:18px;max-width:420px;width:100%;padding:20px;box-shadow:0 16px 48px rgba(0,0,0,0.8);position:relative;">
              <h3 id="mg-form-title" style="font-family:var(--font-display, serif);font-size:1.15rem;color:#ffffff;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
                <span>🌱</span> <span>Plant a Living Memory</span>
              </h3>

              <form id="mg-form" onsubmit="return false;" style="display:flex;flex-direction:column;gap:10px;">
                <!-- Title -->
                <div>
                  <label style="display:block;font-size:0.72rem;font-weight:600;color:#cbd5e1;margin-bottom:4px;">Memory Title *</label>
                  <input id="mg-input-title" type="text" maxlength="60" required placeholder="e.g. Starry Night Campfire" style="width:100%;background:rgba(6,9,26,0.85);border:1px solid rgba(255,255,255,0.18);border-radius:10px;padding:6px 10px;color:#fff;font-size:0.8rem;outline:none;box-sizing:border-box;">
                </div>

                <!-- Date & Mood row -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                  <div>
                    <label style="display:block;font-size:0.72rem;font-weight:600;color:#cbd5e1;margin-bottom:4px;">Date *</label>
                    <input id="mg-input-date" type="date" required style="width:100%;background:rgba(6,9,26,0.85);border:1px solid rgba(255,255,255,0.18);border-radius:10px;padding:5px 8px;color:#fff;font-size:0.75rem;outline:none;box-sizing:border-box;">
                  </div>
                  <div>
                    <label style="display:block;font-size:0.72rem;font-weight:600;color:#cbd5e1;margin-bottom:4px;">Form in Garden</label>
                    <select id="mg-select-type" style="width:100%;background:rgba(6,9,26,0.85);border:1px solid rgba(255,255,255,0.18);border-radius:10px;padding:5px 8px;color:#fff;font-size:0.75rem;outline:none;box-sizing:border-box;">
                      <option value="flower">🌸 Blooming Flower</option>
                      <option value="orb">🔮 Floating Crystal Orb</option>
                    </select>
                  </div>
                </div>

                <!-- Mood Selector Pills -->
                <div>
                  <label style="display:block;font-size:0.72rem;font-weight:600;color:#cbd5e1;margin-bottom:4px;">Mood Resonance *</label>
                  <div id="mg-form-mood-pills" style="display:flex;gap:5px;flex-wrap:wrap;">
                    ${Object.values(MOODS).map(m => `
                      <button type="button" class="mg-form-mood-btn" data-mood="${m.id}" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.18);color:#fff;padding:4px 8px;border-radius:12px;font-size:0.7rem;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all 0.2s;">
                        <span>${m.icon}</span> <span>${m.label}</span>
                      </button>
                    `).join('')}
                  </div>
                  <input type="hidden" id="mg-selected-mood" value="joy">
                </div>

                <!-- Description Story -->
                <div>
                  <label style="display:block;font-size:0.72rem;font-weight:600;color:#cbd5e1;margin-bottom:4px;">Cherished Story & Reflection *</label>
                  <textarea id="mg-input-desc" rows="3" maxlength="280" required placeholder="What made this moment gentle, inspiring, or unforgettable?" style="width:100%;background:rgba(6,9,26,0.85);border:1px solid rgba(255,255,255,0.18);border-radius:10px;padding:6px 10px;color:#fff;font-size:0.78rem;outline:none;resize:none;box-sizing:border-box;line-height:1.4;"></textarea>
                </div>

                <!-- Inline Validation Error Notice -->
                <div id="mg-form-error" style="display:none;color:#f87171;font-size:0.7rem;line-height:1.2;"></div>

                <!-- Action buttons -->
                <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:6px;">
                  <button type="button" id="mg-btn-cancel-form" style="background:transparent;border:1px solid rgba(255,255,255,0.2);color:#94a3b8;padding:6px 14px;border-radius:12px;font-size:0.75rem;cursor:pointer;">
                    Cancel
                  </button>
                  <button type="submit" id="mg-btn-submit-form" style="background:linear-gradient(135deg, #f472b6, #a855f7);border:none;color:#fff;padding:6px 16px;border-radius:12px;font-size:0.75rem;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(244,114,182,0.4);">
                    Blossom into Garden ✨
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- 8. Memory Detail Inspection Modal -->
          <div id="mg-modal-detail" style="display:none;position:absolute;inset:0;background:rgba(4,6,18,0.85);backdrop-filter:blur(10px);z-index:10;align-items:center;justify-content:center;padding:16px;">
            <div style="background:rgba(15,18,44,0.96);border:1px solid rgba(253,224,71,0.45);border-radius:18px;max-width:400px;width:100%;padding:22px;box-shadow:0 16px 48px rgba(0,0,0,0.85);position:relative;">
              <!-- Detail Header -->
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
                <div id="mg-detail-mood-badge" style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:12px;font-size:0.7rem;font-weight:700;"></div>
                <div id="mg-detail-date" style="font-size:0.7rem;color:#94a3b8;"></div>
              </div>

              <h3 id="mg-detail-title" style="font-family:var(--font-display, serif);font-size:1.3rem;color:#ffffff;line-height:1.3;margin-bottom:10px;"></h3>

              <div id="mg-detail-desc" style="font-size:0.82rem;color:#e2e8f0;line-height:1.6;margin-bottom:18px;background:rgba(255,255,255,0.03);padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);max-height:180px;overflow-y:auto;"></div>

              <!-- Action buttons -->
              <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,0.1);padding-top:12px;">
                <button id="mg-btn-delete-mem" style="background:rgba(239,68,68,0.18);border:1px solid rgba(239,68,68,0.4);color:#fca5a5;padding:5px 12px;border-radius:10px;font-size:0.72rem;cursor:pointer;">
                  🗑️ Release Memory
                </button>
                <div style="display:flex;gap:6px;">
                  <button id="mg-btn-edit-mem" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#cbd5e1;padding:5px 12px;border-radius:10px;font-size:0.72rem;cursor:pointer;">
                    ✏️ Edit
                  </button>
                  <button id="mg-btn-close-detail" style="background:linear-gradient(135deg, #a855f7, #ec4899);border:none;color:#fff;padding:5px 16px;border-radius:10px;font-size:0.72rem;font-weight:700;cursor:pointer;">
                    Back to Garden
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 9. Delete Confirmation Modal Dialog -->
          <div id="mg-modal-confirm-delete" style="display:none;position:absolute;inset:0;background:rgba(4,6,18,0.88);backdrop-filter:blur(8px);z-index:12;align-items:center;justify-content:center;padding:16px;">
            <div style="background:rgba(20,24,54,0.98);border:1px solid rgba(239,68,68,0.5);border-radius:16px;padding:20px;max-width:320px;width:100%;text-align:center;">
              <div style="font-size:2rem;margin-bottom:8px;">✨</div>
              <h4 style="font-size:0.95rem;color:#ffffff;margin-bottom:6px;">Release Memory into Stardust?</h4>
              <p style="font-size:0.75rem;color:#cbd5e1;margin-bottom:16px;line-height:1.4;">
                This memory will dissolve softly into the cosmic winds. This action cannot be undone.
              </p>
              <div style="display:flex;justify-content:center;gap:10px;">
                <button id="mg-btn-cancel-delete" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:#cbd5e1;padding:6px 14px;border-radius:10px;font-size:0.75rem;cursor:pointer;">
                  Keep Memory
                </button>
                <button id="mg-btn-confirm-delete" style="background:#ef4444;border:none;color:#fff;padding:6px 14px;border-radius:10px;font-size:0.75rem;font-weight:700;cursor:pointer;">
                  Release into Stars ✨
                </button>
              </div>
            </div>
          </div>

          <!-- 10. Data Backup & Restore Modal (JSON Export & Import) -->
          <div id="mg-modal-data" style="display:none;position:absolute;inset:0;background:rgba(4,6,18,0.85);backdrop-filter:blur(10px);z-index:10;align-items:center;justify-content:center;padding:16px;">
            <div style="background:rgba(15,18,44,0.96);border:1px solid rgba(168,85,247,0.5);border-radius:18px;max-width:360px;width:100%;padding:20px;box-shadow:0 16px 48px rgba(0,0,0,0.85);">
              <h3 style="font-family:var(--font-display, serif);font-size:1.1rem;color:#ffffff;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
                <span>⚙️</span> <span>Garden Memory Archive</span>
              </h3>
              <p style="font-size:0.75rem;color:#cbd5e1;margin-bottom:16px;line-height:1.4;">
                Safely export your sanctuary memories as a JSON file or restore a previously saved memory collection.
              </p>

              <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px;">
                <button id="mg-btn-export-json" style="background:linear-gradient(135deg, rgba(56,189,248,0.25), rgba(99,102,241,0.25));border:1px solid rgba(56,189,248,0.5);color:#7dd3fc;padding:8px 12px;border-radius:12px;font-size:0.78rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;">
                  <span>📥</span> <span>Export Memories to JSON File</span>
                </button>

                <label style="background:linear-gradient(135deg, rgba(244,114,182,0.2), rgba(168,85,247,0.2));border:1px dashed rgba(244,114,182,0.5);color:#f472b6;padding:8px 12px;border-radius:12px;font-size:0.78rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;text-align:center;">
                  <span>📤</span> <span>Import Memories from JSON File</span>
                  <input type="file" id="mg-file-import" accept=".json,application/json" style="display:none;">
                </label>
              </div>

              <div id="mg-data-msg" style="display:none;font-size:0.72rem;padding:6px 10px;border-radius:8px;margin-bottom:12px;text-align:center;"></div>

              <div style="display:flex;justify-content:flex-end;">
                <button id="mg-btn-close-data" style="background:transparent;border:1px solid rgba(255,255,255,0.2);color:#94a3b8;padding:5px 14px;border-radius:10px;font-size:0.75rem;cursor:pointer;">
                  Close
                </button>
              </div>
            </div>
          </div>

          <!-- 11. First-Use Guide / Help Modal -->
          <div id="mg-modal-guide" style="display:none;position:absolute;inset:0;background:rgba(4,6,18,0.88);backdrop-filter:blur(8px);z-index:10;align-items:center;justify-content:center;padding:16px;">
            <div style="background:rgba(15,18,44,0.96);border:1px solid rgba(244,114,182,0.5);border-radius:18px;padding:22px;max-width:380px;width:100%;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,0.7);">
              <div style="font-size:1.8rem;margin-bottom:6px;">🌸</div>
              <h3 style="font-family:var(--font-display, serif);font-size:1.25rem;color:#ffffff;margin-bottom:8px;">Memory Garden Sanctuary</h3>
              <div style="text-align:left;font-size:0.78rem;color:#cbd5e1;line-height:1.5;margin-bottom:16px;display:flex;flex-direction:column;gap:7px;">
                <div>🌱 <strong>Plant a Memory:</strong> Record a joyful milestone, tender moment, or quiet memory.</div>
                <div>🌸 <strong>Living Forms:</strong> Memories bloom as glowing flowers along stone terraces or float as crystal orbs among the ancient branches.</div>
                <div>✨ <strong>Explore Stories:</strong> Click any glowing flower or orb to open its story, edit, or reflect.</div>
                <div>🍂 <strong>4 Seasonal Presets:</strong> Switch Spring, Summer, Autumn, and Moonlit atmospheres to transform light, colors, and particles.</div>
                <div>📜 <strong>Timeline Stream:</strong> Open the timeline drawer to search, sort by date, and filter by mood resonance.</div>
              </div>
              <button id="mg-btn-close-guide" style="background:linear-gradient(135deg, #f472b6, #a855f7);border:none;color:#fff;padding:8px 22px;border-radius:14px;font-size:0.8rem;font-weight:700;cursor:pointer;">
                Enter the Sanctuary ✨
              </button>
            </div>
          </div>
        </div>
      `;

      this.updateLightingVisuals();
      this.attachListeners();
      this.renderTimelineTrack();
    }

    /**
     * Maps coordinate (px, py) from the native 1376x768 image onto responsive High-DPI canvas
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
        offsetY: offsetY
      };
    }

    /**
     * Initializes Canvas with devicePixelRatio for ultra-crisp rendering
     */
    initCanvas() {
      this.canvas = this.container.querySelector('#mg-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.onResize();
    }

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
     * Initializes floating seasonal particles & fireflies
     */
    initParticles() {
      this.ambientParticles = [];
      const season = SEASONS[this.currentSeasonKey] || SEASONS.spring;

      for (let i = 0; i < 45; i++) {
        this.ambientParticles.push({
          x: Math.random() * this.canvasWidth,
          y: Math.random() * this.canvasHeight,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -Math.random() * 0.5 - 0.1,
          size: Math.random() * 3.5 + 1.2,
          alpha: Math.random() * 0.6 + 0.2,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.002 + 0.001,
          color: season.particleColors[Math.floor(Math.random() * season.particleColors.length)],
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.03
        });
      }
    }

    /**
     * Updates seasonal filter, lighting mask, and button states
     */
    updateLightingVisuals() {
      const season = SEASONS[this.currentSeasonKey] || SEASONS.spring;
      const art = this.container.querySelector('#mg-scene-art');
      const mask = this.container.querySelector('#mg-light-mask');
      const b = this.brightness;

      if (art) {
        art.style.filter = `${season.filter} brightness(${0.7 + b * 0.35})`;
      }

      if (mask) {
        mask.style.opacity = `${b * 0.85}`;
        const treePos = this.getImageCoords(688, 380);
        const pctX = Math.round((treePos.x / this.canvasWidth) * 100);
        const pctY = Math.round((treePos.y / this.canvasHeight) * 100);
        mask.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, ${season.glow} 0%, ${season.sunbeam} 45%, transparent 75%)`;
      }

      // Update season buttons
      this.container.querySelectorAll('.mg-season-btn').forEach(btn => {
        const isMatch = btn.dataset.season === this.currentSeasonKey;
        btn.classList.toggle('active', isMatch);
        btn.style.background = isMatch
          ? 'linear-gradient(135deg, #ec4899, #a855f7)'
          : 'transparent';
        btn.style.borderColor = isMatch ? '#f472b6' : 'transparent';
      });

      // Update stats count
      const countEl = this.container.querySelector('#mg-stats-count');
      if (countEl) {
        countEl.textContent = `Blooming: ${this.memories.length} Memories`;
      }
    }

    /**
     * Switches seasonal atmosphere
     */
    setSeason(seasonKey) {
      if (!SEASONS[seasonKey]) return;
      this.currentSeasonKey = seasonKey;
      this.updateLightingVisuals();
      this.initParticles();
      this.saveData();

      // Soft harmonic chime
      this.playHarmonicTone(SEASONS[seasonKey].soundNote);
    }

    /**
     * Pointer tracking for 2.5D natural camera drift and interactive canvas hit-testing
     */
    onPointerMove(e) {
      if (!this.container || !this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      this.pointer.px = clientX;
      this.pointer.py = clientY;
      this.pointer.x = clientX / this.canvasWidth;
      this.pointer.y = clientY / this.canvasHeight;
      this.pointer.isHovering = true;

      // Parallax target (subtle realistic drift)
      this.parallax.targetX = (this.pointer.x - 0.5) * 16;
      this.parallax.targetY = (this.pointer.y - 0.5) * 10;

      // Hit-testing memory objects
      this.checkHitTest(clientX, clientY);
    }

    onPointerLeave() {
      this.pointer.isHovering = false;
      this.parallax.targetX = 0;
      this.parallax.targetY = 0;
      this.hoveredMemory = null;
      this.canvas.style.cursor = 'default';
      const tooltip = this.container.querySelector('#mg-tooltip');
      if (tooltip) tooltip.style.display = 'none';
    }

    /**
     * Checks if pointer is hovering over any living flower or floating orb
     */
    checkHitTest(px, py) {
      let found = null;
      let minDistance = 24; // Hit radius in pixels

      const now = performance.now();
      const filtered = this.getFilteredMemories();

      for (const mem of filtered) {
        const anchor = this.getMemoryAnchor(mem);
        const mapped = this.getImageCoords(anchor.px, anchor.py);

        // Account for flower/orb hover offsets
        let objX = mapped.x;
        let objY = mapped.y;
        if (mem.type === 'orb') {
          objY += Math.sin(now * 0.003 + (mem.created % 100)) * 7;
        } else {
          objX += Math.sin(now * 0.002 + (mem.created % 50)) * 2;
        }

        const dist = Math.hypot(px - objX, py - objY);
        if (dist < minDistance) {
          found = mem;
          found._screenX = objX;
          found._screenY = objY;
          break;
        }
      }

      this.hoveredMemory = found;
      const tooltip = this.container.querySelector('#mg-tooltip');
      const tooltipContent = this.container.querySelector('#mg-tooltip-content');

      if (found && tooltip && tooltipContent) {
        this.canvas.style.cursor = 'pointer';
        const mood = MOODS[found.mood] || MOODS.joy;
        tooltipContent.innerHTML = `
          <span>${mood.icon}</span>
          <span style="color:#ffffff;">${this.escapeHtml(found.title)}</span>
          <span style="color:${mood.color};font-size:0.65rem;">(${found.date})</span>
        `;
        tooltip.style.left = `${found._screenX}px`;
        tooltip.style.top = `${found._screenY - 14}px`;
        tooltip.style.display = 'block';
      } else if (tooltip) {
        this.canvas.style.cursor = 'default';
        tooltip.style.display = 'none';
      }
    }

    /**
     * Handles canvas click to open hovered memory detail
     */
    onCanvasClick(e) {
      if (this.hoveredMemory) {
        this.openMemoryDetail(this.hoveredMemory.id);
      }
    }

    /**
     * Gets screen anchor coordinates for a memory, falling back gracefully
     */
    getMemoryAnchor(memory) {
      const idx = memory.anchorIndex !== undefined
        ? memory.anchorIndex % SANCTUARY_ANCHORS.length
        : 15;
      return SANCTUARY_ANCHORS[idx] || SANCTUARY_ANCHORS[15];
    }

    /**
     * Filtered memories according to active mood filter
     */
    getFilteredMemories() {
      if (this.activeMoodFilter === 'all') {
        return this.memories;
      }
      return this.memories.filter(m => m.mood === this.activeMoodFilter);
    }

    /**
     * Finds next unoccupied anchor suitable for object type (flower or orb)
     */
    findAvailableAnchor(preferredType) {
      const usedAnchors = new Set(this.memories.map(m => m.anchorIndex));

      // 1. First pass: find preferred type anchor that is free
      for (let i = 0; i < SANCTUARY_ANCHORS.length; i++) {
        const a = SANCTUARY_ANCHORS[i];
        if (!usedAnchors.has(i) && a.prefType === preferredType) {
          return i;
        }
      }

      // 2. Second pass: find any free anchor
      for (let i = 0; i < SANCTUARY_ANCHORS.length; i++) {
        if (!usedAnchors.has(i)) {
          return i;
        }
      }

      // 3. Fallback: cycle through anchors
      return this.memories.length % SANCTUARY_ANCHORS.length;
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
      const wrap = this.container.querySelector('#mg-parallax-wrap');
      if (wrap) {
        wrap.style.transform = `translate3d(${this.parallax.x}px, ${this.parallax.y}px, 0)`;
      }

      // 2. Render High-DPI Canvas layers safely
      try {
        this.renderCanvas(now, dt);
      } catch (err) {
        console.error('Memory Garden canvas render glitch:', err);
      }
    }

    /**
     * Master Canvas Render Routine:
     * - Layer 1: Volumetric Tree Canopy God Rays & Heart Glow
     * - Layer 2: Seasonal Ambient Particles & Fireflies
     * - Layer 3: Living Blooming Memory Flowers
     * - Layer 4: Ethereal Floating Crystal Memory Orbs
     * - Layer 5: Interaction Burst Sparks & Floating Stardust
     */
    renderCanvas(now, dt) {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

      const season = SEASONS[this.currentSeasonKey] || SEASONS.spring;
      const b = this.brightness;
      const treePos = this.getImageCoords(688, 380);
      const rootPos = this.getImageCoords(688, 620);

      // =========================================================================
      // LAYER 1: Central Luminous Cosmic Tree Volumetric Radiance & God Rays
      // =========================================================================
      this.treePulsePhase += dt * 1.5;
      const treePulse = 1.0 + Math.sin(this.treePulsePhase) * 0.08;

      this.ctx.save();
      this.ctx.globalCompositeOperation = 'screen';
      const treeGrad = this.ctx.createRadialGradient(
        treePos.x, treePos.y, 10,
        treePos.x, treePos.y, 220 * treePos.scale * treePulse
      );
      treeGrad.addColorStop(0, '#ffffff');
      treeGrad.addColorStop(0.3, season.glow);
      treeGrad.addColorStop(0.7, season.sunbeam);
      treeGrad.addColorStop(1, 'transparent');

      this.ctx.fillStyle = treeGrad;
      this.ctx.globalAlpha = 0.55 * b;
      this.ctx.beginPath();
      this.ctx.arc(treePos.x, treePos.y, 220 * treePos.scale * treePulse, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();

      // =========================================================================
      // LAYER 1.5: Tree Flash & Expanding Harmonic Shockwaves (Spells)
      // =========================================================================
      if (this.treeFlash > 0) {
        this.treeFlash = Math.max(0, this.treeFlash - dt * 1.2);
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        const flashGrad = this.ctx.createRadialGradient(
          treePos.x, treePos.y, 10,
          treePos.x, treePos.y, 350 * treePos.scale
        );
        flashGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        flashGrad.addColorStop(0.3, 'rgba(244, 114, 182, 0.6)');
        flashGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.3)');
        flashGrad.addColorStop(1, 'transparent');

        this.ctx.fillStyle = flashGrad;
        this.ctx.globalAlpha = this.treeFlash * b;
        this.ctx.beginPath();
        this.ctx.arc(treePos.x, treePos.y, 350 * treePos.scale, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }

      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        const sw = this.shockwaves[i];
        sw.radius += sw.speed * dt;
        sw.alpha = Math.max(0, 1.0 - (sw.radius / sw.maxRadius));

        if (sw.radius >= sw.maxRadius || sw.alpha <= 0) {
          this.shockwaves.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.globalAlpha = sw.alpha * 0.85 * b;

        const rad = Math.max(0.1, sw.radius);
        this.ctx.strokeStyle = sw.color;
        this.ctx.lineWidth = Math.max(0.1, 4 * sw.alpha);
        this.ctx.beginPath();
        this.ctx.arc(sw.x, sw.y, rad, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = Math.max(0.1, 1.5 * sw.alpha);
        this.ctx.beginPath();
        this.ctx.arc(sw.x, sw.y, Math.max(0.1, rad * 0.98), 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.restore();
      }

      // =========================================================================
      // LAYER 2: Seasonal Ambient Particles (Blossoms, Fireflies, Leaves, Stardust)
      // =========================================================================
      if (this.particlesEnabled && this.ambientParticles.length > 0) {
        this.ctx.save();
        this.ambientParticles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vRot;
          p.alpha = 0.35 + Math.sin(now * p.speed + p.phase) * 0.3;

          // Wrap around edges
          if (p.y < -15) p.y = this.canvasHeight + 10;
          if (p.x < -15) p.x = this.canvasWidth + 10;
          if (p.x > this.canvasWidth + 15) p.x = -10;

          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(p.rot);
          this.ctx.globalAlpha = Math.min(1.0, p.alpha * b);
          this.ctx.fillStyle = p.color;

          if (season.particleType === 'petals' || season.particleType === 'leaves') {
            // Oval petal / leaf shape
            this.ctx.beginPath();
            const radX = Math.max(0.1, p.size * 1.5);
            const radY = Math.max(0.1, p.size * 0.7);
            this.ctx.ellipse(0, 0, radX, radY, 0, 0, Math.PI * 2);
            this.ctx.fill();
          } else {
            // Glowing firefly / stardust orb
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Firefly glow halo
            this.ctx.globalAlpha = p.alpha * 0.4 * b;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.size * 2.8, 0, Math.PI * 2);
            this.ctx.fill();
          }
          this.ctx.restore();
        });
        this.ctx.restore();
      }

      // =========================================================================
      // LAYER 2.5: Floating Silk Wish Lanterns (Spells)
      // =========================================================================
      for (let i = this.wishLanterns.length - 1; i >= 0; i--) {
        const lan = this.wishLanterns[i];
        lan.life += dt;
        lan.y -= lan.vy * dt;
        lan.swayPhase += lan.swaySpeed * dt;
        lan.x = lan.startX + Math.sin(lan.swayPhase) * lan.swayAmp;
        lan.flamePhase += dt * 8;

        if (lan.y < 30) {
          lan.alpha -= dt * 0.6;
        }

        if (lan.alpha <= 0 || lan.y < -50 || lan.life >= lan.maxLife) {
          this.wishLanterns.splice(i, 1);
          continue;
        }

        const scale = Math.max(0.4, 1.0 - (1.0 - lan.y / this.canvasHeight) * 0.35);
        const w = lan.width * scale;
        const h = lan.height * scale;

        this.ctx.save();
        this.ctx.translate(lan.x, lan.y);
        this.ctx.globalAlpha = Math.max(0, lan.alpha * b);

        // 1. Warm Golden Aura
        this.ctx.globalCompositeOperation = 'screen';
        const auraGrad = this.ctx.createRadialGradient(0, h * 0.3, 2, 0, h * 0.3, Math.max(0.1, w * 2.5));
        auraGrad.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
        auraGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.5)');
        auraGrad.addColorStop(1, 'transparent');
        this.ctx.fillStyle = auraGrad;
        this.ctx.beginPath();
        this.ctx.arc(0, h * 0.3, Math.max(0.1, w * 2.5), 0, Math.PI * 2);
        this.ctx.fill();

        // 2. Silk Paper Body
        this.ctx.globalCompositeOperation = 'source-over';
        const bodyGrad = this.ctx.createLinearGradient(0, -h * 0.5, 0, h * 0.5);
        bodyGrad.addColorStop(0, 'rgba(254, 215, 170, 0.95)');
        bodyGrad.addColorStop(0.5, 'rgba(251, 146, 60, 0.92)');
        bodyGrad.addColorStop(1, 'rgba(217, 119, 6, 0.95)');

        this.ctx.fillStyle = bodyGrad;
        this.ctx.strokeStyle = 'rgba(255, 237, 213, 0.8)';
        this.ctx.lineWidth = 1;

        this.ctx.beginPath();
        this.ctx.moveTo(-w * 0.45, -h * 0.35);
        this.ctx.bezierCurveTo(-w * 0.45, -h * 0.6, w * 0.45, -h * 0.6, w * 0.45, -h * 0.35);
        this.ctx.lineTo(w * 0.4, h * 0.35);
        this.ctx.bezierCurveTo(w * 0.3, h * 0.42, -w * 0.3, h * 0.42, -w * 0.4, h * 0.35);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        // 3. Central Candle Flame Core
        const flameFlicker = Math.sin(lan.flamePhase) * 1.5;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, h * 0.22, Math.max(0.1, (3 + flameFlicker) * scale), 0, Math.PI * 2);
        this.ctx.fill();

        // 4. Subtle Silk Ribs
        this.ctx.strokeStyle = 'rgba(180, 83, 9, 0.4)';
        this.ctx.lineWidth = 0.8;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -h * 0.5);
        this.ctx.lineTo(0, h * 0.38);
        this.ctx.moveTo(-w * 0.25, -h * 0.42);
        this.ctx.lineTo(-w * 0.2, h * 0.36);
        this.ctx.moveTo(w * 0.25, -h * 0.42);
        this.ctx.lineTo(w * 0.2, h * 0.36);
        this.ctx.stroke();

        // 5. Hanging Golden Tassel
        const tasselSway = Math.sin(lan.swayPhase * 1.4) * 3;
        this.ctx.strokeStyle = '#fef08a';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, h * 0.38);
        this.ctx.lineTo(tasselSway, h * 0.38 + 10 * scale);
        this.ctx.stroke();

        this.ctx.restore();
      }

      // =========================================================================
      // LAYER 3 & 4: Living Memory Objects (Blooming Flowers & Floating Orbs)
      // =========================================================================
      const filteredMemories = this.getFilteredMemories();

      filteredMemories.forEach(mem => {
        const anchor = this.getMemoryAnchor(mem);
        const mapped = this.getImageCoords(anchor.px, anchor.py);
        const mood = MOODS[mem.mood] || MOODS.joy;
        const isHovered = this.hoveredMemory && this.hoveredMemory.id === mem.id;

        // Growth animation scale (smooth spawn on creation)
        if (!mem._scale) mem._scale = 1.0;
        if (mem._scale < 1.0) {
          mem._scale = Math.min(1.0, mem._scale + dt * 2.5);
        }

        if (mem.type === 'orb') {
          // RENDER FLOATING CRYSTAL ORB
          this.renderFloatingOrb(mem, mapped, mood, isHovered, now, b, dt);
        } else {
          // RENDER BLOOMING LIVING FLOWER
          this.renderBloomingFlower(mem, mapped, mood, isHovered, now, b, dt);
        }
      });

      // =========================================================================
      // LAYER 4.5: Bioluminescent Fairies & Stardust Meteors (Spells)
      // =========================================================================
      // 1. Garden Fairies
      for (let i = this.gardenFairies.length - 1; i >= 0; i--) {
        const f = this.gardenFairies[i];
        f.life += dt;
        if (f.life >= f.maxLife) {
          f.alpha -= dt * 1.5;
          if (f.alpha <= 0) {
            this.gardenFairies.splice(i, 1);
            continue;
          }
        }

        const dx = f.targetX - f.x;
        const dy = f.targetY - f.y;
        f.vx += (dx * 0.008 + (Math.random() - 0.5) * 0.4 - f.vx) * 0.05;
        f.vy += (dy * 0.008 + (Math.random() - 0.5) * 0.4 - f.vy) * 0.05;
        f.x += f.vx;
        f.y += f.vy;

        if (Math.hypot(dx, dy) < 40 || Math.random() < 0.015) {
          f.targetX = Math.random() * this.canvasWidth;
          f.targetY = Math.random() * (this.canvasHeight * 0.8) + 30;
        }

        f.wingPhase += f.wingSpeed * dt;
        const wingSpan = Math.max(0.1, Math.abs(Math.sin(f.wingPhase))) * f.size * 1.8;

        if (Math.random() < 0.35) {
          f.trail.push({
            x: f.x,
            y: f.y,
            alpha: 0.85,
            size: Math.random() * 2 + 1,
            color: f.color
          });
        }

        for (let t = f.trail.length - 1; t >= 0; t--) {
          const tr = f.trail[t];
          tr.alpha -= dt * 1.8;
          tr.y += 0.3;
          if (tr.alpha <= 0) {
            f.trail.splice(t, 1);
            continue;
          }
          this.ctx.save();
          this.ctx.globalAlpha = tr.alpha * f.alpha * b;
          this.ctx.fillStyle = tr.color;
          this.ctx.beginPath();
          this.ctx.arc(tr.x, tr.y, Math.max(0.1, tr.size), 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.restore();
        }

        this.ctx.save();
        this.ctx.translate(f.x, f.y);
        this.ctx.globalAlpha = f.alpha * b;

        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.fillStyle = f.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, Math.max(0.1, f.size * 2.2), 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.ellipse(-f.size * 0.8, -f.size * 0.3, Math.max(0.1, wingSpan), Math.max(0.1, f.size * 0.8), -0.4, 0, Math.PI * 2);
        this.ctx.ellipse(f.size * 0.8, -f.size * 0.3, Math.max(0.1, wingSpan), Math.max(0.1, f.size * 0.8), 0.4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, Math.max(0.1, f.size * 0.7), 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
      }

      // 2. Stardust Shower Meteors
      for (let i = this.stardustShower.length - 1; i >= 0; i--) {
        const s = this.stardustShower[i];
        s.life += dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        if (s.y > this.canvasHeight + 40 || s.x > this.canvasWidth + 50 || s.life >= s.maxLife) {
          if (s.y <= this.canvasHeight + 10 && Math.random() < 0.4) {
            this.burstSparks.push({
              x: s.x,
              y: Math.min(s.y, this.canvasHeight - 10),
              vx: (Math.random() - 0.5) * 1.5,
              vy: -Math.random() * 1.8,
              size: Math.random() * 2.5 + 1.0,
              alpha: 0.9,
              color: s.color
            });
          }
          this.stardustShower.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.globalAlpha = s.alpha * b;
        this.ctx.strokeStyle = s.color;
        this.ctx.lineWidth = Math.max(0.1, s.size);
        this.ctx.lineCap = 'round';

        const trailX = s.x - (s.vx * 0.05);
        const trailY = s.y - (s.vy * 0.05);

        this.ctx.beginPath();
        this.ctx.moveTo(trailX, trailY);
        this.ctx.lineTo(s.x, s.y);
        this.ctx.stroke();

        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, Math.max(0.1, s.size * 1.2), 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
      }

      // =========================================================================
      // LAYER 5: Interaction Burst Sparks & Hearts
      // =========================================================================
      for (let i = this.burstSparks.length - 1; i >= 0; i--) {
        const sp = this.burstSparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= dt * 1.4;
        sp.size = Math.max(0.1, sp.size - dt * 2.0);

        if (sp.alpha <= 0) {
          this.burstSparks.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = sp.alpha;
        this.ctx.fillStyle = sp.color;
        this.ctx.beginPath();
        this.ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    /**
     * Renders a blooming living flower with layered petals, stamen, and wind sway
     */
    renderBloomingFlower(mem, pos, mood, isHovered, now, brightness, dt = 0.016) {
      if (mem._boostPulse > 0) {
        mem._boostPulse = Math.max(0, mem._boostPulse - (dt || 0.016) * 0.5);
      }
      const boost = mem._boostPulse || 0;

      const s = pos.scale * (mem._scale || 1.0);
      const sway = Math.sin(now * 0.002 + (mem.created % 50)) * 2.5 * s;
      const flowerX = pos.x + sway;
      const flowerY = pos.y;
      const flowerSize = (isHovered ? 13 : 10) * s;

      this.ctx.save();

      // 1. Soft Emerald Stem
      this.ctx.strokeStyle = '#059669';
      this.ctx.lineWidth = 2.0 * s;
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y + 12 * s);
      this.ctx.quadraticCurveTo(pos.x - 4 * s, pos.y + 6 * s, flowerX, flowerY);
      this.ctx.stroke();

      // 2. Bioluminescent Halo Glow
      this.ctx.globalCompositeOperation = 'screen';
      const haloRadius = flowerSize * (2.4 + boost * 0.8);
      const haloGrad = this.ctx.createRadialGradient(
        flowerX, flowerY, 2 * s,
        flowerX, flowerY, haloRadius
      );
      haloGrad.addColorStop(0, '#ffffff');
      haloGrad.addColorStop(0.35, mood.glow);
      haloGrad.addColorStop(1, 'transparent');

      this.ctx.fillStyle = haloGrad;
      this.ctx.globalAlpha = Math.min(1.0, (isHovered ? 0.95 : 0.65 + boost * 0.35) * brightness);
      this.ctx.beginPath();
      this.ctx.arc(flowerX, flowerY, haloRadius, 0, Math.PI * 2);
      this.ctx.fill();

      // 3. Flower Petals (5 petals arranged radially)
      this.ctx.globalCompositeOperation = 'source-over';
      const petalCount = 5;
      const petalDist = flowerSize * 0.65;
      const petalRadius = flowerSize * 0.55;

      for (let i = 0; i < petalCount; i++) {
        const angle = (i * Math.PI * 2) / petalCount + (now * 0.0005);
        const px = flowerX + Math.cos(angle) * petalDist;
        const py = flowerY + Math.sin(angle) * petalDist;

        this.ctx.fillStyle = mood.petalColor;
        this.ctx.globalAlpha = 0.92;
        this.ctx.beginPath();
        this.ctx.arc(px, py, petalRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Delicate inner petal tint
        this.ctx.fillStyle = mood.coreColor;
        this.ctx.globalAlpha = 0.7;
        this.ctx.beginPath();
        this.ctx.arc(px, py, petalRadius * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // 4. Center Glowing Stardust Stamen Core
      this.ctx.fillStyle = '#ffffff';
      this.ctx.globalAlpha = 1.0;
      this.ctx.beginPath();
      this.ctx.arc(flowerX, flowerY, flowerSize * 0.38, 0, Math.PI * 2);
      this.ctx.fill();

      // 5. Hover ring indicator
      if (isHovered) {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1.5;
        this.ctx.globalAlpha = 0.85;
        this.ctx.beginPath();
        this.ctx.arc(flowerX, flowerY, flowerSize * 2.2, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      this.ctx.restore();
    }

    /**
     * Renders a floating crystal memory orb with levitation, outer aura, and rotating orbital ring
     */
    renderFloatingOrb(mem, pos, mood, isHovered, now, brightness, dt = 0.016) {
      if (mem._boostPulse > 0) {
        mem._boostPulse = Math.max(0, mem._boostPulse - (dt || 0.016) * 0.5);
      }
      const boost = mem._boostPulse || 0;

      const s = pos.scale * (mem._scale || 1.0);
      const floatOffset = Math.sin(now * 0.003 + (mem.created % 100)) * 7 * s;
      const orbX = pos.x;
      const orbY = pos.y + floatOffset;
      const orbRadius = (isHovered ? 12 : 9) * s;

      this.ctx.save();

      // 1. Radiant Multi-layer Outer Aura
      this.ctx.globalCompositeOperation = 'screen';
      const auraRadius = orbRadius * (2.8 + boost * 0.8);
      const auraGrad = this.ctx.createRadialGradient(
        orbX, orbY, 2 * s,
        orbX, orbY, auraRadius
      );
      auraGrad.addColorStop(0, '#ffffff');
      auraGrad.addColorStop(0.3, mood.glow);
      auraGrad.addColorStop(0.7, mood.color);
      auraGrad.addColorStop(1, 'transparent');

      this.ctx.fillStyle = auraGrad;
      this.ctx.globalAlpha = Math.min(1.0, (isHovered ? 0.95 : 0.65 + boost * 0.35) * brightness);
      this.ctx.beginPath();
      this.ctx.arc(orbX, orbY, auraRadius, 0, Math.PI * 2);
      this.ctx.fill();

      // 2. Crystal Orb Sphere
      this.ctx.globalCompositeOperation = 'source-over';
      const sphereGrad = this.ctx.createRadialGradient(
        orbX - orbRadius * 0.35, orbY - orbRadius * 0.35, 1,
        orbX, orbY, orbRadius
      );
      sphereGrad.addColorStop(0, '#ffffff');
      sphereGrad.addColorStop(0.4, mood.color);
      sphereGrad.addColorStop(1, '#090d29');

      this.ctx.fillStyle = sphereGrad;
      this.ctx.globalAlpha = 0.95;
      this.ctx.beginPath();
      this.ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
      this.ctx.fill();

      // 3. Rotating Orbital Constellation Ring
      const ringAngle = now * 0.0015 + (mem.created % 10);
      const ringRadiusX = Math.max(0.1, orbRadius * 1.8);
      const ringRadiusY = Math.max(0.1, orbRadius * 0.6);

      this.ctx.strokeStyle = mood.color;
      this.ctx.lineWidth = 1.2 * s;
      this.ctx.globalAlpha = 0.75;
      this.ctx.beginPath();
      this.ctx.ellipse(orbX, orbY, ringRadiusX, ringRadiusY, ringAngle, 0, Math.PI * 2);
      this.ctx.stroke();

      // 4. White Specular Highlight Glint
      this.ctx.fillStyle = '#ffffff';
      this.ctx.globalAlpha = 0.9;
      this.ctx.beginPath();
      this.ctx.arc(orbX - orbRadius * 0.35, orbY - orbRadius * 0.35, orbRadius * 0.28, 0, Math.PI * 2);
      this.ctx.fill();

      // 5. Hover Indicator
      if (isHovered) {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1.5;
        this.ctx.globalAlpha = 0.85;
        this.ctx.beginPath();
        this.ctx.arc(orbX, orbY, orbRadius * 2.2, 0, Math.PI * 2);
        this.ctx.stroke();
      }

      this.ctx.restore();
    }

    /**
     * Attaches HUD listeners, form handling, and modal controls
     */
    attachListeners() {
      // 1. Season buttons
      this.container.querySelectorAll('.mg-season-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.setSeason(btn.dataset.season);
        });
      });

      // 1.5. Magical Garden Spell Buttons (Fairies, Stardust Shower, Wish Lantern, Tree Resonance)
      const btnFairies = this.container.querySelector('#mg-btn-event-fairies');
      const btnShower = this.container.querySelector('#mg-btn-event-shower');
      const btnLantern = this.container.querySelector('#mg-btn-event-lantern');
      const btnResonate = this.container.querySelector('#mg-btn-event-resonate');

      const addBtnBounce = (b) => {
        if (!b) return;
        b.style.transform = 'scale(0.92)';
        setTimeout(() => { if (b) b.style.transform = ''; }, 160);
      };

      if (btnFairies) {
        btnFairies.addEventListener('click', (e) => {
          e.stopPropagation();
          addBtnBounce(btnFairies);
          this.triggerFairySwarm();
        });
      }
      if (btnShower) {
        btnShower.addEventListener('click', (e) => {
          e.stopPropagation();
          addBtnBounce(btnShower);
          this.triggerStardustShower();
        });
      }
      if (btnLantern) {
        btnLantern.addEventListener('click', (e) => {
          e.stopPropagation();
          addBtnBounce(btnLantern);
          this.triggerWishLantern();
        });
      }
      if (btnResonate) {
        btnResonate.addEventListener('click', (e) => {
          e.stopPropagation();
          addBtnBounce(btnResonate);
          this.triggerTreeResonance();
        });
      }

      // 2. Mood filter buttons
      this.container.querySelectorAll('.mg-filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.activeMoodFilter = btn.dataset.filter;
          this.container.querySelectorAll('.mg-filter-btn').forEach(b => {
            b.classList.toggle('active', b === btn);
            if (b.dataset.filter === 'all') {
              b.style.background = b === btn ? 'rgba(255,255,255,0.2)' : 'transparent';
            } else {
              const m = MOODS[b.dataset.filter];
              b.style.background = b === btn ? m.color : 'transparent';
              b.style.color = b === btn ? '#000' : '#cbd5e1';
            }
          });
          this.renderTimelineTrack();
        });
      });

      // 3. Particles toggle
      const btnParticles = this.container.querySelector('#mg-btn-particles');
      if (btnParticles) {
        btnParticles.addEventListener('click', () => {
          this.particlesEnabled = !this.particlesEnabled;
          btnParticles.style.background = this.particlesEnabled ? 'rgba(56,189,248,0.25)' : 'rgba(9,12,36,0.85)';
          btnParticles.style.borderColor = this.particlesEnabled ? '#38bdf8' : 'rgba(255,255,255,0.18)';
        });
      }

      // 4. Brightness slider
      const slider = this.container.querySelector('#mg-slider-brightness');
      if (slider) {
        slider.addEventListener('input', (e) => {
          this.brightness = parseInt(e.target.value, 10) / 100;
          this.updateLightingVisuals();
        });
      }

      // 5. Mute toggle
      const btnMute = this.container.querySelector('#mg-btn-mute');
      const muteIcon = this.container.querySelector('#mg-mute-icon');
      if (btnMute) {
        btnMute.addEventListener('click', () => {
          this.isMuted = !this.isMuted;
          if (muteIcon) muteIcon.textContent = this.isMuted ? '🔇' : '🔊';
        });
      }

      // 6. Timeline drawer toggle
      const btnTimeline = this.container.querySelector('#mg-btn-toggle-timeline');
      const drawer = this.container.querySelector('#mg-timeline-drawer');
      const btnCloseTimeline = this.container.querySelector('#mg-btn-close-timeline');

      const toggleTimeline = (force) => {
        this.isTimelineOpen = force !== undefined ? force : !this.isTimelineOpen;
        if (drawer) drawer.style.display = this.isTimelineOpen ? 'flex' : 'none';
        if (btnTimeline) {
          btnTimeline.innerHTML = `<span>📜</span> <span>${this.isTimelineOpen ? 'Hide Timeline' : 'Explore Timeline'}</span>`;
        }
        if (this.isTimelineOpen) this.renderTimelineTrack();
      };

      if (btnTimeline) btnTimeline.addEventListener('click', () => toggleTimeline());
      if (btnCloseTimeline) btnCloseTimeline.addEventListener('click', () => toggleTimeline(false));

      // 7. Timeline search & sort
      const searchInput = this.container.querySelector('#mg-input-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.timelineSearchQuery = e.target.value.toLowerCase();
          this.renderTimelineTrack();
        });
      }

      const btnSort = this.container.querySelector('#mg-btn-sort-toggle');
      if (btnSort) {
        btnSort.addEventListener('click', () => {
          this.timelineSortOrder = this.timelineSortOrder === 'newest' ? 'oldest' : 'newest';
          btnSort.textContent = this.timelineSortOrder === 'newest' ? '📅 Newest' : '📅 Oldest';
          this.renderTimelineTrack();
        });
      }

      // 8. Create memory modal open / cancel
      const btnOpenCreate = this.container.querySelector('#mg-btn-open-create');
      const modalForm = this.container.querySelector('#mg-modal-form');
      const btnCancelForm = this.container.querySelector('#mg-btn-cancel-form');

      if (btnOpenCreate) {
        btnOpenCreate.addEventListener('click', () => this.openCreateForm());
      }
      if (btnCancelForm) {
        btnCancelForm.addEventListener('click', () => {
          if (modalForm) modalForm.style.display = 'none';
        });
      }

      // 9. Form mood pills selection
      this.container.querySelectorAll('.mg-form-mood-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const moodKey = btn.dataset.mood;
          const hiddenInput = this.container.querySelector('#mg-selected-mood');
          if (hiddenInput) hiddenInput.value = moodKey;

          this.container.querySelectorAll('.mg-form-mood-btn').forEach(b => {
            const isMatch = b === btn;
            const m = MOODS[b.dataset.mood];
            b.style.background = isMatch ? m.color : 'rgba(255,255,255,0.06)';
            b.style.color = isMatch ? '#000000' : '#ffffff';
            b.style.fontWeight = isMatch ? '700' : '400';
            b.style.borderColor = isMatch ? '#ffffff' : 'rgba(255,255,255,0.18)';
          });
        });
      });

      // 10. Form submission (Create or Edit)
      const form = this.container.querySelector('#mg-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.submitMemoryForm();
        });
      }

      // 11. Detail modal actions (Edit, Delete, Close)
      const modalDetail = this.container.querySelector('#mg-modal-detail');
      const btnCloseDetail = this.container.querySelector('#mg-btn-close-detail');
      const btnEdit = this.container.querySelector('#mg-btn-edit-mem');
      const btnDelete = this.container.querySelector('#mg-btn-delete-mem');

      if (btnCloseDetail) {
        btnCloseDetail.addEventListener('click', () => {
          if (modalDetail) modalDetail.style.display = 'none';
          this.selectedMemory = null;
        });
      }
      if (btnEdit) {
        btnEdit.addEventListener('click', () => {
          if (this.selectedMemory) {
            this.openEditForm(this.selectedMemory.id);
          }
        });
      }
      if (btnDelete) {
        btnDelete.addEventListener('click', () => {
          const confirmModal = this.container.querySelector('#mg-modal-confirm-delete');
          if (confirmModal) confirmModal.style.display = 'flex';
        });
      }

      // 12. Delete confirmation actions
      const btnConfirmDelete = this.container.querySelector('#mg-btn-confirm-delete');
      const btnCancelDelete = this.container.querySelector('#mg-btn-cancel-delete');
      const confirmModal = this.container.querySelector('#mg-modal-confirm-delete');

      if (btnCancelDelete && confirmModal) {
        btnCancelDelete.addEventListener('click', () => {
          confirmModal.style.display = 'none';
        });
      }
      if (btnConfirmDelete && confirmModal) {
        btnConfirmDelete.addEventListener('click', () => {
          if (this.selectedMemory) {
            this.deleteMemory(this.selectedMemory.id);
            confirmModal.style.display = 'none';
            if (modalDetail) modalDetail.style.display = 'none';
          }
        });
      }

      // 13. Data modal (Export / Import)
      const btnDataMenu = this.container.querySelector('#mg-btn-data-menu');
      const modalData = this.container.querySelector('#mg-modal-data');
      const btnCloseData = this.container.querySelector('#mg-btn-close-data');
      const btnExport = this.container.querySelector('#mg-btn-export-json');
      const fileImport = this.container.querySelector('#mg-file-import');

      if (btnDataMenu && modalData) {
        btnDataMenu.addEventListener('click', () => {
          modalData.style.display = 'flex';
          const msg = this.container.querySelector('#mg-data-msg');
          if (msg) msg.style.display = 'none';
        });
      }
      if (btnCloseData && modalData) {
        btnCloseData.addEventListener('click', () => {
          modalData.style.display = 'none';
        });
      }
      if (btnExport) {
        btnExport.addEventListener('click', () => this.exportJSON());
      }
      if (fileImport) {
        fileImport.addEventListener('change', (e) => this.importJSON(e));
      }

      // 14. Guide / Help modal
      const btnHelp = this.container.querySelector('#mg-btn-help');
      const modalGuide = this.container.querySelector('#mg-modal-guide');
      const btnCloseGuide = this.container.querySelector('#mg-btn-close-guide');

      if (btnHelp && modalGuide) {
        btnHelp.addEventListener('click', () => {
          modalGuide.style.display = 'flex';
        });
      }
      if (btnCloseGuide && modalGuide) {
        btnCloseGuide.addEventListener('click', () => {
          modalGuide.style.display = 'none';
        });
      }
    }

    /**
     * Renders timeline drawer cards
     */
    renderTimelineTrack() {
      const list = this.container.querySelector('#mg-timeline-list');
      const badge = this.container.querySelector('#mg-timeline-count-badge');
      if (!list) return;

      let items = [...this.getFilteredMemories()];

      // Search filter
      if (this.timelineSearchQuery) {
        items = items.filter(m =>
          m.title.toLowerCase().includes(this.timelineSearchQuery) ||
          m.description.toLowerCase().includes(this.timelineSearchQuery)
        );
      }

      // Date sorting
      items.sort((a, b) => {
        const da = new Date(a.date).getTime() || a.created || 0;
        const db = new Date(b.date).getTime() || b.created || 0;
        return this.timelineSortOrder === 'newest' ? db - da : da - db;
      });

      if (badge) {
        badge.textContent = `${items.length} ${items.length === 1 ? 'memory' : 'memories'}`;
      }

      if (items.length === 0) {
        list.innerHTML = `
          <div style="padding:16px;text-align:center;color:#94a3b8;font-size:0.75rem;width:100%;">
            No memories found matching your search. Plant a new memory above! 🌱
          </div>
        `;
        return;
      }

      list.innerHTML = items.map(m => {
        const mood = MOODS[m.mood] || MOODS.joy;
        return `
          <div class="mg-timeline-card" data-mem-id="${m.id}" style="flex:0 0 170px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.12);border-left:3px solid ${mood.color};border-radius:12px;padding:8px 10px;cursor:pointer;transition:all 0.2s;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <span style="font-size:0.68rem;color:${mood.color};font-weight:700;">${mood.icon} ${mood.label}</span>
              <span style="font-size:0.62rem;color:#94a3b8;">${m.date}</span>
            </div>
            <div style="font-size:0.75rem;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px;">
              ${this.escapeHtml(m.title)}
            </div>
            <div style="font-size:0.65rem;color:#cbd5e1;line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
              ${this.escapeHtml(m.description)}
            </div>
          </div>
        `;
      }).join('');

      // Add click handler to cards
      list.querySelectorAll('.mg-timeline-card').forEach(card => {
        card.addEventListener('click', () => {
          this.openMemoryDetail(card.dataset.memId);
        });
      });
    }

    /**
     * Opens memory creation form
     */
    openCreateForm() {
      this.editingMemoryId = null;
      const modal = this.container.querySelector('#mg-modal-form');
      const title = this.container.querySelector('#mg-form-title');
      const submitBtn = this.container.querySelector('#mg-btn-submit-form');
      const err = this.container.querySelector('#mg-form-error');

      if (title) title.innerHTML = '<span>🌱</span> <span>Plant a Living Memory</span>';
      if (submitBtn) submitBtn.textContent = 'Blossom into Garden ✨';
      if (err) err.style.display = 'none';

      // Reset fields
      const inputTitle = this.container.querySelector('#mg-input-title');
      const inputDate = this.container.querySelector('#mg-input-date');
      const inputDesc = this.container.querySelector('#mg-input-desc');
      const selectType = this.container.querySelector('#mg-select-type');

      if (inputTitle) inputTitle.value = '';
      if (inputDate) {
        const today = new Date().toISOString().split('T')[0];
        inputDate.value = today;
      }
      if (inputDesc) inputDesc.value = '';
      if (selectType) selectType.value = 'flower';

      // Default mood Joy
      this.selectMoodInForm('joy');

      if (modal) modal.style.display = 'flex';
      if (inputTitle) inputTitle.focus();
    }

    /**
     * Opens memory edit form prefilled with existing memory data
     */
    openEditForm(memoryId) {
      const mem = this.memories.find(m => m.id === memoryId);
      if (!mem) return;

      this.editingMemoryId = memoryId;
      const detailModal = this.container.querySelector('#mg-modal-detail');
      if (detailModal) detailModal.style.display = 'none';

      const modal = this.container.querySelector('#mg-modal-form');
      const title = this.container.querySelector('#mg-form-title');
      const submitBtn = this.container.querySelector('#mg-btn-submit-form');
      const err = this.container.querySelector('#mg-form-error');

      if (title) title.innerHTML = '<span>✏️</span> <span>Edit Cherished Memory</span>';
      if (submitBtn) submitBtn.textContent = 'Save Changes ✨';
      if (err) err.style.display = 'none';

      const inputTitle = this.container.querySelector('#mg-input-title');
      const inputDate = this.container.querySelector('#mg-input-date');
      const inputDesc = this.container.querySelector('#mg-input-desc');
      const selectType = this.container.querySelector('#mg-select-type');

      if (inputTitle) inputTitle.value = mem.title;
      if (inputDate) inputDate.value = mem.date;
      if (inputDesc) inputDesc.value = mem.description;
      if (selectType) selectType.value = mem.type || 'flower';

      this.selectMoodInForm(mem.mood || 'joy');

      if (modal) modal.style.display = 'flex';
      if (inputTitle) inputTitle.focus();
    }

    /**
     * Highlights selected mood pill inside form
     */
    selectMoodInForm(moodKey) {
      const hiddenInput = this.container.querySelector('#mg-selected-mood');
      if (hiddenInput) hiddenInput.value = moodKey;

      this.container.querySelectorAll('.mg-form-mood-btn').forEach(b => {
        const isMatch = b.dataset.mood === moodKey;
        const m = MOODS[b.dataset.mood];
        b.style.background = isMatch ? m.color : 'rgba(255,255,255,0.06)';
        b.style.color = isMatch ? '#000000' : '#ffffff';
        b.style.fontWeight = isMatch ? '700' : '400';
        b.style.borderColor = isMatch ? '#ffffff' : 'rgba(255,255,255,0.18)';
      });
    }

    /**
     * Submits form to create or update memory
     */
    submitMemoryForm() {
      const inputTitle = this.container.querySelector('#mg-input-title');
      const inputDate = this.container.querySelector('#mg-input-date');
      const inputDesc = this.container.querySelector('#mg-input-desc');
      const selectType = this.container.querySelector('#mg-select-type');
      const hiddenMood = this.container.querySelector('#mg-selected-mood');
      const err = this.container.querySelector('#mg-form-error');

      const title = inputTitle ? inputTitle.value.trim() : '';
      const date = inputDate ? inputDate.value.trim() : '';
      const desc = inputDesc ? inputDesc.value.trim() : '';
      const type = selectType ? selectType.value : 'flower';
      const mood = hiddenMood ? hiddenMood.value : 'joy';

      if (!title || !date || !desc) {
        if (err) {
          err.textContent = 'Please fill out all required fields (Title, Date, and Story).';
          err.style.display = 'block';
        }
        return;
      }

      if (this.editingMemoryId) {
        // UPDATE EXISTING MEMORY
        const index = this.memories.findIndex(m => m.id === this.editingMemoryId);
        if (index !== -1) {
          this.memories[index].title = title;
          this.memories[index].date = date;
          this.memories[index].description = desc;
          this.memories[index].type = type;
          this.memories[index].mood = mood;
          this.playHarmonicTone(MOODS[mood].audioNote);
        }
      } else {
        // CREATE NEW LIVING MEMORY
        const anchorIdx = this.findAvailableAnchor(type);
        const newMemory = {
          id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          title: title,
          date: date,
          description: desc,
          type: type,
          mood: mood,
          anchorIndex: anchorIdx,
          created: Date.now(),
          _scale: 0.05 // Starts small, blooms smoothly
        };

        this.memories.push(newMemory);

        // Spawn sparkling stardust burst at anchor location
        const anchor = SANCTUARY_ANCHORS[anchorIdx];
        const screenPos = this.getImageCoords(anchor.px, anchor.py);
        this.spawnBurst(screenPos.x, screenPos.y, MOODS[mood].color);

        // Play planting harmonic sound progression
        this.playPlantingChord(mood);
      }

      // Save & Update UI
      this.saveData();
      this.updateLightingVisuals();
      this.renderTimelineTrack();

      // Reset editing state
      this.editingMemoryId = null;

      // Close modal
      const modal = this.container.querySelector('#mg-modal-form');
      if (modal) modal.style.display = 'none';
    }

    /**
     * Opens detailed story modal for a memory
     */
    openMemoryDetail(memoryId) {
      const mem = this.memories.find(m => m.id === memoryId);
      if (!mem) return;

      this.selectedMemory = mem;
      const mood = MOODS[mem.mood] || MOODS.joy;

      const modal = this.container.querySelector('#mg-modal-detail');
      const badge = this.container.querySelector('#mg-detail-mood-badge');
      const dateEl = this.container.querySelector('#mg-detail-date');
      const titleEl = this.container.querySelector('#mg-detail-title');
      const descEl = this.container.querySelector('#mg-detail-desc');

      if (badge) {
        badge.style.background = mood.glow;
        badge.style.color = '#ffffff';
        badge.innerHTML = `<span>${mood.icon}</span> <span>${mood.label} · ${mem.type === 'orb' ? 'Crystal Orb' : 'Cosmic Flower'}</span>`;
      }
      if (dateEl) dateEl.textContent = `Planted: ${mem.date}`;
      if (titleEl) titleEl.textContent = mem.title;
      if (descEl) descEl.textContent = mem.description;

      if (modal) modal.style.display = 'flex';

      // Soft crystal chime
      this.playHarmonicTone(mood.audioNote);
    }

    /**
     * Deletes a memory and bursts remaining stardust into the sky
     */
    deleteMemory(memoryId) {
      const index = this.memories.findIndex(m => m.id === memoryId);
      if (index === -1) return;

      const mem = this.memories[index];
      const anchor = this.getMemoryAnchor(mem);
      const screenPos = this.getImageCoords(anchor.px, anchor.py);

      // Dissolving stardust burst
      this.spawnBurst(screenPos.x, screenPos.y, '#cbd5e1', 32);

      this.memories.splice(index, 1);
      this.saveData();
      this.updateLightingVisuals();
      this.renderTimelineTrack();

      // Soft release whisper sound
      this.playHarmonicTone('G4');
    }

    /**
     * Spawns radiant sparkle particles for new plantings & interactions
     */
    spawnBurst(x, y, color = '#fde047', count = 22) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4.5 + 1.5;
        this.burstSparks.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.2,
          size: Math.random() * 4.0 + 1.8,
          alpha: 1.0,
          color: color
        });
      }
    }

    /**
     * Exports garden memories and preferences as validated JSON file
     */
    exportJSON() {
      const data = {
        app: 'Lumi_Memory_Garden',
        version: 1,
        exportedAt: new Date().toISOString(),
        season: this.currentSeasonKey,
        memories: this.memories
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lumi_memory_garden_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const msg = this.container.querySelector('#mg-data-msg');
      if (msg) {
        msg.textContent = '✨ Memory Garden exported successfully!';
        msg.style.background = 'rgba(52,211,153,0.2)';
        msg.style.color = '#6ee7b7';
        msg.style.display = 'block';
      }
    }

    /**
     * Imports and validates external JSON backup file safely
     */
    importJSON(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      const msg = this.container.querySelector('#mg-data-msg');

      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);

          if (!parsed || !Array.isArray(parsed.memories)) {
            throw new Error('Invalid JSON format: missing memories array.');
          }

          // Validate each memory object
          const validMemories = [];
          for (const item of parsed.memories) {
            if (item && item.title && item.date && item.description) {
              validMemories.push({
                id: item.id || `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                title: String(item.title).substring(0, 80),
                date: String(item.date),
                description: String(item.description).substring(0, 320),
                mood: MOODS[item.mood] ? item.mood : 'joy',
                type: item.type === 'orb' ? 'orb' : 'flower',
                anchorIndex: typeof item.anchorIndex === 'number' ? item.anchorIndex : validMemories.length % SANCTUARY_ANCHORS.length,
                created: item.created || Date.now()
              });
            }
          }

          if (validMemories.length === 0) {
            throw new Error('No valid memories found in the uploaded file.');
          }

          // Merge without duplicate IDs
          const existingIds = new Set(this.memories.map(m => m.id));
          let importedCount = 0;

          for (const vm of validMemories) {
            if (!existingIds.has(vm.id)) {
              this.memories.push(vm);
              existingIds.add(vm.id);
              importedCount++;
            }
          }

          if (parsed.season && SEASONS[parsed.season]) {
            this.setSeason(parsed.season);
          }

          this.saveData();
          this.updateLightingVisuals();
          this.renderTimelineTrack();

          if (msg) {
            msg.textContent = `✨ Successfully imported ${importedCount} memories into your garden!`;
            msg.style.background = 'rgba(52,211,153,0.2)';
            msg.style.color = '#6ee7b7';
            msg.style.display = 'block';
          }
        } catch (err) {
          if (msg) {
            msg.textContent = `Error: ${err.message}`;
            msg.style.background = 'rgba(239,68,68,0.2)';
            msg.style.color = '#f87171';
            msg.style.display = 'block';
          }
        }
      };

      reader.readAsText(file);
    }

    /**
     * Loads persisted garden memories & preferences from LocalStorage
     */
    loadData() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed.memories)) {
            this.memories = parsed.memories;
          }
          if (parsed.season && SEASONS[parsed.season]) {
            this.currentSeasonKey = parsed.season;
          }
          if (parsed.brightness !== undefined) {
            this.brightness = Math.max(0.3, Math.min(1.0, parsed.brightness));
          }
          if (parsed.particlesEnabled !== undefined) {
            this.particlesEnabled = !!parsed.particlesEnabled;
          }
        }
      } catch (e) {
        console.warn('Memory Garden storage load error:', e);
      }

      // Safe First-time Initialization: If storage has NEVER been populated, provide starter memories
      if (!this.memories || this.memories.length === 0) {
        this.memories = JSON.parse(JSON.stringify(STARTER_MEMORIES));
        this.saveData();
      }
    }

    /**
     * Persists garden memories & preferences to LocalStorage
     */
    saveData() {
      try {
        const payload = {
          version: 1,
          season: this.currentSeasonKey,
          brightness: this.brightness,
          particlesEnabled: this.particlesEnabled,
          memories: this.memories
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        console.warn('Memory Garden storage save error:', e);
      }
    }

    /**
     * Synthesizes crystalline harmonic chime using Web Audio API
     */
    playHarmonicTone(noteName = 'C5') {
      if (this.isMuted) return;

      // Leverage window.dreamAudio if available
      if (window.dreamAudio && typeof window.dreamAudio.playChime === 'function') {
        window.dreamAudio.playChime(noteName);
        return;
      }

      // Standalone Web Audio API synthesis fallback
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!this.audioCtx) this.audioCtx = new AudioContext();
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const freqs = {
          C4: 261.63, E4: 329.63, G4: 392.00,
          C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
          C6: 1046.50, D6: 1174.66, E6: 1318.51, F6: 1396.91, G6: 1567.98, A6: 1760.00, B6: 1975.53,
          C7: 2093.00, D7: 2349.32, E7: 2637.02
        };
        const freq = freqs[noteName] || 523.25;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(0.18, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 1.2);
      } catch (e) {}
    }

    /**
     * Plays ascending harmonic planting chord progression
     */
    playPlantingChord(moodKey) {
      if (this.isMuted) return;
      const notes = ['C5', 'E5', 'G5', MOODS[moodKey].audioNote || 'C6'];
      notes.forEach((n, i) => {
        setTimeout(() => {
          if (this.isMounted) this.playHarmonicTone(n);
        }, i * 110);
      });
    }

    /**
     * Trigger Spell 1: Bioluminescent Fairy Swarm
     */
    triggerFairySwarm() {
      const colors = ['#f472b6', '#38bdf8', '#c084fc', '#34d399', '#fde047', '#fb7185'];
      const treePos = this.getImageCoords(688, 400);

      for (let i = 0; i < 28; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 140;
        const startX = treePos.x + Math.cos(angle) * dist;
        const startY = treePos.y + Math.sin(angle) * dist;

        this.gardenFairies.push({
          x: startX,
          y: startY,
          targetX: Math.random() * this.canvasWidth,
          targetY: Math.random() * (this.canvasHeight * 0.8) + 40,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 3.5 + 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          wingPhase: Math.random() * Math.PI * 2,
          wingSpeed: 18 + Math.random() * 10,
          alpha: 1.0,
          life: 0,
          maxLife: 6.5 + Math.random() * 3.5,
          trail: []
        });
      }

      this.playTwinkleArpeggio();
    }

    /**
     * Trigger Spell 2: Stardust Meteor Shower
     */
    triggerStardustShower() {
      this.treeFlash = 1.0;
      const colors = ['#fef08a', '#e0e7ff', '#fbcfe8', '#38bdf8', '#ffffff'];

      for (let i = 0; i < 70; i++) {
        this.stardustShower.push({
          x: Math.random() * (this.canvasWidth + 200) - 100,
          y: -20 - Math.random() * 160,
          vx: (Math.random() * 0.8 + 0.6) * 190,
          vy: (Math.random() * 0.8 + 1.2) * 230,
          length: Math.random() * 26 + 14,
          size: Math.random() * 2.2 + 1.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.5,
          life: 0,
          maxLife: 2.2 + Math.random() * 1.0
        });
      }

      // Energize all memories in garden
      this.memories.forEach(m => {
        m._boostPulse = 1.2;
      });

      this.playStardustCascade();
    }

    /**
     * Trigger Spell 3: Warm Glowing Silk Wish Lantern
     */
    triggerWishLantern() {
      const startX = (this.canvasWidth * 0.25) + Math.random() * (this.canvasWidth * 0.5);
      const startY = this.canvasHeight + 25;

      this.wishLanterns.push({
        x: startX,
        y: startY,
        startX: startX,
        width: 22,
        height: 32,
        vy: 24 + Math.random() * 12,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 1.2 + Math.random() * 0.6,
        swayAmp: 12 + Math.random() * 8,
        flamePhase: Math.random() * Math.PI * 2,
        alpha: 1.0,
        life: 0,
        maxLife: 15.0
      });

      this.playBowlChime();
    }

    /**
     * Trigger Spell 4: Cosmic Tree Resonance
     */
    triggerTreeResonance() {
      const treePos = this.getImageCoords(688, 380);
      this.treeFlash = 1.0;

      // Concentric expanding shockwaves
      this.shockwaves.push({
        x: treePos.x,
        y: treePos.y,
        radius: 10,
        maxRadius: Math.max(this.canvasWidth, this.canvasHeight) * 0.85,
        speed: 380,
        alpha: 1.0,
        color: '#f472b6'
      });

      setTimeout(() => {
        if (!this.isMounted) return;
        this.shockwaves.push({
          x: treePos.x,
          y: treePos.y,
          radius: 10,
          maxRadius: Math.max(this.canvasWidth, this.canvasHeight) * 0.85,
          speed: 340,
          alpha: 1.0,
          color: '#38bdf8'
        });
      }, 140);

      // Flash & resonate all memories
      this.memories.forEach((m, idx) => {
        m._boostPulse = 1.6;
        setTimeout(() => {
          if (this.isMounted && !this.isMuted) {
            const mood = MOODS[m.mood] || MOODS.joy;
            this.playHarmonicTone(mood.audioNote);
          }
        }, idx * 150);
      });

      this.playResonanceChord();
    }

    /**
     * Synthesizes sparkling stardust cascade chime
     */
    playStardustCascade() {
      if (this.isMuted) return;
      const notes = ['A6', 'E6', 'C6', 'A5', 'F5'];
      notes.forEach((n, i) => {
        setTimeout(() => {
          if (this.isMounted) this.playHarmonicTone(n);
        }, i * 65);
      });
    }

    /**
     * Synthesizes fluttering fairy arpeggio
     */
    playTwinkleArpeggio() {
      if (this.isMuted) return;
      const notes = ['E6', 'G6', 'B6', 'E7', 'D7', 'B6'];
      notes.forEach((n, i) => {
        setTimeout(() => {
          if (this.isMounted) this.playHarmonicTone(n);
        }, i * 75);
      });
    }

    /**
     * Synthesizes deep resonant Tibetan singing bowl chime for wish lantern
     */
    playBowlChime() {
      if (this.isMuted) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!this.audioCtx) this.audioCtx = new AudioContext();
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const freqs = [261.63, 523.25, 784.88];
        freqs.forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = idx === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

          const initialGain = 0.14 / (idx + 1);
          gain.gain.setValueAtTime(initialGain, this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 3.2);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start();
          osc.stop(this.audioCtx.currentTime + 3.2);
        });
      } catch (e) {}
    }

    /**
     * Synthesizes resonant symphonic cosmic chord for Tree Resonance
     */
    playResonanceChord() {
      if (this.isMuted) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        if (!this.audioCtx) this.audioCtx = new AudioContext();
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const chord = [130.81, 196.00, 261.63, 329.63, 493.88, 587.33];
        chord.forEach((freq, idx) => {
          setTimeout(() => {
            if (!this.audioCtx || this.audioCtx.state === 'closed') return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

            gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 2.5);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 2.5);
          }, idx * 60);
        });
      } catch (e) {}
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    /**
     * Releases all animation frames, intervals, audio nodes, and event listeners
     */
    destroy() {
      this.isMounted = false;
      this.hoveredMemory = null;
      this.selectedMemory = null;
      this.editingMemoryId = null;

      this.gardenFairies = [];
      this.stardustShower = [];
      this.wishLanterns = [];
      this.shockwaves = [];
      this.treeFlash = 0;

      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      window.removeEventListener('resize', this.boundResize);

      if (this.canvas) {
        this.canvas.removeEventListener('pointermove', this.boundPointerMove);
        this.canvas.removeEventListener('pointerleave', this.boundPointerLeave);
        this.canvas.removeEventListener('click', this.boundCanvasClick);
      }

      if (this.audioCtx && typeof this.audioCtx.close === 'function') {
        try { this.audioCtx.close(); } catch (e) {}
        this.audioCtx = null;
      }

      if (this.container) {
        this.container.innerHTML = '';
      }
    }
  }

  // Expose singleton instance to global scope
  window.MemoryGarden = new MemoryGardenEngine();

})();
