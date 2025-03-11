import React from "react";
import { useAllMembersActionClickHandlers } from "@/hooks/admin/AttendanceView/AllMembers/useAllMembersActionClickHandlers";
import { AttendanceTableActionCell } from "../common/AttendanceTableActionCell";

interface Props {
  rowIndex: number;
}

export function AllMembersActionCell({ rowIndex }: Props) {
  const {
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    isEditing,
  } = useAllMembersActionClickHandlers(rowIndex);

  return (
    <AttendanceTableActionCell
      rowIndex={rowIndex}
      showDeleteButton={false}
      isEditing={isEditing}
      onEditClick={handleEditClick}
      onSaveClick={handleSaveClick}
      onCancelClick={handleCancelClick}
    />
  );
}
