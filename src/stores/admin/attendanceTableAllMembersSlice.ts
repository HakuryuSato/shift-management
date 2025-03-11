import { create } from 'zustand';
import type { AttendanceRowAllMembers } from '@/types/Attendance';

type AttendanceTableAllMembersState = {
  adminAttendanceTableAllMembersRows: AttendanceRowAllMembers[];
  setAdminAttendanceTableAllMembersRows: (rows: AttendanceRowAllMembers[]) => void;
  adminAttendanceTableAllMembersEditingRow: { rowIndex: number; rowData?: AttendanceRowAllMembers } | null;
  setAdminAttendanceTableAllMembersEditingRow: (row: { rowIndex: number; rowData?: AttendanceRowAllMembers } | null) => void;
};

export const useAttendanceTableAllMembersStore = create<AttendanceTableAllMembersState>((set) => ({
  adminAttendanceTableAllMembersRows: [],
  setAdminAttendanceTableAllMembersRows: (rows) => set({ adminAttendanceTableAllMembersRows: rows }),
  adminAttendanceTableAllMembersEditingRow: null,
  setAdminAttendanceTableAllMembersEditingRow: (row) => set({ adminAttendanceTableAllMembersEditingRow: row }),
}));
