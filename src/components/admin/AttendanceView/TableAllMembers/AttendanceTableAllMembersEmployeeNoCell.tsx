import React, { useEffect } from "react";
import { TableCell, TextField } from "@mui/material";
import { useAttendanceTableAllMembersActionClickHandlers } from "@/hooks/admin/AttendanceView/TableAllMembers/useAttendanceTableAllMembersActionClickHandlers";

interface Props {
  employeeNo: string;
  rowIndex: number;
}

export function AttendanceTableAllMembersEmployeeNoCell({ employeeNo, rowIndex }: Props) {
  const {
    handleEmployeeNoChange,
    tempEmployeeNo,
    isEditing,
  } = useAttendanceTableAllMembersActionClickHandlers(rowIndex);

  // 編集モードでない場合は通常のセルを表示
  if (!isEditing) {
    return <TableCell>{employeeNo}</TableCell>;
  }

  return (
    <TableCell>
      <TextField
        value={tempEmployeeNo}
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
