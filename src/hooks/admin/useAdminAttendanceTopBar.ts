// src/hooks/admin/useAdminAttendanceTopBar.ts
import { useCallback } from 'react';
import { useAdminHomeStore } from '@/stores/admin/adminHomeSlice';

export const useAdminAttendanceTopBar = () => {
    const { adminHomeMode, setAdminHomeMode } = useAdminHomeStore();

    const handleClickToShiftPage = useCallback(() => {
        if (adminHomeMode === 'SHIFT') {
            setAdminHomeMode('MONTHLY_ATTENDANCE');
        } else if (adminHomeMode === 'MONTHLY_ATTENDANCE') {
            setAdminHomeMode('SHIFT');
        } else if (adminHomeMode === 'PERSONAL_ATTENDANCE') {
            setAdminHomeMode('MONTHLY_ATTENDANCE');
        }
    }, [adminHomeMode, setAdminHomeMode]);

    const handleClickUserRegister = useCallback(() => {
        console.log('ユーザー登録処理');
    }, []);

    const handleClickUserDelete = useCallback(() => {
        console.log('ユーザー削除処理');
    }, []);

    const handleClickExcelDownload = useCallback(() => {
        console.log('Excelダウンロード処理');
    }, []);

    return {
        handleClickToShiftPage,
        handleClickUserRegister,
        handleClickUserDelete,
        handleClickExcelDownload,
        adminHomeMode,
    };
};
