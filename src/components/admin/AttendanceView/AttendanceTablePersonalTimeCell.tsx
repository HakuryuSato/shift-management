import React, { useState } from "react";
import { TableCell, Stack, SxProps } from "@mui/material";
import { AttendanceTableTimeCellEdit } from "./AttendanceTableTimeCellEdit";

const tableCellSx: SxProps = {
  padding: '4px 8px',
  height: '20px'
};

interface AttendanceTablePersonalTimeCellProps {
  startTime: string;
  endTime: string;
  rowIndex: number;
  onTimeChange: (rowIndex: number, field: "stampStartTime" | "stampEndTime", value: string) => void;
}

export function AttendanceTablePersonalTimeCell({
  startTime,
  endTime,
  rowIndex,
  onTimeChange,
}: AttendanceTablePersonalTimeCellProps) {
  const [editingField, setEditingField] = useState<"start" | "end" | null>(null);
  
  const handleStartTimeChange = (newValue: string) => {
    onTimeChange(rowIndex, "stampStartTime", newValue);
    setEditingField(null);
  };

  const handleEndTimeChange = (newValue: string) => {
    onTimeChange(rowIndex, "stampEndTime", newValue);
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  return (
    <TableCell sx={tableCellSx}>
      <Stack 
        direction="row" 
        spacing={1} 
        alignItems="center"
      >
        <AttendanceTableTimeCellEdit
          time={startTime}
          isEditing={editingField === "start"}
          onEdit={() => setEditingField("start")}
          onSave={handleStartTimeChange}
          onCancel={handleCancel}
        />
        <span>-</span>
        <AttendanceTableTimeCellEdit
          time={endTime}
          isEditing={editingField === "end"}
          onEdit={() => setEditingField("end")}
          onSave={handleEndTimeChange}
          onCancel={handleCancel}
        />
      </Stack>
    </TableCell>
  );
}
