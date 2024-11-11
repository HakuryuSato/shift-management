import React from "react";
import { Fab } from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AddIcon from "@mui/icons-material/Add";
import { useUserHomeFABStore } from "@stores/user/userHomeFABSlice";
import { useUserQrCodeReaderViewStore } from "@/stores/user/userQrCodeReaderViewSlice";
import { useUserCalendarViewStore } from "@/stores/user/userCalendarViewSlice";
import { useUserHomeAppBarStore } from "@/stores/user/userHomeAppBarSlice";

export function UserHomeFAB() {
  const isUserHomeFABVisible = useUserHomeFABStore((state) =>
    state.isUserHomeFABVisible
  );
  const fabIconType = useUserHomeFABStore((state) => state.fabIconType);
  const setIsUserHomeFABVisible = useUserHomeFABStore((state) =>
    state.setIsUserHomeFABVisible
  );
  const showQRCodeReader = useUserQrCodeReaderViewStore((state) =>
    state.showQRCodeReader
  );
  const setIsUserCalendarViewVisible = useUserCalendarViewStore((state) =>
    state.setIsUserCalendarViewVisible
  );
  const hideUserHomeAppBar = useUserHomeAppBarStore((state)=>state.hideUserHomeAppBar)


  if (!isUserHomeFABVisible) return null;

  const handleClick = () => {
    if (fabIconType === "qr") {
      showQRCodeReader();
      setIsUserHomeFABVisible(false);
      setIsUserCalendarViewVisible(false);
      hideUserHomeAppBar()
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
