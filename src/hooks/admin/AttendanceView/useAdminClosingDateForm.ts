import { useCallback, useState } from "react";
import { useAdminClosingDateFormStore } from "@/stores/admin/adminClosingDateFormSlice";
import { useAdminHomeTopBarStore } from "@/stores/admin/adminHomeTopBarSlice";

export const useAdminClosingDateForm = () => {
  // Store
  const isAdminClosingDateFormVisible = useAdminClosingDateFormStore(
    (state) => state.isVisibleAdminClosingDateForm
  );
  const closeAdminClosingDateForm = useAdminClosingDateFormStore(
    (state) => state.closeAdminClosingDateForm
  );
  const setAdminClosingDateFormDate = useAdminClosingDateFormStore(
    (state) => state.setAdminClosingDateFormDate
  );
  const adminClosingDateFormDate = useAdminClosingDateFormStore(
    (state) => state.adminClosingDateFormDate
  );

  // State
  const [closingDate, setClosingDate] = useState<number>(1);
  const [closingDateError, setClosingDateError] = useState(false);
  const [closingDateHelperText, setClosingDateHelperText] = useState("");

  // フォームを閉じる
  const handleClose = useCallback(() => {
    closeAdminClosingDateForm();
    setClosingDate(1);
    setClosingDateError(false);
    setClosingDateHelperText("");
  }, [closeAdminClosingDateForm]);

  // 送信
  const handleSubmit = useCallback(() => {
    if (closingDate < 1 || closingDate > 31) {
      setClosingDateError(true);
      setClosingDateHelperText("締め日は1日から31日までの範囲で指定してください");
      return;
    }

    setAdminClosingDateFormDate(closingDate);
    handleClose();
  }, [closingDate, setAdminClosingDateFormDate, handleClose]);

  return {
    isAdminClosingDateFormVisible,
    closingDate,
    setClosingDate,
    closingDateError,
    closingDateHelperText,
    handleClose,
    handleSubmit,
  };
}; 