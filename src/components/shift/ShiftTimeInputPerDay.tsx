import React, { useEffect, useState } from "react";
import { Box, ToggleButton, Typography } from "@mui/material";
import TimeDropdown from "../common/TimeDropdown";
import type { AutoShiftTime } from "@/customTypes/AutoShiftTypes";


interface ShiftTimeInputPerDayProps {
  initialDayTimes: AutoShiftTime[];
  disabled:boolean;
  onChange: (data: AutoShiftTime[]) => void;
}

/*
曜日ごとに時間を入力するためのコンポーネント
*/

const ShiftTimeInputPerDay: React.FC<ShiftTimeInputPerDayProps> = ({
  initialDayTimes,
  disabled,
  onChange,
}) => {
  // 定数
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  // ステート
  const [dayTimes, setDayTimes] = useState<AutoShiftTime[]>(initialDayTimes);

  // initialDayTimes が変更された場合に、dayTimes を更新
  useEffect(() => {
    setDayTimes(initialDayTimes);
  }, [initialDayTimes]);

  // ハンドラ
  const handleTimeChange = (
    dayOfWeek: number,
    field: keyof AutoShiftTime,
    value: any,
  ) => {
    const updatedData = dayTimes.map((item) =>
      item.day_of_week === dayOfWeek ? { ...item, [field]: value } : item
    );
    setDayTimes(updatedData);
    onChange(updatedData);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {dayTimes.map((dayTime) => (
        <Box
          key={dayTime.day_of_week}
          display="flex"
          alignItems="center"
          gap={2}
        >
          <ToggleButton // 曜日ボタン
            value="check"
            selected={dayTime.is_enabled}
            disabled={disabled}
            onChange={() =>
              handleTimeChange(
                dayTime.day_of_week,
                "is_enabled",
                !dayTime.is_enabled,
              )}
            sx={{
              fontSize: "0.875rem",
              height: "40px",
              width: "40px",

              // ボタンの背景色と文字色を変更
              // 曜日(ToggleButton)を選択中かつ、現在シフト自動登録が無効か(disabled) 
              backgroundColor: dayTime.is_enabled && !disabled ? "#1976d2" : "#ffffff",
              color: dayTime.is_enabled && !disabled ? "#ffffff" : "#000000",
              "&.Mui-selected": {
                backgroundColor: dayTime.is_enabled && !disabled ? "#1976d2" : "#ffffff",
                color: dayTime.is_enabled && !disabled ? "#ffffff" : "#000000",
              },
              "&.Mui-selected:hover": {
                backgroundColor: dayTime.is_enabled ? "#115293" : "#f0f0f0",
              },
            }}
          >
            {weekDays[dayTime.day_of_week]}
          </ToggleButton>

          {dayTime.is_enabled && (
            // 曜日が有効な場合のみ、時間入力表示
            <>
              <TimeDropdown
                label="開始時間"
                value={dayTime.start_time}
                disabled={disabled}
                onChange={(value) =>
                  handleTimeChange(dayTime.day_of_week, "start_time", value)}
              />
              <Typography variant="body1">-</Typography>
              <TimeDropdown
                label="終了時間"
                value={dayTime.end_time}
                disabled={disabled}
                onChange={(value) =>
                  handleTimeChange(dayTime.day_of_week, "end_time", value)}
              />
            </>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default ShiftTimeInputPerDay;
