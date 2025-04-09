import React from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useAdminAttendanceTopBar } from "@/hooks/admin/useAdminHomeTopBarClickHandlers";
import { useAdminHomeTopBarState } from "@/hooks/admin/useAdminHomeTopBarState";
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
    handleClickChangeClosingDate,
    adminHomeMode,
  } = useAdminAttendanceTopBar();

  const {
    isVisibleAdminHomeTopBarUserEditButtons,
    isVisibleAdminHomeTopBarExcelDownloadButton,
    titleText,
    leftSideButtonText,
    downloadText,
  } = useAdminHomeTopBarState(adminHomeMode);

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
          <IconButton 
            size="small" 
            onClick={handleClickPrevButton}
            sx={{
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          {/* タイトルテキスト */}
          <Typography variant="h5" sx={{ mx: 2 }}>
            {titleText}
          </Typography>

          {/* Nextボタン */}
          <IconButton 
            size="small" 
            onClick={handleClickNextButton}
            sx={{
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        {/* 右側のボタン群 */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* ユーザー編集ボタン */}
          {isVisibleAdminHomeTopBarUserEditButtons &&
            adminHomeMode === "MONTHLY_ATTENDANCE" && (
            <>
              <Button
                sx={commonButtonStyle}
                onClick={handleClickChangeClosingDate}
              >
                締め日変更
              </Button>
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
