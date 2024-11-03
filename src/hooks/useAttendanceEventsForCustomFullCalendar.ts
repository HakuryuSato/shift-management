import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchAttendance } from '@/utils/client/apiClient';
import { useCustomFullCalendarStore } from '@stores/common/customFullCalendarSlice';
import { formatEventsForFullCalendar } from '@/utils/formatEventsForFullCalendar';
import { useUserHomeStore } from '@/stores/user/userHomeSlice';
import { calcDateRangeForMonth } from '@/utils/calcDateRangeForMonth';
import { useUserCalendarViewStore } from '@/stores/user/userCalendarViewSlice';


export function useAttendanceEventsForCustomFullCalendar() {
  const { setCustomFullCalendarAttendanceEvents, customFullCalendarCurrentMonth } = useCustomFullCalendarStore();
  const { userId } = useUserHomeStore();
  const { start_date, end_date } = calcDateRangeForMonth(customFullCalendarCurrentMonth)
  const { isUserCalendarViewVisible } = useUserCalendarViewStore();

  const { data: attendances, mutate } = useSWR(
    isUserCalendarViewVisible 
      ? ['attendances', userId, start_date, end_date].join('-')
      : null,
    () => fetchAttendance({ user_id: userId, start_date, end_date })
  );


  useEffect(() => {
    if (attendances) {
      const formattedEvents = formatEventsForFullCalendar(attendances,);
      console.log(formattedEvents)
      setCustomFullCalendarAttendanceEvents(formattedEvents);
    }
  }, [attendances, customFullCalendarCurrentMonth, isUserCalendarViewVisible,setCustomFullCalendarAttendanceEvents]);

}
