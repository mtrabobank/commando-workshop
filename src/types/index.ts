/**
 * Type Definitions
 * Central location for all TypeScript types and enums
 */

/**
 * Enemy Type Enumeration
 * Identifies different enemy variants for scoring and behavior
 */
export enum EnemyType {
  SOLDIER = 'SOLDIER',
  TANK = 'TANK',
  JEEP = 'JEEP',
  KNIFE_SOLDIER = 'KNIFE_SOLDIER',
  ROCKET_LAUNCHER = 'ROCKET_LAUNCHER',
  COVERED_SOLDIER = 'COVERED_SOLDIER',
  BUNKER = 'BUNKER',
  BOSS = 'BOSS'
}

/**
 * Callback type for score updates
 */
export type ScoreCallback = (points: number, kills: number) => void;

/**
 * Callback type for game over event
 */
export type GameOverCallback = () => void;

/**
 * Callback type for restart action
 */
export type RestartCallback = () => void;
