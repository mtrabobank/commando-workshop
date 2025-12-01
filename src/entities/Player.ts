/**
 * Player Entity - MINIMAL WORKING VERSION
 * Simplest possible keyboard implementation
 */

import Phaser from 'phaser';
import { Bullet } from './Bullet';
import { Grenade } from './Grenade';
import {
  PLAYER_SPEED_PER_FRAME,
  PLAYER_FIRE_RATE,
  PLAYER_SIZE,
  GRENADE_INITIAL_COUNT,
  SCREEN_WIDTH,
  SCREEN_HEIGHT
} from '../config/GameConfig';

export class Player {
  private sprite: Phaser.GameObjects.Sprite;
  private scene: Phaser.Scene;

  private readonly boundaryMargin: number = 20;

  // Keyboard - created once
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  // Shooting
  private lastFired: number = 0;


  // Grenades
  private grenadeCount: number = GRENADE_INITIAL_COUNT;
  private lastGrenadeThrow: number = 0;
  private readonly grenadeThrowRate: number = 300;

  // State
  private isInvincible: boolean = false;
  private invincibilityEndTime: number = 0;

  // Power-ups
  private speedBoostActive: boolean = false;
  private speedBoostEndTime: number = 0;
  private speedBoostMultiplier: number = 1.0;
  private baseSpeed: number = PLAYER_SPEED_PER_FRAME;

  private weaponUpgradeActive: boolean = false;
  private weaponUpgradeEndTime: number = 0;
  private weaponUpgradeMultiplier: number = 1.0;
  private baseFireRate: number = PLAYER_FIRE_RATE;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;

    // Create sprite
    this.sprite = scene.add.sprite(x, y, 'player');
    this.sprite.setScale(0.6);
    this.sprite.setDepth(10);

    // Physics for collision only
    scene.physics.add.existing(this.sprite);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(PLAYER_SIZE.width, PLAYER_SIZE.height);
    body.setOffset(8, 10);
    body.setAllowGravity(false);
    body.setCollideWorldBounds(true);

