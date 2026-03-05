import { create } from 'zustand';
import type { User, SubscriptionInfo } from '../types';

interface UserStore {
  user: User | null;
  subscription: SubscriptionInfo;
  activeGamesCount: number;

  setUser: (user: User | null) => void;
  setSubscription: (subscription: SubscriptionInfo) => void;
  setActiveGamesCount: (count: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  subscription: {
    isPremium: false,
  },
  activeGamesCount: 0,

  setUser: (user) => set({ user }),
  setSubscription: (subscription) => set({ subscription }),
  setActiveGamesCount: (count) => set({ activeGamesCount: count }),
}));
