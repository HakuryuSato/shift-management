import { create } from 'zustand';

interface UserHomeState {
  userId: number;
  userName: string;
  employmentType: 'full_time' | 'part_time';
  setUserData: (userData: Partial<UserHomeState>) => void;
}

export const useUserHomeStore = create<UserHomeState>((set) => ({
  userId: 0,
  userName: "",
  employmentType: "full_time",
  setUserData: (userData) => set((state) => ({ ...state, ...userData })),
}));

