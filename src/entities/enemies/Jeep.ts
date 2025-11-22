/**
 * Jeep Enemy
 * Fast vehicle that performs sweeping horizontal attacks
 * Takes 2 hits to destroy
 */

import Phaser from 'phaser';
import { Enemy } from './Enemy';
import { EnemyType } from '../../types';
import { JEEP_SPEED_MIN, JEEP_SPEED_MAX, JEEP_HEALTH } from '../../config/GameConfig';

export class Jeep extends Enemy {
  private direction: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const speed = Phaser.Math.Between(JEEP_SPEED_MIN, JEEP_SPEED_MAX);
    super(scene, x, y, 'jeep', speed, JEEP_HEALTH, EnemyType.JEEP);

    this.sprite.setScale(1.3);

    // Random initial direction (left or right bias)
    this.direction = Math.random() > 0.5 ? 1 : -1;
  }

  /**
   * Jeep AI: Move toward player with horizontal sweeping motion
   * Changes direction periodically for unpredictable movement
   */
  updateMovement(playerX: number, playerY: number, delta: number): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    if (!body) return; // Safety check - body must exist

    // Calculate base angle to player
    const toPlayerAngle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      playerX,
      playerY
    );

    // Add horizontal bias for sweeping motion
    const horizontalBias = this.direction * Math.PI / 3;
    const finalAngle = toPlayerAngle + horizontalBias;

    body.setVelocity(
      Math.cos(finalAngle) * this.speed,
      Math.sin(finalAngle) * this.speed
    );

    // Randomly change direction after 2 seconds
    if (this.updateTimer > 2000 && Math.random() < 0.01) {
      this.direction *= -1;
      this.updateTimer = 0;
    }
  }
}
