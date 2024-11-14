"use client";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { AllMembersMonthlyTable } from "./AllMembersMonthlyTable";
import { PersonalAttendanceTable } from "./PersonalAttendanceTable";

export const AdminAttendanceView: React.FC = () => {
    const {
        isVisibleAllMembersMonthlyTable,
        isVisiblePersonalAttendanceTable,
    } = useAdminAttendanceViewStore();
    return (
        <>
            {isVisibleAllMembersMonthlyTable && <AllMembersMonthlyTable />}
            {isVisiblePersonalAttendanceTable && <PersonalAttendanceTable />}
        </>
    );
};
