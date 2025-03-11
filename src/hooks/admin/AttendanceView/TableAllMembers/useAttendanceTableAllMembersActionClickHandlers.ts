import { useAttendanceTableAllMembersStore } from "@/stores/admin/attendanceTableAllMembersSlice";
import { useState } from "react";
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
  const [tempEmployeeNo, setTempEmployeeNo] = useState<string>(
    currentRowData?.employeeNo || ""
  );

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
      setTempEmployeeNo(currentRowData.employeeNo);

      setAdminAttendanceTableAllMembersEditingRow({
        rowIndex,
        rowData: {
          ...currentRowData
        },
      });
    }
  };

  const handleSaveClick = async () => {
    if (!currentRowData) return;
    if (!tempEmployeeNo) return

    await updateUser({
      user_id: currentRowData.user.user_id,
      employee_no: Number(tempEmployeeNo)
    });

    // 編集状態を解除
    setAdminAttendanceTableAllMembersEditingRow(null);
    
    // データを再取得して表示を更新
    await mutateAttendanceResults();
  };

  const handleCancelClick = () => {
    setAdminAttendanceTableAllMembersEditingRow(null);
  };

  const handleEmployeeNoChange = (value: string) => {
    setTempEmployeeNo(value);
  };

  return {
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleEmployeeNoChange,
    tempEmployeeNo,
    isEditing: adminAttendanceTableAllMembersEditingRow?.rowIndex === rowIndex,
  };
};
