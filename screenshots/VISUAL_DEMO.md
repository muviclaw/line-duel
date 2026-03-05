# Line Drawing Feature - Visual Demo

## Feature Overview

This PR adds interactive line drawing to the game board. Players can now:
1. Touch and drag on the board to draw lines
2. Lines automatically snap to grid intersections
3. See a preview while drawing
4. Players alternate turns (blue/red)

## Visual States

### State 1: Empty Board
```
┌─────────────────────┐
│   Line Duel         │
│ P1: 0      P2: 0    │
├─────────────────────┤
│                     │
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│  │ │ │ │ │ │ │ │ │  │
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│  │ │ │ │ │ │ │ │ │  │
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│  │ │ │ │ │ │ │ │ │  │
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│  │ │ │ │ │ │ │ │ │  │
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│                     │
└─────────────────────┘
```

### State 2: Player 1 Drawing (Blue)
```
┌─────────────────────┐
│   Line Duel         │
│ P1: 0      P2: 0    │
├─────────────────────┤
│                     │
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│  │ │ │ │ │ │ │ │ │  │
│  ┼═╪═┼─┼─┼─┼─┼─┼─┼  │ ← Blue line
│  │ │ │ │ │ │ │ │ │  │   being drawn
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│  │ │ │ │ │ │ │ │ │  │
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│  │ │ │ │ │ │ │ │ │  │
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│                     │
└─────────────────────┘
```

### State 3: Multiple Lines Drawn
```
┌─────────────────────┐
│   Line Duel         │
│ P1: 0      P2: 0    │
├─────────────────────┤
│                     │
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│  │ │ │ │ ║ │ │ │ │  │ ← Red (P2)
│  ┼═╪═┼─┼─╫─┼─┼─┼─┼  │ ← Blue (P1)
│  │ │ │ │ ║ │ │ │ │  │
│  ┼─┼─┼─┼─╫─┼─┼─┼─┼  │
│  │ │ │ │ ║ │ │ │ │  │
│  ┼─┼─┼─┼═╬═╪═┼─┼─┼  │ ← Blue (P1)
│  │ │ │ │ │ │ │ │ │  │
│  ┼─┼─┼─┼─┼─┼─┼─┼─┼  │
│                     │
└─────────────────────┘

Legend:
  ═ Blue line (Player 1)
  ║ Red line (Player 2)
  ┼ Grid intersection
```

## Code Structure

### New Components

1. **LineLayer.tsx**
   - Renders all drawn line segments
   - Uses Skia Path for each line
   - Color-codes by player

2. **useDrawing.ts** (Hook)
   - Handles touch events
   - Snaps coordinates to grid
   - Manages drawing state
   - Emits completed lines

### Updated Components

3. **GameBoard.tsx**
   - Added touch handling
   - Preview line rendering
   - Player turn management
   - Line state management

## Technical Implementation

### Touch Flow
```
User touches screen
    ↓
Touch coordinates captured
    ↓
Snap to nearest grid point
    ↓
Draw preview line (50% opacity)
    ↓
User releases touch
    ↓
Finalize line and add to game state
    ↓
Toggle current player
```

### Performance
- Uses Skia for GPU-accelerated rendering
- Memoized paths for efficient re-renders
- 60fps smooth drawing
- Instant touch feedback

## Testing Checklist

- [x] Grid renders correctly
- [x] Touch events captured
- [x] Lines snap to grid intersections
- [x] Preview line displays while drawing
- [x] Lines render in correct colors
- [x] Players alternate turns
- [x] Multiple lines can be drawn
- [x] Performance is smooth

## Next Steps

Once this PR is merged:
- Add territory detection when polygons close
- Implement score calculation
- Add move validation (lines must connect)
- Integrate with Supabase for multiplayer
