/**
 * LUMI PURE FULLSCREEN INTRO VIDEO
 * Plays assets/intro_final.mp4 in pure edge-to-edge fullscreen mode when site is opened.
 * No UI overlays, no buttons, no borders.
 * When video finishes (or user taps/presses Escape), it smoothly fades out and opens the site.
 */

(function () {
  'use strict';

  function initIntroGate() {
    const gate = document.getElementById('site-intro-gate');
    const video = document.getElementById('gate-video');
    if (!gate || !video) return;

    let isClosed = false;

    function closeIntroGate() {
      if (isClosed) return;
      isClosed = true;

      if (video) video.pause();

      gate.classList.add('gate-closing');
      document.body.style.overflow = '';

      if (window.dreamAudio && typeof window.dreamAudio.playUnlockSound === 'function') {
        window.dreamAudio.playUnlockSound();
      }

      setTimeout(() => {
        gate.classList.add('gate-hidden');
      }, 500);
    }

    function openIntroGate() {
      isClosed = false;
      gate.classList.remove('gate-hidden', 'gate-closing');
      document.body.style.overflow = 'hidden';

      if (video) {
        video.currentTime = 0;
        const p = video.play();
        if (p !== undefined) {
          p.catch(() => {
            video.muted = true;
            video.play();
          });
        }
      }
    }

    // Expose globally
    window.openIntroGate = openIntroGate;
    window.closeIntroGate = closeIntroGate;

    // Lock page scroll while intro is playing
    document.body.style.overflow = 'hidden';

    // Attempt unmuted playback first
    video.muted = false;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Browser autoplay policy requires user gesture for sound -> start muted
        video.muted = true;
        video.play().catch(() => {});
      });
    }

    // Unmute on first click/touch if it started muted
    const handleFirstInteraction = () => {
      if (video.muted) {
        video.muted = false;
      }
    };
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    // When video ends -> Smoothly reveal site
    video.addEventListener('ended', () => {
      closeIntroGate();
    });

    // Top-Right Skip Button Click
    const skipBtn = document.getElementById('gate-skip-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeIntroGate();
      });
    }

    // Double-click on video or press Escape / Enter to skip
    video.addEventListener('dblclick', () => {
      closeIntroGate();
    });

    window.addEventListener('keydown', (e) => {
      if (!isClosed && (e.key === 'Escape' || e.key === 'Enter')) {
        closeIntroGate();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntroGate);
  } else {
    initIntroGate();
  }
})();
