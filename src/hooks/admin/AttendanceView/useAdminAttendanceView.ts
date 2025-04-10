import { useEffect } from 'react';
import useSWR from 'swr';
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { fetchAttendances, fetchHolidays } from '@/utils/client/apiClient';
import { getTimeRangeISOStrings, formatJapanDateToYearMonth } from '@/utils/common/dateUtils';
import { useAttendancePersonalStyles } from "@/hooks/admin/AttendanceView/useAttendancePersonalStyles";

// attendanceViewの開始終了日、1ヶ月の全員の出退勤データ
export function useAdminAttendanceView() {
    const adminAttendanceViewStartDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewStartDate);
    const adminAttendanceViewEndDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewEndDate);
    const setAdminAttendanceViewAllMembersMonthlyResult = useAdminAttendanceViewStore((state) => state.setAdminAttendanceViewAllMembersMonthlyResult);
    const {updateAttendancePersonalRowStyles} = useAttendancePersonalStyles()


    const { startTimeISO, endTimeISO } = getTimeRangeISOStrings(
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
        updateAttendancePersonalRowStyles();
    }, [responseData, setAdminAttendanceViewAllMembersMonthlyResult, updateAttendancePersonalRowStyles]);

    return { data: responseData, error, mutateAttendanceResults: mutate };
}
