import React from 'react';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { StyleSheet, View, Dimensions } from 'react-native';
import { GAME_CONFIG, COLORS } from '../config/constants';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 20;
const BOARD_SIZE = SCREEN_WIDTH - PADDING * 2;
const CELL_SIZE = BOARD_SIZE / GAME_CONFIG.BOARD_SIZE;

export const GameBoard: React.FC = () => {
  const gridPath = React.useMemo(() => {
    const path = Skia.Path.Make();

    // Draw vertical lines
    for (let i = 0; i <= GAME_CONFIG.BOARD_SIZE; i++) {
      const x = i * CELL_SIZE;
      path.moveTo(x, 0);
      path.lineTo(x, BOARD_SIZE);
    }

    // Draw horizontal lines
    for (let i = 0; i <= GAME_CONFIG.BOARD_SIZE; i++) {
      const y = i * CELL_SIZE;
      path.moveTo(0, y);
      path.lineTo(BOARD_SIZE, y);
    }

    return path;
  }, []);

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Path
          path={gridPath}
          color={COLORS.GRID}
          style="stroke"
          strokeWidth={1}
        />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
  },
});
