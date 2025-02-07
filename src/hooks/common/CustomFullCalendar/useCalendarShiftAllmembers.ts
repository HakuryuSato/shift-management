import { useEffect } from 'react';
import useSWR from 'swr';
import { useUserCalendarViewStore } from '@/stores/user/userCalendarViewSlice';
import { useCustomFullCalendarStore } from '@stores/common/customFullCalendarSlice';
import { fetchShifts, fetchUsers } from '@/utils/client/apiClient';
import { formatEventsForFullCalendar } from '@/utils/client/formatEventsForFullCalendar';
import calcSumShiftHourPerDay from '@utils/calcSumShiftHourPerDay';
import { toJapanISOString, getStartOfDay, getEndOfDay } from '@/utils/common/dateUtils';

export function useCalendarShiftAllMembers() {

  // Calendar
  const customFullCalendarStartDate = useCustomFullCalendarStore((state) => state.customFullCalendarStartDate);
  const customFullCalendarEndDate = useCustomFullCalendarStore((state) => state.customFullCalendarEndDate);
  const setCustomFullCalendarAllMembersShiftEvents = useCustomFullCalendarStore((state) => state.setCustomFullCalendarAllMembersShiftEvents);
  const setCustomFullCalendarBgColorsPerDay = useCustomFullCalendarStore((state) => state.setCustomFullCalendarBgColorsPerDay);

  // Calendar View
  const isUserCalendarViewVisible = useUserCalendarViewStore((state) => state.isUserCalendarViewVisible);


  const { data: shifts, mutate } = useSWR(
    isUserCalendarViewVisible ? `allmembers_shifts-${'*'}-${customFullCalendarStartDate}-${customFullCalendarEndDate}` : null,
    () => fetchShifts({ start_time: toJapanISOString(getStartOfDay(customFullCalendarStartDate)), end_time: toJapanISOString(getEndOfDay(customFullCalendarEndDate)) })
  );

  const { data: users } = useSWR(
    isUserCalendarViewVisible ? 'users' : null,
    fetchUsers
  );

  useEffect(() => {
    if (shifts && users) {
      const formattedEvents = formatEventsForFullCalendar(shifts, users);
      setCustomFullCalendarAllMembersShiftEvents(formattedEvents);

      const calculatedShiftHoursData = calcSumShiftHourPerDay(shifts);
      setCustomFullCalendarBgColorsPerDay(calculatedShiftHoursData);
    }
  }, [shifts, users, setCustomFullCalendarAllMembersShiftEvents, setCustomFullCalendarBgColorsPerDay]);

  // データの再取得を行う関数を返す
  return { mutateAllShifts: mutate };
}
