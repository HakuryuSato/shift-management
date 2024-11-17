import React from "react";
import { useAdminAttendanceViewStamps } from "@/hooks/admin/AttendanceView/useAdminAttendanceViewStamps";
import { usePersonalAttendanceTableData } from "@/hooks/admin/AttendanceView/usePersonalAttendanceTableData";
import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { TableStyleAttendancePersonal } from "@/styles/TableStyleAttendancePersonal";
import { AttendanceTablePersonalEditableCell } from "./AttendanceTablePersonalEditableCell";
import { usePersonalAttendanceTableClickHandlers } from "@/hooks/admin/AttendanceView/usePersonalAttendanceTableClickHandlers";
import { useAttendanceTablePersonalStore } from "@/stores/admin/AttendanceTablePersonalSlice";

export function AttendanceTablePersonal() {

  // storeの値を取得
  const { AttendanceTablePersonalTableRows } = useAttendanceTablePersonalStore((
    state,
  ) => state.AttendanceTablePersonalTableRows);

  // ハンドラー取得
  const {
    editingCell,
    handleClickCell,
    handleBlur,
  } = usePersonalAttendanceTableClickHandlers();

  // 打刻データの取得
  useAdminAttendanceViewStamps();

  return (
    <TableStyleAttendancePersonal>
      <TableHead>
        <TableRow>
          <TableCell>日付</TableCell>
          <TableCell>平日普通(H)</TableCell>
          <TableCell>平日時間外(H)</TableCell>
          <TableCell>打刻時間(開始-終了)</TableCell>
          <TableCell>補正時間(開始-終了)</TableCell>
          <TableCell>休憩時間</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {AttendanceTablePersonalTableRows.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.date}</TableCell>
            <AttendanceTablePersonalEditableCell
              value={row.regularHours}
              rowIndex={index}
              field="regularHours"
              isEditing={editingCell?.rowIndex === index &&
                editingCell?.field === "regularHours"}
              onClick={handleClickCell}
              onBlur={handleBlur}
            />
            <AttendanceTablePersonalEditableCell
              value={row.overtimeHours}
              rowIndex={index}
              field="overtimeHours"
              isEditing={editingCell?.rowIndex === index &&
                editingCell?.field === "overtimeHours"}
              onClick={handleClickCell}
              onBlur={handleBlur}
            />
            <TableCell>
              {row.stampStartTime} - {row.stampEndTime}
            </TableCell>
            <TableCell>
              {row.startTime} - {row.endTime}
            </TableCell>
            <TableCell>{row.breakHours}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableStyleAttendancePersonal>
  );
}
