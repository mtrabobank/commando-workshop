# Component Documentation

## Configuration

### GameConfig
**Purpose**: Central configuration for all game constants
**Location**: `src/config/GameConfig.ts`

**Exports**:
- `SCREEN_WIDTH`, `SCREEN_HEIGHT`: Display dimensions
- `PLAYER_SPEED`, `PLAYER_FIRE_RATE`: Player tuning
- `ENEMY_SPAWN_RATE`: Enemy spawn timing
- `SCROLL_SPEED`: Background scroll speed
- `EnemyType` enum: All enemy type identifiers

---

## Entities

### Player
**Purpose**: Player character with movement and shooting
**Location**: `src/entities/Player.ts`

**Responsibilities**:
- Handle 8-directional movement (WASD + Arrow keys)
- Fire bullets with rate limiting
- Provide sprite and position accessors

**Key Methods**:
- `update(cursors, wasdKeys)`: Update movement based on input
- `shoot(time): Bullet | null`: Attempt to fire a bullet
- `getX(), getY(), getSprite()`: Accessors

---

### Bullet
**Purpose**: Player projectile
**Location**: `src/entities/Bullet.ts`

**Responsibilities**:
- Move upward at constant speed
- Track off-screen status for cleanup

**Key Methods**:
- `isOffScreen(): boolean`: Check if should be removed
- `destroy()`: Clean up sprite
- `getSprite()`: Get physics sprite

---

### Enemy (Abstract Base)
**Purpose**: Base class for all enemy types
**Location**: `src/entities/enemies/Enemy.ts`

**Responsibilities**:
- Provide common enemy interface
- Track health, speed, type
- Define AI update contract

**Key Methods**:
- `abstract updateMovement(playerX, playerY, delta)`: AI implementation
- `update(playerX, playerY, delta)`: Call AI and track time
- `takeDamage(): boolean`: Reduce health, return true if dead
- `isOffScreen(): boolean`: Check bounds
- `getType(): EnemyType`: Identify enemy type

**Subclasses**:
- **Soldier**: Chases player with varied patterns (zigzag, straight, drift)
- **Tank**: Slow, rotating, tough (3 HP)
- **Jeep**: Fast, sweeping horizontal attacks (2 HP)

---

## Systems

### CollisionSystem
**Purpose**: Handle all collision detection and resolution
**Location**: `src/systems/CollisionSystem.ts`

**Responsibilities**:
- Bullet vs Enemy collisions (damage/destroy)
- Player vs Enemy collisions (game over)
- Manage explosion effects
- Update score based on enemy type

**Key Methods**:
- `checkCollisions(player, bullets, enemies, explosionEmitter, scoreCallback, gameOverCallback)`

**Design Notes**:
- Uses Phaser's physics overlap detection
- Stateless - pure function approach
- Callback pattern for scene updates (score, game over)

---

### SpawnSystem
**Purpose**: Control enemy spawning logic
**Location**: `src/systems/SpawnSystem.ts`

**Responsibilities**:
- Time-based enemy spawning
- Random spawn positions (top 70%, sides 30%)
- Enemy type distribution (60% soldiers, 25% jeeps, 15% tanks)
- Progressive difficulty (spawn rate increases)

**Key Methods**:
- `update(scene, time, enemies, mapProgress): void`
- `shouldSpawn(time): boolean`: Check spawn timing
- `spawnEnemies(scene, enemies): void`: Create new enemies

**Design Notes**:
- Encapsulates all spawn logic
- Can be extended for spawn patterns, waves, etc.

---

### InputSystem
**Purpose**: Centralized keyboard input handling
**Location**: `src/systems/InputSystem.ts`

**Responsibilities**:
- Create and manage Phaser keyboard cursors
- Provide clean input state access
- Handle special keys (space for shooting, R for restart)

**Key Methods**:
- `setup(scene): void`: Initialize keyboard bindings
- `getCursors(), getWASDKeys(), getSpaceKey()`: Accessors

**Design Notes**:
- Single source of truth for input
- Easy to extend for gamepad, touch, etc.

---

## Graphics

### TextureFactory
**Purpose**: Generate all procedural game textures
**Location**: `src/graphics/TextureFactory.ts`

**Responsibilities**:
- Create player sprite (green soldier)
- Create enemy sprites (soldier, tank, jeep)
- Create bullet sprite (yellow tracer)
- Create particle sprites (explosions)
- Create background terrain texture

**Key Methods**:
- `static createAllTextures(scene): void`: Generate all at once
- `static createPlayerTexture(scene)`: Individual texture creators
- (Similar for each texture type)

**Design Notes**:
- All graphics in one place
- Easy to swap for image loading later
- Static methods - no state needed

---

## UI

### GameUI
**Purpose**: Manage all UI elements and updates
**Location**: `src/ui/GameUI.ts`

**Responsibilities**:
- Display score, kills, distance
- Update stats in real-time
- Render game over screen
- Handle restart prompt

**Key Methods**:
- `create(scene): void`: Initialize UI elements
- `updateScore(score): void`: Update score display
- `updateKills(kills): void`: Update kills counter
- `updateDistance(distance): void`: Update distance traveled
- `showGameOver(score, kills, distance, restartCallback): void`

**Design Notes**:
- Encapsulates all UI rendering
- Clean callback interface for interactions
- Depth management for proper layering

---

## Scenes

### GameScene
**Purpose**: Main game scene - orchestrates all systems
**Location**: `src/scenes/GameScene.ts`

**Responsibilities**:
- Coordinate all game systems
- Manage game state (score, kills, distance)
- Update background scrolling
- Delegate to specialized systems

**Lifecycle**:
1. `preload()`: Load textures via TextureFactory
2. `create()`: Initialize entities, systems, UI
3. `update(time, delta)`: Coordinate updates
   - Update background
   - Update player (via InputSystem)
   - Update bullets
   - Spawn enemies (via SpawnSystem)
   - Update enemies with AI
   - Check collisions (via CollisionSystem)
   - Update UI

**Design Notes**:
- Thin orchestrator - delegates to systems
- Maintains game state (score, kills, distance)
- Clean separation of concerns

---

## Types

### index.ts
**Purpose**: Centralized TypeScript type definitions
**Location**: `src/types/index.ts`

**Exports**:
- `EnemyType` enum
- Callback type definitions
- Configuration interfaces (if needed)

**Design Notes**:
- Single source of truth for types
- Easy import: `import { EnemyType } from '@/types'`

---

## AI Assistant Guidelines

When working with this codebase:

1. **Locating Code**: Check ARCHITECTURE.md for file locations
2. **Understanding Components**: Reference this file for responsibilities
3. **Adding Features**: Follow the pattern of existing components
4. **Modifying Logic**: Find the single responsible class
5. **Testing**: Each component can be tested in isolation

**Common Tasks**:
- Add enemy type → `src/entities/enemies/NewEnemy.ts`
- Change spawn logic → `src/systems/SpawnSystem.ts`
- Adjust graphics → `src/graphics/TextureFactory.ts`
- Modify UI → `src/ui/GameUI.ts`
- Tune gameplay → `src/config/GameConfig.ts`
