import React from "react";
import { Box, Typography } from "@mui/material";
import { useModalContainerStore } from "@/stores/common/modalContainerSlice";
import { TimeDropdown } from "@/components/common/Modal/TimeDropdown";
import { UserDropdown } from "./UserDropdown";
import { useModalContent } from "@/hooks/common/Modal/useModalContent";
import { useModalContentStore } from "@/stores/common/modalContentSlice";

export const ModalContent: React.FC = () => {
  const { modalRole, modalMode } = useModalContainerStore();

  const {
    handleChangeStartTime,
    handleChangeEndTime,
    handleChangeSelectedUser,
  } = useModalContent();

  const modalContentSelectedDate = useModalContentStore((state) => state.modalContentSelectedDate);
  const modalContentSelectedUserName = useModalContentStore((state) => state.modalContentSelectedUserName);
  const modalContentSelectedStartTime = useModalContentStore((state) => state.modalContentSelectedStartTime);
  const modalContentSelectedEndTime = useModalContentStore((state) => state.modalContentSelectedEndTime);

  return (
    <div>
      {/* 管理者ならユーザー名 */}
      {modalRole === "admin" && (
        <>
          {modalMode === "confirm"}
          <Typography>{modalContentSelectedUserName}</Typography>

          {/* modalModeがregisterならユーザー選択 */}
          {modalMode == "register" && <UserDropdown />}
        </>
      )}

      {/* 選択された日付 */}
      <Typography>選択された日付: {modalContentSelectedDate}</Typography>

      {/* 登録用 */}
      {modalMode === "register" && (
        <Box display="flex" justifyContent="center" alignItems="center">
          {
            /* <TimeDropdown
            label="開始時間"
            value={modalContentSelectedStartTime}
            onChange={()=>handleChangeStartTime()}
          />
          <TimeDropdown
            label="終了時間"
            value={modalContentSelectedEndTime}
            onChange={handleChangeEndTime}
          /> */
          }
        </Box>
      )}

      {modalMode === "confirm" && (
        <>
          <Typography>ユーザー名: {modalContentSelectedUserName}</Typography>
          <Typography>開始時間: {modalContentSelectedStartTime}</Typography>
          <Typography>終了時間: {modalContentSelectedEndTime}</Typography>
        </>
      )}

      {modalMode === "delete" && (
        <Typography>このシフトを削除しますか？</Typography>
      )}
    </div>
  );
};
