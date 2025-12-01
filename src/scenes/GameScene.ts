/**
 * Game Scene
 * Main game scene - thin orchestrator that coordinates all systems
 * Single Responsibility: Coordinate game flow and state
 */

import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Bullet } from '../entities/Bullet';
import { Grenade } from '../entities/Grenade';
import { Enemy } from '../entities/enemies/Enemy';
import { CollisionSystem } from '../systems/CollisionSystem';
import { SpawnSystem } from '../systems/SpawnSystem';
import { SoundSystem } from '../systems/SoundSystem';
import { LevelSystem } from '../systems/LevelSystem';
import { EnvironmentSystem } from '../systems/EnvironmentSystem';
import { TextureFactory } from '../graphics/TextureFactory';
import { GameUI } from '../ui/GameUI';
import { SCREEN_WIDTH, SCREEN_HEIGHT, SCROLL_SPEED, PLAYER_INITIAL_LIVES, PLAYER_RESPAWN_INVINCIBILITY_TIME } from '../config/GameConfig';

import { PowerUp } from '../entities/powerups/PowerUp';

export class GameScene extends Phaser.Scene {
  // Entities
  private player!: Player;
  private bullets: Bullet[] = [];
  private grenades: Grenade[] = [];
  private enemies: Enemy[] = [];
  private powerUps: PowerUp[] = [];

  // Systems
  private collisionSystem!: CollisionSystem;
  private spawnSystem!: SpawnSystem;
  private soundSystem!: SoundSystem;
  private levelSystem!: LevelSystem;
  private environmentSystem!: EnvironmentSystem;
  private gameUI!: GameUI;

  // Input keys - created once
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private shiftKey!: Phaser.Input.Keyboard.Key;


  // Background
  private backgroundTiles: Phaser.GameObjects.TileSprite[] = [];

  // Game state
  private mapProgress: number = 0;
  private lives: number = PLAYER_INITIAL_LIVES;
  private hasWon: boolean = false;
  private bossDefeated: boolean = false;

  // Effects
  private explosionEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  // Game over or victory flag
  private isGameOverOrVictory: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  /**
   * Initialize with level system from briefing
   */
  init(data: { levelSystem?: LevelSystem }) {
    this.levelSystem = data.levelSystem || new LevelSystem();
    this.bossDefeated = false;
  }

  /**
   * Preload - Generate all textures
   */
  preload(): void {
    TextureFactory.createAllTextures(this);
  }

  /**
   * Create - Initialize all systems and entities
   */
  create(): void {
    this.isGameOverOrVictory = false;
    this.lives = PLAYER_INITIAL_LIVES;
    this.mapProgress = 0;
    this.hasWon = false;
    this.createBackground();
    this.createParticleSystem();
    this.createPlayer();
    this.initializeSystems();
    this.createInputKeys();
    this.createUI();
  }

  /**
   * Create scrolling background
   */
  private createBackground(): void {
    for (let i = 0; i < 3; i++) {
      const tile = this.add.tileSprite(
        SCREEN_WIDTH / 2,
        SCREEN_HEIGHT / 2 + i * SCREEN_HEIGHT,
        SCREEN_WIDTH,
        SCREEN_HEIGHT,
        'background'
      );
      this.backgroundTiles.push(tile);
    }
  }

