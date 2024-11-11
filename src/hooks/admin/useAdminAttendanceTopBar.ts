import { useCallback } from 'react';
import { useStore } from 'zustand';

type AdminAttendanceTopBarStore = {
    monthText: string;
};

export const useAdminAttendanceTopBar = () => {

    const handleClickToShiftPage = useCallback(() => {
        console.log("シフト画面へ移動");
    }, []);

    const handleClickUserRegister = useCallback(() => {
        console.log("ユーザー登録処理");
    }, []);

    const handleClickUserDelete = useCallback(() => {
        console.log("ユーザー削除処理");
    }, []);

    const handleClickExcelDownload = useCallback(() => {
        console.log("Excelダウンロード処理");
    }, []);

    return {
        handleClickToShiftPage,
        handleClickUserRegister,
        handleClickUserDelete,
        handleClickExcelDownload,
    };
};
