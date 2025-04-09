import { create } from "zustand";

interface AdminClosingDateFormState {
  isVisibleAdminClosingDateForm: boolean;
  openAdminClosingDateForm: () => void;
  closeAdminClosingDateForm: () => void;
  adminClosingDateFormDate: string;
  setAdminClosingDateFormDate: (date: string) => void;
}

export const useAdminClosingDateFormStore = create<AdminClosingDateFormState>((set) => ({
  isVisibleAdminClosingDateForm: false,
  adminClosingDateFormDate: '',
  openAdminClosingDateForm: () => set({ isVisibleAdminClosingDateForm: true }),
  closeAdminClosingDateForm: () => set({ isVisibleAdminClosingDateForm: false }),
  setAdminClosingDateFormDate: (date) => set({ adminClosingDateFormDate: date }),
})); 