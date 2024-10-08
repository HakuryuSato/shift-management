import React, { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import ShiftTimeInputPerDay from "./ShiftTimeInputPerDay";
import { sendAutoShiftSettings } from "@/utils/apiClient";
import type { AutoShiftSettings, AutoShiftTime } from '@/customTypes/AutoShiftTypes';

interface AutoShiftSettingsFormProps {
  userId: number;
  initialData?: AutoShiftSettings;
  onSuccess: () => void;
}

const AutoShiftSettingsForm: React.FC<AutoShiftSettingsFormProps> = ({
  userId,
  initialData,
  onSuccess,
}) => {
  const [dayTimes, setDayTimes] = useState<AutoShiftTime[]>(initialData?.auto_shift_times || []);
  const [isHolidayIncluded, setIsHolidayIncluded] = useState<boolean>(
    initialData?.is_holiday_included || false
  );
  const [isEnabled, setIsEnabled] = useState<boolean>(
    initialData?.is_enabled || false
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // バリデーションエラーがあるか確認
    let hasError = false;
    for (const dayTime of dayTimes) {
      if (dayTime.is_enabled && dayTime.error && Object.keys(dayTime.error).length > 0) {
        hasError = true;
        break;
      }
    }
    if (hasError) {
      setError("入力に誤りがあります。各曜日のエラーを確認してください。");
      return;
    }

    const settingData: AutoShiftSettings = {
      user_id: userId,
      is_holiday_included: isHolidayIncluded,
      is_enabled: isEnabled,
      auto_shift_times: dayTimes.map((dayTime) => ({
        day_of_week: dayTime.day_of_week,
        start_time: dayTime.start_time,
        end_time: dayTime.end_time,
        is_enabled: dayTime.is_enabled,
      })),
    };

    const response = await sendAutoShiftSettings(settingData);

    if (response && 'error' in response) {
      setError("設定の保存に失敗しました。");
    } else if (response && 'message' in response) {
      onSuccess();
    } else {
      setError("予期しないエラーが発生しました。");
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "24px", marginTop: "24px" }}>
      <Typography variant="h5" gutterBottom>
        自動シフト設定
      </Typography>
      <ShiftTimeInputPerDay
        initialData={dayTimes}
        onChange={(data: AutoShiftTime[]) => setDayTimes(data)}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={isHolidayIncluded}
            onChange={(e) => setIsHolidayIncluded(e.target.checked)}
            color="primary"
          />
        }
        label="祝日を含める"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            color="primary"
          />
        }
        label="自動シフトを有効にする"
      />
      {error && (
        <Alert severity="error" style={{ marginTop: "16px" }}>
          {error}
        </Alert>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ marginTop: "16px" }}
      >
        設定を保存
      </Button>
    </Paper>
  );
};

export default AutoShiftSettingsForm;
