import { useCallback } from "react";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";
import type { AttendanceRowPersonal } from "@/types/Attendance";
import { updateAttendance, insertAttendance } from "@/utils/client/serverActionClient";
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { hoursToMinutes } from '@/utils/common/dateUtils';
import type { Attendance } from "@/types/Attendance";
import { toJapanDateISOString } from "@/utils/common/dateUtils";

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

  const handleClickWorkTimeCell = useCallback(
    (rowIndex: number, field: keyof AttendanceRowPersonal) => {
      setAttendanceTablePersonalEditingCell({ rowIndex, field });
    },
    [setAttendanceTablePersonalEditingCell]
  );

  const handleBlurWorkTimeCell = useCallback(
    async (
      rowIndex: number,
      field: keyof AttendanceRowPersonal,
      newValue: string
    ) => {
      // 値に変更があるかチェック
      const originalRow = AttendanceTablePersonalTableRows[rowIndex];
      const originalValue = originalRow[field];

      if (originalValue !== newValue) {
        const attendanceId = originalRow.attendanceId;
        const userId = adminAttendanceViewSelectedUser?.user_id;

        if (!userId) {
          console.error('User ID is not available for insertion.');
          return;
        }

        // 送信用attendanceデータ作成 -------------------------------------------------
        // user_idを指定
        const attendance: Partial<Attendance> = {
          user_id: userId,
        };

        // 時間外または平日普通の時間を設定
        if (field === "regularHours") {
          attendance.work_minutes = hoursToMinutes(newValue);
        } else if (field === "overtimeHours") {
          attendance.overtime_minutes = hoursToMinutes(newValue);
        }




        // もし既に存在する出退勤データなら
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
        } else { // 存在しないなら
          // 日付を設定
          attendance.work_date = AttendanceTablePersonalTableRows[rowIndex].date;

          // 挿入ロジック
          const insertedResult = await insertAttendance(attendance);

          // ステートに戻り値を挿入し更新
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

  const handleStampTimeChange = useCallback(
    async (rowIndex: number, field: "stampStartTime" | "stampEndTime", value: string) => {
      const originalRow = AttendanceTablePersonalTableRows[rowIndex];
      const originalValue = originalRow[field];

      if (originalValue !== value) {
        const attendanceId = originalRow.attendanceId;
        const userId = adminAttendanceViewSelectedUser?.user_id;

        if (!userId) {
          console.error('User ID is not available for insertion.');
          return;
        }

        const attendance: Partial<Attendance> = {
          user_id: userId,
          [field]: value
        };

        if (attendanceId) {
          attendance.attendance_id = attendanceId;
          const updatedResult = await updateAttendance(attendance);

          if (updatedResult && updatedResult.length > 0) {
            setAttendanceTablePersonalTableRows((prevRows) =>
              prevRows.map((row, idx) =>
                idx === rowIndex ? { ...row, [field]: value } : row
              )
            );
          }
        } else {
          attendance.work_date = AttendanceTablePersonalTableRows[rowIndex].date;
          const insertedResult = await insertAttendance(attendance);

          if (insertedResult && insertedResult.length > 0) {
            setAttendanceTablePersonalTableRows((prevRows) =>
              prevRows.map((row, idx) =>
                idx === rowIndex
                  ? {
                    ...row,
                    [field]: value,
                    attendanceId: insertedResult[0].attendance_id,
                  }
                  : row
              )
            );
          }
        }
      }
    },
    [
      AttendanceTablePersonalTableRows,
      setAttendanceTablePersonalTableRows,
      adminAttendanceViewSelectedUser,
    ]
  );

  return {
    editingCell: AttendanceTablePersonalEditingCell,
    handleClickWorkTimeCell,
    handleBlurWorkTimeCell,
    handleStampTimeChange,
  };
}
