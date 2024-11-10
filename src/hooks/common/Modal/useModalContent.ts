import { useEffect } from 'react';
import { useModalContentStore } from '@/stores/common/modalContentSlice';
import { useCustomFullCalendarStore } from '@/stores/common/customFullCalendarSlice';
import { useModalContainerStore } from '@/stores/common/modalContainerSlice';
import { toJapanDateString } from '@/utils/toJapanDateString'
import { getUserOptions, setUserOptions } from '@/utils/userOptions';


export const useModalContent = () => {
  const modalMode = useModalContainerStore((state) => state.modalMode)

  const setModalContentSelectedDate = useModalContentStore((state) => state.setModalContentSelectedDate);
  const setModalContentSelectedStartTime = useModalContentStore((state) => state.setModalContentSelectedStartTime);
  const setModalContentSelectedEndTime = useModalContentStore((state) => state.setModalContentSelectedEndTime);
  const setModalContentSelectedUserName = useModalContentStore((state) => state.setModalContentSelectedUserName);

  const customFullCalendarClickedEvent = useCustomFullCalendarStore((state) => state.customFullCalendarClickedEvent);
  const customFullCalendarClickedDate = useCustomFullCalendarStore((state) => state.customFullCalendarClickedDate);


  // ModalContent初期化用関数
  const modalContentInitialize = (mode: 'eventClick' | 'dateClick') => {
    if (mode === 'eventClick') {
      if (customFullCalendarClickedEvent) {

        // 日付、ユーザー名、開始・終了時間をフルカレイベントから取得
        const startDate = customFullCalendarClickedEvent.event.start;
        const dateStr = startDate ? toJapanDateString(startDate) : ''; // "YYYY-MM-DD"
        const userName = customFullCalendarClickedEvent.event.extendedProps.user_name ?? '';
        const startTime = customFullCalendarClickedEvent.event.start;
        const endTime = customFullCalendarClickedEvent.event.end;

        // 時間を 'HH:mm' 形式にフォーマット
        const extractTime = (date: Date | null) =>
          date?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? '';

        const startTimeStr = extractTime(startTime);
        const endTimeStr = extractTime(endTime);

        // 状態を更新
        setModalContentSelectedDate(dateStr);
        setModalContentSelectedUserName(userName);
        setModalContentSelectedStartTime(startTimeStr);
        setModalContentSelectedEndTime(endTimeStr);
      }
    } else if (mode === 'dateClick') {
      if (customFullCalendarClickedDate) {
        // 日付を取得
        const dateStr = customFullCalendarClickedDate.dateStr;

        // 状態を初期化
        setModalContentSelectedDate(dateStr);
        // setModalContentSelectedUserName('');
        const { start_time, end_time } = getUserOptions();
        // ここでCookieから値取得
        setModalContentSelectedStartTime(start_time || '');
        setModalContentSelectedEndTime(end_time || '');
      }
    }
  };


  // その他のハンドラ
  const handleChangeStartEndTime = (newStartTime: string, newEndTime: string) => {
    setModalContentSelectedStartTime(newStartTime);
    setModalContentSelectedEndTime(newEndTime);
    setUserOptions({ start_time: newStartTime, end_time: newEndTime });
  };

  // const handleChangeEndTime = (newEndTime: string) => {
  //   setModalContentSelectedEndTime(newEndTime);
  //   setUserOptions({ end_time: newEndTime });
  // };

  const handleChangeSelectedUser = (newUserName: string) => {
    setModalContentSelectedUserName(newUserName);
  };

  return {
    modalContentInitialize,
    handleChangeStartEndTime,
    handleChangeSelectedUser,
  };
};
