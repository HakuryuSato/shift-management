import { useEffect } from 'react';
import useSWR from 'swr';
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { fetchAttendances } from '@/utils/client/apiClient';
import { getTimeRangeISOStrings, getCustomDateRangeByClosingDate } from '@/utils/common/dateUtils';
import { useAttendancePersonalStyles } from "@/hooks/admin/AttendanceView/useAttendancePersonalStyles";

// attendanceViewの開始終了日、1ヶ月の全員の出退勤データ
export function useAdminAttendanceView() {
    const adminAttendanceViewStartDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewStartDate);
    const adminAttendanceViewEndDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewEndDate);
    const setAdminAttendanceViewAllMembersMonthlyResult = useAdminAttendanceViewStore((state) => state.setAdminAttendanceViewAllMembersMonthlyResult);
    const adminAttendanceViewClosingDate = useAdminAttendanceViewStore((state) => state.adminAttendanceViewClosingDate);
    const setAdminAttendanceViewDateRange = useAdminAttendanceViewStore((state) => state.setAdminAttendanceViewDateRange);
    const { updateAttendancePersonalRowStyles } = useAttendancePersonalStyles();



    // 締日から日付範囲を設定  -------------------------------------------------
    useEffect(() => {

        const { rangeStartDate, rangeEndDate } = getCustomDateRangeByClosingDate(
            new Date(),
            adminAttendanceViewClosingDate
        );

        setAdminAttendanceViewDateRange(rangeStartDate, rangeEndDate);
    }, [adminAttendanceViewClosingDate, setAdminAttendanceViewDateRange]);


    // 日付範囲から出退勤データをセット  -------------------------------------------------
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

    return {
        data: responseData,
        error,
        mutateAttendanceResults: mutate,
        adminAttendanceViewClosingDate
    };
}
