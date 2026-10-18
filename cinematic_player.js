/**
 * LUMI CINEMATIC INTRO VIDEO PLAYER
 * High-definition Video Controller for Lumi's 30-Second Animated Short:
 * "Lumi — Every Dream Matters"
 * 
 * Replaces procedural canvas engine with the high-definition MP4 video export:
 * - Sequence A (0s – 10s): The Magical Star
 * - Sequence B (10s – 20s): Dream World & The Portal
 * - Sequence C (20s – 30s): Reunion & Restoration
 */

(function () {
  'use strict';

  class LumiCinematicPlayer {
    constructor() {
      this.duration = 30.0;
      this.isDraggingSeek = false;

      // DOM Elements
      this.modal = document.getElementById('modal-intro');
      this.video = document.getElementById('cinematic-video');
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

      // 3 Story Sequences (30.0s Total)
      this.scenes = [
        {
          start: 0.0,
          end: 10.0,
          id: 1,
          name: "Sequence A: The Magical Star",
          title: "The Magical Star",
          tag: "⭐ Sequence A (0s – 10s)",
          caption: "In the quiet dream nebula, Lumi awakens and discovers an adorable magical star floating toward her."
        },
        {
          start: 10.0,
          end: 20.0,
          id: 2,
          name: "Sequence B: Dream World & The Portal",
          title: "Dream World & The Portal",
          tag: "🌀 Sequence B (10s – 20s)",
          caption: "Lumi follows the star across floating islands and waterfalls, discovering an ancient glowing portal."
        },
        {
          start: 20.0,
          end: 30.0,
          id: 3,
          name: "Sequence C: Reunion & Restoration",
          title: "Reunion & Restoration",
          tag: "✨ Sequence C (20s – 30s)",
          caption: "Lumi hugs her star companion, restoring radiant light to the dream world, and smiles at the viewer."
        }
      ];

      this.initVideo();
      this.setupEventListeners();
    }

    initVideo() {
      if (!this.video) return;

      this.video.addEventListener('loadedmetadata', () => {
        if (this.video.duration && !isNaN(this.video.duration)) {
          this.duration = this.video.duration;
          if (this.timelineTrack) {
            this.timelineTrack.setAttribute('aria-valuemax', Math.round(this.duration));
          }
          const totalMins = Math.floor(this.duration / 60);
          const totalSecs = Math.floor(this.duration % 60);
          const totalDisplay = document.getElementById('cinematic-total-time');
          if (totalDisplay) {
            totalDisplay.textContent = `${String(totalMins).padStart(2, '0')}:${String(totalSecs).padStart(2, '0')}`;
          }
        }
      });

      this.video.addEventListener('timeupdate', () => {
        if (!this.isDraggingSeek) {
          this.updateUI(this.video.currentTime);
        }
      });

      this.video.addEventListener('play', () => {
        if (this.playIcon) this.playIcon.hidden = true;
        if (this.pauseIcon) this.pauseIcon.hidden = false;
        if (this.bigPlayBtn) {
          this.bigPlayBtn.classList.remove('visible');
          this.bigPlayBtn.style.display = 'none';
        }
      });

      this.video.addEventListener('pause', () => {
        if (this.playIcon) this.playIcon.hidden = false;
        if (this.pauseIcon) this.pauseIcon.hidden = true;
        if (this.bigPlayBtn && this.video.currentTime < this.duration - 2) {
          this.bigPlayBtn.classList.add('visible');
          this.bigPlayBtn.style.display = 'flex';
        }
      });

      this.video.addEventListener('ended', () => {
        if (this.playIcon) this.playIcon.hidden = false;
        if (this.pauseIcon) this.pauseIcon.hidden = true;
        if (this.welcomeBanner) {
          this.welcomeBanner.classList.add('visible');
          this.welcomeBanner.style.display = 'flex';
          this.welcomeBanner.style.opacity = '1';
        }
      });

      this.video.addEventListener('volumechange', () => {
        const isMuted = this.video.muted || this.video.volume === 0;
        if (this.volOnIcon) this.volOnIcon.hidden = isMuted;
        if (this.volOffIcon) this.volOffIcon.hidden = !isMuted;
      });
    }

    setupEventListeners() {
      // Big play button & video viewport click
      if (this.bigPlayBtn) {
        this.bigPlayBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.play();
        });
      }

      if (this.video) {
        this.video.addEventListener('click', () => this.togglePlayPause());
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

      // Skip button: jumps directly to finale resolution (26.0s)
      if (this.skipBtn) {
        this.skipBtn.addEventListener('click', () => {
          this.seek(Math.max(0, this.duration - 4.0));
          this.play();
        });
      }

      if (this.muteBtn) {
        this.muteBtn.addEventListener('click', () => this.toggleMute());
      }

      // Explore CTA: closes modal and scrolls down to projects
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

      // Close button
      const closeBtn = this.modal ? this.modal.querySelector('.cinematic-close-btn') : null;
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.close();
        });
      }

      // Timeline Scrubber
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

      // Accessible Keyboard Navigation
      window.addEventListener('keydown', (e) => {
        if (!this.modal || this.modal.hidden) return;
        if (e.code === 'Space') {
          e.preventDefault();
          this.togglePlayPause();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.seek(Math.min(this.duration, (this.video ? this.video.currentTime : 0) + 3));
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.seek(Math.max(0, (this.video ? this.video.currentTime : 0) - 3));
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

      if (this.video) {
        this.video.currentTime = 0;
        this.updateUI(0);
        const playPromise = this.video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // If browser blocks unmuted autoplay, mute and retry or show big play button
            this.video.muted = true;
            this.video.play().catch(() => {
              if (this.bigPlayBtn) {
                this.bigPlayBtn.classList.add('visible');
                this.bigPlayBtn.style.display = 'flex';
              }
            });
          });
        }
      }
    }

    close() {
      if (!this.modal) return;
      if (this.video) {
        this.video.pause();
      }
      this.modal.hidden = true;
      document.body.style.overflow = '';
    }

    play() {
      if (!this.video) return;
      this.video.play().catch((err) => {
        console.warn('Video play prevented:', err);
      });
    }

    pause() {
      if (!this.video) return;
      this.video.pause();
    }

    togglePlayPause() {
      if (!this.video) return;
      if (this.video.paused) {
        this.play();
      } else {
        this.pause();
      }
    }

    toggleMute() {
      if (!this.video) return;
      this.video.muted = !this.video.muted;
    }

    seek(time) {
      if (!this.video) return;
      const targetTime = Math.max(0, Math.min(this.duration, time));
      this.video.currentTime = targetTime;
      this.updateUI(targetTime);
    }

    updateUI(time) {
      const pct = (time / this.duration) * 100;
      if (this.timelineFill) this.timelineFill.style.width = `${pct}%`;
      if (this.timelineHandle) this.timelineHandle.style.left = `${pct}%`;
      if (this.timelineTrack) this.timelineTrack.setAttribute('aria-valuenow', Math.floor(time));

      const mins = Math.floor(time / 60);
      const secs = Math.floor(time % 60);
      if (this.timeDisplay) {
        this.timeDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      }

      const activeScene = this.scenes.find(s => time >= s.start && time < s.end) || this.scenes[this.scenes.length - 1];
      if (this.chapterIndicator) this.chapterIndicator.textContent = activeScene.name;
      if (this.sceneTitle) this.sceneTitle.textContent = `Lumi · ${activeScene.title}`;

      // Scene Overlay Caption: shows for the first 3.5 seconds of each sequence
      const sceneElapsed = time - activeScene.start;
      if (this.overlayCard) {
        if (sceneElapsed < 3.5 && time < this.duration - 4.0) {
          const fade = sceneElapsed < 0.6 ? sceneElapsed / 0.6 : (sceneElapsed > 2.8 ? (3.5 - sceneElapsed) / 0.7 : 1);
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

      // Finale Banner: appears in the final 4 seconds with bottom scrim
      if (this.welcomeBanner) {
        const finaleStart = this.duration - 4.0;
        if (time >= finaleStart) {
          this.welcomeBanner.classList.add('visible');
          this.welcomeBanner.style.display = 'flex';
          const bannerOpacity = Math.min(1, (time - finaleStart) / 0.8);
          this.welcomeBanner.style.opacity = bannerOpacity;
        } else {
          this.welcomeBanner.classList.remove('visible');
          this.welcomeBanner.style.display = 'none';
          this.welcomeBanner.style.opacity = 0;
        }
      }
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
