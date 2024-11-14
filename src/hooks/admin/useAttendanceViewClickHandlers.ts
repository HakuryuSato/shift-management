import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { useAdminHomeStore } from '@/stores/admin/adminHomeSlice';
import type { User } from '@/types/User';

export function useAttendanceViewClickHandlers() {
  const {
    hideAllMembersMonthlyTable,
    showPersonalAttendanceTable,
    setAdminAttendanceViewSelectedUser,
  } = useAdminAttendanceViewStore();

  const { setAdminHomeMode } = useAdminHomeStore();

  // ユーザー名がクリックされたときのハンドラー
  const handleClickUserName = (user: User) => {
    setAdminAttendanceViewSelectedUser(user);
    hideAllMembersMonthlyTable();
    showPersonalAttendanceTable();
    setAdminHomeMode('PERSONAL_ATTENDANCE');
  };

  return {
    handleClickUserName,
  };
}
