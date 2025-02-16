import React from "react";
import { Stack, Select, MenuItem } from "@mui/material";

// 終了時間オプション（5:00から23:00まで30分間隔）
const END_TIME_OPTIONS: string[] = [
  "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"
];

// 開始時間オプション（各時間から1分マイナス）
const START_TIME_OPTIONS: string[] = [
  "04:59", "05:29", "05:59", "06:29", "06:59", "07:29",
  "07:59", "08:29", "08:59", "09:29", "09:59", "10:29", "10:59", "11:29",
  "11:59", "12:29", "12:59", "13:29", "13:59", "14:29", "14:59", "15:29",
  "15:59", "16:29", "16:59", "17:29", "17:59", "18:29", "18:59", "19:29",
  "19:59", "20:29", "20:59", "21:29", "21:59", "22:29", "22:59"
];

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
  field: 'Start' | 'End';
}

export const AttendanceTableTimeCellEdit: React.FC<AttendanceTableTimeCellEditProps> = ({ 
  time,
  selectedTime,
  onTimeSelect,
  isEditing,
  onStartEditing,
  field
}) => {
  const formattedTime = formatTime(time);
  
  // 初期値の設定
  const defaultTime = field === 'Start' ? "08:29" : "18:00";
  const effectiveSelectedTime = selectedTime || defaultTime;


  // 現在の時間値を含む選択肢を生成
  const getTimeOptions = (currentTime: string): string[] => {
    const baseOptions = field === 'Start' ? START_TIME_OPTIONS : END_TIME_OPTIONS;
    
    if (!currentTime || baseOptions.includes(currentTime)) {
      return [...baseOptions];
    }

    // 時間を数値に変換して比較するためのヘルパー関数
    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const currentMinutes = timeToMinutes(currentTime);
    const allOptions = [...baseOptions];
    
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
      value={isEditing ? effectiveSelectedTime : formattedTime}
      onChange={isEditing ? (e) => onTimeSelect(e.target.value || defaultTime) : undefined}
      onClick={!isEditing ? onStartEditing : undefined}
      size="small"
      sx={{
        '& .MuiSelect-select': {
          padding: '0px 4px',
          fontSize: '0.875rem',
        },
      }}
    >
      {timeOptions.map((timeOption) => (
        <MenuItem 
          key={timeOption} 
          value={timeOption}
        >
          {timeOption}
        </MenuItem>
      ))}
    </Select>
  );
};
