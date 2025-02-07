import React from "react";
import { IconButton, TableCell } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";

interface Props {
  rowIndex: number;
}

export function AttendanceTablePersonalActionCell({ rowIndex }: Props) {

  const { 
    AttendanceTablePersonalEditingRow,
    setAttendanceTablePersonalEditingRow,
    AttendanceTablePersonalTableRows 
  } = useAttendanceTablePersonalStore((state) => ({
    AttendanceTablePersonalEditingRow: state.AttendanceTablePersonalEditingRow,
    setAttendanceTablePersonalEditingRow: state.setAttendanceTablePersonalEditingRow,
    AttendanceTablePersonalTableRows: state.AttendanceTablePersonalTableRows
  }));


  const isEditing = AttendanceTablePersonalEditingRow?.rowIndex === rowIndex;

  const handleEditClick = () => {
    // 他の行が編集中の場合、その編集状態をクリア
    if (
      AttendanceTablePersonalEditingRow?.rowIndex !== null &&
      AttendanceTablePersonalEditingRow?.rowIndex !== rowIndex
    ) {
      setAttendanceTablePersonalEditingRow(null);
    }
    // この行の編集を開始
    const rowData = AttendanceTablePersonalTableRows[rowIndex];
    setAttendanceTablePersonalEditingRow({ rowIndex, rowData });
  };

  const handleSaveClick = () => {
    setAttendanceTablePersonalEditingRow(null);
  };

  const handleCancelClick = () => {
    setAttendanceTablePersonalEditingRow(null);
  };

  const handleDeleteClick = () => {
    setAttendanceTablePersonalEditingRow(null);
  };

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
