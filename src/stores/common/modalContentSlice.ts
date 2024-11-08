import { create } from 'zustand';

interface ModalContentStoreState {
  modalContentSelectedDate: string,
  modalContentSelectedUserName: string,
  modalContentSelectedStartTime: string,
  modalContentSelectedEndTime: string,
}

export const useModalContentStore = create<ModalContentStoreState & {
  setModalContentSelectedDate: (date: string) => void;
  setModalContentSelectedUserName: (userName: string) => void;
  setModalContentSelectedStartTime: (startTime: string) => void;
  setModalContentSelectedEndTime: (endTime: string) => void;
}>((set) => ({
  modalContentSelectedDate: '',
  modalContentSelectedUserName: '',
  modalContentSelectedStartTime: '',
  modalContentSelectedEndTime: '',
  setModalContentSelectedDate: (date) =>
    set({ modalContentSelectedDate: date }),
  setModalContentSelectedUserName: (userName) =>
    set({ modalContentSelectedUserName: userName }),
  setModalContentSelectedStartTime: (startTime) =>
    set({ modalContentSelectedStartTime: startTime }),
  setModalContentSelectedEndTime: (endTime) =>
    set({ modalContentSelectedEndTime: endTime }),
}));