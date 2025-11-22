/**
 * Mission Briefing Scene
 * Displays story, objectives, and level information before each mission
 * Single Responsibility: Present narrative and mission details
 */

import Phaser from 'phaser';
import { LevelSystem, LevelData } from '../systems/LevelSystem';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../config/GameConfig';

export class MissionBriefingScene extends Phaser.Scene {
  private levelSystem!: LevelSystem;
  private levelData!: LevelData;

  constructor() {
    super({ key: 'MissionBriefingScene' });
  }

  /**
   * Initialize with level system
   */
  init(data: { levelSystem: LevelSystem }) {
    this.levelSystem = data.levelSystem || new LevelSystem();
    this.levelData = this.levelSystem.getCurrentLevelData();
  }

  /**
   * Create briefing UI
   */
  create(): void {
    this.createBackground();
    this.createHeader();
    this.createBriefingText();
    this.createObjectivesList();
    this.createStartPrompt();
  }

  /**
   * Create atmospheric background
   */
  private createBackground(): void {
    // Dark military-style background
    const bg = this.add.rectangle(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2,
      SCREEN_WIDTH,
      SCREEN_HEIGHT,
      0x1a1a2e
    );

    // Add grid pattern for tech feel
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x16213e, 0.3);

    const gridSize = 40;
    for (let x = 0; x < SCREEN_WIDTH; x += gridSize) {
      graphics.lineBetween(x, 0, x, SCREEN_HEIGHT);
    }
    for (let y = 0; y < SCREEN_HEIGHT; y += gridSize) {
      graphics.lineBetween(0, y, SCREEN_WIDTH, y);
    }

    // Add scan line effect
    const scanLine = this.add.rectangle(
      SCREEN_WIDTH / 2,
      0,
      SCREEN_WIDTH,
      4,
      0x00ff00,
      0.3
    );

    this.tweens.add({
      targets: scanLine,
      y: SCREEN_HEIGHT,
      duration: 3000,
      repeat: -1,
      ease: 'Linear'
    });
  }

  /**
   * Create header with level name
   */
  private createHeader(): void {
    // Mission number
    const missionLabel = this.add.text(
      SCREEN_WIDTH / 2,
      40,
      `MISSION ${this.levelData.number}`,
      {
        fontSize: '24px',
        color: '#00ff00',
        fontFamily: 'Courier New',
        fontStyle: 'bold'
      }
    );
    missionLabel.setOrigin(0.5);

    // Level name
    const levelName = this.add.text(
      SCREEN_WIDTH / 2,
      80,
      this.levelData.name,
      {
        fontSize: '36px',
        color: '#ffffff',
        fontFamily: 'Arial Black',
        stroke: '#000000',
        strokeThickness: 4
      }
    );
    levelName.setOrigin(0.5);

    // Decorative line
    const line = this.add.graphics();
    line.lineStyle(2, 0x00ff00);
    line.lineBetween(100, 110, SCREEN_WIDTH - 100, 110);

    // Blinking cursor effect on title
    this.tweens.add({
      targets: levelName,
      alpha: { from: 1, to: 0.7 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });
  }

  /**
   * Create briefing text with typewriter effect
   */
  private createBriefingText(): void {
    const briefingBox = this.add.rectangle(
      SCREEN_WIDTH / 2,
      280,
      SCREEN_WIDTH - 120,
      280,
      0x0f1419,
      0.9
    );

    const briefingBorder = this.add.graphics();
    briefingBorder.lineStyle(2, 0x00ff00);
    briefingBorder.strokeRect(60, 140, SCREEN_WIDTH - 120, 280);

    const briefingText = this.add.text(
      80,
      160,
      this.levelData.briefing,
      {
        fontSize: '14px',
        color: '#00ff00',
        fontFamily: 'Courier New',
        lineSpacing: 8,
        wordWrap: { width: SCREEN_WIDTH - 160 }
      }
    );

    // Add flicker effect to simulate old monitor
    this.time.addEvent({
      delay: 100,
      callback: () => {
        briefingText.setAlpha(Math.random() > 0.95 ? 0.8 : 1.0);
      },
      loop: true
    });
  }

  /**
   * Create objectives list
   */
  private createObjectivesList(): void {
    const objectivesY = 450;

    const objectivesTitle = this.add.text(
      80,
      objectivesY,
      'PRIMARY OBJECTIVES:',
      {
        fontSize: '18px',
        color: '#ffff00',
        fontFamily: 'Arial Black',
        stroke: '#000000',
        strokeThickness: 3
      }
    );

    let yOffset = objectivesY + 35;
    this.levelData.objectives.forEach((objective, index) => {
      const checkBox = this.add.rectangle(
        90,
        yOffset + 8,
        16,
        16,
        0x333333
      );

      const checkBoxBorder = this.add.graphics();
      checkBoxBorder.lineStyle(2, 0x00ff00);
      checkBoxBorder.strokeRect(82, yOffset, 16, 16);

      const objectiveText = this.add.text(
        110,
        yOffset,
        `${index + 1}. ${objective.description}`,
        {
          fontSize: '16px',
          color: '#ffffff',
          fontFamily: 'Arial'
        }
      );

      yOffset += 30;
    });

    // Environment info
    const envText = this.add.text(
      80,
      yOffset + 10,
      `ENVIRONMENT: ${this.levelData.environment.toUpperCase()}`,
      {
        fontSize: '14px',
        color: '#888888',
        fontFamily: 'Courier New',
        fontStyle: 'italic'
      }
    );
  }

  /**
   * Create start prompt
   */
  private createStartPrompt(): void {
    const startText = this.add.text(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT - 60,
      'Press SPACE to begin mission',
      {
        fontSize: '24px',
        color: '#00ff00',
        fontFamily: 'Arial Black',
        stroke: '#000000',
        strokeThickness: 3
      }
    );
    startText.setOrigin(0.5);

    // Pulsing animation
    this.tweens.add({
      targets: startText,
      alpha: { from: 1, to: 0.4 },
      scale: { from: 1, to: 1.05 },
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    // Handle space key
    this.input.keyboard!.once('keydown-SPACE', () => {
      this.startMission();
    });

    // ESC to go back to main menu (if needed)
    const escText = this.add.text(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT - 30,
      'ESC - Return to Menu',
      {
        fontSize: '12px',
        color: '#666666',
        fontFamily: 'Arial'
      }
    );
    escText.setOrigin(0.5);
  }

  /**
   * Start the mission
   */
  private startMission(): void {
    // Fade out effect
    this.cameras.main.fadeOut(500, 0, 0, 0);

    this.cameras.main.once('camerafadeoutcomplete', () => {
      // Pass level system to game scene
      this.scene.start('GameScene', { levelSystem: this.levelSystem });
    });
  }
}
