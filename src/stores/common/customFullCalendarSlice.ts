import { create } from 'zustand';
import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";

interface CustomFullCalendarStoreState {
  // 共通の状態
  customFullCalendarRole: 'admin' | 'user';
  customFullCalendarBgColorsPerDay: Record<string, string>;
  customFullCalendarStartDate: Date;
  customFullCalendarEndDate: Date;

  // 以下二つは統合して随所で抽出するべきか？
  customFullCalendarCurrentYear: number;
  customFullCalendarCurrentMonth: number;

  // イベントの状態を3つに分割(ページ切替で再取得が発生しないように)
  customFullCalendarHolidayEvents: any[];
  customFullCalendarAttendanceEvents: any[];
  customFullCalendarPersonalShiftEvents: any[];
  customFullCalendarAllMembersShiftEvents: any[];

  // カレンダークリック時の選択情報
  customFullCalendarClickedDate: DateClickArg | null;
  customFullCalendarClickedEvent: EventClickArg | null;


  // 状態を更新するアクション
  setCustomFullCalendarRole: (role: 'admin' | 'user') => void;
  setCustomFullCalendarHolidayEvents: (events: any[]) => void;
  setCustomFullCalendarPersonalShiftEvents: (events: any[]) => void;
  setCustomFullCalendarAllMembersShiftEvents: (events: any[]) => void;
  setCustomFullCalendarAttendanceEvents: (events: any[]) => void;
  setCustomFullCalendarBgColorsPerDay: (bgColors: Record<string, string>) => void;
  setCustomFullCalendarStartDate: (date: Date) => void;
  setCustomFullCalendarEndDate: (date: Date) => void;
  setCustomFullCalendarCurrentYear: (year: number) => void;
  setCustomFullCalendarCurrentMonth: (month: number) => void;
  setCustomFullCalendarClickedDate: (dateInfo: DateClickArg | null) => void;
  setCustomFullCalendarClickedEvent: (eventInfo: EventClickArg | null) => void;
}

export const useCustomFullCalendarStore = create<CustomFullCalendarStoreState>((set) => ({
  // 初期状態
  customFullCalendarRole: 'user',
  customFullCalendarBgColorsPerDay: {},
  customFullCalendarStartDate: new Date(),
  customFullCalendarEndDate: new Date(),
  customFullCalendarCurrentYear: new Date().getFullYear(),
  customFullCalendarCurrentMonth: new Date().getMonth(),
  customFullCalendarHolidayEvents: [],
  customFullCalendarPersonalShiftEvents: [],
  customFullCalendarAllMembersShiftEvents: [],
  customFullCalendarAttendanceEvents: [],
  customFullCalendarClickedDate: null,
  customFullCalendarClickedEvent: null,

  // 状態を更新するアクション
  setCustomFullCalendarRole: (role) => set({ customFullCalendarRole: role }),
  setCustomFullCalendarHolidayEvents: (events) => set({ customFullCalendarHolidayEvents: events }),
  setCustomFullCalendarPersonalShiftEvents: (events) => set({ customFullCalendarPersonalShiftEvents: events }),
  setCustomFullCalendarAllMembersShiftEvents: (events) => set({ customFullCalendarAllMembersShiftEvents: events }),
  setCustomFullCalendarAttendanceEvents: (events) => set({ customFullCalendarAttendanceEvents: events }),
  setCustomFullCalendarBgColorsPerDay: (bgColors) => set({ customFullCalendarBgColorsPerDay: bgColors }),
  setCustomFullCalendarStartDate: (date) => set({ customFullCalendarStartDate: date }),
  setCustomFullCalendarEndDate: (date) => set({ customFullCalendarEndDate: date }),
  setCustomFullCalendarCurrentYear: (year) => set({ customFullCalendarCurrentYear: year }),
  setCustomFullCalendarCurrentMonth: (month) => set({ customFullCalendarCurrentMonth: month }),

  setCustomFullCalendarClickedDate: (dateInfo) => set({ customFullCalendarClickedDate: dateInfo }),
  setCustomFullCalendarClickedEvent: (eventInfo) => set({ customFullCalendarClickedEvent: eventInfo }),  
}));
