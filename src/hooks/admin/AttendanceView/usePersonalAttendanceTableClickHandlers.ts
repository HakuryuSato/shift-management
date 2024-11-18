import { useCallback } from "react";
import { useAttendanceTablePersonalStore } from "@/stores/admin/AttendanceTablePersonalSlice";
import type { AttendanceRow } from "@/types/Attendance";
import { updateAttendance } from "@/utils/client/serverActionClient";

export function usePersonalAttendanceTableClickHandlers() {
  const {
    AttendanceTablePersonalEditingCell,
    setAttendanceTablePersonalEditingCell,
    AttendanceTablePersonalTableRows,
    setAttendanceTablePersonalTableRows,
  } = useAttendanceTablePersonalStore();

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
        // 変更があった場合、updateAttendanceResultを呼び出す
        const attendanceId = originalRow.attendanceId;
        if (attendanceId) {
          const updateData: any = {
            attendance_id: attendanceId,
          };

          // 変更されたフィールドに応じてデータを設定
          if (field === "regularHours") {
            updateData.work_minutes = parseFloat(newValue) * 60;
          } else if (field === "overtimeHours") {
            updateData.overtime_minutes = parseFloat(newValue) * 60;
          }

          // サーバーに更新を送信
          const updatedResult = await updateAttendance(updateData);

          if (updatedResult && updatedResult.length > 0) {
            // ストアの該当行を更新
            setAttendanceTablePersonalTableRows((prevRows) =>
              prevRows.map((row, idx) =>
                idx === rowIndex ? { ...row, [field]: newValue } : row
              )
            );
          }
        }
      }

      // 編集状態を解除
      setAttendanceTablePersonalEditingCell(null);
    },
    [
      AttendanceTablePersonalTableRows,
      setAttendanceTablePersonalEditingCell,
      setAttendanceTablePersonalTableRows,
    ]
  );

  return {
    editingCell: AttendanceTablePersonalEditingCell,
    handleClickCell,
    handleBlur,
  };
}
