import React from "react";
import { Box, Grid } from "@mui/material";
import { CustomFullCalendar } from "@components/common/CustomFullCalendar";
import { CalendarViewToggle } from "@components/user/CalendarViewToggle";
import { useUserCalendarViewStore } from "@stores/user/userCalendarViewSlice"; 

export function UserCalendarView() {
  const { isUserCalendarViewVisible } = useUserCalendarViewStore();
  if (!isUserCalendarViewVisible) {
    return null; // 非表示の場合は何もレンダリングしない
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "auto" }}
    >
      <CustomFullCalendar />
      <CalendarViewToggle />
    </Grid>
  );
}
