/**
 * Main Entry Point
 * Initializes Phaser game with configuration
 */

import Phaser from 'phaser';
import { MainMenuScene } from './scenes/MainMenuScene';
import { MissionBriefingScene } from './scenes/MissionBriefingScene';
import { GameScene } from './scenes/GameScene';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './config/GameConfig';

/**
 * Phaser Game Configuration
 */
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false // Set to true for physics debugging
    }
  },
  scene: [MainMenuScene, MissionBriefingScene, GameScene]
};

// Initialize the game
const game = new Phaser.Game(config);

// Expose game to window for E2E testing
(window as any).game = game;
