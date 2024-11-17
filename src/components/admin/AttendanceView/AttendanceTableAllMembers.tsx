import React, { useEffect } from "react";
import { useAdminHomeStore } from "@/stores/admin/adminHomeSlice";
import { useAdminHomeUsersData } from "@/hooks/admin/useAdminHomeUsersData";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { useAdminAttendanceViewResult } from "@/hooks/admin/AttendanceView/useAdminAttendanceViewResult";
import { useAllMembersMonthlyTableClickHandlers } from "@/hooks/admin/AttendanceView/useAllMembersMonthlyTableClickHandlers";
import { useAdminAttendanceViewStamps } from "@/hooks/admin/AttendanceView/useAdminAttendanceViewStamps";
import { TableStyleAttendanceAllMembers } from "@/styles/TableStyleAttendanceAllMembers";
import {
  getCurrentMonthSpecificDate,
  getPreviousMonthSpecificDate,
} from "@/utils/common/dateUtils";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export function AttendanceTableAllMembers() {
  // ユーザー情報を取得するカスタムフックを呼び出す
  useAdminHomeUsersData();
  const adminHomeUsersData = useAdminHomeStore((state) =>
    state.adminHomeUsersData
  );

  // 日付範囲の状態を取得
  const {
    setAdminAttendanceViewDateRange,
    adminAttendanceViewAllMembersMonthlyResult,
  } = useAdminAttendanceViewStore();

  // 出退勤データを取得するカスタムフックを呼び出す
  useAdminAttendanceViewResult();

  // 打刻データを取得するカスタムフックを呼び出す
  useAdminAttendanceViewStamps();

  // クリックハンドラーを取得
  const { handleClickUserName } = useAllMembersMonthlyTableClickHandlers();

  useEffect(() => {
    // 先月の26日 0時
    const startDate = getPreviousMonthSpecificDate(26, 0, 0, 0);
    // 今月の25日 23時59分59秒
    const endDate = getCurrentMonthSpecificDate(25, 23, 59, 59);

    // 状態を更新
    setAdminAttendanceViewDateRange(startDate, endDate);
  }, [setAdminAttendanceViewDateRange]);

  if (!adminHomeUsersData || !adminAttendanceViewAllMembersMonthlyResult) {
    return <div>Loading...</div>;
  }

  // ユーザーごとにデータを集計
  const userAttendanceData = adminHomeUsersData.map((user) => {
    const userResults = adminAttendanceViewAllMembersMonthlyResult.filter(
      (result) => result.attendance_stamps?.user_id === user.user_id,
    );

    const workDays = userResults.length;

    const totalWorkMinutes = userResults.reduce(
      (sum, result) => sum + (result.work_minutes ?? 0),
      0,
    );

    const totalOvertimeMinutes = userResults.reduce(
      (sum, result) => sum + (result.overtime_minutes ?? 0),
      0,
    );

    // 分を時間に変換し、0.5単位で丸め、少数第一位まで表示
    const workHours = Math.round((totalWorkMinutes / 60) * 2) / 2;
    const overtimeHours = Math.round((totalOvertimeMinutes / 60) * 2) / 2;

    return {
      user,
      workDays,
      workHours,
      overtimeHours,
    };
  });

  return (
    <TableStyleAttendanceAllMembers>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>種別</TableCell>
            <TableCell>名前</TableCell>
            <TableCell>出勤日数</TableCell>
            <TableCell>出勤時数</TableCell>
            <TableCell>時間外時数</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {userAttendanceData.map((
            { user, workDays, workHours, overtimeHours },
          ) => (
            <TableRow key={user.user_id}>
              <TableCell>
                {user.employment_type === "full_time" ? "正社員" : "アルバイト"}
              </TableCell>
              <TableCell>
                <span
                  onClick={() => handleClickUserName(user)}
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  {user.user_name}
                </span>
              </TableCell>
              <TableCell>{workDays}</TableCell>
              <TableCell>{workHours.toFixed(1)}</TableCell>
              <TableCell>{overtimeHours.toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableStyleAttendanceAllMembers>
  );
}
