# Commando Workshop - Architecture Overview

## Project Structure

```
commando_workshop/
├── src/
│   ├── main.ts                 # Game entry point
│   ├── config/
│   │   └── GameConfig.ts       # Game constants and configuration
│   ├── scenes/
│   │   └── GameScene.ts        # Main game scene orchestrator
│   ├── entities/
│   │   ├── Player.ts           # Player entity
│   │   ├── Bullet.ts           # Bullet projectile
│   │   └── enemies/
│   │       ├── Enemy.ts        # Abstract base enemy class
│   │       ├── Soldier.ts      # Soldier enemy implementation
│   │       ├── Tank.ts         # Tank enemy implementation
│   │       └── Jeep.ts         # Jeep enemy implementation
│   ├── systems/
│   │   ├── CollisionSystem.ts  # Handles collision detection and resolution
│   │   ├── SpawnSystem.ts      # Manages enemy spawning logic
│   │   └── InputSystem.ts      # Keyboard input handling
│   ├── graphics/
│   │   └── TextureFactory.ts   # Procedural texture generation
│   ├── ui/
│   │   └── GameUI.ts           # UI rendering and updates
│   └── types/
│       └── index.ts            # TypeScript type definitions
├── docs/
│   ├── ARCHITECTURE.md         # This file
│   └── COMPONENTS.md           # Detailed component documentation
└── assets/                     # Future: sprites, sounds, etc.
```

## Design Principles

### SOLID Compliance

1. **Single Responsibility Principle**
   - Each class has one clear purpose
   - `Player` handles player logic, `SpawnSystem` handles spawning, etc.

2. **Open/Closed Principle**
   - Easy to add new enemy types without modifying existing code
   - Extend `Enemy` base class for new enemy behaviors

3. **Liskov Substitution Principle**
   - All enemy types can be used interchangeably
   - Systems work with `Enemy` base class, not concrete types

4. **Interface Segregation Principle**
   - Clean, focused interfaces for each system
   - No bloated classes with unused methods

5. **Dependency Inversion Principle**
   - Systems depend on abstractions (base classes, interfaces)
   - GameScene orchestrates, doesn't implement everything

## Architecture Layers

### 1. Configuration Layer
- **GameConfig.ts**: All game constants in one place
- Easy to tune gameplay without touching logic

### 2. Entity Layer
- **Player**: Character movement, shooting
- **Bullet**: Projectile behavior
- **Enemy** (Abstract): Base class with AI interface
  - **Soldier**: Basic chasing behavior
  - **Tank**: Slow, tough, rotating turret
  - **Jeep**: Fast, sweeping attacks

### 3. Systems Layer
- **CollisionSystem**: Detects and resolves all collisions
- **SpawnSystem**: Controls when/where/what enemies spawn
- **InputSystem**: Centralizes keyboard input handling

### 4. Graphics Layer
- **TextureFactory**: Generates all procedural textures
- Separates visual creation from game logic

### 5. UI Layer
- **GameUI**: Manages all UI elements (score, health, distance)
- Clean separation from game logic

### 6. Scene Layer
- **GameScene**: Orchestrates all systems
- Thin coordinator, delegates to systems

## Data Flow

```
User Input → InputSystem → Player/GameScene
                             ↓
GameScene → Update → Entities (Player, Enemies, Bullets)
                             ↓
                    SpawnSystem → New Enemies
                             ↓
                    CollisionSystem → Check/Resolve
                             ↓
                    GameUI → Display Stats
                             ↓
                    Phaser Render
```

## Adding New Features

### New Enemy Type
1. Create new class in `src/entities/enemies/`
2. Extend `Enemy` base class
3. Implement `updateMovement()` method
4. Add to `EnemyType` enum in types
5. Update `SpawnSystem` to include new type

### New Weapon/Powerup
1. Create class in `src/entities/`
2. Add to collision detection in `CollisionSystem`
3. Update UI if needed in `GameUI`

### New Game Mode
1. Create new scene in `src/scenes/`
2. Configure in `main.ts`

## Benefits for AI Assistance

- **Small files**: Easy to understand context
- **Clear naming**: Self-documenting code
- **Separation of concerns**: Easy to locate relevant code
- **Type safety**: TypeScript provides clear contracts
- **Documentation**: Architecture and component docs
