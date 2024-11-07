import { create } from 'zustand';

interface ModalStoreState {
  isModalVisible: boolean;
  modalRole: 'user' | 'admin';
  modalAction: 'confirm' | 'register' | 'delete' | 'multiple-register';

  setIsModalVisible: (visible: boolean) => void;
  setModalRole: (role: 'user' | 'admin') => void;
  setModalAction: (action: 'confirm' | 'register' | 'delete' | 'multiple-register') => void;
}

export const useModalStore = create<ModalStoreState>((set) => ({
  isModalVisible: false,
  modalRole: 'user',
  modalAction: 'confirm',

  setIsModalVisible: (visible) => set({ isModalVisible: visible }),
  setModalRole: (role) => set({ modalRole: role }),
  setModalAction: (action) => set({ modalAction: action }),
}));
