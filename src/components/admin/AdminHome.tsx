"use client";
import { AdminAttendanceView } from "./AttendanceView/AdminAttendanceView";
import { AdminHomeTopBar } from "./AdminHomeTopBar";

export const AdminHome: React.FC = () => {
    return (
        <>
            <AdminHomeTopBar />
            <AdminAttendanceView />
        </>
    );
};
