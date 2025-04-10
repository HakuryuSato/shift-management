import { useEffect } from "react";
import useSWR from 'swr';
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { fetchSetting } from "@/utils/client/apiClient";

export const useAdminHomeClosingDate = () => {
  const setAdminAttendanceViewClosingDate = useAdminAttendanceViewStore(
    (state) => state.setAdminAttendanceViewClosingDate
  );

  const { data, error, mutate } = useSWR(
    'settings/closing-date',
    () => fetchSetting('closing-date')
  );

  useEffect(() => {
    if (data) {
      setAdminAttendanceViewClosingDate(parseInt(data, 10));
    }
  }, [data, setAdminAttendanceViewClosingDate]);

  return { closingDate: data, error, mutateClosingDate: mutate };
}; 