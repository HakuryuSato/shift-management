"use client";

// 基盤
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import interactionPlugin from "@fullcalendar/interaction";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { EventClickArg } from "@fullcalendar/core";

// オリジナル
import UserShiftRegisterForm from "@forms/UserShiftRegisterForm";
import formatShiftsForFullCalendarEvent from "@/utils/formatShiftsForFullCalendarEvent";
// import createContext from "@/utils/createContext";
import UserShiftDeleteForm from "@forms/UserShiftDeleteForm";
import Button from "@ui/Button";

// fetch関数
import fetchSendShift from "@utils/fetchSendShift"

// 型
import type InterFaceShiftQuery from "@customTypes/InterFaceShiftQuery";
import type InterFaceTableUsers from "@customTypes/InterFaceTableUsers";

// スタイル
import "@styles/custom-fullcalendar-styles.css"; // FullCalendarのボタン色変更

// Props
interface DayGridCalendarProps {
  onLogout: () => void; // デバッグ
  user: InterFaceTableUsers;
}



const DayGridCalendar: React.FC<DayGridCalendarProps> = (
  { onLogout, user },
) => { //以下コンポーネント--------------------------------------------------------------------------------------------
  // 以下定数---------------------------------------------------------------------------------------------------------
  const userId: number = user.user_id!; // page.tsxでログインしているためnull以外

  // State -------------------------------------------------------------------------------------------------------
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
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null); // イベントクリック用
  const [isApprovedView, setIsApprovedView] = useState(true); // シフト表示切替用 true:シフト確認 false:シフト希望提出

  // 関数---------------------------------------------------------------------------------------------------------
  // 今月のイベントデータを取得しFullCalendarのStateにセットする関数
  // 今月のイベントデータを取得しFullCalendarのStateにセットする関数
  const updateEventData = useCallback(async () => {
    const user_id = isApprovedView ? "*" : userId;

    try {
      // APIからシフトデータを取得
      const response = await fetch(
        `/api/getShift?user_id=${user_id}&year=${currentYear}&month=${currentMonth}`,
      );

      const responseData = await response.json();
      const data = responseData.data; // dataキーの値を使用
      const formattedEvents = formatShiftsForFullCalendarEvent(
        data,
        isApprovedView,
      );
      setShiftEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
    }
  }, [userId, currentYear, currentMonth, isApprovedView]);

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

  // シフトの表示方法を切り替える
  const toggleShiftView = () => {
    setIsApprovedView(!isApprovedView);
  };

  // Effect  -------------------------------------------------
  useEffect(() => {
    updateEventData();
  }, [updateEventData, currentMonth, isApprovedView]);

  // 以下ハンドラー-------------------------------------------------------------------------------------------------------
  // 日付クリック
  const handleDateClick = (info: { dateStr: string }) => { // 日付クリック
    function checkUserAndDate(array: any[], userId: number, date: string) {
      array.sort((a, b) => a.start.localeCompare(b.start));

      return !array.some((obj) =>
        obj.extendedProps.user_id === userId &&
        obj.start.split("T")[0] === date
      );
    }

    const clickedDate = info.dateStr;
    const isSunday = new Date(clickedDate).getDay() === 0;
    const isThisMonth = (new Date(clickedDate).getMonth()) === currentMonth;

    if (
      !isSunday &&
      isThisMonth &&
      checkUserAndDate(shiftEvents, userId, clickedDate)
    ) { // 日曜日でなく、今月であり、自分のイベントが存在しないなら
      setSelectedDate(clickedDate);
      setIsModalOpen(true);
    }
  };

  // イベント(予定)クリック
  const handleEventClick = (arg: EventClickArg) => {
    // シフトが承認済みでなく、ユーザーidが自分と一致するなら
    if (
      !arg.event.extendedProps.is_approved &&
      arg.event.extendedProps.user_id == userId
    ) {
      setSelectedShiftId(arg.event.id ? parseInt(arg.event.id) : null);
      setIsDeleteModalOpen(true);
    }
  };

  // シフト登録
  const handleRegister = async (shiftData: InterFaceShiftQuery) => {
    await await fetchSendShift(shiftData);
    await updateEventData();
  };

  // 以下レンダリング-------------------------------------------------------------------------------------------------------
  return (
    <div>
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
          left: "toggleShiftViewButton",
          center: "",
          right: "title",
        }}
        footerToolbar={{
          left: "prev",
          center: "",
          right: "next",
        }}
        customButtons={{
          toggleShiftViewButton: {
            text: isApprovedView ? "個人シフト画面へ" : "全員のシフト画面へ",
            click: toggleShiftView,
          },
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
          const fullCalendarDate = new Date(dateInfo.start);
          fullCalendarDate.setDate(fullCalendarDate.getDate() + 15);

          setCurrentYear(fullCalendarDate.getFullYear());
          setCurrentMonth(fullCalendarDate.getMonth());
        }}
      />

      <UserShiftRegisterForm
        isOpen={isModalOpen}
        onClose={closeRegisterModal}
        selectedDate={selectedDate}
        user_id={user.user_id!}
        onRegister={handleRegister}
      />

      <h1>{user.user_name}としてログインしています</h1>
      {selectedShiftId !== null && (
        <UserShiftDeleteForm
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          shiftId={selectedShiftId}
        />
      )}

      {/* <Button text="ログアウト" onClick={onLogout}/> */}
    </div>
  );
};

export default DayGridCalendar;
