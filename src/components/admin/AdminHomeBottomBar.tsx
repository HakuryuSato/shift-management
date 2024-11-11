import React from "react";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAdminHomeBottomBar } from "../../hooks/admin/useAdminHomeBottomBar";
import { blue } from "@mui/material/colors";

const commonButtonStyles = {
    backgroundColor: blue[500],
    color: "white",
    borderRadius: "8px",
    "&:hover": {
        backgroundColor: blue[700],
    },
};

export const AdminHomeBottomBar: React.FC = () => {
    const { handleClickPrevButton, handleClickNextButton } =
        useAdminHomeBottomBar();

    return (
        <Box display="flex" justifyContent="space-between" padding={2}>
            <IconButton
                onClick={() => handleClickPrevButton()}
                sx={commonButtonStyles}
            >
                <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton
                onClick={() => handleClickNextButton()}
                sx={commonButtonStyles}
            >
                <ArrowForwardIosIcon />
            </IconButton>
        </Box>
    );
};
