import React from "react";
import { usePersonalActionClickHandlers } from "@/hooks/admin/AttendanceView/Personal/usePersonalActionClickHandlers";
import { AttendanceTableActionCell } from "../common/AttendanceTableActionCell";

interface Props {
  rowIndex: number;
}

export function PersonalActionCell({ rowIndex }: Props) {
  const {
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleDeleteClick,
    isEditing,
  } = usePersonalActionClickHandlers(rowIndex);

  return (
    <AttendanceTableActionCell
      rowIndex={rowIndex}
      showDeleteButton={true}
      isEditing={isEditing}
      onEditClick={handleEditClick}
      onSaveClick={handleSaveClick}
      onCancelClick={handleCancelClick}
      onDeleteClick={handleDeleteClick}
    />
  );
}
