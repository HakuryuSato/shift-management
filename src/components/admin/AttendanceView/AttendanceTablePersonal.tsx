import React from "react";
import { usePersonalAttendanceTableData } from "@/hooks/admin/AttendanceView/usePersonalAttendanceTableData";
import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { TableStyleAttendancePersonal } from "@/styles/TableStyleAttendancePersonal";
import { AttendanceTablePersonalHoursCell } from "./TablePersonal/AttendanceTablePersonalHourCell";
import { AttendanceTablePersonalStampsCell } from "./TablePersonal/AttendanceTablePersonalTimeCell";
import { AttendanceTablePersonalActionCell } from "./TablePersonal/AttendanceTablePersonalActionCell";
import { usePersonalAttendanceTableClickHandlers } from "@/hooks/admin/AttendanceView/usePersonalAttendanceTableClickHandlers";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";

export function AttendanceTablePersonal() {
  // 個人用出退勤データをStoreにセット
  usePersonalAttendanceTableData();

  // storeの値を取得
  const { 
    AttendanceTablePersonalTableRows, 
    AttendanceTablePersonalEditingRow,
    setAttendanceTablePersonalEditingRow
  } = useAttendanceTablePersonalStore();

  // ハンドラー取得
  const {
    editingCell,
    handleClickWorkTimeCell,
    handleBlurWorkTimeCell,
    handleChangeStampTime,
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
          <TableCell>操作</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {AttendanceTablePersonalTableRows.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.formattedDate}</TableCell>

            {AttendanceTablePersonalEditingRow?.rowIndex === index ? (
              <>
                {/* 打刻時間(開始-終了) */}
                <AttendanceTablePersonalStampsCell
                  startTime={row.stampStartTime}
                  endTime={row.stampEndTime}
                  rowIndex={index}
                  onTimeChange={handleChangeStampTime}
                />
                
                <TableCell>
                  {row.adjustedStartTime} - {row.adjustedEndTime}
                </TableCell>

                {/* 平日普通(H) */}
                <AttendanceTablePersonalHoursCell
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
                {/* 平日時間外(H) */}
                <AttendanceTablePersonalHoursCell
                  value={row.overtimeHours}
                  rowIndex={index}
                  field="overtimeHours"
                  isEditing={
                    editingCell?.rowIndex === index &&
                    editingCell?.field === "overtimeHours"
                  }
                  onClick={handleClickWorkTimeCell}
                />
              </>
            ) : (
              <>
                <TableCell>
                  {row.stampStartTime} - {row.stampEndTime}
                </TableCell>
                <TableCell>
                  {row.adjustedStartTime} - {row.adjustedEndTime}
                </TableCell>
                <TableCell>{row.regularHours}</TableCell>
                <TableCell>{row.overtimeHours}</TableCell>
              </>
            )}
            <AttendanceTablePersonalActionCell
              rowIndex={index}
            />
          </TableRow>
        ))}
      </TableBody>
    </TableStyleAttendancePersonal>
  );
}
