import { useCallback } from "react";
import { useAdminHomeStore } from "@/stores/admin/adminHomeSlice";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { useAdminHomeTopBarStore } from "@/stores/admin/adminHomeTopBarSlice";
import { formatJapanDateToYearMonth, getCustomDateRangeFrom26To25 } from "@/utils/common/dateUtils";

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



  // TopBar
  const showAdminHomeTopBarUserEditButtons = useAdminHomeTopBarStore(
    (state) => state.showAdminHomeTopBarUserEditButtons
  );
  const setAdminHomeTopBarTitleText = useAdminHomeTopBarStore(
    (state) => state.setAdminHomeTopBarTitleText
  );

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
  }, [
    adminAttendanceViewEndDate,
    adminHomeMode,
    hidePersonalAttendanceTable,
    setAdminHomeMode,
    setAdminHomeTopBarTitleText,
    showAdminHomeTopBarUserEditButtons,
    showAllMembersMonthlyTable,
  ]);

  const handleClickUserRegister = useCallback(() => {
    console.log("ユーザー登録処理");
  }, []);

  const handleClickUserDelete = useCallback(() => {
    console.log("ユーザー削除処理");
  }, []);

  // Excelダウンロード処理
  const handleClickExcelDownload = useCallback(() => {
    console.log("Excelダウンロード処理");
  }, []);

  // 「前へ」ボタンの処理を追加
  const handleClickPrevButton = useCallback(() => {
    if (adminHomeMode === "SHIFT") {
      // SHIFTモードの際の前の週への処理をここに記述
    } else {
      // 先月の日付取得
      const { rangeStartDate, rangeEndDate } = getCustomDateRangeFrom26To25(adminAttendanceViewEndDate, -1)
      setAdminAttendanceViewDateRange(rangeStartDate, rangeEndDate)
      

    }
  }, [adminAttendanceViewEndDate, adminHomeMode, setAdminAttendanceViewDateRange]);

  // 「次へ」ボタンの処理を追加
  const handleClickNextButton = useCallback(() => {
    if (adminHomeMode === "SHIFT") {
      // SHIFTモードの際の次の週への処理をここに記述
    } else {
      // ATTENDANCEモードの際の次の週への処理をここに記述
    }
  }, [adminHomeMode]);

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
