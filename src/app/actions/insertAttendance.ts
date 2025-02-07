'use server';

import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import type { Attendance } from '@/types/Attendance';

/**
 * 新しい出勤データを挿入するサーバーアクション
 * @param attendanceData 挿入する出勤データ
 * @param attendanceData.user_id ユーザーID (必須)
 * @param attendanceData.work_date 勤務日 YYYY-MM-DD形式 (必須)
 * @param attendanceData.stamp_start_time 打刻開始時間 (stamp_start_timeまたはstamp_end_timeのいずれかが必須)
 * @param attendanceData.stamp_end_time 打刻終了時間 (stamp_start_timeまたはstamp_end_timeのいずれかが必須)
 * @returns 挿入された出勤データ
 * @throws {Error} 必須フィールドが不足している場合
 */
export async function insertAttendance(attendanceData: Partial<Attendance>): Promise<Attendance[]> {
  // 必須フィールドのチェック
  if (!attendanceData.user_id || !attendanceData.work_date) {
    throw new Error('Required fields missing: user_id and work_date are required');
  }

  // 少なくとも1つの打刻時間が必要
  if (!attendanceData.stamp_start_time && !attendanceData.stamp_end_time) {
    throw new Error('Required fields missing: either stamp_start_time or stamp_end_time is required');
  }

  return await handleSupabaseRequest<Attendance[]>(async (supabase) => {
    return supabase
      .from('attendances')
      .insert(attendanceData)
      .select();
  });
}
