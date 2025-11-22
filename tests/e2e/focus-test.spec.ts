/**
 * Test if canvas focus affects keyboard input
 */

import { test } from '@playwright/test';

test('Test keyboard WITHOUT clicking canvas first', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(2000);

  console.log('\n=== WITHOUT CLICKING CANVAS ===');

  const before = await page.evaluate(() => {
    const game = (window as any).game;
    const scene = game.scene.scenes[0];
    const player = (scene as any).player;
    return { x: player.getX(), y: player.getY() };
  });

  // Try to move WITHOUT clicking canvas
  await page.keyboard.down('w');
  await page.waitForTimeout(500);
  await page.keyboard.up('w');
  await page.waitForTimeout(100);

  const after = await page.evaluate(() => {
    const game = (window as any).game;
    const scene = game.scene.scenes[0];
    const player = (scene as any).player;
    return { x: player.getX(), y: player.getY() };
  });

  console.log('Before:', before);
  console.log('After:', after);
  console.log('Moved:', before.y !== after.y);
});

test('Test keyboard AFTER clicking canvas', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  const canvas = await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(2000);

  console.log('\n=== AFTER CLICKING CANVAS ===');

  // Click canvas to give it focus
  await canvas.click();
  await page.waitForTimeout(100);

  const before = await page.evaluate(() => {
    const game = (window as any).game;
    const scene = game.scene.scenes[0];
    const player = (scene as any).player;
    return { x: player.getX(), y: player.getY() };
  });

  // Try to move AFTER clicking canvas
  await page.keyboard.down('w');
  await page.waitForTimeout(500);
  await page.keyboard.up('w');
  await page.waitForTimeout(100);

  const after = await page.evaluate(() => {
    const game = (window as any).game;
    const scene = game.scene.scenes[0];
    const player = (scene as any).player;
    return { x: player.getX(), y: player.getY() };
  });

  console.log('Before:', before);
  console.log('After:', after);
  console.log('Moved:', before.y !== after.y);
});
