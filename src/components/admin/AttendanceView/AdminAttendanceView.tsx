"use client";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { AttendanceTableAllMembers } from "./AttendanceTableAllMembers";
import { AttendanceTablePersonal } from "./AttendanceTablePersonal";

export const AdminAttendanceView: React.FC = () => {
    const {
        isVisibleAllMembersMonthlyTable,
        isVisiblePersonalAttendanceTable,
    } = useAdminAttendanceViewStore();
    return (
        <>
            {isVisibleAllMembersMonthlyTable && <AttendanceTableAllMembers />}
            {isVisiblePersonalAttendanceTable && <AttendanceTablePersonal />}
        </>
    );
};
