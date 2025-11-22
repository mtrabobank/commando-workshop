/**
 * Weapon Upgrade Power-Up
 * Temporarily increases fire rate and bullet spread
 */

import { PowerUp, PowerUpType } from './PowerUp';
import Phaser from 'phaser';

export class WeaponUpgrade extends PowerUp {
  private fireRateMultiplier: number = 0.5; // Fire twice as fast (50% fire rate = faster)
  private duration: number = 15000; // 15 seconds

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'powerup-weapon', PowerUpType.WEAPON_UPGRADE);
  }

  /**
   * Apply weapon upgrade effect - increase fire rate
   */
  apply(player: any): void {
    player.activateWeaponUpgrade(this.fireRateMultiplier, this.duration, this.scene.time.now);
    this.createCollectionEffect();
  }
}
