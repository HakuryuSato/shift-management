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

  // モードに応じてボタンとタイトルのテキストを変更
  let buttonText = "";
  let titleText = "";
  if (adminHomeMode === "SHIFT") {
    buttonText = "出退勤の画面へ";
    titleText = `${
      formatJapanDateToYearMonthDay(new Date(customFullCalendarStartDate))
    } ─ ${
      formatJapanDateToYearMonthDay(new Date(customFullCalendarEndDate)).slice(
        5,
      )
    }`;
  } else if (adminHomeMode === "MONTHLY_ATTENDANCE") {
    titleText = formatJapanDateToYearMonth(adminAttendanceViewEndDate);
    buttonText = "シフト画面へ";
  } else if (adminHomeMode === "PERSONAL_ATTENDANCE") {
    buttonText = "戻る";
    titleText = `${
      formatJapanDateToYearMonth(adminAttendanceViewEndDate)
    } ${user.user_name}`;
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
            {buttonText}
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
          {isVisibleAdminHomeTopBarUserEditButtons && (
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
              Excelダウンロード
            </Button>
          )}
        </Box>
      </Box>

      {/* 2行目 */}
    </>
  );
};
