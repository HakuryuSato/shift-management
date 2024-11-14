import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useAdminAttendanceTopBar } from "@/hooks/admin/useAdminAttendanceTopBar";

export const AdminHomeTopBar: React.FC = () => {
    const {
        handleClickToShiftPage,
        handleClickUserRegister,
        handleClickUserDelete,
        handleClickExcelDownload,
    } = useAdminAttendanceTopBar();

    // AdminHomeでタイトルテキスト？
    const monthText=10

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
        >
            <Button variant="contained" onClick={handleClickToShiftPage}>
                シフト画面へ
            </Button>

            {/* Modeに応じて、表示内容を変更、
            シフトならカスタムフルカレの開始終了日、
            出退勤ならAttendanceViewの開始終了日
             */}
            <Typography variant="h6">{monthText}月</Typography>

            <Box  display="flex" gap={2}>
            <Button variant="contained" onClick={handleClickUserRegister}>
        ユーザー登録
    </Button>
    <Button
        variant="contained"
        onClick={handleClickUserDelete}
        sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred' } }}
    >
        ユーザー削除
    </Button>
    <Button
        variant="contained"
        onClick={handleClickExcelDownload}
        sx={{ backgroundColor: 'green', color: 'white', '&:hover': { backgroundColor: 'darkgreen' } }}
    >
        Excelダウンロード
    </Button>
            </Box>
        </Box>
    );
};
