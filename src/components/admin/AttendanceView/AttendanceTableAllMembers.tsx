import React from "react";
import { useAttendanceTableAllMembersStore } from "@/stores/admin/attendanceTableAllMembersSlice";
import { useAttendanceTableAllMembers } from "@/hooks/admin/AttendanceView/useAttendanceTableAllMembers";
import { useAllMembersMonthlyTableClickHandlers } from "@/hooks/admin/AttendanceView/useAllMembersMonthlyTableClickHandlers";
import { TableStyleAttendanceAllMembers } from "@/styles/TableStyleAttendanceAllMembers";
import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";


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
          <TableCell>種別</TableCell>
          <TableCell>名前</TableCell>
          <TableCell>出勤日数</TableCell>
          <TableCell>出勤時数</TableCell>
          <TableCell>時間外時数</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {adminAttendanceTableAllMembersRows.map(
          ({ user, workDays, workHours, overtimeHours }) => (
            <TableRow key={user.user_id}>
              <TableCell>
                {user.employment_type === "full_time" ? "正社員" : "アルバイト"}
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
