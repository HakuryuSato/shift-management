import { AttendanceRowPersonal } from '@/types/Attendance';
import { createWorkbook, addTableToWorksheet, saveWorkbook } from './excelUtils';

export const downloadAttendanceTablePersonalXlsx = async (
  attendanceRows: AttendanceRowPersonal[],
  fileName: string
) => {
  const tableData = generateAttendancePersonalTableData(attendanceRows);

  const workbook = createWorkbook();
  const worksheet = workbook.addWorksheet('出退勤表');

  addTableToWorksheet(worksheet, tableData);

  await saveWorkbook(workbook, fileName);
};

const generateAttendancePersonalTableData = (attendanceRows: AttendanceRowPersonal[]): string[][] => {
  const result: string[][] = [];

  // ヘッダー行 - AttendanceTablePersonal.tsxと同じヘッダーを使用
  const headers = ['日付', '打刻時間(開始-終了)', '補正時間(開始-終了)', '平日普通(H)', '平日時間外(H)'];
  result.push(headers);

  // データ行 - AttendanceTablePersonal.tsxと同じ表示順序を使用
  attendanceRows.forEach((row) => {
    result.push([
      row.formattedDate,
      `${row.stampStartTime} - ${row.stampEndTime}`,
      `${row.adjustedStartTime} - ${row.adjustedEndTime}`,
      row.regularHours,
      row.overtimeHours,
    ]);
  });

  return result;
};
