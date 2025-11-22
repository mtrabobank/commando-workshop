/**
 * Texture Factory
 * Procedurally generates all game textures
 * Single Responsibility: Texture creation and asset management
 */

import Phaser from 'phaser';

export class TextureFactory {
  /**
   * Create all game textures at once
   */
  static createAllTextures(scene: Phaser.Scene): void {
    // Characters
    this.createPlayerTexture(scene);
    this.createEnemyTexture(scene);
    this.createTankTexture(scene);
    this.createJeepTexture(scene);

    // Projectiles
    this.createBulletTexture(scene);
    this.createGrenadeTexture(scene);
    this.createParticleTexture(scene);

    // Environment
    this.createBackgroundTexture(scene);
    this.createTreeTexture(scene);
    this.createRockTexture(scene);
    this.createBuildingTexture(scene);
    this.createWaterTexture(scene);
    this.createCrateTexture(scene);

    // Power-ups
    this.createGrenadePowerUpTexture(scene);
    this.createSpeedPowerUpTexture(scene);
    this.createShieldPowerUpTexture(scene);
    this.createWeaponPowerUpTexture(scene);
  }

  /**
   * Create player soldier sprite (Super Joe style from Commando)
   * Larger, more detailed sprite matching NES aesthetic
   */
  static createPlayerTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Legs (darker green pants)
    graphics.fillStyle(0x1a5016, 1);
    graphics.fillRect(10, 40, 8, 12);  // Left leg
    graphics.fillRect(22, 40, 8, 12);  // Right leg

    // Boots (black)
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(10, 48, 8, 4);
    graphics.fillRect(22, 48, 8, 4);

    // Body/Torso (light green uniform)
    graphics.fillStyle(0x4a8030, 1);
    graphics.fillRect(12, 24, 16, 18);

    // Belt (brown)
    graphics.fillStyle(0x6b4423, 1);
    graphics.fillRect(12, 38, 16, 3);

    // Arms (skin tone)
    graphics.fillStyle(0xffdbac, 1);
    graphics.fillRect(6, 26, 6, 12);   // Left arm
    graphics.fillRect(28, 26, 6, 12);  // Right arm

    // Weapon (dark gray rifle)
    graphics.fillStyle(0x333333, 1);
    graphics.fillRect(18, 10, 3, 16);  // Gun barrel
    graphics.fillStyle(0x6b4423, 1);
    graphics.fillRect(17, 22, 5, 6);   // Gun stock

    // Head (skin tone)
    graphics.fillStyle(0xffdbac, 1);
    graphics.fillCircle(20, 16, 7);

    // Hair (brown)
    graphics.fillStyle(0x4a2c1a, 1);
    graphics.fillRect(15, 10, 10, 5);

    // Eyes
    graphics.fillStyle(0x000000, 1);
    graphics.fillCircle(18, 16, 1);
    graphics.fillCircle(22, 16, 1);

    // Headband (red - iconic Commando look)
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(15, 13, 10, 2);

