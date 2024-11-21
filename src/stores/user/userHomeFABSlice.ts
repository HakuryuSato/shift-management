import { create } from 'zustand';

interface UserHomeFABState {
  isVisibleUserHomeFAB: boolean;
  showUserHomeFAB: () => void;
  hideUserHomeFAB: () => void;
  setIsUserHomeFABVisible: (isVisible: boolean) => void;
  fabIconType: 'qr' | 'calendar';
  setFABIconType: (type: 'qr' | 'calendar') => void;
}

export const useUserHomeFABStore = create<UserHomeFABState>((set) => ({
  isVisibleUserHomeFAB: true,
  showUserHomeFAB: () => set({ isVisibleUserHomeFAB: true }),
  hideUserHomeFAB: () => set({ isVisibleUserHomeFAB: false }),

  setIsUserHomeFABVisible: (isVisible) => set({ isVisibleUserHomeFAB: isVisible }),

  fabIconType: 'qr',
  setFABIconType: (type) => set({ fabIconType: type }),
}));