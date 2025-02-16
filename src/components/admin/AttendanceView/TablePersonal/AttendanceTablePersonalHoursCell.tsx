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
  const [cellValue, setCellValue] = useState(value);

  const AttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalEditingRow,
  );
  const setAttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(
    (state) => state.setAttendanceTablePersonalEditingRow,
  );

  const isEditing = AttendanceTablePersonalEditingRow?.rowIndex === rowIndex;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setCellValue(newValue);
    if (AttendanceTablePersonalEditingRow?.rowData) {
      setAttendanceTablePersonalEditingRow({
        ...AttendanceTablePersonalEditingRow,
        rowData: {
          ...AttendanceTablePersonalEditingRow.rowData,
          [field]: newValue,
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
              fontSize: "0.9rem",
            },
          }}
          value={cellValue === "-" ? "" : cellValue}
          onChange={handleChange}
          variant="standard"
          size="small"
        />
      </TableCell>
    );
  }

  return <TableCell>{value}</TableCell>;
}
