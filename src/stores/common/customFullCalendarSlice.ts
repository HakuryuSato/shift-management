import { create } from 'zustand';

interface CustomFullCalendarStoreState {
  // 共通の状態
  customFullCalendarRole: 'admin' | 'user';
  customFullCalendarEvents: any[]; // shiftEvents を一般化
  customFullCalendarBgColorsPerDay: Record<string, string>; // 混雑状況
  customFullCalendarCurrentView: string;
  customFullCalendarStartDate: Date;
  customFullCalendarEndDate: Date;
  customFullCalendarCurrentYear: number;
  customFullCalendarCurrentMonth: number;
  customFullCalendarIsAllMembersView: boolean;

  // 状態を更新するアクション
  setCustomFullCalendarRole: (role: 'admin' | 'user') => void;
  // customFullCalendarMode とその setter を削除
  setCustomFullCalendarEvents: (events: any[]) => void;
  setCustomFullCalendarBgColorsPerDay: (bgColors: Record<string, string>) => void;
  setCustomFullCalendarCurrentView: (viewType: string) => void;
  setCustomFullCalendarStartDate: (date: Date) => void;
  setCustomFullCalendarEndDate: (date: Date) => void;
  setCustomFullCalendarCurrentYear: (year: number) => void;
  setCustomFullCalendarCurrentMonth: (month: number) => void;
  toggleCustomFullCalendarMemberView: () => void;
}

export const useCustomFullCalendarStore = create<CustomFullCalendarStoreState>((set) => ({
  // 初期状態
  customFullCalendarRole: 'user',
  customFullCalendarEvents: [],
  customFullCalendarBgColorsPerDay: {},
  customFullCalendarCurrentView: '',
  customFullCalendarStartDate: new Date(),
  customFullCalendarEndDate: new Date(),
  customFullCalendarCurrentYear: new Date().getFullYear(),
  customFullCalendarCurrentMonth: new Date().getMonth(),
  customFullCalendarIsAllMembersView: false,

  // 状態を更新するアクション
  setCustomFullCalendarRole: (role) => set({ customFullCalendarRole: role }),
  setCustomFullCalendarEvents: (events) => set({ customFullCalendarEvents: events }),
  setCustomFullCalendarBgColorsPerDay: (bgColors) => set({ customFullCalendarBgColorsPerDay: bgColors }),
  setCustomFullCalendarCurrentView: (viewType) => set({ customFullCalendarCurrentView: viewType }),
  setCustomFullCalendarStartDate: (date) => set({ customFullCalendarStartDate: date }),
  setCustomFullCalendarEndDate: (date) => set({ customFullCalendarEndDate: date }),
  setCustomFullCalendarCurrentYear: (year) => set({ customFullCalendarCurrentYear: year }),
  setCustomFullCalendarCurrentMonth: (month) => set({ customFullCalendarCurrentMonth: month }),
  toggleCustomFullCalendarMemberView: () =>
    set((state) => ({ customFullCalendarIsAllMembersView: !state.customFullCalendarIsAllMembersView })),
}));
