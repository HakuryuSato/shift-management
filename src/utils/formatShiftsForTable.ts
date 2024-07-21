import type InterFaceShiftQuery from '@customTypes/InterFaceShiftQuery';
import type InterFaceAdminShiftTable from '@customTypes/InterFaceAdminShiftTable';


export default function formatShiftsForTable(shifts: any[]): InterFaceAdminShiftTable[] { // 注意！型変更したけど未チェック！
  return shifts.map((shift: any) => ({
    user_name: shift.user_name,
    start_time: shift.start_time,
    end_time: shift.end_time,
  }));
};
