import { useEffect } from 'react';
import useSWR from 'swr';
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { fetchAttendances } from '@/utils/client/apiClient';
import { getTimeRangeISOStrings, formatJapanDateToYearMonth } from '@/utils/common/dateUtils';

// attendanceViewの開始終了日、1ヶ月の全員の出退勤データ
export function useAdminAttendanceView() {
    const adminAttendanceViewStartDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewStartDate);
    const adminAttendanceViewEndDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewEndDate);
    const setAdminAttendanceViewAllMembersMonthlyResult = useAdminAttendanceViewStore((state) => state.setAdminAttendanceViewAllMembersMonthlyResult);


    const { startTimeISO, endTimeISO } = getTimeRangeISOStrings(
        'range',
        adminAttendanceViewStartDate,
        adminAttendanceViewEndDate
    );

    // data：APIからのレスポンス
    const { data: responseData, error, mutate } = useSWR(
        ['attendanceResults', startTimeISO, endTimeISO],
        () => fetchAttendances({ startDate: startTimeISO, endDate: endTimeISO })
    );

    // 月切替時に状態をセット
    useEffect(() => {
        if (responseData) {
            setAdminAttendanceViewAllMembersMonthlyResult(responseData);
        }
    }, [adminAttendanceViewEndDate, adminAttendanceViewStartDate, responseData, endTimeISO, setAdminAttendanceViewAllMembersMonthlyResult, startTimeISO]);

    return { data: responseData, error, mutateAttendanceResults: mutate };
}
