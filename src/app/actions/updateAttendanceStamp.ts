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
    // 勤務時間や残業時間を計算
    const workMinutesResult = await generateAttendanceWorkMinutes(attendance as Attendance);

    // 計算結果と打刻時間を合わせて更新
    const result = await updateAttendance({
      ...workMinutesResult,
      stamp_start_time: attendance.stamp_start_time,
      stamp_end_time: attendance.stamp_end_time,
    });
    
    return result[0];
  } catch (error) {
    console.error('Error generating attendance result in updateAttendanceStamp:', error);
    throw new Error('打刻時間変更による集計でエラーが発生しました');
  }
}
