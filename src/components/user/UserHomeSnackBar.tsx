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

  return (
    <Snackbar
      open={isUserSnackBarVisible}
      autoHideDuration={3000} // 3秒で自動的に消える
      onClose={hideUserSnackBar}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      
    >
      <Alert onClose={hideUserSnackBar} severity={snackBarStatus}>
        {snackBarMessage}
      </Alert>
    </Snackbar>
  );
}

export default UserHomeSnackBar;
