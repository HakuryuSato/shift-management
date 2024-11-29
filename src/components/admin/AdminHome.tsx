"use client";
// Component
import { AdminAttendanceView } from "./AttendanceView/AdminAttendanceView";
import { AdminHomeTopBar } from "./AdminHomeTopBar";
import { ModalContainer } from "../common/Modal/ModalContainer";


// Hooks
import { useCommonHomeInitialize } from "@/hooks/user/useCommonHomeInitialize";
import { useAdminHomeUsersData } from "@/hooks/admin/useAdminHomeUsersData";

export const AdminHome: React.FC = () => {
    // ユーザー情報を取得するカスタムフックを呼び出す
    useAdminHomeUsersData();
    useCommonHomeInitialize('admin')

    return (
        <>
            <AdminHomeTopBar />
            <ModalContainer />
            <AdminAttendanceView />
        </>
    );
};
