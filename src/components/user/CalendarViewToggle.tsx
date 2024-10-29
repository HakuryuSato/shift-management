"use client";

// ライブラリ
import React from "react";
import { Box, Button, ButtonGroup } from "@mui/material";

// Store
import { useCalendarViewToggleStore } from "@/stores/user/calendarViewToggleSlice";
import { useUserHomeFABStore } from "@/stores/user/userHomeFABSlice";

export function CalendarViewToggle() {
    const {
        CalendarViewMode,
        setCalendarViewModeToAttendance,
        setCalendarViewModeToShiftPersonal,
        setCalendarViewModeToShiftAllMembers,
    } = useCalendarViewToggleStore();

    const { setFABIconType } = useUserHomeFABStore();

    return (
        <ButtonGroup variant="contained" sx={{ width: "100%" }}>
            <Button
                variant={CalendarViewMode === "出退勤"
                    ? "contained"
                    : "outlined"}
                onClick={() => {
                    setCalendarViewModeToAttendance();
                    setFABIconType("qr");
                }}
                sx={{ flex: 1 }}
            >
                出退勤
            </Button>
            <Button
                variant={CalendarViewMode === "シフト(個人)"
                    ? "contained"
                    : "outlined"}
                onClick={() => {
                    setCalendarViewModeToShiftPersonal();
                    setFABIconType("plus");
                }}
                sx={{ flex: 1 }}
            >
                シフト(個人)
            </Button>
            <Button
                variant={CalendarViewMode === "シフト(全員)"
                    ? "contained"
                    : "outlined"}
                onClick={() => {
                    setCalendarViewModeToShiftAllMembers();
                    setFABIconType("plus");
                }}
                sx={{ flex: 1 }}
            >
                シフト(全員)
            </Button>
        </ButtonGroup>
    );
}
