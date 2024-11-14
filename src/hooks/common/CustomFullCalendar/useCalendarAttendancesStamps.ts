import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchAttendanceStamps } from '@/utils/client/apiClient';
import { useCustomFullCalendarStore } from '@stores/common/customFullCalendarSlice';
import { formatEventsForFullCalendar } from '@/utils/client/formatEventsForFullCalendar';
import { useUserHomeStore } from '@/stores/user/userHomeSlice';

import { useUserCalendarViewStore } from '@/stores/user/userCalendarViewSlice';
import { getTimeRangeISOStrings } from '@/utils/common/dateUtils'

export function useCalendarAttendanceStamps() {
  const setCustomFullCalendarAttendanceEvents = useCustomFullCalendarStore(
    (state) => state.setCustomFullCalendarAttendanceEvents
  );

  const customFullCalendarStartDate = useCustomFullCalendarStore(
    (state) => state.customFullCalendarStartDate
  );
  const customFullCalendarEndDate = useCustomFullCalendarStore(
    (state) => state.customFullCalendarEndDate)

  const userId = useUserHomeStore((state) => state.userId);
  const isUserCalendarViewVisible = useUserCalendarViewStore(
    (state) => state.isUserCalendarViewVisible
  );

  const { startTimeISO, endTimeISO } = getTimeRangeISOStrings('range', customFullCalendarStartDate, customFullCalendarEndDate)

  // カレンダーを表示している、かつリクエストに必要なデータが全てあるなら取得
  const { data: attendances, mutate } = useSWR(
    isUserCalendarViewVisible && userId && startTimeISO && endTimeISO
      ? `attendances/stamps-${userId}-${startTimeISO}-${endTimeISO}`
      : null,
    () => fetchAttendanceStamps({ user_id: userId, startTimeISO, endTimeISO })
  );

  useEffect(() => {
    if (attendances) {
      const formattedEvents = formatEventsForFullCalendar(attendances);
      setCustomFullCalendarAttendanceEvents(formattedEvents);
    }
  }, [attendances, setCustomFullCalendarAttendanceEvents]);

  // データの再取得を行う関数を返す
  return { mutateAttendances: mutate };
}
