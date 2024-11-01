import { create } from 'zustand';

export interface UserCalendarViewState {
  isUserCalendarViewVisible: boolean;
  setIsUserCalendarViewVisible: (visible: boolean) => void;
}

export const useUserCalendarViewStore = create<UserCalendarViewState>((set) => ({
  isUserCalendarViewVisible: true,
  setIsUserCalendarViewVisible: (visible) => set({ isUserCalendarViewVisible: visible }),
}));