import { create } from 'zustand';
import type { AttendanceRowAllMembers } from '@/types/Attendance';

type AttendanceTableAllMembersState = {
  adminAttendanceTableAllMembersRows: AttendanceRowAllMembers[];
  setAdminAttendanceTableAllMembersRows: (rows: AttendanceRowAllMembers[]) => void;
  adminAttendanceTableAllMembersEditingRow: { rowIndex: number; rowData?: AttendanceRowAllMembers } | null;
  setAdminAttendanceTableAllMembersEditingRow: (row: { rowIndex: number; rowData?: AttendanceRowAllMembers } | null) => void;
  updateEmployeeNo: (rowIndex: number, employeeNo: string) => void;
};

export const useAttendanceTableAllMembersStore = create<AttendanceTableAllMembersState>((set) => ({
  adminAttendanceTableAllMembersRows: [],
  setAdminAttendanceTableAllMembersRows: (rows) => set({ adminAttendanceTableAllMembersRows: rows }),
  adminAttendanceTableAllMembersEditingRow: null,
  setAdminAttendanceTableAllMembersEditingRow: (row) => set({ adminAttendanceTableAllMembersEditingRow: row }),
  updateEmployeeNo: (rowIndex, employeeNo) => set((state) => {
    const updatedRows = [...state.adminAttendanceTableAllMembersRows];
    if (updatedRows[rowIndex]) {
      updatedRows[rowIndex] = {
        ...updatedRows[rowIndex],
        employeeNo: employeeNo
      };
    }
    return { adminAttendanceTableAllMembersRows: updatedRows };
  }),
}));
