"use client";

// ライブラリ
import React from "react";
import { Box, Button, ButtonGroup } from "@mui/material";


// Store
import { useCalendarViewToggleStore } from "@/stores/user/calendarViewToggleSlice";
import { useUserHomeFABStore } from "@/stores/user/userHomeFABSlice";

export function CalendarViewToggle() {
    const calendarViewMode = useCalendarViewToggleStore((state) =>
        state.calendarViewMode
    );
    const setCalendarViewModeToAttendance = useCalendarViewToggleStore((
        state,
    ) => state.setCalendarViewModeToAttendance);
    const setCalendarViewModeToPersonalShift = useCalendarViewToggleStore((
        state,
    ) => state.setCalendarViewModeToPersonalShift);
    const setCalendarViewModeToAllMembersShift = useCalendarViewToggleStore((
        state,
    ) => state.setCalendarViewModeToAllMembersShift);

    const setFABIconType = useUserHomeFABStore((state) => state.setFABIconType);
    const showUserHomeFAB = useUserHomeFABStore((state) =>
        state.showUserHomeFAB
    );
    const hideUserHomeFAB = useUserHomeFABStore((state) =>
        state.hideUserHomeFAB
    );

    return (
        <ButtonGroup variant="contained" sx={{ width: "100%" }}>
            {/* 出退勤 */}
            <Button
                variant={calendarViewMode === "ATTENDANCE"
                    ? "contained"
                    : "outlined"}
                onClick={() => {
                    setCalendarViewModeToAttendance();
                    showUserHomeFAB();
                    setFABIconType("qr");
                }}
                sx={{
                    flex: 1,
                    color: calendarViewMode === "ATTENDANCE"
                        ? "white"
                        : "secondary.main",
                    backgroundColor: calendarViewMode === "ATTENDANCE"
                        ? "secondary.main"
                        : "transparent",
                }}
            >
                出退勤
            </Button>

            {/* 個人シフト */}
            <Button
                variant={calendarViewMode === "PERSONAL_SHIFT"
                    ? "contained"
                    : "outlined"}
                onClick={() => {
                    setCalendarViewModeToPersonalShift();
                    showUserHomeFAB();
                    setFABIconType("calendar");
                }}
                sx={{ flex: 1 }}
            >
                シフト(個人)
            </Button>

            {/* 全員シフト */}
            <Button
                variant={calendarViewMode === "ALL_MEMBERS_SHIFT"
                    ? "contained"
                    : "outlined"}
                onClick={() => {
                    setCalendarViewModeToAllMembersShift();
                    hideUserHomeFAB();
                }}
                sx={{ flex: 1 }}
            >
                シフト(全員)
            </Button>
        </ButtonGroup>
    );
}
