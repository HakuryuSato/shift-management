// ライブラリ
import { useCallback } from "react";

// Store
import { useAdminHomeStore } from "@/stores/admin/adminHomeSlice";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { useAdminHomeTopBarStore } from "@/stores/admin/adminHomeTopBarSlice";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";
import { useAttendanceTableAllMembersStore } from "@/stores/admin/attendanceTableAllMembersSlice";
import { useAdminUserManagementFormStore } from "@/stores/admin/adminUserManagementFormSlice";
import { useCustomFullCalendarStore } from "@/stores/common/customFullCalendarSlice";

// Utils
import { getCustomDateRangeFrom26To25, formatJapanDateToYearMonthNoZeroPadding } from "@/utils/common/dateUtils";
import { downloadAttendanceTablePersonalXlsx } from "@/utils/client/downloadAttendanceTablePersonalXlsx";
import { downloadAttendanceTableAllMembersXlsx } from "@/utils/client/downloadAttendanceTableAllMembersXlsx";
import { downloadWeeklyShiftTableXlsx } from "@/utils/downloadWeeklyShiftTableXlsx";

export const useAdminAttendanceTopBar = () => {
  // Home
  const adminHomeMode = useAdminHomeStore((state) => state.adminHomeMode);
  const setAdminHomeMode = useAdminHomeStore((state) => state.setAdminHomeMode);

  // MonthlyTable
  const hidePersonalAttendanceTable = useAdminAttendanceViewStore(
    (state) => state.hidePersonalAttendanceTable
  );
  const showAllMembersMonthlyTable = useAdminAttendanceViewStore(
    (state) => state.showAllMembersMonthlyTable
  );

  // AttendanceView
  const adminAttendanceViewEndDate = useAdminAttendanceViewStore(
    (state) => state.adminAttendanceViewEndDate
  );
  const adminAttendanceViewStartDate = useAdminAttendanceViewStore(
    (state) => state.adminAttendanceViewStartDate
  );
  const adminAttendanceViewSelectedUser = useAdminAttendanceViewStore(
    (state) => state.adminAttendanceViewSelectedUser
  );
  const setAdminAttendanceViewDateRange = useAdminAttendanceViewStore(
    (state) => state.setAdminAttendanceViewDateRange
  );
  // const adminAttendanceViewAllMembersMonthlyResult = useAdminAttendanceViewStore(
  //   (state) => state.adminAttendanceViewAllMembersMonthlyResult
  // );


  // AllMembers
  const adminAttendanceTableAllMembersRows = useAttendanceTableAllMembersStore(
    (state) => state.adminAttendanceTableAllMembersRows
  );


  // Personal
  const AttendanceTablePersonalTableRows = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalTableRows
  );


  // TopBar
  const showAdminHomeTopBarUserEditButtons = useAdminHomeTopBarStore(
    (state) => state.showAdminHomeTopBarUserEditButtons
  );

  // User Management Form
  const openAdminUserManagementForm = useAdminUserManagementFormStore(
    (state) => state.openAdminUserManagementForm
  );





  // 左上のモード切替ボタン ---------------------------------------------------------------------------------------------------
  const handleClickTopLeftButton = useCallback(() => {
    if (adminHomeMode === "SHIFT") {
      setAdminHomeMode("MONTHLY_ATTENDANCE");
    } else if (adminHomeMode === "MONTHLY_ATTENDANCE") {
      setAdminHomeMode("SHIFT");

      // ここで、フルカレンダーの開始終了日をセット
    } else if (adminHomeMode === "PERSONAL_ATTENDANCE") {
      setAdminHomeMode("MONTHLY_ATTENDANCE");
      hidePersonalAttendanceTable();
      showAllMembersMonthlyTable();
      showAdminHomeTopBarUserEditButtons();
    }
  }, [adminHomeMode, hidePersonalAttendanceTable, setAdminHomeMode, showAdminHomeTopBarUserEditButtons, showAllMembersMonthlyTable]);

  // ユーザー登録
  const handleClickUserRegister = useCallback(() => {
    openAdminUserManagementForm('register')

  }, [openAdminUserManagementForm]);

  // ユーザー削除
  const handleClickUserDelete = useCallback(() => {
    openAdminUserManagementForm('delete')

  }, [openAdminUserManagementForm]);

  // Excelダウンロード ---------------------------------------------------------------------------------------------------
  const customFullCalendarStartDate = useCustomFullCalendarStore((state) => state.customFullCalendarStartDate);
  const customFullCalendarEndDate = useCustomFullCalendarStore((state) => state.customFullCalendarEndDate);
  const customFullCalendarAllMembersShiftEvents = useCustomFullCalendarStore((state) => state.customFullCalendarAllMembersShiftEvents);

  const handleClickExcelDownload = useCallback(() => {
    if (adminHomeMode === 'SHIFT') {
      console.log(customFullCalendarStartDate,customFullCalendarEndDate)
      // シフト
      const adjustedEndDate = new Date(customFullCalendarEndDate);
      adjustedEndDate.setDate(adjustedEndDate.getDate() - 1);
      downloadWeeklyShiftTableXlsx(customFullCalendarStartDate, adjustedEndDate, customFullCalendarAllMembersShiftEvents)

    } else if (adminHomeMode === 'MONTHLY_ATTENDANCE') {
      // 出退勤全体
      downloadAttendanceTableAllMembersXlsx(adminAttendanceTableAllMembersRows, `全体出勤表_${formatJapanDateToYearMonthNoZeroPadding(adminAttendanceViewEndDate)}.xlsx`)

    } else if (adminHomeMode === 'PERSONAL_ATTENDANCE') {
      // 出退勤個人

      downloadAttendanceTablePersonalXlsx(AttendanceTablePersonalTableRows, `個人出勤表_${adminAttendanceViewSelectedUser?.user_name}_${formatJapanDateToYearMonthNoZeroPadding(adminAttendanceViewEndDate)}.xlsx`)
    }

    // モード
    console.log("Excelダウンロード処理");
  }, [AttendanceTablePersonalTableRows, adminAttendanceTableAllMembersRows, adminAttendanceViewEndDate, adminAttendanceViewSelectedUser?.user_name, adminHomeMode, customFullCalendarStartDate, customFullCalendarEndDate, customFullCalendarAllMembersShiftEvents]);




  // Calendar
  const calendarRef = useCustomFullCalendarStore((state) => state.customFullCalendarRef);

  // 日付範囲戻る ---------------------------------------------------------------------------------------------------
  const handleClickPrevButton = useCallback(() => {
    if (adminHomeMode === "SHIFT") {
      // シフト
      const calendarApi = calendarRef?.getApi();
      if (calendarApi) {
        calendarApi.prev();
      }
    } else {
      // 出退勤
      const { rangeStartDate, rangeEndDate } = getCustomDateRangeFrom26To25(adminAttendanceViewEndDate, -1)
      setAdminAttendanceViewDateRange(rangeStartDate, rangeEndDate)
    }
  }, [adminAttendanceViewEndDate, adminHomeMode, setAdminAttendanceViewDateRange, calendarRef]);

  // 日付範囲進む ---------------------------------------------------------------------------------------------------
  const handleClickNextButton = useCallback(() => {
    if (adminHomeMode === "SHIFT") {
      // シフト
      const calendarApi = calendarRef?.getApi();
      if (calendarApi) {
        calendarApi.next();
      }

    } else {
      // 出退勤
      const { rangeStartDate, rangeEndDate } = getCustomDateRangeFrom26To25(adminAttendanceViewEndDate, +1)
      setAdminAttendanceViewDateRange(rangeStartDate, rangeEndDate)
    }
  }, [adminAttendanceViewEndDate, adminHomeMode, setAdminAttendanceViewDateRange, calendarRef]);

  return {
    handleClickToShiftPage: handleClickTopLeftButton,
    handleClickUserRegister,
    handleClickUserDelete,
    handleClickExcelDownload,
    handleClickPrevButton,
    handleClickNextButton,
    adminHomeMode,
  };
};
