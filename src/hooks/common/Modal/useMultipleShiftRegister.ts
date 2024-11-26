import { useState, useEffect } from "react";
import useSWR from "swr";
import { fetchAutoShiftSettings } from "@/utils/client/apiClient";
import { useUserHomeStore } from "@/stores/user/userHomeSlice";
import type { AutoShiftSettings, AutoShiftTime } from "@/types/AutoShift";

const defaultDayTimes: AutoShiftTime[] = Array.from(
  { length: 6 },
  (_, index) => ({
    day_of_week: index + 1,
    start_time: "08:30",
    end_time: "18:00",
    is_enabled: true,
  })
);

export function useMultipleShiftRegister() {
  const user_id = useUserHomeStore((state) => state.userId);
  const [dayTimes, setDayTimes] = useState<AutoShiftTime[]>(defaultDayTimes);
  const [isHolidayIncluded, setIsHolidayIncluded] = useState<boolean>(false);
  const [isAutoShiftEnabled, setIsAutoShiftEnabled] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { data: autoShiftSettings, error: fetchError, mutate } = useSWR(
    user_id ? `/auto_shift_settings/${user_id}` : null,
    () => fetchAutoShiftSettings(String(user_id))
  );

  // autoShiftSettingsがあるならば、取得？


  useEffect(() => {
    if (autoShiftSettings) {
      setDayTimes(
        autoShiftSettings.auto_shift_times && autoShiftSettings.auto_shift_times.length > 0
          ? autoShiftSettings.auto_shift_times
          : defaultDayTimes
      );
      setIsHolidayIncluded(autoShiftSettings.is_holiday_included || false);
      setIsAutoShiftEnabled(autoShiftSettings.is_enabled || false);
    } else {
      setDayTimes(defaultDayTimes);
      setIsHolidayIncluded(false);
      setIsAutoShiftEnabled(false);
    }
  }, [autoShiftSettings]);

  return {
    dayTimes,
    setDayTimes,
    isHolidayIncluded,
    setIsHolidayIncluded,
    isAutoShiftEnabled,
    setIsAutoShiftEnabled,
    error,
    setError,
    mutateAutoShiftSettings: mutate,
  };
}
