// Jest setup file

// Mock Expo modules
jest.mock('expo', () => ({
  __ExpoImportMetaRegistry: {},
}));

jest.mock('expo/src/winter/runtime.native', () => ({}));
jest.mock('expo/src/winter/installGlobal', () => ({}));

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
