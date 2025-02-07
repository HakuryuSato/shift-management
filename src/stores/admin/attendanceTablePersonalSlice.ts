import { create } from 'zustand';
import type { AttendanceRowPersonal } from '@/types/Attendance';

interface AttendanceTablePersonalStore {
  AttendanceTablePersonalTableRows: AttendanceRowPersonal[];
  setAttendanceTablePersonalTableRows: (rows: AttendanceRowPersonal[] | ((prevRows: AttendanceRowPersonal[]) => AttendanceRowPersonal[])) => void;
  AttendanceTablePersonalEditingCell: { rowIndex: number; field: keyof AttendanceRowPersonal } | null;
  setAttendanceTablePersonalEditingCell: (cell: { rowIndex: number; field: keyof AttendanceRowPersonal } | null) => void;
  editingRowIndex: number | null;
  setEditingRowIndex: (index: number | null) => void;
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
  editingRowIndex: null,
  setEditingRowIndex: (index) => set({ editingRowIndex: index }),
}));
