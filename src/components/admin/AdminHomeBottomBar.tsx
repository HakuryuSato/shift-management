import React from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAdminHomeBottomBar } from "../../hooks/admin/useAdminHomeBottomBar";
import { commonButtonStyle } from "@/styles/commonButtonStyle";

export const AdminHomeBottomBar: React.FC = () => {
    const theme = useTheme();
    const { handleClickPrevButton, handleClickNextButton } =
        useAdminHomeBottomBar();

    return (
        <Box display="flex" justifyContent="space-between" padding={2}>
            <IconButton
                onClick={() => handleClickPrevButton()}
                sx={commonButtonStyle}
            >
                <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton
                onClick={() => handleClickNextButton()}
                sx={commonButtonStyle}
            >
                <ArrowForwardIosIcon />
            </IconButton>
        </Box>
    );
};
