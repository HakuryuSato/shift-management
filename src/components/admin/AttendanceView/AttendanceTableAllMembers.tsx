import React from "react";
import { useAttendanceTableAllMembersStore } from "@/stores/admin/attendanceTableAllMembersSlice";
import { useAttendanceTableAllMembers } from "@/hooks/admin/AttendanceView/TableAllMembers/useAttendanceTableAllMembers";
import { useAllMembersMonthlyTableClickHandlers } from "@/hooks/admin/AttendanceView/TableAllMembers/useAllMembersMonthlyTableClickHandlers";
import { TableStyleAttendanceAllMembers } from "@/styles/TableStyleAttendanceAllMembers";
import { TableCell, TableRow } from "@mui/material";
import { AttendanceTableAllMembersEmployeeNoCell } from "./TableAllMembers/AttendanceTableAllMembersEmployeeNoCell";
import { AttendanceTableAllMembersActionCell } from "./TableAllMembers/AttendanceTableAllMembersActionCell";
import {
  CommonAttendanceTable,
  TableHeader,
} from "./common/CommonAttendanceTable";

export function AttendanceTableAllMembers() {
  // カスタムフックを呼び出してデータを取得
  useAttendanceTableAllMembers();

  // Store からデータを取得
  const adminAttendanceTableAllMembersRows = useAttendanceTableAllMembersStore(
    (state) => state.adminAttendanceTableAllMembersRows,
  );

  // クリックハンドラーを取得
  const { handleClickUserName } = useAllMembersMonthlyTableClickHandlers();

  // テーブルヘッダー定義
  const headers: TableHeader[] = [
    { id: "employeeNo", label: "従業員番号" },
    { id: "name", label: "名前" },
    { id: "type", label: "種別" },
    { id: "workDays", label: "出勤日数" },
    { id: "workHours", label: "平日普通" },
    { id: "overtimeHours", label: "平日時間外" },
    { id: "actions", label: "操作" },
  ];

  // 行のレンダリング関数
  const renderRow = (
    {
      user,
      employeeNo,
      employmentTypeText,
      workDays,
      workHours,
      overtimeHours,
    }: any,
    index: number,
  ) => (
    <TableRow key={user.user_id}>
      <AttendanceTableAllMembersEmployeeNoCell
        employeeNo={employeeNo}
        rowIndex={index}
      />
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
      <TableCell>{employmentTypeText}</TableCell>
      <TableCell>{workDays}</TableCell>
      <TableCell>{workHours.toFixed(1)}</TableCell>
      <TableCell>{overtimeHours.toFixed(1)}</TableCell>
      <AttendanceTableAllMembersActionCell rowIndex={index} />
    </TableRow>
  );

  return (
    <CommonAttendanceTable
      TableStyleComponent={TableStyleAttendanceAllMembers}
      headers={headers}
      rows={adminAttendanceTableAllMembersRows || []}
      renderRow={renderRow}
      isLoading={!adminAttendanceTableAllMembersRows}
    />
  );
}
