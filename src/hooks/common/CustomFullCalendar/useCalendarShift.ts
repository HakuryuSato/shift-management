// ライブラリ
import { useEffect, useCallback } from 'react';
import useSWR, { mutate } from 'swr';

// Store
import { useUserHomeStore } from '@/stores/user/userHomeSlice';
import { useUserCalendarViewStore } from '@/stores/user/userCalendarViewSlice';
import { useCustomFullCalendarStore } from '@stores/common/customFullCalendarSlice';

// API呼び出し
import { fetchShifts, fetchUsers } from '@/utils/client/apiClient';

// util関数
import { formatEventsForFullCalendar } from '@/utils/formatEventsForFullCalendar';
// import { calcDateRangeForMonth } from '@/utils/calcDateRangeForMonth'; // shiftAPIの更新時に使う
import calcSumShiftHourPerDay from "@utils/calcSumShiftHourPerDay";
import { useModalContainer } from '../Modal/useModalContainer';



//シフトの情報を取得し、個人用と全員用の状態にセットする
export function useCalendarShift() {
  // state
  const customFullCalendarCurrentMonth = useCustomFullCalendarStore((state) => state.customFullCalendarCurrentMonth);
  const customFullCalendarAllMembersShiftEvents = useCustomFullCalendarStore((state) => state.customFullCalendarAllMembersShiftEvents)
  const isUserCalendarViewVisible = useUserCalendarViewStore((state) => state.isUserCalendarViewVisible);   // カレンダーView

  // set
  const setCustomFullCalendarAllMembersShiftEvents = useCustomFullCalendarStore((state) => state.setCustomFullCalendarAllMembersShiftEvents);
  const setCustomFullCalendarBgColorsPerDay = useCustomFullCalendarStore((state) => state.setCustomFullCalendarBgColorsPerDay);

  // // 更新
  // const updateCustomFullCalendarEvents = useCustomFullCalendarStore((state) => state.updateCustomFullCalendarEvents);





  // shiftAPIの更新時、attendanceと同じように以下の形式で呼び出すように設計すること
  // const { start_date, end_date } = calcDateRangeForMonth(customFullCalendarCurrentMonth)



  // キャッシュ取得パターンの定義
  const { data: shifts } = useSWR(
    isUserCalendarViewVisible
      ? ['shifts', customFullCalendarCurrentMonth, customFullCalendarAllMembersShiftEvents].join('-')
      : null,
    () => fetchShifts({ user_id: '*', month: customFullCalendarCurrentMonth })
  );

  const { data: users } = useSWR(
    isUserCalendarViewVisible
      ? ['users']
      : null,
    () => fetchUsers()
  );


  // カレンダーのシフトデータを更新(mutateでrevalidateを強制)
  const updateCalendarShift = async () => {

    const shifts = await mutate(
      ['shifts', customFullCalendarCurrentMonth, customFullCalendarAllMembersShiftEvents].join('-'));

    // データを再取得
    if (shifts) {
      const formattedEvents = formatEventsForFullCalendar(shifts, users);
      console.log('formattedEvents', formattedEvents)
      setCustomFullCalendarAllMembersShiftEvents(formattedEvents);

      const calculatedShiftHoursData = calcSumShiftHourPerDay(shifts);
      setCustomFullCalendarBgColorsPerDay(calculatedShiftHoursData)
    }


  };




  useEffect(() => { // 初回実行用
    // カレンダーのシフトデータを更新
    updateCalendarShift()

  }, [])


  // useEffect(() => {
  //   if (shifts) {
  //     console.log('Formatting events for FullCalendar');
  //     const formattedEvents = formatEventsForFullCalendar(shifts, users);
  //     console.log('formattedEvents', formattedEvents)
  //     setCustomFullCalendarAllMembersShiftEvents(formattedEvents);

  //     const calculatedShiftHoursData = calcSumShiftHourPerDay(shifts);
  //     setCustomFullCalendarBgColorsPerDay(calculatedShiftHoursData)
  //   }
  // }, [shifts, customFullCalendarCurrentMonth, isUserCalendarViewVisible, customFullCalendarAllMembersShiftEvents, users]);

  return { updateCalendarShift };
}
