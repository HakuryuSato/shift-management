import { usePersonalAttendanceTableData } from "@/hooks/admin/AttendanceView/TablePersonal/usePersonalAttendanceTableData";
import {
  TableCell,
  TableRow,
} from "@mui/material";
import { TableStyleAttendancePersonal } from "@/styles/TableStyleAttendancePersonal";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { AttendanceTablePersonalHoursCell } from "./TablePersonal/AttendanceTablePersonalHoursCell";
import { AttendanceTablePersonalStampsCell } from "./TablePersonal/AttendanceTablePersonalStampsCell";
import { AttendanceTablePersonalActionCell } from "./TablePersonal/AttendanceTablePersonalActionCell";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";
import { CommonAttendanceTable, TableHeader } from "./common/CommonAttendanceTable";

export function AttendanceTablePersonal() {
  // 個人用出退勤データをStoreにセット
  usePersonalAttendanceTableData();

  // storeの値を取得
  const AttendanceTablePersonalTableRows = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalTableRows,
  );
  const AttendanceTablePersonalEditingRow = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalEditingRow,
  );
  const AttendanceTablePersonalRowStyles = useAttendanceTablePersonalStore(
    (state) => state.AttendanceTablePersonalRowStyles,
  );
  const holidays = useAdminAttendanceViewStore((state) =>
    state.adminAttendanceViewHolidaysMap
  );

  // テーブルヘッダー定義
  const headers: TableHeader[] = [
    { id: "date", label: "日付" },
    { id: "stampTime", label: "打刻時間(開始-終了)" },
    { id: "adjustedTime", label: "補正時間(開始-終了)" },
    { id: "regularHours", label: "平日普通(H)" },
    { id: "overtimeHours", label: "平日時間外(H)" },
    { id: "actions", label: "操作" },
  ];

  // 行のレンダリング関数
  const renderRow = (row: any, index: number) => {
    const isEditing = AttendanceTablePersonalEditingRow?.rowIndex === index;
    
    return (
      <TableRow
        key={index}
        sx={AttendanceTablePersonalRowStyles[row.date]}
      >
        <TableCell>
          {row.formattedDate}
          {holidays?.get(row.date) && ` ${holidays.get(row.date)?.title}`}
        </TableCell>

        {isEditing ? (
          // 編集モード
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
          // 表示モード
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
    );
  };

  return (
    <CommonAttendanceTable
      TableStyleComponent={TableStyleAttendancePersonal}
      headers={headers}
      rows={AttendanceTablePersonalTableRows}
      renderRow={renderRow}
    />
  );
}
