import React, { useState } from "react";
import { TableCell, Stack, SxProps, Select, MenuItem, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

// 時間オプション（5:00から23:00まで30分間隔）
const TIME_OPTIONS: string[] = [
  "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"
];

const tableCellSx: SxProps = {
  padding: '4px 8px',
  height: '20px'
};

const selectSx: SxProps = {
  width: '85px',
  '& .MuiInputBase-root': {
    height: '20px'
  },
  '& .MuiSelect-select': {
    padding: '2px 4px',
    textAlign: 'center'
  }
};

const iconButtonSx: SxProps = {
  padding: '2px',
  width: '20px',
  height: '20px'
};

// 時間を'HH:mm'形式にフォーマットする
const formatTime = (time: string): string => {
  if (!time) return '';
  const match = time.match(/^(\d{2}):(\d{2}):(\d{2})$/);
  return match ? `${match[1]}:${match[2]}` : time;
};


interface AttendanceTablePersonalTimeCellProps {
  startTime: string;
  endTime: string;
  rowIndex: number;
  onTimeChange: (rowIndex: number, field: "stampStartTime" | "stampEndTime", value: string) => void;
}

interface TimeEditProps {
  time: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (newTime: string) => void;
  onCancel: () => void;
}

const TimeEdit: React.FC<TimeEditProps> = ({ time, isEditing, onEdit, onSave, onCancel }) => {
  const formattedTime = formatTime(time);

  // 現在の時間値を含む選択肢を生成
  const getTimeOptions = (currentTime: string): string[] => {
    if (!currentTime || TIME_OPTIONS.includes(currentTime)) {
      return [...TIME_OPTIONS];
    }

    // 時間を数値に変換して比較するためのヘルパー関数
    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const currentMinutes = timeToMinutes(currentTime);
    const allOptions = [...TIME_OPTIONS];
    
    // 適切な位置に現在の時間を挿入
    let insertIndex = allOptions.findIndex(option => 
      timeToMinutes(option) > currentMinutes
    );
    
    if (insertIndex === -1) {
      insertIndex = allOptions.length;
    }
    
    allOptions.splice(insertIndex, 0, currentTime);
    return allOptions;
  };

  const timeOptions = getTimeOptions(formattedTime);
  const [selectedTime, setSelectedTime] = useState(formattedTime);

  React.useEffect(() => {
    if (isEditing) {
      setSelectedTime(formattedTime);
    }
  }, [isEditing, formattedTime]);

  if (isEditing) {
    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Select
          value={selectedTime}
          onChange={(e) => {
            setSelectedTime(e.target.value);
            onSave(`${e.target.value}:00`);
          }}
          size="small"
          sx={selectSx}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300
              }
            }
          }}
        >
          {timeOptions.map((timeOption) => (
            <MenuItem key={timeOption} value={timeOption}>
              {timeOption}
            </MenuItem>
          ))}
        </Select>
        <Stack direction="row" spacing={0.5}>
          <IconButton onClick={onCancel} sx={iconButtonSx}>
            <CloseIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => onSave(`${selectedTime}:00`)} sx={iconButtonSx}>
            <CheckIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    );
  }

  return (
    <Select
      value={formattedTime}
      onChange={(e) => onSave(`${e.target.value}:00`)}
      size="small"
      sx={selectSx}
      onClick={onEdit}
      readOnly={!isEditing}
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 300
          }
        }
      }}
    >
      {timeOptions.map((timeOption) => (
        <MenuItem 
          key={timeOption} 
          value={timeOption}
          sx={timeOption === formattedTime ? { fontWeight: 'bold' } : {}}
        >
          {timeOption}
        </MenuItem>
      ))}
    </Select>
  );
};

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
        <TimeEdit
          time={startTime}
          isEditing={editingField === "start"}
          onEdit={() => setEditingField("start")}
          onSave={handleStartTimeChange}
          onCancel={handleCancel}
        />
        <span>-</span>
        <TimeEdit
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
