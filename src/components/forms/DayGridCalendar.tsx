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
import UserShiftDeleteForm from "@forms/UserShiftDeleteForm";
import sendShift from "@/api/sendShift";

// API
import getShift from "@api/getShift";

// 型
import type InterFaceShiftQuery from "@customTypes/InterFaceShiftQuery";
import type InterFaceTableUsers from "@customTypes/InterFaceTableUsers";

// スタイル
import "@styles/custom-fullcalendar-styles.css"; // FullCalendarのボタン色変更

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

  // 関数---------------------------------------------------------------------------------------------------------
  // シフト登録モーダル非表示
  const closeRegisterModal = async () => { // 関数名変更、async 追加
    setIsModalOpen(false);
    await updateEventData(); // 更新処理を確実に待つ
  };

  // シフト削除モーダル非表示
  const closeDeleteModal = async () => { // async に変更
    setIsDeleteModalOpen(false);
    setSelectedShiftId(null);
    await updateEventData(); // 更新処理を確実に待つ
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 削除モーダル用
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null); // 追加

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
      const formattedEvents = formatShiftsForFullCalendarEvent(
        response.props.data,
      );
      setShiftEvents(formattedEvents);
    }
  };

  // 以下ハンドラー-------------------------------------------------------------------------------------------------------
  // イベント(予定)クリック
  const handleEventClick = (arg: EventClickArg) => {
    console.log("handleEventClick",arg)
    setSelectedShiftId(arg.event.id ? parseInt(arg.event.id) : null);
    setIsDeleteModalOpen(true);
  };



  // シフト登録
  const handleRegister = async (shiftData: InterFaceShiftQuery) => {
    await sendShift(shiftData); 
    await updateEventData(); 
  };

  // 日付クリック
  const handleDateClick = (info: { dateStr: string }) => {
    setSelectedDate(info.dateStr);
    setIsModalOpen(true);
  };


  // 以下レンダリング-------------------------------------------------------------------------------------------------------
  return (
    <div>
      {/* <button onClick={onLogout}>ログアウト</button> */}

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
        onClose={closeRegisterModal}
        selectedDate={selectedDate}
        user_id={user.user_id!}
        onRegister={handleRegister} 
      />

      <h1>{user.user_name}</h1>
      {selectedShiftId !== null && (
        <UserShiftDeleteForm
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          shiftId={selectedShiftId}
        />
      )}
    </div>
  );
};

export default DayGridCalendar;