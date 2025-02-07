'use server';

import { updateAttendance } from './updateAttendance';
import { generateAttendanceWorkMinutes } from '@/utils/server/generateAttendanceWorkMinutes';
import type { Attendance } from '@/types/Attendance';

/**
 * 打刻時間の修正と勤務時間の再計算を行うサーバーアクション
 */
export async function updateAttendanceStamp(
  attendance: Partial<Attendance>
): Promise<Attendance> {
  // 必須パラメータのチェック
  if (!attendance.attendance_id || !attendance.stamp_start_time || !attendance.stamp_end_time) {
    throw new Error('Required parameters are missing.');
  }

  try {
    console.log("updateAttendanceStamp: 開始")

    // 勤務時間や残業時間を計算
    const workMinutesResult = await generateAttendanceWorkMinutes(attendance as Attendance);

    console.log("updateAttendanceStamp: generateAttendanceWorkMinutes完了")

    // 計算結果と打刻時間を合わせて更新
    const result = await updateAttendance({
      attendance_id: attendance.attendance_id,
      stamp_start_time: attendance.stamp_start_time,
      stamp_end_time: attendance.stamp_end_time,
      work_date: attendance.work_date,
      adjusted_start_time: workMinutesResult.adjusted_start_time,
      adjusted_end_time: workMinutesResult.adjusted_end_time,
      work_minutes: workMinutesResult.work_minutes,
      overtime_minutes: workMinutesResult.overtime_minutes,
      rest_minutes: workMinutesResult.rest_minutes
    });

    return result[0];
  } catch (error) {
    console.error('Error generating attendance result in updateAttendanceStamp:', {
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    });
    throw error;
  }
}
