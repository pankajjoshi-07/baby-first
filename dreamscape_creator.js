/**
 * LUMI'S DREAMSCAPE CREATOR (3D)
 * Interactive stylized 3D fantasy world-building experience built with Three.js.
 * 
 * Features:
 * - Real-time procedural floating island environment with cliffs, drifting clouds & crystal shards
 * - Orbit camera controls (drag to rotate, wheel/pinch to zoom, reset view)
 * - 6+ Rich procedural fantasy models (Tree, Crystal, Cottage, Portal, Rock, Flowers, Lantern)
 * - Ground raycasting placement with ghost preview, snap & boundary checks
 * - Object selection, repositioning, rotation, and deletion
 * - 4 Celestial Environment Presets (Dreamy Day, Golden Sunset, Moonlit Night, Aurora Dream)
 * - 3 Island Surface Themes (Lush Dream, Starfall Crystal, Twilight Moss)
 * - Particle system & adjustable glow effects
 * - LocalStorage persistence (schema versioned) & starter island arrangement
 * - Audio feedback integrated with window.dreamAudio
 * - Clean lifecycle management (mount / destroy) with zero leaks
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'lumi_dreamscape_v3';
  const ISLAND_RADIUS = 5.2;

  // Environment Lighting & Sky Presets
  const PRESETS = {
    day: {
      id: 'day',
      name: 'Dreamy Day',
      icon: '☀️',
      skyGradient: ['#0284c7', '#38bdf8', '#080c24'],
      ambientColor: 0xdbeafe,
      ambientIntensity: 0.65,
      hemiSky: 0xbae6fd,
      hemiGround: 0x1e293b,
      hemiIntensity: 0.55,
      sunColor: 0xffedd5,
      sunIntensity: 1.35,
      sunPos: [12, 18, 10],
      fogColor: 0x0ea5e9,
      fogDensity: 0.015,
      particleColor: 0xfde047,
      islandGrassColor: 0x34d399,
      islandRockColor: 0x252a48
    },
    sunset: {
      id: 'sunset',
      name: 'Golden Sunset',
      icon: '🌅',
      skyGradient: ['#ea580c', '#c026d3', '#080c24'],
      ambientColor: 0xa855f7,
      ambientIntensity: 0.55,
      hemiSky: 0xf472b6,
      hemiGround: 0x2e1065,
      hemiIntensity: 0.55,
      sunColor: 0xfb923c,
      sunIntensity: 1.45,
      sunPos: [-16, 9, 12],
      fogColor: 0x7c2d12,
      fogDensity: 0.018,
      particleColor: 0xf97316,
      islandGrassColor: 0xf59e0b,
      islandRockColor: 0x2d1b4e
    },
    night: {
      id: 'night',
      name: 'Moonlit Night',
      icon: '🌙',
      skyGradient: ['#030712', '#1e1b4b', '#080c24'],
      ambientColor: 0x312e81,
      ambientIntensity: 0.45,
      hemiSky: 0x6366f1,
      hemiGround: 0x090d24,
      hemiIntensity: 0.5,
      sunColor: 0x93c5fd,
      sunIntensity: 1.05,
      sunPos: [8, 16, -10],
      fogColor: 0x090d24,
      fogDensity: 0.02,
      particleColor: 0x93c5fd,
      islandGrassColor: 0x4338ca,
      islandRockColor: 0x111326
    },
    aurora: {
      id: 'aurora',
      name: 'Aurora Dream',
      icon: '🌌',
      skyGradient: ['#042f2e', '#0d9488', '#080c24'],
      ambientColor: 0x0d9488,
      ambientIntensity: 0.55,
      hemiSky: 0x2dd4bf,
      hemiGround: 0x064e3b,
      hemiIntensity: 0.55,
      sunColor: 0x34d399,
      sunIntensity: 1.25,
      sunPos: [10, 14, 10],
      fogColor: 0x0f766e,
      fogDensity: 0.018,
      particleColor: 0xa7f3d0,
      islandGrassColor: 0x059669,
      islandRockColor: 0x132e2d
    }
  };

  // Island Surface Themes
  const ISLAND_THEMES = {
    lush: {
      id: 'lush',
      name: 'Lush Dream',
      color: 0x34d399,
      roughness: 0.8,
      metalness: 0.05
    },
    crystal: {
      id: 'crystal',
      name: 'Starfall Crystal',
      color: 0x38bdf8,
      roughness: 0.25,
      metalness: 0.4
    },
    twilight: {
      id: 'twilight',
      name: 'Twilight Velvet',
      color: 0x818cf8,
      roughness: 0.7,
      metalness: 0.1
    }
  };

  // Palette Item Definitions
  const PALETTE_ITEMS = [
    {
      id: 'tree',
      name: 'Magical Tree',
      icon: '🌳',
      desc: 'Twisted glowing celestial cherry tree'
    },
    {
      id: 'crystal',
      name: 'Crystal Cluster',
      icon: '💎',
      desc: 'Luminescent gemstone obelisks'
    },
    {
      id: 'cottage',
      name: 'Fantasy Cottage',
      icon: '🏡',
      desc: 'Cozy timber home with glowing window'
    },
    {
      id: 'portal',
      name: 'Glowing Portal',
      icon: '🌀',
      desc: 'Runic stone arch with swirling energy'
    },
    {
      id: 'rock',
      name: 'Decorative Rock',
      icon: '🪨',
      desc: 'Faceted moss boulders with crystal veins'
    },
    {
      id: 'flower',
      name: 'Flower Patch',
      icon: '🌸',
      desc: 'Radiant celestial star blossoms'
    },
    {
      id: 'lantern',
      name: 'Starlight Lantern',
      icon: '🏮',
      desc: 'Hanging brass post with captive star'
    }
  ];

  // Starter island scene for first-time visitors - balanced, breathable diorama
  const DEFAULT_STARTER_OBJECTS = [
    { type: 'cottage', x: -1.8, z: -0.6, rotY: 0.35, scale: 1.0 },
    { type: 'tree', x: 2.2, z: -0.8, rotY: 0.8, scale: 1.05 },
    { type: 'crystal', x: -2.2, z: 1.6, rotY: -0.4, scale: 0.95 },
    { type: 'lantern', x: -0.5, z: 0.7, rotY: 0.2, scale: 1.0 },
    { type: 'flower', x: 0.8, z: 1.8, rotY: 0.0, scale: 1.0 },
    { type: 'rock', x: 2.4, z: 1.3, rotY: 0.5, scale: 1.0 }
  ];

  class DreamscapeCreatorApp {
    constructor() {
      this.container = null;
      this.canvas = null;
      this.renderer = null;
      this.scene = null;
      this.camera = null;
      this.animationFrameId = null;

      // Orbit camera state - calibrated for balanced diorama view
      this.orbit = {
        radius: 18.5,
        targetRadius: 18.5,
        minRadius: 9,
        maxRadius: 32,
        theta: 0.95, // Azimuth angle for ideal 3/4 perspective
        targetTheta: 0.95,
        phi: 0.96,   // Polar elevation angle (~55°)
        targetPhi: 0.96,
        minPhi: 0.35,
        maxPhi: 1.45,
        targetLookAt: null,
        isDragging: false,
        lastPointerX: 0,
        lastPointerY: 0,
        touchDistStart: 0
      };

      // Raycasting & Interaction
      this.raycaster = null;
      this.pointer = null;
      this.groundMesh = null;
      this.islandGroup = null;
      this.cloudsGroup = null;
      this.crystalsGroup = null;
      this.stardustPoints = null;

      // Lighting references
      this.ambientLight = null;
      this.sunLight = null;
      this.pointLight = null;

      // Mode & State
      this.currentMode = 'place'; // 'place' or 'select'
      this.selectedTool = 'tree';
      this.currentPresetKey = 'day';
      this.currentIslandThemeKey = 'lush';
      this.particlesEnabled = true;
      this.glowIntensity = 'vibrant'; // 'soft', 'vibrant', 'radiant'

      // Objects in the world
      this.placedObjects = []; // Array of { id, type, group, mesh, data }
      this.selectedObject = null;
      this.isDraggingObject = false;

      // Ghost preview mesh
      this.ghostMesh = null;
      this.ghostRing = null;
      this.selectionRing = null;

      // Timers & listeners
      this.boundResizeHandler = this.onResize.bind(this);
      this.clock = null;
      this.isInitialized = false;
    }

    /**
     * Mounts the 3D Dreamscape Creator inside target container element
     */
    mount(container) {
      if (!window.THREE) {
        console.error('Three.js is not loaded! Please include assets/three.min.js.');
        container.innerHTML = `
          <div style="padding:24px;text-align:center;color:#f87171;">
            <p style="font-weight:700;">Three.js library is missing.</p>
            <p style="font-size:0.85rem;color:#cbd5e1;margin-top:6px;">Please check assets/three.min.js.</p>
          </div>
        `;
        return;
      }

      this.destroy(); // Ensure clean slate
      this.container = container;
        this.container.style.position = 'relative';
      this.container.style.width = '100%';
      this.container.style.height = '520px';
      this.container.style.minHeight = '520px';
      this.container.style.overflow = 'hidden';
      this.container.style.borderRadius = '16px';
      this.container.style.background = '#060817';

      this.clock = new THREE.Clock();
      this.raycaster = new THREE.Raycaster();
      this.pointer = new THREE.Vector2();
      this.orbit.targetLookAt = new THREE.Vector3(0, 0.4, 0);

      this.buildDOMStructure();
      this.initThreeScene();
      this.loadSavedState();
      this.setupEventListeners();
      this.animate();
      this.isInitialized = true;

      // Initial notification chime
      if (window.dreamAudio && typeof window.dreamAudio.playChime === 'function') {
        window.dreamAudio.playChime('C5');
      }
    }

    /**
     * Builds DOM HUD overlays, toolbar, preset selector & guide modal
     */
    buildDOMStructure() {
      // 1. Canvas element
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'dreamscape-3d-canvas';
      this.canvas.style.display = 'block';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.cursor = 'grab';
      this.container.appendChild(this.canvas);

      // 2. HUD Wrapper (pointer-events: none, buttons auto)
      const hud = document.createElement('div');
      hud.className = 'dreamscape-hud';
      hud.style.cssText = `
        position:absolute;inset:0;pointer-events:none;
        display:flex;flex-direction:column;justify-content:space-between;
        padding:12px 14px;z-index:10;box-sizing:border-box;
        font-family:var(--font-sans, system-ui, sans-serif);
      `;

      // 2A. Top HUD Bar (2-Row Responsive Layout)
      const topBar = document.createElement('div');
      topBar.className = 'dreamscape-top-bar';
      topBar.style.cssText = `
        display:flex;flex-direction:column;gap:8px;width:100%;pointer-events:none;
      `;

      topBar.innerHTML = `
        <!-- Row 1: Left Title Badge & Right Quick Actions -->
        <div class="dreamscape-top-row" style="display:flex;justify-content:space-between;align-items:center;width:100%;gap:8px;flex-wrap:wrap;pointer-events:auto;">
          <div class="dreamscape-title-badge" style="display:inline-flex;align-items:center;gap:8px;background:rgba(9,12,36,0.88);backdrop-filter:blur(10px);border:1px solid rgba(168,85,247,0.35);padding:5px 12px;border-radius:20px;box-shadow:0 4px 16px rgba(0,0,0,0.4);flex-shrink:0;">
            <span style="font-size:0.95rem;">🏝️</span>
            <div>
              <div style="font-size:0.78rem;font-weight:700;color:#ffffff;line-height:1.2;">Dreamscape Creator <span style="color:var(--accent-gold,#fcd34d);font-size:0.68rem;font-weight:600;">3D</span></div>
              <div id="dreamscape-item-count" style="font-size:0.65rem;color:#94a3b8;line-height:1;">${DEFAULT_STARTER_OBJECTS.length} Objects Placed</div>
            </div>
          </div>

          <div class="dreamscape-quick-actions" style="display:inline-flex;align-items:center;gap:6px;flex-shrink:0;max-width:100%;overflow-x:auto;">
            <button id="ds-btn-reset-view" class="ds-icon-btn" title="Reset Camera View (Home)" style="background:rgba(9,12,36,0.85);border:1px solid rgba(255,255,255,0.18);color:#fff;border-radius:50%;width:30px;height:30px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </button>
            <button id="ds-btn-help" class="ds-icon-btn" title="Instructions & Controls" style="background:rgba(9,12,36,0.85);border:1px solid rgba(255,255,255,0.18);color:#fff;border-radius:50%;width:30px;height:30px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.82rem;transition:all 0.2s;">
              ?
            </button>
            <button id="ds-btn-save" class="ds-text-btn" title="Save Island" style="background:linear-gradient(135deg, rgba(168,85,247,0.35), rgba(236,72,153,0.35));border:1px solid rgba(168,85,247,0.55);color:#ffffff;padding:5px 11px;border-radius:14px;font-size:0.72rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all 0.2s;">
              <span>💾</span> <span class="ds-btn-text-label">Save</span>
            </button>
            <button id="ds-btn-clear" class="ds-text-btn" title="Reset to Starter Island" style="background:rgba(239,68,68,0.22);border:1px solid rgba(239,68,68,0.45);color:#fca5a5;padding:5px 10px;border-radius:14px;font-size:0.72rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all 0.2s;">
              <span>🔄</span> <span class="ds-btn-text-label">Reset</span>
            </button>
          </div>
        </div>

        <!-- Row 2: Centered Celestial Presets Bar -->
        <div style="display:flex;justify-content:center;width:100%;pointer-events:auto;">
          <div class="dreamscape-presets-row" style="display:inline-flex;align-items:center;gap:6px;background:rgba(9,12,36,0.88);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.12);padding:4px 8px;border-radius:20px;max-width:100%;overflow-x:auto;scrollbar-width:none;box-shadow:0 4px 16px rgba(0,0,0,0.35);">
            ${Object.values(PRESETS).map(p => `
              <button class="preset-pill-btn ${p.id === this.currentPresetKey ? 'active' : ''}" data-preset="${p.id}" title="${p.name}" style="background:${p.id === this.currentPresetKey ? 'linear-gradient(135deg, #c084fc, #ec4899)' : 'rgba(255,255,255,0.08)'};border:none;color:#ffffff;padding:4px 10px;border-radius:14px;font-size:0.72rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;white-space:nowrap;transition:all 0.2s;">
                <span>${p.icon}</span>
                <span class="preset-name-label">${p.name.split(' ')[1] || p.name}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      // 2B. Context Action Banner (Only visible when an object is selected)
      const contextBar = document.createElement('div');
      contextBar.id = 'dreamscape-context-bar';
      contextBar.style.cssText = `
        pointer-events:auto;margin:0 auto 8px auto;display:none;align-items:center;
        gap:8px;background:rgba(10,14,39,0.92);backdrop-filter:blur(10px);
        border:1px solid rgba(168,85,247,0.4);border-radius:24px;padding:6px 14px;
        box-shadow:0 8px 25px rgba(0,0,0,0.6);transition:all 0.25s ease;
      `;
      contextBar.innerHTML = `
        <div id="ds-selected-actions" style="display:flex;align-items:center;gap:6px;">
          <span id="ds-selected-label" style="font-size:0.76rem;font-weight:700;color:#fde047;margin-right:4px;">Item</span>
          <button id="ds-btn-rotate-sel" style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:12px;padding:3px 8px;font-size:0.7rem;cursor:pointer;">↻ Rotate 45°</button>
          <button id="ds-btn-delete-sel" style="background:rgba(239,68,68,0.3);border:1px solid rgba(239,68,68,0.6);color:#fca5a5;border-radius:12px;padding:3px 8px;font-size:0.7rem;cursor:pointer;">🗑️ Delete</button>
          <button id="ds-btn-deselect" style="background:transparent;border:none;color:#94a3b8;font-size:0.85rem;cursor:pointer;padding:0 4px;">✕</button>
        </div>
      `;

      // 2C. Bottom Unified Dock (Palette Items + Theme Selector - Zero Overlap)
      const bottomBar = document.createElement('div');
      bottomBar.className = 'dreamscape-bottom-bar';
      bottomBar.style.cssText = `
        display:flex;justify-content:center;align-items:center;width:100%;pointer-events:auto;
        padding:0 8px;box-sizing:border-box;
      `;

      const paletteDock = document.createElement('div');
      paletteDock.className = 'dreamscape-palette-dock';
      paletteDock.style.cssText = `
        display:inline-flex;align-items:center;gap:6px;background:rgba(10,14,39,0.92);
        backdrop-filter:blur(14px);border:1px solid rgba(168,85,247,0.38);
        padding:6px 10px;border-radius:26px;box-shadow:0 10px 32px rgba(0,0,0,0.65);
        max-width:100%;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;
      `;

      // Select / Hand tool button
      let dockHtml = `
        <button class="palette-item-btn ${this.currentMode === 'select' ? 'active' : ''}" data-tool="select" title="Select / Move Tool (Tap objects to move, rotate, or delete)" style="background:${this.currentMode === 'select' ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'rgba(255,255,255,0.06)'};border:1px solid ${this.currentMode === 'select' ? '#c084fc' : 'transparent'};color:#fff;border-radius:14px;padding:5px 9px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;font-size:0.72rem;font-weight:600;white-space:nowrap;flex-shrink:0;transition:all 0.2s;">
          <span>✋</span>
          <span>Select</span>
        </button>
        <div style="width:1px;height:18px;background:rgba(255,255,255,0.18);margin:0 2px;flex-shrink:0;"></div>
      `;

      // Item buttons
      PALETTE_ITEMS.forEach(item => {
        const isActive = this.currentMode === 'place' && this.selectedTool === item.id;
        dockHtml += `
          <button class="palette-item-btn ${isActive ? 'active' : ''}" data-tool="${item.id}" title="${item.name}: ${item.desc}" style="background:${isActive ? 'linear-gradient(135deg, #ec4899, #a855f7)' : 'rgba(255,255,255,0.06)'};border:1px solid ${isActive ? '#f472b6' : 'transparent'};color:#fff;border-radius:14px;padding:5px 8px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;font-size:0.72rem;font-weight:600;white-space:nowrap;flex-shrink:0;transition:all 0.2s;">
            <span>${item.icon}</span>
            <span class="palette-item-name">${item.name}</span>
          </button>
        `;
      });

      // Integrated Theme Toggle Button inside Dock
      dockHtml += `
        <div style="width:1px;height:18px;background:rgba(255,255,255,0.18);margin:0 2px;flex-shrink:0;"></div>
        <button id="ds-btn-theme-toggle" title="Switch Island Terrain Theme" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);color:#cbd5e1;padding:5px 10px;border-radius:14px;font-size:0.72rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;white-space:nowrap;flex-shrink:0;transition:all 0.2s;">
          <span>🎨</span>
          <span id="ds-theme-label">${ISLAND_THEMES[this.currentIslandThemeKey].name}</span>
        </button>
      `;

      paletteDock.innerHTML = dockHtml;
      bottomBar.appendChild(paletteDock);

      hud.appendChild(topBar);
      hud.appendChild(contextBar);
      hud.appendChild(bottomBar);
      this.container.appendChild(hud);

      // 3. First-use Onboarding Guide Card Overlay
      const guideOverlay = document.createElement('div');
      guideOverlay.id = 'dreamscape-guide-overlay';
      guideOverlay.style.cssText = `
        position:absolute;inset:0;background:rgba(6,8,23,0.85);backdrop-filter:blur(8px);
        z-index:30;display:flex;align-items:center;justify-content:center;padding:16px;
        transition:opacity 0.3s ease;
      `;
      guideOverlay.innerHTML = `
        <div style="background:#101438;border:1px solid rgba(168,85,247,0.4);border-radius:18px;max-width:440px;width:100%;padding:22px;box-shadow:0 20px 50px rgba(0,0,0,0.8);text-align:center;">
          <div style="font-size:2rem;margin-bottom:6px;">✨🏝️✨</div>
          <h3 style="font-family:var(--font-display, serif);font-size:1.3rem;color:#ffffff;margin-bottom:6px;">Welcome to Dreamscape Creator</h3>
          <p style="font-size:0.8rem;color:#cbd5e1;line-height:1.5;margin-bottom:14px;">Build and sculpt your own floating sanctuary among the stars in real-time 3D!</p>
          
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:left;margin-bottom:18px;font-size:0.75rem;">
            <div style="background:rgba(255,255,255,0.05);padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);">
              <div style="font-weight:700;color:var(--accent-gold,#fcd34d);margin-bottom:2px;">🖱️ Orbit & Pan</div>
              <div style="color:#94a3b8;">Drag with mouse or finger to rotate the world.</div>
            </div>
            <div style="background:rgba(255,255,255,0.05);padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);">
              <div style="font-weight:700;color:var(--accent-gold,#fcd34d);margin-bottom:2px;">🔍 Zoom</div>
              <div style="color:#94a3b8;">Scroll wheel or pinch on touchscreens to zoom.</div>
            </div>
            <div style="background:rgba(255,255,255,0.05);padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);">
              <div style="font-weight:700;color:var(--accent-gold,#fcd34d);margin-bottom:2px;">🌸 Place Items</div>
              <div style="color:#94a3b8;">Pick an item below & click anywhere on the grass.</div>
            </div>
            <div style="background:rgba(255,255,255,0.05);padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,0.08);">
              <div style="font-weight:700;color:var(--accent-gold,#fcd34d);margin-bottom:2px;">✋ Move & Delete</div>
              <div style="color:#94a3b8;">Click any placed item to rotate or delete it.</div>
            </div>
          </div>

          <button id="ds-btn-start-building" style="background:linear-gradient(135deg, #c084fc, #ec4899);border:none;color:#fff;padding:10px 24px;border-radius:24px;font-size:0.85rem;font-weight:700;cursor:pointer;box-shadow:0 4px 15px rgba(236,72,153,0.4);transition:transform 0.2s;">
            ✨ Enter Dreamscape
          </button>
        </div>
      `;

      // Check if user has already seen guide
      if (localStorage.getItem('lumi_ds_guide_seen') === 'true') {
        guideOverlay.style.display = 'none';
      }

      this.container.appendChild(guideOverlay);
    }

    /**
     * Initializes the Three.js WebGL Scene, Renderer, Camera, Lights and Procedural Island
     */
    initThreeScene() {
      const width = this.container.clientWidth || 600;
      const height = this.container.clientHeight || 520;

      // 1. Renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // 2. Scene
      this.scene = new THREE.Scene();
      const preset = PRESETS[this.currentPresetKey];
      this.scene.fog = new THREE.FogExp2(preset.fogColor, preset.fogDensity);

      // 3. Camera
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      this.updateCameraFromOrbit();

      // 4. Lights
      this.ambientLight = new THREE.AmbientLight(preset.ambientColor, preset.ambientIntensity);
      this.scene.add(this.ambientLight);

      this.hemiLight = new THREE.HemisphereLight(
        preset.hemiSky || 0xbae6fd,
        preset.hemiGround || 0x1e293b,
        preset.hemiIntensity || 0.55
      );
      this.scene.add(this.hemiLight);

      this.sunLight = new THREE.DirectionalLight(preset.sunColor, preset.sunIntensity);
      this.sunLight.position.set(...preset.sunPos);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.width = 1024;
      this.sunLight.shadow.mapSize.height = 1024;
      this.sunLight.shadow.camera.near = 0.5;
      this.sunLight.shadow.camera.far = 50;
      const d = 8.5;
      this.sunLight.shadow.camera.left = -d;
      this.sunLight.shadow.camera.right = d;
      this.sunLight.shadow.camera.top = d;
      this.sunLight.shadow.camera.bottom = -d;
      this.sunLight.shadow.bias = -0.001;
      this.scene.add(this.sunLight);

      // Underside celestial rim light
      this.pointLight = new THREE.PointLight(0xa855f7, 0.95, 14);
      this.pointLight.position.set(0, -4.5, 0);
      this.scene.add(this.pointLight);

      // 5. Procedural Floating Island
      this.createFloatingIsland();

      // 6. Atmospheric Elements (Clouds, Crystals, Particles)
      this.createAtmosphere();

      // 7. Ghost Preview Mesh & Selection Bracket
      this.createGhostAndSelectionVisuals();

      // Apply initial preset sky and lighting
      this.setPreset(this.currentPresetKey);
    }

    /**
     * Creates procedural floating island geometry:
     * - Beveled top grass surface with cobblestone trail & perimeter moss rocks
     * - Multi-tier stratified rock cliff underbelly tapering down
     * - Stalactite spire tip with glowing hearth crystal cluster
     * - Floating satellite rock chunks drifting with anti-gravity
     */
    createFloatingIsland() {
      this.islandGroup = new THREE.Group();
      this.islandGroup.name = 'floatingIsland';

      const theme = ISLAND_THEMES[this.currentIslandThemeKey];
      const preset = PRESETS[this.currentPresetKey];

      // A. Ground Grass Surface (Disc / Flat Cylinder)
      // Height 0.7, top radius ISLAND_RADIUS (5.2), smooth bevel
      const grassGeo = new THREE.CylinderGeometry(ISLAND_RADIUS, ISLAND_RADIUS * 0.96, 0.7, 48);
      const grassMat = new THREE.MeshStandardMaterial({
        color: theme.color,
        roughness: theme.roughness,
        metalness: theme.metalness,
        flatShading: false
      });

      this.groundMesh = new THREE.Mesh(grassGeo, grassMat);
      this.groundMesh.position.y = -0.35; // Top surface sits exactly at Y=0
      this.groundMesh.receiveShadow = true;
      this.groundMesh.name = 'islandGround';
      this.islandGroup.add(this.groundMesh);

      // B. Cobblestone Stepping Stones Pathway
      const pathMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.88,
        metalness: 0.08,
        flatShading: true
      });
      const pathCoords = [
        { x: -1.3, z: -0.4, r: 0.28 },
        { x: -0.95, z: -0.15, r: 0.32 },
        { x: -0.65, z: 0.15, r: 0.30 },
        { x: -0.25, z: 0.4, r: 0.34 },
        { x: 0.15, z: 0.55, r: 0.30 },
        { x: 0.55, z: 0.7, r: 0.32 },
        { x: 0.95, z: 0.85, r: 0.28 },
        { x: -0.2, z: 0.95, r: 0.26 },
        { x: 0.3, z: 1.15, r: 0.28 }
      ];
      pathCoords.forEach((pt, idx) => {
        const stone = new THREE.Mesh(new THREE.CylinderGeometry(pt.r, pt.r * 1.05, 0.04, 7), pathMat);
        stone.position.set(pt.x, 0.015, pt.z);
        stone.rotation.y = idx * 0.75;
        stone.receiveShadow = true;
        this.islandGroup.add(stone);
      });

      // C. Perimeter Edge Moss Boulders & Rocks
      const rimMat = new THREE.MeshStandardMaterial({
        color: preset.islandRockColor,
        roughness: 0.9,
        metalness: 0.1,
        flatShading: true
      });
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + (i % 2) * 0.15;
        const rad = ISLAND_RADIUS * 0.94 + ((i * 7) % 5) * 0.04;
        const s = 0.22 + (i % 3) * 0.1;
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), rimMat);
        rock.position.set(Math.cos(angle) * rad, -0.05, Math.sin(angle) * rad);
        rock.rotation.set(i * 0.4, i * 0.7, i * 0.2);
        rock.castShadow = true;
        rock.receiveShadow = true;
        this.islandGroup.add(rock);
      }

      // D. Rocky Stratified Island Underbelly (Inverted Crag with Layers)
      const underbellyGroup = new THREE.Group();

      // Stratum 1: Upper cliff rim (Dark Charcoal Slate)
      const cliff1Geo = new THREE.CylinderGeometry(ISLAND_RADIUS * 0.96, ISLAND_RADIUS * 0.78, 1.4, 20);
      const cliff1Mesh = new THREE.Mesh(cliff1Geo, rimMat);
      cliff1Mesh.position.y = -1.05;
      cliff1Mesh.castShadow = true;
      cliff1Mesh.receiveShadow = true;
      underbellyGroup.add(cliff1Mesh);

      // Stratum 2: Mid-tier Geological Band (Asymmetric Shelf)
      const cliff2Geo = new THREE.CylinderGeometry(ISLAND_RADIUS * 0.78, ISLAND_RADIUS * 0.52, 1.6, 14);
      const cliff2Mesh = new THREE.Mesh(cliff2Geo, rimMat);
      cliff2Mesh.position.set(0.12, -2.25, -0.1);
      cliff2Mesh.castShadow = true;
      cliff2Mesh.receiveShadow = true;
      underbellyGroup.add(cliff2Mesh);

      // Stratum 3: Inverted Deep Tapered Crag
      const midCragGeo = new THREE.ConeGeometry(ISLAND_RADIUS * 0.52, 2.6, 9);
      midCragGeo.rotateX(Math.PI);
      const midCrag = new THREE.Mesh(midCragGeo, rimMat);
      midCrag.position.set(-0.08, -3.8, 0.12);
      midCrag.castShadow = true;
      underbellyGroup.add(midCrag);

      // Stratum 4: Sharp Floating Stalactite Tip
      const tipGeo = new THREE.ConeGeometry(1.2, 2.0, 6);
      tipGeo.rotateX(Math.PI);
      const tipMesh = new THREE.Mesh(tipGeo, rimMat);
      tipMesh.position.set(0.05, -5.0, -0.05);
      underbellyGroup.add(tipMesh);

      // Hanging Secondary Stalactites around the rim
      const subStalactites = [
        { x: -2.8, z: 1.8, h: 1.4, r: 0.28 },
        { x: 2.6, z: -2.0, h: 1.6, r: 0.32 },
        { x: -1.8, z: -3.0, h: 1.2, r: 0.25 },
        { x: 3.0, z: 1.4, h: 1.3, r: 0.26 }
      ];
      subStalactites.forEach(st => {
        const sGeo = new THREE.ConeGeometry(st.r, st.h, 5);
        sGeo.rotateX(Math.PI);
        const sMesh = new THREE.Mesh(sGeo, rimMat);
        sMesh.position.set(st.x, -1.8, st.z);
        sMesh.rotation.z = (Math.random() - 0.5) * 0.2;
        underbellyGroup.add(sMesh);
      });

      // Stratum 5: Heart of the Island Crystal Cluster (Bottom Tip Glow)
      const coreCrystalMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.4
      });
      const core1 = new THREE.Mesh(new THREE.OctahedronGeometry(0.42), coreCrystalMat);
      core1.position.set(0, -5.5, 0);
      const core2 = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.18, 0.9, 5), coreCrystalMat);
      core2.position.set(0.25, -5.2, 0.15);
      core2.rotation.z = -0.3;
      const core3 = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.16, 0.75, 5), coreCrystalMat);
      core3.position.set(-0.2, -5.3, -0.2);
      core3.rotation.x = 0.35;
      underbellyGroup.add(core1, core2, core3);

      // Stratum 6: Floating Satellite Rock Chunks
      const satCoords = [
        { x: -4.2, y: -2.8, z: 2.5, s: 0.35 },
        { x: 3.8, y: -3.5, z: -2.8, s: 0.42 },
        { x: -2.4, y: -4.6, z: -3.6, s: 0.3 },
        { x: 4.0, y: -2.2, z: 2.2, s: 0.38 }
      ];
      satCoords.forEach(sc => {
        const satMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(sc.s, 0), rimMat);
        satMesh.position.set(sc.x, sc.y, sc.z);
        satMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        satMesh.castShadow = true;
        underbellyGroup.add(satMesh);
      });

      this.islandGroup.add(underbellyGroup);
      this.scene.add(this.islandGroup);
    }

    /**
     * Creates floating low-poly clouds, drifting crystal shards, and ambient stardust
     */
    createAtmosphere() {
      // 1. Drifting Clouds Group
      this.cloudsGroup = new THREE.Group();
      const cloudMat = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.78,
        flatShading: true
      });

      const cloudPositions = [
        { r: 8.2, angle: 0.4, y: 0.6, s: 1.1 },
        { r: 9.0, angle: 2.1, y: -0.4, s: 0.9 },
        { r: 7.8, angle: 3.8, y: 1.1, s: 1.25 },
        { r: 8.8, angle: 5.2, y: -0.8, s: 0.85 }
      ];

      cloudPositions.forEach(cp => {
        const cloud = new THREE.Group();
        // Clustered spheres
        const s1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 1), cloudMat);
        const s2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 1), cloudMat);
        s2.position.set(0.65, -0.1, 0.2);
        const s3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5, 1), cloudMat);
        s3.position.set(-0.6, -0.15, -0.1);
        cloud.add(s1, s2, s3);

        cloud.position.set(
          Math.cos(cp.angle) * cp.r,
          cp.y,
          Math.sin(cp.angle) * cp.r
        );
        cloud.scale.setScalar(cp.s);
        cloud.userData = { baseR: cp.r, baseAngle: cp.angle, speed: 0.08 / cp.r, baseY: cp.y };
        this.cloudsGroup.add(cloud);
      });
      this.scene.add(this.cloudsGroup);

      // 2. Floating Crystal Shards around island
      this.crystalsGroup = new THREE.Group();
      const crystalMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.4
      });

      for (let i = 0; i < 8; i++) {
        const shardGeo = new THREE.OctahedronGeometry(0.22 + Math.random() * 0.18);
        const shard = new THREE.Mesh(shardGeo, crystalMat);
        const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.4;
        const rad = 6.2 + Math.random() * 2.2;
        const y = -1.5 + Math.random() * 3.5;
        shard.position.set(Math.cos(angle) * rad, y, Math.sin(angle) * rad);
        shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        shard.userData = { baseY: y, phase: Math.random() * Math.PI * 2, rotSpeed: 0.02 + Math.random() * 0.02 };
        this.crystalsGroup.add(shard);
      }
      this.scene.add(this.crystalsGroup);

      // 3. Stardust Particle System
      const particleCount = 350;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const scales = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 2.5 + Math.cbrt(Math.random()) * 11.0;

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) + 0.5;
        positions[i * 3 + 2] = r * Math.cos(phi);
        scales[i] = Math.random() * 0.8 + 0.4;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const preset = PRESETS[this.currentPresetKey];
      const particleMat = new THREE.PointsMaterial({
        color: preset.particleColor,
        size: 0.16,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      });

      this.stardustPoints = new THREE.Points(particleGeo, particleMat);
      this.scene.add(this.stardustPoints);
    }

    /**
     * Creates ghost preview mesh & ground placement indicator
     */
    createGhostAndSelectionVisuals() {
      // 1. Placement ring (indicates snap coordinate & island boundary)
      const ringGeo = new THREE.RingGeometry(0.35, 0.45, 32);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide
      });
      this.ghostRing = new THREE.Mesh(ringGeo, ringMat);
      this.ghostRing.position.y = 0.02;
      this.ghostRing.visible = false;
      this.islandGroup.add(this.ghostRing);

      // 2. Selection ring (appears underneath selected placed object)
      const selRingGeo = new THREE.RingGeometry(0.5, 0.65, 32);
      selRingGeo.rotateX(-Math.PI / 2);
      const selRingMat = new THREE.MeshBasicMaterial({
        color: 0xfde047,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      });
      this.selectionRing = new THREE.Mesh(selRingGeo, selRingMat);
      this.selectionRing.position.y = 0.02;
      this.selectionRing.visible = false;
      this.islandGroup.add(this.selectionRing);

      this.updateGhostMesh();
    }

    /**
     * Updates or recreates the ghost preview model when palette tool changes
     */
    updateGhostMesh() {
      if (this.ghostMesh) {
        if (this.ghostMesh.parent) this.ghostMesh.parent.remove(this.ghostMesh);
        this.disposeHierarchy(this.ghostMesh);
        this.ghostMesh = null;
      }

      if (this.currentMode !== 'place') {
        if (this.ghostRing) this.ghostRing.visible = false;
        return;
      }

      this.ghostMesh = this.generateModel(this.selectedTool, true);
      this.ghostMesh.visible = false;
      this.islandGroup.add(this.ghostMesh);
    }

    /**
     * Procedural 3D Model Generator
     * High-fidelity fantasy miniature assets with rich layered details
     * @param {string} type - 'tree' | 'crystal' | 'cottage' | 'portal' | 'rock' | 'flower' | 'lantern'
     * @param {boolean} isGhost - whether to apply ghost translucency
     */
    generateModel(type, isGhost = false) {
      const group = new THREE.Group();
      group.userData = { type };

      const ghostOpacity = 0.45;
      const makeMat = (params) => {
        if (isGhost) {
          return new THREE.MeshBasicMaterial({
            color: params.color || 0x38bdf8,
            transparent: true,
            opacity: ghostOpacity,
            wireframe: false
          });
        }
        return new THREE.MeshStandardMaterial(params);
      };

      if (type === 'tree') {
        // Magical Celestial Cherry Tree
        // 1. Spreading Root Buttresses
        const rootMat = makeMat({ color: 0x3d1d0c, roughness: 0.9, flatShading: true });
        for (let i = 0; i < 4; i++) {
          const rootAngle = (i / 4) * Math.PI * 2 + 0.3;
          const rootGeo = new THREE.CylinderGeometry(0.08, 0.22, 0.55, 6);
          const root = new THREE.Mesh(rootGeo, rootMat);
          root.position.set(Math.cos(rootAngle) * 0.32, 0.18, Math.sin(rootAngle) * 0.32);
          root.rotation.x = Math.sin(rootAngle) * 0.45;
          root.rotation.z = -Math.cos(rootAngle) * 0.45;
          root.castShadow = !isGhost;
          root.receiveShadow = !isGhost;
          group.add(root);
        }

        // 2. Sculpted Twisted Mahogany Trunk
        const trunkLowerGeo = new THREE.CylinderGeometry(0.24, 0.44, 1.2, 8);
        const trunkLower = new THREE.Mesh(trunkLowerGeo, rootMat);
        trunkLower.position.y = 0.6;
        trunkLower.castShadow = !isGhost;
        trunkLower.receiveShadow = !isGhost;
        group.add(trunkLower);

        const trunkUpperGeo = new THREE.CylinderGeometry(0.16, 0.26, 1.1, 7);
        const trunkUpper = new THREE.Mesh(trunkUpperGeo, rootMat);
        trunkUpper.position.set(0.06, 1.55, 0.04);
        trunkUpper.rotation.z = -0.12;
        trunkUpper.rotation.x = 0.08;
        trunkUpper.castShadow = !isGhost;
        trunkUpper.receiveShadow = !isGhost;
        group.add(trunkUpper);

        // 3. Spreading Branch Limbs
        const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.75, 6), rootMat);
        b1.position.set(0.32, 2.05, 0.15);
        b1.rotation.z = -0.55;
        b1.rotation.y = 0.3;
        const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.7, 6), rootMat);
        b2.position.set(-0.28, 2.0, -0.2);
        b2.rotation.z = 0.52;
        b2.rotation.y = -0.4;
        group.add(b1, b2);

        // 4. Multi-tiered Faceted Cloud Canopy (Cherry / Magenta / Lavender Gradients)
        const leafMatLower = makeMat({
          color: 0xf472b6,
          emissive: 0xdb2777,
          emissiveIntensity: 0.25,
          roughness: 0.6,
          flatShading: true
        });
        const leafMatMid = makeMat({
          color: 0xfb7185,
          emissive: 0xe11d48,
          emissiveIntensity: 0.28,
          roughness: 0.55,
          flatShading: true
        });
        const leafMatTop = makeMat({
          color: 0xf43f5e,
          emissive: 0x9333ea,
          emissiveIntensity: 0.22,
          roughness: 0.5,
          flatShading: true
        });

        // Lower broad canopy layer
        const c1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 1), leafMatLower);
        c1.position.set(0.42, 2.25, 0.25);
        const c2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8, 1), leafMatLower);
        c2.position.set(-0.4, 2.2, -0.22);
        const c3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.72, 1), leafMatLower);
        c3.position.set(0.05, 2.15, -0.45);

        // Mid canopy layer
        const c4 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.75, 1), leafMatMid);
        c4.position.set(0.2, 2.8, -0.05);
        const c5 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.68, 1), leafMatMid);
        c5.position.set(-0.25, 2.75, 0.22);

        // Crown puff
        const c6 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.58, 1), leafMatTop);
        c6.position.set(0.02, 3.32, 0.05);

        [c1, c2, c3, c4, c5, c6].forEach(puff => {
          puff.castShadow = !isGhost;
          puff.receiveShadow = !isGhost;
          group.add(puff);
        });

        // 5. Hanging Will-o'-the-Wisp Fairy Lanterns
        if (!isGhost) {
          const wispMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
          const wispPositions = [
            [0.65, 2.1, 0.45],
            [-0.6, 2.05, -0.35],
            [0.1, 1.95, -0.65],
            [-0.35, 2.4, 0.55],
            [0.45, 2.6, -0.3]
          ];
          wispPositions.forEach(pos => {
            const wisp = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), wispMat);
            wisp.position.set(...pos);
            group.add(wisp);
          });
        }
      } else if (type === 'crystal') {
        // Resonant Celestial Crystal Cluster with Levitating Core Shard
        // 1. Basalt / Obsidian Matrix Bedrock
        const matrixMat = makeMat({ color: 0x1e293b, roughness: 0.9, flatShading: true });
        const matrixBed = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 0), matrixMat);
        matrixBed.position.set(0, 0.12, 0);
        matrixBed.scale.set(1.25, 0.32, 1.15);
        matrixBed.castShadow = !isGhost;
        matrixBed.receiveShadow = !isGhost;
        group.add(matrixBed);

        // 2. Faceted Hexagonal Crystal Spires
        const cyanMat = makeMat({
          color: 0x06b6d4,
          emissive: 0x0891b2,
          emissiveIntensity: 0.72,
          roughness: 0.15,
          metalness: 0.25,
          flatShading: true
        });
        const violetMat = makeMat({
          color: 0xa855f7,
          emissive: 0x7e22ce,
          emissiveIntensity: 0.75,
          roughness: 0.18,
          metalness: 0.2,
          flatShading: true
        });
        const roseMat = makeMat({
          color: 0xf43f5e,
          emissive: 0xbe123c,
          emissiveIntensity: 0.8,
          roughness: 0.2,
          flatShading: true
        });
        const starMat = makeMat({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.75,
          roughness: 0.2,
          flatShading: true
        });

        // Grand Central Spire
        const c1 = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.34, 2.4, 6), cyanMat);
        c1.position.set(0, 1.2, 0);
        c1.castShadow = !isGhost;
        group.add(c1);

        // Amethyst Spire Left
        const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.26, 1.75, 6), violetMat);
        c2.position.set(-0.42, 0.88, 0.15);
        c2.rotation.z = 0.24;
        c2.rotation.x = -0.15;
        c2.castShadow = !isGhost;
        group.add(c2);

        // Violet Spire Right
        const c3 = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.24, 1.5, 6), violetMat);
        c3.position.set(0.38, 0.75, 0.25);
        c3.rotation.z = -0.28;
        c3.rotation.y = 0.4;
        c3.castShadow = !isGhost;
        group.add(c3);

        // Rose Quartz Spire Back
        const c4 = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.2, 1.25, 6), roseMat);
        c4.position.set(0.12, 0.62, -0.42);
        c4.rotation.x = 0.32;
        c4.castShadow = !isGhost;
        group.add(c4);

        // Starlight Spire Front
        const c5 = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.16, 0.95, 6), starMat);
        c5.position.set(-0.25, 0.48, -0.28);
        c5.rotation.z = 0.22;
        c5.castShadow = !isGhost;
        group.add(c5);

        // 3. Levitating Resonant Diamond Shard
        const shardMat = isGhost
          ? new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: ghostOpacity })
          : new THREE.MeshStandardMaterial({
            color: 0xe0f2fe,
            emissive: 0x38bdf8,
            emissiveIntensity: 0.9,
            roughness: 0.1,
            metalness: 0.4,
            flatShading: true
          });
        const floatingShard = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), shardMat);
        floatingShard.position.set(0, 2.65, 0);
        floatingShard.name = 'floatingShard';
        floatingShard.userData = { baseY: 2.65 };
        group.add(floatingShard);
      } else if (type === 'cottage') {
        // Detailed Fantasy Timber-Framed Cottage
        // 1. Rustic Stone Foundation Plinth
        const plinthMat = makeMat({ color: 0x334155, roughness: 0.92, flatShading: true });
        const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.24, 1.4), plinthMat);
        plinth.position.y = 0.12;
        plinth.castShadow = !isGhost;
        plinth.receiveShadow = !isGhost;
        group.add(plinth);

        // 2. Timber-Framed Plaster Body
        const wallMat = makeMat({ color: 0xfef3c7, roughness: 0.85, flatShading: true });
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.95, 1.2), wallMat);
        body.position.y = 0.72;
        body.castShadow = !isGhost;
        body.receiveShadow = !isGhost;
        group.add(body);

        // 3. Dark Walnut Timber Corner Beams & Trims
        const timberMat = makeMat({ color: 0x451a03, roughness: 0.9, flatShading: true });
        const postGeo = new THREE.BoxGeometry(0.09, 0.98, 0.09);
        const corners = [
          [-0.64, 0.72, -0.59],
          [0.64, 0.72, -0.59],
          [-0.64, 0.72, 0.59],
          [0.64, 0.72, 0.59]
        ];
        corners.forEach(pos => {
          const post = new THREE.Mesh(postGeo, timberMat);
          post.position.set(...pos);
          post.castShadow = !isGhost;
          group.add(post);
        });

        // Horizontal wall belt beam
        const beltF = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.07, 0.05), timberMat);
        beltF.position.set(0, 0.72, 0.61);
        const beltB = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.07, 0.05), timberMat);
        beltB.position.set(0, 0.72, -0.61);
        group.add(beltF, beltB);

        // 4. Authentic Pitched Gabled Roof with Overhanging Eaves
        const roofMat = makeMat({ color: 0x5b21b6, roughness: 0.65, flatShading: true });
        const roofGeo = new THREE.BoxGeometry(0.96, 0.09, 1.48);

        // Left pitch slab
        const roofL = new THREE.Mesh(roofGeo, roofMat);
        roofL.position.set(-0.38, 1.48, 0);
        roofL.rotation.z = 0.68; // ~39 deg
        roofL.castShadow = !isGhost;
        roofL.receiveShadow = !isGhost;

        // Right pitch slab
        const roofR = new THREE.Mesh(roofGeo, roofMat);
        roofR.position.set(0.38, 1.48, 0);
        roofR.rotation.z = -0.68;
        roofR.castShadow = !isGhost;
        roofR.receiveShadow = !isGhost;

        // Peak ridge beam
        const ridgeMat = makeMat({ color: 0x3b0764, roughness: 0.8, flatShading: true });
        const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.52), ridgeMat);
        ridge.position.set(0, 1.82, 0);
        group.add(roofL, roofR, ridge);

        // Front & Back Gable Wall Fillers (triangular facade)
        const gableGeo = new THREE.CylinderGeometry(0.01, 1.25, 0.6, 3);
        const gableF = new THREE.Mesh(gableGeo, wallMat);
        gableF.position.set(0, 1.48, 0.58);
        gableF.scale.set(1.0, 1.0, 0.08);
        const gableB = new THREE.Mesh(gableGeo, wallMat);
        gableB.position.set(0, 1.48, -0.58);
        gableB.scale.set(1.0, 1.0, 0.08);
        group.add(gableF, gableB);

        // 5. Masonry Chimney with Smoke Puffs
        const chimMat = makeMat({ color: 0x475569, roughness: 0.9, flatShading: true });
        const chim = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.0, 0.28), chimMat);
        chim.position.set(0.42, 1.55, -0.25);
        chim.castShadow = !isGhost;
        group.add(chim);

        const chimCap = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 0.34), chimMat);
        chimCap.position.set(0.42, 2.08, -0.25);
        group.add(chimCap);

        if (!isGhost) {
          // Cute rising smoke puffs
          const smokeMat = new THREE.MeshBasicMaterial({
            color: 0xe2e8f0,
            transparent: true,
            opacity: 0.55
          });
          const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), smokeMat);
          s1.position.set(0.42, 2.22, -0.25);
          const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), smokeMat);
          s2.position.set(0.46, 2.38, -0.28);
          group.add(s1, s2);
        }

        // 6. Front Porch, Arched Door & Step
        const stepMat = makeMat({ color: 0x475569, roughness: 0.9 });
        const step = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.22), stepMat);
        step.position.set(0.32, 0.04, 0.72);
        group.add(step);

        const doorMat = makeMat({ color: 0x78350f, roughness: 0.8 });
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.58, 0.04), doorMat);
        door.position.set(0.32, 0.53, 0.62);
        door.castShadow = !isGhost;
        group.add(door);

        // Porch Awning over door
        const awning = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.06, 0.28), roofMat);
        awning.position.set(0.32, 0.88, 0.74);
        awning.rotation.x = 0.22;
        group.add(awning);

        // Door knob
        if (!isGhost) {
          const knobMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
          const knob = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), knobMat);
          knob.position.set(0.42, 0.52, 0.65);
          group.add(knob);
        }

        // 7. Glowing Windows with Mullions & Flower Box
        if (!isGhost) {
          // Warm glowing front window
          const winMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
          const winFront = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), winMat);
          winFront.position.set(-0.32, 0.74, 0.61);
          group.add(winFront);

          // Dark window cross-mullions
          const mullionMat = new THREE.MeshBasicMaterial({ color: 0x292524 });
          const mVert = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.34), mullionMat);
          mVert.position.set(-0.32, 0.74, 0.615);
          const mHoriz = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.04), mullionMat);
          mHoriz.position.set(-0.32, 0.74, 0.615);
          group.add(mVert, mHoriz);

          // Flower planter box beneath window
          const boxMat = makeMat({ color: 0x78350f, roughness: 0.9 });
          const planter = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.12), boxMat);
          planter.position.set(-0.32, 0.52, 0.66);
          group.add(planter);

          // Colorful flower dots in planter
          const bPink = new THREE.Mesh(new THREE.SphereGeometry(0.04), new THREE.MeshBasicMaterial({ color: 0xf43f5e }));
          bPink.position.set(-0.42, 0.6, 0.67);
          const bYellow = new THREE.Mesh(new THREE.SphereGeometry(0.04), new THREE.MeshBasicMaterial({ color: 0xfde047 }));
          bYellow.position.set(-0.32, 0.6, 0.67);
          const bCyan = new THREE.Mesh(new THREE.SphereGeometry(0.04), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
          bCyan.position.set(-0.22, 0.6, 0.67);
          group.add(bPink, bYellow, bCyan);

          // Side Glowing Window
          const winSide = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), winMat);
          winSide.position.set(-0.66, 0.74, 0);
          winSide.rotation.y = -Math.PI / 2;
          group.add(winSide);
        }
      } else if (type === 'portal') {
        // Ancient Mystic Runic Arc & Cosmic Horizon
        // 1. Stepped Ancient Stone Dais
        const stoneMat = makeMat({
          color: 0x0f172a,
          roughness: 0.85,
          metalness: 0.25,
          flatShading: true
        });
        const daisStep1 = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.48, 0.12, 24), stoneMat);
        daisStep1.position.y = 0.06;
        daisStep1.castShadow = !isGhost;
        daisStep1.receiveShadow = !isGhost;

        const daisStep2 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.28, 0.12, 24), stoneMat);
        daisStep2.position.y = 0.18;
        daisStep2.castShadow = !isGhost;
        daisStep2.receiveShadow = !isGhost;
        group.add(daisStep1, daisStep2);

        // 2. Twin Carved Runic Obelisk Pillars
        const pilGeo = new THREE.CylinderGeometry(0.18, 0.22, 1.85, 8);
        const p1 = new THREE.Mesh(pilGeo, stoneMat);
        p1.position.set(-1.0, 1.15, 0);
        p1.castShadow = !isGhost;
        p1.receiveShadow = !isGhost;

        const p2 = new THREE.Mesh(pilGeo, stoneMat);
        p2.position.set(1.0, 1.15, 0);
        p2.castShadow = !isGhost;
        p2.receiveShadow = !isGhost;
        group.add(p1, p2);

        // Luminous Runic Bands on Pillars
        if (!isGhost) {
          const runeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
          [-0.3, 0.2].forEach(yOffset => {
            const r1 = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.025, 8, 16), runeMat);
            r1.position.set(-1.0, 1.15 + yOffset, 0);
            r1.rotation.x = Math.PI / 2;
            const r2 = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.025, 8, 16), runeMat);
            r2.position.set(1.0, 1.15 + yOffset, 0);
            r2.rotation.x = Math.PI / 2;
            group.add(r1, r2);
          });
        }

        // 3. Sweeping Stone Arch & Apex Keystone
        const archGeo = new THREE.TorusGeometry(1.0, 0.18, 12, 32, Math.PI);
        const arch = new THREE.Mesh(archGeo, stoneMat);
        arch.position.y = 2.05;
        arch.rotation.z = Math.PI; // Arch up
        arch.castShadow = !isGhost;
        group.add(arch);

        // Radiant Apex Keystone Gem
        const keystoneMat = makeMat({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.9,
          roughness: 0.1,
          metalness: 0.4,
          flatShading: true
        });
        const keystone = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), keystoneMat);
        keystone.position.set(0, 3.12, 0);
        group.add(keystone);

        // 4. Dual-Layer Swirling Cosmic Event Horizon
        const vortexGeo = new THREE.CircleGeometry(0.88, 32);
        const vortexMat = isGhost
          ? new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: ghostOpacity })
          : new THREE.MeshStandardMaterial({
            color: 0xc084fc,
            emissive: 0x9333ea,
            emissiveIntensity: 0.92,
            roughness: 0.2,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.92
          });
        const vortex = new THREE.Mesh(vortexGeo, vortexMat);
        vortex.position.y = 2.05;
        vortex.name = 'vortexDisc';
        group.add(vortex);

        if (!isGhost) {
          // Inner glowing stardust core
          const innerMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.75,
            side: THREE.DoubleSide
          });
          const vortexInner = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24), innerMat);
          vortexInner.position.set(0, 2.05, 0.01);
          vortexInner.name = 'vortexInner';
          group.add(vortexInner);
        }
      } else if (type === 'rock') {
        // Sculpted Moss Crag with Geode Crystal Fracture
        // 1. Multi-tiered Slate Rock Crag
        const rockMat = makeMat({ color: 0x475569, roughness: 0.92, flatShading: true });
        const mainCrag = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8, 1), rockMat);
        mainCrag.position.set(0, 0.52, 0);
        mainCrag.scale.set(1.18, 0.88, 0.95);
        mainCrag.castShadow = !isGhost;
        mainCrag.receiveShadow = !isGhost;
        group.add(mainCrag);

        // 2. Beveled Moss Top Cap
        const mossMat = makeMat({ color: 0x15803d, roughness: 0.82, flatShading: true });
        const mossCap = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65, 1), mossMat);
        mossCap.position.set(0.08, 0.86, -0.05);
        mossCap.scale.set(1.05, 0.35, 0.95);
        mossCap.castShadow = !isGhost;
        group.add(mossCap);

        // 3. Geode Crystal Spikes Sprouting from Fracture
        if (!isGhost) {
          const gemMat = new THREE.MeshStandardMaterial({
            color: 0x34d399,
            emissive: 0x10b981,
            emissiveIntensity: 0.85,
            roughness: 0.2,
            flatShading: true
          });
          const g1 = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.55, 5), gemMat);
          g1.position.set(-0.38, 0.65, 0.32);
          g1.rotation.z = 0.48;
          g1.rotation.y = 0.2;

          const g2 = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.42, 5), gemMat);
          g2.position.set(-0.25, 0.52, 0.42);
          g2.rotation.z = 0.35;
          g2.rotation.x = 0.3;
          group.add(g1, g2);
        }

        // 4. Companion River Pebbles
        const p1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38, 0), rockMat);
        p1.position.set(0.68, 0.22, 0.35);
        p1.castShadow = !isGhost;

        const p2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 0), rockMat);
        p2.position.set(-0.55, 0.15, -0.42);
        p2.castShadow = !isGhost;
        group.add(p1, p2);
      } else if (type === 'flower') {
        // Cluster of Enchanted Star-Blossoms with Gentle Sway
        // 1. Moss Mound Base
        const moundMat = makeMat({ color: 0x166534, roughness: 0.85, flatShading: true });
        const mound = new THREE.Mesh(new THREE.DodecahedronGeometry(0.48, 1), moundMat);
        mound.position.set(0, 0.08, 0);
        mound.scale.set(1.15, 0.3, 1.05);
        mound.castShadow = !isGhost;
        group.add(mound);

        // 2. Multi-stem Star Blooms
        const stemMat = makeMat({ color: 0x059669, roughness: 0.8 });
        const flowerColors = [
          { color: 0xf43f5e, emissive: 0xe11d48 }, // Magenta
          { color: 0x38bdf8, emissive: 0x0284c7 }, // Cyan
          { color: 0xfde047, emissive: 0xf59e0b }, // Golden Star
          { color: 0xc084fc, emissive: 0x9333ea }  // Violet
        ];

        const bloomsGroup = new THREE.Group();
        bloomsGroup.name = 'flowerBlooms';
        group.add(bloomsGroup);

        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2 + 0.2;
          const dist = 0.28 + (i % 2) * 0.14;
          const h = 0.45 + (i % 3) * 0.18;
          const colorDef = flowerColors[i % flowerColors.length];

          const bloomMat = makeMat({
            color: colorDef.color,
            emissive: colorDef.emissive,
            emissiveIntensity: 0.8,
            roughness: 0.25,
            flatShading: true
          });

          // Graceful stem
          const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, h, 6), stemMat);
          stem.position.set(Math.cos(a) * dist, h / 2 + 0.05, Math.sin(a) * dist);
          stem.rotation.z = (Math.random() - 0.5) * 0.25;
          stem.castShadow = !isGhost;

          // Star blossom head (double cone / diamond)
          const blossom = new THREE.Mesh(new THREE.OctahedronGeometry(0.13, 0), bloomMat);
          blossom.position.set(stem.position.x, h + 0.1, stem.position.z);
          blossom.scale.set(1.0, 0.8, 1.0);
          blossom.castShadow = !isGhost;

          bloomsGroup.add(stem, blossom);
        }
      } else if (type === 'lantern') {
        // Ornate Brass Starlight Lamp Post
        const brassMat = makeMat({
          color: 0xd97706,
          roughness: 0.35,
          metalness: 0.65,
          flatShading: true
        });

        // 1. Stepped Pedestal Base
        const base1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.12, 8), brassMat);
        base1.position.y = 0.06;
        const base2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 0.18, 8), brassMat);
        base2.position.y = 0.2;
        group.add(base1, base2);

        // 2. Slender Fluted Lamp Post
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.075, 1.8, 8), brassMat);
        post.position.y = 1.1;
        post.castShadow = !isGhost;
        group.add(post);

        // 3. Ornate Crook Bracket Arm
        const armH = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.48, 6), brassMat);
        armH.position.set(0.18, 1.95, 0);
        armH.rotation.z = Math.PI / 2.2;
        group.add(armH);

        // 4. Hexagonal Lantern Cage
        const cageGeo = new THREE.CylinderGeometry(0.14, 0.18, 0.32, 6);
        const cageMat = makeMat({
          color: 0x78350f,
          roughness: 0.4,
          metalness: 0.5,
          wireframe: false
        });
        const cage = new THREE.Mesh(cageGeo, cageMat);
        cage.position.set(0.38, 1.68, 0);
        cage.castShadow = !isGhost;
        group.add(cage);

        // Peaked Lantern Cap
        const cap = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.18, 6), brassMat);
        cap.position.set(0.38, 1.92, 0);
        group.add(cap);

        // 5. Twinkling 3D Star Core
        const starMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
        const starCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.1, 0), starMat);
        starCore.position.set(0.38, 1.68, 0);
        starCore.name = 'starCore';
        group.add(starCore);
      }

      return group;
    }

    /**
     * Set up user interactions:
     * - Mouse/Touch orbit drag & zoom
     * - Raycasting hover & click on island
     * - Object selection, rotation, deletion
     * - HUD button clicks & keyboard shortcuts
     */
    setupEventListeners() {
      // 1. Canvas Pointer Events (Orbit / Click / Drag Object)
      const onPointerDown = (e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return; // Left click only
        this.orbit.isDragging = true;
        this.orbit.lastPointerX = e.clientX;
        this.orbit.lastPointerY = e.clientY;
        this.orbit.dragDistance = 0;
        this.canvas.style.cursor = 'grabbing';

        // Check if pointer hit an existing object directly
        if (this.currentMode === 'select' || e.altKey) {
          const hitObject = this.raycastPlacedObjects(e);
          if (hitObject) {
            this.selectObject(hitObject);
            this.isDraggingObject = true;
          }
        }
      };

      const onPointerMove = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        if (this.orbit.isDragging) {
          const deltaX = e.clientX - this.orbit.lastPointerX;
          const deltaY = e.clientY - this.orbit.lastPointerY;
          this.orbit.lastPointerX = e.clientX;
          this.orbit.lastPointerY = e.clientY;
          this.orbit.dragDistance += Math.abs(deltaX) + Math.abs(deltaY);

          // If dragging an object across island
          if (this.isDraggingObject && this.selectedObject) {
            const groundHit = this.raycastGround();
            if (groundHit) {
              const localPt = this.islandGroup.worldToLocal(groundHit.point.clone());
              this.selectedObject.group.position.set(localPt.x, 0, localPt.z);
              if (this.selectionRing) {
                this.selectionRing.position.set(localPt.x, 0.02, localPt.z);
              }
            }
          } else {
            // Orbit camera rotation
            this.orbit.targetTheta -= deltaX * 0.007;
            this.orbit.targetPhi = Math.max(
              this.orbit.minPhi,
              Math.min(this.orbit.maxPhi, this.orbit.targetPhi + deltaY * 0.007)
            );
          }
        } else {
          // Hover update for ghost placement
          this.updateGhostPlacement();
        }
      };

      const onPointerUp = (e) => {
        this.canvas.style.cursor = 'grab';
        if (this.isDraggingObject) {
          this.isDraggingObject = false;
          this.orbit.isDragging = false;
          this.saveStateToStorage();
          return;
        }

        // If it was a click (not a camera drag)
        if (this.orbit.isDragging && this.orbit.dragDistance < 6) {
          this.handleCanvasClick(e);
        }

        this.orbit.isDragging = false;
      };

      // 2. Wheel Zoom
      const onWheel = (e) => {
        e.preventDefault();
        const zoomDelta = e.deltaY * 0.015;
        this.orbit.targetRadius = Math.max(
          this.orbit.minRadius,
          Math.min(this.orbit.maxRadius, this.orbit.targetRadius + zoomDelta)
        );
      };

      // 3. Touch Pinch Zoom
      const onTouchMove = (e) => {
        if (e.touches.length === 2) {
          const dx = e.touches[0].clientX - e.touches[1].clientX;
          const dy = e.touches[0].clientY - e.touches[1].clientY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (this.orbit.touchDistStart > 0) {
            const diff = this.orbit.touchDistStart - dist;
            this.orbit.targetRadius = Math.max(
              this.orbit.minRadius,
              Math.min(this.orbit.maxRadius, this.orbit.targetRadius + diff * 0.04)
            );
          }
          this.orbit.touchDistStart = dist;
        }
      };

      const onTouchEnd = () => {
        this.orbit.touchDistStart = 0;
      };

      this.canvas.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      this.canvas.addEventListener('wheel', onWheel, { passive: false });
      this.canvas.addEventListener('touchmove', onTouchMove, { passive: true });
      this.canvas.addEventListener('touchend', onTouchEnd, { passive: true });

      // Store cleanup references
      this._eventCleanups = [
        () => this.canvas.removeEventListener('pointerdown', onPointerDown),
        () => window.removeEventListener('pointermove', onPointerMove),
        () => window.removeEventListener('pointerup', onPointerUp),
        () => this.canvas.removeEventListener('wheel', onWheel),
        () => this.canvas.removeEventListener('touchmove', onTouchMove),
        () => this.canvas.removeEventListener('touchend', onTouchEnd)
      ];

      // 4. Window Resize Observer
      window.addEventListener('resize', this.boundResizeHandler);

      // 5. HUD Controls
      this.setupHUDListeners();

      // 6. Keyboard Shortcuts
      const onKeyDown = (e) => {
        if (!this.container || this.container.offsetParent === null) return;
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (this.selectedObject) {
            e.preventDefault();
            this.deleteSelectedObject();
          }
        } else if (e.key === 'r' || e.key === 'R') {
          if (this.selectedObject) {
            this.rotateSelectedObject();
          }
        } else if (e.key === 'Escape') {
          this.deselectObject();
          this.setMode('place');
        } else if (e.key >= '1' && e.key <= '7') {
          const idx = parseInt(e.key, 10) - 1;
          if (PALETTE_ITEMS[idx]) {
            this.selectPaletteTool(PALETTE_ITEMS[idx].id);
          }
        }
      };
      window.addEventListener('keydown', onKeyDown);
      this._eventCleanups.push(() => window.removeEventListener('keydown', onKeyDown));
    }

    /**
     * Attaches click handlers to HUD buttons
     */
    setupHUDListeners() {
      // Palette item select buttons
      this.container.querySelectorAll('.palette-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const tool = btn.dataset.tool;
          if (tool === 'select') {
            this.setMode('select');
          } else {
            this.selectPaletteTool(tool);
          }
        });
      });

      // Preset pills
      this.container.querySelectorAll('.preset-pill-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.setPreset(btn.dataset.preset);
        });
      });

      // Quick action buttons
      const resetViewBtn = this.container.querySelector('#ds-btn-reset-view');
      if (resetViewBtn) {
        resetViewBtn.addEventListener('click', () => this.resetCameraView());
      }

      const helpBtn = this.container.querySelector('#ds-btn-help');
      const guideOverlay = this.container.querySelector('#dreamscape-guide-overlay');
      if (helpBtn && guideOverlay) {
        helpBtn.addEventListener('click', () => {
          guideOverlay.style.display = 'flex';
          guideOverlay.style.opacity = '1';
        });
      }

      const startBuildingBtn = this.container.querySelector('#ds-btn-start-building');
      if (startBuildingBtn && guideOverlay) {
        startBuildingBtn.addEventListener('click', () => {
          guideOverlay.style.display = 'none';
          localStorage.setItem('lumi_ds_guide_seen', 'true');
          if (window.dreamAudio && typeof window.dreamAudio.playUnlockSound === 'function') {
            window.dreamAudio.playUnlockSound();
          }
        });
      }

      const saveBtn = this.container.querySelector('#ds-btn-save');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          this.saveStateToStorage();
          this.showContextToast('💾 Dreamscape Saved into Stardust Storage!');
          if (window.dreamAudio && typeof window.dreamAudio.playChime === 'function') {
            window.dreamAudio.playChime('C6');
          }
        });
      }

      const clearBtn = this.container.querySelector('#ds-btn-clear');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (confirm('Reset your dreamscape to the starter island layout?')) {
            this.resetToStarterIsland();
          }
        });
      }

      // Island Theme Toggle
      const themeBtn = this.container.querySelector('#ds-btn-theme-toggle');
      if (themeBtn) {
        themeBtn.addEventListener('click', () => {
          const themes = Object.keys(ISLAND_THEMES);
          const nextIdx = (themes.indexOf(this.currentIslandThemeKey) + 1) % themes.length;
          this.setIslandTheme(themes[nextIdx]);
        });
      }

      // Selected Object Actions in Context Bar
      const rotBtn = this.container.querySelector('#ds-btn-rotate-sel');
      if (rotBtn) {
        rotBtn.addEventListener('click', () => this.rotateSelectedObject());
      }

      const delBtn = this.container.querySelector('#ds-btn-delete-sel');
      if (delBtn) {
        delBtn.addEventListener('click', () => this.deleteSelectedObject());
      }

      const deselBtn = this.container.querySelector('#ds-btn-deselect');
      if (deselBtn) {
        deselBtn.addEventListener('click', () => this.deselectObject());
      }
    }

    /**
     * Handles clicking on the 3D canvas (Place item or Select item)
     */
    handleCanvasClick(e) {
      if (this.currentMode === 'select') {
        const hit = this.raycastPlacedObjects(e);
        if (hit) {
          this.selectObject(hit);
        } else {
          this.deselectObject();
        }
        return;
      }

      // 'place' mode: place currently selected palette item on island
      const groundHit = this.raycastGround();
      if (!groundHit) return;

      const localPt = this.islandGroup.worldToLocal(groundHit.point.clone());
      const distFromCenter = Math.sqrt(localPt.x * localPt.x + localPt.z * localPt.z);
      if (distFromCenter > ISLAND_RADIUS * 0.95) {
        this.showContextToast('⚠️ Outside island bounds! Click on the grass surface.');
        return;
      }

      // Place object
      this.placeObject(this.selectedTool, localPt.x, localPt.z);
      if (window.dreamAudio && typeof window.dreamAudio.playChime === 'function') {
        window.dreamAudio.playChime('E5');
      }
    }

    placeObject(type, x, z, rotY = 0, scale = 1, save = true) {
      const model = this.generateModel(type, false);
      model.position.set(x, 0, z);
      model.rotation.y = rotY || (Math.random() * Math.PI * 2);

      const safeScale = (scale && scale >= 0.4) ? scale : 1.0;
      model.scale.set(safeScale, safeScale, safeScale);

      this.islandGroup.add(model);

      const objRecord = {
        id: 'ds_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        type,
        group: model,
        x,
        z,
        rotY: model.rotation.y,
        scale: safeScale
      };

      this.placedObjects.push(objRecord);
      this.updateItemCountUI();

      if (save) {
        this.saveStateToStorage();
      }

      return objRecord;
    }

    /**
     * Raycasts against island ground mesh
     */
    raycastGround() {
      if (!this.groundMesh || !this.camera) return null;
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const hits = this.raycaster.intersectObject(this.groundMesh, false);
      return hits.length > 0 ? hits[0] : null;
    }

    /**
     * Raycasts against placed objects
     */
    raycastPlacedObjects(e) {
      if (!this.placedObjects.length || !this.camera) return null;
      const rect = this.canvas.getBoundingClientRect();
      const p = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      this.raycaster.setFromCamera(p, this.camera);

      // Collect all child meshes from placed objects
      const meshCandidates = [];
      this.placedObjects.forEach(obj => {
        obj.group.traverse(child => {
          if (child.isMesh && child !== this.ghostRing && child !== this.selectionRing) {
            child.userData.parentRecord = obj;
            meshCandidates.push(child);
          }
        });
      });

      const hits = this.raycaster.intersectObjects(meshCandidates, false);
      if (hits.length > 0 && hits[0].object.userData.parentRecord) {
        return hits[0].object.userData.parentRecord;
      }
      return null;
    }

    /**
     * Updates position of ghost preview and placement ring on hover
     */
    updateGhostPlacement() {
      if (this.currentMode !== 'place' || !this.ghostMesh) {
        if (this.ghostRing) this.ghostRing.visible = false;
        if (this.ghostMesh) this.ghostMesh.visible = false;
        return;
      }

      const groundHit = this.raycastGround();
      if (!groundHit) {
        this.ghostRing.visible = false;
        this.ghostMesh.visible = false;
        return;
      }

      const localPt = this.islandGroup.worldToLocal(groundHit.point.clone());
      const dist = Math.sqrt(localPt.x * localPt.x + localPt.z * localPt.z);
      const isValid = dist <= ISLAND_RADIUS * 0.95;

      this.ghostRing.visible = true;
      this.ghostRing.position.set(localPt.x, 0.02, localPt.z);
      this.ghostRing.material.color.setHex(isValid ? 0x38bdf8 : 0xef4444);

      this.ghostMesh.visible = isValid;
      if (isValid) {
        this.ghostMesh.position.set(localPt.x, 0, localPt.z);
      }
    }

    /**
     * Selects a placed object and reveals context actions in HUD
     */
    selectObject(objRecord) {
      this.selectedObject = objRecord;
      if (this.selectionRing) {
        this.selectionRing.visible = true;
        this.selectionRing.position.set(objRecord.group.position.x, 0.02, objRecord.group.position.z);
      }

      // Update context bar in HUD
      const bar = this.container.querySelector('#dreamscape-context-bar');
      const label = this.container.querySelector('#ds-selected-label');
      if (bar) bar.style.display = 'flex';
      if (label) {
        const itemDef = PALETTE_ITEMS.find(p => p.id === objRecord.type);
        label.textContent = itemDef ? `${itemDef.icon} ${itemDef.name}` : objRecord.type;
      }

      if (window.dreamAudio && typeof window.dreamAudio.playTap === 'function') {
        window.dreamAudio.playTap();
      }
    }

    /**
     * Deselects current active object
     */
    deselectObject() {
      this.selectedObject = null;
      if (this.selectionRing) this.selectionRing.visible = false;

      const bar = this.container.querySelector('#dreamscape-context-bar');
      if (bar) bar.style.display = 'none';
    }

    /**
     * Rotates currently selected object by 45 degrees
     */
    rotateSelectedObject() {
      if (!this.selectedObject) return;
      this.selectedObject.group.rotation.y += Math.PI / 4;
      this.selectedObject.rotY = this.selectedObject.group.rotation.y;
      this.saveStateToStorage();
      if (window.dreamAudio && typeof window.dreamAudio.playTap === 'function') {
        window.dreamAudio.playTap();
      }
    }

    /**
     * Deletes selected object with an animated shrink & pop
     */
    deleteSelectedObject() {
      if (!this.selectedObject) return;
      const target = this.selectedObject;
      this.deselectObject();

      // Shrink out
      const startScale = target.group.scale.clone();
      const startTime = performance.now();
      const shrinkDuration = 200;

      const animateShrink = (now) => {
        const progress = Math.min((now - startTime) / shrinkDuration, 1);
        target.group.scale.copy(startScale).multiplyScalar(1 - progress);
        if (progress < 1) {
          requestAnimationFrame(animateShrink);
        } else {
          if (target.group.parent) {
            target.group.parent.remove(target.group);
          }
          this.disposeHierarchy(target.group);
          this.placedObjects = this.placedObjects.filter(o => o.id !== target.id);
          this.updateItemCountUI();
          this.saveStateToStorage();
        }
      };
      requestAnimationFrame(animateShrink);

      if (window.dreamAudio && typeof window.dreamAudio.playChime === 'function') {
        window.dreamAudio.playChime('A4');
      }
    }

    /**
     * Changes active tool or switch between Place/Select mode
     */
    selectPaletteTool(toolId) {
      this.selectedTool = toolId;
      this.setMode('place');
      this.deselectObject();

      // Update palette button active styles
      this.container.querySelectorAll('.palette-item-btn').forEach(btn => {
        const isMatch = btn.dataset.tool === toolId;
        btn.classList.toggle('active', isMatch);
        btn.style.background = isMatch
          ? 'linear-gradient(135deg, #ec4899, #a855f7)'
          : 'rgba(255,255,255,0.06)';
        btn.style.borderColor = isMatch ? '#f472b6' : 'transparent';
      });

      this.updateGhostMesh();
      this.updateContextHintText();

      if (window.dreamAudio && typeof window.dreamAudio.playTap === 'function') {
        window.dreamAudio.playTap();
      }
    }

    /**
     * Sets Mode: 'place' or 'select'
     */
    setMode(mode) {
      this.currentMode = mode;
      const selectBtn = this.container.querySelector('[data-tool="select"]');
      if (selectBtn) {
        const isSel = mode === 'select';
        selectBtn.classList.toggle('active', isSel);
        selectBtn.style.background = isSel
          ? 'linear-gradient(135deg, #a855f7, #6366f1)'
          : 'rgba(255,255,255,0.06)';
        selectBtn.style.borderColor = isSel ? '#c084fc' : 'transparent';
      }

      if (mode === 'select') {
        if (this.ghostRing) this.ghostRing.visible = false;
        if (this.ghostMesh) this.ghostMesh.visible = false;
        this.showContextToast('✋ Select Mode: Tap any placed object on the island to rotate or move it.');
      } else {
        this.updateGhostMesh();
        this.updateContextHintText();
      }
    }

    /**
     * Updates context hint message
     */
    updateContextHintText() {
      // Hint text removed per user preference
    }

    /**
     * Switches celestial lighting & sky preset
     */
    setPreset(presetKey) {
      const preset = PRESETS[presetKey];
      if (!preset) return;
      this.currentPresetKey = presetKey;

      // Update preset buttons in HUD
      this.container.querySelectorAll('.preset-pill-btn').forEach(btn => {
        const isMatch = btn.dataset.preset === presetKey;
        btn.classList.toggle('active', isMatch);
        btn.style.background = isMatch
          ? 'linear-gradient(135deg, #c084fc, #ec4899)'
          : 'rgba(255,255,255,0.08)';
      });

      // Update Three.js lights & fog
      if (this.scene) {
        this.scene.fog.color.setHex(preset.fogColor);
        this.scene.fog.density = preset.fogDensity;
      }
      if (this.ambientLight) {
        this.ambientLight.color.setHex(preset.ambientColor);
        this.ambientLight.intensity = preset.ambientIntensity;
      }
      if (this.hemiLight && preset.hemiSky !== undefined) {
        this.hemiLight.color.setHex(preset.hemiSky);
        this.hemiLight.groundColor.setHex(preset.hemiGround);
        this.hemiLight.intensity = preset.hemiIntensity;
      }
      if (this.bottomLight) {
        this.bottomLight.color.setHex(preset.sunColor);
      }
      if (this.sunLight) {
        this.sunLight.color.setHex(preset.sunColor);
        this.sunLight.intensity = preset.sunIntensity;
        this.sunLight.position.set(...preset.sunPos);
      }
      if (this.stardustPoints) {
        this.stardustPoints.material.color.setHex(preset.particleColor);
      }

      // Update background canvas gradient
      this.canvas.style.background = `linear-gradient(180deg, ${preset.skyGradient[0]} 0%, ${preset.skyGradient[1]} 55%, ${preset.skyGradient[2]} 100%)`;

      this.saveStateToStorage();

      if (window.dreamAudio && typeof window.dreamAudio.playChime === 'function') {
        window.dreamAudio.playChime('C6');
      }
    }

    /**
     * Switches island terrain theme
     */
    setIslandTheme(themeKey) {
      const theme = ISLAND_THEMES[themeKey];
      if (!theme) return;
      this.currentIslandThemeKey = themeKey;

      if (this.groundMesh && this.groundMesh.material) {
        this.groundMesh.material.color.setHex(theme.color);
        this.groundMesh.material.roughness = theme.roughness;
        this.groundMesh.material.metalness = theme.metalness;
      }

      const label = this.container.querySelector('#ds-theme-label');
      if (label) label.textContent = theme.name;

      this.saveStateToStorage();

      if (window.dreamAudio && typeof window.dreamAudio.playTap === 'function') {
        window.dreamAudio.playTap();
      }
    }

    /**
     * Resets camera to default isometric viewing angle
     */
    resetCameraView() {
      this.orbit.targetTheta = 0.95;
      this.orbit.targetPhi = 0.96;
      this.orbit.targetRadius = 18.5;
      if (window.dreamAudio && typeof window.dreamAudio.playTap === 'function') {
        window.dreamAudio.playTap();
      }
    }

    /**
     * Resets island to clean starter arrangement
     */
    resetToStarterIsland() {
      this.deselectObject();
      this.clearAllPlacedObjects();

      DEFAULT_STARTER_OBJECTS.forEach(item => {
        this.placeObject(item.type, item.x, item.z, item.rotY, item.scale, false);
      });

      this.saveStateToStorage();
      this.showContextToast('✨ Island reset to starter arrangement!');
      if (window.dreamAudio && typeof window.dreamAudio.playUnlockSound === 'function') {
        window.dreamAudio.playUnlockSound();
      }
    }

    /**
     * Clears all placed items from scene
     */
    clearAllPlacedObjects() {
      this.placedObjects.forEach(obj => {
        if (obj.group.parent) obj.group.parent.remove(obj.group);
        this.disposeHierarchy(obj.group);
      });
      this.placedObjects = [];
      this.updateItemCountUI();
    }

    /**
     * Updates object count in HUD
     */
    updateItemCountUI() {
      const countEl = this.container.querySelector('#dreamscape-item-count');
      if (countEl) {
        countEl.textContent = `${this.placedObjects.length} Objects Placed`;
      }
    }

    /**
     * Shows a brief floating toast message in context bar
     */
    showContextToast(msg) {
      let toast = this.container.querySelector('#ds-floating-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'ds-floating-toast';
        toast.style.cssText = `
          position:absolute;top:54px;left:50%;transform:translateX(-50%);
          background:rgba(10,14,39,0.92);backdrop-filter:blur(10px);
          border:1px solid rgba(253,224,71,0.5);border-radius:20px;
          padding:6px 14px;color:#fde047;font-size:0.75rem;font-weight:600;
          box-shadow:0 6px 20px rgba(0,0,0,0.5);pointer-events:none;
          transition:opacity 0.3s ease;z-index:10;
        `;
        this.container.appendChild(toast);
      }
      toast.textContent = msg;
      toast.style.opacity = '1';
      if (this._toastTimer) clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => {
        if (toast) toast.style.opacity = '0';
      }, 2400);
    }

    /**
     * Serializes scene state to localStorage
     */
    saveStateToStorage() {
      try {
        const payload = {
          version: 3,
          preset: this.currentPresetKey,
          theme: this.currentIslandThemeKey,
          objects: this.placedObjects.map(o => ({
            type: o.type,
            x: parseFloat(o.group.position.x.toFixed(3)),
            z: parseFloat(o.group.position.z.toFixed(3)),
            rotY: parseFloat(o.group.rotation.y.toFixed(3)),
            scale: o.scale ? parseFloat(o.scale.toFixed(3)) : 1.0
          }))
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        console.warn('Dreamscape save failed:', e);
      }
    }

    /**
     * Restores scene state from localStorage or loads default starter arrangement
     */
    loadSavedState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (data && Array.isArray(data.objects) && data.objects.length > 0) {
            if (data.preset && PRESETS[data.preset]) this.setPreset(data.preset);
            if (data.theme && ISLAND_THEMES[data.theme]) this.setIslandTheme(data.theme);

            data.objects.forEach(item => {
              this.placeObject(item.type, item.x, item.z, item.rotY, item.scale, false);
            });
            return;
          }
        }
      } catch (e) {
        console.warn('Could not restore saved Dreamscape:', e);
      }

      // Default: Load starter island
      this.resetToStarterIsland();
      this.setPreset('day');
    }

    /**
     * Smoothly updates camera coordinates from orbit spherical parameters
     */
    updateCameraFromOrbit() {
      // Lerp damping
      this.orbit.radius += (this.orbit.targetRadius - this.orbit.radius) * 0.12;
      this.orbit.theta += (this.orbit.targetTheta - this.orbit.theta) * 0.12;
      this.orbit.phi += (this.orbit.targetPhi - this.orbit.phi) * 0.12;

      const x = this.orbit.radius * Math.sin(this.orbit.phi) * Math.sin(this.orbit.theta);
      const y = this.orbit.radius * Math.cos(this.orbit.phi);
      const z = this.orbit.radius * Math.sin(this.orbit.phi) * Math.cos(this.orbit.theta);

      this.camera.position.set(x, y, z);
      this.camera.lookAt(this.orbit.targetLookAt);
    }

    /**
     * Main 60fps Animation Loop
     */
    animate() {
      this.animationFrameId = requestAnimationFrame(() => this.animate());

      const time = this.clock ? this.clock.getElapsedTime() : performance.now() * 0.001;

      // 1. Smooth Camera Orbit
      this.updateCameraFromOrbit();

      // 2. Slow gentle island breathing bob
      if (this.islandGroup) {
        this.islandGroup.position.y = Math.sin(time * 0.8) * 0.08;
      }

      // 3. Slowly revolve drifting clouds
      if (this.cloudsGroup) {
        this.cloudsGroup.children.forEach(cloud => {
          const d = cloud.userData;
          if (d) {
            d.baseAngle += d.speed * 0.15;
            cloud.position.x = Math.cos(d.baseAngle) * d.baseR;
            cloud.position.z = Math.sin(d.baseAngle) * d.baseR;
            cloud.position.y = d.baseY + Math.sin(time + d.baseAngle) * 0.15;
          }
        });
      }

      // 4. Floating crystals bobbing & rotating
      if (this.crystalsGroup) {
        this.crystalsGroup.children.forEach(shard => {
          const d = shard.userData;
          if (d) {
            shard.position.y = d.baseY + Math.sin(time * 1.5 + d.phase) * 0.22;
            shard.rotation.y += d.rotSpeed;
          }
        });
      }

      // 5. Stardust particles subtle drift
      if (this.stardustPoints) {
        this.stardustPoints.rotation.y = time * 0.02;
      }

      // 6. Micro-animations on placed objects
      this.placedObjects.forEach(obj => {
        if (obj.type === 'portal') {
          const vortex = obj.group.getObjectByName('vortexDisc');
          if (vortex) {
            vortex.rotation.z = time * 1.8;
          }
          const vortexInner = obj.group.getObjectByName('vortexInner');
          if (vortexInner) {
            vortexInner.rotation.z = -time * 2.2;
          }
        } else if (obj.type === 'crystal') {
          const shard = obj.group.getObjectByName('floatingShard');
          if (shard) {
            const baseY = (shard.userData && shard.userData.baseY) || 2.65;
            shard.position.y = baseY + Math.sin(time * 2.2 + obj.x) * 0.1;
            shard.rotation.y = time * 1.4;
          }
        } else if (obj.type === 'flower') {
          const blooms = obj.group.getObjectByName('flowerBlooms');
          if (blooms) {
            blooms.rotation.z = Math.sin(time * 1.8 + obj.x) * 0.04;
          }
        } else if (obj.type === 'lantern') {
          const starCore = obj.group.getObjectByName('starCore');
          if (starCore) {
            starCore.rotation.y = time * 2.0;
            starCore.rotation.x = Math.sin(time * 2.0) * 0.18;
          }
        }
      });

      // 7. Pulse selection ring
      if (this.selectionRing && this.selectionRing.visible) {
        const pulse = 1 + Math.sin(time * 5) * 0.06;
        this.selectionRing.scale.set(pulse, pulse, pulse);
      }

      // 8. Render
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    }

    /**
     * Resizes renderer and camera projection on viewport change
     */
    onResize() {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight || 520;
      if (width === 0 || height === 0) return;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }

    /**
     * Recursively disposes Three.js Object3D hierarchies to free WebGL memory
     */
    disposeHierarchy(root) {
      if (!root) return;
      root.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    }

    /**
     * Teardown method to stop animation loop and cleanly release resources
     */
    destroy() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      window.removeEventListener('resize', this.boundResizeHandler);

      if (this._eventCleanups && this._eventCleanups.length) {
        this._eventCleanups.forEach(cleanup => {
          try { cleanup(); } catch (e) { }
        });
        this._eventCleanups = [];
      }

      if (this.scene) {
        this.disposeHierarchy(this.scene);
      }

      if (this.renderer) {
        this.renderer.dispose();
        if (this.renderer.domElement && this.renderer.domElement.parentNode) {
          this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        this.renderer = null;
      }

      this.scene = null;
      this.camera = null;
      this.canvas = null;
      this.placedObjects = [];
      this.selectedObject = null;
      this.isInitialized = false;
    }
  }

  // Export singleton instance on window object
  window.DreamscapeCreator = new DreamscapeCreatorApp();
})();
