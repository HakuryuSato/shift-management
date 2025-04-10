import { create } from "zustand";

interface AdminClosingDateFormState {
  isVisibleAdminClosingDateForm: boolean;
  openAdminClosingDateForm: () => void;
  closeAdminClosingDateForm: () => void;
}

export const useAdminClosingDateFormStore = create<AdminClosingDateFormState>((set) => ({
  isVisibleAdminClosingDateForm: false,
  openAdminClosingDateForm: () => set({ isVisibleAdminClosingDateForm: true }),
  closeAdminClosingDateForm: () => set({ isVisibleAdminClosingDateForm: false }),
})); 