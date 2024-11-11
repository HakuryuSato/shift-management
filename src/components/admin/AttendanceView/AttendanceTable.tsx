import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

interface EmployeeWorkData {
  name: string;
  dailyWork: {
    [date: string]: {
      startTime: string;
      endTime: string;
    };
  };
}

interface EmployeeTotals {
  name: string;
  overtimeHours: number;
  regularHours: number;
}

function parseTime(timeStr: string): number {
  const [hoursStr, minutesStr] = timeStr.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  return hours + minutes / 60;
}

function getHoursDifference(startTime: string, endTime: string): number {
  let start = parseTime(startTime);
  let end = parseTime(endTime);
  if (end < start) {
    // 終了時間が翌日にまたがる場合の処理
    end += 24;
  }
  return end - start;
}

function getDateRange(): string[] {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0から始まる

  // 先月の26日から今月の25日までの日付リストを作成
  const startDate = new Date(currentYear, currentMonth - 1, 26);
  const endDate = new Date(currentYear, currentMonth, 25);

  const dates: string[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1; // 1から始まる
  const day = date.getDate();
  return `${month}/${day}`;
}

export function AttendanceTable() {
  const dateRange = getDateRange();

  const today = new Date();
  const monthLabel = `${today.getMonth() + 1}月`;

  // 従業員を20名に増やす、名前は4文字から5文字
  const employees: EmployeeWorkData[] = [];

  const userNames = [
    "山田太郎",
    "佐藤花子",
    "鈴木一郎",
    "高橋二郎",
    "田中美穂",
    "伊藤真一",
    "渡辺陽子",
    "山本達也",
    "中村美紀",
    "小林優子",
    "加藤信二",
    "吉田舞子",
    "佐々木健",
    "山口智子",
    "松本大輔",
    "井上陽水",
    "木村拓哉",
    "林修造",
    "斎藤茂",
    "清水宏",
  ];

  userNames.forEach((name) => {
    employees.push({
      name,
      dailyWork: {},
    });
  });

  // モックデータ生成
  employees.forEach((employee) => {
    dateRange.forEach((date) => {
      // 70%の確率で労働時間を設定
      if (Math.random() < 0.7) {
        employee.dailyWork[date] = {
          startTime: "08:30",
          endTime: "18:00",
        };
      }
      // データがない場合は何もしない（セルは空白）
    });
  });

  const employeeTotals: EmployeeTotals[] = employees.map((employee) => ({
    name: employee.name,
    overtimeHours: 0,
    regularHours: 0,
  }));

  const dateTotals: { [date: string]: number } = {};
  dateRange.forEach((date) => {
    dateTotals[date] = 0;
  });

  employees.forEach((employee, index) => {
    dateRange.forEach((date) => {
      const work = employee.dailyWork[date];
      if (work) {
        const hoursWorked = getHoursDifference(work.startTime, work.endTime);
        // 8時間以下を通常時間、超過分を時間外として計算
        const regularHours = Math.min(hoursWorked, 8);
        const overtimeHours = Math.max(hoursWorked - 8, 0);

        employeeTotals[index].regularHours += regularHours;
        employeeTotals[index].overtimeHours += overtimeHours;

        dateTotals[date] += hoursWorked;
      }
    });
  });

  // 小数点第一位まで表示するために、合計時間を調整
  employeeTotals.forEach((total) => {
    total.regularHours = parseFloat(total.regularHours.toFixed(1));
    total.overtimeHours = parseFloat(total.overtimeHours.toFixed(1));
  });

  Object.keys(dateTotals).forEach((date) => {
    dateTotals[date] = parseFloat(dateTotals[date].toFixed(1));
  });

  // テーブルのスタイル定義
  const StyledTable = styled(Table)(({ theme }) => ({
    // 共通
    "& th, & td": {
      border: "1px solid #ccc", // 全てのヘッダーとセルに罫線
      padding: "4px",
      textAlign: "center",
      fontSize: "0.8rem",
    },

    // ヘッダー
    "& th": {
      fontWeight: "bold",
      cursor: "default", // ヘッダーはクリック不可能
    },

    // データ
    "& td": {
      cursor: "pointer", // 全てのセルはクリック可能
    },

    // 偶数行に色を付ける
    "& tr:nth-of-type(even) td": {
      backgroundColor: theme.palette.action.hover,
    },

    // ヘッダーとデータの境界線は太めにする
    "& td:nth-of-type(2), & th:nth-of-type(2)": {
      // th,tdの2列目右
      borderRight: "2px solid #ccc",
    },
    "& tr:nth-of-type(3) th": {
      // thの3行目下
      borderBottom: "2px solid #ccc",
    },
  }));

  return (
    <TableContainer
      component={Paper}
      style={{ maxHeight: "90vh", overflow: "auto" }}
    >
      <StyledTable stickyHeader size="small">
        {/* ヘッダー行 */}
        <TableHead>
          {/* 1行目 */}
          <TableRow>
            <TableCell>{monthLabel}</TableCell>
            <TableCell>名前</TableCell>
            {employees.map((employee) => (
              <TableCell key={employee.name}>{employee.name}</TableCell>
            ))}
          </TableRow>

          {/* 2行目 */}
          <TableRow>
            <TableCell>-</TableCell>
            <TableCell>時間外(H)</TableCell>

            {employeeTotals.map((total) => (
              <TableCell key={total.name}>
                {total.overtimeHours.toFixed(1)}
              </TableCell>
            ))}
          </TableRow>
          {/* 3行目 */}
          <TableRow>
            <TableCell scope="col" component="th">
              日付
            </TableCell>
            <TableCell component="th">合計(H)</TableCell>
            {employeeTotals.map((total) => (
              <TableCell key={total.name}>
                {total.regularHours.toFixed(1)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {dateRange.map((date) => (
            <TableRow key={date}>
              <TableCell>{formatDate(date)}</TableCell>

              <TableCell>
                {dateTotals[date] > 0 ? dateTotals[date].toFixed(1) : ""}
              </TableCell>

              {employees.map((employee) => {
                const work = employee.dailyWork[date];
                const cellContent = work
                  ? `${work.startTime} - ${work.endTime}`
                  : "";
                return (
                  <TableCell
                    key={employee.name}
                    onClick={() => {
                      if (work) {
                        alert(
                          `従業員: ${employee.name}\n日付: ${formatDate(
                            date
                          )}\n時間: ${cellContent}`
                        );
                      }
                    }}
                    style={{ cursor: work ? "pointer" : "default" }}
                  >
                    {cellContent}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};
