import { useEffect } from 'react';
import useSWR from 'swr';
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { fetchAttendances } from '@/utils/client/apiClient';
import { getTimeRangeISOStrings, formatJapanDateToYearMonth } from '@/utils/common/dateUtils';
import { useAdminHomeTopBarStore } from '@/stores/admin/adminHomeTopBarSlice';

export function useAdminAttendanceView() {
    const adminAttendanceViewStartDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewStartDate);
    const adminAttendanceViewEndDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewEndDate);
    const setAdminAttendanceViewAllMembersMonthlyResult = useAdminAttendanceViewStore((state) => state.setAdminAttendanceViewAllMembersMonthlyResult);
    const setAdminHomeTopBarTitleText = useAdminHomeTopBarStore((state) => state.setAdminHomeTopBarTitleText)


    const { startTimeISO, endTimeISO } = getTimeRangeISOStrings(
        'range',
        adminAttendanceViewStartDate,
        adminAttendanceViewEndDate
    );

    // data：APIからのレスポンス
    const { data, error, mutate } = useSWR(
        ['attendanceResults', startTimeISO, endTimeISO],
        () => fetchAttendances({ startDate: startTimeISO, endDate: endTimeISO })
    );

    useEffect(() => {
        if (data) {
            setAdminAttendanceViewAllMembersMonthlyResult(data);
            setAdminHomeTopBarTitleText(formatJapanDateToYearMonth(adminAttendanceViewEndDate))
        }
    }, [adminAttendanceViewEndDate, adminAttendanceViewStartDate, data, endTimeISO, setAdminAttendanceViewAllMembersMonthlyResult, setAdminHomeTopBarTitleText, startTimeISO]);

    return { data, error, mutateAttendanceResults: mutate };
}
