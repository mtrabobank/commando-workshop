/**
 * Shield Power-Up
 * Grants temporary invincibility to player
 */

import { PowerUp, PowerUpType } from './PowerUp';
import Phaser from 'phaser';

export class Shield extends PowerUp {
  private duration: number = 8000; // 8 seconds of invincibility

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'powerup-shield', PowerUpType.SHIELD);
  }

  /**
   * Apply shield effect - grant temporary invincibility
   */
  apply(player: any): void {
    player.activateInvincibility(this.duration, this.scene.time.now);
    this.createCollectionEffect();
  }
}
