// ライブラリ
import { useCallback } from "react";

// Store
import { useAdminHomeStore } from "@/stores/admin/adminHomeSlice";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { useAdminHomeTopBarStore } from "@/stores/admin/adminHomeTopBarSlice";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";
import { useAttendanceTableAllMembersStore } from "@/stores/admin/attendanceTableAllMembersSlice";
import { useAdminUserManagementFormStore } from "@/stores/admin/adminUserManagementFormSlice";

// Utils
import { formatJapanDateToYearMonth, getCustomDateRangeFrom26To25 } from "@/utils/common/dateUtils";
import { downloadAttendanceTablePersonalXlsx } from "@/utils/client/downloadAttendanceTablePersonalXlsx";
import { downloadAttendanceTableAllMembersXlsx } from "@/utils/client/downloadAttendanceTableAllMembersXlsx";

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
  const setAdminHomeTopBarTitleText = useAdminHomeTopBarStore(
    (state) => state.setAdminHomeTopBarTitleText
  );
  const adminHomeTopBarTitleText = useAdminHomeTopBarStore(
    (state) => state.adminHomeTopBarTitleText
  );


  // User Management Form
  const openAdminUserManagementForm = useAdminUserManagementFormStore(
    (state) => state.openAdminUserManagementForm
  );





  // 左上のモード切替ボタン ---------------------------------------------------------------------------------------------------
  const handleClickTopLeftButton = useCallback(() => {
    if (adminHomeMode === "SHIFT") {
      setAdminHomeMode("MONTHLY_ATTENDANCE");
      setAdminHomeTopBarTitleText(
        formatJapanDateToYearMonth(adminAttendanceViewEndDate)
      );
    } else if (adminHomeMode === "MONTHLY_ATTENDANCE") {
      setAdminHomeMode("SHIFT");

      // ここで、フルカレンダーの開始終了日をセット
    } else if (adminHomeMode === "PERSONAL_ATTENDANCE") {
      setAdminHomeMode("MONTHLY_ATTENDANCE");
      hidePersonalAttendanceTable();
      showAllMembersMonthlyTable();
      showAdminHomeTopBarUserEditButtons();
      setAdminHomeTopBarTitleText(
        formatJapanDateToYearMonth(adminAttendanceViewEndDate)
      );
    }
  }, [adminAttendanceViewEndDate, adminHomeMode, hidePersonalAttendanceTable, setAdminHomeMode, setAdminHomeTopBarTitleText, showAdminHomeTopBarUserEditButtons, showAllMembersMonthlyTable]);

  // ユーザー登録
  const handleClickUserRegister = useCallback(() => {
    openAdminUserManagementForm('register')

  }, [openAdminUserManagementForm]);

  // ユーザー削除
  const handleClickUserDelete = useCallback(() => {
    openAdminUserManagementForm('delete')

  }, [openAdminUserManagementForm]);

  // Excelダウンロード ---------------------------------------------------------------------------------------------------
  const handleClickExcelDownload = useCallback(() => {
    // シフト
    if (adminHomeMode === 'SHIFT') {

      // 出退勤要約
    } else if (adminHomeMode === 'MONTHLY_ATTENDANCE') {
      downloadAttendanceTableAllMembersXlsx(adminAttendanceTableAllMembersRows, adminHomeTopBarTitleText + '.xlsx')
      // 出退勤個人
    } else if (adminHomeMode === 'PERSONAL_ATTENDANCE') {
      downloadAttendanceTablePersonalXlsx(AttendanceTablePersonalTableRows, adminHomeTopBarTitleText + '.xlsx')
    }

    // モード
    console.log("Excelダウンロード処理");
  }, [AttendanceTablePersonalTableRows, adminAttendanceTableAllMembersRows, adminHomeMode, adminHomeTopBarTitleText]);




  // 日付範囲戻る ---------------------------------------------------------------------------------------------------
  const handleClickPrevButton = useCallback(() => {
    if (adminHomeMode === "SHIFT") {
      // SHIFTモードの際の前の週への処理をここに記述
    } else {
      // 先月の日付取得
      const { rangeStartDate, rangeEndDate } = getCustomDateRangeFrom26To25(adminAttendanceViewEndDate, -1)
      setAdminAttendanceViewDateRange(rangeStartDate, rangeEndDate)


    }
  }, [adminAttendanceViewEndDate, adminHomeMode, setAdminAttendanceViewDateRange]);





  // 日付範囲進む ---------------------------------------------------------------------------------------------------
  const handleClickNextButton = useCallback(() => {
    if (adminHomeMode === "SHIFT") {
      // SHIFTモードの際の次の週への処理をここに記述
    } else {
      // ATTENDANCEモードの際の次の週への処理をここに記述
      // 来月の日付取得
      const { rangeStartDate, rangeEndDate } = getCustomDateRangeFrom26To25(adminAttendanceViewEndDate, +1)
      setAdminAttendanceViewDateRange(rangeStartDate, rangeEndDate)
    }
  }, [adminAttendanceViewEndDate, adminHomeMode, setAdminAttendanceViewDateRange]);

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
