import { renderHook, act } from '@testing-library/react-native';
import { useDrawing } from '../useDrawing';

describe('useDrawing', () => {
  const mockOnLineDrawn = jest.fn();
  const cellSize = 10;
  const currentPlayerId = 'player1';

  beforeEach(() => {
    mockOnLineDrawn.mockClear();
  });

  it('should initialize with no drawing state', () => {
    const { result } = renderHook(() =>
      useDrawing({ cellSize, onLineDrawn: mockOnLineDrawn, currentPlayerId })
    );

    expect(result.current.drawingState.isDrawing).toBe(false);
    expect(result.current.drawingState.startPoint).toBeNull();
    expect(result.current.drawingState.currentPoint).toBeNull();
  });

  it('should snap coordinates to grid', () => {
    const { result } = renderHook(() =>
      useDrawing({ cellSize, onLineDrawn: mockOnLineDrawn, currentPlayerId })
    );

    act(() => {
      // Touch at 15, 15 should snap to grid point 2, 2 (15/10 = 1.5, rounds to 2)
      result.current.handleTouchStart(15, 15);
    });

    expect(result.current.drawingState.isDrawing).toBe(true);
    expect(result.current.drawingState.startPoint).toEqual({ x: 2, y: 2 });
  });

  it('should update current point on touch move', () => {
    const { result } = renderHook(() =>
      useDrawing({ cellSize, onLineDrawn: mockOnLineDrawn, currentPlayerId })
    );

    act(() => {
      result.current.handleTouchStart(10, 10);
    });

    act(() => {
      result.current.handleTouchMove(30, 30);
    });

    expect(result.current.drawingState.currentPoint).toEqual({ x: 3, y: 3 });
  });

  it('should call onLineDrawn when touch ends with different points', () => {
    const { result } = renderHook(() =>
      useDrawing({ cellSize, onLineDrawn: mockOnLineDrawn, currentPlayerId })
    );

    act(() => {
      result.current.handleTouchStart(10, 10);
      result.current.handleTouchEnd(30, 30);
    });

    expect(mockOnLineDrawn).toHaveBeenCalledWith({
      start: { x: 1, y: 1 },
      end: { x: 3, y: 3 },
      playerId: 'player1',
    });
  });

  it('should not call onLineDrawn when start and end are the same', () => {
    const { result } = renderHook(() =>
      useDrawing({ cellSize, onLineDrawn: mockOnLineDrawn, currentPlayerId })
    );

    act(() => {
      result.current.handleTouchStart(10, 10);
      result.current.handleTouchEnd(10, 10);
    });

    expect(mockOnLineDrawn).not.toHaveBeenCalled();
  });

  it('should reset drawing state after touch end', () => {
    const { result } = renderHook(() =>
      useDrawing({ cellSize, onLineDrawn: mockOnLineDrawn, currentPlayerId })
    );

    act(() => {
      result.current.handleTouchStart(10, 10);
      result.current.handleTouchEnd(30, 30);
    });

    expect(result.current.drawingState.isDrawing).toBe(false);
    expect(result.current.drawingState.startPoint).toBeNull();
    expect(result.current.drawingState.currentPoint).toBeNull();
  });

  it('should handle touch cancel', () => {
    const { result } = renderHook(() =>
      useDrawing({ cellSize, onLineDrawn: mockOnLineDrawn, currentPlayerId })
    );

    act(() => {
      result.current.handleTouchStart(10, 10);
      result.current.handleTouchCancel();
    });

    expect(result.current.drawingState.isDrawing).toBe(false);
    expect(mockOnLineDrawn).not.toHaveBeenCalled();
  });
});
