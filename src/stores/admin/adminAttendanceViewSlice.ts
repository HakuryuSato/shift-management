import { create } from 'zustand';

interface AdminAttendanceViewStore {
  isVisibleAdminAttendanceView: boolean;
  adminAttendanceViewCurrentDate: Date;
  showAdminAttendanceView: () => void;
  hideAdminAttendanceView: () => void;
  setAdminAttendanceViewDate: (date: Date) => void;
}

export const useAdminAttendanceViewStore = create<AdminAttendanceViewStore>((set) => ({
  isVisibleAdminAttendanceView: false,
  adminAttendanceViewCurrentDate: new Date(),

  showAdminAttendanceView: () => set({ isVisibleAdminAttendanceView: true }),
  hideAdminAttendanceView: () => set({ isVisibleAdminAttendanceView: false }),
  setAdminAttendanceViewDate: (date) => set({ adminAttendanceViewCurrentDate: date }), 
}));
