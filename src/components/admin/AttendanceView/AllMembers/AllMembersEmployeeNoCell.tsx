import React from "react";
import { TableCell, TextField } from "@mui/material";
import { useAttendanceTableAllMembersStore } from "@/stores/admin/attendanceTableAllMembersSlice";

interface Props {
  employeeNo: string;
  rowIndex: number;
}

export function AllMembersEmployeeNoCell({ employeeNo, rowIndex }: Props) {
  const adminAttendanceTableAllMembersEditingRow = useAttendanceTableAllMembersStore(
    (state) => state.adminAttendanceTableAllMembersEditingRow
  );
  const setAdminAttendanceTableAllMembersEditingRow = useAttendanceTableAllMembersStore(
    (state) => state.setAdminAttendanceTableAllMembersEditingRow
  );

  const isEditing = adminAttendanceTableAllMembersEditingRow?.rowIndex === rowIndex;
  
  // 編集モードでない場合は通常のセルを表示
  if (!isEditing) {
    return <TableCell>{employeeNo}</TableCell>;
  }

  const currentEmployeeNo = adminAttendanceTableAllMembersEditingRow?.rowData?.employeeNo || "";

  const handleEmployeeNoChange = (value: string) => {
    if (adminAttendanceTableAllMembersEditingRow?.rowData) {
      setAdminAttendanceTableAllMembersEditingRow({
        ...adminAttendanceTableAllMembersEditingRow,
        rowData: {
          ...adminAttendanceTableAllMembersEditingRow.rowData,
          employeeNo: value
        }
      });
    }
  };

  return (
    <TableCell>
      <TextField
        value={currentEmployeeNo}
        onChange={(e) => handleEmployeeNoChange(e.target.value)}
        variant="standard"
        size="small"
        fullWidth
        autoFocus // 編集モードになったら自動的にフォーカス
        inputProps={{
          style: { padding: '2px 4px' },
          // 数字のみ入力可能にする
          type: "number",
          min: "0",
          max: "9999",
        }}
      />
    </TableCell>
  );
}
