"use client";
import React from "react";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useAdminUserManagementForm } from "@/hooks/admin/AttendanceView/useAdminUserManagementForm";

export function AdminUserManagementForm() {
  const {
    isAdminUserManagementFormVisible,
    adminUserManagementFormMode,
    userName,
    setUserName,
    employmentType,
    setEmploymentType,
    isConfirmDeleteOpen,
    userNameError,
    userNameHelperText,
    handleClose,
    handleActionClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useAdminUserManagementForm();

  if (!isAdminUserManagementFormVisible) return null;

  return (
    <div>
      {/* メインモーダル */}
      <Modal
        open={isAdminUserManagementFormVisible}
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
            {adminUserManagementFormMode === "register" ? "ユーザー登録" : "ユーザー削除"}
          </Typography>
          <Typography variant="body1" mb={2}>
            {adminUserManagementFormMode === "register"
              ? "登録するユーザーの雇用形態と名前を入力してください"
              : "削除するユーザー名を入力してください"}
          </Typography>
          {adminUserManagementFormMode === "register" && (
            <Select
              label="雇用形態"
              value={employmentType}
              onChange={(e) =>
                setEmploymentType(
                  e.target.value as "full_time" | "part_time"
                )
              }
              fullWidth
              margin="dense"
            >
              <MenuItem value="full_time">正社員</MenuItem>
              <MenuItem value="part_time">アルバイト・パート</MenuItem>
            </Select>
          )}
          <TextField
            label="ユーザー名"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              // エラーメッセージのクリアはフック内で処理
            }}
            fullWidth
            margin="normal"
            error={userNameError}
            helperText={userNameHelperText}
          />

          <Box mt={4} textAlign="center">
            <Button
              variant="contained"
              color={adminUserManagementFormMode === "register" ? "primary" : "error"}
              onClick={handleActionClick}
            >
              {adminUserManagementFormMode === "register" ? "登録" : "削除"}
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* 削除確認用モーダル */}
      {adminUserManagementFormMode === "delete" && (
        <Modal open={isConfirmDeleteOpen} onClose={handleCancelDelete}>
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
              確認
            </Typography>
            <Typography variant="body1" mb={2}>
              ユーザー名：{userName} を削除しますがよろしいですか？
            </Typography>
            <Box mt={4} textAlign="center">
              <Button
                variant="contained"
                color="secondary"
                onClick={handleConfirmDelete}
              >
                削除
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCancelDelete}
                sx={{ ml: 2 }}
              >
                キャンセル
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </div>
  );
}
