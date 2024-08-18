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
import ShiftRegisterForm from "@components/common/ShiftRegisterForm";
import fetchSendShift from "@utils/fetchSendShift";

import ShiftDeleteForm from "@components/common/ShiftDeleteForm";
import downloadWeeklyShiftTableXlsx from "@utils/downloadWeeklyShiftTableXlsx";
import createTableForAdminShift from "@/utils/createTableForAdminShift";


// 型
import InterFaceShiftQuery from "@/customTypes/InterFaceShiftQuery";

// スタイル
import "@styles/custom-fullcalendar-styles.css"; // FullCalendarのボタン色変更

// API fetch
import fetchUserData from "@utils/fetchUserData";
import fetchShifts from "@/utils/fetchShifts";

// コンポーネント----------------------------------------------------------------------------------------------------------------------------------------------
const TimeGridCalendar: React.FC<{ onLogout: () => void; onBack: () => void }> =
  ({ onLogout, onBack }) => {
    // 定数 -----------------------------------------------------------------------------------------------------------------------

    // 関数 -----------------------------------------------------------------------------------------------------------------------
    const updateEventData = async (start_time: Date, end_time: Date) => {
      const data = await fetchShifts(
        {
          start_time: start_time,
          end_time: end_time,
        },
      );

      const formattedEvents = formatShiftsForFullCalendarEvent(
        data,
        true, // イベント名に名前を表示
      );

      setShiftEvents(formattedEvents);
    };

    

    // シフト登録モーダル非表示
    const closeRegisterModal = async () => { // 関数名変更、async 追加
      setIsRegisterModalOpen(false);
      await updateEventData(startDate, endDate);
    };

    // シフト削除モーダル非表示
    const closeDeleteModal = async () => { // async に変更
      setIsDeleteModalOpen(false);
      setSelectedShiftId(null);
      await updateEventData(startDate, endDate);
    };

    // フック--------------------------------------------------------------------------------------------------------------
    // state
    const [shiftEvents, setShiftEvents] = useState<
      { start: string; end: string }[]
    >([]);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [currentView, setCurrentView] = useState("timeGridWeek");
    // const [operationMode, setOperationMode] = useState<string>("approval"); // モード管理用、一旦承認のみ
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);

    // モーダル
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 削除モーダル用

    // effect
    useEffect(() => { // 初回用
      // 今日の日付から、今週の日曜日と土曜日を取得し、表示される期間に格納する
      const today = new Date();
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - today.getDay()); // 日曜日

      const saturday = new Date(sunday);
      saturday.setDate(sunday.getDate() + 6); // 土曜日

      setStartDate(sunday);
      setEndDate(saturday);
      updateEventData(sunday, saturday);
    }, []);

    useEffect(() => { // 変更時用
      if (startDate && endDate) {
        updateEventData(startDate, endDate);
      }
    }, [startDate, endDate]);

    // ハンドラー -----------------------------------------------------------------------------------------------------------------------
    // イベントクリックハンドラー
    const handleEventClick = async (arg: EventClickArg) => {
      setSelectedShiftId(arg.event.id ? parseInt(arg.event.id) : null);
      setIsDeleteModalOpen(true);
    };

    // 日付クリック
    const handleDateClick = (info: { dateStr: string }) => { // 日付クリック
      const clickedDate = info.dateStr;
      const formattedClickedDate = clickedDate.split("T")[0];
      const isSunday = new Date(clickedDate).getDay() === 0;

      if (!isSunday) { // 日曜日でないなら
        setSelectedDate(formattedClickedDate);
        setIsRegisterModalOpen(true);
      }
    };

    // シフト登録
    const handleRegister = async (shiftData: InterFaceShiftQuery) => {
      await fetchSendShift(shiftData);
      await updateEventData(startDate, endDate);
    };

    // 一週間分ダウンロード
    const handleDownloadWeeklyShifts = async () => {
      downloadWeeklyShiftTableXlsx(startDate, endDate, shiftEvents);
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
            right: "downloadWeeklyShiftButton",
          }}
          footerToolbar={{ // フッター
            left: "prev",
            center: "", //ここにシフト登録、削除、承認のモード選択ボタンを追加
            right: "next",
          }}
          customButtons={{ // FullCalendar内に埋め込む独自ボタン
            backToMenuButton: {
              text: "１ヶ月の画面へ",
              click: onBack,
            },
            downloadWeeklyShiftButton: {
              text: "１週間のシフト表ダウンロード",
              click: handleDownloadWeeklyShifts,
            },
          }}
          locale={jaLocale}
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
          slotLabelInterval="01:00:00"
          events={shiftEvents}
          slotEventOverlap={false} // 時間枠内のイベントが重ならないように設定
          // eventMaxStack={20} // 同時に表示するイベントの最大数
          eventOverlap={false} // イベントが重ならないように設定
          eventClick={handleEventClick}
          datesSet={(dateInfo) => { // 週変更時発火
            const newStartDate = new Date(dateInfo.start);
            const newEndDate = new Date(dateInfo.end);
            setStartDate(newStartDate);
            setEndDate(newEndDate);
            setCurrentView(dateInfo.view.type);
          }}
          allDaySlot={false}
          dateClick={handleDateClick}
        />


        <ShiftRegisterForm

          isOpen={isRegisterModalOpen}
          onClose={closeRegisterModal}
          selectedDate={selectedDate}
          user_id={0}
          onRegister={handleRegister}
          isAdmin={true}
        />

        {selectedShiftId !== null && (
          <ShiftDeleteForm
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            shiftId={selectedShiftId}
          />
        )}
      </div>
    );
  };

export default TimeGridCalendar;
