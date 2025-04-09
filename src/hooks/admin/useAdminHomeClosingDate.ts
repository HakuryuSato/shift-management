import { useEffect } from "react";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { fetchSetting } from "@/utils/client/apiClient";

export const useAdminHomeClosingDate = () => {
  const setAdminAttendanceViewClosingDate = useAdminAttendanceViewStore(
    (state) => state.setAdminAttendanceViewClosingDate
  );

  useEffect(() => {
    const fetchClosingDate = async () => {
      try {
        const closingDate = await fetchSetting("closing-date");
        if (closingDate) {
          setAdminAttendanceViewClosingDate(parseInt(closingDate, 10));
        }
      } catch (error) {
        console.error("締め日の取得に失敗しました:", error);
      }
    };

    fetchClosingDate();
  }, [setAdminAttendanceViewClosingDate]);
}; 