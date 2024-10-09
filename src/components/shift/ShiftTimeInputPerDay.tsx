import React from "react";
import { Box, ToggleButton, Typography, Grid} from "@mui/material";
import TimeDropdown from "../common/TimeDropdown";
import type { AutoShiftTime } from "@/customTypes/AutoShiftTypes";

interface ShiftTimeInputPerDayProps {
  initialData: AutoShiftTime[];
  onChange: (data: AutoShiftTime[]) => void;
  disabled: boolean;
}

const ShiftTimeInputPerDay: React.FC<ShiftTimeInputPerDayProps> = ({
  initialData,
  onChange,
  disabled,
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
        <Box key={dayTime.day_of_week} display="flex" alignItems="center" gap={2}>
          <ToggleButton
            value="check"
            selected={dayTime.is_enabled}
            onChange={() =>
              handleTimeChange(
                dayTime.day_of_week,
                "is_enabled",
                !dayTime.is_enabled
              )
            }
            disabled={disabled}
            sx={{
              fontSize: "0.875rem",  // 小さめのテキストサイズを指定
              height: "40px",        // TimeDropdownと同じ高さに調整
              width:"40px",
              backgroundColor: '#1976d2', color: '#fff'
            }}

          >
            {weekDays[dayTime.day_of_week]}

          </ToggleButton>
          <TimeDropdown
            label="開始時間"
            value={dayTime.start_time}
            onChange={(value) =>
              handleTimeChange(dayTime.day_of_week, "start_time", value)
            }
            disabled={disabled || !dayTime.is_enabled}
          />
          <Typography variant="body1">-</Typography>
          <TimeDropdown
            label="終了時間"
            value={dayTime.end_time}
            onChange={(value) =>
              handleTimeChange(dayTime.day_of_week, "end_time", value)
            }
            disabled={disabled || !dayTime.is_enabled}
          />
        </Box>
      ))}
    </Box>
  );
};

export default ShiftTimeInputPerDay;
