/**
 * Boss Enemy
 * Large, heavily armored enemy with multiple behavior phases
 * High health, moderate speed - changes tactics as health decreases
 */

import Phaser from 'phaser';
import { Enemy } from './Enemy';
import { EnemyType } from '../../types';
import { BOSS_SPEED, BOSS_HEALTH } from '../../config/GameConfig';

export class Boss extends Enemy {
  private phase: number = 1; // Current phase (1-3)
  private maxHealth: number;
  private movementPattern: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'tank', BOSS_SPEED, BOSS_HEALTH, EnemyType.BOSS);

    this.sprite.setScale(3.0); // Much larger than other enemies
    this.sprite.setTint(0xff0000); // Red for boss
    this.maxHealth = BOSS_HEALTH;
  }

  /**
   * Override takeDamage to implement phase transitions
   */
  takeDamage(): boolean {
    this.health--;

    // Phase transitions based on health
    const healthPercent = this.health / this.maxHealth;

    if (healthPercent <= 0.33 && this.phase !== 3) {
      // Phase 3: Critical health - aggressive
      this.phase = 3;
      this.sprite.setTint(0xff00ff); // Purple tint
      this.speed = BOSS_SPEED * 1.5;
    } else if (healthPercent <= 0.66 && this.phase !== 2) {
      // Phase 2: Damaged - faster
      this.phase = 2;
      this.sprite.setTint(0xff6600); // Orange tint
      this.speed = BOSS_SPEED * 1.2;
    }

    return this.health <= 0;
  }

  /**
   * Boss AI: Multi-phase behavior that changes with health
   * Phase 1 (100-66% HP): Slow, predictable movement
   * Phase 2 (66-33% HP): Faster, more erratic
   * Phase 3 (<33% HP): Very aggressive, unpredictable
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

    // Rotate to face player
    this.sprite.rotation = angle + Math.PI / 2;

    let moveAngle = angle;

    // Phase-specific behavior
    switch (this.phase) {
      case 1:
        // Phase 1: Steady approach with slight weaving
        moveAngle += Math.sin(this.updateTimer / 800) * 0.3;
        break;

      case 2:
        // Phase 2: More erratic, alternating charges and retreats
        if (Math.sin(this.updateTimer / 1500) > 0) {
          // Charge toward player
          moveAngle = angle;
        } else {
          // Circle around player
          moveAngle = angle + Math.PI / 2;
        }
        break;

      case 3:
        // Phase 3: Aggressive, unpredictable lunges
        const distance = Phaser.Math.Distance.Between(
          this.sprite.x,
          this.sprite.y,
          playerX,
          playerY
        );

        if (distance > 200) {
          // Lunge toward player when far
          moveAngle = angle;
        } else {
          // Spin around when close
          moveAngle = angle + (this.updateTimer / 100);
        }
        break;
    }

    // Apply movement
    body.setVelocity(
      Math.cos(moveAngle) * this.speed,
      Math.sin(moveAngle) * this.speed
    );
  }
}
