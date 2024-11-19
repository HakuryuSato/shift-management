import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchAttendances } from '@/utils/client/apiClient';
import { useCustomFullCalendarStore } from '@stores/common/customFullCalendarSlice';
import { formatEventsForFullCalendar } from '@/utils/client/formatEventsForFullCalendar';
import { useUserHomeStore } from '@/stores/user/userHomeSlice';

import { useUserCalendarViewStore } from '@/stores/user/userCalendarViewSlice';
import { getTimeRangeISOStrings } from '@/utils/common/dateUtils';
// import { get } from '@/utils/common/dateUtils'

export function useCalendarAttendance() {
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
    isUserCalendarViewVisible && userId && customFullCalendarStartDate && customFullCalendarEndDate
      ? `attendances/${userId}-${customFullCalendarStartDate}-${customFullCalendarEndDate}`
      : null,
    () => fetchAttendances({ user_id: userId, startDate: startTimeISO, endDate: endTimeISO })
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
