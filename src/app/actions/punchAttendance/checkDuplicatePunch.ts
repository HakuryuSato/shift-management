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
  const startTimeStr = existingAttendance.stamp_start_time as string;
  
  // 文字列のまま比較（両方ともJST）
  const startTimeParts = startTimeStr.split(/[- :]/);
  const currentTimeParts = currentTime.split(/[- :]/);
  
  // 分単位での差分を計算
  const startMinutes = 
    parseInt(startTimeParts[3]) * 60 + // hour
    parseInt(startTimeParts[4]);       // minute
  
  const currentMinutes = 
    parseInt(currentTimeParts[3]) * 60 + // hour
    parseInt(currentTimeParts[4]);       // minute
  
  const timeDiffInMinutes = currentMinutes - startMinutes;
  
  // 2分以内の重複打刻の場合
  if (timeDiffInMinutes <= 2) {
    console.log(`2分以内の重複打刻を検知 user_id=${existingAttendance.user_id} attendance_id=${existingAttendance.attendance_id}`);
    return [existingAttendance];
  }
  
  return null;
}