    graphics.generateTexture('player', 40, 52);
    graphics.destroy();
  }

  /**
   * Create enemy soldier sprite (gray/white uniform - NES Commando style)
   */
  static createEnemyTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Legs (gray pants)
    graphics.fillStyle(0x888888, 1);
    graphics.fillRect(10, 36, 7, 10);  // Left leg
    graphics.fillRect(21, 36, 7, 10);  // Right leg

    // Boots (dark gray)
    graphics.fillStyle(0x333333, 1);
    graphics.fillRect(10, 42, 7, 4);
    graphics.fillRect(21, 42, 7, 4);

    // Body/Torso (light gray/white uniform)
    graphics.fillStyle(0xcccccc, 1);
    graphics.fillRect(12, 22, 14, 16);

    // Belt (black)
    graphics.fillStyle(0x222222, 1);
    graphics.fillRect(12, 34, 14, 2);

    // Arms (light gray uniform sleeves)
    graphics.fillStyle(0xaaaaaa, 1);
    graphics.fillRect(7, 24, 5, 10);   // Left arm
    graphics.fillRect(26, 24, 5, 10);  // Right arm

    // Weapon (rifle)
    graphics.fillStyle(0x444444, 1);
    graphics.fillRect(17, 12, 2, 12);

    // Head (skin tone)
    graphics.fillStyle(0xffdbac, 1);
    graphics.fillCircle(19, 14, 6);

    // Helmet (dark green/gray)
    graphics.fillStyle(0x4a5540, 1);
    graphics.fillEllipse(19, 11, 10, 7);

    // Eyes
    graphics.fillStyle(0x000000, 1);
    graphics.fillCircle(17, 14, 1);
    graphics.fillCircle(21, 14, 1);

    graphics.generateTexture('enemy', 38, 46);
    graphics.destroy();
  }

  /**
   * Create tank sprite
   */
  static createTankTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Tank body
    graphics.fillStyle(0x3d3d3d, 1);
    graphics.fillRect(8, 12, 24, 20);

    // Tank turret
    graphics.fillStyle(0x2d2d2d, 1);
    graphics.fillCircle(20, 20, 10);

    // Tank barrel
    graphics.fillStyle(0x1d1d1d, 1);
    graphics.fillRect(18, 4, 4, 12);

    // Tracks
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillRect(4, 12, 4, 20);
    graphics.fillRect(32, 12, 4, 20);

    graphics.generateTexture('tank', 40, 40);
    graphics.destroy();
  }

  /**
   * Create jeep sprite
   */
  static createJeepTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Jeep body
    graphics.fillStyle(0x4a5a2a, 1);
    graphics.fillRect(6, 10, 20, 16);

    // Windshield
    graphics.fillStyle(0x6a9aff, 0.5);
    graphics.fillRect(10, 12, 8, 6);

    // Wheels
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillCircle(10, 10, 3);
    graphics.fillCircle(22, 10, 3);
    graphics.fillCircle(10, 26, 3);
    graphics.fillCircle(22, 26, 3);

    graphics.generateTexture('jeep', 32, 32);
    graphics.destroy();
  }

  /**
   * Create bullet sprite
   */
  static createBulletTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Bullet tracer
    graphics.fillStyle(0xffff00, 1);
    graphics.fillRect(2, 0, 2, 8);
    graphics.fillStyle(0xffaa00, 1);
    graphics.fillRect(2, 6, 2, 2);

    graphics.generateTexture('bullet', 6, 8);
    graphics.destroy();
  }

  /**
   * Create grenade sprite (pineapple-style hand grenade)
   */
  static createGrenadeTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Grenade body (olive green)
    graphics.fillStyle(0x4a5a2a, 1);
    graphics.fillCircle(8, 10, 6);

    // Grenade texture pattern (cross-hatch)
    graphics.lineStyle(1, 0x2d3d1a, 1);
    graphics.lineBetween(8, 4, 8, 16);
    graphics.lineBetween(2, 10, 14, 10);

    // Grenade pin/lever (metallic gray)
    graphics.fillStyle(0x888888, 1);
    graphics.fillRect(6, 2, 4, 3);

    // Pin ring (red)
    graphics.lineStyle(1.5, 0xff0000, 1);
    graphics.strokeCircle(10, 3, 2);

    graphics.generateTexture('grenade', 16, 16);
    graphics.destroy();
  }

  /**
   * Create particle sprite for explosions
   */
  static createParticleTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(4, 4, 4);

    graphics.generateTexture('particle', 8, 8);
    graphics.destroy();
  }

  /**
   * Create background terrain texture
   */
  static createBackgroundTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Base terrain color (grass)
    graphics.fillStyle(0x4a6e3a, 1);
    graphics.fillRect(0, 0, 64, 64);

    // Add terrain variation (darker patches)
    graphics.fillStyle(0x3d5c2f, 0.5);
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * 64;
      const y = Math.random() * 64;
      const size = Math.random() * 10 + 5;
      graphics.fillCircle(x, y, size);
    }

    // Add path/road lines
    graphics.lineStyle(3, 0x5a5a4a, 1);
    graphics.lineBetween(20, 0, 20, 64);
    graphics.lineBetween(44, 0, 44, 64);
    graphics.lineStyle(1, 0x6a6a5a, 1);
    graphics.lineBetween(22, 0, 22, 64);
    graphics.lineBetween(42, 0, 42, 64);

    graphics.generateTexture('background', 64, 64);
    graphics.destroy();
  }

  /**
   * Create grenade pack power-up texture
   */
  static createGrenadePowerUpTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Box/crate (brown wooden crate)
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(4, 6, 24, 20);

    // Crate highlights
    graphics.lineStyle(2, 0xa0522d, 1);
    graphics.strokeRect(4, 6, 24, 20);

    // Grenade icon on crate (green)
    graphics.fillStyle(0x4a5a2a, 1);
    graphics.fillCircle(16, 16, 6);

    // Label/stripe
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(4, 14, 24, 4);

    graphics.generateTexture('powerup-grenades', 32, 32);
    graphics.destroy();
  }

  /**
   * Create speed boost power-up texture
   */
  static createSpeedPowerUpTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Lightning bolt shape (yellow/gold)
    graphics.fillStyle(0xffff00, 1);

    // Zig-zag lightning shape
    graphics.beginPath();
    graphics.moveTo(16, 4);
    graphics.lineTo(12, 12);
    graphics.lineTo(16, 12);
    graphics.lineTo(12, 20);
    graphics.lineTo(8, 28);
    graphics.lineTo(14, 18);
    graphics.lineTo(10, 18);
    graphics.lineTo(14, 10);
    graphics.lineTo(18, 4);
    graphics.closePath();
    graphics.fillPath();

    // Glow effect
    graphics.fillStyle(0xffd700, 0.5);
    graphics.fillCircle(16, 16, 12);

    graphics.generateTexture('powerup-speed', 32, 32);
    graphics.destroy();
  }

  /**
   * Create shield power-up texture
   */
  static createShieldPowerUpTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Shield shape (blue/cyan)
    graphics.fillStyle(0x4169e1, 1);

    // Shield outline
    graphics.beginPath();
    graphics.moveTo(16, 6);
    graphics.lineTo(26, 10);
    graphics.lineTo(26, 20);
    graphics.lineTo(16, 28);
    graphics.lineTo(6, 20);
    graphics.lineTo(6, 10);
    graphics.closePath();
    graphics.fillPath();

    // Shield highlight
    graphics.fillStyle(0x6a9aff, 1);
    graphics.fillEllipse(16, 14, 8, 10);

    // Cross emblem
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(15, 12, 2, 10);
    graphics.fillRect(11, 16, 10, 2);

    graphics.generateTexture('powerup-shield', 32, 32);
    graphics.destroy();
  }

  /**
   * Create weapon upgrade power-up texture
   */
  static createWeaponPowerUpTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Ammo box (military green)
    graphics.fillStyle(0x4a5a2a, 1);
    graphics.fillRect(6, 8, 20, 16);

    // Box highlights
    graphics.lineStyle(2, 0x5a6a3a, 1);
    graphics.strokeRect(6, 8, 20, 16);

    // Bullet icons
    graphics.fillStyle(0xffd700, 1);
    graphics.fillRect(10, 12, 3, 8); // Left bullet
    graphics.fillRect(16, 12, 3, 8); // Middle bullet
    graphics.fillRect(22, 12, 3, 8); // Right bullet

    // Star emblem (power indicator)
    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(16, 24, 4);

    graphics.generateTexture('powerup-weapon', 32, 32);
    graphics.destroy();
  }

  /**
   * Create tree texture for jungle environment
   */
  static createTreeTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Tree trunk (brown)
    graphics.fillStyle(0x6b4423, 1);
    graphics.fillRect(18, 20, 8, 20);

    // Foliage (dark green, layered)
    graphics.fillStyle(0x2d5016, 1);
    graphics.fillCircle(22, 18, 12);
    graphics.fillCircle(16, 22, 10);
    graphics.fillCircle(28, 22, 10);

    graphics.fillStyle(0x3a6b1f, 1);
    graphics.fillCircle(22, 16, 10);
    graphics.fillCircle(18, 20, 8);
    graphics.fillCircle(26, 20, 8);

    // Highlights
    graphics.fillStyle(0x4a8030, 0.8);
    graphics.fillCircle(20, 14, 6);
    graphics.fillCircle(24, 16, 5);

    graphics.generateTexture('tree', 44, 40);
    graphics.destroy();
  }

  /**
   * Create rock texture for obstacles
   */
  static createRockTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Main rock body (gray with depth)
    graphics.fillStyle(0x5a5a5a, 1);
    graphics.beginPath();
    graphics.moveTo(16, 8);
    graphics.lineTo(24, 12);
    graphics.lineTo(22, 20);
    graphics.lineTo(10, 20);
    graphics.lineTo(8, 12);
    graphics.closePath();
    graphics.fillPath();

    // Highlights (lighter gray)
    graphics.fillStyle(0x787878, 1);
    graphics.beginPath();
    graphics.moveTo(16, 8);
    graphics.lineTo(20, 10);
    graphics.lineTo(18, 14);
    graphics.lineTo(12, 14);
    graphics.closePath();
    graphics.fillPath();

    // Shadows (darker gray)
    graphics.fillStyle(0x3a3a3a, 1);
    graphics.beginPath();
    graphics.moveTo(22, 20);
    graphics.lineTo(20, 16);
    graphics.lineTo(10, 16);
    graphics.lineTo(10, 20);
    graphics.closePath();
    graphics.fillPath();

    graphics.generateTexture('rock', 32, 24);
    graphics.destroy();
  }

  /**
   * Create building/bunker texture
   */
  static createBuildingTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Building base (concrete gray)
    graphics.fillStyle(0x8a8a8a, 1);
    graphics.fillRect(4, 16, 40, 32);

    // Roof (darker)
    graphics.fillStyle(0x5a5a5a, 1);
    graphics.fillRect(2, 14, 44, 4);

    // Windows (dark)
    graphics.fillStyle(0x2a2a2a, 1);
    graphics.fillRect(10, 22, 8, 10); // Left window
    graphics.fillRect(30, 22, 8, 10); // Right window

    // Door
    graphics.fillStyle(0x4a3020, 1);
    graphics.fillRect(20, 28, 8, 20);

    // Window highlights
    graphics.fillStyle(0x4a6a8a, 0.5);
    graphics.fillRect(10, 22, 3, 3);
    graphics.fillRect(30, 22, 3, 3);

    // Damage/battle wear
    graphics.fillStyle(0x3a3a3a, 0.6);
    graphics.fillCircle(8, 30, 3);
    graphics.fillCircle(38, 26, 2);

    graphics.generateTexture('building', 48, 48);
    graphics.destroy();
  }

  /**
   * Create water tile texture
   */
  static createWaterTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Water base (blue)
    graphics.fillStyle(0x2a4a7a, 1);
    graphics.fillRect(0, 0, 32, 32);

    // Wave highlights (lighter blue)
    graphics.fillStyle(0x3a6a9a, 0.6);
    graphics.fillCircle(8, 8, 4);
    graphics.fillCircle(24, 16, 3);
    graphics.fillCircle(16, 24, 3);
    graphics.fillCircle(6, 26, 2);

    // Foam/highlights
    graphics.fillStyle(0xaaccee, 0.4);
    graphics.fillCircle(10, 6, 2);
    graphics.fillCircle(26, 14, 2);

    graphics.generateTexture('water', 32, 32);
    graphics.destroy();
  }

  /**
   * Create crate/box obstacle texture
   */
  static createCrateTexture(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    // Crate body (wood brown)
    graphics.fillStyle(0x8b6914, 1);
    graphics.fillRect(4, 4, 24, 24);

    // Wood planks
    graphics.lineStyle(1, 0x6b4910, 1);
    graphics.lineBetween(4, 12, 28, 12);
    graphics.lineBetween(4, 20, 28, 20);
    graphics.lineBetween(12, 4, 12, 28);
    graphics.lineBetween(20, 4, 20, 28);

    // Metal bands
    graphics.lineStyle(2, 0x3a3a3a, 1);
    graphics.lineBetween(4, 8, 28, 8);
    graphics.lineBetween(4, 24, 28, 24);

    // Highlights
    graphics.fillStyle(0xaa8020, 1);
    graphics.fillRect(6, 6, 2, 2);

    graphics.generateTexture('crate', 32, 32);
    graphics.destroy();
  }
}
