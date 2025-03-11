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

  // ヘッダー行 - AttendanceTableAllMembers.tsxと同じヘッダーを使用
  const headers = ['従業員番号', '名前', '種別', '出勤日数', '平日普通', '平日時間外'];
  result.push(headers);

  // データ行 - AttendanceTableAllMembers.tsxと同じロジックを使用
  attendanceRows.forEach(({ user, employeeNo, employmentTypeText, workDays, workHours, overtimeHours }) => {
    result.push([
      employeeNo || '',
      user.user_name || '',
      employmentTypeText || (user.employment_type === 'full_time' ? '正社員' : 'アルバイト'),
      workDays.toString(),
      workHours.toFixed(1),
      overtimeHours.toFixed(1),
    ]);
  });

  return result;
};
