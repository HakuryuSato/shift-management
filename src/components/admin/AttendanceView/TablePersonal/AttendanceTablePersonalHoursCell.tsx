import React ,{useState}from "react";
import { TableCell, TextField } from "@mui/material";
import type { AttendanceRowPersonal } from "@/types/Attendance";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";

interface EditableCellProps {
  value: string;
  rowIndex: number;
  field: keyof AttendanceRowPersonal;
}

export function AttendanceTablePersonalHoursCell({
  value,
  rowIndex,
  field,
}: EditableCellProps) {
  

  const AttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalEditingRow,
  );
  const setAttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(
    (state) => state.setAttendanceTablePersonalEditingRow,
  );

  const isEditing = AttendanceTablePersonalEditingRow?.rowIndex === rowIndex;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (AttendanceTablePersonalEditingRow?.rowData) {
      setAttendanceTablePersonalEditingRow({
        ...AttendanceTablePersonalEditingRow,
        rowData: {
          ...AttendanceTablePersonalEditingRow.rowData,
          [field]: event.target.value,
        },
      });
    }
  };

  if (isEditing) {
    return (
      <TableCell>
        <TextField
          type="number"
          inputProps={{
            step: "0.5",
            style: {
              textAlign: "center",
              padding: "0",
              fontSize: "0.8rem",
            },
          }}
          value={value}
          onChange={handleChange}
          variant="standard"
          size="small"
        />
      </TableCell>
    );
  }

  return <TableCell>{value}</TableCell>;
}
