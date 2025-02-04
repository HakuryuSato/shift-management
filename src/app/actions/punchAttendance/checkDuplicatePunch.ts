'use server';

import type { Attendance } from '@/types/Attendance';

/**
 * 重複打刻をチェックする
 * @returns 重複している場合は既存のデータを返し、そうでない場合はnullを返す
 */
export async function checkDuplicatePunch(
  existingAttendance: Attendance,
  currentTime: string
): Promise<Attendance[] | null> {
  // stamp_start_timeが存在することは呼び出し元で確認済み
  const startDateTime = new Date(existingAttendance.stamp_start_time as string);
  const currentDateTime = new Date(currentTime);
  
  // ミリ秒単位での差分を計算し、時間に変換
  const timeDiffInHours = Math.abs(currentDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
  
  // 1時間以内の重複打刻の場合
  if (timeDiffInHours < 1) {
    console.log(`1時間以内の重複打刻を検知 user_id=${existingAttendance.user_id} attendance_id=${existingAttendance.attendance_id}`);
    return [existingAttendance];
  }
  
  return null;
}
