"use client";
// 基盤
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import TimeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import { EventClickArg } from "@fullcalendar/core";

// 独自
import formatShiftsForFullCalendarEvent from "@/utils/formatShiftsForFullCalendarEvent";
// import createContext from "@/utils/createContext";
// import Button from "@ui/Button";


// スタイル
import "@styles/custom-fullcalendar-styles.css"; // FullCalendarのボタン色変更



// コンポーネント----------------------------------------------------------------------------------------------------------------------------------------------
const TimeGridCalendar: React.FC<{ onLogout: () => void; onBack: () => void }> =
  ({ onLogout, onBack }) => {
    // 定数 -----------------------------------------------------------------------------------------------------------------------

    // 関数 -----------------------------------------------------------------------------------------------------------------------
    // イベントデータを取得しFullCalendarのStateにセットする関数
    const updateEventData = async (start_time: Date, end_time: Date) => {

      try {
        // APIからシフトデータを取得
        const response = await fetch(
          `/api/getShift?user_id=${'*'}&start_time=${start_time}&end_time=${end_time}`,
        );
  
        const responseData = await response.json();
        const data = responseData.data; // dataキーの値を使用
        const formattedEvents = formatShiftsForFullCalendarEvent(
          data,
          true // イベント名に名前を表示
          
        );
        setShiftEvents(formattedEvents);
      } catch (error) {
        console.error("Failed to fetch shifts:", error);
      }
    };

    // フック--------------------------------------------------------------------------------------------------------------
    // state
    const [shiftEvents, setShiftEvents] = useState<
      { start: string; end: string }[]
    >([]);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [currentView, setCurrentView] = useState("timeGridWeek");
    const [operationMode, setOperationMode] = useState<string>("approval"); // モード管理用、一旦承認のみ
    

    // effect
    useEffect(() => { // 初回用
      const initialStartDate = new Date();
      const initialEndDate = new Date();
      initialStartDate.setDate(initialStartDate.getDate() - 7); // 1週間前の日付を設定
      initialEndDate.setDate(initialEndDate.getDate() + 7); // 1週間後の日付を設定
      
      setStartDate(initialStartDate);
      setEndDate(initialEndDate);
      updateEventData(initialStartDate, initialEndDate);
    }, []);

    useEffect(() => { // 変更時用
      if (startDate && endDate) {
        updateEventData(startDate, endDate);
      }
    }, [startDate, endDate]);

    // ハンドラー -----------------------------------------------------------------------------------------------------------------------
    // イベントクリックハンドラー
    const handleEventClick = async (clickInfo: EventClickArg) => {
      // ここにイベント削除を実装する

    };

    return (
      <div>
        <FullCalendar
          plugins={[TimeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          height="auto"
          headerToolbar={{ // ヘッダー
            left: currentView === "timeGridDay"
              ? "timeGridWeek"
              : "backToMenuButton",
            center: "title",
            right: "",
          }}
          footerToolbar={{ // フッター
            left: "prev",
            center: "", //ここにシフト登録、削除、承認のモード選択ボタンを追加
            right: "next",
          }}
          customButtons={{ // FullCalendar内に埋め込む独自ボタン
            backToMenuButton: {
              text: "承認済みシフト画面",
              click: onBack,
            },
          }}
          locale={jaLocale}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          slotLabelInterval="01:00:00"
          events={shiftEvents}
          slotEventOverlap={false} // 時間枠内のイベントが重ならないように設定
          // eventMaxStack={20} // 同時に表示するイベントの最大数
          eventOverlap={false} // イベントが重ならないように設定
          eventClick={handleEventClick}
          datesSet={(dateInfo) => {
            const newStartDate = new Date(dateInfo.start);
            const newEndDate = new Date(dateInfo.end);
            setStartDate(newStartDate);
            setEndDate(newEndDate);
            setCurrentView(dateInfo.view.type);
          }}
          allDaySlot={false}
          // dateClick={(info) => { // ここにシフト追加を実装する必要がある
          //   const calendarApi = info.view.calendar;
          //   calendarApi.changeView("timeGridDay", info.date);
          // }}
        />
        {/* <button onClick={onLogout}>ログアウト</button> */}
      </div>
    );
  };

export default TimeGridCalendar;