    // Create keyboard keys ONCE - simplest possible way
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }
  }

  /**
   * Update player - SIMPLEST POSSIBLE IMPLEMENTATION
   */
  update(time: number): void {
    this.updateInvincibility(time);
    this.updatePowerUps(time);
    this.updateMovement();
  }

  private updateInvincibility(time: number): void {
    if (this.isInvincible) {
      if (time >= this.invincibilityEndTime) {
        this.isInvincible = false;
        this.sprite.setAlpha(1);
        this.sprite.clearTint();
      } else {
        this.sprite.setAlpha(Math.sin(time / 100) * 0.5 + 0.5);
      }
    }
  }

  /**
   * Update power-up timers
   */
  private updatePowerUps(time: number): void {
    // Speed boost timer
    if (this.speedBoostActive && time >= this.speedBoostEndTime) {
      this.speedBoostActive = false;
      this.speedBoostMultiplier = 1.0;
      this.sprite.clearTint();
    }

    // Weapon upgrade timer
    if (this.weaponUpgradeActive && time >= this.weaponUpgradeEndTime) {
      this.weaponUpgradeActive = false;
      this.weaponUpgradeMultiplier = 1.0;
    }

    // Visual indicator for speed boost (cyan tint)
    if (this.speedBoostActive && !this.isInvincible) {
      this.sprite.setTint(0x00ffff);
    }

    // Visual indicator for weapon upgrade (red tint)
    if (this.weaponUpgradeActive && !this.isInvincible && !this.speedBoostActive) {
      this.sprite.setTint(0xff6600);
    }
  }

  /**
   * Movement - using Arcade Physics velocity
   */
  private updateMovement(): void {
    if (this.isDead || !this.cursors || !this.keyW) return;

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;

    let vx = 0;
    let vy = 0;

    // Apply speed boost if active
    // 3 pixels/frame * 60 fps = 180 pixels/sec
    const speedPerSec = this.baseSpeed * 60;
    const currentSpeed = speedPerSec * this.speedBoostMultiplier;

    // Check keys using .isDown
    if (this.cursors.left.isDown || this.keyA.isDown) vx -= currentSpeed;
    if (this.cursors.right.isDown || this.keyD.isDown) vx += currentSpeed;
    if (this.cursors.up.isDown || this.keyW.isDown) vy -= currentSpeed;
    if (this.cursors.down.isDown || this.keyS.isDown) vy += currentSpeed;

    // Diagonal normalization
    if (vx !== 0 && vy !== 0) {
      vx *= 0.707;
      vy *= 0.707;
    }

    body.setVelocity(vx, vy);

    // Boundaries - clamp position to keep player on screen
    // We do this to prevent the player from leaving the screen area
    const x = Phaser.Math.Clamp(this.sprite.x, this.boundaryMargin, SCREEN_WIDTH - this.boundaryMargin);
    const y = Phaser.Math.Clamp(this.sprite.y, this.boundaryMargin, SCREEN_HEIGHT - this.boundaryMargin);

    if (this.sprite.x !== x || this.sprite.y !== y) {
      this.sprite.setPosition(x, y);
    }
  }

  shoot(time: number, dx: number = 0, dy: number = -1): Bullet | null {
    // Apply weapon upgrade to fire rate if active
    const currentFireRate = this.baseFireRate * this.weaponUpgradeMultiplier;

    if (time > this.lastFired + currentFireRate) {
      this.lastFired = time;
      // Calculate spawn offset based on direction
      let offsetX = 0;
      let offsetY = 0;
      const spriteWidth = this.sprite.displayWidth || 32;
      const spriteHeight = this.sprite.displayHeight || 32;
      if (dx !== 0 && dy === 0) {
        // Horizontal only
        offsetX = dx * (spriteWidth / 2 + 8); // 8px extra for visual separation
        offsetY = 0;
      } else if (dx !== 0 && dy !== 0) {
        // Diagonal
        offsetX = dx * (spriteWidth / 2 + 6);
        offsetY = dy * (spriteHeight / 2 + 6);
      } else {
        // Vertical only
        offsetX = 0;
        offsetY = -spriteHeight / 2 - 8;
      }
      return new Bullet(this.scene, this.sprite.x + offsetX, this.sprite.y + offsetY, dx, dy);
    }
    return null;
  }

  throwGrenade(time: number): Grenade | null {
    if (this.grenadeCount > 0 && time > this.lastGrenadeThrow + this.grenadeThrowRate) {
      this.lastGrenadeThrow = time;
      this.grenadeCount--;
      return new Grenade(this.scene, this.sprite.x, this.sprite.y - 10);
    }
    return null;
  }

  getGrenadeCount(): number {
    return this.grenadeCount;
  }

  addGrenades(count: number): void {
    this.grenadeCount += count;
  }

  setGrenadeCount(count: number): void {
    this.grenadeCount = count;
  }

  getIsDead(): boolean {
    return this.isDead;
  }

  getIsInvincible(): boolean {
    return this.isInvincible;
  }

  activateInvincibility(duration: number, currentTime: number): void {
    this.isInvincible = true;
    this.invincibilityEndTime = currentTime + duration;
  }

  respawn(x: number, y: number, time: number, invincibilityDuration: number): void {
    this.reset();
    this.sprite.setPosition(x, y);
    this.activateInvincibility(invincibilityDuration, time);
  }

  getSprite(): Phaser.GameObjects.Sprite {
    return this.sprite;
  }

  getX(): number {
    return this.sprite.x;
  }

  getY(): number {
    return this.sprite.y;
  }

  destroy(): void {
    if (this.sprite) {
      this.sprite.destroy();
    }
  }

  /**
   * Activate speed boost power-up
   */
  activateSpeedBoost(multiplier: number, duration: number, currentTime: number): void {
    this.speedBoostActive = true;
    this.speedBoostMultiplier = multiplier;
    this.speedBoostEndTime = currentTime + duration;
  }

  /**
   * Activate weapon upgrade power-up
   */
  activateWeaponUpgrade(multiplier: number, duration: number, currentTime: number): void {
    this.weaponUpgradeActive = true;
    this.weaponUpgradeMultiplier = multiplier;
    this.weaponUpgradeEndTime = currentTime + duration;
  }

  private isDead: boolean = false;

  /**
   * Play death animation
   * Returns a promise that resolves when animation is complete
   */
  playDeathAnimation(): Promise<void> {
    this.isDead = true;

    // Stop physics
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.enable = false;

    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.sprite,
        angle: 360 * 2, // Spin 2 times
        alpha: 0,
        scale: 0.1,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => {
          this.sprite.setVisible(false);
          resolve();
        }
      });
    });
  }

  /**
   * Reset player state for respawn
   */
  reset(): void {
    this.isDead = false;
    this.sprite.setVisible(true);
    this.sprite.setAlpha(1);
    this.sprite.setScale(0.6);
    this.sprite.setAngle(0);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.enable = true;
  }
}
