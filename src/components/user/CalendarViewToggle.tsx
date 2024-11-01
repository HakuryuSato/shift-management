"use client";

// ライブラリ
import React from "react";
import { Box, Button, ButtonGroup } from "@mui/material";

// Store
import { useCalendarViewToggleStore } from "@/stores/user/calendarViewToggleSlice";
import { useUserHomeFABStore } from "@/stores/user/userHomeFABSlice";

export function CalendarViewToggle() {
    const {
        calendarViewMode,
        setCalendarViewModeToAttendance,
        setCalendarViewModeToPersonalShift,
        setCalendarViewModeToAllMembersShift,
    } = useCalendarViewToggleStore();

    const { setFABIconType } = useUserHomeFABStore();

    return (
        <ButtonGroup variant="contained" sx={{ width: "100%" }}>
            <Button
                variant={calendarViewMode === "ATTENDANCE"
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
                variant={calendarViewMode === "PERSONAL_SHIFT"
                    ? "contained"
                    : "outlined"}
                onClick={() => {
                    setCalendarViewModeToPersonalShift();
                    setFABIconType("plus");
                }}
                sx={{ flex: 1 }}
            >
                シフト(個人)
            </Button>
            <Button
                variant={calendarViewMode === "ALL_MEMBERS_SHIFT"
                    ? "contained"
                    : "outlined"}
                onClick={() => {
                    setCalendarViewModeToAllMembersShift();
                    setFABIconType("plus");
                }}
                sx={{ flex: 1 }}
            >
                シフト(全員)
            </Button>
        </ButtonGroup>
    );
}
