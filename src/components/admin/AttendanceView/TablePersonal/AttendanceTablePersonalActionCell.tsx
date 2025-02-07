import React, { useState } from "react";
import { IconButton, TableCell, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAttendanceTablePersonalActionClickHandlers } from "@/hooks/admin/AttendanceView/useAttendanceTablePersonalActionClickHandlers";

interface Props {
  rowIndex: number;
}

export function AttendanceTablePersonalActionCell({ rowIndex }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const {
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleDeleteClick,
    isEditing,
  } = useAttendanceTablePersonalActionClickHandlers(rowIndex);

  const handleSaveWithLoading = async () => {
    setIsSaving(true);
    try {
      await handleSaveClick();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TableCell align="center">
      {isEditing
        ? (
          <>
            <IconButton 
              onClick={handleSaveWithLoading} 
              size="small" 
              color="primary"
              disabled={isSaving}
            >
              {isSaving ? <CircularProgress size={20} /> : <CheckIcon />}
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
