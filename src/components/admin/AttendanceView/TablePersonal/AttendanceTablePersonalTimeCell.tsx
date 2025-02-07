import React from "react";
import { TableCell, Stack, SxProps, IconButton } from "@mui/material";
import { AttendanceTableTimeCellEdit } from "./AttendanceTablePersonalTimeCellEdit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";

const tableCellSx: SxProps = {
  padding: '4px 8px',
  height: '20px'
};

const iconButtonSx: SxProps = {
  padding: '2px',
  width: '20px',
  height: '20px'
};

interface AttendanceTablePersonalTimeCellProps {
  startTime: string | null;
  endTime: string | null;
  rowIndex: number;
  onTimeChange: (rowIndex: number, field: "stampStartTime" | "stampEndTime", value: string) => void;
}

export function AttendanceTablePersonalTimeCell({
  startTime,
  endTime,
  rowIndex,
  onTimeChange,
}: AttendanceTablePersonalTimeCellProps) {
  const editingCell = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalEditingCell
  );
  const setEditingCell = useAttendanceTablePersonalStore(
    (state) => state.setAttendanceTablePersonalEditingCell
  );

  const [selectedStartTime, setSelectedStartTime] = React.useState(startTime ? startTime.slice(0, 5) : '');
  const [selectedEndTime, setSelectedEndTime] = React.useState(endTime ? endTime.slice(0, 5) : '');

  const isEditing = editingCell?.rowIndex === rowIndex;

  const handleSave = () => {
    if (selectedStartTime && selectedEndTime) {
      onTimeChange(rowIndex, "stampStartTime", `${selectedStartTime}:00`);
      onTimeChange(rowIndex, "stampEndTime", `${selectedEndTime}:00`);
      setEditingCell(null);
    }
  };

  const handleCancel = () => {
    setEditingCell(null);
    setSelectedStartTime(startTime ? startTime.slice(0, 5) : '');
    setSelectedEndTime(endTime ? endTime.slice(0, 5) : '');
  };

  return (
    <TableCell sx={tableCellSx}>
      <Stack direction="row" spacing={1} alignItems="center">
        <AttendanceTableTimeCellEdit
          time={startTime}
          selectedTime={selectedStartTime}
          onTimeSelect={setSelectedStartTime}
          isEditing={isEditing}
          onStartEditing={() => {
            if (editingCell && editingCell.rowIndex !== rowIndex) {
              setEditingCell(null);
            }
            setEditingCell({ rowIndex, field: "stampStartTime" });
          }}
        />
        <span>-</span>
        <AttendanceTableTimeCellEdit
          time={endTime}
          selectedTime={selectedEndTime}
          onTimeSelect={setSelectedEndTime}
          isEditing={isEditing}
          onStartEditing={() => {
            if (editingCell && editingCell.rowIndex !== rowIndex) {
              setEditingCell(null);
            }
            setEditingCell({ rowIndex, field: "stampEndTime" });
          }}
        />
        {isEditing && (
          <Stack direction="row" spacing={0.5}>
            <IconButton onClick={handleCancel} sx={iconButtonSx}>
              <CloseIcon fontSize="small" />
            </IconButton>
            <IconButton 
              onClick={handleSave} 
              sx={iconButtonSx}
              disabled={!selectedStartTime || !selectedEndTime}
            >
              <CheckIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}
      </Stack>
    </TableCell>
  );
}
