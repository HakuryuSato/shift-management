// src/components/admin/AdminHomeTopBar.tsx
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useAdminAttendanceTopBar } from "@/hooks/admin/useAdminHomeTopBar";
import { useAdminHomeTopBarStore } from "@/stores/admin/adminHomeTopBarSlice";
import { commonButtonStyle } from "@/styles/commonButtonStyle";

export const AdminHomeTopBar: React.FC = () => {
  const {
    handleClickToShiftPage,
    handleClickUserRegister,
    handleClickUserDelete,
    handleClickExcelDownload,
    adminHomeMode,
  } = useAdminAttendanceTopBar();

  const adminHomeTopBarTitleText = useAdminHomeTopBarStore((state) =>
    state.adminHomeTopBarTitleText
  );
  const isVisibleAdminHomeTopBarUserEditButtons = useAdminHomeTopBarStore((
    state,
  ) => state.isVisibleAdminHomeTopBarUserEditButtons);

  const isVisibleAdminHomeTopBarExcelDownloadButton = useAdminHomeTopBarStore((
    state,
  ) => state.isVisibleAdminHomeTopBarExcelDownloadButton);

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
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      position="relative"
    >
      <Button sx={commonButtonStyle} onClick={handleClickToShiftPage}>
        {buttonText}
      </Button>

      {/* タイトルテキスト モードに応じて、表示内容を変更 */}
      <Typography
        variant="h5"
        sx={{
          position: "absolute", // 親ボックスに対する絶対配置
          left: "50%",
          transform: "translateX(-50%)", // 水平方向に中央揃え
        }}
      >
        {adminHomeTopBarTitleText}
      </Typography>

      <Box display="flex" gap={2}>
        {/* ユーザー編集ボタンの表示制御 */}
        {isVisibleAdminHomeTopBarUserEditButtons && (
          <>
            <Button sx={commonButtonStyle}  onClick={handleClickUserRegister}>
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

        {/* Excelダウンロードボタンの表示制御 */}
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
  );
};
