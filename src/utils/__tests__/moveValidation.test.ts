import { isValidMove, getValidNextPoints } from '../moveValidation';
import type { LineSegment } from '../../types';

describe('moveValidation', () => {
  describe('isValidMove', () => {
    it('should allow first move anywhere', () => {
      const firstLine: LineSegment = {
        start: { x: 5, y: 5 },
        end: { x: 6, y: 5 },
        playerId: 'player1',
      };

      const result = isValidMove(firstLine, []);
      expect(result.valid).toBe(true);
    });

    it('should reject move where start equals end', () => {
      const invalidLine: LineSegment = {
        start: { x: 5, y: 5 },
        end: { x: 5, y: 5 },
        playerId: 'player1',
      };

      const result = isValidMove(invalidLine, []);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('must be different');
    });

    it('should reject duplicate line', () => {
      const existingLines: LineSegment[] = [
        { start: { x: 0, y: 0 }, end: { x: 1, y: 0 }, playerId: 'player1' },
      ];

      const duplicateLine: LineSegment = {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 },
        playerId: 'player2',
      };

      const result = isValidMove(duplicateLine, existingLines);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('already exists');
    });

    it('should reject duplicate line in reverse direction', () => {
      const existingLines: LineSegment[] = [
        { start: { x: 0, y: 0 }, end: { x: 1, y: 0 }, playerId: 'player1' },
      ];

      const reverseLine: LineSegment = {
        start: { x: 1, y: 0 },
        end: { x: 0, y: 0 },
        playerId: 'player2',
      };

      const result = isValidMove(reverseLine, existingLines);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('already exists');
    });

    it('should reject line that does not connect to existing points', () => {
      const existingLines: LineSegment[] = [
        { start: { x: 0, y: 0 }, end: { x: 1, y: 0 }, playerId: 'player1' },
      ];

      const disconnectedLine: LineSegment = {
        start: { x: 5, y: 5 },
        end: { x: 6, y: 5 },
        playerId: 'player2',
      };

      const result = isValidMove(disconnectedLine, existingLines);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('must connect');
    });

    it('should allow line that connects at start point', () => {
      const existingLines: LineSegment[] = [
        { start: { x: 0, y: 0 }, end: { x: 1, y: 0 }, playerId: 'player1' },
      ];

      const connectedLine: LineSegment = {
        start: { x: 1, y: 0 },
        end: { x: 1, y: 1 },
        playerId: 'player2',
      };

      const result = isValidMove(connectedLine, existingLines);
      expect(result.valid).toBe(true);
    });

    it('should allow line that connects at end point', () => {
      const existingLines: LineSegment[] = [
        { start: { x: 0, y: 0 }, end: { x: 1, y: 0 }, playerId: 'player1' },
      ];

      const connectedLine: LineSegment = {
        start: { x: 2, y: 0 },
        end: { x: 1, y: 0 },
        playerId: 'player2',
      };

      const result = isValidMove(connectedLine, existingLines);
      expect(result.valid).toBe(true);
    });

    it('should allow line that connects at both endpoints', () => {
      const existingLines: LineSegment[] = [
        { start: { x: 0, y: 0 }, end: { x: 1, y: 0 }, playerId: 'player1' },
        { start: { x: 1, y: 0 }, end: { x: 1, y: 1 }, playerId: 'player1' },
      ];

      const connectedLine: LineSegment = {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        playerId: 'player2',
      };

      const result = isValidMove(connectedLine, existingLines);
      expect(result.valid).toBe(true);
    });
  });

  describe('getValidNextPoints', () => {
    it('should return all points for first move', () => {
      const boardSize = 3;
      const validPoints = getValidNextPoints({ x: 0, y: 0 }, [], boardSize);

      // Should have boardSize^2 - 1 points (excluding the from point)
      expect(validPoints.length).toBe(boardSize * boardSize - 1);
    });

    it('should return only connected points for subsequent moves', () => {
      const existingLines: LineSegment[] = [
        { start: { x: 0, y: 0 }, end: { x: 1, y: 0 }, playerId: 'player1' },
      ];

      const validPoints = getValidNextPoints({ x: 1, y: 0 }, existingLines, 3);

      // Should include points that would create valid connections
      // Excludes: (1,0) itself, (0,0) (duplicate line)
      expect(validPoints.length).toBeGreaterThan(0);
      expect(validPoints.length).toBeLessThan(9); // Less than full board
    });

    it('should exclude the from point itself', () => {
      const fromPoint = { x: 1, y: 1 };
      const validPoints = getValidNextPoints(fromPoint, [], 3);

      const hasSamePoint = validPoints.some(
        p => p.x === fromPoint.x && p.y === fromPoint.y
      );

      expect(hasSamePoint).toBe(false);
    });
  });
});
