import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';
import { AttendanceRow } from '@/types/Attendance';
import { createWorkbook, addTableToWorksheet, saveWorkbook } from './excelUtils';

export const downloadAttendanceTablePersonalXlsx = async (
  attendanceRows: AttendanceRow[],
  fileName: string
) => {
  const tableData = generateAttendancePersonalTableData(attendanceRows);

  const workbook = createWorkbook();
  const worksheet = workbook.addWorksheet('出退勤表');

  addTableToWorksheet(worksheet, tableData);

  await saveWorkbook(workbook, fileName);
};

const generateAttendancePersonalTableData = (attendanceRows: AttendanceRow[]): string[][] => {
  const result: string[][] = [];

  // ヘッダー行
  const headers = ['日付', '平日普通(H)', '平日時間外(H)', '打刻時間(開始-終了)', '補正時間(開始-終了)', '休憩時間'];
  result.push(headers);

  // データ行
  attendanceRows.forEach((row) => {
    result.push([
      row.formattedDate,
      row.regularHours,
      row.overtimeHours,
      `${row.stampStartTime} - ${row.stampEndTime}`,
      `${row.adjustedStartTime} - ${row.adjustedEndTime}`,
      row.breakHours,
    ]);
  });

  return result;
};
