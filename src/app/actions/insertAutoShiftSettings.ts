'use server';

import { handleSupabaseRequest } from '@/utils/server/handleSupabaseRequest';


/**
 * 新しい出勤データを挿入するサーバーアクション
 * @param attendanceData 挿入する出勤データ
 * @returns 挿入された出勤データ
 */
export async function insertAttendance(attendanceData: Partial<Attendance>): Promise<Attendance[]> {
  return await handleSupabaseRequest<Attendance[]>(async (supabase) => {
    return supabase
      .from('attendances')
      .insert(attendanceData)
      .select();
  });
}