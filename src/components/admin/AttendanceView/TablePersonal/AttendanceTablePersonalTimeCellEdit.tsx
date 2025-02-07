import React from "react";
import { Stack, SxProps, Select, MenuItem } from "@mui/material";

// 時間オプション（5:00から23:00まで30分間隔）
const TIME_OPTIONS: string[] = [
  "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"
];

const selectSx: SxProps = {
  // width: '85px',
  // '& .MuiInputBase-root': {
  //   height: '20px'
  // },
  '& .MuiSelect-select': {
    padding: '2px 4px',
    textAlign: 'center'
  }
};

// 時間を'HH:mm'形式にフォーマットする
const formatTime = (time: string | null): string => {
  if (!time) return '';
  // 'HH:mm:ss'形式の文字列から'HH:mm'を取得
  const [hours, minutes] = time.split(':');
  return hours && minutes ? `${hours}:${minutes}` : time;
};

interface AttendanceTableTimeCellEditProps {
  time: string | null;
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  isEditing: boolean;
  onStartEditing: () => void;
}

export const AttendanceTableTimeCellEdit: React.FC<AttendanceTableTimeCellEditProps> = ({ 
  time,
  selectedTime,
  onTimeSelect,
  isEditing,
  onStartEditing
}) => {
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

  return (
    <Select
      value={isEditing ? selectedTime : formattedTime}
      onChange={isEditing ? (e) => onTimeSelect(e.target.value) : undefined}
      onClick={!isEditing ? onStartEditing : undefined}
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
        <MenuItem 
          key={timeOption} 
          value={timeOption}
          sx={!isEditing && timeOption === formattedTime ? { fontWeight: 'bold' } : {}}
        >
          {timeOption}
        </MenuItem>
      ))}
    </Select>
  );
};
