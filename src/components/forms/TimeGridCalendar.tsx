"use client";
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import TimeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";

// API
import getShift from "@api/getShift";

// 型宣言
import type { InterFaceShiftQuery } from "@/customTypes/InterFaceShiftQuery";

// 関数: FullCalendar用にデータ整形
function formatEvents(data: any[]) {
  return data.map((shift) => ({
    start: shift.start_time,
    end: shift.end_time,
  }));
}

// 関数: 送信用クエリ作成
function createContext(startDate: number, endDate: number) {
  const context: InterFaceShiftQuery = {
    query: {
      user_id: "*",
      start_time: startDate,
      end_time: endDate,
    },
  };
  return context;
}
// コンポーネント--------------------------------------------------------------------------------------------------------------
const TimeGridCalendar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  // フック--------------------------------------------------------------------------------------------------------------
  // state
  const [shiftEvents, setShiftEvents] = useState<
    { start: string; end: string }[]
  >([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  // effect
  useEffect(() => {  // 初回用
    const initialStartDate = new Date();
    const initialEndDate = new Date();
    initialEndDate.setDate(initialStartDate.getDate() + 7); // 1週間後の日付を設定
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    updateEventData(initialStartDate, initialEndDate);
  }, []);
  
  useEffect(() => { // 変更時用
    if (startDate && endDate) {
      updateEventData(startDate, endDate);
    }
  }, [startDate, endDate]);

  


  // 関数 -----------------------------------------------------------------------------------------------------------------------
  // イベントデータを取得しFullCalendarのStateにセットする関数
const updateEventData = async (start: Date, end: Date) => {
  const context = createContext(start.getTime(), end.getTime());
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
          left: "prev,next",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        locale={jaLocale}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        slotLabelInterval="01:00:00"
        events={shiftEvents}
        eventOverlap={true} // イベントが重ならないように設定
        slotEventOverlap={false} // 時間枠内のイベントが重ならないように設定
        // eventMaxStack={10} // 同時に表示するイベントの最大数

        datesSet={(dateInfo) => {
          const newStartDate = new Date(dateInfo.start);
          const newEndDate = new Date(dateInfo.end);
          setStartDate(newStartDate);
          setEndDate(newEndDate);
        }}
      />
      <button onClick={onLogout}>ログアウト</button>
    </div>
  );
};

export default TimeGridCalendar;