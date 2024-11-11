import { useEffect } from 'react';
import useSWR from 'swr';
import { useUserCalendarViewStore } from '@/stores/user/userCalendarViewSlice';
import { useCustomFullCalendarStore } from '@stores/common/customFullCalendarSlice';
import { fetchShifts, fetchUsers } from '@/utils/client/apiClient';
import { formatEventsForFullCalendar } from '@/utils/formatEventsForFullCalendar';
import calcSumShiftHourPerDay from '@utils/calcSumShiftHourPerDay';

export function useCalendarShiftAllMembers() {
  const { customFullCalendarCurrentMonth, setCustomFullCalendarAllMembersShiftEvents, setCustomFullCalendarBgColorsPerDay } = useCustomFullCalendarStore();
  const isUserCalendarViewVisible = useUserCalendarViewStore((state) => state.isUserCalendarViewVisible);

  const { data: shifts, mutate: mutateShifts } = useSWR(
    isUserCalendarViewVisible ? `all_shifts-${customFullCalendarCurrentMonth}` : null,
    () => fetchShifts({ user_id: '*', month: customFullCalendarCurrentMonth })
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
  return { mutateAllShifts: mutateShifts };
}
