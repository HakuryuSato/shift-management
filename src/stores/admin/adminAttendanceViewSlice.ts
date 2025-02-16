import { create } from 'zustand';
import type { Attendance } from '@/types/Attendance';
import type { User } from '@/types/User';
import type { Holiday } from '@/types/Holiday';

interface AdminAttendanceViewStore {
  adminAttendanceViewHolidays: Holiday[] | null;
  setAdminAttendanceViewHolidays: (holidays: Holiday[]) => void;

  adminAttendanceViewStartDate: Date;
  adminAttendanceViewEndDate: Date;
  adminAttendanceViewAllMembersMonthlyResult: Attendance[] | null; // 1ヶ月の全ユーザーのattendanceデータ
  setAdminAttendanceViewDateRange: (startDate: Date, endDate: Date) => void;
  setAdminAttendanceViewAllMembersMonthlyResult: (data: Attendance[]) => void;


  isVisibleAllMembersMonthlyTable: boolean;
  showAllMembersMonthlyTable: () => void;
  hideAllMembersMonthlyTable: () => void;

  isVisiblePersonalAttendanceTable: boolean;
  showPersonalAttendanceTable: () => void;
  hidePersonalAttendanceTable: () => void;

  adminAttendanceViewSelectedUser: User | null;
  setAdminAttendanceViewSelectedUser: (user: User) => void;
}

export const useAdminAttendanceViewStore = create<AdminAttendanceViewStore>((set) => ({
  adminAttendanceViewHolidays: null,
  setAdminAttendanceViewHolidays: (holidays) => set({ adminAttendanceViewHolidays: holidays }),

  adminAttendanceViewStartDate: new Date(),
  adminAttendanceViewEndDate: new Date(),
  adminAttendanceViewAllMembersMonthlyResult: null,
  setAdminAttendanceViewDateRange: (startDate, endDate) =>
    set({ adminAttendanceViewStartDate: startDate, adminAttendanceViewEndDate: endDate }),
  setAdminAttendanceViewAllMembersMonthlyResult: (data) =>
    set({ adminAttendanceViewAllMembersMonthlyResult: data }),


  isVisibleAllMembersMonthlyTable: false,
  showAllMembersMonthlyTable: () => set({ isVisibleAllMembersMonthlyTable: true }),
  hideAllMembersMonthlyTable: () => set({ isVisibleAllMembersMonthlyTable: false }),

  isVisiblePersonalAttendanceTable: false,
  showPersonalAttendanceTable: () => set({ isVisiblePersonalAttendanceTable: true }),
  hidePersonalAttendanceTable: () => set({ isVisiblePersonalAttendanceTable: false }),

  adminAttendanceViewSelectedUser: null,
  setAdminAttendanceViewSelectedUser: (user) => set({ adminAttendanceViewSelectedUser: user }),

}));
