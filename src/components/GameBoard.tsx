import React, { useState, useEffect } from 'react';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { StyleSheet, View, Dimensions, GestureResponderEvent, Text } from 'react-native';
import { GAME_CONFIG, COLORS } from '../config/constants';
import { LineLayer } from './LineLayer';
import { TerritoryLayer } from './TerritoryLayer';
import { useDrawing } from '../hooks/useDrawing';
import { detectTerritory } from '../utils/territoryDetection';
import { isValidMove } from '../utils/moveValidation';
import type { LineSegment, Territory } from '../types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 20;
const BOARD_SIZE = SCREEN_WIDTH - PADDING * 2;
const CELL_SIZE = BOARD_SIZE / GAME_CONFIG.BOARD_SIZE;

interface GameBoardProps {
  onScoreChange?: (player1Score: number, player2Score: number) => void;
  onGameOver?: (winner: 'player1' | 'player2' | 'tie', finalScores: { player1: number; player2: number }) => void;
  onTurnChange?: (turn: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ onScoreChange, onGameOver, onTurnChange }) => {
  const [lines, setLines] = useState<LineSegment[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1');
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLineDrawn = (line: LineSegment) => {
    // Don't allow moves if game is over
    if (gameOver) return;

    // Validate move
    const validation = isValidMove(line, lines);

    if (!validation.valid) {
      setErrorMessage(validation.reason || 'Invalid move');
      setTimeout(() => setErrorMessage(null), 2000);
      return;
    }

    setLines(prev => {
      const newLines = [...prev, line];

      // Detect if this line closes a polygon
      const newTerritory = detectTerritory(line, prev, currentPlayer);

      if (newTerritory) {
        setTerritories(prevTerritories => [...prevTerritories, newTerritory]);

        // Update scores
        if (currentPlayer === 'player1') {
          setPlayer1Score(prevScore => prevScore + newTerritory.area);
        } else {
          setPlayer2Score(prevScore => prevScore + newTerritory.area);
        }
      }

      return newLines;
    });

    // Increment turn count
    const newTurnCount = turnCount + 1;
    setTurnCount(newTurnCount);
    onTurnChange?.(newTurnCount);

    // Check if game is over
    if (newTurnCount >= GAME_CONFIG.MAX_TURNS) {
      setGameOver(true);
      const winner = player1Score > player2Score ? 'player1' :
                     player2Score > player1Score ? 'player2' : 'tie';
      onGameOver?.(winner, { player1: player1Score, player2: player2Score });
    }

    // Toggle player
    setCurrentPlayer(prev => prev === 'player1' ? 'player2' : 'player1');
  };

  // Notify parent of score changes
  useEffect(() => {
    onScoreChange?.(player1Score, player2Score);
  }, [player1Score, player2Score, onScoreChange]);

  const { drawingState, handleTouchStart, handleTouchMove, handleTouchEnd } = useDrawing({
    cellSize: CELL_SIZE,
    onLineDrawn: handleLineDrawn,
    currentPlayerId: currentPlayer,
  });

  const gridPath = React.useMemo(() => {
    const path = Skia.Path.Make();

    // Draw vertical lines
    for (let i = 0; i <= GAME_CONFIG.BOARD_SIZE; i++) {
      const x = i * CELL_SIZE;
      path.moveTo(x, 0);
      path.lineTo(x, BOARD_SIZE);
    }

    // Draw horizontal lines
    for (let i = 0; i <= GAME_CONFIG.BOARD_SIZE; i++) {
      const y = i * CELL_SIZE;
      path.moveTo(0, y);
      path.lineTo(BOARD_SIZE, y);
    }

    return path;
  }, []);

  // Create preview line while drawing
  const previewPath = React.useMemo(() => {
    if (!drawingState.isDrawing || !drawingState.startPoint || !drawingState.currentPoint) {
      return null;
    }

    const path = Skia.Path.Make();
    const startX = drawingState.startPoint.x * CELL_SIZE;
    const startY = drawingState.startPoint.y * CELL_SIZE;
    const endX = drawingState.currentPoint.x * CELL_SIZE;
    const endY = drawingState.currentPoint.y * CELL_SIZE;

    path.moveTo(startX, startY);
    path.lineTo(endX, endY);

    return path;
  }, [drawingState]);

  const handleTouchEvent = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent;

    // Handle touch based on event type - for now just use as a simple tap
    handleTouchStart(locationX, locationY);
    handleTouchEnd(locationX, locationY);
  };

  return (
    <View style={styles.container}>
      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}
      <Canvas style={styles.canvas}>
        <Path
          path={gridPath}
          color={COLORS.GRID}
          style="stroke"
          strokeWidth={1}
        />
        <TerritoryLayer territories={territories} cellSize={CELL_SIZE} />
        <LineLayer lines={lines} cellSize={CELL_SIZE} />
        {previewPath && (
          <Path
            path={previewPath}
            color={currentPlayer === 'player1' ? COLORS.PLAYER1 : COLORS.PLAYER2}
            style="stroke"
            strokeWidth={3}
            opacity={0.5}
            strokeCap="round"
          />
        )}
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  canvas: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
  },
  errorContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    zIndex: 1000,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    color: '#991B1B',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
