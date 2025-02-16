import { usePersonalAttendanceTableData } from "@/hooks/admin/AttendanceView/usePersonalAttendanceTableData";
import { TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { TableStyleAttendancePersonal } from "@/styles/TableStyleAttendancePersonal";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { AttendanceTablePersonalHoursCell } from "./TablePersonal/AttendanceTablePersonalHoursCell";
import { AttendanceTablePersonalStampsCell } from "./TablePersonal/AttendanceTablePersonalStampsCell";
import { AttendanceTablePersonalActionCell } from "./TablePersonal/AttendanceTablePersonalActionCell";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";

export function AttendanceTablePersonal() {
  // 個人用出退勤データをStoreにセット
  usePersonalAttendanceTableData();

  // storeの値を取得
  const AttendanceTablePersonalTableRows = useAttendanceTablePersonalStore(state => state.AttendanceTablePersonalTableRows);
  const AttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(state => state.AttendanceTablePersonalEditingRow);
  const AttendanceTablePersonalRowStyles = useAttendanceTablePersonalStore(state => state.AttendanceTablePersonalRowStyles);
  const holidays = useAdminAttendanceViewStore(state => state.adminAttendanceViewHolidaysMap);

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
          <TableRow 
            key={index}
            sx={AttendanceTablePersonalRowStyles[row.formattedDate]}
          >
            <TableCell>
              {row.formattedDate}
              {holidays?.get(row.formattedDate) && (
                <>
                  <br />
                  {holidays.get(row.formattedDate)?.title}
                </>
              )}
            </TableCell>


            {AttendanceTablePersonalEditingRow?.rowIndex === index ? (
            // 編集
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
            ) : (
              // 表示のみ
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
