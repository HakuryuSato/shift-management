import { create } from 'zustand';
import type { AttendanceRowPersonal } from '@/types/Attendance';

interface AttendanceTablePersonalStore {
  AttendanceTablePersonalTableRows: AttendanceRowPersonal[];
  setAttendanceTablePersonalTableRows: (rows: AttendanceRowPersonal[] | ((prevRows: AttendanceRowPersonal[]) => AttendanceRowPersonal[])) => void;
  AttendanceTablePersonalEditingRow: { rowIndex: number; field?: keyof AttendanceRowPersonal; rowData?: AttendanceRowPersonal } | null;
  setAttendanceTablePersonalEditingRow: (row: { rowIndex: number; field?: keyof AttendanceRowPersonal; rowData?: AttendanceRowPersonal } | null) => void;
  AttendanceTablePersonalRowStyles: { [key: string]: { backgroundColor?: string } };
  setAttendanceTablePersonalRowStyles: (styles: { [key: string]: { backgroundColor?: string } }) => void;
}

export const useAttendanceTablePersonalStore = create<AttendanceTablePersonalStore>((set) => ({
  AttendanceTablePersonalTableRows: [],
  setAttendanceTablePersonalTableRows: (rows) => {
    set((state) => ({
      AttendanceTablePersonalTableRows:
        typeof rows === 'function' ? rows(state.AttendanceTablePersonalTableRows) : rows,
    }));
  },
  
  AttendanceTablePersonalEditingRow: null,
  setAttendanceTablePersonalEditingRow: (row) => set({ AttendanceTablePersonalEditingRow: row }),

  AttendanceTablePersonalRowStyles: {},
  setAttendanceTablePersonalRowStyles: (styles) => set({ AttendanceTablePersonalRowStyles: styles }),
}));
