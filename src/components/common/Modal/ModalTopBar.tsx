import React from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useModalTopBarStore } from "@/stores/common/modalTopBarSlice";
import { useModalContainerStore } from "@/stores/common/modalContainerSlice";
import { useCalendarViewToggleStore } from "@/stores/user/calendarViewToggleSlice";
import { useModalTopBar } from "@/hooks/common/Modal/useModalTopBar";

export const ModalTopBar: React.FC = () => {
    const isModalTopBarEditIconsVisible = useModalTopBarStore(
        (state) => state.isModalTopBarEditIconsVisible,
    );
    const modalRole = useModalContainerStore((state) => state.modalRole);
    const calendarViewMode = useCalendarViewToggleStore((state) => state.calendarViewMode);
    const { handleClickEditIcon, handleClickDeleteIcon, handleClickCloseIcon } =
        useModalTopBar();

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <IconButton onClick={handleClickCloseIcon}>
                <CloseIcon />
            </IconButton>

            {/* 管理者、またはユーザーの個人シフトモードの場合のみ編集・削除アイコンを表示 */}
            {isModalTopBarEditIconsVisible && 
             (modalRole === 'admin' || 
              (modalRole === 'user' && calendarViewMode === 'PERSONAL_SHIFT')) && (
                <Box sx={{ display: "flex" }}>
                    <IconButton onClick={handleClickEditIcon}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={handleClickDeleteIcon}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};
