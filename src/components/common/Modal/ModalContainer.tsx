import React from "react";
import { Box, Button, Modal } from "@mui/material";
import { useModalContainerStore } from "@/stores/common/modalContainerSlice";
import { ModalContent } from "./ModalContent";
import { ModalTopBar } from "./ModalTopBar";
import { useModalContainer } from "@/hooks/common/Modal/useModalContainer";
import { useMultipleShiftRegisterStore } from "@/stores/common/multipleShiftRegisterSlice";

/*
注意事項
ModalContainer及びModalContentは、現状シフトと出退勤関連でのみ使用しています。
ユーザーの登録削除や締日変更は別のモーダルとして実装されています。

*/

export const ModalContainer: React.FC = () => {
    // State
    const isModalVisible = useModalContainerStore((state) =>
        state.isModalVisible
    );
    const closeModal = useModalContainerStore((state) => state.closeModal);
    const modalMode = useModalContainerStore((state) => state.modalMode);
    const multipleShiftRegisterIsCronJobsEnabled =
        useMultipleShiftRegisterStore((state) =>
            state.multipleShiftRegisterIsCronJobsEnabled
        );

    // Hooks
    const { handleClickModalContainerButton } = useModalContainer();

    const modeText = {
        "confirm": "確認",
        "register": "保存",
        "update": "保存",
        "delete": "削除",
        "multiple-register": multipleShiftRegisterIsCronJobsEnabled
            ? "解除"
            : "保存",
        "closing-date": "変更",
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
                            backgroundColor: modalMode === "delete" ||
                                    (modalMode === "multiple-register" &&
                                        multipleShiftRegisterIsCronJobsEnabled)
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
