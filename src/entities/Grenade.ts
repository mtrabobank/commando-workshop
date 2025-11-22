/**
 * Grenade Entity
 * Represents a thrown grenade with arc physics and explosion mechanics
 *
 * Responsibilities:
 * - Arc trajectory simulation (parabolic motion)
 * - Timed explosion after landing/delay
 * - Provide explosion position and radius for collision detection
 *
 * Design Pattern: Entity with physics-based behavior
 */

import Phaser from 'phaser';
import {
  GRENADE_THROW_SPEED,
  GRENADE_GRAVITY,
  GRENADE_EXPLOSION_RADIUS,
  GRENADE_EXPLOSION_DELAY,
  GRENADE_ARC_ANGLE,
  SCREEN_HEIGHT,
  SCREEN_WIDTH
} from '../config/GameConfig';

export class Grenade {
  private sprite: Phaser.GameObjects.Sprite;
  private scene: Phaser.Scene;
  private explosionRadius: number = GRENADE_EXPLOSION_RADIUS;
  private throwTime: number;
  private hasExploded: boolean = false;
  private shouldDestroy: boolean = false;

  /**
   * Create a new grenade projectile
   * @param scene - The Phaser scene
   * @param x - Starting X position (player position)
   * @param y - Starting Y position (player position)
   * @param targetX - Mouse/target X position for throw direction
   * @param targetY - Mouse/target Y position for throw direction
   */
  constructor(scene: Phaser.Scene, x: number, y: number, targetX?: number, targetY?: number) {
    this.scene = scene;
    this.throwTime = scene.time.now;

    // Create grenade sprite
    this.sprite = scene.add.sprite(x, y, 'grenade');
    this.sprite.setScale(1.2);

    // Add physics
    scene.physics.add.existing(this.sprite);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;

    // Calculate throw direction
    // If no target specified, throw upward (default behavior)
    if (targetX === undefined || targetY === undefined) {
      // Default: throw straight up with arc
      const radians = Phaser.Math.DegToRad(GRENADE_ARC_ANGLE);
      body.setVelocity(0, Math.sin(radians) * GRENADE_THROW_SPEED);
    } else {
      // Throw toward target with arc
      const angle = Phaser.Math.Angle.Between(x, y, targetX, targetY);
      const vx = Math.cos(angle) * GRENADE_THROW_SPEED;
      const vy = Math.sin(angle) * GRENADE_THROW_SPEED;
      body.setVelocity(vx, vy);
    }

    // Apply gravity for arc effect
    body.setGravityY(GRENADE_GRAVITY);

    // Add visual rotation for effect
    scene.tweens.add({
      targets: this.sprite,
      angle: 360,
      duration: 500,
      repeat: -1
    });
  }

  /**
   * Update grenade state
   * Checks for explosion timing and cleanup
   */
  update(): void {
    const elapsedTime = this.scene.time.now - this.throwTime;

    // Check if grenade should explode
    if (!this.hasExploded && elapsedTime >= GRENADE_EXPLOSION_DELAY) {
      this.explode();
    }

    // Mark for destruction after explosion animation
    if (this.hasExploded && this.shouldDestroy) {
      this.destroy();
    }
  }

  /**
   * Trigger grenade explosion
   * Creates visual effect and marks for damage detection
   */
  private explode(): void {
    this.hasExploded = true;

    // Create explosion visual effect (handled by scene)
    // The explosion detection will be handled by CollisionSystem

    // Schedule destruction after brief delay for visual effect
    this.scene.time.delayedCall(100, () => {
      this.shouldDestroy = true;
    });
  }

  /**
   * Check if grenade is off screen (cleanup)
   */
  isOffScreen(): boolean {
    return (
      this.sprite.y > SCREEN_HEIGHT + 50 ||
      this.sprite.y < -50 ||
      this.sprite.x < -50 ||
      this.sprite.x > SCREEN_WIDTH + 50
    );
  }

  /**
   * Check if grenade should be destroyed
   */
  shouldBeDestroyed(): boolean {
    return this.shouldDestroy || this.isOffScreen();
  }

  /**
   * Check if grenade has exploded
   */
  isExploded(): boolean {
    return this.hasExploded;
  }

  /**
   * Get explosion radius for collision detection
   */
  getExplosionRadius(): number {
    return this.explosionRadius;
  }

  /**
   * Get grenade sprite for rendering/physics
   */
  getSprite(): Phaser.GameObjects.Sprite {
    return this.sprite;
  }

  /**
   * Get grenade X position
   */
  getX(): number {
    return this.sprite.x;
  }

  /**
   * Get grenade Y position
   */
  getY(): number {
    return this.sprite.y;
  }

  /**
   * Clean up grenade sprite and physics
   */
  destroy(): void {
    if (this.sprite) {
      this.sprite.destroy();
    }
  }
}
