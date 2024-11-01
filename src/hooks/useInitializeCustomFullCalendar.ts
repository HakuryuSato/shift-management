// hooks/useInitializeCustomFullCalendar.ts
import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchHolidays } from '@/utils/apiClient';
import { useCustomFullCalendarStore } from '@stores/common/customFullCalendarSlice';

export function useInitializeCustomFullCalendar() {
  const {
    customFullCalendarPersonalShiftEvents,
    customFullCalendarAllMembersShiftEvents,
    customFullCalendarAttendanceEvents,
    setCustomFullCalendarPersonalShiftEvents,
    setCustomFullCalendarAllMembersShiftEvents,
    setCustomFullCalendarAttendanceEvents,
  } = useCustomFullCalendarStore();

  const { data: holidays } = useSWR('/api/holidays', fetchHolidays);
  useEffect(() => {
  if (holidays) {
    const holidayEvents = holidays.map((holiday: any) => ({
      title: holiday.title,
      start: holiday.date,
      allDay: true,
      color: '#69b076',
      extendedProps: {
        isHoliday: true,
      },
    }));

    // 個人シフトイベントに祝日を追加
    setCustomFullCalendarPersonalShiftEvents([
      ...customFullCalendarPersonalShiftEvents,
      ...holidayEvents,
    ]);

    // 全員シフトイベントに祝日を追加
    setCustomFullCalendarAllMembersShiftEvents([
      ...customFullCalendarAllMembersShiftEvents,
      ...holidayEvents,
    ]);

    // 出退勤イベントに祝日を追加
    setCustomFullCalendarAttendanceEvents([
      ...customFullCalendarAttendanceEvents,
      ...holidayEvents,
    ]);
  }
},[holidays, setCustomFullCalendarAllMembersShiftEvents, setCustomFullCalendarAttendanceEvents, setCustomFullCalendarPersonalShiftEvents]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

}
