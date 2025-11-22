/**
 * PowerUp Base Class
 * Abstract base for all collectible power-ups
 * Follows Open/Closed Principle - extend for new power-up types
 *
 * Responsibilities:
 * - Define power-up interface
 * - Handle sprite creation and physics
 * - Manage falling/floating behavior
 * - Define abstract apply() method for power-up effects
 *
 * Single Responsibility: Base behavior for all collectible items
 */

import Phaser from 'phaser';
import { SCREEN_HEIGHT } from '../../config/GameConfig';

export enum PowerUpType {
  GRENADE_PACK = 'GRENADE_PACK',
  SPEED_BOOST = 'SPEED_BOOST',
  SHIELD = 'SHIELD',
  WEAPON_UPGRADE = 'WEAPON_UPGRADE'
}

export abstract class PowerUp {
  protected sprite: Phaser.GameObjects.Sprite;
  protected scene: Phaser.Scene;
  protected type: PowerUpType;
  protected fallSpeed: number = 100; // Pixels per second
  private collected: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    type: PowerUpType
  ) {
    this.scene = scene;
    this.type = type;

    // Create sprite
    this.sprite = scene.add.sprite(x, y, texture);
    this.sprite.setScale(1.2);
    this.sprite.setDepth(5);

    // Add physics for collision detection
    scene.physics.add.existing(this.sprite);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setVelocityY(this.fallSpeed);
      body.setAllowGravity(false);
    }

    // Add floating animation
    scene.tweens.add({
      targets: this.sprite,
      y: y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Add glowing effect
    scene.tweens.add({
      targets: this.sprite,
      alpha: { from: 1, to: 0.6 },
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Abstract method - must be implemented by each power-up type
   * Applies the power-up effect to the player
   */
  abstract apply(player: any): void;

  /**
   * Check if power-up has moved off-screen
   */
  isOffScreen(): boolean {
    return this.sprite.y > SCREEN_HEIGHT + 60;
  }

  /**
   * Mark power-up as collected
   */
  collect(): void {
    this.collected = true;
  }

  /**
   * Check if power-up has been collected
   */
  isCollected(): boolean {
    return this.collected;
  }

  /**
   * Get sprite for collision detection
   */
  getSprite(): Phaser.GameObjects.Sprite {
    return this.sprite;
  }

  /**
   * Get power-up type
   */
  getType(): PowerUpType {
    return this.type;
  }

  /**
   * Destroy power-up sprite and cleanup
   */
  destroy(): void {
    if (this.sprite) {
      this.sprite.destroy();
    }
  }

  /**
   * Create collection effect (particles, sound, etc.)
   */
  protected createCollectionEffect(): void {
    // Flash effect
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      scale: 2,
      duration: 200,
      onComplete: () => this.destroy()
    });

    // TODO: Add particle effect when particle system is available
    // TODO: Add collection sound when sound system is available
  }
}
