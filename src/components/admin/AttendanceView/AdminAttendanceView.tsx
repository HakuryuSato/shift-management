"use client";
import { useAdminHomeStore } from "@/stores/admin/adminHomeSlice";
import { AttendanceTableAllMembers } from "./AttendanceTableAllMembers";
import { AttendanceTablePersonal } from "./AttendanceTablePersonal";
import { useAdminAttendanceView } from "@/hooks/admin/AttendanceView/useAdminAttendanceView";
import { useAttendanceHolidays } from "@/hooks/admin/AttendanceView/useAttendanceHolidays";
import { useAdminAttendanceViewClosingDate } from "@/hooks/admin/AttendanceView/useAdminAttendanceViewClosingDate";
import { useAdminAttendanceViewDateRange } from "@/hooks/admin/AttendanceView/useAdminAttendanceViewDateRange";

export const AdminAttendanceView: React.FC = () => {
    // 締め日を取得
    useAdminAttendanceViewClosingDate();
    // 締め日から日付範囲を設定
    useAdminAttendanceViewDateRange();
    // 日付範囲から出退勤データを取得
    useAdminAttendanceView();
    // 祝日データを取得
    useAttendanceHolidays();

    const adminHomeMode = useAdminHomeStore((state) => state.adminHomeMode);

    return (
        <>
            {adminHomeMode === 'MONTHLY_ATTENDANCE' && <AttendanceTableAllMembers />}
            {adminHomeMode === 'PERSONAL_ATTENDANCE' && <AttendanceTablePersonal />}
        </>
    );
};
