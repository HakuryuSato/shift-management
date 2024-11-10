import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchAttendance } from '@/utils/client/apiClient';
import { useCustomFullCalendarStore } from '@stores/common/customFullCalendarSlice';
import { formatEventsForFullCalendar } from '@/utils/formatEventsForFullCalendar';
import { useUserHomeStore } from '@/stores/user/userHomeSlice';
import { calcDateRangeForMonth } from '@/utils/calcDateRangeForMonth';
import { useUserCalendarViewStore } from '@/stores/user/userCalendarViewSlice';


export function useCalendarAttendances() {
  const setCustomFullCalendarAttendanceEvents = useCustomFullCalendarStore(
    (state) => state.setCustomFullCalendarAttendanceEvents
  );
  const customFullCalendarCurrentMonth = useCustomFullCalendarStore(
    (state) => state.customFullCalendarCurrentMonth
  );
  const userId = useUserHomeStore((state) => state.userId);
  const isUserCalendarViewVisible = useUserCalendarViewStore(
    (state) => state.isUserCalendarViewVisible
  );

  const { start_date, end_date } = calcDateRangeForMonth(customFullCalendarCurrentMonth);


  const { data: attendances, mutate } = useSWR(
    isUserCalendarViewVisible
      ? ['attendances', userId, start_date, end_date].join('-')
      : null,
    () => fetchAttendance({ user_id: userId, start_date, end_date })
  );


  useEffect(() => {
    if (attendances) {
      const formattedEvents = formatEventsForFullCalendar(attendances,);
      setCustomFullCalendarAttendanceEvents(formattedEvents);
    }
  }, [attendances, customFullCalendarCurrentMonth, isUserCalendarViewVisible, setCustomFullCalendarAttendanceEvents]);

}
