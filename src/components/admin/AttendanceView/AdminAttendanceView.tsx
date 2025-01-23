"use client";
import { useAdminHomeStore } from "@/stores/admin/adminHomeSlice";
import { AttendanceTableAllMembers } from "./AttendanceTableAllMembers";
import { AttendanceTablePersonal } from "./AttendanceTablePersonal";
import { useAdminAttendanceView } from "@/hooks/admin/AttendanceView/useAdminAttendanceView";

export const AdminAttendanceView: React.FC = () => {
    useAdminAttendanceView();

    const adminHomeMode = useAdminHomeStore((state) => state.adminHomeMode);

    return (
        <>
            {adminHomeMode === 'MONTHLY_ATTENDANCE' && <AttendanceTableAllMembers />}
            {adminHomeMode === 'PERSONAL_ATTENDANCE' && <AttendanceTablePersonal />}
        </>
    );
};
