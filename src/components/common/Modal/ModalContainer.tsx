import React from "react";
import { Box, Button, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useModalStore } from "@/stores/common/modalSlice";
import { ModalContent } from "./ModalContent";
import { ModalTopBar } from "./ModalTopBar";


export const ModalContainer: React.FC = () => {
    const isModalVisible = useModalStore((state) => state.isModalVisible);
    const setIsModalVisible = useModalStore((state) => state.setIsModalVisible);
    const modalMode = useModalStore((state) => state.modalMode);
    

    const modeText: { [key: string]: string } = {
        confirm: "確認",
        register: "保存",
        delete: "削除",
        "multiple-register": "保存",
    };

    return (
        <Modal
            open={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    padding: 2,
                    backgroundColor: "white",
                    borderRadius: 2,
                    position: "relative",
                    width: 400,
                }}
            >

                {/* TopBar */}
                <ModalTopBar/>

                {/* コンテンツ */}
                <ModalContent />

                {/* 共通のボタン */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 2,
                    }}
                >
                    <Button variant="contained">
                        {modeText[modalMode]}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};
