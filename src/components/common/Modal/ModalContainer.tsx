import React from "react";
import { Box, Button, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useModalStore } from "@/stores/common/modalSlice";
import ModalContent from "./ModalContent";

const ModalContainer: React.FC = () => {
    const { isModalVisible, setIsModalVisible, modalAction } = useModalStore();

    return (
        <Modal
            open={isModalVisible}
            onClose={() => setIsModalVisible(false)}
        >
            <Box sx={{ padding: 2, backgroundColor: "white", borderRadius: 2 }}>
                <IconButton
                    onClick={() => setIsModalVisible(true)}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
                <ModalContent />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 2,
                    }}
                >
                    <Button variant="contained">{modalAction}</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalContainer;
