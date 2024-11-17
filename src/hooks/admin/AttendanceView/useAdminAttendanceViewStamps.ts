import { useEffect } from 'react';
import useSWR from 'swr';
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { fetchAttendanceStamps } from '@/utils/client/apiClient';
import { getTimeRangeISOStrings } from '@/utils/common/dateUtils';

export function useAdminAttendanceViewStamps() {
  const adminAttendanceViewStartDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewStartDate);
  const adminAttendanceViewEndDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewEndDate);
  const setAdminAttendanceViewAllMembersMonthlyStamps = useAdminAttendanceViewStore((state) => state.setAdminAttendanceViewAllMembersMonthlyStamps);
  

  const { startTimeISO, endTimeISO } = getTimeRangeISOStrings(
    'range',
    adminAttendanceViewStartDate,
    adminAttendanceViewEndDate
  );

  const { data, error, mutate } = useSWR(
    ['attendanceStamps', startTimeISO, endTimeISO],
    () => fetchAttendanceStamps({ user_id: '*', startTimeISO, endTimeISO })
  );

  useEffect(() => {
    if (data) {
      setAdminAttendanceViewAllMembersMonthlyStamps(data);
    }
  }, [data, setAdminAttendanceViewAllMembersMonthlyStamps]);

  return { data, error, mutateAttendanceStamps: mutate };
}
