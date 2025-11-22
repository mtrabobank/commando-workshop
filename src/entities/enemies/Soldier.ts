/**
 * Soldier Enemy
 * Basic enemy that moves toward player with varied movement patterns
 */

import Phaser from 'phaser';
import { Enemy } from './Enemy';
import { EnemyType } from '../../types';
import { SOLDIER_SPEED_MIN, SOLDIER_SPEED_MAX, SOLDIER_HEALTH } from '../../config/GameConfig';

export class Soldier extends Enemy {
  private movePattern: number;
  private randomOffset: { x: number; y: number };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const speed = Phaser.Math.Between(SOLDIER_SPEED_MIN, SOLDIER_SPEED_MAX);
    super(scene, x, y, 'enemy', speed, SOLDIER_HEALTH, EnemyType.SOLDIER);

    this.sprite.setScale(1.2);

    // Choose movement pattern (0-1)
    this.movePattern = Math.random();

    // Random target offset for variety
    this.randomOffset = {
      x: Phaser.Math.Between(-50, 50),
      y: Phaser.Math.Between(-30, 30)
    };
  }

  /**
   * Soldier AI: Move toward player with pattern variation
   * - Pattern 1 (30%): Zigzag approach
   * - Pattern 2 (30%): Direct approach
   * - Pattern 3 (40%): Random drift
   */
  updateMovement(playerX: number, playerY: number, delta: number): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    if (!body) return; // Safety check - body must exist

    // Calculate direction to player with random offset
    const targetX = playerX + this.randomOffset.x;
    const targetY = playerY + this.randomOffset.y;

    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      targetX,
      targetY
    );

    // Apply pattern variation
    let adjustedAngle = angle;
    if (this.movePattern < 0.3) {
      // Zigzag pattern
      adjustedAngle += Math.sin(this.updateTimer / 500) * 0.5;
    } else if (this.movePattern < 0.6) {
      // Straight toward player
      // Keep angle as is
    } else {
      // Random drift
      adjustedAngle += Math.sin(this.updateTimer / 300) * 0.3;
    }

    body.setVelocity(
      Math.cos(adjustedAngle) * this.speed,
      Math.sin(adjustedAngle) * this.speed
    );
  }
}
