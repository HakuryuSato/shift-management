import { create } from 'zustand';

interface UserHomeFABState {
  isUserHomeFABVisible: boolean;
  setIsUserHomeFABVisible: (isVisible: boolean) => void;
  fabIconType: 'qr' | 'plus';
  setFABIconType: (type: 'qr' | 'plus') => void;
}

export const useUserHomeFABStore = create<UserHomeFABState>((set) => ({
  isUserHomeFABVisible: true,
  setIsUserHomeFABVisible: (isVisible) => set({ isUserHomeFABVisible: isVisible }),
  fabIconType: 'qr',
  setFABIconType: (type) => set({ fabIconType: type }),
}));