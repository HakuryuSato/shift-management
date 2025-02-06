import React from "react";
import { TableCell, Stack, SxProps } from "@mui/material";
import { TimeDropdown } from "@/components/common/Modal/TimeDropdown";

const tableCellSx: SxProps = {
  padding: '2px 2px',
  height: '20px'
};

const timeDropdownSx: SxProps = {
  minWidth: '87px',
  '& .MuiInputBase-root': {
    height: '20px'
  }
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
  const handleStartTimeChange = (newValue: string) => {
    onTimeChange(rowIndex, "stampStartTime", newValue);
  };

  const handleEndTimeChange = (newValue: string) => {
    onTimeChange(rowIndex, "stampEndTime", newValue);
  };

  return (
    <TableCell sx={tableCellSx}>
      <Stack 
        direction="row" 
        spacing={1} 
        alignItems="center"
      >
        <TimeDropdown
          value={startTime}
          onChange={handleStartTimeChange}
          sx={timeDropdownSx}
        />
        <span>-</span>
        <TimeDropdown
          value={endTime}
          onChange={handleEndTimeChange}
          sx={timeDropdownSx}
        />
      </Stack>
    </TableCell>
  );
}
