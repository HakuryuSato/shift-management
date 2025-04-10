import { useEffect } from 'react';
import useSWR from 'swr';
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { fetchAttendances, fetchHolidays } from '@/utils/client/apiClient';
import { getTimeRangeISOStrings, formatJapanDateToYearMonth, getCustomDateRangeByClosingDate } from '@/utils/common/dateUtils';
import { useAttendancePersonalStyles } from "@/hooks/admin/AttendanceView/useAttendancePersonalStyles";

// attendanceViewの開始終了日、1ヶ月の全員の出退勤データ
export function useAdminAttendanceView() {
    const adminAttendanceViewStartDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewStartDate);
    const adminAttendanceViewEndDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewEndDate);
    const setAdminAttendanceViewDateRange = useAdminAttendanceViewStore((state) => state.setAdminAttendanceViewDateRange);
    const adminAttendanceViewClosingDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewClosingDate);
    const setAdminAttendanceViewAllMembersMonthlyResult = useAdminAttendanceViewStore((state) => state.setAdminAttendanceViewAllMembersMonthlyResult);
    const {updateAttendancePersonalRowStyles} = useAttendancePersonalStyles();

    // 初期値の設定
    useEffect(() => {
        const isDefaultStartDate = adminAttendanceViewStartDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
        const isDefaultEndDate = adminAttendanceViewEndDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];

        if (isDefaultStartDate && isDefaultEndDate) {
            const { rangeStartDate, rangeEndDate } = getCustomDateRangeByClosingDate(
                new Date(),
                adminAttendanceViewClosingDate || 25,
                0
            );
            setAdminAttendanceViewDateRange(rangeStartDate, rangeEndDate);
        }
    }, [adminAttendanceViewStartDate, adminAttendanceViewEndDate, adminAttendanceViewClosingDate, setAdminAttendanceViewDateRange]);

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

    // 月切替時に出退勤データをセット
    useEffect(() => {
        if (responseData) {
            setAdminAttendanceViewAllMembersMonthlyResult(responseData);
        }
        updateAttendancePersonalRowStyles();
    }, [responseData, setAdminAttendanceViewAllMembersMonthlyResult, updateAttendancePersonalRowStyles]);

    return { data: responseData, error, mutateAttendanceResults: mutate };
}
