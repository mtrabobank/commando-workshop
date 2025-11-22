/**
 * High Score System
 * Manages high score persistence using localStorage
 * Single Responsibility: Store and retrieve high scores
 */

export interface HighScoreEntry {
  score: number;
  kills: number;
  distance: number;
  date: string;
}

export class HighScoreSystem {
  private static readonly STORAGE_KEY = 'commando_high_scores';
  private static readonly MAX_SCORES = 10; // Keep top 10 scores

  /**
   * Save a new score if it qualifies for the high score list
   * Returns true if score was saved (made it into top 10)
   */
  static saveScore(score: number, kills: number, distance: number): boolean {
    const scores = this.getHighScores();
    const newEntry: HighScoreEntry = {
      score,
      kills,
      distance,
      date: new Date().toISOString()
    };

    scores.push(newEntry);

    // Sort by score (descending)
    scores.sort((a, b) => b.score - a.score);

    // Keep only top 10
    const topScores = scores.slice(0, this.MAX_SCORES);

    // Save to localStorage
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(topScores));

      // Check if the new score made it into top 10
      return topScores.some(entry =>
        entry.score === score &&
        entry.kills === kills &&
        entry.distance === distance
      );
    } catch (error) {
      console.error('Failed to save high score:', error);
      return false;
    }
  }

  /**
   * Get all high scores from localStorage
   */
  static getHighScores(): HighScoreEntry[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return [];
      }
      return JSON.parse(stored) as HighScoreEntry[];
    } catch (error) {
      console.error('Failed to load high scores:', error);
      return [];
    }
  }

  /**
   * Get the highest score ever achieved
   */
  static getHighestScore(): number {
    const scores = this.getHighScores();
    if (scores.length === 0) {
      return 0;
    }
    return scores[0].score;
  }

  /**
   * Check if a score would make it into the top 10
   */
  static isHighScore(score: number): boolean {
    const scores = this.getHighScores();
    if (scores.length < this.MAX_SCORES) {
      return true; // Less than 10 scores, any score qualifies
    }
    return score > scores[scores.length - 1].score;
  }

  /**
   * Clear all high scores (for testing or reset)
   */
  static clearHighScores(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear high scores:', error);
    }
  }

  /**
   * Format a date for display
   */
  static formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
