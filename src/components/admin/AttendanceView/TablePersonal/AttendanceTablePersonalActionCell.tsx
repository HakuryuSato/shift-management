import React from "react";
import { IconButton, TableCell } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";

interface Props {
  rowIndex: number;
  onSave?: () => void;
  onDelete?: () => void;
}

export function AttendanceTablePersonalActionCell({ rowIndex, onSave, onDelete }: Props) {
  const { editingRowIndex, setEditingRowIndex, setAttendanceTablePersonalEditingCell } = useAttendanceTablePersonalStore();
  const isEditing = editingRowIndex === rowIndex;

  const handleEditClick = () => {
    // 他の行が編集中の場合、その編集状態をクリア
    if (editingRowIndex !== null && editingRowIndex !== rowIndex) {
      setEditingRowIndex(null);
      setAttendanceTablePersonalEditingCell(null);
    }
    // この行の編集を開始
    setEditingRowIndex(rowIndex);
  };

  const handleSaveClick = () => {
    if (onSave) {
      onSave();
    }
    setEditingRowIndex(null);
    setAttendanceTablePersonalEditingCell(null);
  };

  const handleCancelClick = () => {
    setEditingRowIndex(null);
    setAttendanceTablePersonalEditingCell(null);
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete();
    }
    setEditingRowIndex(null);
    setAttendanceTablePersonalEditingCell(null);
  };

  return (
    <TableCell align="center">
      {isEditing ? (
        <>
          <IconButton onClick={handleSaveClick} size="small" color="primary">
            <CheckIcon />
          </IconButton>
          <IconButton onClick={handleCancelClick} size="small" color="default">
            <CloseIcon />
          </IconButton>
          <IconButton onClick={handleDeleteClick} size="small" color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ) : (
        <IconButton onClick={handleEditClick} size="small">
          <EditIcon />
        </IconButton>
      )}
    </TableCell>
  );
}
