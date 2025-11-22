/**
 * Spawn System
 * Manages enemy spawning logic and difficulty progression
 * Single Responsibility: Control when, where, and what enemies spawn
 */

import Phaser from 'phaser';
import { Enemy } from '../entities/enemies/Enemy';
import { Soldier } from '../entities/enemies/Soldier';
import { Tank } from '../entities/enemies/Tank';
import { Jeep } from '../entities/enemies/Jeep';
import { KnifeSoldier } from '../entities/enemies/KnifeSoldier';
import { RocketLauncher } from '../entities/enemies/RocketLauncher';
import { CoveredSoldier } from '../entities/enemies/CoveredSoldier';
import { Bunker } from '../entities/enemies/Bunker';
import { Boss } from '../entities/enemies/Boss';
import { PowerUp } from '../entities/powerups/PowerUp';
import { GrenadePack } from '../entities/powerups/GrenadePack';
import { SpeedBoost } from '../entities/powerups/SpeedBoost';
import { Shield } from '../entities/powerups/Shield';
import { WeaponUpgrade } from '../entities/powerups/WeaponUpgrade';
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  ENEMY_SPAWN_RATE_INITIAL,
  ENEMY_SPAWN_RATE_MIN,
  ENEMY_SPAWN_COUNT_MIN,
  ENEMY_SPAWN_COUNT_MAX,
  SPAWN_CHANCE_SOLDIER,
  SPAWN_CHANCE_JEEP,
  SPAWN_FROM_TOP,
  SPAWN_FROM_LEFT
} from '../config/GameConfig';

export class SpawnSystem {
  private lastEnemySpawn: number = 0;
  private enemySpawnRate: number = ENEMY_SPAWN_RATE_INITIAL;

  private lastPowerUpSpawn: number = 0;
  private powerUpSpawnRate: number = 15000; // Power-up every 15 seconds

  /**
   * Update spawn system and create new enemies and power-ups if needed
   * Returns updated arrays
   */
  update(
    scene: Phaser.Scene,
    time: number,
    enemies: Enemy[],
    powerUps: PowerUp[],
    mapProgress: number
  ): { enemies: Enemy[]; powerUps: PowerUp[] } {
    // Enemy spawning
    if (this.shouldSpawn(time)) {
      this.lastEnemySpawn = time;
      enemies = this.spawnEnemies(scene, enemies, mapProgress);

      // Progressive difficulty - spawn faster as player progresses
      this.enemySpawnRate = Math.max(
        ENEMY_SPAWN_RATE_MIN,
        ENEMY_SPAWN_RATE_INITIAL - mapProgress / 10
      );
    }

    // Power-up spawning
    if (this.shouldSpawnPowerUp(time)) {
      this.lastPowerUpSpawn = time;
      powerUps = this.spawnPowerUp(scene, powerUps);
    }

    return { enemies, powerUps };
  }

  /**
   * Check if it's time to spawn a power-up
   */
  private shouldSpawnPowerUp(time: number): boolean {
    return time > this.lastPowerUpSpawn + this.powerUpSpawnRate;
  }

  /**
   * Check if it's time to spawn new enemies
   */
  private shouldSpawn(time: number): boolean {
    return time > this.lastEnemySpawn + this.enemySpawnRate;
  }

  /**
   * Spawn 1-3 enemies at random positions
   */
  private spawnEnemies(scene: Phaser.Scene, enemies: Enemy[], mapProgress: number): Enemy[] {
    const spawnCount = Phaser.Math.Between(
      ENEMY_SPAWN_COUNT_MIN,
      ENEMY_SPAWN_COUNT_MAX
    );

    for (let i = 0; i < spawnCount; i++) {
      const position = this.getRandomSpawnPosition();
      const enemy = this.createRandomEnemy(scene, position.x, position.y, mapProgress);
      enemies.push(enemy);
    }

    return enemies;
  }

  /**
   * Get random spawn position
   * 70% from top, 15% from left, 15% from right
   */
  private getRandomSpawnPosition(): { x: number; y: number } {
    const spawnRoll = Math.random();

    if (spawnRoll < SPAWN_FROM_TOP) {
      // Spawn from top
      return {
        x: Phaser.Math.Between(50, SCREEN_WIDTH - 50),
        y: -40
      };
    } else if (spawnRoll < SPAWN_FROM_TOP + SPAWN_FROM_LEFT) {
      // Spawn from left
      return {
        x: -40,
        y: Phaser.Math.Between(50, SCREEN_HEIGHT - 50)
      };
    } else {
      // Spawn from right
      return {
        x: SCREEN_WIDTH + 40,
        y: Phaser.Math.Between(50, SCREEN_HEIGHT - 50)
      };
    }
  }

