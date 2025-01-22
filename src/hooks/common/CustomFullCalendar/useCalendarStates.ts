// Store
import { useCustomFullCalendarStore } from "@stores/common/customFullCalendarSlice";
import { useCalendarViewToggleStore } from "@stores/user/calendarViewToggleSlice";

export const useCalendarStates = () => {
  // CustomFullCalendarRef
  const customFullCalendarRef = useCustomFullCalendarStore(
    (state) => state.customFullCalendarRef
  );

  // CustomFullCalendarStore States
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

  // CalendarViewToggleStore States
  const calendarViewMode = useCalendarViewToggleStore(
    (state) => state.calendarViewMode
  );

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

  return {
    customFullCalendarRef,
    customFullCalendarRole,
    customFullCalendarBgColorsPerDay,
    setCustomFullCalendarStartDate,
    setCustomFullCalendarEndDate,
    setCustomFullCalendarCurrentYear,
    setCustomFullCalendarCurrentMonth,
    calendarViewMode,
    customFullCalendarEvents,
  };
};
