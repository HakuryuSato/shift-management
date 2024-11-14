import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { useAdminHomeStore } from '@/stores/admin/adminHomeSlice';

export function usePersonalAttendanceTableClickHandlers() {
  const { hidePersonalAttendanceTable, showAllMembersMonthlyTable } = useAdminAttendanceViewStore();
  const { setAdminHomeMode } = useAdminHomeStore();

  // 戻るボタンのハンドラー
  const handleBack = () => {
    hidePersonalAttendanceTable();
    showAllMembersMonthlyTable();
    setAdminHomeMode('MONTHLY_ATTENDANCE');
  };

  return {
    handleBack,
  };
}
