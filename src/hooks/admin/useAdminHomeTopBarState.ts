import { useAdminHomeTopBarStore } from "@/stores/admin/adminHomeTopBarSlice";
import { useCustomFullCalendarStore } from "@/stores/common/customFullCalendarSlice";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import {
  formatJapanDateToYearMonth,
  formatJapanDateToYearMonthDay,
} from "@/utils/common/dateUtils";

export const useAdminHomeTopBarState = (adminHomeMode: string) => {
  // AdminHomeTopBar関連のState
  const isVisibleAdminHomeTopBarUserEditButtons = useAdminHomeTopBarStore(
    (state) => state.isVisibleAdminHomeTopBarUserEditButtons,
  );

  const isVisibleAdminHomeTopBarExcelDownloadButton = useAdminHomeTopBarStore(
    (state) => state.isVisibleAdminHomeTopBarExcelDownloadButton,
  );

  // CustomFullCalendar関連のState
  const customFullCalendarStartDate = useCustomFullCalendarStore(
    (state) => state.customFullCalendarStartDate,
  );
  const customFullCalendarEndDate = useCustomFullCalendarStore(
    (state) => state.customFullCalendarEndDate,
  );

  // AdminAttendanceView関連のState
  const adminAttendanceViewEndDate = useAdminAttendanceViewStore((state) =>
    state.adminAttendanceViewEndDate
  );
  const adminAttendanceViewSelectedUser = useAdminAttendanceViewStore((state) =>
    state.adminAttendanceViewSelectedUser
  );

  // モードに応じてボタンとタイトルのテキストを設定
  let leftSideButtonText = "";
  let titleText = "";
  let downloadText = "";

  if (adminHomeMode === "SHIFT") {
    leftSideButtonText = "出退勤の画面へ";
    const startDate = new Date(customFullCalendarStartDate);
    startDate.setDate(startDate.getDate());
    const endDate = new Date(customFullCalendarEndDate);
    endDate.setDate(endDate.getDate() - 1);
    titleText = `${
      formatJapanDateToYearMonthDay(startDate)
    } ─ ${
      formatJapanDateToYearMonthDay(endDate).slice(5)
    }`;
    downloadText = "シフト表(Excel)ダウンロード";
  } else if (adminHomeMode === "MONTHLY_ATTENDANCE") {
    titleText = formatJapanDateToYearMonth(adminAttendanceViewEndDate);
    leftSideButtonText = "シフト画面へ";
    downloadText = "全体出勤表(Excel)ダウンロード";
  } else if (adminHomeMode === "PERSONAL_ATTENDANCE") {
    leftSideButtonText = "戻る";
    titleText = `${
      formatJapanDateToYearMonth(adminAttendanceViewEndDate)
    } ${adminAttendanceViewSelectedUser?.user_name}`;
    downloadText = "個人出勤表(Excel)ダウンロード";
  }

  return {
    isVisibleAdminHomeTopBarUserEditButtons,
    isVisibleAdminHomeTopBarExcelDownloadButton,
    titleText,
    leftSideButtonText,
    downloadText,
  };
};
