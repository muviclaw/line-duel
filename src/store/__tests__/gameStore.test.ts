import { useGameStore } from '../gameStore';
import type { Game, Move, LineSegment, Territory } from '../../types';

describe('gameStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.setState({
      currentGame: null,
      moves: [],
      lineSegments: [],
      territories: [],
    });
  });

  it('should initialize with null game and empty arrays', () => {
    const state = useGameStore.getState();
    expect(state.currentGame).toBeNull();
    expect(state.moves).toEqual([]);
    expect(state.lineSegments).toEqual([]);
    expect(state.territories).toEqual([]);
  });

  it('should set current game', () => {
    const mockGame: Game = {
      id: 'game-1',
      player1_id: 'player-1',
      player2_id: 'player-2',
      turn_player: 'player-1',
      status: 'active',
      created_at: new Date().toISOString(),
      player1_score: 0,
      player2_score: 0,
      turn_count: 0,
    };

    useGameStore.getState().setCurrentGame(mockGame);
    expect(useGameStore.getState().currentGame).toEqual(mockGame);
  });

  it('should set moves', () => {
    const mockMoves: Move[] = [
      {
        id: 'move-1',
        game_id: 'game-1',
        player_id: 'player-1',
        start_x: 0,
        start_y: 0,
        end_x: 1,
        end_y: 1,
        created_at: new Date().toISOString(),
      },
    ];

    useGameStore.getState().setMoves(mockMoves);
    expect(useGameStore.getState().moves).toEqual(mockMoves);
  });

  it('should add a move', () => {
    const mockMove: Move = {
      id: 'move-1',
      game_id: 'game-1',
      player_id: 'player-1',
      start_x: 0,
      start_y: 0,
      end_x: 1,
      end_y: 1,
      created_at: new Date().toISOString(),
    };

    useGameStore.getState().addMove(mockMove);
    expect(useGameStore.getState().moves).toHaveLength(1);
    expect(useGameStore.getState().moves[0]).toEqual(mockMove);
  });

  it('should set line segments', () => {
    const mockLines: LineSegment[] = [
      {
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        playerId: 'player-1',
      },
    ];

    useGameStore.getState().setLineSegments(mockLines);
    expect(useGameStore.getState().lineSegments).toEqual(mockLines);
  });

  it('should set territories', () => {
    const mockTerritories: Territory[] = [
      {
        points: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }],
        playerId: 'player-1',
        area: 1,
      },
    ];

    useGameStore.getState().setTerritories(mockTerritories);
    expect(useGameStore.getState().territories).toEqual(mockTerritories);
  });

  it('should reset game state', () => {
    // Set up some state
    const mockGame: Game = {
      id: 'game-1',
      player1_id: 'player-1',
      player2_id: 'player-2',
      turn_player: 'player-1',
      status: 'active',
      created_at: new Date().toISOString(),
      player1_score: 10,
      player2_score: 5,
      turn_count: 5,
    };

    useGameStore.getState().setCurrentGame(mockGame);
    useGameStore.getState().setMoves([
      {
        id: 'move-1',
        game_id: 'game-1',
        player_id: 'player-1',
        start_x: 0,
        start_y: 0,
        end_x: 1,
        end_y: 1,
        created_at: new Date().toISOString(),
      },
    ]);

    // Reset
    useGameStore.getState().resetGame();

    const state = useGameStore.getState();
    expect(state.currentGame).toBeNull();
    expect(state.moves).toEqual([]);
    expect(state.lineSegments).toEqual([]);
    expect(state.territories).toEqual([]);
  });
});
