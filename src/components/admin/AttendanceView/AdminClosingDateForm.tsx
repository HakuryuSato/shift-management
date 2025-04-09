"use client";
import React from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useAdminClosingDateForm } from "@/hooks/admin/AttendanceView/useAdminClosingDateForm";

export function AdminClosingDateForm() {
  const {
    isAdminClosingDateFormVisible,
    closingDate,
    setClosingDate,
    closingDateError,
    closingDateHelperText,
    handleClose,
    handleSubmit,
  } = useAdminClosingDateForm();

  if (!isAdminClosingDateFormVisible) return null;

  return (
    <Modal
      open={isAdminClosingDateFormVisible}
      onClose={handleClose}
    >
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
          maxWidth: 400,
          width: "90%",
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          締め日変更
        </Typography>
        <Typography variant="body1" mb={2}>
          新しい締め日を選択してください（1日から31日まで）
        </Typography>
        <TextField
          type="number"
          label="締め日"
          value={closingDate}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value >= 1 && value <= 31) {
              setClosingDate(value);
            }
          }}
          fullWidth
          margin="normal"
          error={closingDateError}
          helperText={closingDateHelperText}
          inputProps={{
            min: 1,
            max: 31,
          }}
        />

        <Box mt={4} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            変更
          </Button>
        </Box>
      </Box>
    </Modal>
  );
} 