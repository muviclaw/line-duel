// Jest setup file

// Mock @shopify/react-native-skia
jest.mock('@shopify/react-native-skia', () => ({
  Canvas: 'Canvas',
  Path: 'Path',
  Skia: {
    Path: {
      Make: jest.fn(() => ({
        moveTo: jest.fn(),
        lineTo: jest.fn(),
      })),
    },
  },
  useTouchHandler: jest.fn(),
  vec: jest.fn((x, y) => ({ x, y })),
}));
