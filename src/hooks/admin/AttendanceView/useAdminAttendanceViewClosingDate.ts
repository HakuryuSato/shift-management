import { useEffect } from "react";
import useSWR from 'swr';
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { fetchSetting } from "@/utils/client/apiClient";

interface ClosingDateResponse {
  value: string;
}

export const useAdminAttendanceViewClosingDate = () => {
  const setAdminAttendanceViewClosingDate = useAdminAttendanceViewStore(
    (state) => state.setAdminAttendanceViewClosingDate
  );

  const { 
    data: closingDateObj, 
    mutate: mutateClosingDate 
  } = useSWR<ClosingDateResponse | null>(
    'settings/closing-date',
    async () => {
      const response = await fetchSetting('closing-date');
      return response;
    }
  );

  useEffect(() => {
    const n = Number(closingDateObj?.value);
    if (Number.isInteger(n)) setAdminAttendanceViewClosingDate(n);
  }, [closingDateObj, setAdminAttendanceViewClosingDate]);

  return { mutateClosingDate };
}; 