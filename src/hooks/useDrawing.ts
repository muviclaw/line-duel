import { useState, useCallback } from 'react';
import type { Point, LineSegment } from '../types';

interface UseDrawingProps {
  cellSize: number;
  onLineDrawn?: (line: LineSegment) => void;
  currentPlayerId: string;
}

interface DrawingState {
  isDrawing: boolean;
  startPoint: Point | null;
  currentPoint: Point | null;
}

export const useDrawing = ({ cellSize, onLineDrawn, currentPlayerId }: UseDrawingProps) => {
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    startPoint: null,
    currentPoint: null,
  });

  const snapToGrid = useCallback((x: number, y: number): Point => {
    const gridX = Math.round(x / cellSize);
    const gridY = Math.round(y / cellSize);
    return { x: gridX, y: gridY };
  }, [cellSize]);

  const handleTouchStart = useCallback((x: number, y: number) => {
    const snappedPoint = snapToGrid(x, y);
    setDrawingState({
      isDrawing: true,
      startPoint: snappedPoint,
      currentPoint: snappedPoint,
    });
  }, [snapToGrid]);

  const handleTouchMove = useCallback((x: number, y: number) => {
    if (!drawingState.isDrawing) return;

    const snappedPoint = snapToGrid(x, y);
    setDrawingState(prev => ({
      ...prev,
      currentPoint: snappedPoint,
    }));
  }, [drawingState.isDrawing, snapToGrid]);

  const handleTouchEnd = useCallback((x: number, y: number) => {
    if (!drawingState.isDrawing || !drawingState.startPoint) return;

    const snappedPoint = snapToGrid(x, y);

    // Only create line if start and end are different
    if (snappedPoint.x !== drawingState.startPoint.x ||
        snappedPoint.y !== drawingState.startPoint.y) {
      const newLine: LineSegment = {
        start: drawingState.startPoint,
        end: snappedPoint,
        playerId: currentPlayerId,
      };

      onLineDrawn?.(newLine);
    }

    setDrawingState({
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
    });
  }, [drawingState.isDrawing, drawingState.startPoint, snapToGrid, onLineDrawn, currentPlayerId]);

  const handleTouchCancel = useCallback(() => {
    setDrawingState({
      isDrawing: false,
      startPoint: null,
      currentPoint: null,
    });
  }, []);

  return {
    drawingState,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
  };
};
