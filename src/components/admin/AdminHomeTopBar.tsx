// src/components/admin/AdminHomeTopBar.tsx
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useAdminAttendanceTopBar } from "@/hooks/admin/useAdminHomeTopBar";
import { useAdminHomeTopBarStore } from "@/stores/admin/adminHomeTopBarSlice";

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
    >
      <Button variant="contained" onClick={handleClickToShiftPage}>
        {buttonText}
      </Button>

      {/* モードに応じて、表示内容を変更 */}

      <Typography variant="h6">{adminHomeTopBarTitleText}</Typography>

      <Box display="flex" gap={2}>
        <Button variant="contained" onClick={handleClickUserRegister}>
          ユーザー登録
        </Button>
        <Button
          variant="contained"
          onClick={handleClickUserDelete}
          sx={{
            backgroundColor: "red",
            color: "white",
            "&:hover": { backgroundColor: "darkred" },
          }}
        >
          ユーザー削除
        </Button>
        <Button
          variant="contained"
          onClick={handleClickExcelDownload}
          sx={{
            backgroundColor: "green",
            color: "white",
            "&:hover": { backgroundColor: "darkgreen" },
          }}
        >
          Excelダウンロード
        </Button>
      </Box>
    </Box>
  );
};
