"use client";
// Component
import { AdminAttendanceView } from "./AttendanceView/AdminAttendanceView";
import { AdminHomeTopBar } from "./AdminHomeTopBar";
import { ModalContainer } from "../common/Modal/ModalContainer";
import { AdminUserManagementForm } from "./AttendanceView/AdminUserManagementForm";
import { AdminShiftView } from "./AdminShiftView";

// Hooks
import { useCommonHomeInitialize } from "@/hooks/common/useCommonHomeInitialize";
import { useAdminHomeUsersData } from "@/hooks/admin/useAdminHomeUsersData";

// Store
import { useAdminHomeStore } from "@/stores/admin/adminHomeSlice";

export const AdminHome: React.FC = () => {
    // ユーザー情報を取得するカスタムフックを呼び出す
    useAdminHomeUsersData();
    useCommonHomeInitialize("admin");

    const adminHomeMode = useAdminHomeStore((state) => state.adminHomeMode);

    return (
        <>
            <AdminHomeTopBar />
            <AdminUserManagementForm />
            <ModalContainer />
            {adminHomeMode === 'SHIFT' ? <AdminShiftView /> : <AdminAttendanceView />}
        </>
    );
};
