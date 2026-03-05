import React from 'react';
import { Path, Skia } from '@shopify/react-native-skia';
import type { Territory } from '../types';
import { COLORS } from '../config/constants';

interface TerritoryLayerProps {
  territories: Territory[];
  cellSize: number;
}

export const TerritoryLayer: React.FC<TerritoryLayerProps> = ({ territories, cellSize }) => {
  const territoryPaths = React.useMemo(() => {
    return territories.map((territory, index) => {
      const path = Skia.Path.Make();

      if (territory.points.length === 0) return null;

      // Start at the first point
      const firstPoint = territory.points[0];
      path.moveTo(firstPoint.x * cellSize, firstPoint.y * cellSize);

      // Draw lines to each subsequent point
      for (let i = 1; i < territory.points.length; i++) {
        const point = territory.points[i];
        path.lineTo(point.x * cellSize, point.y * cellSize);
      }

      // Close the path
      path.close();

      const color = territory.playerId === 'player1'
        ? COLORS.TERRITORY_PLAYER1
        : COLORS.TERRITORY_PLAYER2;

      return { path, color, key: index };
    }).filter(Boolean);
  }, [territories, cellSize]);

  return (
    <>
      {territoryPaths.map(item => item && (
        <Path
          key={item.key}
          path={item.path}
          color={item.color}
          style="fill"
        />
      ))}
    </>
  );
};
