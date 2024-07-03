"use client";

// 基盤
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import interactionPlugin from "@fullcalendar/interaction";
import React, { useEffect, useRef, useState } from "react";
import { EventClickArg } from "@fullcalendar/core";

// オリジナル
import UserShiftRegisterForm from "@forms/UserShiftRegisterForm";
import formatShiftsForFullCalendarEvent from "@/utils/formatShiftsForFullCalendarEvent";
import createContext from "@/utils/createContext";

// API
import getShift from "@api/getShift";

// 型宣言
// import type { InterFaceShiftQuery } from "@/customTypes/InterFaceShiftQuery";
import type InterFaceTableUsers from "@customTypes/InterFaceTableUsers";

// スタイル
import "@styles/custom-fullcalendar-styles.css" // FullCalendarのボタン色変更

// Props
interface DayGridCalendarProps {
  onLogout: () => void;
  user: InterFaceTableUsers;
}


const DayGridCalendar: React.FC<DayGridCalendarProps> = (
  { onLogout, user },
) => { //以下コンポーネント--------------------------------------------------------------------------------------------
  // 以下定数---------------------------------------------------------------------------------------------------------
  // const calendarRef = useRef(null);
  const userId: number = user.user_id!; // page.tsxでログインしているためnull以外

  // 以下コンポーネント関数---------------------------------------------------------------------------------------------------------
  // モーダル非表示
  const closeModal = () => {
    setIsModalOpen(false);
    updateEventData();
  };

  // FullCalendarのイベントの表示方法を変更する
  const renderEventContent = (eventInfo: any) => {
    const startTime = eventInfo.event.start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = eventInfo.event.end?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return (
      <div>
        <b>{startTime} - {endTime}</b>
        <br />
        <i>{eventInfo.event.title}</i>
      </div>
    );
  };

  // 以下フック-------------------------------------------------------------------------------------------------------
  // state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [shiftEvents, setShiftEvents] = useState<
    { start: string; end: string }[]
  >([]);
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth(),
  );

  // effect
  // コンポーネントレンダー時にイベント取得
  useEffect(() => {
    updateEventData(); // 月が切り替わったら全データ再取得
  }, [currentMonth]);

  // 今月のイベントデータを取得しFullCalendarのStateにセットする関数
  const updateEventData = async () => {
    const context = createContext({
      user_id: userId,
      year: currentYear,
      month: currentMonth,
    });
    const response = await getShift(context);
    if (response.props.data) {
      const formattedEvents = formatShiftsForFullCalendarEvent(response.props.data);
      setShiftEvents(formattedEvents);
    }
  };

  // 以下ハンドラー-------------------------------------------------------------------------------------------------------
  // イベント(予定)クリック
  const handleEventClick = (arg: EventClickArg) => {
    // setSelectedDate(arg.dateStr);
    // setIsModalOpen(true); // 削除ボタンのついた別のモーダルを表示する
  };

  // 日付クリック
  const handleDateClick = (info: { dateStr: string }) => {
    setSelectedDate(info.dateStr);
    setIsModalOpen(true);
  };

  // 以下レンダリング-------------------------------------------------------------------------------------------------------
  return (
    <div>
      <button onClick={onLogout}>ログアウト</button>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        // ref={calendarRef}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
        locale={jaLocale}
        dayCellContent={(e) => e.dayNumberText.replace("日", "")} // x日 の表記を消す
        events={shiftEvents}
        eventContent={renderEventContent}
        headerToolbar={{
          left: "",
          center: "title",
          right: "prev,next",
        }}
        dayCellClassNames={(arg) => { // 今月の日曜日だけ色を少し薄くする
          const today = new Date();
          return (
              arg.date.getDay() === 0 &&
              arg.date.getMonth() === today.getMonth()
            )
            ? "text-gray"
            : "";
        }}
        datesSet={(dateInfo) => { // 年数と月数を取得
          setCurrentYear(dateInfo.start.getFullYear());
          setCurrentMonth(dateInfo.start.getMonth() + 1);
        }}
      />

      <UserShiftRegisterForm
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedDate={selectedDate}
        user_id={user.user_id!}
      />
      <h1>{user.user_name}</h1>
    </div>
  );
};

export default DayGridCalendar;
