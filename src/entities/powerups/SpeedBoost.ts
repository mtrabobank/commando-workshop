/**
 * Speed Boost Power-Up
 * Temporarily increases player movement speed
 */

import { PowerUp, PowerUpType } from './PowerUp';
import Phaser from 'phaser';

export class SpeedBoost extends PowerUp {
  private speedMultiplier: number = 1.5; // 50% faster
  private duration: number = 10000; // 10 seconds

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'powerup-speed', PowerUpType.SPEED_BOOST);
  }

  /**
   * Apply speed boost effect - temporarily increase player speed
   */
  apply(player: any): void {
    player.activateSpeedBoost(this.speedMultiplier, this.duration, this.scene.time.now);
    this.createCollectionEffect();
  }
}
