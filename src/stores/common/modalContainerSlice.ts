import { create } from 'zustand';

type ModalRole = 'user' | 'admin';
type ModalMode = 'confirm' | 'register' | 'update' | 'delete' | 'multiple-register';

interface ModalContainerStoreState {
  isModalVisible: boolean;
  modalRole: ModalRole;
  modalMode: ModalMode;

  setModalRole: (role: ModalRole) => void;
  setModalMode: (mode: ModalMode) => void;
  openModal: (mode: ModalMode) => void;
  closeModal: () => void;
}

export const useModalContainerStore = create<ModalContainerStoreState>((set) => ({
  isModalVisible: false,
  modalRole: 'user',
  modalMode: 'confirm',

  setModalRole: (role) => set({ modalRole: role }),
  setModalMode: (mode) => set({ modalMode: mode }),

  openModal: (mode) => set({ modalMode: mode, isModalVisible: true }),
  closeModal: () => set({ isModalVisible: false }),
}));
