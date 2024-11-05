"use client";

// ライブラリ
import React from "react";
import { Grid } from "@mui/material";

// コンポーネント
import { CustomFullCalendar } from "@/components/common/CustomFullCalendar/CustomFullCalendar";
import { CalendarViewToggle } from "@components/user/CalendarViewToggle";

// Store
import { useUserCalendarViewStore } from "@stores/user/userCalendarViewSlice";
import { useUserHomeStore } from "@/stores/user/userHomeSlice";


export function UserCalendarView() {
  const isUserCalendarViewVisible = useUserCalendarViewStore((state) =>
    state.isUserCalendarViewVisible
  );
  const employmentType = useUserHomeStore((state) => state.employmentType);

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
      {/* 正社員は出退勤モードのみ */}
      {employmentType !== "full_time" && <CalendarViewToggle />}
      <CustomFullCalendar />
    </Grid>
  );
}
