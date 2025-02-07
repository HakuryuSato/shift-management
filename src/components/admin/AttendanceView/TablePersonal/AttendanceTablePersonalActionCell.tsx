import React from "react";
import { IconButton, TableCell } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAttendanceTablePersonalActionClickHandlers } from "@/hooks/admin/AttendanceView/useAttendanceTablePersonalActionClickHandlers";

interface Props {
  rowIndex: number;
}

export function AttendanceTablePersonalActionCell({ rowIndex }: Props) {
  const {
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleDeleteClick,
    isEditing,
  } = useAttendanceTablePersonalActionClickHandlers(rowIndex);

  return (
    <TableCell align="center">
      {isEditing
        ? (
          <>
            <IconButton onClick={handleSaveClick} size="small" color="primary">
              <CheckIcon />
            </IconButton>
            <IconButton
              onClick={handleCancelClick}
              size="small"
              color="default"
            >
              <CloseIcon />
            </IconButton>
            <IconButton onClick={handleDeleteClick} size="small" color="error">
              <DeleteIcon />
            </IconButton>
          </>
        )
        : (
          // 編集アイコン
          <IconButton onClick={handleEditClick} size="small">
            <EditIcon />
          </IconButton>
        )}
    </TableCell>
  );
}
