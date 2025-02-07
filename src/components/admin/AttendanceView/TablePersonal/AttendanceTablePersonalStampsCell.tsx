import React from "react";
import { TableCell, Stack } from "@mui/material";
import { AttendanceTableTimeCellEdit } from "./AttendanceTablePersonalTimeCellEdit";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";

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

  // 開始時間を1分マイナスした時間に調整
  const adjustStartTime = (time: string | null): string => {
    if (!time) return "";
    const [hours, minutes] = time.slice(0, 5).split(':').map(Number);
    const totalMinutes = hours * 60 + minutes - 1;
    const adjustedHours = Math.floor(totalMinutes / 60);
    const adjustedMinutes = totalMinutes % 60;
    return `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
  };

  const [selectedStartTime, setSelectedStartTime] = React.useState(
    adjustStartTime(startTime)
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
    <TableCell >
      <Stack direction="row" spacing={1} alignItems="center">
        <AttendanceTableTimeCellEdit
          time={adjustStartTime(startTime)}
          selectedTime={selectedStartTime}
          onTimeSelect={handleStartTimeChange}
          isEditing={isEditing}
          field="Start"
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
          field="End"
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
