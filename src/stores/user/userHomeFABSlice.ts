import { create } from 'zustand';

interface UserHomeFABState {
  isUserHomeFABVisible: boolean;
  fabIconType: 'qr' | 'plus';
  setFABIconType: (type: 'qr' | 'plus') => void;
  showUserHomeFAB: () => void;
  hideUserHomeFAB: () => void;
}

export const useUserHomeFABStore = create<UserHomeFABState>((set) => ({
  isUserHomeFABVisible: true,
  fabIconType: 'qr',
  setFABIconType: (type) => set({ fabIconType: type }),
  showUserHomeFAB: () => set({ isUserHomeFABVisible: true }),
  hideUserHomeFAB: () => set({ isUserHomeFABVisible: false }),
}));
