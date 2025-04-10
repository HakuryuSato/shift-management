import { useCallback, useState } from "react";
import { useAdminClosingDateFormStore } from "@/stores/admin/adminClosingDateFormSlice";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { useAdminAttendanceViewClosingDate } from "./useAdminAttendanceViewClosingDate";
import { updateSettings } from "@/utils/client/serverActionClient";

export const useAdminClosingDateForm = () => {
  // Store
  const isAdminClosingDateFormVisible = useAdminClosingDateFormStore(
    (state) => state.isVisibleAdminClosingDateForm
  );
  const closeAdminClosingDateForm = useAdminClosingDateFormStore(
    (state) => state.closeAdminClosingDateForm
  );
  const adminAttendanceViewClosingDate = useAdminAttendanceViewStore(
    (state) => state.adminAttendanceViewClosingDate
  );

  // Hooks
  const { mutateClosingDate } = useAdminAttendanceViewClosingDate();

  // State
  const [closingDate, setClosingDate] = useState(adminAttendanceViewClosingDate ?? 1);

  // フォームを閉じる
  const handleClose = useCallback(() => {
    closeAdminClosingDateForm();
  }, [closeAdminClosingDateForm]);

  // 送信
  const handleSubmit = useCallback(async () => {
    await updateSettings('closing-date', String(closingDate));
    await mutateClosingDate();
    handleClose();
  }, [closingDate, handleClose, mutateClosingDate]);

  return {
    isAdminClosingDateFormVisible,
    closingDate,
    setClosingDate,
    handleClose,
    handleSubmit,
  };
}; 