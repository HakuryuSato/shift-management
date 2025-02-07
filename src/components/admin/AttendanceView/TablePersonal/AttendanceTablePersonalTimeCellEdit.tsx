import React from "react";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";
import { Stack, SxProps, Select, MenuItem, IconButton } from "@mui/material";
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
  // 'HH:mm:ss'形式の文字列から'HH:mm'を取得
  const [hours, minutes] = time.split(':');
  return hours && minutes ? `${hours}:${minutes}` : time;
};

interface AttendanceTableTimeCellEditProps {
  time: string;
  field: "stampStartTime" | "stampEndTime";
  rowIndex: number;
  onTimeChange: (rowIndex: number, field: "stampStartTime" | "stampEndTime", value: string) => void;
}

export const AttendanceTableTimeCellEdit: React.FC<AttendanceTableTimeCellEditProps> = ({ 
  time,
  field,
  rowIndex,
  onTimeChange
}) => {
  const editingCell = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalEditingCell
  );
  const setEditingCell = useAttendanceTablePersonalStore(
    (state) => state.setAttendanceTablePersonalEditingCell
  );
  
  const formattedTime = formatTime(time);
  const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.field === field;

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
  const [selectedTime, setSelectedTime] = React.useState(formattedTime);

  React.useEffect(() => {
    if (isEditing) {
      setSelectedTime(formattedTime);
    }
  }, [isEditing, formattedTime]);

  const handleSave = (newTime: string) => {
    onTimeChange(rowIndex, field, `${newTime}:00`);
    setEditingCell(null);
  };

  const handleCancel = () => {
    setEditingCell(null);
  };

  const handleStartEditing = () => {
    // 他のセルが編集中の場合は自動的にキャンセル
    if (editingCell && (editingCell.rowIndex !== rowIndex || editingCell.field !== field)) {
      // 既存の編集をキャンセル
      setEditingCell(null);
    }
    // 新しい編集セルを設定
    setEditingCell({ rowIndex, field });
  };

  // 編集中
  if (isEditing) {
    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Select
          value={selectedTime}
          onChange={(e) => {
            setSelectedTime(e.target.value);
            handleSave(e.target.value);
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
          <IconButton onClick={handleCancel} sx={iconButtonSx}>
            <CloseIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => handleSave(selectedTime)} sx={iconButtonSx}>
            <CheckIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    );
  }

  // 表示モード
  return (
    <Select
      value={formattedTime}
      onChange={(e) => handleSave(e.target.value)}
      size="small"
      sx={selectSx}
      onClick={handleStartEditing}
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
