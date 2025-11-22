/**
 * Level System
 * Manages level progression, objectives, and mission structure
 * Single Responsibility: Coordinate level flow and objectives
 */

export interface LevelObjective {
  type: 'kills' | 'distance' | 'survive' | 'boss';
  target: number;
  description: string;
  completed: boolean;
}

export interface LevelData {
  number: number;
  name: string;
  briefing: string;
  environment: 'jungle' | 'desert' | 'arctic' | 'urban';
  objectives: LevelObjective[];
  victoryDistance: number;
  bossRequired: boolean;
  difficulty: number; // Multiplier for enemy stats
}

export interface LevelProgress {
  currentLevel: number;
  levelsCompleted: number[];
  totalScore: number;
  totalKills: number;
}

export class LevelSystem {
  private static readonly STORAGE_KEY = 'commando_level_progress';
  private currentLevel: number = 1;
  private levels: Map<number, LevelData> = new Map();

  constructor() {
    this.initializeLevels();
    this.loadProgress();
  }

  /**
   * Initialize all game levels with their stories and objectives
   */
  private initializeLevels(): void {
    // Level 1: Jungle Infiltration
    this.levels.set(1, {
      number: 1,
      name: 'OPERATION: JUNGLE STORM',
      briefing: `CLASSIFIED - TOP SECRET

Mission: Infiltrate enemy jungle base
Location: Sector 7, Dense Jungle Region

Intelligence reports indicate a significant enemy presence in the jungle region. Your mission is to advance 300 meters into enemy territory, eliminating hostile forces.

Primary Objectives:
- Advance 300 meters into enemy territory
- Eliminate at least 15 hostile combatants
- Survive the mission

Enemy Forces: Light resistance expected - soldiers, jeeps, and light armor.

Radio silence will be maintained. Extraction coordinates will be transmitted upon mission completion.

Good luck, Commander. The fate of the operation rests on your shoulders.`,
      environment: 'jungle',
      objectives: [
        {
          type: 'distance',
          target: 300,
          description: 'Advance 300m into enemy territory',
          completed: false
        },
        {
          type: 'kills',
          target: 15,
          description: 'Eliminate 15 enemy combatants',
          completed: false
        }
      ],
      victoryDistance: 300,
      bossRequired: false,
      difficulty: 1.0
    });

    // Level 2: Desert Outpost
    this.levels.set(2, {
      number: 2,
      name: 'OPERATION: DESERT HAWK',
      briefing: `CLASSIFIED - TOP SECRET

Mission: Assault enemy desert outpost
Location: Sector 12, Arid Wasteland

Excellent work on the jungle operation, Commander. Our next target is a fortified desert outpost. Enemy has deployed advanced units including knife infantry and covered positions.

Primary Objectives:
- Push 400 meters through desert territory
- Neutralize 25 enemy combatants
- Destroy defensive bunker installations

Enemy Forces: Moderate resistance - enhanced infantry tactics expected.

The desert offers no cover. Speed and precision are your allies.

Godspeed, Commander.`,
      environment: 'desert',
      objectives: [
        {
          type: 'distance',
          target: 400,
          description: 'Advance 400m through desert',
          completed: false
        },
        {
          type: 'kills',
          target: 25,
          description: 'Eliminate 25 enemy combatants',
          completed: false
        }
      ],
      victoryDistance: 400,
      bossRequired: false,
      difficulty: 1.3
    });

    // Level 3: Arctic Assault
    this.levels.set(3, {
      number: 3,
      name: 'OPERATION: FROZEN STRIKE',
      briefing: `CLASSIFIED - TOP SECRET

Mission: Eliminate enemy arctic installation
Location: Sector 19, Arctic Circle

Commander, satellite reconnaissance has identified a critical enemy installation in the arctic region. This is their main supply depot. Heavy resistance is guaranteed.

Primary Objectives:
- Penetrate 500 meters of defended territory
- Eliminate 35 enemy combatants
- Neutralize the installation commander (BOSS)

Enemy Forces: Heavy resistance - expect rocket launchers, bunkers, and a high-value target commanding the defense.

Temperatures are extreme. Mission time is limited. Strike hard and fast.

This is it, Commander. Make it count.`,
      environment: 'arctic',
      objectives: [
        {
          type: 'distance',
          target: 500,
          description: 'Advance 500m through arctic base',
          completed: false
        },
        {
          type: 'kills',
          target: 35,
          description: 'Eliminate 35 enemy combatants',
          completed: false
        },
        {
          type: 'boss',
          target: 1,
          description: 'Defeat installation commander',
          completed: false
        }
      ],
      victoryDistance: 500,
      bossRequired: true,
      difficulty: 1.6
    });
  }

