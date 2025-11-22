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
  private readonly speed: number = PLAYER_SPEED_PER_FRAME;
  private readonly boundaryMargin: number = 20;

  // Keyboard - created once
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  // Shooting
  private lastFired: number = 0;
  private readonly fireRate: number = PLAYER_FIRE_RATE;

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
    body.setImmovable(true);

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
   * Movement - using stored key objects (created once in constructor)
   */
  private updateMovement(): void {
    if (!this.cursors || !this.keyW) return;

    let x = this.sprite.x;
    let y = this.sprite.y;
    let dx = 0;
    let dy = 0;

    // Apply speed boost if active
    const currentSpeed = this.baseSpeed * this.speedBoostMultiplier;

    // Check keys using .isDown - keys were created ONCE in constructor
    if (this.cursors.left.isDown || this.keyA.isDown) dx -= currentSpeed;
    if (this.cursors.right.isDown || this.keyD.isDown) dx += currentSpeed;
    if (this.cursors.up.isDown || this.keyW.isDown) dy -= currentSpeed;
    if (this.cursors.down.isDown || this.keyS.isDown) dy += currentSpeed;

    // Diagonal normalization
    if (dx !== 0 && dy !== 0) {
      dx *= 0.707;
      dy *= 0.707;
    }

    x += dx;
    y += dy;

    // Boundaries
    x = Phaser.Math.Clamp(x, this.boundaryMargin, SCREEN_WIDTH - this.boundaryMargin);
    y = Phaser.Math.Clamp(y, this.boundaryMargin, SCREEN_HEIGHT - this.boundaryMargin);

    this.sprite.setPosition(x, y);
  }

  shoot(time: number): Bullet | null {
    // Apply weapon upgrade to fire rate if active
    const currentFireRate = this.baseFireRate * this.weaponUpgradeMultiplier;

    if (time > this.lastFired + currentFireRate) {
      this.lastFired = time;
      return new Bullet(this.scene, this.sprite.x, this.sprite.y - 25);
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

  getIsInvincible(): boolean {
    return this.isInvincible;
  }

  activateInvincibility(duration: number, currentTime: number): void {
    this.isInvincible = true;
    this.invincibilityEndTime = currentTime + duration;
  }

  respawn(x: number, y: number, time: number, invincibilityDuration: number): void {
    this.sprite.setPosition(x, y);
    this.activateInvincibility(invincibilityDuration, time);
    this.sprite.setAlpha(1);
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
}
