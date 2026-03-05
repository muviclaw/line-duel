import type { Point, LineSegment, Territory, PlayerId } from '../types';

/**
 * Detects if a newly drawn line closes a polygon and calculates territory
 */
export function detectTerritory(
  newLine: LineSegment,
  allLines: LineSegment[],
  playerId: PlayerId
): Territory | null {
  const allLinesWithNew = [...allLines, newLine];

  // Find all closed polygons that include the new line
  const polygons = findClosedPolygons(allLinesWithNew);

  // Filter to polygons that include the new line's endpoints
  const newPolygons = polygons.filter(polygon => {
    return polygon.some(p => pointsEqual(p, newLine.start) || pointsEqual(p, newLine.end));
  });

  if (newPolygons.length === 0) return null;

  // Take the smallest polygon (most immediate capture)
  const smallestPolygon = newPolygons.reduce((smallest, current) => {
    const currentArea = calculatePolygonArea(current);
    const smallestArea = calculatePolygonArea(smallest);
    return currentArea < smallestArea ? current : smallest;
  });

  return {
    points: smallestPolygon,
    playerId,
    area: calculatePolygonArea(smallestPolygon),
  };
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
 * Helper: Check if two points are equal
 */
function pointsEqual(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

/**
 * Build adjacency graph from line segments
 */
function buildGraph(lines: LineSegment[]): Map<string, Point[]> {
  const graph = new Map<string, Point[]>();

  const pointKey = (p: Point) => `${p.x},${p.y}`;

  for (const line of lines) {
    const startKey = pointKey(line.start);
    const endKey = pointKey(line.end);

    if (!graph.has(startKey)) graph.set(startKey, []);
    if (!graph.has(endKey)) graph.set(endKey, []);

    graph.get(startKey)!.push(line.end);
    graph.get(endKey)!.push(line.start);
  }

  return graph;
}

/**
 * Find all closed polygons on the board using cycle detection
 */
export function findClosedPolygons(lines: LineSegment[]): Point[][] {
  if (lines.length < 3) return [];

  const graph = buildGraph(lines);
  const polygons: Point[][] = [];
  const visited = new Set<string>();

  const pointKey = (p: Point) => `${p.x},${p.y}`;
  const pathKey = (path: Point[]) => path.map(pointKey).sort().join('|');

  // DFS to find cycles
  function findCycles(start: Point, current: Point, path: Point[], visited: Set<string>): void {
    const currentKey = pointKey(current);

    // If we've visited more than 3 nodes and we're back at start, we found a cycle
    if (path.length >= 3 && pointsEqual(current, start)) {
      const cycleKey = pathKey(path);
      if (!visited.has(cycleKey)) {
        visited.add(cycleKey);
        polygons.push([...path]);
      }
      return;
    }

    // Avoid cycles that are too large (limit to reasonable polygon size)
    if (path.length > 20) return;

    const neighbors = graph.get(currentKey) || [];

    for (const neighbor of neighbors) {
      // Don't immediately backtrack
      if (path.length > 0 && pointsEqual(neighbor, path[path.length - 1])) continue;

      // Check if we're closing a cycle
      if (path.length >= 3 && pointsEqual(neighbor, start)) {
        findCycles(start, neighbor, path, visited);
      } else if (!path.some(p => pointsEqual(p, neighbor))) {
        // Continue exploring
        findCycles(start, neighbor, [...path, neighbor], visited);
      }
    }
  }

  // Try starting from each point
  for (const [key] of graph) {
    const [x, y] = key.split(',').map(Number);
    const startPoint = { x, y };
    findCycles(startPoint, startPoint, [startPoint], visited);
  }

  return polygons;
}
