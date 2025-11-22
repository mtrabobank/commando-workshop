/**
 * Bunker Enemy
 * Stationary defensive structure - doesn't move but has high health
 * Acts as an obstacle that must be destroyed to progress
 */

import Phaser from 'phaser';
import { Enemy } from './Enemy';
import { EnemyType } from '../../types';
import { BUNKER_HEALTH } from '../../config/GameConfig';

export class Bunker extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Speed is 0 since bunkers don't move
    super(scene, x, y, 'tank', 0, BUNKER_HEALTH, EnemyType.BUNKER);

    this.sprite.setScale(2.0); // Larger than other enemies
    this.sprite.setTint(0x666666); // Dark gray for bunker appearance
  }

  /**
   * Bunker AI: Stationary - just rotates to track player
   * - Does not move from spawn position
   * - Rotates turret to face player
   * - Acts as defensive obstacle
   */
  updateMovement(playerX: number, playerY: number, delta: number): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    if (!body) return; // Safety check - body must exist

    // Stay completely still
    body.setVelocity(0, 0);

    // Rotate to track player (visual feedback only)
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      playerX,
      playerY
    );

    this.sprite.rotation = angle + Math.PI / 2;
  }

  /**
   * Override isOffScreen to never despawn bunkers that scroll off bottom
   * Bunkers should only be destroyed by player damage, not by scrolling
   */
  isOffScreen(): boolean {
    // Only despawn if scrolled way off top or sides
    return (
      this.sprite.y < -100 ||
      this.sprite.x > 900 ||
      this.sprite.x < -100
    );
  }
}
