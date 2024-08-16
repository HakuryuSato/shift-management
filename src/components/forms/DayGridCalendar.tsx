"use client";

// 基盤
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import jaLocale from "@fullcalendar/core/locales/ja";
import interactionPlugin from "@fullcalendar/interaction";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { EventClickArg } from "@fullcalendar/core";

// オリジナル
import ShiftRegisterForm from "@components/common/ShiftRegisterForm"
import formatShiftsForFullCalendarEvent from "@/utils/formatShiftsForFullCalendarEvent";
// import createContext from "@/utils/createContext";
import UserShiftDeleteForm from "@forms/CommonShiftDeleteForm";
import calcSumShiftHourPerDay from "@utils/calcSumShiftHourPerDay";
import Button from "@ui/Button";

// 変換用関数
import convertJtcToIsoString from "@utils/convertJtcToIsoString";
import extractTimeFromDate from "@utils/extractTimeFromDate";

// fetch関数
import fetchSendShift from "@utils/fetchSendShift";

// 型
import type InterFaceShiftQuery from "@customTypes/InterFaceShiftQuery";
import type InterFaceTableUsers from "@customTypes/InterFaceTableUsers";

// スタイル
import "@styles/custom-fullcalendar-styles.css"; // FullCalendarのボタン色変更

// Props
interface DayGridCalendarProps {
  onLogout: () => void; // デバッグ用
  user: InterFaceTableUsers;
}

const DayGridCalendar: React.FC<DayGridCalendarProps> = (
  { onLogout, user },
) => { //以下コンポーネント--------------------------------------------------------------------------------------------
  // 以下定数---------------------------------------------------------------------------------------------------------
  const userId: number = user.user_id!; // page.tsxでログインしているためnull以外

  // State -------------------------------------------------------------------------------------------------------
  // モーダル
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEventShiftTime, setSelectedEventShiftTime] = useState<string | null>(null);

  const [shiftEvents, setShiftEvents] = useState<
    { start: string; end: string }[]
  >([]);
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth(),
  );

  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);
  const [isAllMembersView, setIsAllMembersView] = useState(false); // シフト表示切替用 true:みんなのシフト false:個人のシフト
  const [bGColorsPerDay, setBGColorsPerDay] = useState<
    { [date: string]: string }
  >({});

  // 関数---------------------------------------------------------------------------------------------------------
  // 今月のイベントデータを取得しFullCalendarのStateにセットする関数
  const updateEventData = useCallback(async () => {
    const user_id = isAllMembersView ? "*" : userId;

    try {
      // APIからシフトデータを取得
      const response = await fetch(
        `/api/getShift?user_id=${user_id}&year=${currentYear}&month=${currentMonth}`,
      );

      const responseData = await response.json();
      const data = responseData.data; // dataキーの値を使用

      // イベントをフルカレ用に書式変更
      const formattedEvents = formatShiftsForFullCalendarEvent(
        data,
        isAllMembersView,
      );

      // もし全員のビューなら各日のシフト時間を計算して日付の背景色を取得
      if (isAllMembersView) {
        const calculatedShiftHoursData = calcSumShiftHourPerDay(data);
        setBGColorsPerDay(calculatedShiftHoursData);
      } else {
        setBGColorsPerDay({});
      }

      setShiftEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
    }
  }, [userId, currentYear, currentMonth, isAllMembersView]);

  // シフト登録モーダル非表示
  const closeRegisterModal = async () => {
    if (selectedShiftId != null) { // 選択シフトIDが存在するなら(編集モードで開いていたなら)
      setSelectedShiftId(null);
      setSelectedDate(null);
      setSelectedEventShiftTime(null);
    }
    setIsModalOpen(false);
    setIsEditMode(false);
    await updateEventData();
  };

  // シフト削除モーダル非表示
  // const closeDeleteModal = async () => {
  //   setIsDeleteModalOpen(false);
  //   setSelectedShiftId(null);
  //   await updateEventData();
  // };

  // // シフト編集モーダル非表示
  // const closeEditModal = async () => {
  //   setIsEditMode(false);
  //   setSelectedShiftId(null);
  //   await updateEventData();
  // };

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
    setIsAllMembersView(!isAllMembersView);
  };

  // Effect  -------------------------------------------------
  useEffect(() => {
    updateEventData();
  }, [updateEventData, currentMonth, isAllMembersView]);

  // 以下ハンドラー-------------------------------------------------------------------------------------------------------
  // 日付クリック
  const handleDateClick = (dateInfo: { dateStr: string }) => { // 日付クリック
    function checkUserAndDate(array: any[], userId: number, date: string) {
      array.sort((a, b) => a.start.localeCompare(b.start));

      return !array.some((obj) =>
        obj.extendedProps.user_id === userId &&
        obj.start.split("T")[0] === date
      );
    }

    const clickedDate = dateInfo.dateStr;
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
  const handleEventClick = (eventInfo: EventClickArg) => {
    if (
      // シフトが承認済みでなく、ユーザーidが自分と一致するなら
      !eventInfo.event.extendedProps.is_approved &&
      eventInfo.event.extendedProps.user_id == userId
    ) {
      setSelectedShiftId(
        eventInfo.event.id ? parseInt(eventInfo.event.id) : null,
      );
      setSelectedDate(convertJtcToIsoString(String(eventInfo.event.start)));

      const startTime = eventInfo.event.start
        ? extractTimeFromDate(eventInfo.event.start)
        : null;
      const endTime = eventInfo.event.end
        ? extractTimeFromDate(eventInfo.event.end)
        : null;

      setSelectedEventShiftTime(`${startTime}-${endTime}`);
      setIsEditMode(true);
      setIsModalOpen(true);
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
            text: isAllMembersView ? "個人シフト画面へ" : "全員のシフト画面へ",
            click: toggleShiftView,
          },
        }}
        dayCellClassNames={(info) => {
          const classes = [];
          const today = new Date();
          const dateStr = info.date.toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).replace(/\//g, "-");

          // 今月の日曜日だけ色を少し薄くする
          if (
            info.date.getDay() === 0 &&
            info.date.getMonth() === today.getMonth()
          ) {
            classes.push("text-gray");
          }

          // シフト混雑状況に応じて色変更
          if (bGColorsPerDay[dateStr]) {
            classes.push(bGColorsPerDay[dateStr]);
          }

          return classes.join(" ");
        }}
        datesSet={(dateInfo) => { // 年数と月数を取得
          const fullCalendarDate = new Date(dateInfo.start);
          fullCalendarDate.setDate(fullCalendarDate.getDate() + 15);

          setCurrentYear(fullCalendarDate.getFullYear());
          setCurrentMonth(fullCalendarDate.getMonth());
        }}
      />

      <ShiftRegisterForm
        isOpen={isModalOpen}
        onClose={closeRegisterModal}
        selectedDate={selectedDate}
        user_id={user.user_id!}
        onRegister={handleRegister}
        isAdmin={false}
        selectedShiftId={selectedShiftId}
        selectedEventShiftTime={selectedEventShiftTime}
      />

      <h1>{user.user_name}としてログインしています</h1>

      {
        /* {selectedShiftId !== null && (
        <UserShiftDeleteForm
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          shiftId={selectedShiftId}
        />
      )} */
      }

      {/* <Button text="ログアウト" onClick={onLogout}/> */}
    </div>
  );
};

export default DayGridCalendar;
