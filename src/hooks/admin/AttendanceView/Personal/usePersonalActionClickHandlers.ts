import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { updateAttendanceStamp, insertAttendance, updateAttendance, deleteAttendance } from "@/utils/client/serverActionClient";
import { useAdminAttendanceView } from "../useAdminAttendanceView";
import { Attendance } from "@/types/Attendance";

// ヘルパー関数: 日付と時刻を結合してISO形式に変換
const combineToISOString = (date: string, time: string | null): string | null => {
  // timeがnullの場合はnullを返す
  if (!time) {
    return null;
  }
  // 日付がなければエラー
  if (!date) {
    throw new Error('Date is required');
  }
  // 日付と時刻を組み合わせて完全な日時文字列を作成
  return `${date}T${time}:00`;
};

export const usePersonalActionClickHandlers = (rowIndex: number) => {
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

    setAttendanceTablePersonalEditingRow({
      rowIndex,
      rowData: {
        ...rowData,
        stampStartTime: rowData.stampStartTime,
        stampEndTime: rowData.stampEndTime,
        regularHours: rowData.regularHours,
        overtimeHours: rowData.overtimeHours,
        remarks: rowData.remarks,
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
      editedRow.overtimeHours === originalRow.overtimeHours &&
      editedRow.remarks === originalRow.remarks
    ) {
      setAttendanceTablePersonalEditingRow(null);
      return;
    }

    try {
      // 新規データの場合（attendanceIdがない場合） -------------------------------------------------
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

        // 選択されたユーザーがなければエラー
        if (!selectedUser) {
          throw new Error('Selected user not found');
        }

        // 打刻時間をISO形式に変換(なければnull)
        const startTimeISO = combineToISOString(editedRow.date, editedRow.stampStartTime);
        const endTimeISO = combineToISOString(editedRow.date, editedRow.stampEndTime);

        // 新規登録
        const result = await insertAttendance({
          user_id: selectedUser.user_id,
          work_date: editedRow.date,
          stamp_start_time: startTimeISO,
          stamp_end_time: endTimeISO,
          remarks: editedRow.remarks || undefined,
        });
        // 登録データにattendance_idがあり、
        // startTimeISOとendTimeISOが両方nullでなければupdateAttendanceStampを実行
        // ※集計時間の再計算を行うためにStampを再実行している。
        if (result?.[0]?.attendance_id && startTimeISO && endTimeISO) {
          
            await updateAttendanceStamp({
              attendance_id: result[0].attendance_id,
              stamp_start_time: startTimeISO,
              stamp_end_time: endTimeISO,
            });
        }
      } else {
        // 既存データの更新 -------------------------------------------------
        const isStampTimeChanged =
          editedRow.stampStartTime !== originalRow.stampStartTime ||
          editedRow.stampEndTime !== originalRow.stampEndTime;

        const isWorkHoursChanged =
          editedRow.regularHours !== originalRow.regularHours ||
          editedRow.overtimeHours !== originalRow.overtimeHours;

        const isRemarksChanged = editedRow.remarks !== originalRow.remarks;

        if (isStampTimeChanged) {
          // 打刻時間をISO形式に変換
          const startTimeISO = combineToISOString(originalRow.date, editedRow.stampStartTime);
          const endTimeISO = combineToISOString(originalRow.date, editedRow.stampEndTime);
          
          // 両方の時間が存在する場合のみupdateAttendanceStampで時間の集計を実行
          if (startTimeISO && endTimeISO) {
            await updateAttendanceStamp({
              attendance_id: originalRow.attendanceId,
              stamp_start_time: startTimeISO,
              stamp_end_time: endTimeISO,
            });
          } else {
            // 片方でもnullの場合はupdateAttendance
            const updateData: Partial<Attendance> = {
              attendance_id: originalRow.attendanceId,
              stamp_start_time: startTimeISO,
              stamp_end_time: endTimeISO
            };
            await updateAttendance(updateData);
          }
        } else if ((isWorkHoursChanged && (editedRow.regularHours || editedRow.overtimeHours)) || isRemarksChanged) {
          // 勤務時間が変更され、いずれかの時間が存在する場合
          const updateData: Partial<Attendance> = {
            attendance_id: originalRow.attendanceId,
          };

          if (editedRow.regularHours) {
            updateData.work_minutes = parseFloat(editedRow.regularHours) * 60;
          }
          if (editedRow.overtimeHours) {
            updateData.overtime_minutes = parseFloat(editedRow.overtimeHours) * 60;
          }
          if (editedRow.remarks !== originalRow.remarks) {
            updateData.remarks = editedRow.remarks || undefined;
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
