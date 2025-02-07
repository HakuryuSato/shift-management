import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { updateAttendanceStamp, insertAttendance, updateAttendance, deleteAttendance } from "@/utils/client/serverActionClient";
import { useAdminAttendanceView } from "./useAdminAttendanceView";

// ヘルパー関数: 日付と時刻を結合してISO形式に変換
const combineToISOString = (date: string, time: string): string => {
    // 入力値のバリデーション
    if (!date || !time) {
      throw new Error('Date and time are required');
    }
    // 日付と時刻を組み合わせて完全な日時文字列を作成
    return `${date}T${time}:00`;

};

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

  const selectedUser = useAdminAttendanceViewStore(
    (state) => state.adminAttendanceViewSelectedUser
  );
  const { mutateAttendanceResults } = useAdminAttendanceView();


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
    
    // 打刻時間が空白の場合はデフォルト値を設定
    const startTime = rowData.stampStartTime || "08:29";
    const endTime = rowData.stampEndTime || "18:00";
    
    setAttendanceTablePersonalEditingRow({
      rowIndex,
      rowData: {
        ...rowData,
        stampStartTime: startTime,
        stampEndTime: endTime,
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

    try {
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
          if (!selectedUser) {
            throw new Error('Selected user not found');
          }
          const result = await insertAttendance({
            user_id: selectedUser.user_id,
            work_date: editedRow.date,
            stamp_start_time: combineToISOString(editedRow.date, editedRow.stampStartTime),
            stamp_end_time: combineToISOString(editedRow.date, editedRow.stampEndTime),
          });
          
          if (result && result[0] && result[0].attendance_id) {
            // insertAttendance の後に updateAttendanceStamp を実行
            await updateAttendanceStamp({
              attendance_id: result[0].attendance_id,
              stamp_start_time: combineToISOString(editedRow.date, editedRow.stampStartTime),
              stamp_end_time: combineToISOString(editedRow.date, editedRow.stampEndTime),
            });
          }
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
            stamp_start_time: combineToISOString(originalRow.date, editedRow.stampStartTime),
            stamp_end_time: combineToISOString(originalRow.date, editedRow.stampEndTime),
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
    } catch (error) {
      console.error('Error in handleSaveClick:', error);
      throw error;
    }

    setAttendanceTablePersonalEditingRow(null);
    await mutateAttendanceResults();
  };

  const handleCancelClick = () => {
    setAttendanceTablePersonalEditingRow(null);
  };

  const handleDeleteClick = async () => {
    const originalRow = AttendanceTablePersonalTableRows[rowIndex];
    
    // attendance_idが存在する場合のみ削除を実行
    if (originalRow.attendanceId) {
      try {
        await deleteAttendance(originalRow.attendanceId);
        await mutateAttendanceResults();
      } catch (error) {
        console.error('Error in handleDeleteClick:', error);
        throw error;
      }
    }
    
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
