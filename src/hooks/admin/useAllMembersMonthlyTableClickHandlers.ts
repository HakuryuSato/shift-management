// src/hooks/admin/useAttendanceViewClickHandlers.ts
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import type { User } from '@/types/User';

export function useAllMembersMonthlyTableClickHandlers() {
  const {
    hideAllMembersMonthlyTable,
    showPersonalAttendanceTable,
    setAdminAttendanceViewSelectedUser,
    hidePersonalAttendanceTable,
    showAllMembersMonthlyTable,
  } = useAdminAttendanceViewStore();

  // ユーザー名がクリックされたときのハンドラー
  const handleClickUserName = (user: User) => {
    setAdminAttendanceViewSelectedUser(user);
    hideAllMembersMonthlyTable();
    showPersonalAttendanceTable();
  };

  // 戻るボタンのハンドラー
  const handleBack = () => {
    hidePersonalAttendanceTable();
    showAllMembersMonthlyTable();
  };

  return {
    handleClickUserName,
    handleBack,
  };
}
