import { create } from 'zustand';

type CalendarViewMode = '出退勤' | 'シフト(個人)' | 'シフト(全員)';

interface CalendarViewToggleState {
  // カレンダービューモード
  CalendarViewMode: CalendarViewMode;
  setCalendarViewModeToAttendance: () => void;
  setCalendarViewModeToShiftPersonal: () => void;
  setCalendarViewModeToShiftAllMembers: () => void;
}

export const useCalendarViewToggleStore = create<CalendarViewToggleState>((set) => ({
  // 初期状態
  CalendarViewMode: '出退勤',

  // ビューモードを変更するアクション
  setCalendarViewModeToAttendance: () => set({ CalendarViewMode: '出退勤' }),
  setCalendarViewModeToShiftPersonal: () => set({ CalendarViewMode: 'シフト(個人)' }),
  setCalendarViewModeToShiftAllMembers: () => set({ CalendarViewMode: 'シフト(全員)' }),
}));
