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
    <div>
      {/* 管理者なら */}
      {modalRole === "admin" && (
        <>
          {/* 確認ならユーザー名表示 */}
          {modalMode === "confirm"}
          <Typography>{modalContentSelectedUserName}</Typography>

          {/* 登録ならユーザー選択表示 */}
          {modalMode == "register" && <UserDropdown />}
        </>
      )}

      {/* 選択された日付 */}
      <Typography variant="h5">{modalContentSelectedDate}</Typography>

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

      {/* 確認モード共通の時間表示 */}
      {modalMode === "confirm" || modalMode === "delete" && (
            <>
              <Typography variant="h4">
                {modalContentSelectedStartTime} - {modalContentSelectedEndTime}
              </Typography>
            </>
          )}

      {/* 削除モードのテキスト表示 */}
      {modalMode === "delete" && (
        <Typography>このシフトを削除しますか？</Typography>
      )}
    </div>
  );
};
