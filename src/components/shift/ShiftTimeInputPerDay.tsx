// src/components/shift/ShiftTimeInputPerDay.tsx

import React from "react";
import { Grid, TextField, Checkbox, FormControlLabel } from "@mui/material";
import type { AutoShiftTime } from '@/customTypes/AutoShiftTypes';

interface ShiftTimeInputPerDayProps {
  initialData: AutoShiftTime[];
  onChange: (data: AutoShiftTime[]) => void;
}

const ShiftTimeInputPerDay: React.FC<ShiftTimeInputPerDayProps> = ({ initialData, onChange }) => {
  const handleTimeChange = (index: number, field: keyof AutoShiftTime, value: any) => {
    const updatedData = [...initialData];
    updatedData[index] = { ...updatedData[index], [field]: value };
    onChange(updatedData);
  };

  return (
    <Grid container spacing={2}>
      {initialData.map((dayTime, index) => (
        <Grid item xs={12} sm={6} md={3} key={dayTime.day_of_week}>
          <FormControlLabel
            control={
              <Checkbox
                checked={dayTime.is_enabled}
                onChange={(e) => handleTimeChange(index, 'is_enabled', e.target.checked)}
                color="primary"
              />
            }
            label={`曜日 ${dayTime.day_of_week}`}
          />
          <TextField
            label="開始時間"
            type="time"
            value={dayTime.start_time}
            onChange={(e) => handleTimeChange(index, 'start_time', e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5分刻み
            }}
            fullWidth
          />
          <TextField
            label="終了時間"
            type="time"
            value={dayTime.end_time}
            onChange={(e) => handleTimeChange(index, 'end_time', e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5分刻み
            }}
            fullWidth
          />
          {/* エラー表示などが必要な場合は追加 */}
        </Grid>
      ))}
    </Grid>
  );
};

export default ShiftTimeInputPerDay;
