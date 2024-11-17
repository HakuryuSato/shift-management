'use server';

import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import type { Attendance } from '@/types/Attendance';

/**
 * 出勤時間を更新または挿入するサーバーアクション
 * @param attendanceData 出勤データ
 * @returns 挿入または更新された出勤データ
 */
export async function upsertAttendanceResult(attendanceData: Attendance | Attendance[]): Promise<Attendance[]> {
  return await handleSupabaseRequest<Attendance[]>(async (supabase) => {
    const attendanceArray = Array.isArray(attendanceData) ? attendanceData : [attendanceData];
    return supabase
      .from('attendance_results')
      .upsert(attendanceArray, { onConflict: 'attendance_id' }) // 'attendance_id'をstring型で指定
      .select();
  });
}
