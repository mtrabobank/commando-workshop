/**
 * Grenade Pack Power-Up
 * Gives player additional grenades
 */

import { PowerUp, PowerUpType } from './PowerUp';
import Phaser from 'phaser';

export class GrenadePack extends PowerUp {
  private grenadeCount: number = 5; // How many grenades to add

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'powerup-grenades', PowerUpType.GRENADE_PACK);
  }

  /**
   * Apply grenade pack effect - add grenades to player
   */
  apply(player: any): void {
    player.addGrenades(this.grenadeCount);
    this.createCollectionEffect();
  }
}
