import { useAttendanceTableAllMembersStore } from "@/stores/admin/attendanceTableAllMembersSlice";
import { updateUser } from "@/utils/client/serverActionClient";
import { useAdminAttendanceView } from "../useAdminAttendanceView";

export const useAttendanceTableAllMembersActionClickHandlers = (rowIndex: number) => {
  const { mutateAttendanceResults } = useAdminAttendanceView();
  const adminAttendanceTableAllMembersRows = useAttendanceTableAllMembersStore(
    (state) => state.adminAttendanceTableAllMembersRows
  );
  const adminAttendanceTableAllMembersEditingRow = useAttendanceTableAllMembersStore(
    (state) => state.adminAttendanceTableAllMembersEditingRow
  );
  const setAdminAttendanceTableAllMembersEditingRow = useAttendanceTableAllMembersStore(
    (state) => state.setAdminAttendanceTableAllMembersEditingRow
  );

  // 現在の行のデータを取得
  const currentRowData = adminAttendanceTableAllMembersRows[rowIndex];

  const handleEditClick = () => {
    // 他の行が編集中の場合、その編集状態をクリア
    if (
      adminAttendanceTableAllMembersEditingRow?.rowIndex !== null &&
      adminAttendanceTableAllMembersEditingRow?.rowIndex !== rowIndex
    ) {
      setAdminAttendanceTableAllMembersEditingRow(null);
    }

    // この行の編集を開始
    if (currentRowData) {
      setAdminAttendanceTableAllMembersEditingRow({
        rowIndex,
        rowData: {
          ...currentRowData
        },
      });
    }
  };

  const handleSaveClick = async () => {
    if (!adminAttendanceTableAllMembersEditingRow?.rowData) return;
    if (!currentRowData) return;
    
    const editedEmployeeNo = adminAttendanceTableAllMembersEditingRow.rowData.employeeNo;
    if (!editedEmployeeNo) return;

    // 変更がない場合は早期リターン
    if (editedEmployeeNo === currentRowData.employeeNo) {
      setAdminAttendanceTableAllMembersEditingRow(null);
      return;
    }

    await updateUser({
      user_id: currentRowData.user.user_id,
      employee_no: Number(editedEmployeeNo)
    });

    // 編集状態を解除
    setAdminAttendanceTableAllMembersEditingRow(null);
    
    // データを再取得して表示を更新
    await mutateAttendanceResults();
  };

  const handleCancelClick = () => {
    setAdminAttendanceTableAllMembersEditingRow(null);
  };

  return {
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    isEditing: adminAttendanceTableAllMembersEditingRow?.rowIndex === rowIndex,
  };
};
