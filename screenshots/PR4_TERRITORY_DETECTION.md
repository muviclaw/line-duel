# Territory Detection Feature - Visual Demo

## Feature Overview

This PR implements the core game mechanic: territory capture through polygon detection. When players close a polygon by drawing lines, the enclosed area is automatically detected, filled with their color, and added to their score.

## How It Works

1. Player draws lines on the grid
2. When a line closes a polygon (forms a cycle), it's detected automatically
3. The enclosed area is filled with semi-transparent player color
4. Score is calculated using the Shoelace formula
5. Scores update in real-time at the top

## Visual States

### State 1: Drawing Lines
```
┌─────────────────────┐
│   Line Duel         │
│ P1: 0      P2: 0    │
├─────────────────────┤
│                     │
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│  │ │ │ │ │ │ │ │ │  │
│  ┼═╪═┼─┼─┼─┼─┼─┼─┼  │ ← Blue lines
│  │ ║ │ │ │ │ │ │ │  │   being drawn
│  ┼─╫─┼─┼─┼─┼─┼─┼─┼  │
│  │ ║ │ │ │ │ │ │ │  │
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│                     │
└─────────────────────┘
```

### State 2: Territory Captured!
```
┌─────────────────────┐
│   Line Duel         │
│ P1: 2      P2: 0    │  ← Score updated!
├─────────────────────┤
│                     │
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│  │ │ │ │ │ │ │ │ │  │
│  ┼═╪═┼─┼─┼─┼─┼─┼─┼  │
│  │░║░│ │ │ │ │ │ │  │ ← Blue territory
│  ┼═╬═┼─┼─┼─┼─┼─┼─┼  │   (semi-transparent)
│  │ ║ │ │ │ │ │ │ │  │
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│                     │
└─────────────────────┘

Polygon closed = 2x1 rectangle = Area of 2
```

### State 3: Multiple Territories
```
┌─────────────────────┐
│   Line Duel         │
│ P1: 6      P2: 4    │
├─────────────────────┤
│                     │
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│  │░░│▓▓▓│ │ │ │ │  │ ← Blue (░) and Red (▓)
│  ┼═╪═╪═══╪═┼─┼─┼─┼  │   territories
│  │░░│▓▓▓│ │ │ │ │  │
│  ┼═╪═╪═══╪═┼─┼─┼─┼  │
│  │ │ │ │ │ │ │ │ │  │
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│                     │
└─────────────────────┘

Blue captured: 2x2 = 4, plus 2x1 = 2 → Total: 6
Red captured: 2x2 = 4 → Total: 4
```

## Algorithm Details

### 1. Graph Building
Lines are converted to an adjacency graph:
```
Point (0,0) → connected to [(1,0), (0,1)]
Point (1,0) → connected to [(0,0), (1,1)]
...
```

### 2. Cycle Detection (DFS)
Depth-first search finds all closed cycles:
- Start from each point
- Traverse connected points
- Detect when path returns to start
- Ignore duplicate cycles

### 3. Polygon Area Calculation
Uses Shoelace formula:
```
Area = 1/2 * |Σ(x_i * y_(i+1) - x_(i+1) * y_i)|
```

### 4. Territory Assignment
- Find all polygons containing the new line's endpoints
- Select smallest polygon (most immediate capture)
- Fill with player's color
- Add area to score

## Code Structure

### New Components

1. **TerritoryLayer.tsx**
   - Renders filled polygons
   - Semi-transparent player colors
   - Drawn below line layer

### Updated Components

2. **GameBoard.tsx**
   - Detects territory on each move
   - Maintains territory state
   - Calculates and updates scores
   - Passes scores to parent

3. **App.tsx**
   - Displays live scores
   - Color-coded by player

### Core Algorithm

4. **territoryDetection.ts**
   - `detectTerritory()`: Main detection logic
   - `findClosedPolygons()`: DFS cycle detection
   - `buildGraph()`: Converts lines to graph
   - `calculatePolygonArea()`: Shoelace formula
   - `isPointInPolygon()`: Ray casting algorithm

## Test Coverage

Added 6 new tests (27 total):
- ✅ `findClosedPolygons` with triangles
- ✅ `findClosedPolygons` with squares
- ✅ `detectTerritory` returns null when no closure
- ✅ `detectTerritory` finds triangle territory
- ✅ `detectTerritory` finds square territory
- ✅ `detectTerritory` calculates correct area

## Performance

- Graph building: O(n) where n = number of lines
- Cycle detection: O(V + E) where V = vertices, E = edges
- Polygon area: O(p) where p = polygon points
- Optimized with early termination for large cycles

## Next Steps

After this PR:
- Move validation (lines must connect to existing endpoints)
- Maximum turn limit (40 turns)
- Game over detection
- Supabase multiplayer integration
