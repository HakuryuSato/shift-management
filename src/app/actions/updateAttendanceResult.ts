'use server';

import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';
import type { AttendanceResult } from '@/types/Attendance';

/**
 * 指定されたattendance_idの出勤結果を更新するサーバーアクション
 * @param attendanceData 更新する出勤データ（attendance_idを含む）
 * @returns 更新された出勤データ
 */
export async function updateAttendanceResult(attendanceData: AttendanceResult): Promise<AttendanceResult[]> {
  return await handleSupabaseRequest<AttendanceResult[]>(async (supabase) => {
    const { attendance_id, ...dataToUpdate } = attendanceData;
    return supabase
      .from('attendance_results')
      .update(dataToUpdate)
      .eq('attendance_id', attendance_id)
      .select();
  });
}
