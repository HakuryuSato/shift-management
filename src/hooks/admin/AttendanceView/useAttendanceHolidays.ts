import useSWR from 'swr';
import { fetchHolidays } from '@/utils/client/apiClient';
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import type { Holiday } from "@/types/Holiday";
import { useMemo, useEffect } from 'react';

export function useAttendanceHolidays() {
  const setAdminAttendanceViewHolidays = useAdminAttendanceViewStore(
    (state) => state.setAdminAttendanceViewHolidays
  );

  const { data: holidays, mutate: mutateAttendanceViewHolidays } = useSWR<Holiday[]>(
    'holidays',
    fetchHolidays
  );

  // holidays配列をMapに変換
  const holidaysMap = useMemo(() => {
    if (!holidays) return new Map<string, Holiday>();
    return holidays.reduce((map, holiday) => {
      map.set(holiday.date, holiday);
      return map;
    }, new Map<string, Holiday>());
  }, [holidays]);

  useEffect(() => {
    if (holidays) {
      setAdminAttendanceViewHolidays(holidaysMap);
    }
  }, [holidays, holidaysMap, setAdminAttendanceViewHolidays]);

  return { mutateAttendanceViewHolidays };
}