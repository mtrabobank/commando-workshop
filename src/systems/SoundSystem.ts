/**
 * Sound System
 * Manages all game audio including sound effects and volume control
 * Single Responsibility: Audio playback and management
 *
 * Note: Currently using procedurally generated sounds via Web Audio API
 * Can be easily extended to load actual audio files later
 */

import Phaser from 'phaser';

export class SoundSystem {
  private scene: Phaser.Scene;
  private audioContext: AudioContext | null = null;
  private masterVolume: number = 0.3; // 30% volume to avoid being too loud
  private enabled: boolean = true;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    // Initialize Web Audio Context for procedural sounds
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported, sound disabled');
      this.enabled = false;
    }
  }

  /**
   * Play shooting sound - short, sharp beep
   */
  playShootSound(): void {
    if (!this.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime); // High pitch

    gainNode.gain.setValueAtTime(this.masterVolume * 0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }

  /**
   * Play grenade throw sound - whoosh sound
   */
  playGrenadeThrowSound(): void {
    if (!this.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(this.masterVolume * 0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }

  /**
   * Play explosion sound - loud boom
   */
  playExplosionSound(): void {
    if (!this.enabled || !this.audioContext) return;

    const ctx = this.audioContext;

    // Create noise for explosion
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(this.masterVolume * 0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + 0.3);
  }

  /**
   * Play enemy death sound - descending tone
   */
  playEnemyDeathSound(): void {
    if (!this.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(300, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(this.masterVolume * 0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  /**
   * Play power-up collection sound - rising arpeggio
   */
  playPowerUpSound(): void {
    if (!this.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + index * 0.05;
      gainNode.gain.setValueAtTime(this.masterVolume * 0.15, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.1);
    });
  }

  /**
   * Play player hit sound - harsh buzz
   */
  playPlayerHitSound(): void {
    if (!this.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);

    gainNode.gain.setValueAtTime(this.masterVolume * 0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }

  /**
   * Play player death sound - dramatic descending sequence
   */
  playPlayerDeathSound(): void {
    if (!this.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const frequencies = [440, 349, 261, 196]; // A4, F4, C4, G3

    frequencies.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + 0.15);

      const startTime = ctx.currentTime + index * 0.15;
      gainNode.gain.setValueAtTime(this.masterVolume * 0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.15);
    });
  }

  /**
   * Play victory sound - triumphant ascending notes
   */
  playVictorySound(): void {
    if (!this.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const melody = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    melody.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + index * 0.1;
      const duration = index === melody.length - 1 ? 0.4 : 0.15;

      gainNode.gain.setValueAtTime(this.masterVolume * 0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  }

  /**
   * Play game over sound - descending ominous notes
   */
  playGameOverSound(): void {
    if (!this.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const melody = [392.00, 349.23, 293.66, 261.63]; // G4, F4, D4, C4

    melody.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + index * 0.15;
      const duration = index === melody.length - 1 ? 0.5 : 0.2;

      gainNode.gain.setValueAtTime(this.masterVolume * 0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  }

  /**
   * Set master volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Toggle sound on/off
   */
  toggleSound(): void {
    this.enabled = !this.enabled;
  }

  /**
   * Check if sound is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Cleanup audio context
   */
  destroy(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
