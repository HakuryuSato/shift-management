import { create } from 'zustand';
import type { AttendanceRow } from '@/types/Attendance';

interface AttendanceTablePersonalStore {
  AttendanceTablePersonalTableRows: AttendanceRow[];
  setAttendanceTablePersonalTableRows: (rows: AttendanceRow[] | ((prevRows: AttendanceRow[]) => AttendanceRow[])) => void;
  AttendanceTablePersonalEditingCell: { rowIndex: number; field: keyof AttendanceRow } | null;
  setAttendanceTablePersonalEditingCell: (cell: { rowIndex: number; field: keyof AttendanceRow } | null) => void;
}

export const useAttendanceTablePersonalStore = create<AttendanceTablePersonalStore>((set) => ({
  AttendanceTablePersonalTableRows: [],
  setAttendanceTablePersonalTableRows: (rows) => {
    set((state) => ({
      AttendanceTablePersonalTableRows:
        typeof rows === 'function' ? rows(state.AttendanceTablePersonalTableRows) : rows,
    }));
  },
  AttendanceTablePersonalEditingCell: null,
  setAttendanceTablePersonalEditingCell: (cell) => set({ AttendanceTablePersonalEditingCell: cell }),
}));
