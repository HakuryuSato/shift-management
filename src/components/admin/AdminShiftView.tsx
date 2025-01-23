"use client";

import { CustomFullCalendar } from "../common/CustomFullCalendar/CustomFullCalendar";
import { useAdminShiftViewStore } from "@/stores/admin/adminShiftViewSlice";

export const AdminShiftView: React.FC = () => {
    const isAdminShiftViewVisible = useAdminShiftViewStore((state) =>
        state.isAdminShiftViewVisible
    );

    return (
        <>
            {isAdminShiftViewVisible && <CustomFullCalendar />}
        </>
    );
};
