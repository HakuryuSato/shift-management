import React, { useState } from "react";
import { TextField, TableCell } from "@mui/material";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";

interface PersonalRemarksCellProps {
  value: string | null;
  rowIndex: number;
}

export function PersonalRemarksCell({ value, rowIndex }: PersonalRemarksCellProps) {
  const [cellValue, setCellValue] = useState(value || "");
  
  const AttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalEditingRow,
  );
  const setAttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(
    (state) => state.setAttendanceTablePersonalEditingRow,
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setCellValue(newValue);
    
    if (AttendanceTablePersonalEditingRow?.rowData) {
      setAttendanceTablePersonalEditingRow({
        ...AttendanceTablePersonalEditingRow,
        rowData: {
          ...AttendanceTablePersonalEditingRow.rowData,
          remarks: newValue,
        },
      });
    }
  };

  return (
    <TableCell>
      <TextField
        fullWidth
        size="small"
        value={cellValue}
        onChange={handleChange}
        placeholder="備考を入力"
      />
    </TableCell>
  );
}
