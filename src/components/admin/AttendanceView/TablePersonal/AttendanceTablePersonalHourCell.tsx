import React from "react";
import { TableCell } from "@mui/material";
import type { AttendanceRowPersonal } from "@/types/Attendance";

interface EditableCellProps {
  value: string;
  rowIndex: number;
  field: keyof AttendanceRowPersonal;
  onClick?: (rowIndex: number, field: keyof AttendanceRowPersonal) => void;
  onBlur?: (
    rowIndex: number,
    field: keyof AttendanceRowPersonal,
    newValue: string,
  ) => void;
}

export function AttendanceTablePersonalHoursCell({
  value,
  rowIndex,
  field,
  onClick,
}: EditableCellProps) {
  return (
    <TableCell onClick={() => onClick?.(rowIndex, field)}>
      {value}
    </TableCell>
  );
}
