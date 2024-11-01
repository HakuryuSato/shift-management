import React from "react";
import { Fab } from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AddIcon from "@mui/icons-material/Add";
import { useUserHomeFABStore } from "@stores/user/userHomeFABSlice";
import { useUserQrCodeReaderViewStore } from "@/stores/user/userQrCodeReaderViewSlice";

export function UserHomeFAB() {
  const { isUserHomeFABVisible, fabIconType, setIsUserHomeFABVisible } =
    useUserHomeFABStore();
  const { showQRCodeReader } = useUserQrCodeReaderViewStore();

  if (!isUserHomeFABVisible) return null;

  const handleClick = () => {
    if (fabIconType === "qr") {
      showQRCodeReader();
      setIsUserHomeFABVisible(false);
    } else if (fabIconType === "plus") {
      // シフト追加用
    }
  };

  return (
    <Fab
      color="primary"
      onClick={handleClick}
      sx={{ position: "fixed", bottom: 16, right: 16 }}
    >
      {fabIconType === "qr" ? <QrCodeIcon /> : <AddIcon />}
    </Fab>
  );
}
