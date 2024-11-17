import React, { useState } from "react";
import { useAdminAttendanceViewStamps } from "@/hooks/admin/AttendanceView/useAdminAttendanceViewStamps";
import { usePersonalAttendanceTableData } from "@/hooks/admin/AttendanceView/usePersonalAttendanceTableData";
import { Paper, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { TableStylePersonalAttendance } from "@/styles/TableStylePersonalAttendance";
import { PersonalAttendanceTableEditableCell } from "./PersonalAttendanceTableEditableCell";

export function PersonalAttendanceTable() {
  // State
  const { rows, setRows,editingCell, setEditingCell } = usePersonalAttendanceTableData();

  // 個人の打刻データを取得
  useAdminAttendanceViewStamps();

  const handleCellChange = (rowIndex: number, field: string, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row, idx) =>
        idx === rowIndex ? { ...row, [field]: value } : row
      )
    );
    console.log(`Value changed in row ${rowIndex}, field ${field}`);
  };

  return (
    <>
      <h2>出退勤データ</h2>
      <TableContainer component={Paper}>
        <TableStylePersonalAttendance>
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
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.date}</TableCell>
                <PersonalAttendanceTableEditableCell
                  value={row.regularHours}
                  rowIndex={index}
                  field="regularHours"
                  isEditing={
                    editingCell?.rowIndex === index &&
                    editingCell?.field === "regularHours"
                  }
                  onClick={(rowIndex, field) =>
                    setEditingCell({ rowIndex, field })
                  }
                  onChange={handleCellChange}
                  onBlur={() => setEditingCell(null)}
                />
                <PersonalAttendanceTableEditableCell
                  value={row.overtimeHours}
                  rowIndex={index}
                  field="overtimeHours"
                  isEditing={
                    editingCell?.rowIndex === index &&
                    editingCell?.field === "overtimeHours"
                  }
                  onClick={(rowIndex, field) =>
                    setEditingCell({ rowIndex, field })
                  }
                  onChange={handleCellChange}
                  onBlur={() => setEditingCell(null)}
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
        </TableStylePersonalAttendance>
      </TableContainer>
    </>
  );
}
