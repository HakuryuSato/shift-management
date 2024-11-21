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
import { useCalendarAttendance } from "@/hooks/common/CustomFullCalendar/useCalendarAttendances";
import { useCalendarHolidays } from "@/hooks/common/CustomFullCalendar/useCalendarHolidays";
import { useCalendarShiftPersonal } from "@/hooks/common/CustomFullCalendar/useCalendarShiftPersonal";
import { useCalendarShiftAllMembers } from "@/hooks/common/CustomFullCalendar/useCalendarShiftAllmembers";
import { useCalendarClickHandlers } from "@/hooks/common/CustomFullCalendar/useCalendarClickHandlers";

// FullCalendar用設定群
import { renderEventContent } from "./renderEventContnt";
import { dayCellClassNames } from "./dayCellClassNames";

export function CustomFullCalendar() {
  const calendarRef = useRef<FullCalendar>(null);

  // State群 ---------------------------------------------------------------------------------------------------
  const customFullCalendarRole = useCustomFullCalendarStore(
    (state) => state.customFullCalendarRole,
  );
  const customFullCalendarBgColorsPerDay = useCustomFullCalendarStore(
    (state) => state.customFullCalendarBgColorsPerDay,
  );
  const setCustomFullCalendarStartDate = useCustomFullCalendarStore(
    (state) => state.setCustomFullCalendarStartDate,
  );
  const setCustomFullCalendarEndDate = useCustomFullCalendarStore(
    (state) => state.setCustomFullCalendarEndDate,
  );
  const setCustomFullCalendarCurrentYear = useCustomFullCalendarStore(
    (state) => state.setCustomFullCalendarCurrentYear,
  );
  const setCustomFullCalendarCurrentMonth = useCustomFullCalendarStore(
    (state) => state.setCustomFullCalendarCurrentMonth,
  );
  const customFullCalendarHolidayEvents = useCustomFullCalendarStore(
    (state) => state.customFullCalendarHolidayEvents,
  );
  const customFullCalendarAttendanceEvents = useCustomFullCalendarStore(
    (state) => state.customFullCalendarAttendanceEvents,
  );
  const customFullCalendarPersonalShiftEvents = useCustomFullCalendarStore(
    (state) => state.customFullCalendarPersonalShiftEvents,
  );
  const customFullCalendarAllMembersShiftEvents = useCustomFullCalendarStore(
    (state) => state.customFullCalendarAllMembersShiftEvents,
  );

  const calendarViewMode = useCalendarViewToggleStore((state) =>
    state.calendarViewMode
  );

  // Hooks  ---------------------------------------------------------------------------------------------------
  // 各種データをCustomFullCalendarSoreに設定
  // 祝日
  useCalendarHolidays();

  // 出退勤
  useCalendarAttendance();

  // 個人用シフト
  useCalendarShiftPersonal();

  // 全員用シフト
  useCalendarShiftAllMembers();

  // イベントハンドラ  ---------------------------------------------------------------------------------------------------
  // 左右スワイプで月を切り替え
  const reactSwipeHandlers = useSwipeable({
    onSwipedLeft: () => calendarRef.current?.getApi().next(),
    onSwipedRight: () => calendarRef.current?.getApi().prev(),
    trackMouse: true, // マウスでのテストを可能にする（オプション）
  });

  // Click
  const { handleClickDate, handleClickEvent } = useCalendarClickHandlers();

  // フルカレ用イベント(ViewModeに応じて異なるデータ表示)
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
          // if (customFullCalendarRole === "admin") {
          //   setCustomFullCalendarStartDate(new Date(dateInfo.start));
          //   setCustomFullCalendarEndDate(new Date(dateInfo.end));
          // } else {

          const fullCalendarDate = new Date(dateInfo.start);
          if (customFullCalendarRole === "user") {
            fullCalendarDate.setDate(fullCalendarDate.getDate() + 15);
            // setCustomFullCalendarCurrentYear(fullCalendarDate.getFullYear());
            setCustomFullCalendarCurrentMonth(fullCalendarDate.getMonth()); // バーに表示するために残す
          }
          // }
          // カレンダーの表示開始日と終了日を取得
          setCustomFullCalendarStartDate(new Date(dateInfo.start));
          setCustomFullCalendarEndDate(new Date(dateInfo.end));
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
