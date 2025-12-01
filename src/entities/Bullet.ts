/**
 * Bullet Entity
 * Represents player projectiles that move upward
 */

import Phaser from 'phaser';
import { BULLET_SPEED } from '../config/GameConfig';

export class Bullet {
  private sprite: Phaser.GameObjects.Sprite;
  private speed: number = BULLET_SPEED;

  constructor(scene: Phaser.Scene, x: number, y: number, dx: number, dy: number) {
    this.sprite = scene.add.sprite(x, y, 'bullet');
    // Stretch bullet for horizontal/diagonal shots
    if (dx !== 0 && dy === 0) {
      this.sprite.setScale(2.2, 1.0); // Horizontal
    } else if (dx !== 0 && dy !== 0) {
      this.sprite.setScale(1.8, 1.0); // Diagonal
    } else {
      this.sprite.setScale(1.5, 1.0); // Vertical
    }

    scene.physics.add.existing(this.sprite);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    // Normalize direction for consistent speed
    const mag = Math.sqrt(dx * dx + dy * dy);
    const ndx = mag === 0 ? 0 : dx / mag;
    const ndy = mag === 0 ? -1 : dy / mag; // Default to up if no direction
    body.setVelocity(ndx * this.speed, ndy * this.speed);

    // Rotate bullet to match direction
    if (mag !== 0) {
      const angle = Math.atan2(ndy, ndx); // Radians
      this.sprite.setRotation(angle - Math.PI / 2); // Phaser's up is -90deg
    } else {
      this.sprite.setRotation(-Math.PI / 2); // Default up
    }
  }

  /**
   * Check if bullet has moved off-screen (should be cleaned up)
   */
  isOffScreen(): boolean {
    return this.sprite.y < -20;
  }

  /**
   * Destroy the bullet sprite
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
}
