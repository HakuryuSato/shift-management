import React from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useModalHooks } from "@/hooks/common/useModalHooks";

export const ModalTopBar: React.FC = () => {
    const { closeModal } = useModalHooks();

    return (
        <Box
            sx={{
                position: "absolute",
                top: 8,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                paddingX: 1,
            }}
        >
            <IconButton onClick={closeModal}>
                <CloseIcon />
            </IconButton>

            <Box>
                <IconButton>
                    <EditIcon />
                </IconButton>
                <IconButton sx={{ marginLeft: 1 }}>
                    <DeleteIcon />
                </IconButton>
            </Box>
        </Box>
    );
};
