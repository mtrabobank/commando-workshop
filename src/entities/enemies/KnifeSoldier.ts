/**
 * Knife Soldier Enemy
 * Fast melee enemy that rushes directly toward the player
 * High speed, low health - dangerous at close range
 */

import Phaser from 'phaser';
import { Enemy } from './Enemy';
import { EnemyType } from '../../types';
import { KNIFE_SOLDIER_SPEED_MIN, KNIFE_SOLDIER_SPEED_MAX, KNIFE_SOLDIER_HEALTH } from '../../config/GameConfig';

export class KnifeSoldier extends Enemy {
  private rushMultiplier: number = 1.0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const speed = Phaser.Math.Between(KNIFE_SOLDIER_SPEED_MIN, KNIFE_SOLDIER_SPEED_MAX);
    super(scene, x, y, 'enemy', speed, KNIFE_SOLDIER_HEALTH, EnemyType.KNIFE_SOLDIER);

    this.sprite.setScale(1.1);
    this.sprite.setTint(0xff3333); // Red tint to distinguish from normal soldiers
  }

  /**
   * Knife Soldier AI: Rush directly at player with increasing speed as they get closer
   * - Moves in straight line toward player
   * - Increases speed when within close range (danger zone)
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

    // Speed up when close to player (within 150 pixels)
    if (distance < 150) {
      this.rushMultiplier = 1.5; // 50% speed boost when close
    } else {
      this.rushMultiplier = 1.0;
    }

    // Calculate direct angle to player
    const angle = Phaser.Math.Angle.Between(
      this.sprite.x,
      this.sprite.y,
      playerX,
      playerY
    );

    // Move directly toward player with rush multiplier
    const effectiveSpeed = this.speed * this.rushMultiplier;
    body.setVelocity(
      Math.cos(angle) * effectiveSpeed,
      Math.sin(angle) * effectiveSpeed
    );

    // Rotate sprite to face player
    this.sprite.rotation = angle + Math.PI / 2;
  }
}
