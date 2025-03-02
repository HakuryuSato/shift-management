import { useEffect, useCallback } from "react";
import useSWR from "swr";
import { fetchAutoShiftSettings } from "@/utils/client/apiClient";
import { useUserHomeStore } from "@/stores/user/userHomeSlice";
import type { AutoShiftSettings, AutoShiftTime } from "@/types/AutoShift";
import {
  getLocalStorageItem,
  setLocalStorageItem,
  LOCAL_STORAGE_KEYS,
} from "@/utils/client/localStorage";
import { useMultipleShiftRegisterStore } from "@/stores/common/multipleShiftRegisterSlice";

// デフォルトのdayTimes（分までの形式）
const defaultDayTimes: AutoShiftTime[] = Array.from({ length: 6 }, (_, index) => ({
  day_of_week: index + 1,
  start_time: "08:30",
  end_time: "18:00",
  is_enabled: true, // 土曜日のみデフォルトでtrue
}));

// 秒を切り捨てて「HH:MM」形式に統一するヘルパー
function trimSeconds(
  autoShiftTimes: AutoShiftTime[] | undefined
): AutoShiftTime[] | undefined {
  if (!autoShiftTimes) return undefined;
  return autoShiftTimes.map((item) => ({
    ...item,
    start_time: item.start_time.slice(0, 5), // "HH:MM:SS" → "HH:MM"
    end_time: item.end_time.slice(0, 5),     // "HH:MM:SS" → "HH:MM"
  }));
}

