import {create} from 'zustand';

interface UserHomeFABState {
  isVisible: boolean;
  iconType: 'qr' | 'plus';
  setIconType: (type: 'qr' | 'plus') => void;
  show: () => void;
  hide: () => void;
}

export const useUserHomeFABStore = create<UserHomeFABState>((set) => ({
  isVisible: true,
  iconType: 'qr',
  setIconType: (type) => set({ iconType: type }),
  show: () => set({ isVisible: true }),
  hide: () => set({ isVisible: false }),
}));
