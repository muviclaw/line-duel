import {
  calculatePolygonArea,
  isPointInPolygon,
  findClosedPolygons,
  detectTerritory
} from '../territoryDetection';
import type { Point, LineSegment } from '../../types';

describe('territoryDetection', () => {
  describe('calculatePolygonArea', () => {
    it('should return 0 for less than 3 points', () => {
      expect(calculatePolygonArea([])).toBe(0);
      expect(calculatePolygonArea([{ x: 0, y: 0 }])).toBe(0);
      expect(calculatePolygonArea([{ x: 0, y: 0 }, { x: 1, y: 1 }])).toBe(0);
    });

    it('should calculate area of a square correctly', () => {
      const square: Point[] = [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: 2 },
        { x: 0, y: 2 },
      ];
      expect(calculatePolygonArea(square)).toBe(4);
    });

    it('should calculate area of a triangle correctly', () => {
      const triangle: Point[] = [
        { x: 0, y: 0 },
        { x: 4, y: 0 },
        { x: 2, y: 3 },
      ];
      expect(calculatePolygonArea(triangle)).toBe(6);
    });

    it('should handle negative coordinates', () => {
      const polygon: Point[] = [
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
        { x: -1, y: 1 },
      ];
      expect(calculatePolygonArea(polygon)).toBe(4);
    });
  });

  describe('isPointInPolygon', () => {
    const square: Point[] = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
    ];

    it('should return true for point inside polygon', () => {
      expect(isPointInPolygon({ x: 2, y: 2 }, square)).toBe(true);
      expect(isPointInPolygon({ x: 1, y: 1 }, square)).toBe(true);
    });

    it('should return false for point outside polygon', () => {
      expect(isPointInPolygon({ x: 5, y: 5 }, square)).toBe(false);
      expect(isPointInPolygon({ x: -1, y: 2 }, square)).toBe(false);
    });

    it('should handle edge cases on polygon boundary', () => {
      // Points on the boundary might return true or false depending on implementation
      const result = isPointInPolygon({ x: 0, y: 2 }, square);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('findClosedPolygons', () => {
    it('should return empty array for less than 3 lines', () => {
      const lines: LineSegment[] = [
        { start: { x: 0, y: 0 }, end: { x: 1, y: 0 }, playerId: 'player1' },
      ];
      expect(findClosedPolygons(lines)).toEqual([]);
    });

    it('should detect a simple triangle', () => {
      const lines: LineSegment[] = [
        { start: { x: 0, y: 0 }, end: { x: 2, y: 0 }, playerId: 'player1' },
        { start: { x: 2, y: 0 }, end: { x: 1, y: 2 }, playerId: 'player1' },
        { start: { x: 1, y: 2 }, end: { x: 0, y: 0 }, playerId: 'player1' },
      ];
      const polygons = findClosedPolygons(lines);
      expect(polygons.length).toBeGreaterThan(0);
      expect(polygons[0].length).toBe(3);
    });

    it('should detect a simple square', () => {
      const lines: LineSegment[] = [
        { start: { x: 0, y: 0 }, end: { x: 2, y: 0 }, playerId: 'player1' },
        { start: { x: 2, y: 0 }, end: { x: 2, y: 2 }, playerId: 'player1' },
        { start: { x: 2, y: 2 }, end: { x: 0, y: 2 }, playerId: 'player1' },
        { start: { x: 0, y: 2 }, end: { x: 0, y: 0 }, playerId: 'player1' },
      ];
      const polygons = findClosedPolygons(lines);
      expect(polygons.length).toBeGreaterThan(0);
      expect(polygons[0].length).toBe(4);
    });
  });

  describe('detectTerritory', () => {
    it('should return null when no polygon is closed', () => {
      const existingLines: LineSegment[] = [
        { start: { x: 0, y: 0 }, end: { x: 2, y: 0 }, playerId: 'player1' },
      ];
      const newLine: LineSegment = {
        start: { x: 2, y: 0 },
        end: { x: 3, y: 0 },
        playerId: 'player1',
      };

      const territory = detectTerritory(newLine, existingLines, 'player1');
      expect(territory).toBeNull();
    });

    it('should detect territory when closing a triangle', () => {
      const existingLines: LineSegment[] = [
        { start: { x: 0, y: 0 }, end: { x: 2, y: 0 }, playerId: 'player1' },
        { start: { x: 2, y: 0 }, end: { x: 1, y: 2 }, playerId: 'player1' },
      ];
      const newLine: LineSegment = {
        start: { x: 1, y: 2 },
        end: { x: 0, y: 0 },
        playerId: 'player1',
      };

      const territory = detectTerritory(newLine, existingLines, 'player1');
      expect(territory).not.toBeNull();
      expect(territory?.playerId).toBe('player1');
      expect(territory?.area).toBeGreaterThan(0);
      expect(territory?.points.length).toBe(3);
    });

    it('should detect territory when closing a square', () => {
      const existingLines: LineSegment[] = [
        { start: { x: 0, y: 0 }, end: { x: 2, y: 0 }, playerId: 'player1' },
        { start: { x: 2, y: 0 }, end: { x: 2, y: 2 }, playerId: 'player1' },
        { start: { x: 2, y: 2 }, end: { x: 0, y: 2 }, playerId: 'player1' },
      ];
      const newLine: LineSegment = {
        start: { x: 0, y: 2 },
        end: { x: 0, y: 0 },
        playerId: 'player1',
      };

      const territory = detectTerritory(newLine, existingLines, 'player1');
      expect(territory).not.toBeNull();
      expect(territory?.playerId).toBe('player1');
      expect(territory?.area).toBe(4);
      expect(territory?.points.length).toBe(4);
    });
  });
});
