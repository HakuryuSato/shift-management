'use server';

import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import type { AttendanceStamp } from '@/types/Attendance';

/**
 * 退勤時間を更新するサーバーアクション
 * @param attendanceId 出勤記録のID
 * @param endTime 終了時間（Dateオブジェクト）
 */
export async function updateAttendanceStamp(attendanceId: number, endTimeISO: string): Promise<AttendanceStamp[]> {
  return await handleSupabaseRequest<AttendanceStamp[]>(async (supabase) => {
    return supabase
      .from('attendance_stamps')
      .update({ end_time: endTimeISO })
      .eq('attendance_id', attendanceId)
      .select();
  });
}
