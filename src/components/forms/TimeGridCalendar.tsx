/* eslint-disable react-hooks/exhaustive-deps */
"use client";
// 基盤
import React, { useEffect, useState,useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import TimeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import { EventClickArg } from "@fullcalendar/core";
import useSWR from "swr";

// 独自
import formatShiftsForFullCalendarEvent from "@/utils/formatShiftsForFullCalendarEvent";
import ShiftRegisterForm from "@components/common/ShiftRegisterForm";
import fetchSendShift from "@utils/fetchSendShift";

// 変換用関数
import extractTimeFromDate from "@utils/extractTimeFromDate";
import convertJtcToIsoString from "@/utils/convertJtcToIsoString";
import calcSumShiftHourPerDay from "@utils/calcSumShiftHourPerDay";

import downloadWeeklyShiftTableXlsx from "@utils/downloadWeeklyShiftTableXlsx";

// fetch
import fetchUpdateShift from "@/utils/fetchUpdateShift";
// 型
import InterFaceShiftQuery from "@/customTypes/InterFaceShiftQuery";

// スタイル
import "@styles/custom-fullcalendar-styles.css"; // FullCalendarのボタン色変更

// API fetch
import fetchUserData from "@utils/fetchUserData";
import fetchShifts from "@/utils/fetchShifts";

// 祝日取得用
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// コンポーネント----------------------------------------------------------------------------------------------------------------------------------------------
const TimeGridCalendar: React.FC<{ onLogout: () => void; onBack: () => void }> =
  ({ onLogout, onBack }) => {
    // 定数 -----------------------------------------------------------------------------------------------------------------------

    // 関数 -----------------------------------------------------------------------------------------------------------------------

    // 祝日を取得する
    const { data: holidaysData, error: holidaysError } = useSWR(
      "/api/holidays",
      fetcher,
    );
    
    // holidaysDataが更新された場合のみholidaysを再計算
    const holidays = useMemo(() => (holidaysData ? holidaysData.data : []), [holidaysData]);

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

      // 混雑状況の表示
      const calculatedShiftHoursData = calcSumShiftHourPerDay(data);
      setBGColorsPerDay(calculatedShiftHoursData);

      // setShiftEvents(formattedEvents);
      // 祝日があるなら祝日も設定
      if (holidays) {
        const holidayEvents = holidays.map((holiday: any) => ({
          title: holiday.title,
          start: holiday.date,
          allDay: true,
          color: "#69b076",
          extendedProps: {
            isHoliday: true,
          },
        }));

        const allEvents = [...formattedEvents, ...holidayEvents];
        setShiftEvents(allEvents);
      } else {
        setShiftEvents(formattedEvents);
      }
      
    };

    // シフト登録モーダル非表示
    const closeRegisterModal = async () => { // 関数名変更、async 追加
      if (selectedShiftId != null) { // 選択シフトIDが存在するなら(編集モードで開いていたなら)
        setSelectedShiftId(null);
        setSelectedDate("");
        setSelectedEventShiftTime(null);
      }

      setIsRegisterModalOpen(false);
      setSelectedShiftId(null);
      setSelectedShiftUserName("");

      await updateEventData(startDate, endDate);
    };

    // フック--------------------------------------------------------------------------------------------------------------
    // state
    const [shiftEvents, setShiftEvents] = useState<
      { start: string; end: string }[]
    >([]);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);
    const [selectedShiftUserName, setSelectedShiftUserName] = useState<string>(
      "",
    );
    const [selectedEventShiftTime, setSelectedEventShiftTime] = useState<
      string | null
    >(null);

    // モーダル
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [bGColorsPerDay, setBGColorsPerDay] = useState<
      { [date: string]: string }
    >({});

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
    const handleEventClick = async (eventInfo: EventClickArg) => {
      // ShiftRegisterForm用にデータを準備してモーダルを開く
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
      setSelectedShiftUserName(eventInfo.event.title);
      setIsRegisterModalOpen(true);
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

    // シフト登録 *子コンポで行うと反映が間に合わないため、ここで実行している。
    const handleShiftRegister = async (
      shiftData: InterFaceShiftQuery | InterFaceShiftQuery[],
    ) => {
      await fetchSendShift(shiftData);
    };

    // シフト更新 *子コンポで行うと反映が間に合わないため、ここで実行している。
    const handleShiftUpdate = async (shiftData: InterFaceShiftQuery) => {
      await fetchUpdateShift(shiftData);
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
            left: "backToMenuButton",
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
          }}
          allDaySlot={true}
          dateClick={handleDateClick}
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
        />

        <ShiftRegisterForm
          onUpdate={handleShiftUpdate}
          isOpen={isRegisterModalOpen}
          onClose={closeRegisterModal}
          selectedDate={selectedDate}
          user_id={0}
          user_name={selectedShiftUserName}
          onRegister={handleShiftRegister}
          isAdmin={true}
          selectedShiftId={selectedShiftId}
          selectedEventShiftTime={selectedEventShiftTime}
        />
      </div>
    );
  };

export default TimeGridCalendar;
