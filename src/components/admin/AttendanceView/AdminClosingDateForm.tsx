"use client";
import React from "react";
import {
  Box,
  Button,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useAdminClosingDateForm } from "@/hooks/admin/AttendanceView/useAdminClosingDateForm";

export function AdminClosingDateForm() {
  const {
    isAdminClosingDateFormVisible,
    closingDate,
    setClosingDate,
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
          新しい締め日を選択してください
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>締め日</InputLabel>
          <Select
            value={closingDate}
            label="締め日"
            onChange={(e) => setClosingDate(Number(e.target.value))}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <MenuItem key={day} value={day}>
                {day}日
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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