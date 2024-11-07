import useSWR from 'swr';
import { fetchHolidays } from '@/utils/client/apiClient';
import { useCustomFullCalendarStore } from '@stores/common/customFullCalendarSlice';
import type { Holiday } from "@/customTypes/Holiday";
import { useEffect, useCallback } from 'react';

export function useCalendarHolidays() {
  const {
    setCustomFullCalendarHolidayEvents,
  } = useCustomFullCalendarStore();

  const { data: holidays } = useSWR<Holiday[]>('holidays', fetchHolidays);

  // 祝日データを一度だけ設定する関数
  const updateHolidayEvents = useCallback(() => {
    if (holidays) {
      const holidayEvents = holidays.map((holiday: Holiday) => ({
        title: holiday.title,
        start: holiday.date,
        allDay: true,
        color: '#69b076',
        extendedProps: { isHoliday: true },
      }));
      setCustomFullCalendarHolidayEvents(holidayEvents);
    }
  }, [holidays, setCustomFullCalendarHolidayEvents]);

  // holidaysが取得された時点で一度だけ実行
  useEffect(() => {
    updateHolidayEvents();
  }, [updateHolidayEvents]);
}