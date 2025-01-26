import React from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import {
  formatJapanDateToYearMonth,
  formatJapanDateToYearMonthDay,
} from "@/utils/common/dateUtils";
import { useAdminAttendanceTopBar } from "@/hooks/admin/useAdminHomeTopBarClickHandlers";
import { useAdminHomeTopBarStore } from "@/stores/admin/adminHomeTopBarSlice";
import { useCustomFullCalendarStore } from "@/stores/common/customFullCalendarSlice";
import { commonButtonStyle } from "@/styles/commonButtonStyle";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";

export const AdminHomeTopBar: React.FC = () => {
  const {
    handleClickToShiftPage,
    handleClickUserRegister,
    handleClickUserDelete,
    handleClickExcelDownload,
    handleClickPrevButton,
    handleClickNextButton,
    adminHomeMode,
  } = useAdminAttendanceTopBar();

  const isVisibleAdminHomeTopBarUserEditButtons = useAdminHomeTopBarStore(
    (state) => state.isVisibleAdminHomeTopBarUserEditButtons,
  );

  const isVisibleAdminHomeTopBarExcelDownloadButton = useAdminHomeTopBarStore(
    (state) => state.isVisibleAdminHomeTopBarExcelDownloadButton,
  );

  const customFullCalendarStartDate = useCustomFullCalendarStore(
    (state) => state.customFullCalendarStartDate,
  );
  const customFullCalendarEndDate = useCustomFullCalendarStore(
    (state) => state.customFullCalendarEndDate,
  );
  const adminAttendanceViewEndDate = useAdminAttendanceViewStore((state) =>
    state.adminAttendanceViewEndDate
  );
  const adminAttendanceViewSelectedUser = useAdminAttendanceViewStore((state) =>
    state.adminAttendanceViewSelectedUser
  );

  // モードに応じてボタンとタイトルのテキストを変更
  let leftSideButtonText = "";
  let titleText = "";
  let downloadText = "";
  if (adminHomeMode === "SHIFT") {
    leftSideButtonText = "出退勤の画面へ";
    titleText = `${
      formatJapanDateToYearMonthDay(new Date(customFullCalendarStartDate))
    } ─ ${
      formatJapanDateToYearMonthDay(new Date(customFullCalendarEndDate)).slice(
        5,
      )
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

  return (
    <>
      {/* バー全体 */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        boxShadow={3}
        position="relative"
      >
        {/* 左側のボタン群 */}
        <Box display="flex" alignItems="center">
          <Button sx={commonButtonStyle} onClick={handleClickToShiftPage}>
            {leftSideButtonText}
          </Button>
        </Box>

        {/* 中央のボタン群 */}
        <Box
          display="flex"
          alignItems="center"
          position="absolute"
          left="50%"
          sx={{
            transform: "translateX(-50%)",
          }}
        >
          {/* Prevボタン */}
          <IconButton size="small" onClick={handleClickPrevButton}>
            <ArrowBackIosNewIcon />
          </IconButton>

          {/* タイトルテキスト */}
          <Typography variant="h5">
            {titleText}
          </Typography>

          {/* Nextボタン */}
          <IconButton size="small" onClick={handleClickNextButton}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        {/* 右側のボタン群 */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* ユーザー編集ボタン */}
          {isVisibleAdminHomeTopBarUserEditButtons && adminHomeMode === "MONTHLY_ATTENDANCE" && (
            <>
              <Button
                sx={commonButtonStyle}
                onClick={handleClickUserRegister}
              >
                ユーザー登録
              </Button>
              <Button
                onClick={handleClickUserDelete}
                sx={{
                  ...commonButtonStyle,
                  backgroundColor: "red",
                  color: "white",
                  "&:hover": { backgroundColor: "darkred" },
                }}
              >
                ユーザー削除
              </Button>
            </>
          )}

          {/* Excelダウンロードボタン */}
          {isVisibleAdminHomeTopBarExcelDownloadButton && (
            <Button
              onClick={handleClickExcelDownload}
              sx={{
                ...commonButtonStyle,
                backgroundColor: "green",
                color: "white",
                "&:hover": { backgroundColor: "darkgreen" },
              }}
            >
              {downloadText}
            </Button>
          )}
        </Box>
      </Box>

      {/* 2行目 */}
    </>
  );
};
