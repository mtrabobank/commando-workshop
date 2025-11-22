/**
 * E2E Tests for Game Controls
 * Tests all keyboard inputs to ensure they work without locking
 */

import { test, expect, Page } from '@playwright/test';

// Helper to wait for game to load
async function waitForGameLoad(page: Page) {
  await page.goto('/');
  // Wait for Phaser canvas to appear
  await page.waitForSelector('canvas', { timeout: 10000 });
  // Wait a bit for game to fully initialize
  await page.waitForTimeout(2000);
}

// Helper to get player position from the game
async function getPlayerPosition(page: Page): Promise<{ x: number; y: number }> {
  return await page.evaluate(() => {
    const game = (window as any).game;
    if (!game) throw new Error('Game not found');

    const scene = game.scene.scenes[0];
    if (!scene) throw new Error('Scene not found');

    // Access player through the scene's player property
    const player = (scene as any).player;
    if (!player) throw new Error('Player not found');

    return {
      x: player.getX(),
      y: player.getY()
    };
  });
}

// Helper to get grenade count
async function getGrenadeCount(page: Page): Promise<number> {
  return await page.evaluate(() => {
    const game = (window as any).game;
    const scene = game.scene.scenes[0];
    const player = (scene as any).player;
    return player.getGrenadeCount();
  });
}

// Helper to count bullets
async function getBulletCount(page: Page): Promise<number> {
  return await page.evaluate(() => {
    const game = (window as any).game;
    const scene = game.scene.scenes[0];
    return (scene as any).bullets.length;
  });
}

