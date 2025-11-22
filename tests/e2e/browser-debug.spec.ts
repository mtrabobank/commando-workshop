/**
 * Debug test to check browser console errors
 */

import { test, expect } from '@playwright/test';

test('Check for console errors and test manual controls', async ({ page }) => {
  const consoleMessages: string[] = [];
  const consoleErrors: string[] = [];

  // Capture console messages
  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`;
    consoleMessages.push(text);
    if (msg.type() === 'error') {
      consoleErrors.push(text);
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    consoleErrors.push(`[pageerror] ${error.message}`);
  });

  await page.goto('http://localhost:5173/');
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(3000);

  // Log all console messages
  console.log('\n=== CONSOLE MESSAGES ===');
  consoleMessages.forEach(msg => console.log(msg));

  // Check for errors
  console.log('\n=== CONSOLE ERRORS ===');
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(err => console.log(err));
  } else {
    console.log('No errors found!');
  }

  // Check if game and player exist
  const gameState = await page.evaluate(() => {
    const game = (window as any).game;
    if (!game) return { error: 'Game not found on window' };

    const scene = game.scene.scenes[0];
    if (!scene) return { error: 'Scene not found' };

    const player = (scene as any).player;
    if (!player) return { error: 'Player not found' };

    // Check keyboard state
    const keyboard = scene.input.keyboard;
    if (!keyboard) return { error: 'Keyboard not found' };

    return {
      gameExists: true,
      sceneKey: scene.scene.key,
      playerPosition: { x: player.getX(), y: player.getY() },
      keyboardExists: true,
    };
  });

  console.log('\n=== GAME STATE ===');
  console.log(JSON.stringify(gameState, null, 2));

  // Now try manual key presses and watch what happens
  console.log('\n=== TESTING MANUAL KEY PRESSES ===');

  const beforeW = await page.evaluate(() => {
    const game = (window as any).game;
    const scene = game.scene.scenes[0];
    const player = (scene as any).player;
    return { x: player.getX(), y: player.getY() };
  });
  console.log('Before W press:', beforeW);

  await page.keyboard.press('w');
  await page.waitForTimeout(500);

  const afterW = await page.evaluate(() => {
    const game = (window as any).game;
    const scene = game.scene.scenes[0];
    const player = (scene as any).player;
    return { x: player.getX(), y: player.getY() };
  });
  console.log('After W press:', afterW);
  console.log('Y changed:', beforeW.y !== afterW.y);

  // Expect no errors
  expect(consoleErrors.length).toBe(0);
});
