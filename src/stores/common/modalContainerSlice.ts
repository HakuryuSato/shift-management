import { create } from 'zustand';

type ModalRole = 'user' | 'admin';
type ModalMode = 'confirm' | 'register' | 'update' | 'delete' | 'multiple-register' | 'closing-date';

interface ModalContainerStoreState {
  isModalVisible: boolean;
  modalRole: ModalRole;
  modalMode: ModalMode;

  setModalRole: (role: ModalRole) => void;
  setModalMode: (mode: ModalMode) => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useModalContainerStore = create<ModalContainerStoreState>((set) => ({
  isModalVisible: false,
  modalRole: 'user',
  modalMode: 'confirm',

  setModalRole: (role) => set({ modalRole: role }),
  setModalMode: (mode) => set({ modalMode: mode }),
  openModal: () => set({ isModalVisible: true }),
  closeModal: () => set({ isModalVisible: false }),
}));
