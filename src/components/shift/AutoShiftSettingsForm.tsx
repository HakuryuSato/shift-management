import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  ToggleButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShiftTimeInputPerDay from "./ShiftTimeInputPerDay";
import {
  fetchAutoShiftSettings,
  sendAutoShiftSettings,
} from "@/utils/apiClient";
import type {
  AutoShiftSettings,
  AutoShiftTime,
} from "@/customTypes/AutoShiftTypes";

interface AutoShiftSettingsFormProps {
  userId: number;
  onClose: () => void;
  isOpen: boolean;
}

const defaultDayTimes: AutoShiftTime[] = Array.from(
  { length: 6 },
  (_, index) => ({
    day_of_week: index + 1, // 1から6(月から土)
    start_time: "08:30",
    end_time: "18:00",
    is_enabled: true,
  }),
);

const AutoShiftSettingsForm: React.FC<AutoShiftSettingsFormProps> = ({
  userId,
  onClose,
  isOpen,
}) => {
  const [dayTimes, setDayTimes] = useState<AutoShiftTime[]>(defaultDayTimes);
  const [isHolidayIncluded, setIsHolidayIncluded] = useState<boolean>(false);
  const [isAutoShiftEnabled, setIsAutoShiftEnabled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetchAutoShiftSettings(String(userId));
        if (response && "data" in response && response.data.length > 0) {
          const initialData: AutoShiftSettings = response.data[0];
          setDayTimes(initialData.auto_shift_times || defaultDayTimes);
          setIsHolidayIncluded(initialData.is_holiday_included || false);
          setIsAutoShiftEnabled(initialData.is_enabled || false);
        } else {
          // データがない場合はデフォルト値を設定
          setDayTimes(defaultDayTimes);
          setIsHolidayIncluded(false);
          setIsAutoShiftEnabled(false);
        }
      } catch (err) {
        console.error(err);
        setError("自動シフト設定の取得に失敗しました。");
        setDayTimes(defaultDayTimes);
      }
    };

    fetchInitialData();
  }, [userId]);

  const handleSubmit = async () => {
    // バリデーションエラーがあるか確認
    // ...（省略）
  };

  const toggleAutoShiftEnabled = async () => {
    const newIsEnabled = !isAutoShiftEnabled;
    setIsAutoShiftEnabled(newIsEnabled);

    // DBに状態を保存
    try {
      const settingData: AutoShiftSettings = {
        user_id: userId,
        is_holiday_included: isHolidayIncluded,
        is_enabled: newIsEnabled,
        auto_shift_times: dayTimes,
      };
      const response = await sendAutoShiftSettings(settingData);
      if (response && "error" in response) {
        setError("設定の保存に失敗しました。");
        // エラーが発生した場合、状態を元に戻す
        setIsAutoShiftEnabled(!newIsEnabled);
      }
    } catch (err) {
      console.error(err);
      setError("自動シフト設定の更新に失敗しました。");
      // エラーが発生した場合、状態を元に戻す
      setIsAutoShiftEnabled(!newIsEnabled);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
    >
      <DialogTitle>
        自動シフト設定
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
        </Box>
        <ShiftTimeInputPerDay
          initialData={dayTimes}
          onChange={(data: AutoShiftTime[]) => setDayTimes(data)}
        />
        <ToggleButton
          value="check"
          selected={isHolidayIncluded}
          onChange={() => setIsHolidayIncluded(!isHolidayIncluded)}
        >
          祝日も登録する
        </ToggleButton>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          設定を保存
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AutoShiftSettingsForm;
