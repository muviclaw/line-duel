export type PlayerId = string;
export type GameId = string;
export type MoveId = string;

export interface Point {
  x: number;
  y: number;
}

export interface LineSegment {
  start: Point;
  end: Point;
  playerId: PlayerId;
}

export interface User {
  id: PlayerId;
  created_at: string;
}

export type GameStatus = 'waiting' | 'active' | 'finished';

export interface Game {
  id: GameId;
  player1_id: PlayerId;
  player2_id: PlayerId | null;
  turn_player: PlayerId;
  status: GameStatus;
  created_at: string;
  player1_score: number;
  player2_score: number;
  turn_count: number;
}

export interface Move {
  id: MoveId;
  game_id: GameId;
  player_id: PlayerId;
  start_x: number;
  start_y: number;
  end_x: number;
  end_y: number;
  created_at: string;
}

export interface Territory {
  points: Point[];
  playerId: PlayerId;
  area: number;
}

export interface GameState {
  board: LineSegment[];
  territories: Territory[];
  currentPlayer: PlayerId;
  turnCount: number;
}

export interface SubscriptionInfo {
  isPremium: boolean;
  expiresAt?: string;
}

export interface UserProfile extends User {
  subscription: SubscriptionInfo;
  activeGamesCount: number;
}
