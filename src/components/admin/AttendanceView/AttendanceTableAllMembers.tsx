import React from "react";
import { useAttendanceTableAllMembersStore } from "@/stores/admin/attendanceTableAllMembersSlice";
import { useAttendanceTableAllMembers } from "@/hooks/admin/AttendanceView/useAttendanceTableAllMembers";
import { useAllMembersMonthlyTableClickHandlers } from "@/hooks/admin/AttendanceView/useAllMembersMonthlyTableClickHandlers";
import { TableStyleAttendanceAllMembers } from "@/styles/TableStyleAttendanceAllMembers";
import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { TableStyleHeader } from "@/styles/TableStyleHeader";

export function AttendanceTableAllMembers() {
  // カスタムフックを呼び出してデータを取得
  useAttendanceTableAllMembers();

  // Store からデータを取得
  const adminAttendanceTableAllMembersRows = useAttendanceTableAllMembersStore(
    (state) => state.adminAttendanceTableAllMembersRows,
  );

  // クリックハンドラーを取得
  const { handleClickUserName } = useAllMembersMonthlyTableClickHandlers();

  if (!adminAttendanceTableAllMembersRows) {
    return <div>Loading...</div>;
  }

  return (
    <TableStyleAttendanceAllMembers>
      <TableHead>
        <TableRow>
          <TableCell sx={TableStyleHeader}>従業員番号</TableCell>
          <TableCell sx={TableStyleHeader}>名前</TableCell>
          <TableCell sx={TableStyleHeader}>種別</TableCell>
          <TableCell sx={TableStyleHeader}>出勤日数</TableCell>
          <TableCell sx={TableStyleHeader}>平日普通</TableCell>
          <TableCell sx={TableStyleHeader}>平日時間外</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {adminAttendanceTableAllMembersRows.map(
          ({ user, employeeNo, employmentTypeText, workDays, workHours, overtimeHours }) => (
            <TableRow key={user.user_id}>
              <TableCell>
                {employeeNo}
              </TableCell>

              <TableCell>
                <span
                  onClick={() =>
                    handleClickUserName(user)}
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  {user.user_name}
                </span>
              </TableCell>
              <TableCell>
                {employmentTypeText}
              </TableCell>
              <TableCell>{workDays}</TableCell>
              <TableCell>{workHours.toFixed(1)}</TableCell>
              <TableCell>{overtimeHours.toFixed(1)}</TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </TableStyleAttendanceAllMembers>
  );
}
