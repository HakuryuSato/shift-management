import { useEffect } from 'react';
import useSWR from 'swr';
import { useUserHomeStore } from '@/stores/user/userHomeSlice';
import { useUserCalendarViewStore } from '@/stores/user/userCalendarViewSlice';
import { useCustomFullCalendarStore } from '@stores/common/customFullCalendarSlice';
import { fetchShifts } from '@/utils/client/apiClient';
import { formatEventsForFullCalendar } from '@/utils/formatEventsForFullCalendar';

export function useCalendarShiftPersonal() {
  const userId = useUserHomeStore((state) => state.userId);
  const { customFullCalendarCurrentMonth, setCustomFullCalendarPersonalShiftEvents } = useCustomFullCalendarStore();
  const isUserCalendarViewVisible = useUserCalendarViewStore((state) => state.isUserCalendarViewVisible);

  const { data: shifts, mutate } = useSWR(
    isUserCalendarViewVisible ? `personal_shifts-${userId}-${customFullCalendarCurrentMonth}` : null,
    () => fetchShifts({ user_id: userId, month: customFullCalendarCurrentMonth })
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
