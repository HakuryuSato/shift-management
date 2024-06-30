
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import TimeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';

// API
import getShift from '@api/getShift';

// 型宣言
import type { InterFaceShiftQuery } from '@/customTypes/InterFaceShiftQuery';

// 関数: FullCalendar用にデータ整形
function formatEvents(data: any[]) {
  return data.map((shift) => ({
    start: shift.start_time,
    end: shift.end_time,
  }));
}

// 関数: 送信用クエリ作成
function createContext(year: number, month: number) {
  const context: InterFaceShiftQuery = {
    query: {
      user_id:'*',
      year: year,
      month: month,
    },
  };
  return context;
}

const TimeGridCalendar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  // state
  const [shiftEvents, setShiftEvents] = useState<{ start: string; end: string }[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentWeek, setCurrentWeek] = useState<number>(0);

  // effect
  useEffect(() => {
    updateEventData();
  }, [currentMonth]);

  // イベントデータを取得しFullCalendarのStateにセットする関数
  const updateEventData = async () => {
    const context = createContext(currentYear, currentMonth);
    const response = await getShift(context);
    if (response.props.data) {
      const formattedEvents = formatEvents(response.props.data);
      setShiftEvents(formattedEvents);
    }
  };

  return (
    <div>
      <FullCalendar
        plugins={[TimeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        height="auto"
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'timeGridWeek,timeGridDay',
        }}
        locale={jaLocale}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        slotLabelInterval="01:00:00"
        events={shiftEvents}
        eventOverlap={false} // イベントが重ならないように設定
        slotEventOverlap={false} // 時間枠内のイベントが重ならないように設定
        eventMaxStack={10} // 同時に表示するイベントの最大数
        datesSet={(dateInfo) => {
          setCurrentYear(dateInfo.start.getFullYear());
          setCurrentMonth(dateInfo.start.getMonth() + 1);
        }}

        
      />
      <button onClick={onLogout}>ログアウト</button>
    </div>
  );
};

export default TimeGridCalendar;
