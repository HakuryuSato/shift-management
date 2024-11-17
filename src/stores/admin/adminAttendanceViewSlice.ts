import { create } from 'zustand';
import type { Attendance, Attendance } from '@/types/Attendance';
import type { User } from '@/types/User';

interface AdminAttendanceViewStore {

  adminAttendanceViewStartDate: Date;
  adminAttendanceViewEndDate: Date;
  adminAttendanceViewAllMembersMonthlyResult: Attendance[] | null;
  setAdminAttendanceViewDateRange: (startDate: Date, endDate: Date) => void;
  setAdminAttendanceViewAllMembersMonthlyResult: (data: Attendance[]) => void;


  isVisibleAllMembersMonthlyTable: boolean;
  showAllMembersMonthlyTable: () => void;
  hideAllMembersMonthlyTable: () => void;

  isVisiblePersonalAttendanceTable: boolean;
  showPersonalAttendanceTable: () => void;
  hidePersonalAttendanceTable: () => void;

  adminAttendanceViewAllMembersMonthlyStamps: Attendance[] | null;
  setAdminAttendanceViewAllMembersMonthlyStamps: (data: Attendance[]) => void;

  adminAttendanceViewSelectedUser: User | null;
  setAdminAttendanceViewSelectedUser: (user: User) => void;
}

export const useAdminAttendanceViewStore = create<AdminAttendanceViewStore>((set) => ({

  adminAttendanceViewStartDate: new Date(),
  adminAttendanceViewEndDate: new Date(),
  adminAttendanceViewAllMembersMonthlyResult: null,
  setAdminAttendanceViewDateRange: (startDate, endDate) =>
    set({ adminAttendanceViewStartDate: startDate, adminAttendanceViewEndDate: endDate }),
  setAdminAttendanceViewAllMembersMonthlyResult: (data) =>
    set({ adminAttendanceViewAllMembersMonthlyResult: data }),


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
