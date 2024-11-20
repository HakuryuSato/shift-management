import { useCallback } from 'react';
import { useAdminHomeStore } from '@/stores/admin/adminHomeSlice';

export const useAdminHomeBottomBar = () => {
  const adminHomeMode = useAdminHomeStore((state) => state.adminHomeMode);

  // 切り替え時、AttendanceViewのデータを更新
  const handleClickPrevButton = useCallback(() => {
    if (adminHomeMode === 'SHIFT') {
      // SHIFTモードの際の前の週への処理をここに記述

    } else { // 出退勤
      // ATTENDANCEモードの際の前の週への処理をここに記述
    }
  }, [adminHomeMode]);

  const handleClickNextButton = useCallback(() => {
    if (adminHomeMode === 'SHIFT') {
      // SHIFTモードの際の次の週への処理をここに記述

    } else {
      // ATTENDANCEモードの際の次の週への処理をここに記述

    }
  }, [adminHomeMode]);

  return { handleClickPrevButton, handleClickNextButton };
};
