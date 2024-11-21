import { create } from 'zustand';
import type { AttendanceRowAllMembers } from '@/types/Attendance';

type AttendanceTableAllMembersState = {
  adminAttendanceTableAllMembersRows: AttendanceRowAllMembers[];
  setAdminAttendanceTableAllMembersRows: (rows: AttendanceRowAllMembers[]) => void;
};

export const useAttendanceTableAllMembersStore = create<AttendanceTableAllMembersState>((set) => ({
  adminAttendanceTableAllMembersRows: [],
  setAdminAttendanceTableAllMembersRows: (rows) => set({ adminAttendanceTableAllMembersRows: rows }),
}));
