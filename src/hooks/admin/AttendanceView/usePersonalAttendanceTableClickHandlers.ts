import { useCallback } from "react";
import { useAttendanceTablePersonalStore } from "@/stores/admin/AttendanceTablePersonalSlice";
import type { AttendanceRow } from "@/types/Attendance";
import { updateAttendance, insertAttendance } from "@/utils/client/serverActionClient";
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { hoursToMinutes } from '@/utils/common/dateUtils';
import type { Attendance } from "@/types/Attendance";

export function usePersonalAttendanceTableClickHandlers() {
  const AttendanceTablePersonalEditingCell = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalEditingCell
  );
  const setAttendanceTablePersonalEditingCell = useAttendanceTablePersonalStore(
    (state) => state.setAttendanceTablePersonalEditingCell
  );
  const AttendanceTablePersonalTableRows = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalTableRows
  );
  const setAttendanceTablePersonalTableRows = useAttendanceTablePersonalStore(
    (state) => state.setAttendanceTablePersonalTableRows
  );

  const adminAttendanceViewSelectedUser = useAdminAttendanceViewStore(
    (state) => state.adminAttendanceViewSelectedUser
  );

  const handleClickCell = useCallback(
    (rowIndex: number, field: keyof AttendanceRow) => {
      setAttendanceTablePersonalEditingCell({ rowIndex, field });
    },
    [setAttendanceTablePersonalEditingCell]
  );

  const handleBlur = useCallback(
    async (
      rowIndex: number,
      field: keyof AttendanceRow,
      newValue: string
    ) => {
      const originalRow = AttendanceTablePersonalTableRows[rowIndex];
      const originalValue = originalRow[field];

      if (originalValue !== newValue) {
        const attendanceId = originalRow.attendanceId;
        const userId = adminAttendanceViewSelectedUser?.user_id;

        if (!userId) {
          console.error('User ID is not available for insertion.');
          return;
        }

        // user_idを指定
        const attendance: Partial<Attendance> = {
          user_id: userId,
        };

        if (field === "regularHours") {
          attendance.work_minutes = hoursToMinutes(newValue);
        } else if (field === "overtimeHours") {
          attendance.overtime_minutes = hoursToMinutes(newValue);
        }

        if (attendanceId) {
          // 更新ロジック
          attendance.attendance_id = attendanceId;
          const updatedResult = await updateAttendance(attendance);

          if (updatedResult && updatedResult.length > 0) {
            setAttendanceTablePersonalTableRows((prevRows) =>
              prevRows.map((row, idx) =>
                idx === rowIndex ? { ...row, [field]: newValue } : row
              )
            );
          }
        } else {
          // 挿入ロジック
          const insertedResult = await insertAttendance(attendance);

          if (insertedResult && insertedResult.length > 0) {
            setAttendanceTablePersonalTableRows((prevRows) =>
              prevRows.map((row, idx) =>
                idx === rowIndex
                  ? {
                      ...row,
                      [field]: newValue,
                      attendanceId: insertedResult[0].attendance_id,
                    }
                  : row
              )
            );
          }
        }
      }

      setAttendanceTablePersonalEditingCell(null);
    },
    [
      AttendanceTablePersonalTableRows,
      setAttendanceTablePersonalEditingCell,
      setAttendanceTablePersonalTableRows,
      adminAttendanceViewSelectedUser,
    ]
  );

  return {
    editingCell: AttendanceTablePersonalEditingCell,
    handleClickCell,
    handleBlur,
  };
}
