// hooks/useAttendanceEventsForCustomFullCalendar.ts
import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchAttendance } from '@/utils/apiClient';
import { useCustomFullCalendarStore } from '@stores/common/customFullCalendarSlice';
import { formatAttendancesForFullCalendarEvent } from '@/utils/attendanceUtils';

interface UseAttendanceEventsParams {
  userId: string;
  year: number;
  month: number;
}

export function useAttendanceEventsForCustomFullCalendar({ userId, year, month }: UseAttendanceEventsParams) {
  const { setCustomFullCalendarAttendanceEvents } = useCustomFullCalendarStore();

  const { data: attendances } = useSWR(
    ['/api/getAttendance', userId, year, month],
    () => fetchAttendance({ user_id: userId, year, month })
  );

  useEffect(() => {
    if (attendances) {
      const formattedEvents = formatAttendancesForFullCalendarEvent(attendances);
      setCustomFullCalendarAttendanceEvents(formattedEvents);
    }
  }, [attendances]);
}
