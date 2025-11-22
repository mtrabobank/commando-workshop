/**
 * Rocket Launcher Enemy
 * Long-range enemy that maintains distance from player
 * Slow movement, medium health - dangerous from afar
 */

import Phaser from 'phaser';
import { Enemy } from './Enemy';
import { EnemyType } from '../../types';
import { ROCKET_LAUNCHER_SPEED, ROCKET_LAUNCHER_HEALTH, ROCKET_LAUNCHER_MIN_DISTANCE } from '../../config/GameConfig';

export class RocketLauncher extends Enemy {
  private minDistance: number = ROCKET_LAUNCHER_MIN_DISTANCE;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'tank', ROCKET_LAUNCHER_SPEED, ROCKET_LAUNCHER_HEALTH, EnemyType.ROCKET_LAUNCHER);

    this.sprite.setScale(1.3);
    this.sprite.setTint(0x00ff00); // Green tint to distinguish from tanks
  }

  /**
   * Rocket Launcher AI: Maintain distance from player while tracking
   * - Moves away if player gets too close (kiting behavior)
   * - Stays at optimal firing range
   * - Rotates to face player
   */
  updateMovement(playerX: number, playerY: number, delta: number): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    if (!body) return; // Safety check - body must exist

    // Calculate distance to player
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      playerX,
      playerY
    );

    // Calculate angle to player
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      playerX,
      playerY
    );

    // Rotate to face player
    this.sprite.rotation = angle + Math.PI / 2;

    // Movement behavior based on distance
    if (distance < this.minDistance) {
      // Too close - retreat (move away from player)
      const retreatAngle = angle + Math.PI; // Opposite direction
      body.setVelocity(
        Math.cos(retreatAngle) * this.speed,
        Math.sin(retreatAngle) * this.speed
      );
    } else if (distance > this.minDistance + 100) {
      // Too far - advance slowly
      body.setVelocity(
        Math.cos(angle) * (this.speed * 0.5),
        Math.sin(angle) * (this.speed * 0.5)
      );
    } else {
      // At optimal range - strafe sideways
      const strafeAngle = angle + Math.PI / 2 + (Math.sin(this.updateTimer / 1000) * Math.PI);
      body.setVelocity(
        Math.cos(strafeAngle) * (this.speed * 0.7),
        Math.sin(strafeAngle) * (this.speed * 0.7)
      );
    }
  }
}
