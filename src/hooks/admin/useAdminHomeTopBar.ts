import { useCallback } from 'react';
import { useAdminHomeStore } from '@/stores/admin/adminHomeSlice';
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';

export const useAdminAttendanceTopBar = () => {
    const adminHomeMode = useAdminHomeStore((state) => state.adminHomeMode);
    const setAdminHomeMode = useAdminHomeStore((state) => state.setAdminHomeMode);
    const hidePersonalAttendanceTable = useAdminAttendanceViewStore((state) => state.hidePersonalAttendanceTable);
    const showAllMembersMonthlyTable = useAdminAttendanceViewStore((state) => state.showAllMembersMonthlyTable);

    const handleClickTopLeftButton = useCallback(() => {
        if (adminHomeMode === 'SHIFT') {
            setAdminHomeMode('MONTHLY_ATTENDANCE');
        } else if (adminHomeMode === 'MONTHLY_ATTENDANCE') {
            setAdminHomeMode('SHIFT');
        } else if (adminHomeMode === 'PERSONAL_ATTENDANCE') {
            setAdminHomeMode('MONTHLY_ATTENDANCE');
            hidePersonalAttendanceTable();
            showAllMembersMonthlyTable();

        }
    }, [adminHomeMode, hidePersonalAttendanceTable, setAdminHomeMode, showAllMembersMonthlyTable]);

    const handleClickUserRegister = useCallback(() => {
        console.log('ユーザー登録処理');
    }, []);

    const handleClickUserDelete = useCallback(() => {
        console.log('ユーザー削除処理');
    }, []);

    // 押された時に、全員のビューならAttendanceViewSliceのadminAttendanceViewAllMembersMonthlyResultから取得
    // 個人のビューならAttendanceTablePersonalSliceのAttendanceTablePersonalTableRowsから取得し、整形して出力
    const handleClickExcelDownload = useCallback(() => {
        console.log('Excelダウンロード処理');
    }, []);

    return {
        handleClickToShiftPage: handleClickTopLeftButton,
        handleClickUserRegister,
        handleClickUserDelete,
        handleClickExcelDownload,
        adminHomeMode,
    };
};
