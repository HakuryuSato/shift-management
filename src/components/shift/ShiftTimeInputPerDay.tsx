import React, { useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import TimeDropdown from "../common/TimeDropdown";

interface DayTime {
  dayOfWeek: number;
  dayLabel: string;
  startTime: string;
  endTime: string;
  isEnabled: boolean;
  error?: {
    startTime?: string;
    endTime?: string;
  };
}

interface ShiftTimeInputPerDayProps {
  initialData?: DayTime[];
  onChange: (data: DayTime[]) => void;
}

const ShiftTimeInputPerDay: React.FC<ShiftTimeInputPerDayProps> = ({
  initialData,
  onChange,
}) => {
  const daysOfWeek = [
    { dayOfWeek: 1, dayLabel: "月" },
    { dayOfWeek: 2, dayLabel: "火" },
    { dayOfWeek: 3, dayLabel: "水" },
    { dayOfWeek: 4, dayLabel: "木" },
    { dayOfWeek: 5, dayLabel: "金" },
    { dayOfWeek: 6, dayLabel: "土" },
  ];

  const [dayTimes, setDayTimes] = useState<DayTime[]>(
    initialData ||
      daysOfWeek.map((day) => ({
        dayOfWeek: day.dayOfWeek,
        dayLabel: day.dayLabel,
        startTime: "",
        endTime: "",
        isEnabled: false,
        error: {},
      }))
  );

  const handleTimeChange = (
    index: number,
    field: "startTime" | "endTime" | "isEnabled",
    value: string | boolean
  ) => {
    const updatedDayTimes = [...dayTimes];
    updatedDayTimes[index] = {
      ...updatedDayTimes[index],
      [field]: value,
      error: {}, // フィールドが変更されたらエラーをクリア
    };
    setDayTimes(updatedDayTimes);
    onChange(updatedDayTimes);
  };

  // バリデーションを行い、エラー情報をセット
  const validateDayTime = (dayTime: DayTime) => {
    const errors: any = {};
    if (!dayTime.startTime) {
      errors.startTime = "開始時間を選択してください";
    }
    if (!dayTime.endTime) {
      errors.endTime = "終了時間を選択してください";
    }
    if (dayTime.startTime && dayTime.endTime && dayTime.startTime >= dayTime.endTime) {
      errors.startTime = "開始時間は終了時間より前に設定してください";
    }
    if (dayTime.startTime === "12:00" || dayTime.endTime === "13:00") {
      errors.startTime = "開始時間に12:00は設定できません";
      errors.endTime = "終了時間に13:00は設定できません";
    }
    return errors;
  };

  return (
    <Paper elevation={3} style={{ padding: "16px" }}>
      <Grid container spacing={2}>
        {dayTimes.map((dayTime, index) => {
          const errors = dayTime.isEnabled ? validateDayTime(dayTime) : {};
          const hasErrors = Object.keys(errors).length > 0;

          // エラー情報を更新
          if (hasErrors) {
            dayTime.error = errors;
          } else {
            dayTime.error = {};
          }

          return (
            <Grid item xs={12} key={dayTime.dayOfWeek}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item xs={1}>
                  <Typography>{dayTime.dayLabel}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dayTime.isEnabled}
                        onChange={(e) =>
                          handleTimeChange(index, "isEnabled", e.target.checked)
                        }
                        color="primary"
                      />
                    }
                    label="有効"
                  />
                </Grid>
                {dayTime.isEnabled ? (
                  <>
                    <Grid item xs={4}>
                      <TimeDropdown
                        label="開始時間"
                        value={dayTime.startTime}
                        onChange={(value) =>
                          handleTimeChange(index, "startTime", value)
                        }
                        error={!!errors.startTime}
                        helperText={errors.startTime}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TimeDropdown
                        label="終了時間"
                        value={dayTime.endTime}
                        onChange={(value) =>
                          handleTimeChange(index, "endTime", value)
                        }
                        error={!!errors.endTime}
                        helperText={errors.endTime}
                      />
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={5}>
                    <Typography color="textSecondary">休み</Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default ShiftTimeInputPerDay;
