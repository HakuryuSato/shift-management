import React from "react";
import { Typography } from "@mui/material";
import { useModalStore } from "@/stores/common/modalSlice";
import TimeDropdown from "@/components/common/TimeDropdown";
import UserDropdown from "./UserDropdown";

export const ModalContent: React.FC = () => {
  const { modalRole, modalMode } = useModalStore();

  return (
    <div>
      {modalRole === "admin" && <Typography>ユーザー名</Typography>}
      {modalRole === "admin" && <UserDropdown />}

      {/* 選択された日付 */}
      

      {/* 登録用 */}
      {modalMode == "register" && (
        <TimeDropdown label="開始時間" disabled={false} onChange={() => {}} />
      )}

    </div>
  );
};