  /**
   * Create particle system for explosions
   */
  private createParticleSystem(): void {
    this.explosionEmitter = this.add.particles(0, 0, 'particle', {
      speed: { min: 50, max: 200 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      lifespan: 300,
      gravityY: 100,
      blendMode: 'ADD',
      emitting: false
    });
  }

  /**
   * Create player entity
   */
  private createPlayer(): void {
    this.player = new Player(this, SCREEN_WIDTH / 2, SCREEN_HEIGHT - 100);
  }

  /**
   * Initialize all game systems
   */
  private initializeSystems(): void {
    this.soundSystem = new SoundSystem(this);
    this.collisionSystem = new CollisionSystem(this, this.soundSystem);
    this.spawnSystem = new SpawnSystem();

    // Initialize environment system with current level's environment type
    const currentLevel = this.levelSystem.getCurrentLevelData();
    this.environmentSystem = new EnvironmentSystem(this, currentLevel.environment);
  }

  /**
   * Create input keys ONCE - not in update loop
   */
  private createInputKeys(): void {
    if (this.input.keyboard) {
      this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

    }
  }

  /**
   * Create UI
   */
  private createUI(): void {
    this.gameUI = new GameUI(this);
    this.gameUI.create();
    // Initialize grenade and lives display
    this.gameUI.updateGrenades(this.player.getGrenadeCount());
    this.gameUI.updateLives(this.lives);

    // Create objectives panel with current mission objectives
    const objectives = this.levelSystem.getObjectives();
    this.gameUI.createObjectives(objectives);
  }

  /**
   * Update - Main game loop
   */
  update(time: number, delta: number): void {
    if (this.isGameOverOrVictory) return;
    // Only scroll if Arrow Up is pressed
    let scrollSpeed = 0;
    if (this.player && (this.player as any).cursors && (this.player as any).cursors.up.isDown) {
      scrollSpeed = SCROLL_SPEED;
    }
    this.updateBackground(delta, scrollSpeed);
    this.updateEnvironment(time, delta, scrollSpeed);
    this.updateMapProgress(delta);
    this.checkVictoryCondition();
    this.updatePlayer(time);
    this.updateShooting(time);
    this.updateGrenades(time);
    this.updateBullets();
    this.updateGrenadeStates();
    this.updateEnemies(time, delta);
    this.updatePowerUps();
    this.checkCollisions();
    this.updateKeyboardDebug();
    // Prevent player from walking through environmental objects
    this.environmentSystem.getElements().forEach(element => {
      if (element.collidable) {
        this.physics.world.collide(this.player.getSprite(), element.sprite);
      }
    });
  }

  /**
   * Update scrolling background
   */
  private updateBackground(delta: number, scrollSpeed: number): void {
    this.backgroundTiles.forEach(tile => {
      tile.tilePositionY -= scrollSpeed * (delta / 1000);
    });
  }

  /**
   * Update environmental decorations
   */
  private updateEnvironment(time: number, delta: number, scrollSpeed: number): void {
    this.environmentSystem.update(time, delta, scrollSpeed);
  }

  /**
   * Update map progress (distance traveled)
   */
  private updateMapProgress(delta: number): void {
    this.mapProgress += delta / 100;
    this.gameUI.updateDistance(this.mapProgress);
  }

  /**
   * Check if victory condition is met (all objectives complete)
   */
  private checkVictoryCondition(): void {
    if (!this.hasWon) {
      const kills = this.collisionSystem.getKills();
      const areComplete = this.levelSystem.areObjectivesComplete(kills, this.mapProgress, this.bossDefeated);

      // Update objectives display with current progress
      const updatedObjectives = this.levelSystem.updateObjectives(kills, this.mapProgress, this.bossDefeated);
      this.gameUI.updateObjectives(updatedObjectives);

      if (areComplete) {
        this.hasWon = true;
        this.triggerVictory();
      }
    }
  }

  /**
   * Update player - handles movement internally
   */
  private updatePlayer(time: number): void {
    this.player.update(time);
  }

  /**
   * Handle shooting
   */
  private updateShooting(time: number): void {
    // Check if Space key is held down (continuous fire)
    // Key is created ONCE in createInputKeys(), not here
    if (this.spaceKey && this.spaceKey.isDown) {
      // Determine shooting direction from arrow keys
      let dx = 0;
      let dy = 0;
      const cursors = (this.player as any).cursors;
      if (cursors) {
        if (cursors.left.isDown) dx -= 1;
        if (cursors.right.isDown) dx += 1;
        if (cursors.up.isDown) dy -= 1;
        // Only allow horizontal if not pressing up
        if (dy === 0 && dx === 0) dy = -1; // Default to up if no direction
      } else {
        dy = -1;
      }
      const bullet = this.player.shoot(time, dx, dy);
      if (bullet) {
        this.bullets.push(bullet);
        this.soundSystem.playShootSound();
      }
    }
  }

  /**
   * Handle grenade throwing
   * Uses JustPressed to ensure only one grenade per key press
   */
  private updateGrenades(time: number): void {
    // Check if Shift key was JUST pressed (not held)
    // Key is created ONCE in createInputKeys(), not here
    if (this.shiftKey && Phaser.Input.Keyboard.JustDown(this.shiftKey)) {
      const grenade = this.player.throwGrenade(time);
      if (grenade) {
        this.grenades.push(grenade);
        this.gameUI.updateGrenades(this.player.getGrenadeCount());
        this.soundSystem.playGrenadeThrowSound();
      }
    }
  }

  /**
   * Update and cleanup bullets
   */
  private updateBullets(): void {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      if (this.bullets[i].isOffScreen()) {
        this.bullets[i].destroy();
        this.bullets.splice(i, 1);
      }
    }
  }

  /**
   * Update grenade states and cleanup destroyed grenades
   */
  private updateGrenadeStates(): void {
    for (let i = this.grenades.length - 1; i >= 0; i--) {
      this.grenades[i].update();

      if (this.grenades[i].shouldBeDestroyed()) {
        this.grenades[i].destroy();
        this.grenades.splice(i, 1);
      }
    }
  }

