import React from "react";
import { usePersonalAttendanceTableData } from "@/hooks/admin/AttendanceView/usePersonalAttendanceTableData";
import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { TableStyleAttendancePersonal } from "@/styles/TableStyleAttendancePersonal";
import { AttendanceTablePersonalEditableCell } from "./TablePersonal/AttendanceTablePersonalHourCell";
import { AttendanceTablePersonalTimeCell } from "./TablePersonal/AttendanceTablePersonalTimeCell";
import { AttendanceTablePersonalActionCell } from "./TablePersonal/AttendanceTablePersonalActionCell";
import { usePersonalAttendanceTableClickHandlers } from "@/hooks/admin/AttendanceView/usePersonalAttendanceTableClickHandlers";
import { useAttendanceTablePersonalStore } from "@/stores/admin/attendanceTablePersonalSlice";

export function AttendanceTablePersonal() {
  // 個人用出退勤データをStoreにセット
  usePersonalAttendanceTableData();

  // storeの値を取得
  const { 
    AttendanceTablePersonalTableRows, 
    editingRowIndex,
    setEditingRowIndex,
    setAttendanceTablePersonalEditingCell 
  } = useAttendanceTablePersonalStore();

  // ハンドラー取得
  const {
    editingCell,
    handleClickWorkTimeCell,
    handleBlurWorkTimeCell,
    handleChangeStampTime,
  } = usePersonalAttendanceTableClickHandlers();

  const handleSave = (index: number) => {
    // TODO: 保存処理を実装
    console.log('Save row:', index);
    setEditingRowIndex(null);
    setAttendanceTablePersonalEditingCell(null);
  };

  const handleDelete = (index: number) => {
    // TODO: 削除処理を実装
    console.log('Delete row:', index);
    setEditingRowIndex(null);
    setAttendanceTablePersonalEditingCell(null);
  };

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

            {editingRowIndex === index ? (
              <>
                {/* 打刻時間(開始-終了) */}
                <AttendanceTablePersonalTimeCell
                  startTime={row.stampStartTime}
                  endTime={row.stampEndTime}
                  rowIndex={index}
                  onTimeChange={handleChangeStampTime}
                />
                
                <TableCell>
                  {row.adjustedStartTime} - {row.adjustedEndTime}
                </TableCell>

                {/* 平日普通(H) */}
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
                {/* 平日時間外(H) */}
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
              onSave={() => handleSave(index)}
              onDelete={() => handleDelete(index)}
            />
          </TableRow>
        ))}
      </TableBody>
    </TableStyleAttendancePersonal>
  );
}
