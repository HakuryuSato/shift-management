import React, { useEffect, useRef, useState } from "react";
import { TableCell, TextField } from "@mui/material";
import type { AttendanceRowPersonal } from "@/types/Attendance";

interface EditableCellProps {
  value: string;
  rowIndex: number;
  field: keyof AttendanceRowPersonal;
  isEditing: boolean;
  onClick: (rowIndex: number, field: keyof AttendanceRowPersonal) => void;
  onBlur: (
    rowIndex: number,
    field: keyof AttendanceRowPersonal,
    newValue: string,
  ) => void;
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
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // isEditingが切り替わったときにinputValueをリセット
  useEffect(() => {
    if (!isEditing) {
      setInputValue(value);
    }
  }, [isEditing, value]);

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
            type="number"
            inputProps={{
              step: "0.5",
              style: {
                textAlign: "center",
                padding: "0",
                fontSize: "0.8rem",
              },
            }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => onBlur(rowIndex, field, inputValue)}
            inputRef={inputRef}
            variant="standard"
            size="small"
          />
        )
        : value}
    </TableCell>
  );
}
