import React from "react";
import { usePersonalAttendanceTableData } from "@/hooks/admin/AttendanceView/usePersonalAttendanceTableData";
import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { TableStyleAttendancePersonal } from "@/styles/TableStyleAttendancePersonal";
import { AttendanceTablePersonalEditableCell } from "./AttendanceTablePersonalEditableCell";
import { AttendanceTablePersonalTimeCell } from "./AttendanceTablePersonalTimeCell";
import { usePersonalAttendanceTableClickHandlers } from "@/hooks/admin/AttendanceView/usePersonalAttendanceTableClickHandlers";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";

export function AttendanceTablePersonal() {
  // 個人用出退勤データをStoreにセット
  usePersonalAttendanceTableData();

  // storeの値を取得
  const AttendanceTablePersonalTableRows = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalTableRows
  );

  // ハンドラー取得
  const {
    editingCell,
    handleClickWorkTimeCell,
    handleBlurWorkTimeCell,
    handleTimeChange,
  } = usePersonalAttendanceTableClickHandlers();



  return (
    <TableStyleAttendancePersonal>
      <TableHead>
        <TableRow>
          <TableCell>日付</TableCell>
          <TableCell>打刻時間(開始-終了)</TableCell>
          <TableCell>補正時間(開始-終了)</TableCell>
          <TableCell>平日普通(H)</TableCell>
          <TableCell>平日時間外(H)</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {AttendanceTablePersonalTableRows.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.formattedDate}</TableCell>
            <AttendanceTablePersonalTimeCell
              startTime={row.stampStartTime}
              endTime={row.stampEndTime}
              rowIndex={index}
              onTimeChange={handleTimeChange}
            />
            <TableCell>
              {row.adjustedStartTime} - {row.adjustedEndTime}
            </TableCell>
            <AttendanceTablePersonalEditableCell
              value={row.regularHours}
              rowIndex={index}
              field="regularHours"
              isEditing={
                editingCell?.rowIndex === index &&
                editingCell?.field === "regularHours"
              }
              onClick={handleClickWorkTimeCell}
              onBlur={handleBlurWorkTimeCell}
            />
            <AttendanceTablePersonalEditableCell
              value={row.overtimeHours}
              rowIndex={index}
              field="overtimeHours"
              isEditing={
                editingCell?.rowIndex === index &&
                editingCell?.field === "overtimeHours"
              }
              onClick={handleClickWorkTimeCell}
              onBlur={handleBlurWorkTimeCell}
            />
          </TableRow>
        ))}
      </TableBody>
    </TableStyleAttendancePersonal>
  );
}
