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

  const modalContentSelectedDate = useModalContentStore((state) =>
    state.modalContentSelectedDate
  );
  const modalContentSelectedUserName = useModalContentStore((state) =>
    state.modalContentSelectedUserName
  );
  const modalContentSelectedStartTime = useModalContentStore((state) =>
    state.modalContentSelectedStartTime
  );
  const modalContentSelectedEndTime = useModalContentStore((state) =>
    state.modalContentSelectedEndTime
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      {/* 管理者なら */}
      {modalRole === "admin" && (
        <>
          {/* 確認ならユーザー名表示 */}
          <Box mb={2} display={modalMode === "confirm" ? "block" : "none"}>
            <Typography>{modalContentSelectedUserName}</Typography>
          </Box>

          {/* 登録ならユーザー選択表示 */}
          <Box mb={2} display={modalMode === "register" ? "block" : "none"}>
            <UserDropdown />
          </Box>
        </>
      )}

      {/* 選択された日付 */}
      <Box mb={2}>
        <Typography variant="h5">{modalContentSelectedDate}</Typography>
      </Box>

      {/* 登録用 */}
      <Box
        mb={2}
        display={modalMode === "register" ? "flex" : "none"}
        justifyContent="center"
        alignItems="center"
      >
        {/* タイムドロップダウンを表示する場合 */}
        <TimeDropdown
          label="開始時間"
          value={modalContentSelectedStartTime}
          onChange={(time) => handleChangeStartTime(time)}
          display={modalMode === "register" ? "block" : "none"}
        />
        <Typography variant="body1">-</Typography>
        <TimeDropdown
          label="終了時間"
          value={modalContentSelectedEndTime}
          onChange={(time) => handleChangeEndTime(time)}
          display={modalMode === "register" ? "block" : "none"}
        />
      </Box>

      {/* 確認モード共通の時間表示 */}
      <Box
        mb={2}
        display={(modalMode === "confirm" || modalMode === "delete")
          ? "block"
          : "none"}
      >
        <Typography variant="h4">
          {modalContentSelectedStartTime} - {modalContentSelectedEndTime}
        </Typography>
      </Box>

      {/* 削除モードのテキスト表示 */}
      <Box display={modalMode === "delete" ? "block" : "none"}>
        <Typography>このシフトを削除しますか？</Typography>
      </Box>
    </Box>
  );
};
