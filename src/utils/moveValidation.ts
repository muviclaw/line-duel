import type { Point, LineSegment } from '../types';

/**
 * Check if two points are equal
 */
function pointsEqual(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

/**
 * Get all unique points (endpoints) from existing lines
 */
function getExistingPoints(lines: LineSegment[]): Point[] {
  const pointSet = new Map<string, Point>();

  for (const line of lines) {
    const startKey = `${line.start.x},${line.start.y}`;
    const endKey = `${line.end.x},${line.end.y}`;

    if (!pointSet.has(startKey)) {
      pointSet.set(startKey, line.start);
    }
    if (!pointSet.has(endKey)) {
      pointSet.set(endKey, line.end);
    }
  }

  return Array.from(pointSet.values());
}

/**
 * Check if a point exists in the list of existing points
 */
function pointExists(point: Point, existingPoints: Point[]): boolean {
  return existingPoints.some(p => pointsEqual(p, point));
}

/**
 * Check if a line already exists (in either direction)
 */
function lineExists(newLine: LineSegment, existingLines: LineSegment[]): boolean {
  return existingLines.some(line =>
    (pointsEqual(line.start, newLine.start) && pointsEqual(line.end, newLine.end)) ||
    (pointsEqual(line.start, newLine.end) && pointsEqual(line.end, newLine.start))
  );
}

/**
 * Validate if a move is legal
 * Rules:
 * - First move can start anywhere
 * - Subsequent moves must connect to at least one existing endpoint
 * - Lines cannot overlap existing lines
 * - Start and end points must be different
 */
export function isValidMove(
  newLine: LineSegment,
  existingLines: LineSegment[]
): { valid: boolean; reason?: string } {
  // Rule 1: Start and end must be different
  if (pointsEqual(newLine.start, newLine.end)) {
    return { valid: false, reason: 'Start and end points must be different' };
  }

  // Rule 2: Line cannot already exist
  if (lineExists(newLine, existingLines)) {
    return { valid: false, reason: 'Line already exists' };
  }

  // Rule 3: First move is always valid
  if (existingLines.length === 0) {
    return { valid: true };
  }

  // Rule 4: Must connect to at least one existing endpoint
  const existingPoints = getExistingPoints(existingLines);
  const startConnects = pointExists(newLine.start, existingPoints);
  const endConnects = pointExists(newLine.end, existingPoints);

  if (!startConnects && !endConnects) {
    return { valid: false, reason: 'Line must connect to an existing point' };
  }

  return { valid: true };
}

/**
 * Get all valid next points from a given position
 * (For AI or hint system in the future)
 */
export function getValidNextPoints(
  fromPoint: Point,
  existingLines: LineSegment[],
  boardSize: number = 20
): Point[] {
  const validPoints: Point[] = [];

  // Generate all possible grid points
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      const toPoint = { x, y };

      // Skip if same point
      if (pointsEqual(fromPoint, toPoint)) continue;

      // Check if line would be valid
      const testLine: LineSegment = {
        start: fromPoint,
        end: toPoint,
        playerId: 'test',
      };

      const validation = isValidMove(testLine, existingLines);
      if (validation.valid) {
        validPoints.push(toPoint);
      }
    }
  }

  return validPoints;
}
