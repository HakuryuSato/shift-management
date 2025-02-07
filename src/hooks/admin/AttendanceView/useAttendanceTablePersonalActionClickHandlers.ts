import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";
import { updateAttendanceStamp,insertAttendance,updateAttendance } from "@/utils/client/serverActionClient";

export const useAttendanceTablePersonalActionClickHandlers = (rowIndex: number) => {
  const AttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalEditingRow,
  );
  const setAttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(
    (state) => state.setAttendanceTablePersonalEditingRow,
  );
  const AttendanceTablePersonalTableRows = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalTableRows,
  );

  const handleEditClick = () => {
    // 他の行が編集中の場合、その編集状態をクリア
    if (
      AttendanceTablePersonalEditingRow?.rowIndex !== null &&
      AttendanceTablePersonalEditingRow?.rowIndex !== rowIndex
    ) {
      setAttendanceTablePersonalEditingRow(null);
    }
    // この行の編集を開始
    const rowData = AttendanceTablePersonalTableRows[rowIndex];
    setAttendanceTablePersonalEditingRow({
      rowIndex,
      rowData: {
        ...rowData,
        stampStartTime: rowData.stampStartTime,
        stampEndTime: rowData.stampEndTime,
        regularHours: rowData.regularHours,
        overtimeHours: rowData.overtimeHours,
      },
    });
  };

  const handleSaveClick = async () => {
    if (!AttendanceTablePersonalEditingRow?.rowData) return;

    const editedRow = AttendanceTablePersonalEditingRow.rowData;
    const originalRow = AttendanceTablePersonalTableRows[rowIndex];

    // 変更がない場合は早期リターン
    if (
      editedRow.stampStartTime === originalRow.stampStartTime &&
      editedRow.stampEndTime === originalRow.stampEndTime &&
      editedRow.regularHours === originalRow.regularHours &&
      editedRow.overtimeHours === originalRow.overtimeHours
    ) {
      setAttendanceTablePersonalEditingRow(null);
      return;
    }

    // 新規データの場合（attendanceIdがない場合）
    if (!originalRow.attendanceId) {
      // 打刻時間がない場合で、勤務時間のみが入力された場合はreturn
      if (
        !editedRow.stampStartTime &&
        !editedRow.stampEndTime &&
        (editedRow.regularHours || editedRow.overtimeHours)
      ) {
        setAttendanceTablePersonalEditingRow(null);
        return;
      }

      // 打刻時間が両方ある場合のみ新規登録
      if (editedRow.stampStartTime && editedRow.stampEndTime) {
        await insertAttendance({
          work_date: editedRow.date,
          stamp_start_time: editedRow.stampStartTime,
          stamp_end_time: editedRow.stampEndTime,
        });
      }
    } else {
      // 既存データの更新
      const isStampTimeChanged =
        editedRow.stampStartTime !== originalRow.stampStartTime ||
        editedRow.stampEndTime !== originalRow.stampEndTime;

      const isWorkHoursChanged =
        editedRow.regularHours !== originalRow.regularHours ||
        editedRow.overtimeHours !== originalRow.overtimeHours;

      if (isStampTimeChanged && editedRow.stampStartTime && editedRow.stampEndTime) {
        // 打刻時間が変更され、両方の時間が存在する場合
        await updateAttendanceStamp({
          attendance_id: originalRow.attendanceId,
          stamp_start_time: editedRow.stampStartTime,
          stamp_end_time: editedRow.stampEndTime,
        });
      } else if (isWorkHoursChanged && (editedRow.regularHours || editedRow.overtimeHours)) {
        // 勤務時間が変更され、いずれかの時間が存在する場合
        const updateData: {
          attendance_id: number;
          work_minutes?: number;
          overtime_minutes?: number;
        } = {
          attendance_id: originalRow.attendanceId,
        };

        if (editedRow.regularHours) {
          updateData.work_minutes = parseInt(editedRow.regularHours) * 60;
        }
        if (editedRow.overtimeHours) {
          updateData.overtime_minutes = parseInt(editedRow.overtimeHours) * 60;
        }

        await updateAttendance(updateData);
      }
    }

    setAttendanceTablePersonalEditingRow(null);
  };

  const handleCancelClick = () => {
    setAttendanceTablePersonalEditingRow(null);
  };

  const handleDeleteClick = () => {
    setAttendanceTablePersonalEditingRow(null);
  };

  return {
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleDeleteClick,
    isEditing: AttendanceTablePersonalEditingRow?.rowIndex === rowIndex,
  };
};
