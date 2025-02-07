import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";

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

  const handleSaveClick = () => {
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
