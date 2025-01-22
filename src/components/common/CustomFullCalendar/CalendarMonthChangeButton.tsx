import React from "react";
import { Button } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useCalendarViewToggleStore } from "@/stores/user/calendarViewToggleSlice";
import { useTheme } from "@mui/material/styles";
import { useCalendarStates } from "@/hooks/common/CustomFullCalendar/useCalendarStates";

type CalendarMonthChangeButtonProps = {
  mode: "prev" | "next";
};

export const CalendarMonthChangeButton: React.FC<
  CalendarMonthChangeButtonProps
> = ({
  mode,
}) => {
  const { customFullCalendarRef } = useCalendarStates();
  
  const calendarViewMode = useCalendarViewToggleStore((state) =>
    state.calendarViewMode
  );

  const theme = useTheme();

  const handleClick = () => {
    if (customFullCalendarRef) {
      const api = customFullCalendarRef.getApi();
      if (mode === "prev") {
        api.prev();
      } else {
        api.next();
      }
    }
  };

  return (
    <Button
      variant="contained"
      onClick={handleClick}
      startIcon={mode === "prev" ? <ChevronLeft /> : <ChevronRight />}
      sx={{
        backgroundColor: calendarViewMode === "ATTENDANCE"
          ? theme.palette.secondary.main
          : theme.palette.primary.main,
        "&:hover": calendarViewMode === "ATTENDANCE"
          ? { backgroundColor: theme.palette.secondary.dark }
          : undefined,
      }}
    />
  );
};
