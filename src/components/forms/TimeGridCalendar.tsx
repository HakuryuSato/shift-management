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
import CommonShiftRegisterForm from "@forms/CommonShiftRegisterForm";
import fetchSendShift from "@utils/fetchSendShift";
import ShiftDeleteForm from "@forms/CommonShiftDeleteForm";

// 型
import InterFaceShiftQuery from "@/customTypes/InterFaceShiftQuery";

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
          `/api/getShift?user_id=${"*"}&start_time=${start_time}&end_time=${end_time}`,
        );

        const responseData = await response.json();
        const data = responseData.data; // dataキーの値を使用
        const formattedEvents = formatShiftsForFullCalendarEvent(
          data,
          true, // イベント名に名前を表示
        );
        setShiftEvents(formattedEvents);
      } catch (error) {
        console.error("Failed to fetch shifts:", error);
      }
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
    const handleEventClick = async (arg: EventClickArg) => {
      // ここにイベント削除を実装する
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
      await await fetchSendShift(shiftData);
      await updateEventData(startDate, endDate);
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
              text: "１ヶ月の画面へ",
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
          dateClick={handleDateClick}
        />

        {/* <button onClick={onLogout}>ログアウト</button> */}

        <CommonShiftRegisterForm
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
