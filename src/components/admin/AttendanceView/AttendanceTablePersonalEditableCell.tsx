import React, { useEffect, useRef } from "react";
import { TableCell, TextField } from "@mui/material";
import type { AttendanceRow } from "@/types/Attendance";

interface EditableCellProps {
  value: string;
  rowIndex: number;
  field: keyof AttendanceRow;
  isEditing: boolean;
  onClick: (rowIndex: number, field: keyof AttendanceRow) => void;
  onBlur: () => void;
}

export function AttendanceTablePersonalEditableCell({
  value,
  rowIndex,
  field,
  isEditing,
  onClick,
  onBlur,
}: EditableCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  return (
    <TableCell
      onClick={() => onClick(rowIndex, field)}
      sx={{
        cursor: "pointer",
        "&:hover": { backgroundColor: "lightgrey" },
      }}
    >
      {isEditing
        ? (
          <TextField
            value={value}
            onBlur={onBlur}
            inputRef={inputRef}
            inputProps={{
              style: {
                textAlign: "center",
                padding: "0",
                fontSize: "0.8rem",
              },
            }}
            variant="standard"
            size="small"
          />
        )
        : value}
    </TableCell>
  );
}