  /**
   * Update power-ups and cleanup off-screen or collected ones
   */
  private updatePowerUps(): void {
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      if (this.powerUps[i].isOffScreen() || this.powerUps[i].isCollected()) {
        this.powerUps[i].destroy();
        this.powerUps.splice(i, 1);
      }
    }
  }

  /**
   * Update enemies and spawn new ones
   */
  private updateEnemies(time: number, delta: number): void {
    // Spawn new enemies and power-ups
    const spawned = this.spawnSystem.update(this, time, this.enemies, this.powerUps, this.mapProgress);
    this.enemies = spawned.enemies;
    this.powerUps = spawned.powerUps;

    // Update enemy AI
    const playerX = this.player.getX();
    const playerY = this.player.getY();

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      this.enemies[i].update(playerX, playerY, delta);

      if (this.enemies[i].isOffScreen()) {
        this.enemies[i].destroy();
        this.enemies.splice(i, 1);
      }
    }
  }

  /**
   * Check all collisions
   */
  private checkCollisions(): void {
    const result = this.collisionSystem.checkCollisions(
      this.player,
      this.bullets,
      this.grenades,
      this.enemies,
      this.powerUps,
      this.explosionEmitter,
      (score: number, kills: number) => this.onScoreUpdate(score, kills),
      () => this.onGameOver(),
      (count: number) => this.gameUI.updateGrenades(count),
      () => this.onBossDefeated()
    );

    this.bullets = result.bullets;
    this.grenades = result.grenades;
    this.enemies = result.enemies;
    this.powerUps = result.powerUps;
  }

  /**
   * Handle boss defeat
   */
  private onBossDefeated(): void {
    this.bossDefeated = true;
  }

  /**
   * Handle score update
   */
  private onScoreUpdate(score: number, kills: number): void {
    this.gameUI.updateScore(score);
    this.gameUI.updateKills(kills);
  }

  /**
   * Update keyboard debug display - shows which keys are currently pressed
   */
  private updateKeyboardDebug(): void {
    const keys: string[] = [];

    // Check all movement keys
    const player = this.player;
    const keyW = (player as any).keyW;
    const keyA = (player as any).keyA;
    const keyS = (player as any).keyS;
    const keyD = (player as any).keyD;
    const cursors = (player as any).cursors;

    if (keyW && keyW.isDown) keys.push('W');
    if (keyA && keyA.isDown) keys.push('A');
    if (keyS && keyS.isDown) keys.push('S');
    if (keyD && keyD.isDown) keys.push('D');
    if (cursors && cursors.up.isDown) keys.push('↑');
    if (cursors && cursors.down.isDown) keys.push('↓');
    if (cursors && cursors.left.isDown) keys.push('←');
    if (cursors && cursors.right.isDown) keys.push('→');
    if (this.spaceKey && this.spaceKey.isDown) keys.push('SPACE');
    if (this.shiftKey && this.shiftKey.isDown) keys.push('SHIFT');

    this.gameUI.updateKeyboardDebug(keys.join(', '));
  }

  /**
   * Handle player death - respawn or game over depending on lives
   */
  private async onGameOver(): Promise<void> {
    if (this.isGameOverOrVictory) return;

    // Play death sound and animation
    this.soundSystem.playPlayerDeathSound();
    await this.player.playDeathAnimation();

    // Decrease lives
    this.lives--;
    this.gameUI.updateLives(this.lives);

    // Check if player has lives remaining
    if (this.lives > 0) {
      // Respawn the player
      this.respawnPlayer();
    } else {
      // Actual game over
      this.triggerGameOver();
    }
  }

  /**
   * Respawn the player with invincibility
   */
  private respawnPlayer(): void {
    // Clear all enemies and bullets for a fresh start
    this.enemies.forEach(enemy => enemy.destroy());
    this.enemies = [];
    this.grenades.forEach(grenade => grenade.destroy());
    this.grenades = [];

    // Respawn player at starting position with invincibility
    const spawnX = SCREEN_WIDTH / 2;
    const spawnY = SCREEN_HEIGHT - 100;
    this.player.respawn(spawnX, spawnY, this.time.now, PLAYER_RESPAWN_INVINCIBILITY_TIME);
  }

  /**
   * Trigger actual game over (all lives lost)
   */
  private triggerGameOver(): void {
    if (this.isGameOverOrVictory) return;
    this.isGameOverOrVictory = true;
    // Play game over sound ONCE
    this.soundSystem.playGameOverSound();
    this.gameUI.showGameOver(
      this.collisionSystem.getScore(),
      this.collisionSystem.getKills(),
      this.mapProgress,
      () => this.scene.restart()
    );
    // Listen for R key to restart
    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-R', () => {
        this.scene.stop();
        this.scene.start('GameScene');
      });
    }
  }

  /**
   * Trigger victory (all objectives complete)
   */
  private triggerVictory(): void {
    if (this.isGameOverOrVictory) return;
    this.isGameOverOrVictory = true;
    // Play victory sound ONCE
    this.soundSystem.playVictorySound();
    this.levelSystem.completeLevel(
      this.collisionSystem.getScore(),
      this.collisionSystem.getKills()
    );
    const hasNextLevel = this.levelSystem.hasNextLevel();
    this.gameUI.showVictory(
      this.collisionSystem.getScore(),
      this.collisionSystem.getKills(),
      this.mapProgress,
      () => this.handleVictoryRestart(hasNextLevel)
    );
    // Listen for R key to restart
    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-R', () => {
        this.scene.stop();
        this.scene.start('GameScene');
      });
    }
  }

  /**
   * Handle restart after victory - either next level or back to menu
   */
  private handleVictoryRestart(hasNextLevel: boolean): void {
    if (hasNextLevel) {
      // Go to next level briefing
      this.scene.start('MissionBriefingScene', { levelSystem: this.levelSystem });
    } else {
      // Game complete - return to main menu
      this.scene.start('MainMenuScene');
    }
  }
}
