import React from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useAdminAttendanceTopBar } from "@/hooks/admin/useAdminHomeTopBarClickHandlers";
import { useAdminHomeTopBarStore } from "@/stores/admin/adminHomeTopBarSlice";
import { commonButtonStyle } from "@/styles/commonButtonStyle";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

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

  const adminHomeTopBarTitleText = useAdminHomeTopBarStore(
    (state) => state.adminHomeTopBarTitleText,
  );
  const isVisibleAdminHomeTopBarUserEditButtons = useAdminHomeTopBarStore(
    (state) => state.isVisibleAdminHomeTopBarUserEditButtons,
  );

  const isVisibleAdminHomeTopBarExcelDownloadButton = useAdminHomeTopBarStore(
    (state) => state.isVisibleAdminHomeTopBarExcelDownloadButton,
  );

  // ボタンのテキストをモードに応じて変更
  let buttonText = "";
  if (adminHomeMode === "SHIFT") {
    buttonText = "出退勤の画面へ";
  } else if (adminHomeMode === "MONTHLY_ATTENDANCE") {
    buttonText = "シフト画面へ";
  } else if (adminHomeMode === "PERSONAL_ATTENDANCE") {
    buttonText = "戻る";
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
            {adminHomeTopBarTitleText}
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
