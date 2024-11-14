import { create } from 'zustand';
import type { AttendanceResult, AttendanceStamp } from '@/types/Attendance';
import type { User } from '@/types/User';

interface AdminAttendanceViewStore {
  // 既存の状態
  adminAttendanceViewStartDate: Date;
  adminAttendanceViewEndDate: Date;
  adminAttendanceViewAllMembersMonthlyResult: AttendanceResult[] | null;
  setAdminAttendanceViewDateRange: (startDate: Date, endDate: Date) => void;
  setAdminAttendanceViewAllMembersMonthlyResult: (data: AttendanceResult[]) => void;

  // 新たに追加する状態と関数
  isVisibleAllMembersMonthlyTable: boolean;
  showAllMembersMonthlyTable: () => void;
  hideAllMembersMonthlyTable: () => void;

  isVisiblePersonalAttendanceTable: boolean;
  showPersonalAttendanceTable: () => void;
  hidePersonalAttendanceTable: () => void;

  adminAttendanceViewAllMembersMonthlyStamps: AttendanceStamp[] | null;
  setAdminAttendanceViewAllMembersMonthlyStamps: (data: AttendanceStamp[]) => void;

  adminAttendanceViewSelectedUser: User | null;
  setAdminAttendanceViewSelectedUser: (user: User) => void;
}

export const useAdminAttendanceViewStore = create<AdminAttendanceViewStore>((set) => ({
  // 既存の状態と関数
  adminAttendanceViewStartDate: new Date(),
  adminAttendanceViewEndDate: new Date(),
  adminAttendanceViewAllMembersMonthlyResult: null,
  setAdminAttendanceViewDateRange: (startDate, endDate) =>
    set({ adminAttendanceViewStartDate: startDate, adminAttendanceViewEndDate: endDate }),
  setAdminAttendanceViewAllMembersMonthlyResult: (data) =>
    set({ adminAttendanceViewAllMembersMonthlyResult: data }),

  // 新たに追加する状態と関数
  isVisibleAllMembersMonthlyTable: true,
  showAllMembersMonthlyTable: () => set({ isVisibleAllMembersMonthlyTable: true }),
  hideAllMembersMonthlyTable: () => set({ isVisibleAllMembersMonthlyTable: false }),

  isVisiblePersonalAttendanceTable: false,
  showPersonalAttendanceTable: () => set({ isVisiblePersonalAttendanceTable: true }),
  hidePersonalAttendanceTable: () => set({ isVisiblePersonalAttendanceTable: false }),

  adminAttendanceViewSelectedUser: null,
  setAdminAttendanceViewSelectedUser: (user) => set({ adminAttendanceViewSelectedUser: user }),

  adminAttendanceViewAllMembersMonthlyStamps: null,
  setAdminAttendanceViewAllMembersMonthlyStamps: (data) =>
    set({ adminAttendanceViewAllMembersMonthlyStamps: data }),
}));
