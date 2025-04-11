import { useEffect, useRef } from 'react';
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { getDateRangeByClosingDate } from '@/utils/common/dateUtils';

export function useAdminAttendanceViewDateRange() {
    const adminAttendanceViewClosingDate = useAdminAttendanceViewStore(
        (state) => state.adminAttendanceViewClosingDate
    );
    const setAdminAttendanceViewDateRange = useAdminAttendanceViewStore(
        (state) => state.setAdminAttendanceViewDateRange
    );
    
    // Use a ref to store the base date to prevent recreating it on each render
    const baseDateRef = useRef(new Date());

    useEffect(() => {
        // Use the stable reference date instead of new Date() each time
        const { rangeStartDate, rangeEndDate } = getDateRangeByClosingDate(
            baseDateRef.current,
            adminAttendanceViewClosingDate
        );

        setAdminAttendanceViewDateRange(rangeStartDate, rangeEndDate);
    }, [adminAttendanceViewClosingDate, setAdminAttendanceViewDateRange]);
}
