import { create } from 'zustand';

interface CustomFullCalendarStoreState {
  // 共通の状態
  customFullCalendarRole: 'admin' | 'user';
  customFullCalendarBgColorsPerDay: Record<string, string>;
  customFullCalendarStartDate: Date;
  customFullCalendarEndDate: Date;
  customFullCalendarCurrentYear: number;
  customFullCalendarCurrentMonth: number;

  // イベントの状態を3つに分割
  customFullCalendarPersonalShiftEvents: any[];
  customFullCalendarAllMembersShiftEvents: any[];
  customFullCalendarAttendanceEvents: any[];

  // 状態を更新するアクション
  setCustomFullCalendarRole: (role: 'admin' | 'user') => void;
  setCustomFullCalendarPersonalShiftEvents: (events: any[]) => void;
  setCustomFullCalendarAllMembersShiftEvents: (events: any[]) => void;
  setCustomFullCalendarAttendanceEvents: (events: any[]) => void;
  setCustomFullCalendarBgColorsPerDay: (bgColors: Record<string, string>) => void;
  setCustomFullCalendarStartDate: (date: Date) => void;
  setCustomFullCalendarEndDate: (date: Date) => void;
  setCustomFullCalendarCurrentYear: (year: number) => void;
  setCustomFullCalendarCurrentMonth: (month: number) => void;
}

export const useCustomFullCalendarStore = create<CustomFullCalendarStoreState>((set) => ({
  // 初期状態
  customFullCalendarRole: 'user',
  customFullCalendarBgColorsPerDay: {},
  customFullCalendarStartDate: new Date(),
  customFullCalendarEndDate: new Date(),
  customFullCalendarCurrentYear: new Date().getFullYear(),
  customFullCalendarCurrentMonth: new Date().getMonth(),
  customFullCalendarPersonalShiftEvents: [],
  customFullCalendarAllMembersShiftEvents: [],
  customFullCalendarAttendanceEvents: [],

  // 状態を更新するアクション
  setCustomFullCalendarRole: (role) => set({ customFullCalendarRole: role }),
  setCustomFullCalendarPersonalShiftEvents: (events) => set({ customFullCalendarPersonalShiftEvents: events }),
  setCustomFullCalendarAllMembersShiftEvents: (events) => set({ customFullCalendarAllMembersShiftEvents: events }),
  setCustomFullCalendarAttendanceEvents: (events) => set({ customFullCalendarAttendanceEvents: events }),
  setCustomFullCalendarBgColorsPerDay: (bgColors) => set({ customFullCalendarBgColorsPerDay: bgColors }),
  setCustomFullCalendarStartDate: (date) => set({ customFullCalendarStartDate: date }),
  setCustomFullCalendarEndDate: (date) => set({ customFullCalendarEndDate: date }),
  setCustomFullCalendarCurrentYear: (year) => set({ customFullCalendarCurrentYear: year }),
  setCustomFullCalendarCurrentMonth: (month) => set({ customFullCalendarCurrentMonth: month }),
}));
