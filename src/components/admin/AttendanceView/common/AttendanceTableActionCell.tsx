import React, { useState } from "react";
import { IconButton, TableCell, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

const iconButtonStyle = {
  px: 0.5,
  maxHeight: 5,
  '& .MuiSvgIcon-root': {
    fontSize: 16
  }
};

interface Props {
  rowIndex: number;
  showDeleteButton?: boolean;
  isEditing: boolean;
  isSaving?: boolean;
  onEditClick: () => void;
  onSaveClick: () => Promise<void>;
  onCancelClick: () => void;
  onDeleteClick?: () => void;
}

export function AttendanceTableActionCell({
  rowIndex,
  showDeleteButton = false,
  isEditing,
  isSaving = false,
  onEditClick,
  onSaveClick,
  onCancelClick,
  onDeleteClick
}: Props) {
  const [localIsSaving, setLocalIsSaving] = useState(false);
  
  // Use either the provided isSaving state or the local one
  const savingState = isSaving || localIsSaving;

  const handleSaveWithLoading = async () => {
    setLocalIsSaving(true);
    try {
      await onSaveClick();
    } finally {
      setLocalIsSaving(false);
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
              disabled={savingState}
              sx={iconButtonStyle}
            >
              {savingState ? <CircularProgress size={16} /> : <CheckIcon />}
            </IconButton>
            <IconButton
              onClick={onCancelClick}
              size="small"
              color="default"
              sx={iconButtonStyle}
            >
              <CloseIcon />
            </IconButton>
            {showDeleteButton && onDeleteClick && (
              <IconButton 
                onClick={onDeleteClick} 
                size="small" 
                color="error"
                sx={iconButtonStyle}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </>
        )
        : (
          // 編集アイコン
          <IconButton 
            onClick={onEditClick} 
            size="small"
            sx={iconButtonStyle}
          >
            <EditIcon />
          </IconButton>
        )}
    </TableCell>
  );
}
