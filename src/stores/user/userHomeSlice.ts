import { create } from 'zustand';

interface UserHomeState {
  userId: number;
  setUserId: (id: number) => void;
}

export const useUserHomeStore = create<UserHomeState>((set) => ({
  userId: 1,
  setUserId: (id) => set({ userId: id }),
}));
