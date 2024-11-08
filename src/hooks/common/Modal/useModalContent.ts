import { useModalContentStore } from '@/stores/common/modalContentSlice';
import { useCustomFullCalendarStore } from '@/stores/common/customFullCalendarSlice';

export const useModalContent = () => {
  const {
    setModalContentSelectedDate,
    setModalContentSelectedStartTime,
    setModalContentSelectedEndTime,
    setModalContentSelectedUserName,
  } = useModalContentStore((state) => ({
    setModalContentSelectedDate: state.setModalContentSelectedDate,
    setModalContentSelectedStartTime: state.setModalContentSelectedStartTime,
    setModalContentSelectedEndTime: state.setModalContentSelectedEndTime,
    setModalContentSelectedUserName: state.setModalContentSelectedUserName,
  }));

  const { customFullCalendarClickedEvent, customFullCalendarClickedDate } = useCustomFullCalendarStore((state) => ({
    customFullCalendarClickedEvent: state.customFullCalendarClickedEvent,
    customFullCalendarClickedDate: state.customFullCalendarClickedDate,
  }));

  // 初期化処理
  const modalContentInitialize = (mode: 'eventClick' | 'dateClick') => {
    if (mode === 'eventClick') {
      if (customFullCalendarClickedEvent) {
        // 日付を取得
        const startDate = customFullCalendarClickedEvent.event.start;
        const dateStr = startDate ? startDate.toISOString().slice(0, 10) : ''; // "YYYY-MM-DD"

        // ユーザー名を取得
        const userName = customFullCalendarClickedEvent.event.extendedProps.user_name || '';

        // 開始・終了時間を取得
        const startTime = customFullCalendarClickedEvent.event.start;
        const endTime = customFullCalendarClickedEvent.event.end;

        // 時間を 'HH:mm' 形式にフォーマット
        const formatTime = (date: Date | null) => (date ? date.toTimeString().slice(0, 5) : '');

        const startTimeStr = formatTime(startTime);
        const endTimeStr = formatTime(endTime);

        // 状態を更新
        setModalContentSelectedDate(dateStr);
        setModalContentSelectedUserName(userName);
        setModalContentSelectedStartTime(startTimeStr);
        setModalContentSelectedEndTime(endTimeStr);
      }
    } else if (mode === 'dateClick') {
      if (customFullCalendarClickedDate) {
        // 日付を取得
        const dateStr = customFullCalendarClickedDate.dateStr || '';

        // 状態を初期化
        setModalContentSelectedDate(dateStr);
        setModalContentSelectedUserName('');
        setModalContentSelectedStartTime('');
        setModalContentSelectedEndTime('');
      }
    }
  };

  // その他のハンドラ
  const handleChangeStartTime = (newStartTime: string) => {
    setModalContentSelectedStartTime(newStartTime);
  };

  const handleChangeEndTime = (newEndTime: string) => {
    setModalContentSelectedEndTime(newEndTime);
  };

  const handleChangeSelectedUser = (newUserName: string) => {
    setModalContentSelectedUserName(newUserName);
  };

  return {
    modalContentInitialize,
    handleChangeStartTime,
    handleChangeEndTime,
    handleChangeSelectedUser,
  };
};
