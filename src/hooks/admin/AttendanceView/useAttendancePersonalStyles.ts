import { useTheme } from '@mui/material/styles';
import { useCallback } from 'react';
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { useAttendanceTablePersonalStore } from '@/stores/admin/attendanceTablePersonalSlice';
import { alpha } from '@mui/material';

export const useAttendancePersonalStyles = () => {
  const theme = useTheme();
  const holidays = useAdminAttendanceViewStore(state => state.adminAttendanceViewHolidaysMap);
  const startDate = useAdminAttendanceViewStore(state => state.adminAttendanceViewStartDate);
  const endDate = useAdminAttendanceViewStore(state => state.adminAttendanceViewEndDate);
  const setAttendanceTablePersonalRowStyles = useAttendanceTablePersonalStore(
    state => state.setAttendanceTablePersonalRowStyles
  );

  const holidayBackgroundColor = alpha(theme.palette.error.light, 0.1);

  const updateAttendancePersonalRowStyles = useCallback(() => {
    // 日付の配列を生成
    const dates: string[] = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const styles: { [key: string]: { backgroundColor: string } } = {};
    dates.forEach(date => {
      const isHoliday = holidays?.has(date);
      const isSunday = new Date(date).getDay() === 0;
      
      if (isHoliday || isSunday) {
        styles[date] = {
          backgroundColor: holidayBackgroundColor
        };
      }
    });
    setAttendanceTablePersonalRowStyles(styles);
  }, [startDate, endDate, holidays, holidayBackgroundColor, setAttendanceTablePersonalRowStyles]);

  return { updateAttendancePersonalRowStyles };
};
