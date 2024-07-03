"use client";
// 基盤
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import TimeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import { EventClickArg } from "@fullcalendar/core";

// 独自
import getShift from "@api/getShift";
import sendShiftApproval from "@api/sendShiftApproval";
import formatShiftsForFullCalendarEvent from "@/utils/formatShiftsForFullCalendarEvent";
import createContext from "@/utils/createContext";
import Button from "@ui/Button";

// 型宣言
// import type { InterFaceShiftQuery } from "@/customTypes/InterFaceShiftQuery";

// スタイル
import "@styles/custom-fullcalendar-styles.css"; // FullCalendarのボタン色変更

// コンポーネント----------------------------------------------------------------------------------------------------------------------------------------------
const TimeGridCalendar: React.FC<{ onLogout: () => void; onBack: () => void }> =
  ({ onLogout, onBack }) => {
    // 定数 -----------------------------------------------------------------------------------------------------------------------

    // 関数 -----------------------------------------------------------------------------------------------------------------------
    // イベントデータを取得しFullCalendarのStateにセットする関数
    const updateEventData = async (start: Date, end: Date) => {
      const context = createContext({
        start_time: start.getTime(),
        end_time: end.getTime(),
      });
      const response = await getShift(context);
      if (response.props.data) {
        // console.log("Raw data from getShift:", response.props.data);

        const formattedEvents = formatShiftsForFullCalendarEvent(response.props.data, true);
        // console.log("Formatted events:", formattedEvents); // デバッグ用ログ
        setShiftEvents(formattedEvents);
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

    // ハンドラー -----------------------------------------------------------------------------------------------------------------------
    // イベントクリックハンドラー
    const handleEventClick = async (clickInfo: EventClickArg) => {
      const eventId = clickInfo.event.id;
      if (operationMode === "approval") {
        const response = await sendShiftApproval(Number(eventId)); // eventIdをnumberに変換
        if (response.props.error) {
          // alert("Failed to send approval.");
        } else {
          // alert("Approval sent successfully!");
          updateEventData(startDate, endDate);
        }
      }
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
          dateClick={(info) => {
            const calendarApi = info.view.calendar;
            calendarApi.changeView("timeGridDay", info.date);
          }}
        />
        {/* <button onClick={onLogout}>ログアウト</button> */}
      </div>
    );
  };

export default TimeGridCalendar;
