import React, { useState } from "react";
import { IconButton, TableCell, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAttendanceTablePersonalActionClickHandlers } from "@/hooks/admin/AttendanceView/useAttendanceTablePersonalActionClickHandlers";

const iconButtonStyle = {
  p: 0.5,
  '& .MuiSvgIcon-root': {
    fontSize: 16
  }
};

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
    <TableCell align="center" sx={{ p: 0 }}>
      {isEditing
        ? (
          <>
            <IconButton 
              onClick={handleSaveWithLoading} 
              size="small" 
              color="primary"
              disabled={isSaving}
              sx={iconButtonStyle}
            >
              {isSaving ? <CircularProgress size={16} /> : <CheckIcon />}
            </IconButton>
            <IconButton
              onClick={handleCancelClick}
              size="small"
              color="default"
              sx={iconButtonStyle}
            >
              <CloseIcon />
            </IconButton>
            <IconButton 
              onClick={handleDeleteClick} 
              size="small" 
              color="error"
              sx={iconButtonStyle}
            >
              <DeleteIcon />
            </IconButton>
          </>
        )
        : (
          // 編集アイコン
          <IconButton 
            onClick={handleEditClick} 
            size="small"
            sx={iconButtonStyle}
          >
            <EditIcon />
          </IconButton>
        )}
    </TableCell>
  );
}
