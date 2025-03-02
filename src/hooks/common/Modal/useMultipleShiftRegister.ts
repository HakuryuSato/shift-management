import { useEffect, useCallback } from "react";
import useSWR from "swr";
import { fetchAutoShiftSettings } from "@/utils/client/apiClient";
import { useUserHomeStore } from "@/stores/user/userHomeSlice";
import type { AutoShiftSettings, AutoShiftTime } from "@/types/AutoShift";
import { getLocalStorageItem, setLocalStorageItem, LOCAL_STORAGE_KEYS } from "@/utils/client/localStorage";
import { useMultipleShiftRegisterStore } from "@/stores/common/multipleShiftRegisterSlice";

const defaultDayTimes: AutoShiftTime[] = Array.from(
  { length: 6 },
  (_, index) => ({
    day_of_week: index + 1,
    start_time: "08:30",
    end_time: "18:00",
    is_enabled: index === 5, // 土曜日のみデフォルトでtrue
  })
);

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
  const setDayTimes = useCallback((data: AutoShiftTime[]) => {
    setMultipleShiftRegisterDayTimes(data);
    setLocalStorageItem(LOCAL_STORAGE_KEYS.MultipleShift_dayTimes, data);
  }, [setMultipleShiftRegisterDayTimes]);

  const setIsHolidayIncluded = useCallback((value: boolean) => {
    setMultipleShiftRegisterIsHolidayIncluded(value);
    setLocalStorageItem(LOCAL_STORAGE_KEYS.MultipleShift_isHolidayIncluded, value);
  }, [setMultipleShiftRegisterIsHolidayIncluded]);

  const setIsAutoShiftEnabled = useCallback((value: boolean) => {
    setMultipleShiftRegisterIsAutoShiftEnabled(value);
    setLocalStorageItem(LOCAL_STORAGE_KEYS.MultipleShift_isEnabled, value);
  }, [setMultipleShiftRegisterIsAutoShiftEnabled]);

  const setError = useCallback((error: string | null) => {
    setMultipleShiftRegisterError(error);
  }, [setMultipleShiftRegisterError]);


  // Fetch  -------------------------------------------------
  const { data: autoShiftSettings, error: fetchError, mutate } = useSWR(
    user_id ? `/auto_shift_settings/${user_id}` : null,
    () => fetchAutoShiftSettings(String(user_id))
  );

  // useEffect群 -------------------------------------------------
  // 初期化時にローカルストレージから値を取得して、グローバル状態を更新
  useEffect(() => {
    // ローカルストレージに値があるかチェック
    const hasDayTimesInStorage = !!localStorage.getItem(LOCAL_STORAGE_KEYS.MultipleShift_dayTimes);
    const hasHolidayIncludedInStorage = !!localStorage.getItem(LOCAL_STORAGE_KEYS.MultipleShift_isHolidayIncluded);
    const hasAutoShiftEnabledInStorage = !!localStorage.getItem(LOCAL_STORAGE_KEYS.MultipleShift_isEnabled);

    // multipleShiftRegisterIsCronJobsEnabledがtrueかつローカルストレージに値がない場合、
    // autoShiftSettingsから取得したデータを使用
    if (multipleShiftRegisterIsCronJobsEnabled && autoShiftSettings && autoShiftSettings.length > 0) {
      if (!hasDayTimesInStorage) {
        const fetchedDayTimes = autoShiftSettings[0]?.auto_shift_times || defaultDayTimes;
        setMultipleShiftRegisterDayTimes(fetchedDayTimes);
        setLocalStorageItem(LOCAL_STORAGE_KEYS.MultipleShift_dayTimes, fetchedDayTimes);
      } else {
        const storedDayTimes = getLocalStorageItem<AutoShiftTime[]>(
          LOCAL_STORAGE_KEYS.MultipleShift_dayTimes,
          defaultDayTimes
        );
        setMultipleShiftRegisterDayTimes(storedDayTimes);
      }

      if (!hasHolidayIncludedInStorage) {
        const fetchedIsHolidayIncluded = autoShiftSettings[0]?.is_holiday_included || false;
        setMultipleShiftRegisterIsHolidayIncluded(fetchedIsHolidayIncluded);
        setLocalStorageItem(LOCAL_STORAGE_KEYS.MultipleShift_isHolidayIncluded, fetchedIsHolidayIncluded);
      } else {
        const storedIsHolidayIncluded = getLocalStorageItem<boolean>(
          LOCAL_STORAGE_KEYS.MultipleShift_isHolidayIncluded,
          false
        );
        setMultipleShiftRegisterIsHolidayIncluded(storedIsHolidayIncluded);
      }

      if (!hasAutoShiftEnabledInStorage) {
        const fetchedIsAutoShiftEnabled = autoShiftSettings[0]?.is_enabled || false;
        setMultipleShiftRegisterIsAutoShiftEnabled(fetchedIsAutoShiftEnabled);
        setLocalStorageItem(LOCAL_STORAGE_KEYS.MultipleShift_isEnabled, fetchedIsAutoShiftEnabled);
      } else {
        const storedIsAutoShiftEnabled = getLocalStorageItem<boolean>(
          LOCAL_STORAGE_KEYS.MultipleShift_isEnabled,
          false
        );
        setMultipleShiftRegisterIsAutoShiftEnabled(storedIsAutoShiftEnabled);
      }
    } else {
      // 通常の処理（ローカルストレージから取得、なければデフォルト値）
      const storedDayTimes = getLocalStorageItem<AutoShiftTime[]>(
        LOCAL_STORAGE_KEYS.MultipleShift_dayTimes,
        defaultDayTimes
      );
      setMultipleShiftRegisterDayTimes(storedDayTimes);

      const storedIsHolidayIncluded = getLocalStorageItem<boolean>(
        LOCAL_STORAGE_KEYS.MultipleShift_isHolidayIncluded,
        false
      );
      setMultipleShiftRegisterIsHolidayIncluded(storedIsHolidayIncluded);

      const storedIsAutoShiftEnabled = getLocalStorageItem<boolean>(
        LOCAL_STORAGE_KEYS.MultipleShift_isEnabled,
        false
      );
      setMultipleShiftRegisterIsAutoShiftEnabled(storedIsAutoShiftEnabled);
    }
  }, [
    setMultipleShiftRegisterDayTimes,
    setMultipleShiftRegisterIsHolidayIncluded,
    setMultipleShiftRegisterIsAutoShiftEnabled,
    multipleShiftRegisterIsCronJobsEnabled,
    autoShiftSettings,
  ]);

  // mutateされたら自動シフト登録中かどうかを更新
  useEffect(() => {
    const isClonJobs = autoShiftSettings?.[0]?.is_enabled ?? false;
    setMultipleShiftRegisterIsCronJobsEnabled(isClonJobs);
  }, [autoShiftSettings, multipleShiftRegisterIsCronJobsEnabled, setMultipleShiftRegisterIsCronJobsEnabled]);


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
