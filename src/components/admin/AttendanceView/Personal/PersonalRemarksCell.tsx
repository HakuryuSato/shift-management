import React, { useState } from "react";
import { TextField, TableCell } from "@mui/material";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";

interface PersonalRemarksCellProps {
  value: string | null;
  rowIndex: number;
}

export function PersonalRemarksCell({ value, rowIndex }: PersonalRemarksCellProps) {
  const [cellValue, setCellValue] = useState(value || "");
  const [previousRemarks, setPreviousRemarks] = useState<string[]>(() => {
    const storedRemarks = localStorage.getItem('previousRemarks');
    return storedRemarks ? JSON.parse(storedRemarks) : [];
  });
  
  const AttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalEditingRow,
  );
  const setAttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(
    (state) => state.setAttendanceTablePersonalEditingRow,
  );

  const handleBlur = () => {
    if (AttendanceTablePersonalEditingRow?.rowData) {
      setAttendanceTablePersonalEditingRow({
        ...AttendanceTablePersonalEditingRow,
        rowData: {
          ...AttendanceTablePersonalEditingRow.rowData,
          remarks: cellValue,
        },
      });

      // 新しい備考を保存
      if (cellValue && !previousRemarks.includes(cellValue)) {
        const updatedRemarks = [...previousRemarks, cellValue];
        setPreviousRemarks(updatedRemarks);
        localStorage.setItem('previousRemarks', JSON.stringify(updatedRemarks));
      }
    }
  };

  return (
    <TableCell>
      <TextField
        fullWidth
        size="small"
        value={cellValue}
        onChange={(e) => setCellValue(e.target.value)}
        onBlur={handleBlur}
        inputProps={{
          list: "remarks-list",
          style: {
            textAlign: "center",
            padding: "0",
            fontSize: "0.9rem",
          },
        }}
        placeholder="備考を入力"
      />
      <datalist id="remarks-list">
        {previousRemarks.map((remark, index) => (
          <option key={index} value={remark} />
        ))}
      </datalist>
    </TableCell>
  );
}
