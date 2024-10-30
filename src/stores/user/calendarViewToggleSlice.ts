import { create } from 'zustand';

type CalendarViewMode = 'ATTENDANCE' | 'PERSONAL_SHIFT' | 'ALL_MEMBERS_SHIFT';

interface CalendarViewToggleState {
  // カレンダービューモード
  calendarViewMode: CalendarViewMode;
  setCalendarViewModeToAttendance: () => void;
  setCalendarViewModeToPersonalShift: () => void;
  setCalendarViewModeToAllMembersShift: () => void;
}

export const useCalendarViewToggleStore = create<CalendarViewToggleState>((set) => ({
  // 初期状態
  calendarViewMode: 'ATTENDANCE',

  // ビューモードを変更するアクション
  setCalendarViewModeToAttendance: () => set({ calendarViewMode: 'ATTENDANCE' }),
  setCalendarViewModeToPersonalShift: () => set({ calendarViewMode: 'PERSONAL_SHIFT' }),
  setCalendarViewModeToAllMembersShift: () => set({ calendarViewMode: 'ALL_MEMBERS_SHIFT' }),
}));
