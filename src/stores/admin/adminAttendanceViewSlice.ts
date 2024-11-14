import { create } from 'zustand';
import type { AttendanceResult } from '@/types/Attendance';

interface AdminAttendanceViewStore {
  isVisibleAdminAttendanceView: boolean;
  adminAttendanceViewCurrentDate: Date;
  adminAttendanceViewStartDate: Date;
  adminAttendanceViewEndDate: Date;
  showAdminAttendanceView: () => void;
  hideAdminAttendanceView: () => void;
  setAdminAttendanceViewDate: (date: Date) => void;
  setAdminAttendanceViewDateRange: (startDate: Date, endDate: Date) => void;

  // attendance_resultを追加
  adminAttendanceViewAllMembersMonthlyResult: AttendanceResult[] | null;
  setAdminAttendanceViewAllMembersMonthlyResult: (data: AttendanceResult[]) => void;
}

export const useAdminAttendanceViewStore = create<AdminAttendanceViewStore>((set) => ({
  isVisibleAdminAttendanceView: false,
  adminAttendanceViewCurrentDate: new Date(),
  adminAttendanceViewStartDate: new Date(),
  adminAttendanceViewEndDate: new Date(),

  showAdminAttendanceView: () => set({ isVisibleAdminAttendanceView: true }),
  hideAdminAttendanceView: () => set({ isVisibleAdminAttendanceView: false }),
  setAdminAttendanceViewDate: (date) => set({ adminAttendanceViewCurrentDate: date }),
  setAdminAttendanceViewDateRange: (startDate, endDate) =>
    set({ adminAttendanceViewStartDate: startDate, adminAttendanceViewEndDate: endDate }),

   // attendance_resultを追加
  adminAttendanceViewAllMembersMonthlyResult: null,
  setAdminAttendanceViewAllMembersMonthlyResult: (data) =>
    set({ adminAttendanceViewAllMembersMonthlyResult: data }),
}));
