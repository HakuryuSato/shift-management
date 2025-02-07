import React from "react";
import { IconButton, Stack, SxProps, TableCell } from "@mui/material";
import { AttendanceTableTimeCellEdit } from "./AttendanceTablePersonalTimeCellEdit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";

const tableCellSx: SxProps = {
  padding: "4px 8px",
  height: "20px",
};

const iconButtonSx: SxProps = {
  padding: "2px",
  width: "20px",
  height: "20px",
};

interface AttendanceTablePersonalTimeCellProps {
  startTime: string | null;
  endTime: string | null;
  rowIndex: number;
}

export function AttendanceTablePersonalStampsCell({
  startTime,
  endTime,
  rowIndex,
}: AttendanceTablePersonalTimeCellProps) {
  const AttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalEditingRow
  );
  const setAttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(
    (state) => state.setAttendanceTablePersonalEditingRow
  );

  const [selectedStartTime, setSelectedStartTime] = React.useState(
    startTime ? startTime.slice(0, 5) : "",
  );
  const [selectedEndTime, setSelectedEndTime] = React.useState(
    endTime ? endTime.slice(0, 5) : "",
  );
  const isEditing = AttendanceTablePersonalEditingRow?.rowIndex === rowIndex;

  const handleStartTimeChange = (newTime: string) => {
    setSelectedStartTime(newTime);
    if (AttendanceTablePersonalEditingRow?.rowData) {
      setAttendanceTablePersonalEditingRow({
        ...AttendanceTablePersonalEditingRow,
        rowData: {
          ...AttendanceTablePersonalEditingRow.rowData,
          stampStartTime: newTime
        }
      });
    }
  };

  const handleEndTimeChange = (newTime: string) => {
    setSelectedEndTime(newTime);
    if (AttendanceTablePersonalEditingRow?.rowData) {
      setAttendanceTablePersonalEditingRow({
        ...AttendanceTablePersonalEditingRow,
        rowData: {
          ...AttendanceTablePersonalEditingRow.rowData,
          stampEndTime: newTime
        }
      });
    }
  };

  return (
    <TableCell sx={tableCellSx}>
      <Stack direction="row" spacing={1} alignItems="center">
        <AttendanceTableTimeCellEdit
          time={startTime}
          selectedTime={selectedStartTime}
          onTimeSelect={handleStartTimeChange}
          isEditing={isEditing}
          onStartEditing={() => {
            if (AttendanceTablePersonalEditingRow?.rowIndex !== rowIndex) {
              setAttendanceTablePersonalEditingRow(null);
            }
            setAttendanceTablePersonalEditingRow({
              rowIndex,
              field: "stampStartTime",
            });
          }}
        />
        <span>-</span>
        <AttendanceTableTimeCellEdit
          time={endTime}
          selectedTime={selectedEndTime}
          onTimeSelect={handleEndTimeChange}
          isEditing={isEditing}
          onStartEditing={() => {
            if (AttendanceTablePersonalEditingRow?.rowIndex !== rowIndex) {
              setAttendanceTablePersonalEditingRow(null);
            }
            setAttendanceTablePersonalEditingRow({
              rowIndex,
              field: "stampEndTime",
            });
          }}
        />
      </Stack>
    </TableCell>
  );
}
