# Line Duel Screenshots

This directory contains screenshots demonstrating the app's visual states for PR reviews.

## How to Generate Screenshots

1. Run the app: `npm start`
2. Take screenshots of the following states:
   - Empty board (initial state)
   - Board with a few player lines
   - Board with territory captured
   - Game over state

## Current Screenshots

### PR #2: Line Drawing Feature

#### Empty Board
The initial 20x20 grid ready for gameplay.

![Empty Board](./pr2-empty-board.png)

#### Lines Drawn
Players can draw lines by touching the screen. Lines snap to grid points.
- Blue lines = Player 1
- Red lines = Player 2

![Lines Drawn](./pr2-with-lines.png)

#### Interactive Drawing
While drawing, a semi-transparent preview line shows where the line will be placed.

![Drawing Preview](./pr2-drawing-preview.png)

## Visual Features

- **Grid**: 20x20 evenly-spaced grid in light gray
- **Player 1 Lines**: Blue (#3B82F6), 3px width
- **Player 2 Lines**: Red (#EF4444), 3px width
- **Preview Line**: 50% opacity of current player color
- **Touch Feedback**: Lines snap to nearest grid intersection

## Technical Details

- Canvas rendering via @shopify/react-native-skia
- Hardware-accelerated graphics
- Smooth 60fps performance
- Touch handling with grid snapping
