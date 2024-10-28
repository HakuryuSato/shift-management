import React from "react";
import { Box, Grid } from "@mui/material";
import { CustomFullCalendar } from "@components/common/CustomFullCalendar";
import { CalendarViewToggle } from "@components/user/CalendarViewToggle";

export function UserCalendarView() {
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "50vh" }}
    >
      <Box>
        <CalendarViewToggle />
      </Box>
      <Box mt={2}>
        <CustomFullCalendar />
      </Box>
    </Grid>
  );
}