  /**
   * Create a random enemy type based on spawn distribution and difficulty progression
   *
   * Early game (0-100m):    60% Soldiers, 25% Jeeps, 15% Tanks
   * Mid game (100-200m):    40% Soldiers, 20% Jeeps, 15% Tanks, 15% KnifeSoldier, 10% CoveredSoldier
   * Late game (200-300m):   30% Soldiers, 15% Jeeps, 15% Tanks, 15% KnifeSoldier, 10% CoveredSoldier, 10% RocketLauncher, 5% Bunker
   * End game (300+m):       25% Soldiers, 10% Jeeps, 10% Tanks, 15% KnifeSoldier, 10% CoveredSoldier, 15% RocketLauncher, 10% Bunker, 5% Boss
   */
  private createRandomEnemy(scene: Phaser.Scene, x: number, y: number, mapProgress: number): Enemy {
    const roll = Math.random();

    // Early game (0-100m): Basic enemies only
    if (mapProgress < 100) {
      if (roll < 0.60) {
        return new Soldier(scene, x, y);
      } else if (roll < 0.85) {
        return new Jeep(scene, x, y);
      } else {
        return new Tank(scene, x, y);
      }
    }

    // Mid game (100-200m): Introduce advanced enemies
    if (mapProgress < 200) {
      if (roll < 0.40) {
        return new Soldier(scene, x, y);
      } else if (roll < 0.60) {
        return new Jeep(scene, x, y);
      } else if (roll < 0.75) {
        return new Tank(scene, x, y);
      } else if (roll < 0.90) {
        return new KnifeSoldier(scene, x, y);
      } else {
        return new CoveredSoldier(scene, x, y);
      }
    }

    // Late game (200-300m): Introduce elite enemies
    if (mapProgress < 300) {
      if (roll < 0.30) {
        return new Soldier(scene, x, y);
      } else if (roll < 0.45) {
        return new Jeep(scene, x, y);
      } else if (roll < 0.60) {
        return new Tank(scene, x, y);
      } else if (roll < 0.75) {
        return new KnifeSoldier(scene, x, y);
      } else if (roll < 0.85) {
        return new CoveredSoldier(scene, x, y);
      } else if (roll < 0.95) {
        return new RocketLauncher(scene, x, y);
      } else {
        return new Bunker(scene, x, y);
      }
    }

    // End game (300+m): All enemies including bosses
    if (roll < 0.25) {
      return new Soldier(scene, x, y);
    } else if (roll < 0.35) {
      return new Jeep(scene, x, y);
    } else if (roll < 0.45) {
      return new Tank(scene, x, y);
    } else if (roll < 0.60) {
      return new KnifeSoldier(scene, x, y);
    } else if (roll < 0.70) {
      return new CoveredSoldier(scene, x, y);
    } else if (roll < 0.85) {
      return new RocketLauncher(scene, x, y);
    } else if (roll < 0.95) {
      return new Bunker(scene, x, y);
    } else {
      return new Boss(scene, x, y);
    }
  }

  /**
   * Spawn a random power-up from the top of the screen
   */
  private spawnPowerUp(scene: Phaser.Scene, powerUps: PowerUp[]): PowerUp[] {
    const x = Phaser.Math.Between(100, SCREEN_WIDTH - 100);
    const y = -40;
    const powerUp = this.createRandomPowerUp(scene, x, y);
    powerUps.push(powerUp);
    return powerUps;
  }

  /**
   * Create a random power-up type
   * 40% Grenades, 30% Speed, 20% Shield, 10% Weapon
   */
  private createRandomPowerUp(scene: Phaser.Scene, x: number, y: number): PowerUp {
    const roll = Math.random();

    if (roll < 0.4) {
      return new GrenadePack(scene, x, y);
    } else if (roll < 0.7) {
      return new SpeedBoost(scene, x, y);
    } else if (roll < 0.9) {
      return new Shield(scene, x, y);
    } else {
      return new WeaponUpgrade(scene, x, y);
    }
  }

  /**
   * Reset spawn system (for new game)
   */
  reset(): void {
    this.lastEnemySpawn = 0;
    this.enemySpawnRate = ENEMY_SPAWN_RATE_INITIAL;
    this.lastPowerUpSpawn = 0;
  }
}
