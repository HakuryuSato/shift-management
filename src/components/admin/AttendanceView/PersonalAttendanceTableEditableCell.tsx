import React, { useEffect, useRef } from "react";
import { TableCell, TextField } from "@mui/material";

interface EditableCellProps {
  value: string;
  rowIndex: number;
  field: string;
  isEditing: boolean;
  onClick: (rowIndex: number, field: string) => void;
  onChange: (rowIndex: number, field: string, value: string) => void;
  onBlur: () => void;
}

export function PersonalAttendanceTableEditableCell({
  value,
  rowIndex,
  field,
  isEditing,
  onClick,
  onChange,
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
      {isEditing ? (
        <TextField
          value={value}
          onChange={(e) => onChange(rowIndex, field, e.target.value)}
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
          sx={{
            margin: 0,
            padding: 0,
            width: "100%",
          }}
        />
      ) : (
        value
      )}
    </TableCell>
  );
}
