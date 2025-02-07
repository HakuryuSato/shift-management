import { useEffect } from 'react';
import useSWR from 'swr';
import { useUserHomeStore } from '@/stores/user/userHomeSlice';
import { useUserCalendarViewStore } from '@/stores/user/userCalendarViewSlice';
import { useCustomFullCalendarStore } from '@stores/common/customFullCalendarSlice';
import { fetchShifts } from '@/utils/client/apiClient';
import { formatEventsForFullCalendar } from '@/utils/client/formatEventsForFullCalendar';

import { toJapanISOString, getStartOfDay, getEndOfDay } from '@/utils/common/dateUtils';

export function useCalendarShiftPersonal() {
  const userId = useUserHomeStore((state) => state.userId);
  const setCustomFullCalendarPersonalShiftEvents = useCustomFullCalendarStore((state) => state.setCustomFullCalendarPersonalShiftEvents);
  const customFullCalendarStartDate = useCustomFullCalendarStore((state) => state.customFullCalendarStartDate);
  const customFullCalendarEndDate = useCustomFullCalendarStore((state) => state.customFullCalendarEndDate);
  const isUserCalendarViewVisible = useUserCalendarViewStore((state) => state.isUserCalendarViewVisible);


  const { data: shifts, mutate } = useSWR(
    isUserCalendarViewVisible ? `personal_shifts-${userId}-${customFullCalendarStartDate}-${customFullCalendarEndDate}` : null,
    () => fetchShifts({ user_id: userId, start_time: toJapanISOString(getStartOfDay(customFullCalendarStartDate)), end_time: toJapanISOString(getEndOfDay(customFullCalendarEndDate)) })
  );

  useEffect(() => {
    if (shifts) {
      const formattedEvents = formatEventsForFullCalendar(shifts);
      setCustomFullCalendarPersonalShiftEvents(formattedEvents);
    }
  }, [shifts, setCustomFullCalendarPersonalShiftEvents]);

  // データの再取得を行う関数を返す
  return { mutatePersonalShifts: mutate };
}
