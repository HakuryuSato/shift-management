"use client";

// ライブラリ
import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg, EventContentArg } from "@fullcalendar/core";
import { useSwipeable } from "react-swipeable";

// Store
import { useCustomFullCalendarStore } from "@stores/common/customFullCalendarSlice";
import { useCalendarViewToggleStore } from "@stores/user/calendarViewToggleSlice";


// Hooks
import { useAttendanceEventsForCustomFullCalendar } from "@/hooks/useAttendanceEventsForCustomFullCalendar";
import { useHolidaysForCustomFullCalendar } from "@/hooks/useHolidaysForCustomFullCalendar";
import { usePersonalShiftEventsForCustomFullCalendar } from "@/hooks/usePersonalShiftEventsForCustomFullCalendar";
import { useAllMembersShiftEventsForCustomFullCalendar } from "@/hooks/useAllmembersShiftEventsForCustomFullCalendar";

export function CustomFullCalendar() {
  const calendarRef = useRef<FullCalendar>(null);



  const {
    customFullCalendarRole,
    customFullCalendarBgColorsPerDay,
    setCustomFullCalendarStartDate,
    setCustomFullCalendarEndDate,
    setCustomFullCalendarCurrentYear,
    setCustomFullCalendarCurrentMonth,
    customFullCalendarHolidayEvents,
    customFullCalendarAttendanceEvents,
    customFullCalendarPersonalShiftEvents,
    customFullCalendarAllMembersShiftEvents,
  } = useCustomFullCalendarStore();

  const { calendarViewMode } = useCalendarViewToggleStore();


  // Hooks  ---------------------------------------------------------------------------------------------------
  // 祝日データををフルカレ用のStateに設定
  useHolidaysForCustomFullCalendar();

  // 出退勤データをStateに設定
  useAttendanceEventsForCustomFullCalendar();

  // 個人用シフトデータ
  usePersonalShiftEventsForCustomFullCalendar();

  // 全員用シフトデータ
  useAllMembersShiftEventsForCustomFullCalendar();




  // イベントハンドラ  ---------------------------------------------------------------------------------------------------
    // Swipe handlers
    const reactSwipeHandlers = useSwipeable({
      onSwipedLeft: () => calendarRef.current?.getApi().next(),
      onSwipedRight: () => calendarRef.current?.getApi().prev(),
      trackMouse: true, // マウスでのテストを可能にする（オプション）
    });

  const handleEventClick = (info: EventClickArg) => {
    console.log("イベントがクリックされました:", info.event);
  };

  const handleDateClick = (info: DateClickArg) => {
    console.log("日付がクリックされました:", info.dateStr);
  };

  const handleDownloadWeeklyData = () => {
    console.log("週次データのダウンロード");
  };

  const onBack = () => {
    console.log("戻るボタンがクリックされました");
  };

  const handleMultipleInputClick = () => {
    console.log("複数入力がクリックされました");
  };

  const renderEventContent = (eventInfo: EventContentArg) => {
    if (eventInfo.event.extendedProps.isHoliday) { // 祝日イベント
      // 祝日を設定
      return (
        <div>
          <b>{eventInfo.event.title}</b>
        </div>
      );
    } else { // それ以外
      // Existing shift event rendering
      const startTime = eventInfo.event.start?.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTime = eventInfo.event.end?.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      return (
        <div>
          <b>
            {startTime}-
            <br />
            {endTime}
          </b>
          <br />
          <i>{eventInfo.event.title}</i>
        </div>
      );
    }
  };

  // FullCalendarオプション  ---------------------------------------------------------------------------------------------------

  const plugins = [interactionPlugin];
  let initialView = "";
  let headerToolbar = {};
  let footerToolbar = {};
  let customButtons = {};
  let datesSetHandler = undefined;

  if (customFullCalendarRole === "admin") {
    plugins.push(timeGridPlugin);
    initialView = "timeGridWeek";
    headerToolbar = {
      left: "goToAttendanceViewButton",
      center: "title",
      right: "downloadWeeklyDataButton",
    };
    footerToolbar = {
      left: "prev",
      center: "",
      right: "next",
    };
    customButtons = {
      goToAttendanceViewButton: {
        text: "１ヶ月の画面へ",
        click: onBack,
      },
      downloadWeeklyDataButton: {
        text: "１週間のデータダウンロード",
        click: handleDownloadWeeklyData,
      },
    };
    // 週や月変更時に日付のStateを変更するため
    datesSetHandler = (dateInfo: any) => {
      setCustomFullCalendarStartDate(new Date(dateInfo.start));
      setCustomFullCalendarEndDate(new Date(dateInfo.end));
    };
  } else if (customFullCalendarRole === "user") {
    plugins.push(dayGridPlugin);
    initialView = "dayGridMonth";
    headerToolbar = false;
    footerToolbar = false;

    datesSetHandler = (dateInfo: any) => {
      const fullCalendarDate = new Date(dateInfo.start);
      fullCalendarDate.setDate(fullCalendarDate.getDate() + 15);
      setCustomFullCalendarCurrentYear(fullCalendarDate.getFullYear());
      setCustomFullCalendarCurrentMonth(fullCalendarDate.getMonth());
    };
  }

  const dayCellClassNames = (info: any) => {
    const classes = [];
    const today = new Date();
    const dateStr = info.date
      .toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");

    // 今月の日曜日に灰色のテキストを適用
    if (
      info.date.getDay() === 0 &&
      info.date.getMonth() === today.getMonth()
    ) {
      classes.push("text-gray");
    }

    // 混雑状況に応じて背景色を適用
    if (customFullCalendarBgColorsPerDay[dateStr]) {
      classes.push(customFullCalendarBgColorsPerDay[dateStr]);
    }

    return classes.join(" ");
  };

  const customFullCalendarEvents = [
    ...customFullCalendarHolidayEvents,
    ...(calendarViewMode === "ATTENDANCE"
      ? customFullCalendarAttendanceEvents
      : calendarViewMode === "PERSONAL_SHIFT"
      ? customFullCalendarPersonalShiftEvents
      : calendarViewMode === "ALL_MEMBERS_SHIFT"
      ? customFullCalendarAllMembersShiftEvents
      : [])
  ];

  // console.log(customFullCalendarEvents);


  return (
    <div {...reactSwipeHandlers}>
      <FullCalendar
        ref={calendarRef}
        plugins={plugins}
        initialView={initialView}
        height="auto"
        locale={jaLocale}
        events={customFullCalendarEvents}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        headerToolbar={headerToolbar}
        footerToolbar={footerToolbar}
        customButtons={customButtons}
        datesSet={datesSetHandler}
        dayCellClassNames={dayCellClassNames}
        {...(customFullCalendarRole === "admin" && {
          slotMinTime: "08:00:00",
          slotMaxTime: "21:00:00",
          slotLabelInterval: "01:00:00",
          slotEventOverlap: false,
          eventOverlap: false,
          allDaySlot: true,
        })}
        {...(customFullCalendarRole === "user" && {
          dayCellContent: (e: any) => e.dayNumberText.replace("日", ""),
          eventContent: renderEventContent,
          fixedWeekCount: false,
        })}
      />
    </div>
  );
}

export default CustomFullCalendar;
