"use client";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { AttendanceTableAllMembers } from "./AttendanceTableAllMembers";
import { AttendanceTablePersonal } from "./AttendanceTablePersonal";
import { useAdminAttendanceView } from "@/hooks/admin/AttendanceView/useAdminAttendanceView";

export const AdminAttendanceView: React.FC = () => {
    useAdminAttendanceView();

    const isVisibleAllMembersMonthlyTable = useAdminAttendanceViewStore(
        (state) => state.isVisibleAllMembersMonthlyTable,
    );
    const isVisiblePersonalAttendanceTable = useAdminAttendanceViewStore(
        (state) => state.isVisiblePersonalAttendanceTable,
    );

    return (
        <>
            {isVisibleAllMembersMonthlyTable && <AttendanceTableAllMembers />}
            {isVisiblePersonalAttendanceTable && <AttendanceTablePersonal />}
        </>
    );
};
