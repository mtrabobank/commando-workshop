/**
 * Main Menu Scene
 * Game entry point with menu options
 * Single Responsibility: Main menu navigation and game start
 */

import Phaser from 'phaser';
import { LevelSystem } from '../systems/LevelSystem';
import { HighScoreSystem } from '../systems/HighScoreSystem';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../config/GameConfig';

export class MainMenuScene extends Phaser.Scene {
  private levelSystem!: LevelSystem;
  private selectedOption: number = 0;
  private menuOptions: Phaser.GameObjects.Text[] = [];

  constructor() {
    super({ key: 'MainMenuScene' });
  }

  /**
   * Initialize menu
   */
  create(): void {
    this.levelSystem = new LevelSystem();

    this.createBackground();
    this.createTitle();
    this.createMenu();
    this.createCredits();
    this.setupInput();
  }

  /**
   * Create animated background
   */
  private createBackground(): void {
    // Dark background with gradient
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x0a0e1a, 0x0a0e1a, 0x1a1a2e, 0x1a1a2e, 1);
    graphics.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Animated stars
    for (let i = 0; i < 50; i++) {
      const star = this.add.circle(
        Math.random() * SCREEN_WIDTH,
        Math.random() * SCREEN_HEIGHT,
        Math.random() * 2,
        0xffffff,
        Math.random() * 0.5
      );

      this.tweens.add({
        targets: star,
        alpha: { from: Math.random() * 0.5, to: 0 },
        duration: 2000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1
      });
    }
  }

  /**
   * Create game title
   */
  private createTitle(): void {
    // Main title
    const title = this.add.text(
      SCREEN_WIDTH / 2,
      100,
      'COMMANDO',
      {
        fontSize: '72px',
        color: '#ff0000',
        fontFamily: 'Arial Black',
        stroke: '#000000',
        strokeThickness: 8
      }
    );
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(
      SCREEN_WIDTH / 2,
      170,
      'OPERATION: FINAL STRIKE',
      {
        fontSize: '24px',
        color: '#00ff00',
        fontFamily: 'Courier New',
        fontStyle: 'bold'
      }
    );
    subtitle.setOrigin(0.5);

    // Pulsing title effect
    this.tweens.add({
      targets: title,
      scale: { from: 1, to: 1.05 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Version
    const version = this.add.text(
      SCREEN_WIDTH - 20,
      SCREEN_HEIGHT - 20,
      'v2.0',
      {
        fontSize: '12px',
        color: '#666666',
        fontFamily: 'Arial'
      }
    );
    version.setOrigin(1, 1);
  }

  /**
   * Create menu options
   */
  private createMenu(): void {
    const progress = this.levelSystem.getProgress();
    const hasSavedGame = progress.levelsCompleted.length > 0;

    const menuY = 280;
    const menuSpacing = 60;

    // Define menu options
    const options = [
      { text: 'NEW GAME', action: () => this.startNewGame() },
      { text: 'CONTINUE', action: () => this.continueGame(), enabled: hasSavedGame },
      { text: 'HIGH SCORES', action: () => this.showHighScores() },
      { text: 'STORY', action: () => this.showStory() },
      { text: 'CONTROLS', action: () => this.showControls() }
    ];

    options.forEach((option, index) => {
      const isEnabled = option.enabled !== false;
      const color = isEnabled ? '#ffffff' : '#555555';

      const text = this.add.text(
        SCREEN_WIDTH / 2,
        menuY + index * menuSpacing,
        option.text,
        {
          fontSize: '32px',
          color: color,
          fontFamily: 'Arial Black',
          stroke: '#000000',
          strokeThickness: 4
        }
      );
      text.setOrigin(0.5);

      if (isEnabled) {
        text.setInteractive({ useHandCursor: true });
        text.on('pointerover', () => this.selectOption(index));
        text.on('pointerdown', option.action);
        this.menuOptions.push(text);
      }
    });

    this.selectOption(0);
  }

  /**
   * Create credits
   */
  private createCredits(): void {
    const credits = this.add.text(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT - 60,
      'Built with TypeScript & Phaser.js | SOLID Architecture',
      {
        fontSize: '12px',
        color: '#888888',
        fontFamily: 'Arial',
        align: 'center'
      }
    );
    credits.setOrigin(0.5);
  }

  /**
   * Setup keyboard input
   */
  private setupInput(): void {
    this.input.keyboard!.on('keydown-UP', () => {
      this.selectOption(Math.max(0, this.selectedOption - 1));
    });

    this.input.keyboard!.on('keydown-DOWN', () => {
      this.selectOption(Math.min(this.menuOptions.length - 1, this.selectedOption + 1));
    });

    this.input.keyboard!.on('keydown-ENTER', () => {
      this.activateOption();
    });

    this.input.keyboard!.on('keydown-SPACE', () => {
      this.activateOption();
    });
  }

  /**
   * Select a menu option
   */
  private selectOption(index: number): void {
    // Deselect previous
    if (this.menuOptions[this.selectedOption]) {
      this.menuOptions[this.selectedOption].setColor('#ffffff');
      this.menuOptions[this.selectedOption].setScale(1);
    }

    this.selectedOption = index;

    // Select new
    if (this.menuOptions[this.selectedOption]) {
      this.menuOptions[this.selectedOption].setColor('#ffff00');
      this.menuOptions[this.selectedOption].setScale(1.1);
    }
  }

  /**
   * Activate selected option
   */
  private activateOption(): void {
    const option = this.menuOptions[this.selectedOption];
    if (option) {
      option.emit('pointerdown');
    }
  }

  /**
   * Start new game
   */
  private startNewGame(): void {
    this.levelSystem.resetProgress();
    this.levelSystem.setLevel(1);

    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MissionBriefingScene', { levelSystem: this.levelSystem });
    });
  }

  /**
   * Continue saved game
   */
  private continueGame(): void {
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MissionBriefingScene', { levelSystem: this.levelSystem });
    });
  }

  /**
   * Show high scores
   */
  private showHighScores(): void {
    const scores = HighScoreSystem.getHighScores();

    // Create overlay
    const overlay = this.add.rectangle(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2,
      SCREEN_WIDTH,
      SCREEN_HEIGHT,
      0x000000,
      0.9
    );
    overlay.setDepth(100);

    const title = this.add.text(
      SCREEN_WIDTH / 2,
      80,
      'HIGH SCORES',
      {
        fontSize: '48px',
        color: '#ffd700',
        fontFamily: 'Arial Black',
        stroke: '#000000',
        strokeThickness: 6
      }
    );
    title.setOrigin(0.5);
    title.setDepth(101);

    if (scores.length === 0) {
      const noScores = this.add.text(
        SCREEN_WIDTH / 2,
        SCREEN_HEIGHT / 2,
        'No high scores yet.\nStart playing to set records!',
        {
          fontSize: '24px',
          color: '#ffffff',
          fontFamily: 'Arial',
          align: 'center'
        }
      );
      noScores.setOrigin(0.5);
      noScores.setDepth(101);
    } else {
      let yOffset = 150;
      scores.slice(0, 10).forEach((score, index) => {
        const rankColor = index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#ffffff';

        const scoreText = this.add.text(
          SCREEN_WIDTH / 2,
          yOffset,
          `${index + 1}. ${score.score} pts - ${score.kills} kills - ${score.distance}m`,
          {
            fontSize: '20px',
            color: rankColor,
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 3
          }
        );
        scoreText.setOrigin(0.5);
        scoreText.setDepth(101);

        yOffset += 40;
      });
    }

    const closeText = this.add.text(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT - 60,
      'Press ESC to close',
      {
        fontSize: '18px',
        color: '#00ff00',
        fontFamily: 'Arial'
      }
    );
    closeText.setOrigin(0.5);
    closeText.setDepth(101);

    const closeHandler = () => {
      overlay.destroy();
      title.destroy();
      closeText.destroy();
      this.menuOptions.forEach(option => option.destroy());
      this.input.keyboard!.off('keydown-ESC', closeHandler);
      this.create(); // Recreate menu
    };

    this.input.keyboard!.once('keydown-ESC', closeHandler);
  }

  /**
   * Show story background
   */
  private showStory(): void {
    const overlay = this.add.rectangle(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2,
      SCREEN_WIDTH,
      SCREEN_HEIGHT,
      0x000000,
      0.95
    );
    overlay.setDepth(100);

    const storyText = `THE STORY SO FAR...

The year is 1985. A rogue military faction has seized control of strategic territories across three continents, threatening global stability.

As an elite special forces operative, you've been selected for Operation: Final Strike - a solo infiltration mission to dismantle their operations from within.

Your journey will take you through:

JUNGLE BASES - Dense vegetation hides enemy outposts
DESERT STRONGHOLDS - Fortified positions in the wasteland
ARCTIC INSTALLATIONS - Their final command center

Intelligence is limited. Resistance will be fierce. Success is not guaranteed.

But you are our only hope.

The fate of nations rests on your shoulders, Commander.

Good luck.`;

    const story = this.add.text(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2,
      storyText,
      {
        fontSize: '16px',
        color: '#00ff00',
        fontFamily: 'Courier New',
        align: 'center',
        lineSpacing: 8,
        wordWrap: { width: SCREEN_WIDTH - 100 }
      }
    );
    story.setOrigin(0.5);
    story.setDepth(101);

    const closeText = this.add.text(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT - 40,
      'Press ESC to close',
      {
        fontSize: '18px',
        color: '#ffff00',
        fontFamily: 'Arial'
      }
    );
    closeText.setOrigin(0.5);
    closeText.setDepth(101);

    const closeHandler = () => {
      overlay.destroy();
      story.destroy();
      closeText.destroy();
      this.input.keyboard!.off('keydown-ESC', closeHandler);
    };

    this.input.keyboard!.once('keydown-ESC', closeHandler);
  }

  /**
   * Show controls
   */
  private showControls(): void {
    const overlay = this.add.rectangle(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2,
      SCREEN_WIDTH,
      SCREEN_HEIGHT,
      0x000000,
      0.9
    );
    overlay.setDepth(100);

    const controlsText = `CONTROLS

MOVEMENT:
  WASD or Arrow Keys - Move in 8 directions

WEAPONS:
  SPACE - Shoot bullets (continuous fire)
  SHIFT - Throw grenade (area damage)

GAME:
  R - Restart (Game Over/Victory)
  ESC - Pause / Menu

TIPS:
  • Collect power-ups for temporary advantages
  • Grenades are powerful but limited
  • Complete objectives to finish each mission
  • High scores are saved automatically`;

    const controls = this.add.text(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2,
      controlsText,
      {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'Courier New',
        align: 'left',
        lineSpacing: 6
      }
    );
    controls.setOrigin(0.5);
    controls.setDepth(101);

    const closeText = this.add.text(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT - 40,
      'Press ESC to close',
      {
        fontSize: '18px',
        color: '#00ff00',
        fontFamily: 'Arial'
      }
    );
    closeText.setOrigin(0.5);
    closeText.setDepth(101);

    const closeHandler = () => {
      overlay.destroy();
      controls.destroy();
      closeText.destroy();
      this.input.keyboard!.off('keydown-ESC', closeHandler);
    };

    this.input.keyboard!.once('keydown-ESC', closeHandler);
  }
}
