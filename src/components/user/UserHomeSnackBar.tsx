import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useUserSnackBarStore } from "@stores/user/userHomeSnackBarSlice";

export function UserHomeSnackBar() {
  const {
    isUserSnackBarVisible,
    snackBarMessage,
    snackBarStatus,
    hideUserSnackBar,
  } = useUserSnackBarStore();

  // 背景色を設定するためのマッピング
  const getBackgroundColor = (status: 'success' | 'error' | 'info' | 'warning') => {
    switch (status) {
      case 'success':
        return '#4caf50'; // 緑色
      case 'error':
        return '#f44336'; // 赤色
      case 'info':
        return '#ffffff'; // 白色
      case 'warning':
        return '#ff9800'; // 警告用の赤色（オレンジ）
      default:
        return '#ffffff'; // デフォルトは白
    }
  };

  return (
    <Snackbar
      open={isUserSnackBarVisible}
      autoHideDuration={3000} // 3秒で自動的に消える
      onClose={hideUserSnackBar}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={hideUserSnackBar}
        severity={snackBarStatus}
        style={{ backgroundColor: getBackgroundColor(snackBarStatus), color: snackBarStatus === 'info' ? '#000' : '#fff' }} // 色を動的に設定
      >
        {snackBarMessage}
      </Alert>
    </Snackbar>
  );
}

export default UserHomeSnackBar;
