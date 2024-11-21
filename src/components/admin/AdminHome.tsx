"use client";
import { AdminAttendanceView } from "./AttendanceView/AdminAttendanceView";
import { AdminHomeTopBar } from "./AdminHomeTopBar";

import { useAdminHomeUsersData } from "@/hooks/admin/useAdminHomeUsersData";

export const AdminHome: React.FC = () => {
    // ユーザー情報を取得するカスタムフックを呼び出す
    useAdminHomeUsersData();
    
    return (
        <>
            <AdminHomeTopBar />
            <AdminAttendanceView />
        </>
    );
};
