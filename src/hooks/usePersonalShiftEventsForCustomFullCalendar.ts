// ライブラリ
import { useEffect } from 'react';
import useSWR from 'swr';

// Store
import { useUserHomeStore } from '@/stores/user/userHomeSlice';
import { useUserCalendarViewStore } from '@/stores/user/userCalendarViewSlice';
import { useCustomFullCalendarStore } from '@stores/common/customFullCalendarSlice';

// API呼び出し
import { fetchShifts } from '@/utils/apiClient';

// util関数
import { formatEventsForFullCalendar } from '@/utils/formatEventsForFullCalendar';
// import { calcDateRangeForMonth } from '@/utils/calcDateRangeForMonth'; // shiftAPIの更新時に使う



export function usePersonalShiftEventsForCustomFullCalendar() {
  const { setCustomFullCalendarPersonalShiftEvents, customFullCalendarCurrentMonth} = useCustomFullCalendarStore();


  const { userId } = useUserHomeStore();
  // shiftAPIの更新時、attendanceと同じように以下の形式で呼び出すように設計すること
  // const { start_date, end_date } = calcDateRangeForMonth(customFullCalendarCurrentMonth)
  const { isUserCalendarViewVisible } = useUserCalendarViewStore();

  const { data: shifts } = useSWR(
    isUserCalendarViewVisible 
      ? ['personal_shifts', userId, customFullCalendarCurrentMonth].join('-')
      : null,
    () => fetchShifts({ user_id: userId, month:customFullCalendarCurrentMonth })
  );


  useEffect(() => {
    if (shifts) {
      const formattedEvents = formatEventsForFullCalendar(shifts);
      setCustomFullCalendarPersonalShiftEvents(formattedEvents);
    }
  }, [shifts, customFullCalendarCurrentMonth, isUserCalendarViewVisible,setCustomFullCalendarPersonalShiftEvents]);

}
