/**
 * Game Configuration
 * Central location for all game constants and tuning parameters
 */

// Display Configuration
// NES resolution (256x224) scaled 3x for modern displays
export const SCREEN_WIDTH = 768;  // 256 * 3
export const SCREEN_HEIGHT = 672; // 224 * 3
export const SCALE_FACTOR = 3;    // How much we scale from original NES

// Player Configuration
// Original Commando uses 1 pixel/frame at 60fps = 60 pixels/second
// We scale by 3x, so: 3 pixels/frame = 180 pixels/second (at 60fps delta ~16.67ms)
export const PLAYER_SPEED_PER_FRAME = 3; // pixels per frame (matches NES scaled)
export const PLAYER_FIRE_RATE = 150; // milliseconds between shots
export const PLAYER_SIZE = { width: 24, height: 32 }; // Scaled hitbox
export const PLAYER_INITIAL_LIVES = 3; // Starting lives
export const PLAYER_RESPAWN_INVINCIBILITY_TIME = 2000; // milliseconds of invincibility after respawn

// Bullet Configuration
export const BULLET_SPEED = 500;

// Grenade Configuration
export const GRENADE_INITIAL_COUNT = 10; // Starting grenades
export const GRENADE_THROW_SPEED = 300; // Initial throw velocity
export const GRENADE_GRAVITY = 600; // Gravity pulling grenade down
export const GRENADE_EXPLOSION_RADIUS = 80; // Damage radius in pixels
export const GRENADE_EXPLOSION_DELAY = 800; // milliseconds before explosion
export const GRENADE_ARC_ANGLE = -45; // degrees for throw arc

// Enemy Configuration
export const SOLDIER_SPEED_MIN = 80;
export const SOLDIER_SPEED_MAX = 120;
export const SOLDIER_HEALTH = 1;
export const SOLDIER_POINTS = 100;

export const TANK_SPEED = 50;
export const TANK_HEALTH = 3;
export const TANK_POINTS = 300;

export const JEEP_SPEED_MIN = 150;
export const JEEP_SPEED_MAX = 200;
export const JEEP_HEALTH = 2;
export const JEEP_POINTS = 200;

export const KNIFE_SOLDIER_SPEED_MIN = 180;
export const KNIFE_SOLDIER_SPEED_MAX = 220;
export const KNIFE_SOLDIER_HEALTH = 1;
export const KNIFE_SOLDIER_POINTS = 150;

export const ROCKET_LAUNCHER_SPEED = 40;
export const ROCKET_LAUNCHER_HEALTH = 2;
export const ROCKET_LAUNCHER_POINTS = 250;
export const ROCKET_LAUNCHER_MIN_DISTANCE = 200; // Minimum distance from player to fire

export const COVERED_SOLDIER_SPEED = 100;
export const COVERED_SOLDIER_HEALTH = 2;
export const COVERED_SOLDIER_POINTS = 175;
export const COVERED_SOLDIER_COVER_TIME = 2000; // milliseconds in cover
export const COVERED_SOLDIER_EXPOSED_TIME = 1500; // milliseconds exposed

export const BUNKER_HEALTH = 5;
export const BUNKER_POINTS = 400;

export const BOSS_SPEED = 60;
export const BOSS_HEALTH = 20;
export const BOSS_POINTS = 1000;

// Spawn Configuration
export const ENEMY_SPAWN_RATE_INITIAL = 1200; // milliseconds
export const ENEMY_SPAWN_RATE_MIN = 400; // fastest spawn rate
export const ENEMY_SPAWN_COUNT_MIN = 1;
export const ENEMY_SPAWN_COUNT_MAX = 3;

// Spawn distribution (should sum to 1.0)
export const SPAWN_CHANCE_SOLDIER = 0.6; // 60%
export const SPAWN_CHANCE_JEEP = 0.25;   // 25%
export const SPAWN_CHANCE_TANK = 0.15;   // 15%

// Spawn locations (probability)
export const SPAWN_FROM_TOP = 0.7;    // 70% from top
export const SPAWN_FROM_LEFT = 0.15;  // 15% from left
export const SPAWN_FROM_RIGHT = 0.15; // 15% from right

// World Configuration
export const SCROLL_SPEED = 80;
export const BACKGROUND_TILE_SIZE = 64;
export const VICTORY_DISTANCE = 500; // Distance required to win (in meters)

// Particle Effects
export const EXPLOSION_PARTICLE_COUNT = 16;
export const EXPLOSION_PARTICLE_SPEED_MIN = 50;
export const EXPLOSION_PARTICLE_SPEED_MAX = 200;
export const EXPLOSION_PARTICLE_LIFESPAN = 300;
export const EXPLOSION_PARTICLE_GRAVITY = 100;
