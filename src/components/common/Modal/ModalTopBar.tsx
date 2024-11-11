import React from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useModalTopBarStore } from "@/stores/common/modalTopBarSlice";
import { useModalTopBar } from "@/hooks/common/Modal/useModalTopBar";

export const ModalTopBar: React.FC = () => {
    const isModalTopBarEditIconsVisible = useModalTopBarStore(
        (state) => state.isModalTopBarEditIconsVisible,
    );
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

            {/* 編集禁止または、confirm以外なら編集と削除アイコン非表示 */}
            {isModalTopBarEditIconsVisible && (
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
