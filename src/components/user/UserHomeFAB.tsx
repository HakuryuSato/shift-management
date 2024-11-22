import React from "react";
import { Fab } from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import { useUserHomeFABStore } from "@stores/user/userHomeFABSlice";
import { useUserHomeFABClickHandlers } from "@/hooks/user/useUserHomeFABClickHandlers";

export function UserHomeFAB() {

  // State
  const isUserHomeFABVisible = useUserHomeFABStore((state) =>
    state.isVisibleUserHomeFAB
  );
  const fabIconType = useUserHomeFABStore((state) => state.fabIconType);

  // ClickHandler
  const { handleClickUserHomeFAB } = useUserHomeFABClickHandlers();

  if (!isUserHomeFABVisible) return null;

  return (
    <Fab
      color="primary"
      onClick={handleClickUserHomeFAB}
      sx={{ position: "fixed", bottom: 16, right: 16 }}
    >
      {fabIconType === "qr" ? <QrCodeIcon /> : <CalendarMonth />}
    </Fab>
  );
}
