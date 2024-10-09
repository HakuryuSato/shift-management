import React from "react";
import { Box, ToggleButton, Typography } from "@mui/material";
import TimeDropdown from "../common/TimeDropdown";
import type { AutoShiftTime } from "@/customTypes/AutoShiftTypes";

interface ShiftTimeInputPerDayProps {
  initialData: AutoShiftTime[];
  onChange: (data: AutoShiftTime[]) => void;
}

const ShiftTimeInputPerDay: React.FC<ShiftTimeInputPerDayProps> = ({
  initialData,
  onChange,
}) => {
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  const handleTimeChange = (
    dayOfWeek: number,
    field: keyof AutoShiftTime,
    value: any,
  ) => {
    const updatedData = [...initialData];
    const index = updatedData.findIndex((item) =>
      item.day_of_week === dayOfWeek
    );
    if (index !== -1) {
      updatedData[index] = { ...updatedData[index], [field]: value };
      onChange(updatedData);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {initialData.map((dayTime) => (
        <Box
          key={dayTime.day_of_week}
          display="flex"
          alignItems="center"
          gap={2}
        >
          <ToggleButton // 曜日ボタン
            value="check"
            selected={dayTime.is_enabled}
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
              backgroundColor: dayTime.is_enabled ? "#1976d2" : "#ffffff",
              // backgroundColor:  "#1976d2"
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
                onChange={(value) =>
                  handleTimeChange(dayTime.day_of_week, "start_time", value)}
              />
              <Typography variant="body1">-</Typography>
              <TimeDropdown
                label="終了時間"
                value={dayTime.end_time}
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
