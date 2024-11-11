import { create } from 'zustand';

interface ModalTopBarStoreState {
  isModalTopBarEditIconsVisible: boolean;
  showModalTopBarEditIcons: () => void;
  hideModalTopBarEditIcons: () => void;
}

export const useModalTopBarStore = create<ModalTopBarStoreState>((set) => ({
  isModalTopBarEditIconsVisible: false,
  showModalTopBarEditIcons: () => set({ isModalTopBarEditIconsVisible: true }),
  hideModalTopBarEditIcons: () => set({ isModalTopBarEditIconsVisible: false }),
}));