import { create } from 'zustand';

interface ModalContainerStoreState {
  isModalVisible: boolean;
  modalRole: 'user' | 'admin';
  modalMode: 'confirm' | 'register' | 'delete' | 'multiple-register';

  setModalRole: (role: 'user' | 'admin') => void;
  setmodalMode: (action: 'confirm' | 'register' | 'delete' | 'multiple-register') => void;
  openModal: (mode: 'confirm' | 'register' | 'delete' | 'multiple-register') => void;
  closeModal: () => void;
}

export const useModalContainerStore = create<ModalContainerStoreState>((set) => ({
  isModalVisible: false,
  modalRole: 'user',
  modalMode: 'confirm',

  setModalRole: (role) => set({ modalRole: role }),
  setmodalMode: (action) => set({ modalMode: action }),

  // モーダルを開く関数
  openModal: (mode) => set({ modalMode: mode, isModalVisible: true }),

  // モーダルを閉じる関数
  closeModal: () => set({ isModalVisible: false }),
}));
