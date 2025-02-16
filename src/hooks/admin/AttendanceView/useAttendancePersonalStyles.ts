import { useTheme } from '@mui/material/styles';
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { useAttendanceTablePersonalStore } from '@/stores/admin/attendanceTablePersonalSlice';
import { alpha } from '@mui/material';

export const useAttendancePersonalStyles = () => {
  const theme = useTheme();
  const holidays = useAdminAttendanceViewStore(state => state.adminAttendanceViewHolidays);
  const setAttendanceTablePersonalRowStyles = useAttendanceTablePersonalStore(
    state => state.setAttendanceTablePersonalRowStyles
  );

  const holidayBackgroundColor = alpha(theme.palette.error.light, 0.1);

  const updateAttendancePersonalRowStyles = (dates: string[]) => {
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
  };

  return { updateAttendancePersonalRowStyles };
};
