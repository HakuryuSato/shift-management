import React from "react";
import { Fab } from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AddIcon from "@mui/icons-material/Add";
import { useUserHomeFABStore } from "@stores/user/userHomeFABSlice";
import { useQRCodeReaderStore } from "@stores/user/qrcodeReaderSlice";

export function UserHomeFAB() {
  const { isUserHomeFABVisible, fabIconType, hideUserHomeFAB } =
    useUserHomeFABStore();
  const { showQRCodeReader } = useQRCodeReaderStore();

  if (!isUserHomeFABVisible) return null;

  const handleClick = () => {
    if (fabIconType === "qr") {
      showQRCodeReader();
      hideUserHomeFAB();
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
