"use client";

// ライブラリ
import React, { useState } from "react";
import { Button, ButtonGroup, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// Store
import { useCalendarViewToggleStore } from "@/stores/user/calendarViewToggleSlice";
import { useUserHomeFABStore } from "@/stores/user/userHomeFABSlice";

export function CalendarViewToggle() {
    const {
        CalendarViewMode,
        isShiftModeMenuOpen,
        openShiftModeMenu,
        closeShiftModeMenu,
        setCalendarViewModeToAttendance,
        setCalendarViewModeToShiftPersonal,
        setCalendarViewModeToShiftAllMembers,
    } = useCalendarViewToggleStore();

    const { setFABIconType } = useUserHomeFABStore();

    // やむを得ず以下Stateのみ残します（シフトのメニューボタン位置を調整する用途）
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return (
        <ButtonGroup variant="contained">
            <Button
                variant={
                    CalendarViewMode === "出退勤" ? "contained" : "outlined"
                }
                onClick={() => {
                    setCalendarViewModeToAttendance(); // 修正ポイント
                    setFABIconType("qr");
                }}
            >
                出退勤
            </Button>
            <Button
                variant={
                    CalendarViewMode.includes("シフト")
                        ? "contained"
                        : "outlined"
                }
                onClick={(event) => {
                    setAnchorEl(event.currentTarget);

                    openShiftModeMenu();
                }}
                endIcon={<ArrowDropDownIcon />}
            >
                {CalendarViewMode.includes("シフト")
                    ? CalendarViewMode
                    : "シフト"}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={isShiftModeMenuOpen}
                onClose={() => {
                    closeShiftModeMenu();
                }}
            >
                <MenuItem
                    onClick={() => {
                        setCalendarViewModeToShiftPersonal();
                        closeShiftModeMenu();
                        setFABIconType("plus");
                    }}
                >
                    個人
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        setCalendarViewModeToShiftAllMembers();
                        closeShiftModeMenu();
                        setFABIconType("plus");
                    }}
                >
                    全員
                </MenuItem>
            </Menu>
        </ButtonGroup>
    );
}
