"use client";
import { AdminAttendanceView } from "./AttendanceView/AdminAttendanceView";
import { AdminHomeTopBar } from "./AdminHomeTopBar";
import { AdminHomeBottomBar } from "./AdminHomeBottomBar";

export const AdminHome: React.FC = () => {
    return (
        <>
            <AdminHomeTopBar />
            <AdminAttendanceView />
            <AdminHomeBottomBar />
        </>
    );
};
