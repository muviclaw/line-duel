export const GAME_CONFIG = {
  BOARD_SIZE: 20,
  MAX_TURNS: 40,
  FREE_GAME_LIMIT: 3,
} as const;

export const SUBSCRIPTION_CONFIG = {
  MONTHLY_PRICE: 2.99,
  PRODUCT_ID: 'premium_monthly',
} as const;

export const COLORS = {
  PLAYER1: '#3B82F6', // Blue
  PLAYER2: '#EF4444', // Red
  GRID: '#E5E7EB',
  BACKGROUND: '#FFFFFF',
  TERRITORY_PLAYER1: 'rgba(59, 130, 246, 0.2)',
  TERRITORY_PLAYER2: 'rgba(239, 68, 68, 0.2)',
} as const;
