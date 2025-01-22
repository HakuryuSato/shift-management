import React from "react";
import { Button } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useCalendarViewToggleStore } from "@/stores/user/calendarViewToggleSlice";
import { useTheme } from "@mui/material/styles";

type CalendarMonthChangeButtonProps = {
  mode: "prev" | "next";
  onClick: () => void; // クリック時のイベント
};

export const CalendarMonthChangeButton: React.FC<
  CalendarMonthChangeButtonProps
> = ({
  mode,
  onClick,
}) => {
  
  const calendarViewMode = useCalendarViewToggleStore((state) =>
    state.calendarViewMode
  );

  const theme = useTheme();

  return (
    <Button
      variant="contained"
      onClick={onClick}
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
