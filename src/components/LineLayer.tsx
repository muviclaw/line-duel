import React from 'react';
import { Path, Skia, vec } from '@shopify/react-native-skia';
import type { LineSegment } from '../types';
import { COLORS } from '../config/constants';

interface LineLayerProps {
  lines: LineSegment[];
  cellSize: number;
}

export const LineLayer: React.FC<LineLayerProps> = ({ lines, cellSize }) => {
  const linePaths = React.useMemo(() => {
    return lines.map((line, index) => {
      const path = Skia.Path.Make();
      const startX = line.start.x * cellSize;
      const startY = line.start.y * cellSize;
      const endX = line.end.x * cellSize;
      const endY = line.end.y * cellSize;

      path.moveTo(startX, startY);
      path.lineTo(endX, endY);

      const color = line.playerId === 'player1' ? COLORS.PLAYER1 : COLORS.PLAYER2;

      return { path, color, key: index };
    });
  }, [lines, cellSize]);

  return (
    <>
      {linePaths.map(({ path, color, key }) => (
        <Path
          key={key}
          path={path}
          color={color}
          style="stroke"
          strokeWidth={3}
          strokeCap="round"
        />
      ))}
    </>
  );
};
