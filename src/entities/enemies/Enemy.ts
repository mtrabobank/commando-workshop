/**
 * Enemy Base Class
 * Abstract base for all enemy types with AI interface
 * Follows Open/Closed Principle - extend for new enemy types
 */

import Phaser from 'phaser';
import { EnemyType } from '../../types';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../config/GameConfig';

export abstract class Enemy {
  protected sprite: Phaser.GameObjects.Sprite;
  protected speed: number;
  protected health: number;
  protected scene: Phaser.Scene;
  protected type: EnemyType;
  protected updateTimer: number = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    speed: number,
    health: number,
    type: EnemyType
  ) {
    this.scene = scene;
    this.speed = speed;
    this.health = health;
    this.type = type;

    this.sprite = scene.add.sprite(x, y, texture);
    scene.physics.add.existing(this.sprite);

    // Configure physics body
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setAllowGravity(false);
    }
  }

  /**
   * Abstract method for enemy-specific AI movement
   * Must be implemented by each enemy subclass
   */
  abstract updateMovement(playerX: number, playerY: number, delta: number): void;

  /**
   * Update enemy state and AI
   */
  update(playerX: number, playerY: number, delta: number): void {
    this.updateTimer += delta;
    this.updateMovement(playerX, playerY, delta);
  }

  /**
   * Apply damage to enemy
   * @returns true if enemy is destroyed, false if still alive
   */
  takeDamage(): boolean {
    this.health--;
    return this.health <= 0;
  }

  /**
   * Check if enemy has moved off-screen (should be cleaned up)
   */
  isOffScreen(): boolean {
    return (
      this.sprite.y > SCREEN_HEIGHT + 60 ||
      this.sprite.y < -60 ||
      this.sprite.x > SCREEN_WIDTH + 60 ||
      this.sprite.x < -60
    );
  }

  /**
   * Destroy the enemy sprite
   */
  destroy(): void {
    this.sprite.destroy();
  }

  /**
   * Get the sprite for physics/rendering
   */
  getSprite(): Phaser.GameObjects.Sprite {
    return this.sprite;
  }

  /**
   * Get enemy type for scoring and identification
   */
  getType(): EnemyType {
    return this.type;
  }
}
