import { create } from 'zustand';

interface ModalStoreState {
  isModalVisible: boolean;
  modalRole: 'user' | 'admin';
  modalAction: 'confirm' | 'register' | 'delete';

  setIsModalVisible: (visible: boolean) => void;
  setModalRole: (role: 'user' | 'admin') => void;
  setModalAction: (action: 'confirm' | 'register' | 'delete') => void;
}

export const useModalStore = create<ModalStoreState>((set) => ({
  isModalVisible: false,
  modalRole: 'user',
  modalAction: 'confirm',

  setIsModalVisible: (visible) => set({ isModalVisible: visible }),
  setModalRole: (role) => set({ modalRole: role }),
  setModalAction: (action) => set({ modalAction: action }),
}));
