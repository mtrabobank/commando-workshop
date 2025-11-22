# Commando Workshop

A story-driven, top-down military shooter inspired by the classic NES Commando. Fight through three distinct operations across jungle, desert, and arctic environments with a rich narrative and mission-based gameplay.

Built with **TypeScript** and **Phaser.js** using **SOLID principles** and clean architecture.

## Features

### 📖 **Story-Driven Campaign**
- **3 unique missions** with distinct environments (Jungle → Desert → Arctic)
- **Narrative briefings** before each mission with classified intel
- **Mission objectives** that drive gameplay (distance, kills, boss battles)
- **Progressive storyline** culminating in a final showdown
- **Campaign progress saving** - Continue where you left off

### 🎮 **Core Gameplay**
- **Smooth 8-directional movement** (WASD + Arrow keys)
- 🔫 **Dual weapon system** - continuous fire bullets and area-effect grenades
- 💥 **Rich particle effects** and visual polish
- 💖 **Lives system** - Start with 3 lives, respawn with temporary invincibility
- 🎁 **Power-up system** - Speed Boost, Weapon Upgrade, Shield, and Grenade Packs

### 🤖 **Enemy Variety**
- **8 unique enemy types** with distinct AI behaviors:
  - Soldiers, Tanks, Jeeps (Basic units)
  - Knife Soldiers, Rocket Launchers (Advanced units)
  - Covered Soldiers, Bunkers (Tactical units)
  - Bosses (Multi-phase encounters)
- **Progressive difficulty** - enemies unlock as missions advance
- **Dynamic spawn system** - adapts to player progress

### 🎨 **Visual & Audio**
- **Detailed procedural graphics** - Characters, vehicles, and environments
- **Environmental elements** - Trees, rocks, buildings, water hazards
- 🎵 **Complete sound system** - Procedurally generated audio for all actions
- **Atmospheric UI** - Military-themed menus and briefing screens

### 🏆 **Progression & Replayability**
- **High score persistence** - Top 10 scores with timestamps
- **Level progression tracking** - Unlock missions sequentially
- **Multiple victory conditions** - Each mission has unique objectives
- **Campaign statistics** - Total score and kills across all missions

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Game

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Controls

- **Arrow Keys** or **WASD**: Move in 8 directions
- **Spacebar**: Shoot bullets (continuous fire)
- **Shift**: Throw grenade (area-of-effect damage)
- **R** (Game Over/Victory): Restart game

## Architecture

This project follows **SOLID principles** and clean architecture patterns for maximum maintainability and extensibility.

### Project Structure

