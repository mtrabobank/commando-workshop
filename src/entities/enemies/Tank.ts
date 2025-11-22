/**
 * Tank Enemy
 * Slow, heavily armored enemy that tracks player directly
 * Takes 3 hits to destroy
 */

import Phaser from 'phaser';
import { Enemy } from './Enemy';
import { EnemyType } from '../../types';
import { TANK_SPEED, TANK_HEALTH } from '../../config/GameConfig';

export class Tank extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'tank', TANK_SPEED, TANK_HEALTH, EnemyType.TANK);
    this.sprite.setScale(1.5);
  }

  /**
   * Tank AI: Move slowly and steadily toward player
   * Rotates turret to face player
   */
  updateMovement(playerX: number, playerY: number, delta: number): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    if (!body) return; // Safety check - body must exist

    // Calculate angle to player
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      playerX,
      playerY
    );

    // Move toward player
    body.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );

    // Rotate tank to face movement direction
    this.sprite.rotation = angle + Math.PI / 2;
  }
}