  /**
   * Get data for a specific level
   */
  getLevelData(levelNumber: number): LevelData | undefined {
    return this.levels.get(levelNumber);
  }

  /**
   * Get current level data
   */
  getCurrentLevelData(): LevelData {
    return this.levels.get(this.currentLevel) || this.levels.get(1)!;
  }

  /**
   * Get current level number
   */
  getCurrentLevel(): number {
    return this.currentLevel;
  }

  /**
   * Get objectives for current level
   */
  getObjectives(): LevelObjective[] {
    const level = this.getCurrentLevelData();
    return level.objectives;
  }

  /**
   * Check if all objectives for current level are completed
   */
  areObjectivesComplete(kills: number, distance: number, bossDefeated: boolean): boolean {
    const level = this.getCurrentLevelData();

    for (const objective of level.objectives) {
      switch (objective.type) {
        case 'kills':
          if (kills < objective.target) return false;
          break;
        case 'distance':
          if (distance < objective.target) return false;
          break;
        case 'boss':
          if (!bossDefeated) return false;
          break;
      }
    }

    return true;
  }

  /**
   * Update objective progress
   */
  updateObjectives(kills: number, distance: number, bossDefeated: boolean): LevelObjective[] {
    const level = this.getCurrentLevelData();

    level.objectives.forEach(objective => {
      switch (objective.type) {
        case 'kills':
          objective.completed = kills >= objective.target;
          break;
        case 'distance':
          objective.completed = distance >= objective.target;
          break;
        case 'boss':
          objective.completed = bossDefeated;
          break;
      }
    });

    return level.objectives;
  }

  /**
   * Complete current level and advance to next
   */
  completeLevel(score: number, kills: number): void {
    const progress = this.getProgress();

    if (!progress.levelsCompleted.includes(this.currentLevel)) {
      progress.levelsCompleted.push(this.currentLevel);
    }

    progress.totalScore += score;
    progress.totalKills += kills;

    // Advance to next level if available
    if (this.levels.has(this.currentLevel + 1)) {
      this.currentLevel++;
      progress.currentLevel = this.currentLevel;
    }

    this.saveProgress(progress);
  }

  /**
   * Reset to a specific level
   */
  setLevel(levelNumber: number): void {
    if (this.levels.has(levelNumber)) {
      this.currentLevel = levelNumber;
    }
  }

  /**
   * Get total number of levels
   */
  getTotalLevels(): number {
    return this.levels.size;
  }

  /**
   * Check if there are more levels
   */
  hasNextLevel(): boolean {
    return this.levels.has(this.currentLevel + 1);
  }

  /**
   * Save progress to localStorage
   */
  private saveProgress(progress: LevelProgress): void {
    try {
      localStorage.setItem(LevelSystem.STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save level progress:', error);
    }
  }

  /**
   * Load progress from localStorage
   */
  private loadProgress(): void {
    try {
      const stored = localStorage.getItem(LevelSystem.STORAGE_KEY);
      if (stored) {
        const progress: LevelProgress = JSON.parse(stored);
        this.currentLevel = progress.currentLevel;
      }
    } catch (error) {
      console.error('Failed to load level progress:', error);
    }
  }

  /**
   * Get current progress
   */
  getProgress(): LevelProgress {
    try {
      const stored = localStorage.getItem(LevelSystem.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to get progress:', error);
    }

    return {
      currentLevel: 1,
      levelsCompleted: [],
      totalScore: 0,
      totalKills: 0
    };
  }

  /**
   * Reset all progress
   */
  resetProgress(): void {
    this.currentLevel = 1;
    const progress: LevelProgress = {
      currentLevel: 1,
      levelsCompleted: [],
      totalScore: 0,
      totalKills: 0
    };
    this.saveProgress(progress);
  }
}
