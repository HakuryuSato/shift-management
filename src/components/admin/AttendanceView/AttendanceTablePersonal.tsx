import React from "react";
import { usePersonalAttendanceTableData } from "@/hooks/admin/AttendanceView/usePersonalAttendanceTableData";
import { TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
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
  const AttendanceTablePersonalTableRows = useAttendanceTablePersonalStore(state => state.AttendanceTablePersonalTableRows);
  const AttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(state => state.AttendanceTablePersonalEditingRow);

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
                />
                
                <TableCell>
                  {row.adjustedStartTime} - {row.adjustedEndTime}
                </TableCell>

                {/* 平日普通(H) */}
                <TableCell>
                  <TextField
                    type="number"
                    inputProps={{
                      step: "0.5",
                      style: {
                        textAlign: "center",
                        padding: "0",
                        fontSize: "0.8rem",
                      },
                    }}
                    value={row.regularHours}
                    onChange={}
                    variant="standard"
                    size="small"
                  />
                </TableCell>
                {/* 平日時間外(H) */}
                <TableCell>
                  <TextField
                    type="number"
                    inputProps={{
                      step: "0.5",
                      style: {
                        textAlign: "center",
                        padding: "0",
                        fontSize: "0.8rem",
                      },
                    }}
                    value={row.overtimeHours}
                    onChange={}
                    variant="standard"
                    size="small"
                  />
                </TableCell>
              </>
            ) : (
              <>
                <TableCell>
                  {row.stampStartTime} - {row.stampEndTime}
                </TableCell>
                <TableCell>
                  {row.adjustedStartTime} - {row.adjustedEndTime}
                </TableCell>
                <AttendanceTablePersonalHoursCell
                  value={row.regularHours}
                  rowIndex={index}
                  field="regularHours"
                />
                <AttendanceTablePersonalHoursCell
                  value={row.overtimeHours}
                  rowIndex={index}
                  field="overtimeHours"
                />
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
