/**
 * Test repeated key presses - user reports keys stop working after first press
 */

import { test, expect } from '@playwright/test';

test('Press W key multiple times in a row', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(2000);

  const getPos = async () => {
    return await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game.scene.scenes[0];
      const player = (scene as any).player;
      return { x: player.getX(), y: player.getY() };
    });
  };

  console.log('\n=== TESTING REPEATED W PRESSES ===');

  // Press 1
  const start1 = await getPos();
  await page.keyboard.down('w');
  await page.waitForTimeout(300);
  await page.keyboard.up('w');
  await page.waitForTimeout(100);
  const after1 = await getPos();
  console.log(`Press 1: Y ${start1.y} -> ${after1.y} (moved: ${start1.y !== after1.y})`);
  expect(after1.y).toBeLessThan(start1.y);

  // Press 2 - same key
  await page.waitForTimeout(200);
  const start2 = await getPos();
  await page.keyboard.down('w');
  await page.waitForTimeout(300);
  await page.keyboard.up('w');
  await page.waitForTimeout(100);
  const after2 = await getPos();
  console.log(`Press 2: Y ${start2.y} -> ${after2.y} (moved: ${start2.y !== after2.y})`);
  expect(after2.y).toBeLessThan(start2.y);

  // Press 3 - same key again
  await page.waitForTimeout(200);
  const start3 = await getPos();
  await page.keyboard.down('w');
  await page.waitForTimeout(300);
  await page.keyboard.up('w');
  await page.waitForTimeout(100);
  const after3 = await getPos();
  console.log(`Press 3: Y ${start3.y} -> ${after3.y} (moved: ${start3.y !== after3.y})`);
  expect(after3.y).toBeLessThan(start3.y);

  // Press 4 - same key again
  await page.waitForTimeout(200);
  const start4 = await getPos();
  await page.keyboard.down('w');
  await page.waitForTimeout(300);
  await page.keyboard.up('w');
  await page.waitForTimeout(100);
  const after4 = await getPos();
  console.log(`Press 4: Y ${start4.y} -> ${after4.y} (moved: ${start4.y !== after4.y})`);
  expect(after4.y).toBeLessThan(start4.y);

  console.log('✅ W key works on all 4 presses!');
});

test('Press each direction once then try again', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('canvas', { timeout: 10000 });
  await page.waitForTimeout(2000);

  const getPos = async () => {
    return await page.evaluate(() => {
      const game = (window as any).game;
      const scene = game.scene.scenes[0];
      const player = (scene as any).player;
      return { x: player.getX(), y: player.getY() };
    });
  };

  console.log('\n=== FIRST ROUND - PRESS EACH KEY ONCE ===');

  // Round 1: Press each key once
  const s1 = await getPos();
  await page.keyboard.down('w');
  await page.waitForTimeout(200);
  await page.keyboard.up('w');
  await page.waitForTimeout(100);
  const a1 = await getPos();
  console.log(`W: ${s1.y} -> ${a1.y} (moved: ${a1.y < s1.y})`);

  await page.keyboard.down('d');
  await page.waitForTimeout(200);
  await page.keyboard.up('d');
  await page.waitForTimeout(100);
  const a2 = await getPos();
  console.log(`D: ${a1.x} -> ${a2.x} (moved: ${a2.x > a1.x})`);

  await page.keyboard.down('s');
  await page.waitForTimeout(200);
  await page.keyboard.up('s');
  await page.waitForTimeout(100);
  const a3 = await getPos();
  console.log(`S: ${a2.y} -> ${a3.y} (moved: ${a3.y > a2.y})`);

  await page.keyboard.down('a');
  await page.waitForTimeout(200);
  await page.keyboard.up('a');
  await page.waitForTimeout(100);
  const a4 = await getPos();
  console.log(`A: ${a3.x} -> ${a4.x} (moved: ${a4.x < a3.x})`);

  console.log('\n=== SECOND ROUND - TRY EACH KEY AGAIN ===');

  // Round 2: Try each key again - THIS IS WHERE USER SAYS IT FAILS
  const s2 = await getPos();
  await page.keyboard.down('w');
  await page.waitForTimeout(200);
  await page.keyboard.up('w');
  await page.waitForTimeout(100);
  const a5 = await getPos();
  console.log(`W again: ${s2.y} -> ${a5.y} (moved: ${a5.y < s2.y})`);
  expect(a5.y).toBeLessThan(s2.y); // Should still work!

  await page.keyboard.down('d');
  await page.waitForTimeout(200);
  await page.keyboard.up('d');
  await page.waitForTimeout(100);
  const a6 = await getPos();
  console.log(`D again: ${a5.x} -> ${a6.x} (moved: ${a6.x > a5.x})`);
  expect(a6.x).toBeGreaterThan(a5.x); // Should still work!

  await page.keyboard.down('s');
  await page.waitForTimeout(200);
  await page.keyboard.up('s');
  await page.waitForTimeout(100);
  const a7 = await getPos();
  console.log(`S again: ${a6.y} -> ${a7.y} (moved: ${a7.y > a6.y})`);
  expect(a7.y).toBeGreaterThan(a6.y); // Should still work!

  await page.keyboard.down('a');
  await page.waitForTimeout(200);
  await page.keyboard.up('a');
  await page.waitForTimeout(100);
  const a8 = await getPos();
  console.log(`A again: ${a7.x} -> ${a8.x} (moved: ${a8.x < a7.x})`);
  expect(a8.x).toBeLessThan(a7.x); // Should still work!

  console.log('✅ All keys work on second round!');
});
