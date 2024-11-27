import React from "react";
import { Box, Typography } from "@mui/material";
import { useModalContainerStore } from "@/stores/common/modalContainerSlice";
import { TimeDropdown } from "@/components/common/Modal/TimeDropdown";
import { UserDropdown } from "./UserDropdown";
import { useModalContent } from "@/hooks/common/Modal/useModalContent";
import { useModalContentStore } from "@/stores/common/modalContentSlice";
import { MultipleShiftRegister } from "./MultipleShiftRegister";

export const ModalContent: React.FC = () => {
  const modalRole = useModalContainerStore((state) => state.modalRole);
  const modalMode = useModalContainerStore((state) => state.modalMode);

  const {
    handleChangeStartEndTime,
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
      sx={{ gap: 2 }}
    >
      {/* 削除モードならテキスト*/}
      <Box display={modalMode === "delete" ? "block" : "none"}>
        <Typography>このシフトを削除しますか？</Typography>
      </Box>

      {/* 選択された日付 */}
      <Box>
        {/* 複数シフトの時だけ非表示 */}
        {modalMode !== "multiple-register" && (
          <Typography
            variant={modalMode === "register" || modalMode === "update"
              ? "body1"
              : "h5"}
          >
            {modalContentSelectedDate}
          </Typography>
        )}
      </Box>

      {/* 管理者なら */}
      {modalRole === "admin" && (
        <>
          {/* 確認ならユーザー名表示 */}
          <Box display={modalMode === "confirm" ? "block" : "none"}>
            <Typography>{modalContentSelectedUserName}</Typography>
          </Box>

          {/* 登録ならユーザー選択表示 */}
          <Box display={modalMode === "register" ? "block" : "none"}>
            <UserDropdown />
          </Box>
        </>
      )}

      {/* 役職共通 登録または更新なら */}
      <Box
        display={modalMode === "register" || modalMode === "update"
          ? "flex"
          : "none"}
        justifyContent="center"
        alignItems="center"
        sx={{ gap: 1 }}
      >
        {/* タイムドロップダウンを表示 */}
        <TimeDropdown
          label="開始時間"
          value={modalContentSelectedStartTime}
          onChange={(startTime) =>
            handleChangeStartEndTime(startTime, modalContentSelectedEndTime)}
          display={modalMode === "register" ? "block" : "none"}
        />
        <Typography variant="body1">-</Typography>
        <TimeDropdown
          label="終了時間"
          value={modalContentSelectedEndTime}
          onChange={(endTime) =>
            handleChangeStartEndTime(modalContentSelectedStartTime, endTime)}
          display={modalMode === "register" ? "block" : "none"}
        />
      </Box>

      {/* 確認モード共通の時間表示 */}
      <Box
        display={(modalMode === "confirm" || modalMode === "delete")
          ? "block"
          : "none"}
      >
        <Typography variant="h4">
          {modalContentSelectedStartTime} - {modalContentSelectedEndTime}
        </Typography>
      </Box>

      {/* 複数シフト登録なら */}
      <Box
        display={(modalMode === "multiple-register") ? "block" : "none"}
      >
        <MultipleShiftRegister />
      </Box>
    </Box>
  );
};
