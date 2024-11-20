import { useEffect } from 'react';
import useSWR from 'swr';
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { fetchAttendances } from '@/utils/client/apiClient';
import { getTimeRangeISOStrings } from '@/utils/common/dateUtils';

export function useAdminAttendanceView() {
    const adminAttendanceViewStartDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewStartDate);
    const adminAttendanceViewEndDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewEndDate);
    const setAdminAttendanceViewAllMembersMonthlyResult = useAdminAttendanceViewStore((state) => state.setAdminAttendanceViewAllMembersMonthlyResult);


    const { startTimeISO, endTimeISO } = getTimeRangeISOStrings(
        'range',
        adminAttendanceViewStartDate,
        adminAttendanceViewEndDate
    );

    const { data, error, mutate } = useSWR(
        ['attendanceResults', startTimeISO, endTimeISO],
        () => fetchAttendances({ startDate: startTimeISO, endDate: endTimeISO })
    );

    useEffect(() => {
        if (data) {
            setAdminAttendanceViewAllMembersMonthlyResult(data);
        }
    }, [data, setAdminAttendanceViewAllMembersMonthlyResult]);

    return { data, error, mutateAttendanceResults: mutate };
}
