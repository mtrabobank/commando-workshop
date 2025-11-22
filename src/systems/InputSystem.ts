/**
 * Input System
 * Centralizes keyboard input handling
 *
 * Responsibilities:
 * - Create and manage keyboard bindings
 * - Provide input state access to game entities
 * - Support multiple input methods (keyboard, potentially gamepad later)
 *
 * Single Responsibility: Manage all input bindings and state
 */

import Phaser from 'phaser';

export class InputSystem {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: any;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private shiftKey!: Phaser.Input.Keyboard.Key; // For grenade throwing

  /**
   * Initialize keyboard bindings
   * CRITICAL: No enableCapture parameter - that causes stuck keys!
   */
  setup(scene: Phaser.Scene): void {
    const keyboard = scene.input.keyboard!;

    // Arrow keys
    this.cursors = keyboard.createCursorKeys();

    // WASD keys - simple individual key creation (most reliable)
    this.wasdKeys = {
      w: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      a: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      s: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      d: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };

    // Space bar for shooting - NO capture parameter
    this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Left Shift for grenade throwing - NO capture parameter
    this.shiftKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
  }

  /**
   * Get arrow key cursors
   */
  getCursors(): Phaser.Types.Input.Keyboard.CursorKeys {
    return this.cursors;
  }

  /**
   * Get WASD keys
   */
  getWASDKeys(): any {
    return this.wasdKeys;
  }

  /**
   * Get space key
   */
  getSpaceKey(): Phaser.Input.Keyboard.Key {
    return this.spaceKey;
  }

  /**
   * Check if shooting key is pressed (continuous fire)
   */
  isShootingPressed(): boolean {
    return this.spaceKey.isDown;
  }

  /**
   * Get shift key (for grenade throwing)
   */
  getShiftKey(): Phaser.Input.Keyboard.Key {
    return this.shiftKey;
  }

  /**
   * Check if grenade key was JUST pressed (single press, not hold)
   * Uses Phaser's JustDown to prevent continuous throwing
   */
  isGrenadeJustPressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.shiftKey);
  }
}
