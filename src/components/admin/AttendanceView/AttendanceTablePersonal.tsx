import { usePersonalAttendanceTableData } from "@/hooks/admin/AttendanceView/Personal/usePersonalAttendanceTableData";
import {
  TableCell,
  TableRow,
} from "@mui/material";
import { TableStyleAttendancePersonal } from "@/styles/TableStyleAttendancePersonal";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { PersonalHoursCell } from "./Personal/PersonalHoursCell";
import { PersonalStampsCell } from "./Personal/PersonalStampsCell";
import { PersonalActionCell } from "./Personal/PersonalActionCell";
import { PersonalRemarksCell } from "./Personal/PersonalRemarksCell";
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
    { id: "remarks", label: "備考" },
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
            <PersonalStampsCell
              startTime={row.stampStartTime}
              endTime={row.stampEndTime}
              rowIndex={index}
            />

            <TableCell>
              {row.adjustedStartTime} - {row.adjustedEndTime}
            </TableCell>

            <PersonalHoursCell
              value={row.regularHours}
              rowIndex={index}
              field="regularHours"
            />
            <PersonalHoursCell
              value={row.overtimeHours}
              rowIndex={index}
              field="overtimeHours"
            />
            <PersonalRemarksCell
              value={row.remarks}
              rowIndex={index}
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
            <TableCell>{row.remarks}</TableCell>
          </>
        )}
        
        <PersonalActionCell
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