test.describe('Game Controls', () => {
  test.beforeEach(async ({ page }) => {
    await waitForGameLoad(page);
  });

  test('Player moves UP with W key without locking', async ({ page }) => {
    const initialPos = await getPlayerPosition(page);

    // Press and hold W for movement
    await page.keyboard.down('w');
    await page.waitForTimeout(500); // Hold for 500ms
    await page.keyboard.up('w');
    await page.waitForTimeout(100); // Let physics settle

    const afterUpPos = await getPlayerPosition(page);

    // Y should decrease (moving up)
    expect(afterUpPos.y).toBeLessThan(initialPos.y);
    console.log(`UP movement: Y went from ${initialPos.y} to ${afterUpPos.y}`);

    // Now test that we can move DOWN after moving UP (check for lock)
    await page.keyboard.down('s');
    await page.waitForTimeout(500);
    await page.keyboard.up('s');
    await page.waitForTimeout(100);

    const afterDownPos = await getPlayerPosition(page);

    // Y should increase (moving down) - this will FAIL if movement is locked
    expect(afterDownPos.y).toBeGreaterThan(afterUpPos.y);
    console.log(`DOWN movement after UP: Y went from ${afterUpPos.y} to ${afterDownPos.y}`);
  });

  test('Player moves DOWN with S key without locking', async ({ page }) => {
    const initialPos = await getPlayerPosition(page);

    await page.keyboard.down('s');
    await page.waitForTimeout(500);
    await page.keyboard.up('s');
    await page.waitForTimeout(100);

    const afterDownPos = await getPlayerPosition(page);
    expect(afterDownPos.y).toBeGreaterThan(initialPos.y);
    console.log(`DOWN movement: Y went from ${initialPos.y} to ${afterDownPos.y}`);
  });

  test('Player moves LEFT with A key without locking', async ({ page }) => {
    const initialPos = await getPlayerPosition(page);

    await page.keyboard.down('a');
    await page.waitForTimeout(500);
    await page.keyboard.up('a');
    await page.waitForTimeout(100);

    const afterLeftPos = await getPlayerPosition(page);

    // X should decrease (moving left)
    expect(afterLeftPos.x).toBeLessThan(initialPos.x);
    console.log(`LEFT movement: X went from ${initialPos.x} to ${afterLeftPos.x}`);

    // Test that we can move RIGHT after LEFT (check for lock)
    await page.keyboard.down('d');
    await page.waitForTimeout(500);
    await page.keyboard.up('d');
    await page.waitForTimeout(100);

    const afterRightPos = await getPlayerPosition(page);
    expect(afterRightPos.x).toBeGreaterThan(afterLeftPos.x);
    console.log(`RIGHT movement after LEFT: X went from ${afterLeftPos.x} to ${afterRightPos.x}`);
  });

  test('Player moves RIGHT with D key without locking', async ({ page }) => {
    const initialPos = await getPlayerPosition(page);

    await page.keyboard.down('d');
    await page.waitForTimeout(500);
    await page.keyboard.up('d');
    await page.waitForTimeout(100);

    const afterRightPos = await getPlayerPosition(page);
    expect(afterRightPos.x).toBeGreaterThan(initialPos.x);
    console.log(`RIGHT movement: X went from ${initialPos.x} to ${afterRightPos.x}`);
  });

  test('Player can move in all 4 directions sequentially (no locking)', async ({ page }) => {
    const start = await getPlayerPosition(page);
    console.log(`Starting position: (${start.x}, ${start.y})`);

    // UP
    await page.keyboard.down('w');
    await page.waitForTimeout(300);
    await page.keyboard.up('w');
    await page.waitForTimeout(100);
    const afterUp = await getPlayerPosition(page);
    expect(afterUp.y).toBeLessThan(start.y);
    console.log(`After UP: (${afterUp.x}, ${afterUp.y})`);

    // RIGHT
    await page.keyboard.down('d');
    await page.waitForTimeout(300);
    await page.keyboard.up('d');
    await page.waitForTimeout(100);
    const afterRight = await getPlayerPosition(page);
    expect(afterRight.x).toBeGreaterThan(afterUp.x);
    console.log(`After RIGHT: (${afterRight.x}, ${afterRight.y})`);

    // DOWN
    await page.keyboard.down('s');
    await page.waitForTimeout(300);
    await page.keyboard.up('s');
    await page.waitForTimeout(100);
    const afterDown = await getPlayerPosition(page);
    expect(afterDown.y).toBeGreaterThan(afterRight.y);
    console.log(`After DOWN: (${afterDown.x}, ${afterDown.y})`);

    // LEFT
    await page.keyboard.down('a');
    await page.waitForTimeout(300);
    await page.keyboard.up('a');
    await page.waitForTimeout(100);
    const afterLeft = await getPlayerPosition(page);
    expect(afterLeft.x).toBeLessThan(afterDown.x);
    console.log(`After LEFT: (${afterLeft.x}, ${afterLeft.y})`);

    console.log('✅ All 4 directions work sequentially without locking!');
  });

  test('Arrow keys work for movement', async ({ page }) => {
    const initialPos = await getPlayerPosition(page);

    // Test Arrow Up
    await page.keyboard.down('ArrowUp');
    await page.waitForTimeout(300);
    await page.keyboard.up('ArrowUp');
    await page.waitForTimeout(100);

    const afterArrowUp = await getPlayerPosition(page);
    expect(afterArrowUp.y).toBeLessThan(initialPos.y);
    console.log(`Arrow UP works: Y went from ${initialPos.y} to ${afterArrowUp.y}`);
  });

  test('Space bar shoots bullets continuously', async ({ page }) => {
    const initialBullets = await getBulletCount(page);

    // Hold space for continuous fire
    await page.keyboard.down(' ');
    await page.waitForTimeout(1000); // Hold for 1 second
    await page.keyboard.up(' ');
    await page.waitForTimeout(100);

    const afterBullets = await getBulletCount(page);

    // Should have fired multiple bullets
    expect(afterBullets).toBeGreaterThan(initialBullets);
    console.log(`Fired ${afterBullets - initialBullets} bullets`);
  });

  test('Shift throws only ONE grenade per press (not all grenades)', async ({ page }) => {
    const initialGrenades = await getGrenadeCount(page);
    console.log(`Starting grenades: ${initialGrenades}`);

    // Press Shift once (not hold)
    await page.keyboard.press('Shift');
    await page.waitForTimeout(200);

    const afterOnePress = await getGrenadeCount(page);
    console.log(`After 1 press: ${afterOnePress} grenades`);

    // Should have thrown exactly 1 grenade
    expect(afterOnePress).toBe(initialGrenades - 1);

    // Press again
    await page.keyboard.press('Shift');
    await page.waitForTimeout(200);

    const afterTwoPress = await getGrenadeCount(page);
    console.log(`After 2 presses: ${afterTwoPress} grenades`);

    // Should have thrown exactly 1 more grenade
    expect(afterTwoPress).toBe(initialGrenades - 2);
  });

  test('Holding Shift does NOT spam all grenades', async ({ page }) => {
    const initialGrenades = await getGrenadeCount(page);
    console.log(`Starting grenades: ${initialGrenades}`);

    // Hold Shift for 2 seconds
    await page.keyboard.down('Shift');
    await page.waitForTimeout(2000);
    await page.keyboard.up('Shift');
    await page.waitForTimeout(200);

    const afterHolding = await getGrenadeCount(page);
    console.log(`After holding Shift: ${afterHolding} grenades`);

    // Should NOT have thrown all grenades, maybe 2-3 at most
    expect(afterHolding).toBeGreaterThan(initialGrenades - 5);
    expect(afterHolding).toBeLessThan(initialGrenades);
  });

  test('Movement works after shooting', async ({ page }) => {
    // Shoot first
    await page.keyboard.down(' ');
    await page.waitForTimeout(500);
    await page.keyboard.up(' ');
    await page.waitForTimeout(100);

    // Now try to move
    const beforeMove = await getPlayerPosition(page);

    await page.keyboard.down('w');
    await page.waitForTimeout(300);
    await page.keyboard.up('w');
    await page.waitForTimeout(100);

    const afterMove = await getPlayerPosition(page);

    // Movement should still work
    expect(afterMove.y).toBeLessThan(beforeMove.y);
    console.log('✅ Movement works after shooting');
  });

  test('Movement works after throwing grenade', async ({ page }) => {
    // Throw grenade first
    await page.keyboard.press('Shift');
    await page.waitForTimeout(300);

    // Now try to move
    const beforeMove = await getPlayerPosition(page);

    await page.keyboard.down('w');
    await page.waitForTimeout(300);
    await page.keyboard.up('w');
    await page.waitForTimeout(100);

    const afterMove = await getPlayerPosition(page);

    // Movement should still work
    expect(afterMove.y).toBeLessThan(beforeMove.y);
    console.log('✅ Movement works after throwing grenade');
  });

  test('Can shoot while moving', async ({ page }) => {
    const initialBullets = await getBulletCount(page);

    // Move and shoot at the same time
    await page.keyboard.down('w');
    await page.keyboard.down(' ');
    await page.waitForTimeout(500);
    await page.keyboard.up('w');
    await page.keyboard.up(' ');
    await page.waitForTimeout(100);

    const afterBullets = await getBulletCount(page);

    // Should have fired bullets while moving
    expect(afterBullets).toBeGreaterThan(initialBullets);
    console.log('✅ Can shoot while moving');
  });
});
