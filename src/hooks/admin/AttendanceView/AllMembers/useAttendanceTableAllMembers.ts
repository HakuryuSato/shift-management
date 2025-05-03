import { useEffect } from 'react';
import { useAdminHomeStore } from '@/stores/admin/adminHomeSlice';
import { useAdminAttendanceViewStore } from '@/stores/admin/adminAttendanceViewSlice';
import { useAttendanceTableAllMembersStore } from '@/stores/admin/attendanceTableAllMembersSlice';
import type { Attendance } from '@/types/Attendance';

export const useAttendanceTableAllMembers = () => {
    const adminHomeUsersData = useAdminHomeStore((state) => state.adminHomeUsersData);
    const adminAttendanceViewAllMembersMonthlyResult = useAdminAttendanceViewStore(
        (state) => state.adminAttendanceViewAllMembersMonthlyResult
    );

    const setAdminAttendanceTableAllMembersRows = useAttendanceTableAllMembersStore(
        (state) => state.setAdminAttendanceTableAllMembersRows
    );

    // adminHomeUsersData または adminAttendanceViewAllMembersMonthlyResult が更新されたときに処理を実行
    useEffect(() => {
        if (!Array.isArray(adminHomeUsersData) || !Array.isArray(adminAttendanceViewAllMembersMonthlyResult)) {
            setAdminAttendanceTableAllMembersRows([]);
            return;
        }

        // user_id をキーにまとめる
        const resultsByUserId = adminAttendanceViewAllMembersMonthlyResult.reduce<{
            [key: string]: Attendance[];
        }>((acc, result) => {
            if (result.user_id == null) return acc;
            const key = result.user_id.toString();
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(result);
            return acc;
        }, {});

        const adminAttendanceTableAllMembersRows = adminHomeUsersData
            .filter(user =>
                user.user_id != null &&
                user.user_name != null &&
                user.employment_type != null
            )
            .map((user) => {
                // まとめておいた配列を参照してユーザーごとに集計
                const userResults = resultsByUserId[user.user_id!.toString()] ?? [];

                // stamp_startと_endがある場合のみ出勤日数としてカウント
                const workDays = userResults.filter(
                    result => (result.stamp_start_time && result.stamp_end_time)
                ).length;
                const totalWorkMinutes = userResults.reduce(
                    (sum: number, result: Attendance) => sum + (result.work_minutes ?? 0),
                    0
                );
                const totalOvertimeMinutes = userResults.reduce(
                    (sum: number, result: Attendance) => sum + (result.overtime_minutes ?? 0),
                    0
                );

                // 分を時間に変換し、0.5単位で丸める
                const workHours = Math.round((totalWorkMinutes / 60) * 2) / 2;
                const overtimeHours = Math.round((totalOvertimeMinutes / 60) * 2) / 2;

                return {
                    user,
                    employeeNo: user.employee_no
                        ? user.employee_no.toString().padStart(4, "0")
                        : "",
                    employmentTypeText: user.employment_type === 'full_time' ? "正社員" : "アルバイト",
                    workDays,
                    workHours,
                    overtimeHours,
                };
            });

        // 従業員番号で昇順にソート（値がないものは下に表示）
        const sortedRows = adminAttendanceTableAllMembersRows.sort((a, b) =>
            (!a.employeeNo ? 1 : !b.employeeNo ? -1 : parseInt(a.employeeNo, 10) - parseInt(b.employeeNo, 10))
        );

        setAdminAttendanceTableAllMembersRows(sortedRows);
    }, [
        adminHomeUsersData,
        adminAttendanceViewAllMembersMonthlyResult,
        setAdminAttendanceTableAllMembersRows,
    ]);
};
