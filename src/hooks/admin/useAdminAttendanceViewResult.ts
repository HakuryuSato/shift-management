import { useEffect } from 'react';
import useSWR from 'swr';
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { fetchAttendanceResults } from '@/utils/client/apiClient';
import { getTimeRangeISOStrings } from '@/utils/common/dateUtils';

export function useAdminAttendanceViewResult() {
    const {
        adminAttendanceViewStartDate,
        adminAttendanceViewEndDate,
        setAdminAttendanceViewAllMembersMonthlyResult,
    } = useAdminAttendanceViewStore();

    const { startTimeISO, endTimeISO } = getTimeRangeISOStrings(
        'range',
        adminAttendanceViewStartDate,
        adminAttendanceViewEndDate
    );

    const { data, error, mutate } = useSWR(
        ['attendanceResults', startTimeISO, endTimeISO],
        () => fetchAttendanceResults({ user_id: '*', startTimeISO, endTimeISO })
    );

    useEffect(() => {
        if (data) {
            setAdminAttendanceViewAllMembersMonthlyResult(data);
        }
    }, [data, setAdminAttendanceViewAllMembersMonthlyResult]);

    return { data, error, mutateAttendanceResults: mutate };
}
