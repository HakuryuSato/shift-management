import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { useAdminHomeStore } from '@/stores/admin/adminHomeSlice';
import type { User } from '@/types/User';

export function useAllMembersMonthlyTableClickHandlers() {
  const hideAllMembersMonthlyTable = useAdminAttendanceViewStore((state) => state.hideAllMembersMonthlyTable);
  const showPersonalAttendanceTable = useAdminAttendanceViewStore((state) => state.showPersonalAttendanceTable);
  const setAdminAttendanceViewSelectedUser = useAdminAttendanceViewStore((state) => state.setAdminAttendanceViewSelectedUser);
  const setAdminHomeMode = useAdminHomeStore((state) => state.setAdminHomeMode)

  // ユーザー名がクリックされたときのハンドラー
  const handleClickUserName = (user: User) => {
    setAdminAttendanceViewSelectedUser(user);
    setAdminHomeMode('PERSONAL_ATTENDANCE')
    hideAllMembersMonthlyTable();
    showPersonalAttendanceTable();
  };

  return {
    handleClickUserName
  };
}
