import { create } from 'zustand';
import type { Attendance } from '@/types/Attendance';
import type { User } from '@/types/User';
import type { Holiday } from '@/types/Holiday';

interface AdminAttendanceViewStore {
  adminAttendanceViewHolidaysMap: Map<string, Holiday> | null;
  setAdminAttendanceViewHolidays: (holidays: Map<string, Holiday>) => void;

  adminAttendanceViewStartDate: Date;
  adminAttendanceViewEndDate: Date;
  adminAttendanceViewAllMembersMonthlyResult: Attendance[] | null; // 1ヶ月の全ユーザーのattendanceデータ
  setAdminAttendanceViewDateRange: (startDate: Date, endDate: Date) => void; // set時はRangeでStartとEndをまとめて格納する
  setAdminAttendanceViewAllMembersMonthlyResult: (data: Attendance[]) => void;

  // 締め日
  adminAttendanceViewClosingDate: number | null;
  setAdminAttendanceViewClosingDate: (closingDate: number) => void;

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
  adminAttendanceViewHolidaysMap: null,
  setAdminAttendanceViewHolidays: (holidays) => set({ adminAttendanceViewHolidaysMap: holidays }),

  adminAttendanceViewStartDate: new Date(),
  adminAttendanceViewEndDate: new Date(),
  adminAttendanceViewAllMembersMonthlyResult: null,
  setAdminAttendanceViewDateRange: (startDate, endDate) =>
    set({ adminAttendanceViewStartDate: startDate, adminAttendanceViewEndDate: endDate }),
  setAdminAttendanceViewAllMembersMonthlyResult: (data) =>
    set({ adminAttendanceViewAllMembersMonthlyResult: data }),

  // 締め日
  adminAttendanceViewClosingDate: 25, // 注意：25日を初期値としている
  setAdminAttendanceViewClosingDate: (closingDate) =>
    set({ adminAttendanceViewClosingDate: closingDate }),

  isVisibleAllMembersMonthlyTable: false,
  showAllMembersMonthlyTable: () => set({ isVisibleAllMembersMonthlyTable: true }),
  hideAllMembersMonthlyTable: () => set({ isVisibleAllMembersMonthlyTable: false }),

  isVisiblePersonalAttendanceTable: false,
  showPersonalAttendanceTable: () => set({ isVisiblePersonalAttendanceTable: true }),
  hidePersonalAttendanceTable: () => set({ isVisiblePersonalAttendanceTable: false }),

  adminAttendanceViewSelectedUser: null,
  setAdminAttendanceViewSelectedUser: (user) => set({ adminAttendanceViewSelectedUser: user }),
}));
