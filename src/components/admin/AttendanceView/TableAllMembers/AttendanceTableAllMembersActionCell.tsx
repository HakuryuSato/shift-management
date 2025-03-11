import React from "react";
import { useAttendanceTableAllMembersActionClickHandlers } from "@/hooks/admin/AttendanceView/useAttendanceTableAllMembersActionClickHandlers";
import { AttendanceTableActionCell } from "../common/AttendanceTableActionCell";

interface Props {
  rowIndex: number;
}

export function AttendanceTableAllMembersActionCell({ rowIndex }: Props) {
  const {
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    isEditing,
  } = useAttendanceTableAllMembersActionClickHandlers(rowIndex);

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
