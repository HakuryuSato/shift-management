import React from "react";
import { Stack, TableCell } from "@mui/material";
import { PersonalTimeCell } from "./PersonalTimeCell";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";

interface PersonalTimeCellProps {
  startTime: string | null;
  endTime: string | null;
  rowIndex: number;
}

export function PersonalStampsCell({
  startTime,
  endTime,
  rowIndex,
}: PersonalTimeCellProps) {
  const AttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalEditingRow,
  );
  const setAttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(
    (state) => state.setAttendanceTablePersonalEditingRow,
  );

  const [selectedStartTime, setSelectedStartTime] = React.useState(
    startTime || "",
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
          stampStartTime: newTime,
        },
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
          stampEndTime: newTime,
        },
      });
    }
  };

  return (
    <TableCell>
      <Stack direction="row" spacing={1} alignItems="center">
        <PersonalTimeCell
          time={startTime}
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
        <PersonalTimeCell
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
