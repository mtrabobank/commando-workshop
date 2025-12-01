/**
 * Game UI
 * Manages all UI elements and updates
 * Single Responsibility: Display and update game UI
 */

import Phaser from 'phaser';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../config/GameConfig';
import { RestartCallback } from '../types';
import { HighScoreSystem } from '../systems/HighScoreSystem';
import { LevelObjective } from '../systems/LevelSystem';

export class GameUI {
  private scoreText!: Phaser.GameObjects.Text;
  private killsText!: Phaser.GameObjects.Text;
  private distanceText!: Phaser.GameObjects.Text;
  private grenadesText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private highScoreText!: Phaser.GameObjects.Text;
  private debugText!: Phaser.GameObjects.Text;
  private objectivesContainer!: Phaser.GameObjects.Container;
  private objectivesBackground!: Phaser.GameObjects.Rectangle;
  private objectiveTexts: Phaser.GameObjects.Text[] = [];
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * Create all UI elements
   */
  create(): void {
    // Score display
    this.scoreText = this.scene.add.text(20, 20, 'SCORE: 0', {
      fontSize: '28px',
      color: '#ffffff',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 4
    });
    this.scoreText.setDepth(100);

    // Kills counter
    this.killsText = this.scene.add.text(20, 55, 'KILLS: 0', {
      fontSize: '20px',
      color: '#00ff00',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.killsText.setDepth(100);

    // Distance tracker
    this.distanceText = this.scene.add.text(20, 85, 'DISTANCE: 0m', {
      fontSize: '18px',
      color: '#ffff00',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.distanceText.setDepth(100);

    // Grenades counter (bottom left - important info)
    this.grenadesText = this.scene.add.text(20, SCREEN_HEIGHT - 40, 'GRENADES: 10', {
      fontSize: '24px',
      color: '#ff8800',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 4
    });
    this.grenadesText.setDepth(100);

    // Lives counter (top right - critical info)
    this.livesText = this.scene.add.text(SCREEN_WIDTH - 20, 20, 'LIVES: 3', {
      fontSize: '28px',
      color: '#ff0000',
      fontFamily: 'Arial Black',
      stroke: '#000000',
      strokeThickness: 4
    });
    this.livesText.setOrigin(1, 0); // Right-aligned
    this.livesText.setDepth(100);

    // High score display (top right, below lives)
    const highScore = HighScoreSystem.getHighestScore();
    this.highScoreText = this.scene.add.text(SCREEN_WIDTH - 20, 60, `HI-SCORE: ${highScore}`, {
      fontSize: '18px',
      color: '#ffd700',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.highScoreText.setOrigin(1, 0); // Right-aligned
    this.highScoreText.setDepth(100);

    // Keyboard debug display (bottom right - for debugging)
    this.debugText = this.scene.add.text(SCREEN_WIDTH - 20, SCREEN_HEIGHT - 40, 'Keys: ----', {
      fontSize: '20px',
      color: '#00ffff',
      fontFamily: 'Arial',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.debugText.setOrigin(1, 0);
    this.debugText.setDepth(100);
  }

  /**
   * Update score display
   */
  updateScore(score: number): void {
    this.scoreText.setText(`SCORE: ${score}`);
  }

  /**
   * Update kills counter
   */
  updateKills(kills: number): void {
    this.killsText.setText(`KILLS: ${kills}`);
  }

  /**
   * Update distance traveled
   */
  updateDistance(distance: number): void {
    this.distanceText.setText(`DISTANCE: ${Math.floor(distance)}m`);
  }

  /**
   * Update grenades counter
   */
  updateGrenades(grenades: number): void {
    this.grenadesText.setText(`GRENADES: ${grenades}`);
    // Change color when running low
    if (grenades <= 3) {
      this.grenadesText.setColor('#ff0000'); // Red when low
    } else if (grenades <= 5) {
      this.grenadesText.setColor('#ff6600'); // Orange when medium
    } else {
      this.grenadesText.setColor('#ff8800'); // Normal orange
    }
  }

  /**
   * Update keyboard debug display
   */
  updateKeyboardDebug(keysPressed: string): void {
    this.debugText.setText(`Keys: ${keysPressed || '----'}`);
  }

  /**
   * Create objectives panel
   */
  createObjectives(objectives: LevelObjective[]): void {
    // Remove existing objectives if any
    if (this.objectivesContainer) {
      this.objectivesContainer.destroy();
    }
    this.objectiveTexts = [];

    // Calculate panel size based on number of objectives
    const panelWidth = 320;
    const panelHeight = 40 + objectives.length * 25 + 15;
    const panelX = SCREEN_WIDTH - panelWidth - 20; // Moved slightly left
    const panelY = 100;

    // Semi-transparent dark background panel
    this.objectivesBackground = this.scene.add.rectangle(
      panelX + panelWidth / 2,
      panelY + panelHeight / 2,
      panelWidth,
      panelHeight,
      0x000000,
      0.4 // More transparent
    );
    this.objectivesBackground.setStrokeStyle(2, 0x00ff00);
    this.objectivesBackground.setDepth(99);

    // Container for all objective elements
    this.objectivesContainer = this.scene.add.container(panelX, panelY);
    this.objectivesContainer.setDepth(100);

    // Mission objectives title
    const titleText = this.scene.add.text(
      10,
      8,
      'MISSION OBJECTIVES',
      {
        fontSize: '16px',
        color: '#00ff00',
        fontFamily: 'Arial Black',
        stroke: '#000000',
        strokeThickness: 3
      }
    );
    this.objectivesContainer.add(titleText);

    // Add each objective
    objectives.forEach((objective, index) => {
      const yPos = 35 + index * 25;

      // Checkbox indicator
      const checkbox = this.scene.add.text(
        10,
        yPos,
        objective.completed ? '☑' : '☐',
        {
          fontSize: '18px',
          color: objective.completed ? '#00ff00' : '#888888',
          fontFamily: 'Arial'
        }
      );
      this.objectivesContainer.add(checkbox);

      // Objective description
      const objectiveText = this.scene.add.text(
        35,
        yPos,
        objective.description,
        {
          fontSize: '14px',
          color: objective.completed ? '#00ff00' : '#ffffff',
          fontFamily: 'Arial',
          stroke: '#000000',
          strokeThickness: 2
        }
      );
      this.objectivesContainer.add(objectiveText);

      // Store references for updates
      this.objectiveTexts.push(checkbox);
      this.objectiveTexts.push(objectiveText);
    });
  }

  /**
   * Update objectives display
   */
  updateObjectives(objectives: LevelObjective[]): void {
    if (!this.objectivesContainer || this.objectiveTexts.length === 0) {
      return;
    }

    objectives.forEach((objective, index) => {
      const checkboxIndex = index * 2;
      const textIndex = index * 2 + 1;

      if (this.objectiveTexts[checkboxIndex] && this.objectiveTexts[textIndex]) {
        // Update checkbox
        this.objectiveTexts[checkboxIndex].setText(objective.completed ? '☑' : '☐');
        this.objectiveTexts[checkboxIndex].setColor(objective.completed ? '#00ff00' : '#888888');

        // Update text color and add strikethrough effect for completed objectives
        this.objectiveTexts[textIndex].setColor(objective.completed ? '#00ff00' : '#ffffff');

        // Add subtle completion animation
        if (objective.completed && !this.objectiveTexts[textIndex].getData('animated')) {
          this.objectiveTexts[textIndex].setData('animated', true);
          this.scene.tweens.add({
            targets: [this.objectiveTexts[checkboxIndex], this.objectiveTexts[textIndex]],
            scale: { from: 1.2, to: 1 },
            duration: 300,
            ease: 'Back.easeOut'
          });
        }
      }
    });
  }

  /**
   * Update lives counter
   */
  updateLives(lives: number): void {
    this.livesText.setText(`LIVES: ${lives}`);
    // Visual feedback based on remaining lives
    if (lives === 1) {
      this.livesText.setColor('#ff0000'); // Red for last life
      // Add pulsing effect for dramatic tension
      this.scene.tweens.add({
        targets: this.livesText,
        scale: { from: 1, to: 1.2 },
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    } else if (lives === 2) {
      this.livesText.setColor('#ff8800'); // Orange for 2 lives
    } else {
      this.livesText.setColor('#00ff00'); // Green for 3+ lives
    }
  }

  /**
   * Display victory screen with stats, high scores, and continue/restart options
   */
  showVictory(
    score: number,
    kills: number,
    distance: number,
    onRestart: RestartCallback
  ): void {
    // Save score and check if it's a high score
    const isNewHighScore = HighScoreSystem.saveScore(score, kills, Math.floor(distance));


    // Dark overlay with slight blue tint for victory
    const overlay = this.scene.add.rectangle(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2,
      SCREEN_WIDTH,
      SCREEN_HEIGHT,
      0x001133,
      0.85
    );
    overlay.setDepth(150);

    // Victory title with gold color
    const victoryText = this.scene.add.text(
      SCREEN_WIDTH / 2,
      60,
      'MISSION COMPLETE!',
      {
        fontSize: '64px',
        color: '#00ff00',
        fontFamily: 'Arial Black',
        stroke: '#000000',
        strokeThickness: 8
      }
    );
    victoryText.setOrigin(0.5);
    victoryText.setDepth(200);

    // Pulsing animation for victory text
    this.scene.tweens.add({
      targets: victoryText,
      scale: { from: 1, to: 1.1 },
      duration: 600,
      yoyo: true,
      repeat: -1
    });

    // New High Score indicator
    if (isNewHighScore) {
      const highScoreText = this.scene.add.text(
        SCREEN_WIDTH / 2,
        140,
        '★ NEW HIGH SCORE! ★',
        {
          fontSize: '32px',
          color: '#ffd700',
          fontFamily: 'Arial Black',
          stroke: '#000000',
          strokeThickness: 4
        }
      );
      highScoreText.setOrigin(0.5);
      highScoreText.setDepth(200);

      // Pulsing animation for new high score
      this.scene.tweens.add({
        targets: highScoreText,
        scale: { from: 1, to: 1.2 },
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    }

    // Final stats
    const statsY = isNewHighScore ? 200 : 160;
    const stats = this.scene.add.text(
      SCREEN_WIDTH / 2,
      statsY,
      `Final Score: ${score}\nKills: ${kills}\nDistance: ${Math.floor(distance)}m`,
      {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
      }
    );
    stats.setOrigin(0.5);
    stats.setDepth(200);

    // High scores table
    const highScores = HighScoreSystem.getHighScores();
    if (highScores.length > 0) {
      const tableY = statsY + 100;
      const tableTitle = this.scene.add.text(
        SCREEN_WIDTH / 2,
        tableY,
        'HIGH SCORES',
        {
          fontSize: '24px',
          color: '#ffff00',
          fontFamily: 'Arial Black',
          stroke: '#000000',
          strokeThickness: 3
        }
      );
      tableTitle.setOrigin(0.5);
      tableTitle.setDepth(200);

      // Show top 5 scores
      const topScores = highScores.slice(0, 5);
      let scoreListText = '';
      topScores.forEach((entry, index) => {
        scoreListText += `${index + 1}. ${entry.score} pts (${entry.kills} kills)\n`;
      });

      const scoreList = this.scene.add.text(
        SCREEN_WIDTH / 2,
        tableY + 40,
        scoreListText,
        {
          fontSize: '18px',
          color: '#ffffff',
          fontFamily: 'Arial',
          stroke: '#000000',
          strokeThickness: 2,
          align: 'left'
        }
      );
      scoreList.setOrigin(0.5, 0);
      scoreList.setDepth(200);
    }

    // Restart instruction
    const restartText = this.scene.add.text(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT - 60,
      'Press R to Play Again',
      {
        fontSize: '24px',
        color: '#00ff00',
        fontFamily: 'Arial Black',
        stroke: '#000000',
        strokeThickness: 3
      }
    );
    restartText.setOrigin(0.5);
    restartText.setDepth(200);

    // Pulsing restart text
    this.scene.tweens.add({
      targets: restartText,
      alpha: { from: 1, to: 0.5 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Handle restart key
    this.scene.input.keyboard!.once('keydown-R', () => {
      onRestart();
    });
  }

  /**
   * Display game over screen with stats, high scores, and restart option
   */
  showGameOver(
    score: number,
    kills: number,
    distance: number,
    onRestart: RestartCallback
  ): void {
    // Save score and check if it's a high score
    const isNewHighScore = HighScoreSystem.saveScore(score, kills, Math.floor(distance));


    // Dark overlay
    const overlay = this.scene.add.rectangle(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2,
      SCREEN_WIDTH,
      SCREEN_HEIGHT,
      0x000000,
      0.8
    );
    overlay.setDepth(150);

    // Game Over title
    const gameOverText = this.scene.add.text(
      SCREEN_WIDTH / 2,
      60,
      'GAME OVER',
      {
        fontSize: '72px',
        color: '#ff0000',
        fontFamily: 'Arial Black',
        stroke: '#000000',
        strokeThickness: 8
      }
    );
    gameOverText.setOrigin(0.5);
    gameOverText.setDepth(200);

    // New High Score indicator
    if (isNewHighScore) {
      const highScoreText = this.scene.add.text(
        SCREEN_WIDTH / 2,
        140,
        '★ NEW HIGH SCORE! ★',
        {
          fontSize: '32px',
          color: '#ffd700',
          fontFamily: 'Arial Black',
          stroke: '#000000',
          strokeThickness: 4
        }
      );
      highScoreText.setOrigin(0.5);
      highScoreText.setDepth(200);

      // Pulsing animation for new high score
      this.scene.tweens.add({
        targets: highScoreText,
        scale: { from: 1, to: 1.2 },
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    }

    // Final stats
    const statsY = isNewHighScore ? 200 : 160;
    const stats = this.scene.add.text(
      SCREEN_WIDTH / 2,
      statsY,
      `Final Score: ${score}\nKills: ${kills}\nDistance: ${Math.floor(distance)}m`,
      {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
      }
    );
    stats.setOrigin(0.5);
    stats.setDepth(200);

    // High scores table
    const highScores = HighScoreSystem.getHighScores();
    if (highScores.length > 0) {
      const tableY = statsY + 100;
      const tableTitle = this.scene.add.text(
        SCREEN_WIDTH / 2,
        tableY,
        'HIGH SCORES',
        {
          fontSize: '24px',
          color: '#ffff00',
          fontFamily: 'Arial Black',
          stroke: '#000000',
          strokeThickness: 3
        }
      );
      tableTitle.setOrigin(0.5);
      tableTitle.setDepth(200);

      // Show top 5 scores
      const topScores = highScores.slice(0, 5);
      let scoreListText = '';
      topScores.forEach((entry, index) => {
        scoreListText += `${index + 1}. ${entry.score} pts (${entry.kills} kills)\n`;
      });

      const scoreList = this.scene.add.text(
        SCREEN_WIDTH / 2,
        tableY + 40,
        scoreListText,
        {
          fontSize: '18px',
          color: '#ffffff',
          fontFamily: 'Arial',
          stroke: '#000000',
          strokeThickness: 2,
          align: 'left'
        }
      );
      scoreList.setOrigin(0.5, 0);
      scoreList.setDepth(200);
    }

    // Restart instruction
    const restartText = this.scene.add.text(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT - 60,
      'Press R to Restart',
      {
        fontSize: '24px',
        color: '#00ff00',
        fontFamily: 'Arial Black',
        stroke: '#000000',
        strokeThickness: 3
      }
    );
    restartText.setOrigin(0.5);
    restartText.setDepth(200);

    // Pulsing restart text
    this.scene.tweens.add({
      targets: restartText,
      alpha: { from: 1, to: 0.5 },
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Handle restart key
    this.scene.input.keyboard!.once('keydown-R', () => {
      onRestart();
    });
  }
}
