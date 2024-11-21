// Store
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { useAdminHomeStore } from '@/stores/admin/adminHomeSlice';
import { useAdminHomeTopBarStore } from '@/stores/admin/adminHomeTopBarSlice';

// Util
import { formatJapanDateToYearMonth } from '@/utils/common/dateUtils';

//Type
import type { User } from '@/types/User';


export function useAllMembersMonthlyTableClickHandlers() {
  // Home
  const setAdminHomeMode = useAdminHomeStore((state) => state.setAdminHomeMode)

  // AttendanceView
  const hideAllMembersMonthlyTable = useAdminAttendanceViewStore((state) => state.hideAllMembersMonthlyTable);
  const showPersonalAttendanceTable = useAdminAttendanceViewStore((state) => state.showPersonalAttendanceTable);
  const setAdminAttendanceViewSelectedUser = useAdminAttendanceViewStore((state) => state.setAdminAttendanceViewSelectedUser);
  const adminAttendanceViewEndDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewEndDate);

  // TopBar
  const hideAdminHomeTopBarUserEditButtons = useAdminHomeTopBarStore((state) => state.hideAdminHomeTopBarUserEditButtons)
  const setAdminHomeTopBarTitleText = useAdminHomeTopBarStore((state) => state.setAdminHomeTopBarTitleText)


  // ユーザー名がクリックされたときのハンドラー
  const handleClickUserName = (user: User) => {
    setAdminAttendanceViewSelectedUser(user);
    setAdminHomeMode('PERSONAL_ATTENDANCE')
    hideAllMembersMonthlyTable();
    showPersonalAttendanceTable();
    hideAdminHomeTopBarUserEditButtons();
    setAdminHomeTopBarTitleText(`${formatJapanDateToYearMonth(adminAttendanceViewEndDate)} ${user.user_name}`)

  };

  return {
    handleClickUserName
  };
}
