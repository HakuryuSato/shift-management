import React from "react";
import { Typography } from "@mui/material";
import { useModalContainerStore } from "@/stores/common/modalContainerSlice";
import OldTimeDropdown from "@/components/common/OldTimeDropdown";
import UserDropdown from "./UserDropdown";

export const ModalContent: React.FC = () => {
  const { modalRole, modalMode } = useModalContainerStore();

  return (
    <div>
      {modalRole === "admin" && <Typography>ユーザー名</Typography>}
      {modalRole === "admin" && <UserDropdown />}

      {/* 選択された日付 */}
      

      {/* 登録用 */}
      {modalMode == "register" && (
        <TimeDropdown label="開始時間"  onChange={() => {}} />
      )}

    </div>
  );
};

