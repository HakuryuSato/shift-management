"use client";
import React, { useState } from "react";
import { useAdminUserManagementFormStore } from "@/stores/admin/adminUserManagementFormSlice";
import {
    Box,
    Button,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import {
    deleteUserAction,
    insertUserAction,
} from "@/utils/client/serverActionClient";

export function AdminUserManagementForm() {
    const {
        isAdminUserManagementFormVisible,
        mode,
        userName,
        employmentType,
        closeAdminUserManagementForm,
        setUserName,
        setEmploymentType,
    } = useAdminUserManagementFormStore();

    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    // バリデーション用の状態
    const [userNameError, setUserNameError] = useState(false);
    const [userNameHelperText, setUserNameHelperText] = useState("");

    const handleClose = () => {
        closeAdminUserManagementForm();
        // フォームを閉じる際にエラーメッセージをリセット
        setUserNameError(false);
        setUserNameHelperText("");
    };

    const handleActionClick = async () => {
        let isValid = true;

        // ユーザー名のバリデーション
        if (userName.trim() === "") {
            setUserNameError(true);
            setUserNameHelperText("ユーザー名を入力してください");
            isValid = false;
        } else {
            setUserNameError(false);
            setUserNameHelperText("");
        }

        // バリデーションに失敗した場合は処理を中断
        if (!isValid) {
            return;
        }

        if (mode === "register") {
            await insertUserAction({
                user_name: userName,
                employment_type: employmentType,
            });
            handleClose();
        } else if (mode === "delete") {
            setIsConfirmDeleteOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        await deleteUserAction(userName);
        setIsConfirmDeleteOpen(false);
        handleClose();
    };

    const handleCancelDelete = () => {
        setIsConfirmDeleteOpen(false);
    };

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
                        {mode === "register" ? "ユーザー登録" : "ユーザー削除"}
                    </Typography>
                    <Typography variant="body1" mb={2}>
                        {mode === "register"
                            ? "登録するユーザーの雇用形態と名前を入力してください"
                            : "削除するユーザー名を入力してください"}
                    </Typography>
                    {mode === "register" && (
                        <Select
                            label="雇用形態"
                            value={employmentType}
                            onChange={(e) =>
                                setEmploymentType(
                                    e.target.value as "full_time" | "part_time",
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
                            // 入力中にエラーメッセージをクリア
                            if (e.target.value.trim() !== "") {
                                setUserNameError(false);
                                setUserNameHelperText("");
                            }
                        }}
                        fullWidth
                        margin="normal"
                        error={userNameError}
                        helperText={userNameHelperText}
                    />

                    <Box mt={4} textAlign="center">
                        <Button
                            variant="contained"
                            color={mode === "register" ? "primary" : "error"}
                            onClick={handleActionClick}
                        >
                            {mode === "register" ? "登録" : "削除"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
            {/* 削除確認用モーダル */}
            {mode === "delete" && (
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
                            ユーザー名：{userName}{" "}
                            を削除しますがよろしいですか？
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
