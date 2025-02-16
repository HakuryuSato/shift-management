import useSWR from 'swr';
import { fetchHolidays } from '@/utils/client/apiClient';
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import type { Holiday } from "@/types/Holiday";
import { useEffect } from 'react';

export function useAttendanceHolidays() {
  const setAdminAttendanceViewHolidays = useAdminAttendanceViewStore(
    state => state.setAdminAttendanceViewHolidays
  );
  
  const { data: holidays, mutate: mutateAttendanceViewHolidays } = useSWR<Holiday[]>(
    'holidays',
    fetchHolidays
  );

  useEffect(() => {
    if (holidays) {
      setAdminAttendanceViewHolidays(holidays);
    }
  }, [holidays, setAdminAttendanceViewHolidays]);

  return { mutateAttendanceViewHolidays };
}
