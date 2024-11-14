// src/components/admin/AttendanceView/PersonalAttendanceTable.tsx
import React from "react";
import { useAdminAttendanceViewStore } from "@/stores/admin/adminAttendanceViewSlice";
import { useAdminAttendanceViewStamps } from "@/hooks/admin/useAdminAttendanceViewStamps";
import { usePersonalAttendanceTableClickHandlers } from "@/hooks/admin/usePersonalAttendanceTableClickHandlers";
import { usePersonalAttendanceTableData } from "@/hooks/admin/usePersonalAttendanceTableData";
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { AttendanceRow } from "@/types/Attendance";
import { TableStyle } from "@/styles/TableStyle";

export function PersonalAttendanceTable() {
  const {
    adminAttendanceViewSelectedUser,
  } = useAdminAttendanceViewStore();

  // 打刻データを取得するカスタムフックを呼び出す
  useAdminAttendanceViewStamps();

  // クリックハンドラーを取得
  const { handleBack } = usePersonalAttendanceTableClickHandlers();

  // テーブルデータを取得
  const { rows, setRows } = usePersonalAttendanceTableData();

  // 編集ボタンのハンドラー
  const handleEditClick = (index: number) => {
    setRows((prevRows) => {
      const newIsEditable = !prevRows[index].isEditable;
      const updatedRows = prevRows.map((row, idx) =>
        idx === index ? { ...row, isEditable: newIsEditable } : row
      );

      if (!newIsEditable) {
        // 編集モード終了時にデータをコンソールに表示
        console.log("Edited row data:", updatedRows[index]);
      }

      return updatedRows;
    });
  };

  // 行のデータ変更ハンドラー
  const handleRowChange = (
    index: number,
    field: keyof AttendanceRow,
    value: string,
  ) => {
    setRows((prevRows) =>
      prevRows.map((row, idx) =>
        idx === index ? { ...row, [field]: value } : row
      )
    );
  };

  if (!adminAttendanceViewSelectedUser) {
    return <div>ユーザーが選択されていません。</div>;
  }

  return (
    <>
      <Button variant="outlined" onClick={handleBack}>
        戻る
      </Button>
      <h2>{adminAttendanceViewSelectedUser.user_name}さんの出退勤データ</h2>
      <TableContainer component={Paper}>
        <TableStyle>
          <TableHead>
            <TableRow>
              <TableCell>日付</TableCell>
              <TableCell>平日普通(H)</TableCell>
              <TableCell>平日時間外(H)</TableCell>
              <TableCell>開始</TableCell>
              <TableCell>終了</TableCell>
              <TableCell>休憩</TableCell>
              <TableCell>打刻開始</TableCell>
              <TableCell>打刻終了</TableCell>
              <TableCell>編集</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  {row.isEditable
                    ? (
                      <input
                        type="number"
                        value={row.regularHours}
                        step="0.5"
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "regularHours",
                            e.target.value,
                          )}
                      />
                    )
                    : (
                      row.regularHours
                    )}
                </TableCell>
                <TableCell>
                  {row.isEditable
                    ? (
                      <input
                        type="number"
                        value={row.overtimeHours}
                        step="0.5"
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "overtimeHours",
                            e.target.value,
                          )}
                      />
                    )
                    : (
                      row.overtimeHours
                    )}
                </TableCell>
                <TableCell>
                  {row.isEditable
                    ? (
                      <input
                        type="time"
                        value={row.startTime}
                        onChange={(e) =>
                          handleRowChange(index, "startTime", e.target.value)}
                      />
                    )
                    : (
                      row.startTime
                    )}
                </TableCell>
                <TableCell>
                  {row.isEditable
                    ? (
                      <input
                        type="time"
                        value={row.endTime}
                        onChange={(e) =>
                          handleRowChange(index, "endTime", e.target.value)}
                      />
                    )
                    : (
                      row.endTime
                    )}
                </TableCell>
                <TableCell>
                  {row.isEditable
                    ? (
                      <input
                        type="number"
                        value={row.breakHours}
                        step="0.5"
                        onChange={(e) =>
                          handleRowChange(
                            index,
                            "breakHours",
                            e.target.value,
                          )}
                      />
                    )
                    : (
                      row.breakHours
                    )}
                </TableCell>
                <TableCell>{row.stampStartTime}</TableCell>
                <TableCell>{row.stampEndTime}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(index)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableStyle>
      </TableContainer>
    </>
  );
}
