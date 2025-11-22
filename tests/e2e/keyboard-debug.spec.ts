/**
 * Debug keyboard event handling
 */

import { test } from '@playwright/test';

test('Debug keyboard event handling', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(2000);

  // Check keyboard state
  console.log('\n=== CHECKING KEYBOARD STATE ===');

  const keyboardInfo = await page.evaluate(() => {
    const game = (window as any).game;
    const scene = game.scene.scenes[0];
    const player = (scene as any).player;

    // Try to access the keys
    return {
      hasKeyW: !!(player as any).keyW,
      hasKeyA: !!(player as any).keyA,
      hasKeyS: !!(player as any).keyS,
      hasKeyD: !!(player as any).keyD,
      hasCursors: !!(player as any).cursors,
    };
  });

  console.log('Player keyboard setup:', keyboardInfo);

  // Now check if keys are being detected
  console.log('\n=== TESTING KEY DOWN EVENT ===');

  await page.keyboard.down('w');
  await page.waitForTimeout(100);

  const keyStateWhileHeld = await page.evaluate(() => {
    const game = (window as any).game;
    const scene = game.scene.scenes[0];
    const player = (scene as any).player;
    const keyW = (player as any).keyW;
    const cursors = (player as any).cursors;

    return {
      keyWExists: !!keyW,
      keyWIsDown: keyW ? keyW.isDown : false,
      cursorUpIsDown: cursors ? cursors.up.isDown : false,
    };
  });

  console.log('Key state while W is held:', keyStateWhileHeld);

  await page.keyboard.up('w');
  await page.waitForTimeout(100);

  const keyStateAfterRelease = await page.evaluate(() => {
    const game = (window as any).game;
    const scene = game.scene.scenes[0];
    const player = (scene as any).player;
    const keyW = (player as any).keyW;

    return {
      keyWIsDown: keyW ? keyW.isDown : false,
    };
  });

  console.log('Key state after release:', keyStateAfterRelease);

  // Test if holding works
  console.log('\n=== TESTING HOLD AND MOVE ===');

  const beforeMove = await page.evaluate(() => {
    const game = (window as any).game;
    const scene = game.scene.scenes[0];
    const player = (scene as any).player;
    return { x: player.getX(), y: player.getY() };
  });

  await page.keyboard.down('w');
  await page.waitForTimeout(500);
  await page.keyboard.up('w');
  await page.waitForTimeout(100);

  const afterMove = await page.evaluate(() => {
    const game = (window as any).game;
    const scene = game.scene.scenes[0];
    const player = (scene as any).player;
    return { x: player.getX(), y: player.getY() };
  });

  console.log('Before move:', beforeMove);
  console.log('After move:', afterMove);
  console.log('Did move:', beforeMove.y !== afterMove.y);
});
