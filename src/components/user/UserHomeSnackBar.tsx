import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Success用アイコン
import ErrorIcon from "@mui/icons-material/Error"; // Error用アイコン
import InfoIcon from "@mui/icons-material/Info"; // Info用アイコン
import WarningIcon from "@mui/icons-material/Warning"; // Warning用アイコン
import { useUserSnackBarStore } from "@stores/user/userHomeSnackBarSlice";
import { useTheme } from "@mui/material/styles"; // MUIのテーマを使用

export function UserHomeSnackBar() {
  const theme = useTheme(); // MUIテーマを取得
  const {
    isUserSnackBarVisible,
    snackBarMessage,
    snackBarStatus,
    hideUserSnackBar,
  } = useUserSnackBarStore();

  // MUIのパレットを利用した背景色を取得
  const getBackgroundColor = (status: 'success' | 'error' | 'info' | 'warning') => {
    switch (status) {
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      case 'info':
        return theme.palette.info.main;
      case 'warning':
        return theme.palette.warning.main;
      default:
        return theme.palette.background.paper;
    }
  };

  // アイコンを動的に切り替える
  const getIcon = (status: 'success' | 'error' | 'info' | 'warning') => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon style={{ color: '#fff' }} />; // 白色アイコン
      case 'error':
        return <ErrorIcon style={{ color: '#fff' }} />; // 白色アイコン
      case 'info':
        return <InfoIcon style={{ color: '#fff' }} />; // 白色アイコン
      case 'warning':
        return <WarningIcon style={{ color: '#fff' }} />; // 白色アイコン
      default:
        return null;
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
        style={{
          backgroundColor: getBackgroundColor(snackBarStatus),
          color: theme.palette.getContrastText(getBackgroundColor(snackBarStatus)),
        }}
        icon={getIcon(snackBarStatus)} // カスタムアイコンを使用
      >
        {snackBarMessage}
      </Alert>
    </Snackbar>
  );
}

export default UserHomeSnackBar;
