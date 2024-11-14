// src/hooks/admin/usePersonalAttendanceTableClickHandlers.ts
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';

export function usePersonalAttendanceTableClickHandlers() {
  const { hidePersonalAttendanceTable, showAllMembersMonthlyTable } = useAdminAttendanceViewStore();

  // 戻るボタンのハンドラー
  const handleBack = () => {
    hidePersonalAttendanceTable();
    showAllMembersMonthlyTable();
  };

  return {
    handleBack,
  };
}
