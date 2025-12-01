/**
 * Collision System
 * Handles all collision detection and resolution
 *
 * Responsibilities:
 * - Bullet vs Enemy collisions (direct hit damage)
 * - Grenade vs Enemy collisions (area of effect damage)
 * - Player vs Enemy collisions (game over)
 * - Manage explosion effects and score tracking
 *
 * Single Responsibility: Manage collision logic and effects
 */

import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Bullet } from '../entities/Bullet';
import { Grenade } from '../entities/Grenade';
import { Enemy } from '../entities/enemies/Enemy';
import { PowerUp } from '../entities/powerups/PowerUp';
import { EnemyType } from '../types';
import { SoundSystem } from './SoundSystem';
import {
  SOLDIER_POINTS,
  TANK_POINTS,
  JEEP_POINTS,
  KNIFE_SOLDIER_POINTS,
  ROCKET_LAUNCHER_POINTS,
  COVERED_SOLDIER_POINTS,
  BUNKER_POINTS,
  BOSS_POINTS,
  EXPLOSION_PARTICLE_COUNT
} from '../config/GameConfig';

export class CollisionSystem {
  private scene: Phaser.Scene;
  private soundSystem: SoundSystem;
  private score: number = 0;
  private kills: number = 0;

  constructor(scene: Phaser.Scene, soundSystem: SoundSystem) {
    this.scene = scene;
    this.soundSystem = soundSystem;
  }

  /**
   * Check all collision scenarios
   * Returns updated bullets, grenades, enemies, and powerUps arrays
   * Triggers callbacks for score updates, game over, and UI updates
   */
  checkCollisions(
    player: Player,
    bullets: Bullet[],
    grenades: Grenade[],
    enemies: Enemy[],
    powerUps: PowerUp[],
    explosionEmitter: Phaser.GameObjects.Particles.ParticleEmitter,
    onScoreUpdate: (score: number, kills: number) => void,
    onGameOver: () => void,
    onGrenadeCountUpdate: (count: number) => void,
    onBossDefeated?: () => void
  ): { bullets: Bullet[]; grenades: Grenade[]; enemies: Enemy[]; powerUps: PowerUp[] } {
    // Check bullet vs enemy collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      const bulletSprite = bullet.getSprite();

      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemy = enemies[j];
        const enemySprite = enemy.getSprite();

        if (this.scene.physics.overlap(bulletSprite, enemySprite)) {
          // Remove bullet
          bullet.destroy();
          bullets.splice(i, 1);

          // Damage enemy
          if (enemy.takeDamage()) {
            // Enemy destroyed - create explosion
            explosionEmitter.emitParticleAt(enemySprite.x, enemySprite.y, 16);

            // Play death sound
            this.soundSystem.playEnemyDeathSound();

            // Check if this is a boss defeat
            const enemyType = enemy.getType();
            if (enemyType === EnemyType.BOSS && onBossDefeated) {
              onBossDefeated();
            }

            // Calculate points based on enemy type
            const points = this.getPointsForEnemy(enemyType);
            this.score += points;
            this.kills++;

            // Remove enemy
            enemy.destroy();
            enemies.splice(j, 1);

            // Notify scene of score update
            onScoreUpdate(this.score, this.kills);
          }

          break; // Bullet can only hit one enemy
        }
      }
    }

    // Check grenade vs enemy collisions (area of effect)
    for (let i = grenades.length - 1; i >= 0; i--) {
      const grenade = grenades[i];

      // Only check collisions if grenade has exploded
      if (grenade.isExploded()) {
        const grenadeX = grenade.getX();
        const grenadeY = grenade.getY();
        const explosionRadius = grenade.getExplosionRadius();

        // Create larger explosion effect for grenades
        explosionEmitter.emitParticleAt(grenadeX, grenadeY, EXPLOSION_PARTICLE_COUNT * 2);

        // Play explosion sound
        this.soundSystem.playExplosionSound();

        // Check all enemies within explosion radius
        for (let j = enemies.length - 1; j >= 0; j--) {
          const enemy = enemies[j];
          const enemySprite = enemy.getSprite();

          // Calculate distance from grenade to enemy
          const distance = Phaser.Math.Distance.Between(
            grenadeX,
            grenadeY,
            enemySprite.x,
            enemySprite.y
          );

          // If enemy is within blast radius, damage it
          if (distance <= explosionRadius) {
            // Grenades deal enough damage to destroy any enemy in one hit
            // Take damage multiple times to ensure destruction
            if (enemy.takeDamage()) {
              // Create mini explosion at enemy location
              explosionEmitter.emitParticleAt(enemySprite.x, enemySprite.y, 8);

              // Check if this is a boss defeat
              const enemyType = enemy.getType();
              if (enemyType === EnemyType.BOSS && onBossDefeated) {
                onBossDefeated();
              }

              // Calculate points
              const points = this.getPointsForEnemy(enemyType);
              this.score += points;
              this.kills++;

              // Remove enemy
              enemy.destroy();
              enemies.splice(j, 1);

              // Notify scene
              onScoreUpdate(this.score, this.kills);
            }
          }
        }
      }
    }

    // Check player vs enemy collisions (only if not invincible and not dead)
    if (!player.getIsInvincible() && !player.getIsDead()) {
      const playerSprite = player.getSprite();
      for (const enemy of enemies) {
        if (this.scene.physics.overlap(playerSprite, enemy.getSprite())) {
          // Play player hit sound
          this.soundSystem.playPlayerHitSound();

          onGameOver();
          return { bullets, grenades, enemies, powerUps };
        }
      }
    }

    // Check player vs power-up collisions
    const playerSprite = player.getSprite();
    for (let i = powerUps.length - 1; i >= 0; i--) {
      const powerUp = powerUps[i];
      const powerUpSprite = powerUp.getSprite();

      if (this.scene.physics.overlap(playerSprite, powerUpSprite)) {
        // Apply power-up effect to player
        powerUp.apply(player);
        powerUp.collect();

        // Play power-up collection sound
        this.soundSystem.playPowerUpSound();

        // Update grenade count in UI if it changed
        onGrenadeCountUpdate(player.getGrenadeCount());

        // Power-up will be cleaned up in next frame
        break;
      }
    }

    return { bullets, grenades, enemies, powerUps };
  }

  /**
   * Get points awarded for destroying a specific enemy type
   */
  private getPointsForEnemy(type: EnemyType): number {
    switch (type) {
      case EnemyType.SOLDIER:
        return SOLDIER_POINTS;
      case EnemyType.TANK:
        return TANK_POINTS;
      case EnemyType.JEEP:
        return JEEP_POINTS;
      case EnemyType.KNIFE_SOLDIER:
        return KNIFE_SOLDIER_POINTS;
      case EnemyType.ROCKET_LAUNCHER:
        return ROCKET_LAUNCHER_POINTS;
      case EnemyType.COVERED_SOLDIER:
        return COVERED_SOLDIER_POINTS;
      case EnemyType.BUNKER:
        return BUNKER_POINTS;
      case EnemyType.BOSS:
        return BOSS_POINTS;
      default:
        return 100;
    }
  }

  /**
   * Get current score
   */
  getScore(): number {
    return this.score;
  }

  /**
   * Get current kill count
   */
  getKills(): number {
    return this.kills;
  }

  /**
   * Reset score and kills (for new game)
   */
  reset(): void {
    this.score = 0;
    this.kills = 0;
  }
}
