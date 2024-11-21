// src/utils/client/downloadAttendanceTableAllMembersXlsx.ts
import type { AttendanceRowAllMembers } from '@/types/Attendance';
import { createWorkbook, addTableToWorksheet, saveWorkbook } from './excelUtils';

export const downloadAttendanceTableAllMembersXlsx = async (
  attendanceRows: AttendanceRowAllMembers[],
  fileName: string
) => {
  const tableData = generateAttendanceAllMembersTableData(attendanceRows);

  const workbook = createWorkbook();
  const worksheet = workbook.addWorksheet('全員出退勤表');

  addTableToWorksheet(worksheet, tableData);

  await saveWorkbook(workbook, fileName);
};

const generateAttendanceAllMembersTableData = (
  attendanceRows: AttendanceRowAllMembers[],
): string[][] => {
  const result: string[][] = [];

  // ヘッダー行
  const headers = ['種別', '名前', '出勤日数', '出勤時数', '時間外時数'];
  result.push(headers);

  // データ行
  attendanceRows.forEach((row) => {
    // employment_type が undefined の場合に備えてデフォルト値を設定
    const employmentTypeValue = row.user.employment_type ?? 'unknown';
    const employmentType =
      employmentTypeValue === 'full_time'
        ? '正社員'
        : employmentTypeValue === 'part_time'
        ? 'アルバイト'
        : '不明';

    // user_name が undefined の場合に備えてデフォルト値を設定
    const userName = row.user.user_name ?? '';

    result.push([
      employmentType,
      userName,
      row.workDays.toString(),
      row.workHours.toFixed(1),
      row.overtimeHours.toFixed(1),
    ]);
  });

  return result;
};
