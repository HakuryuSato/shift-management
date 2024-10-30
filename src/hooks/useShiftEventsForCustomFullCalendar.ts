// hooks/useShiftEventsForCustomFullCalendar.ts
import { useEffect } from 'react';
import useSWR from 'swr';
import { fetchShifts } from '@/utils/apiClient';
import { useCustomFullCalendarStore } from '@stores/common/customFullCalendarSlice';
import  formatShiftsForFullCalendarEvent  from '@/utils/formatShiftsForFullCalendarEvent';
import calcSumShiftHourPerDay from "@utils/calcSumShiftHourPerDay"
import { useCalendarViewToggleStore } from '@stores/user/calendarViewToggleSlice';

interface UseShiftEventsParams {
  userId: string;
  year: number;
  month: number;
}

export function useShiftEventsForCustomFullCalendar({ userId, year, month }: UseShiftEventsParams) {
  const {
    setCustomFullCalendarPersonalShiftEvents,
    setCustomFullCalendarAllMembersShiftEvents,
    setCustomFullCalendarBgColorsPerDay,
  } = useCustomFullCalendarStore();

  const { calendarViewMode } = useCalendarViewToggleStore();

  const isAllMembersView = calendarViewMode === 'ALL_MEMBERS_SHIFT';
  const targetUserId = isAllMembersView ? '*' : userId;

  const { data: shifts } = useSWR(
    ['/api/getShift', targetUserId, year, month],
    () => fetchShifts({ user_id: targetUserId, year, month })
  );

  useEffect(() => {
    if (shifts) {
      const formattedEvents = formatShiftsForFullCalendarEvent(shifts, isAllMembersView);

      if (isAllMembersView) {
        setCustomFullCalendarAllMembersShiftEvents(formattedEvents);

        const calculatedShiftHoursData = calcSumShiftHourPerDay(shifts);
        setCustomFullCalendarBgColorsPerDay(calculatedShiftHoursData);
      } else {
        setCustomFullCalendarPersonalShiftEvents(formattedEvents);
        setCustomFullCalendarBgColorsPerDay({});
      }
    }
  }, [shifts]);
}
