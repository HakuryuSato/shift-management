import React from "react";
import { TableCell, Stack, SxProps } from "@mui/material";
import { AttendanceTableTimeCellEdit } from "./AttendanceTablePersonalTimeCellEdit";

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
  return (
    <TableCell sx={tableCellSx}>
      <Stack 
        direction="row" 
        spacing={1} 
        alignItems="center"
      >
        <AttendanceTableTimeCellEdit
          time={startTime}
          field="stampStartTime"
          rowIndex={rowIndex}
          onTimeChange={onTimeChange}
        />
        <span>-</span>
        <AttendanceTableTimeCellEdit
          time={endTime}
          field="stampEndTime"
          rowIndex={rowIndex}
          onTimeChange={onTimeChange}
        />
      </Stack>
    </TableCell>
  );
}
