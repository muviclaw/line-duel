import { create } from 'zustand';
import type { Game, Move, LineSegment, Territory } from '../types';

interface GameStore {
  currentGame: Game | null;
  moves: Move[];
  lineSegments: LineSegment[];
  territories: Territory[];

  setCurrentGame: (game: Game | null) => void;
  setMoves: (moves: Move[]) => void;
  addMove: (move: Move) => void;
  setLineSegments: (segments: LineSegment[]) => void;
  setTerritories: (territories: Territory[]) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  currentGame: null,
  moves: [],
  lineSegments: [],
  territories: [],

  setCurrentGame: (game) => set({ currentGame: game }),
  setMoves: (moves) => set({ moves }),
  addMove: (move) => set((state) => ({ moves: [...state.moves, move] })),
  setLineSegments: (segments) => set({ lineSegments: segments }),
  setTerritories: (territories) => set({ territories }),
  resetGame: () => set({
    currentGame: null,
    moves: [],
    lineSegments: [],
    territories: [],
  }),
}));
