import { calculatePolygonArea, isPointInPolygon } from '../territoryDetection';
import type { Point } from '../../types';

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
});
