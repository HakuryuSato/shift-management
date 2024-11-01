"use client";

// ライブラリ
import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import { useSwipeable } from "react-swipeable";

// Store
import { useCustomFullCalendarStore } from "@stores/common/customFullCalendarSlice";
import { useCalendarViewToggleStore } from "@stores/user/calendarViewToggleSlice";

// Hooks
import { useAttendanceEventsForCustomFullCalendar } from "@/hooks/useAttendanceEventsForCustomFullCalendar";
import { useHolidaysForCustomFullCalendar } from "@/hooks/useHolidaysForCustomFullCalendar";
import { usePersonalShiftEventsForCustomFullCalendar } from "@/hooks/usePersonalShiftEventsForCustomFullCalendar";
import { useAllMembersShiftEventsForCustomFullCalendar } from "@/hooks/useAllmembersShiftEventsForCustomFullCalendar";

// クリックイベント群
import {
  handleClickDate,
  handleClickDownloadWeeklyData,
  handleClickEvent,
  handleClickMultipleInput,
  handleClickToAttendance,
} from "./clickHandlers";

// フルカレンダー用設定
import { renderEventContent } from "./renderEventContnt";
import { dayCellClassNames } from "./dayCellClassNames";

export function CustomFullCalendar() {
  const calendarRef = useRef<FullCalendar>(null);

  // State群 ---------------------------------------------------------------------------------------------------
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
  // 左右スワイプで月を切り替え
  const reactSwipeHandlers = useSwipeable({
    onSwipedLeft: () => calendarRef.current?.getApi().next(),
    onSwipedRight: () => calendarRef.current?.getApi().prev(),
    trackMouse: true, // マウスでのテストを可能にする（オプション）
  });

  // FullCalendar設定群、MUIに以降して外部化するので、一部廃止予定  ---------------------------------------------------------------------------------------------------

  const customFullCalendarEvents = [
    ...customFullCalendarHolidayEvents,
    ...(calendarViewMode === "ATTENDANCE"
      ? customFullCalendarAttendanceEvents
      : calendarViewMode === "PERSONAL_SHIFT"
      ? customFullCalendarPersonalShiftEvents
      : calendarViewMode === "ALL_MEMBERS_SHIFT"
      ? customFullCalendarAllMembersShiftEvents
      : []),
  ];



  return (
    <div {...reactSwipeHandlers}>
      <FullCalendar
        ref={calendarRef}
        // カレンダーの形式を指定
        plugins={[
          interactionPlugin,
          ...(customFullCalendarRole === "admin"
            ? [timeGridPlugin]
            : [dayGridPlugin]),
        ]}
        initialView={customFullCalendarRole === "admin"
          ? "timeGridWeek"
          : "dayGridMonth"}

        height="auto"
        locale={jaLocale}
        events={customFullCalendarEvents}
        eventClick={handleClickEvent}
        dateClick={handleClickDate}

        headerToolbar={false}
        footerToolbar={false}

        // 月や週遷移時の日付再設定
        datesSet={(dateInfo) => {
        if (customFullCalendarRole === "admin") {
          setCustomFullCalendarStartDate(new Date(dateInfo.start));
          setCustomFullCalendarEndDate(new Date(dateInfo.end));
        } else {
          const fullCalendarDate = new Date(dateInfo.start);
          fullCalendarDate.setDate(fullCalendarDate.getDate() + 15);
          setCustomFullCalendarCurrentYear(fullCalendarDate.getFullYear());
          setCustomFullCalendarCurrentMonth(fullCalendarDate.getMonth());
        }
      }}

        // 日付セルに適用するCSSを定義
        dayCellClassNames={(info) =>
          dayCellClassNames(
            info,
            calendarViewMode,
            customFullCalendarBgColorsPerDay,
          )}
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
