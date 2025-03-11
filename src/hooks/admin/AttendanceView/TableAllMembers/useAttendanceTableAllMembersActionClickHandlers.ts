import { useAttendanceTableAllMembersStore } from "@/stores/admin/attendanceTableAllMembersSlice";
import { useState, useEffect } from "react";

export const useAttendanceTableAllMembersActionClickHandlers = (rowIndex: number) => {
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

  // 行のデータが変更されたら、tempEmployeeNoを更新
  useEffect(() => {
    if (currentRowData) {
      setTempEmployeeNo(currentRowData.employeeNo);
    }
  }, [currentRowData]);

  // 編集状態が変わったときにtempEmployeeNoを更新
  useEffect(() => {
    if (adminAttendanceTableAllMembersEditingRow?.rowIndex === rowIndex && currentRowData) {
      setTempEmployeeNo(currentRowData.employeeNo);
    }
  }, [adminAttendanceTableAllMembersEditingRow?.rowIndex, rowIndex, currentRowData]);

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
