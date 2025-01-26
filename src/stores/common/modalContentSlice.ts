import { create } from 'zustand';
import type { User } from '@/types/User';

interface ModalContentStoreState {
  modalContentSelectedDate: string,
  modalContentSelectedUser: User,
  modalContentSelectedStartTime: string,
  modalContentSelectedEndTime: string,
}

export const useModalContentStore = create<ModalContentStoreState & {
  setModalContentSelectedDate: (date: string) => void;
  setModalContentSelectedUser: (user: User) => void;
  setModalContentSelectedStartTime: (startTime: string) => void;
  setModalContentSelectedEndTime: (endTime: string) => void;
}>((set) => ({
  modalContentSelectedDate: '',
  modalContentSelectedUser: {} as User,
  modalContentSelectedStartTime: '',
  modalContentSelectedEndTime: '',
  setModalContentSelectedDate: (date) =>
    set({ modalContentSelectedDate: date }),
  setModalContentSelectedUser: (user) =>
    set({ modalContentSelectedUser: user }),
  setModalContentSelectedStartTime: (startTime) =>
    set({ modalContentSelectedStartTime: startTime }),
  setModalContentSelectedEndTime: (endTime) =>
    set({ modalContentSelectedEndTime: endTime }),
}));