```
commando_workshop/
├── src/
│   ├── main.ts                 # Game entry point
│   ├── config/
│   │   └── GameConfig.ts       # All game constants and tuning
│   ├── scenes/
│   │   ├── MainMenuScene.ts    # Main menu with story & options
│   │   ├── MissionBriefingScene.ts # Story & objective briefings
│   │   └── GameScene.ts        # Main gameplay scene
│   ├── entities/
│   │   ├── Player.ts           # Player entity with power-up support
│   │   ├── Bullet.ts           # Bullet projectile
│   │   ├── Grenade.ts          # Grenade projectile with AoE
│   │   ├── enemies/
│   │   │   ├── Enemy.ts        # Abstract enemy base class
│   │   │   ├── Soldier.ts      # Basic soldier (varied patterns)
│   │   │   ├── Tank.ts         # Heavy tank (slow, high HP)
│   │   │   ├── Jeep.ts         # Fast jeep (sweeping attacks)
│   │   │   ├── KnifeSoldier.ts # Melee rusher (fast, aggressive)
│   │   │   ├── RocketLauncher.ts # Kiting ranged unit
│   │   │   ├── CoveredSoldier.ts # Takes cover periodically
│   │   │   ├── Bunker.ts       # Stationary defensive structure
│   │   │   └── Boss.ts         # Multi-phase boss enemy
│   │   └── powerups/
│   │       ├── PowerUp.ts      # Abstract power-up base
│   │       ├── GrenadePack.ts  # +5 grenades
│   │       ├── SpeedBoost.ts   # 1.5x speed for 10s
│   │       ├── Shield.ts       # Invincibility for 8s
│   │       └── WeaponUpgrade.ts # 2x fire rate for 15s
│   ├── systems/
│   │   ├── CollisionSystem.ts  # Collision detection & resolution
│   │   ├── SpawnSystem.ts      # Progressive enemy spawning
│   │   ├── SoundSystem.ts      # Web Audio procedural sounds
│   │   ├── HighScoreSystem.ts  # localStorage persistence
│   │   ├── LevelSystem.ts      # Campaign & mission management
│   │   └── InputSystem.ts      # Input management
│   ├── graphics/
│   │   └── TextureFactory.ts   # Procedural texture generation
│   ├── ui/
│   │   └── GameUI.ts           # HUD, game over, and victory screens
│   └── types/
│       └── index.ts            # TypeScript enums and types
├── docs/
│   ├── ARCHITECTURE.md         # Architecture overview
│   └── COMPONENTS.md           # Component documentation
├── tests/
│   └── e2e/                    # End-to-end tests
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Key Design Principles

1. **Single Responsibility** - Each file/class has one clear purpose
2. **Open/Closed** - Easy to extend (add new enemies) without modifying existing code
3. **Separation of Concerns** - Entities, systems, and UI are cleanly separated
4. **Dependency Inversion** - Systems depend on abstractions, not concrete implementations

### Documentation

- **[Architecture Overview](docs/ARCHITECTURE.md)** - High-level architecture and design decisions
- **[Component Documentation](docs/COMPONENTS.md)** - Detailed component API and responsibilities

## Adding New Features

### Add a New Enemy Type

1. Create `src/entities/enemies/NewEnemy.ts`
2. Extend the `Enemy` base class
3. Implement `updateMovement()` method with custom AI
4. Add to `EnemyType` enum in `src/types/index.ts`
5. Add configuration constants in `GameConfig.ts` (speed, health, points)
6. Update scoring in `CollisionSystem.getPointsForEnemy()`
7. Add to spawn distribution in `SpawnSystem.createRandomEnemy()`

### Add a New Power-Up

1. Create `src/entities/powerups/NewPowerUp.ts`
2. Extend the `PowerUp` base class
3. Implement `apply(player)` method with power-up effect
4. Add to `PowerUpType` enum in `src/types/index.ts`
5. Update `SpawnSystem.createRandomPowerUp()` spawn distribution
6. Add visual texture in `TextureFactory.ts` if needed

### Modify Game Balance

Edit constants in `src/config/GameConfig.ts` - all tuning parameters in one centralized location:
- Enemy stats (speed, health, points)
- Weapon parameters (fire rate, bullet speed)
- Spawn rates and distributions
- Power-up durations and multipliers
- Victory distance threshold

## AI-Friendly Codebase

This project is optimized for AI assistance:
- **Small, focused files** (< 200 lines each)
- **Clear naming conventions**
- **Comprehensive documentation**
- **Type safety** with TypeScript
- **Well-commented** code

## Game Design

### Campaign Structure

The game features a **3-mission campaign** with a progressive narrative:

**Mission 1: OPERATION JUNGLE STORM** (Jungle Environment)
- Objectives: Advance 300m, Eliminate 15 enemies
- Difficulty: 1.0x (Training ground)
- Environment: Dense jungle with tropical hazards
- Story: Initial infiltration into enemy territory

**Mission 2: OPERATION DESERT HAWK** (Desert Environment)
- Objectives: Advance 400m, Eliminate 25 enemies
- Difficulty: 1.3x (Moderate resistance)
- Environment: Arid wasteland with fortified positions
- Story: Assault on enemy desert outpost

**Mission 3: OPERATION FROZEN STRIKE** (Arctic Environment)
- Objectives: Advance 500m, Eliminate 35 enemies, Defeat Boss
- Difficulty: 1.6x (Heavy resistance)
- Environment: Frozen tundra with final command center
- Story: Final assault on enemy installation commander

Progress is **automatically saved** and you can continue your campaign from the main menu.

### Enemy Types

#### Early Game (0-100m)
- **Soldiers** (60%, 1 HP, 100 pts) - Chase player with varied movement patterns
- **Jeeps** (25%, 2 HP, 200 pts) - Fast sweeping attacks
- **Tanks** (15%, 3 HP, 300 pts) - Slow, heavily armored with rotating turret

#### Mid Game (100-200m)
- **Knife Soldiers** (15%, 1 HP, 150 pts) - Extremely fast melee rushers, speed boosts when close
- **Covered Soldiers** (10%, 2 HP, 175 pts) - Alternate between cover (50% damage reduction) and advancing

#### Late Game (200-300m)
- **Rocket Launchers** (10%, 2 HP, 250 pts) - Maintain distance, kite away from player
- **Bunkers** (5%, 5 HP, 400 pts) - Stationary defensive structures blocking paths

#### End Game (300+m)
- **Bosses** (5%, 20 HP, 1000 pts) - Multi-phase combat with changing tactics based on health

### Power-Ups (spawn every 15s)

- **Grenade Pack** (40%) - +5 grenades for area-of-effect damage
- **Speed Boost** (30%) - 1.5x movement speed for 10 seconds (cyan player tint)
- **Shield** (20%) - Invincibility for 8 seconds (flashing player sprite)
- **Weapon Upgrade** (10%) - 2x fire rate for 15 seconds (orange player tint)

### Difficulty Progression

- Enemy spawn rate accelerates with distance (1200ms → 400ms minimum)
- New enemy types unlock at distance milestones
- Multiple enemies spawn per wave (1-3 simultaneous)
- Enemies spawn from top (70%), left (15%), and right (15%)
- Victory condition at 500m distance

## License

MIT
