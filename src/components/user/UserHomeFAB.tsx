import React from "react";
import { Fab } from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import { useUserHomeFABStore } from "@stores/user/userHomeFABSlice";
import { useUserQrCodeReaderViewStore } from "@/stores/user/userQrCodeReaderViewSlice";
import { useUserCalendarViewStore } from "@/stores/user/userCalendarViewSlice";
import { useUserHomeAppBarStore } from "@/stores/user/userHomeAppBarSlice";

import { useModalContainerStore } from "@/stores/common/modalContainerSlice";

export function UserHomeFAB() {
  const isUserHomeFABVisible = useUserHomeFABStore((state) =>
    state.isVisibleUserHomeFAB
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
    } else if (fabIconType === "calendar") {
      // シフト追加用
    }
  };

  return (
    <Fab
      color="primary"
      onClick={handleClick}
      sx={{ position: "fixed", bottom: 16, right: 16 }}
    >
      {fabIconType === "qr" ? <QrCodeIcon /> : <CalendarMonth />}
    </Fab>
  );
}
