/**
 * Bullet Entity
 * Represents player projectiles that move upward
 */

import Phaser from 'phaser';
import { BULLET_SPEED } from '../config/GameConfig';

export class Bullet {
  private sprite: Phaser.GameObjects.Sprite;
  private speed: number = BULLET_SPEED;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.add.sprite(x, y, 'bullet');
    this.sprite.setScale(1.5);

    scene.physics.add.existing(this.sprite);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(-this.speed);
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
