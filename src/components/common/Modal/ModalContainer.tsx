import React from "react";
import { Box, Button, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useModalContainerStore } from "@/stores/common/modalContainerSlice";
import { ModalContent } from "./ModalContent";
import { ModalTopBar } from "./ModalTopBar";
import { useModalContainer } from "@/hooks/common/Modal/useModalContainer";

export const ModalContainer: React.FC = () => {
    const isModalVisible = useModalContainerStore((state) =>
        state.isModalVisible
    );
    const closeModal = useModalContainerStore((state) => state.closeModal);
    const modalMode = useModalContainerStore((state) => state.modalMode);
    const { handleClickModalContainerButton } = useModalContainer();

    const modeText: { [key: string]: string } = {
        confirm: "確認",
        register: "保存",
        update: "保存",
        delete: "削除",

        "multiple-register": "保存",
    };

    return (
        <Modal
            open={isModalVisible}
            onClose={() => closeModal()}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{ // モーダル全体
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "white",
                    borderRadius: 2,
                    width: 400,
                    padding: 2, // モーダル全体の要素の外枠
                }}
            >
                {/* TopBar */}
                <ModalTopBar />

                {/* コンテンツ */}
                <ModalContent />

                {/* 共通のボタン */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 4,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => handleClickModalContainerButton()}
                        sx={{
                            backgroundColor: modalMode === "delete"
                                ? "red"
                                : "default",
                        }}
                    >
                        {modeText[modalMode]}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};
