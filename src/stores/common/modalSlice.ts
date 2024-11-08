import { create } from 'zustand';

interface ModalStoreState {
  isModalVisible: boolean;
  modalRole: 'user' | 'admin';
  modalMode: 'confirm' | 'register' | 'delete' | 'multiple-register';

  setIsModalVisible: (visible: boolean) => void;
  setModalRole: (role: 'user' | 'admin') => void;
  setmodalMode: (action: 'confirm' | 'register' | 'delete' | 'multiple-register') => void;
}

export const useModalStore = create<ModalStoreState>((set) => ({
  isModalVisible: false,
  modalRole: 'user',
  modalMode: 'confirm',

  setIsModalVisible: (visible) => set({ isModalVisible: visible }),
  setModalRole: (role) => set({ modalRole: role }),
  setmodalMode: (action) => set({ modalMode: action }),
}));
