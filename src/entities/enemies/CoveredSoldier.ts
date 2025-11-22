/**
 * Covered Soldier Enemy
 * Tactical enemy that alternates between taking cover and advancing
 * Medium speed, medium health - harder to hit when in cover
 */

import Phaser from 'phaser';
import { Enemy } from './Enemy';
import { EnemyType } from '../../types';
import { COVERED_SOLDIER_SPEED, COVERED_SOLDIER_HEALTH, COVERED_SOLDIER_COVER_TIME, COVERED_SOLDIER_EXPOSED_TIME } from '../../config/GameConfig';

export class CoveredSoldier extends Enemy {
  private inCover: boolean = false;
  private coverTimer: number = 0;
  private coverDuration: number = COVERED_SOLDIER_COVER_TIME;
  private exposedDuration: number = COVERED_SOLDIER_EXPOSED_TIME;
  private originalHealth: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy', COVERED_SOLDIER_SPEED, COVERED_SOLDIER_HEALTH, EnemyType.COVERED_SOLDIER);

    this.sprite.setScale(1.15);
    this.sprite.setTint(0x888888); // Gray tint to distinguish
    this.originalHealth = COVERED_SOLDIER_HEALTH;

    // Start in exposed state
    this.coverTimer = 0;
  }

  /**
   * Apply damage to enemy - reduced damage when in cover
   * @returns true if enemy is destroyed, false if still alive
   */
  takeDamage(): boolean {
    if (this.inCover) {
      // 50% chance to avoid damage when in cover
      if (Math.random() < 0.5) {
        return false; // No damage taken
      }
    }

    // Normal damage
    this.health--;
    return this.health <= 0;
  }

  /**
   * Covered Soldier AI: Alternates between cover and movement
   * - In cover: Stays still, reduced hitbox visibility (alpha), harder to hit
   * - Exposed: Moves toward player normally
   */
  updateMovement(playerX: number, playerY: number, delta: number): void {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    if (!body) return; // Safety check - body must exist

    this.coverTimer += delta;

    // Toggle between cover and exposed states
    if (this.inCover) {
      // In cover state
      if (this.coverTimer >= this.coverDuration) {
        // Exit cover
        this.inCover = false;
        this.coverTimer = 0;
        this.sprite.setAlpha(1.0); // Fully visible
        this.sprite.clearTint();
        this.sprite.setTint(0x888888);
      } else {
        // Stay in cover - don't move
        body.setVelocity(0, 0);
        this.sprite.setAlpha(0.5); // Semi-transparent to show covered
      }
    } else {
      // Exposed state
      if (this.coverTimer >= this.exposedDuration) {
        // Take cover
        this.inCover = true;
        this.coverTimer = 0;
        this.sprite.setAlpha(0.5);
        this.sprite.setTint(0x444444); // Darker when in cover
      } else {
        // Move toward player
        const angle = Phaser.Math.Angle.Between(
          this.sprite.x,
          this.sprite.y,
          playerX,
          playerY
        );

        body.setVelocity(
          Math.cos(angle) * this.speed,
          Math.sin(angle) * this.speed
        );

        this.sprite.setAlpha(1.0); // Fully visible when moving
      }
    }
  }
}
