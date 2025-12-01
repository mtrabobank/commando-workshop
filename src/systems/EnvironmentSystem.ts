/**
 * Environment System
 * Manages environmental decorations (trees, rocks, buildings, water)
 * Single Responsibility: Spawn and manage environmental elements
 */

import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT, SCROLL_SPEED } from '../config/GameConfig';

export type EnvironmentType = 'jungle' | 'desert' | 'arctic' | 'urban';

export interface EnvironmentElement {
  sprite: Phaser.GameObjects.Sprite;
  scrollSpeed: number; // Relative to base scroll speed
  collidable: boolean;
}

export class EnvironmentSystem {
  private scene: Phaser.Scene;
  private elements: EnvironmentElement[] = [];
  private spawnTimer: number = 0;
  private spawnInterval: number = 800; // Spawn every 800ms
  private environmentType: EnvironmentType = 'jungle';

  constructor(scene: Phaser.Scene, environmentType: EnvironmentType) {
    this.scene = scene;
    this.environmentType = environmentType;
  }

  /**
   * Update environment system - spawn new elements and scroll existing ones
   */
  update(_time: number, delta: number, scrollSpeed: number = SCROLL_SPEED): void {
    this.spawnTimer += delta;

    // Spawn new elements periodically
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnRandomElement();
    }

    // Update existing elements
    for (let i = this.elements.length - 1; i >= 0; i--) {
      const element = this.elements[i];

      // Scroll the element down
      element.sprite.y += scrollSpeed * element.scrollSpeed * (delta / 1000);

      // Remove if off screen
      if (element.sprite.y > SCREEN_HEIGHT + 100) {
        element.sprite.destroy();
        this.elements.splice(i, 1);
      }
    }
  }

  /**
   * Spawn a random environmental element based on environment type
   */
  private spawnRandomElement(): void {
    const spawnX = Phaser.Math.Between(50, SCREEN_WIDTH - 50);
    const spawnY = -50; // Spawn above screen

    // Determine which elements to spawn based on environment
    const elementType = this.selectElementType();

    if (elementType) {
      const sprite = this.scene.add.sprite(spawnX, spawnY, elementType);
      sprite.setDepth(5); // Behind player and enemies, in front of background
      sprite.setAlpha(0.9); // Slightly transparent

      // Add variation to size
      const scale = Phaser.Math.FloatBetween(0.8, 1.2);
      sprite.setScale(scale);

      // Enable physics and make immovable
      this.scene.physics.add.existing(sprite);
      const body = sprite.body as Phaser.Physics.Arcade.Body;
      body.setImmovable(true);
      body.setAllowGravity(false);
      // Set body size to match sprite size for all elements
      // This ensures the "whole tree" is collidable, including leaves
      body.setSize(sprite.width, sprite.height);
      body.setOffset(0, 0);

      // Mark trees, rocks, buildings, crates as collidable, water as not
      const collidable = elementType !== 'water';
      this.elements.push({
        sprite: sprite,
        scrollSpeed: Phaser.Math.FloatBetween(0.9, 1.1),
        collidable: collidable
      });
    }
  }

  /**
   * Select which element to spawn based on environment type
   */
  private selectElementType(): string | null {
    const random = Math.random();

    switch (this.environmentType) {
      case 'jungle':
        // Jungle: Trees (60%), Rocks (25%), Water (10%), Crates (5%)
        if (random < 0.60) return 'tree';
        if (random < 0.85) return 'rock';
        if (random < 0.95) return 'water';
        return 'crate';

      case 'desert':
        // Desert: Rocks (50%), Buildings (30%), Crates (20%)
        if (random < 0.50) return 'rock';
        if (random < 0.80) return 'building';
        return 'crate';

      case 'arctic':
        // Arctic: Rocks (40%), Buildings (35%), Trees (20%), Crates (5%)
        if (random < 0.40) return 'rock';
        if (random < 0.75) return 'building';
        if (random < 0.95) return 'tree';
        return 'crate';

      case 'urban':
        // Urban: Buildings (70%), Crates (25%), Rocks (5%)
        if (random < 0.70) return 'building';
        if (random < 0.95) return 'crate';
        return 'rock';

      default:
        return 'rock';
    }
  }

  /**
   * Clean up all elements
   */
  destroy(): void {
    this.elements.forEach(element => element.sprite.destroy());
    this.elements = [];
  }

  /**
   * Get all environment elements
   */
  getElements(): EnvironmentElement[] {
    return this.elements;
  }
}
