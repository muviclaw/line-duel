import type { Point, LineSegment, Territory, PlayerId } from '../types';

/**
 * Detects if a newly drawn line closes a polygon and calculates territory
 */
export function detectTerritory(
  newLine: LineSegment,
  allLines: LineSegment[],
  playerId: PlayerId
): Territory | null {
  // Implementation will use flood fill or polygon detection algorithm
  // This is a placeholder for the actual implementation
  return null;
}

/**
 * Calculate area of a polygon using Shoelace formula
 */
export function calculatePolygonArea(points: Point[]): number {
  if (points.length < 3) return 0;

  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

/**
 * Check if a point is inside a polygon
 */
export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    const intersect = ((yi > point.y) !== (yj > point.y))
      && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Find all closed polygons on the board
 */
export function findClosedPolygons(lines: LineSegment[]): Point[][] {
  // Implementation will traverse the graph of lines to find cycles
  // This is a placeholder for the actual implementation
  return [];
}