export function useMultipleShiftRegister() {
  const user_id = useUserHomeStore((state) => state.userId);

  // State群 -------------------------------------------------
  const multipleShiftRegisterDayTimes = useMultipleShiftRegisterStore(
    (state) => state.multipleShiftRegisterDayTimes
  );
  const setMultipleShiftRegisterDayTimes = useMultipleShiftRegisterStore(
    (state) => state.setMultipleShiftRegisterDayTimes
  );

  const multipleShiftRegisterIsHolidayIncluded = useMultipleShiftRegisterStore(
    (state) => state.multipleShiftRegisterIsHolidayIncluded
  );
  const setMultipleShiftRegisterIsCronJobsEnabled = useMultipleShiftRegisterStore(
    (state) => state.setMultipleShiftRegisterIsCronJobsEnabled
  );
  const setMultipleShiftRegisterIsHolidayIncluded = useMultipleShiftRegisterStore(
    (state) => state.setMultipleShiftRegisterIsHolidayIncluded
  );

  const multipleShiftRegisterIsAutoShiftEnabled = useMultipleShiftRegisterStore(
    (state) => state.multipleShiftRegisterIsAutoShiftEnabled
  );
  const setMultipleShiftRegisterIsAutoShiftEnabled = useMultipleShiftRegisterStore(
    (state) => state.setMultipleShiftRegisterIsAutoShiftEnabled
  );

  const multipleShiftRegisterError = useMultipleShiftRegisterStore(
    (state) => state.multipleShiftRegisterError
  );
  const setMultipleShiftRegisterError = useMultipleShiftRegisterStore(
    (state) => state.setMultipleShiftRegisterError
  );

  const multipleShiftRegisterIsCronJobsEnabled = useMultipleShiftRegisterStore(
    (state) => state.multipleShiftRegisterIsCronJobsEnabled
  );

  // 関数群 onChange時ローカルストレージとグローバル状態の両方を更新 -------------------------------------------------
  const setDayTimes = useCallback(
    (data: AutoShiftTime[]) => {
      setMultipleShiftRegisterDayTimes(data);
      setLocalStorageItem(LOCAL_STORAGE_KEYS.MultipleShift_dayTimes, data);
    },
    [setMultipleShiftRegisterDayTimes]
  );

  const setIsHolidayIncluded = useCallback(
    (value: boolean) => {
      setMultipleShiftRegisterIsHolidayIncluded(value);
      setLocalStorageItem(LOCAL_STORAGE_KEYS.MultipleShift_isHolidayIncluded, value);
    },
    [setMultipleShiftRegisterIsHolidayIncluded]
  );

  const setIsAutoShiftEnabled = useCallback(
    (value: boolean) => {
      setMultipleShiftRegisterIsAutoShiftEnabled(value);
      setLocalStorageItem(LOCAL_STORAGE_KEYS.MultipleShift_isEnabled, value);
    },
    [setMultipleShiftRegisterIsAutoShiftEnabled]
  );

  const setError = useCallback(
    (error: string | null) => {
      setMultipleShiftRegisterError(error);
    },
    [setMultipleShiftRegisterError]
  );

  // Fetch  -------------------------------------------------
  const { data: autoShiftSettings, error: fetchError, mutate } = useSWR(
    user_id ? `/auto_shift_settings/${user_id}` : null,
    () => fetchAutoShiftSettings(String(user_id))
  );

  // ローカルストレージ or DB or デフォルトの値を取得するヘルパー
  const getOrSetStorageValue = useCallback(
    <T,>(
      storageKey: string,
      defaultValue: T,
      dbValue: T | undefined,
      isCron: boolean
    ): T => {
      const localValue = getLocalStorageItem<T | null>(storageKey, null);
      if (localValue != null) {
        return localValue;
      }
      if (isCron && dbValue !== undefined) {
        setLocalStorageItem(storageKey, dbValue);
        return dbValue;
      }
      return defaultValue;
    },
    []
  );

  // DBの設定値から初期化を行う
  const initializeSettingsFromDB = useCallback(
    (autoShiftSettings?: AutoShiftSettings[]) => {
      const setting = autoShiftSettings?.[0];
      const trimmedAutoShiftTimes = trimSeconds(setting?.auto_shift_times);

      const dayTimes = getOrSetStorageValue<AutoShiftTime[]>(
        LOCAL_STORAGE_KEYS.MultipleShift_dayTimes,
        defaultDayTimes,
        trimmedAutoShiftTimes,
        multipleShiftRegisterIsCronJobsEnabled
      );

      const isHolidayIncluded = getOrSetStorageValue<boolean>(
        LOCAL_STORAGE_KEYS.MultipleShift_isHolidayIncluded,
        false,
        setting?.is_holiday_included,
        multipleShiftRegisterIsCronJobsEnabled
      );

      const isAutoShiftEnabled = getOrSetStorageValue<boolean>(
        LOCAL_STORAGE_KEYS.MultipleShift_isEnabled,
        false,
        setting?.is_enabled,
        multipleShiftRegisterIsCronJobsEnabled
      );

      setMultipleShiftRegisterDayTimes(dayTimes);
      setMultipleShiftRegisterIsHolidayIncluded(isHolidayIncluded);
      setMultipleShiftRegisterIsAutoShiftEnabled(isAutoShiftEnabled);
    },
    [
      getOrSetStorageValue,
      multipleShiftRegisterIsCronJobsEnabled,
      setMultipleShiftRegisterDayTimes,
      setMultipleShiftRegisterIsHolidayIncluded,
      setMultipleShiftRegisterIsAutoShiftEnabled,
    ]
  );

  // useEffect群 -------------------------------------------------
  // 初期化時にローカルストレージから値を取得して、グローバル状態を更新
  useEffect(() => {
    initializeSettingsFromDB(autoShiftSettings);
  }, [autoShiftSettings, initializeSettingsFromDB]);

  // mutateされたら自動シフト登録中かどうかを更新
  useEffect(() => {
    const isClonJobs = autoShiftSettings?.[0]?.is_enabled ?? false;
    setMultipleShiftRegisterIsCronJobsEnabled(isClonJobs);
  }, [autoShiftSettings, setMultipleShiftRegisterIsCronJobsEnabled]);

  return {
    dayTimes: multipleShiftRegisterDayTimes,
    setDayTimes,
    isHolidayIncluded: multipleShiftRegisterIsHolidayIncluded,
    setIsHolidayIncluded,
    isAutoShiftEnabled: multipleShiftRegisterIsAutoShiftEnabled,
    setIsAutoShiftEnabled,
    error: multipleShiftRegisterError,
    setError,
    mutateAutoShiftSettings: mutate,
  };
}
