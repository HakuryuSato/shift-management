import React from "react";
import { Box, Grid } from "@mui/material";
import { CustomFullCalendar } from "@/components/common/CustomFullCalendar/CustomFullCalendar";
import { CalendarViewToggle } from "@components/user/CalendarViewToggle";
import { useUserCalendarViewStore } from "@stores/user/userCalendarViewSlice"; 
import { useSession } from "next-auth/react";
import type { CustomNextAuthUser } from "@/customTypes/CustomNextAuthUser";

declare module "next-auth" {
  interface Session {
    user: CustomNextAuthUser;
  }
}

export function UserCalendarView() {
  const { isUserCalendarViewVisible } = useUserCalendarViewStore();
  const { data: session } = useSession();
  const employment_type = session?.user?.employment_type;


  if (!isUserCalendarViewVisible) {
    return null;
  }

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "auto" }}
    >
      <CalendarViewToggle />
      <CustomFullCalendar />
    </Grid>
  );
}
