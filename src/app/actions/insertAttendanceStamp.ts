'use server';

import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import type { AttendanceStamp } from '@/types/Attendance';

/**
 * 出勤時間を挿入するサーバーアクション
 * @param userId ユーザーID
 * @param startTime 開始時間（Dateオブジェクト）
 */
export async function insertAttendanceStamp(userId: number, startTimeISO: string): Promise<AttendanceStamp[]> {
  
  return await handleSupabaseRequest<AttendanceStamp[]>(async (supabase) => {
    return supabase
      .from('attendance_stamps')
      .insert({
        user_id: userId,
        start_time: startTimeISO,
      })
      .select();
  });
}
